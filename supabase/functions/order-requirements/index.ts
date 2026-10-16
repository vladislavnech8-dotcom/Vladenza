import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { createHash } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip")?.trim() || "unknown";
}

async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  endpoint: string,
  identifier: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_endpoint: endpoint,
    p_identifier: identifier,
    p_limit: limit,
    p_window_ms: windowMs,
  });
  if (error) {
    console.error("Rate limit check failed:", error.message);
    return true;
  }
  return data === true;
}

async function verifyTurnstile(token: string, remoteip?: string): Promise<boolean> {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) return true; // fail open when not configured

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  if (remoteip) formData.append("remoteip", remoteip);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface RequirementEntry {
  placementId: string;
  targetUrl: string;
  anchor: string;
  niche?: string;
  notes?: string;
  willProvideLater?: boolean;
  letVladenzaRecommend?: boolean;
  cartItemId?: string;
  packageLabel?: string;
}

function buildPlacements(orderItems: OrderItem[]): { placementId: string; packageLabel: string; productId: string }[] {
  return orderItems.flatMap((item, itemIdx) => {
    const sections = [];
    for (let i = 0; i < item.quantity; i++) {
      sections.push({
        placementId: `${item.productId}-${itemIdx}-${i}`,
        packageLabel: item.name,
        productId: item.productId,
      });
    }
    return sections;
  });
}

/** Determine whether a single requirement entry is "complete" (has real data). */
function isComplete(r: RequirementEntry): boolean {
  return !r.willProvideLater &&
    !!r.targetUrl?.trim() &&
    (!!r.anchor?.trim() || !!r.letVladenzaRecommend);
}

function computeStatus(requirements: RequirementEntry[], placementCount: number) {
  if (requirements.length === 0) {
    return { requirementsStatus: "pending", orderStatus: "requirements_pending" };
  }

  const completed = requirements.filter(isComplete).length;
  const pending = placementCount - completed;

  if (pending === 0) {
    return { requirementsStatus: "received", orderStatus: "ready_for_review" };
  }
  if (completed === 0) {
    return { requirementsStatus: "pending", orderStatus: "requirements_pending" };
  }
  return { requirementsStatus: "partial", orderStatus: "requirements_pending" };
}

function mergeRequirements(
  existing: RequirementEntry[],
  incoming: RequirementEntry[],
  placementIds: string[],
): RequirementEntry[] {
  const existingMap = new Map<string, RequirementEntry>();
  for (const r of existing) {
    if (r.placementId) existingMap.set(r.placementId, r);
  }

  const result: RequirementEntry[] = [];
  for (const pid of placementIds) {
    const incomingEntry = incoming.find((r) => r.placementId === pid);
    const existingEntry = existingMap.get(pid);

    if (incomingEntry) {
      result.push({
        placementId: pid,
        targetUrl: incomingEntry.targetUrl ?? "",
        anchor: incomingEntry.anchor ?? "",
        niche: incomingEntry.niche ?? "",
        notes: incomingEntry.notes ?? "",
        willProvideLater: incomingEntry.willProvideLater ?? false,
        letVladenzaRecommend: incomingEntry.letVladenzaRecommend ?? false,
      });
    } else if (existingEntry) {
      result.push(existingEntry);
    } else {
      result.push({
        placementId: pid,
        targetUrl: "",
        anchor: "",
        niche: "",
        notes: "",
        willProvideLater: false,
        letVladenzaRecommend: false,
      });
    }
  }
  return result;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const clientIp = getClientIp(req);

  try {
    // Rate limit: 10 requests per minute per IP (GET is read, POST is write)
    const allowed = await checkRateLimit(supabase, "requirements", clientIp, 10, 60_000);
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const url = new URL(req.url);
    let token = url.searchParams.get("token");
    let postBody: { token?: string; requirements?: RequirementEntry[]; turnstileToken?: string } | null = null;

    if (req.method === "POST" || req.method === "PATCH" || req.method === "PUT") {
      postBody = await req.json();
      if (!token) token = postBody?.token;
    }

    if (!token || token.length < 16) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing token" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const tokenHash = hashToken(token);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, order_number, order_status, name, email, order_items, requirements, requirements_status, amount, currency, cart_snapshot, locale")
      .eq("requirements_token_hash", tokenHash)
      .maybeSingle();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired link" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const paidStatuses = ["paid", "ready_for_review", "requirements_pending", "in_progress", "completed"];
    if (!paidStatuses.includes(order.order_status)) {
      return new Response(
        JSON.stringify({ error: "This order has not been confirmed yet." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const orderItems = (order.order_items || []) as OrderItem[];
    const placements = buildPlacements(orderItems);
    const placementIds = placements.map((p) => p.placementId);
    const existingRequirements = ((order.requirements || []) as RequirementEntry[]).map((requirement, index) => ({
      ...requirement,
      placementId: requirement.placementId || placementIds[index],
    }));

    if (req.method === "GET") {
      const { requirementsStatus } = computeStatus(existingRequirements, placementIds.length);

      return new Response(
        JSON.stringify({
          success: true,
          orderNumber: order.order_number,
          placements,
          existingRequirements,
          requirementsStatus,
          customerName: order.name,
          locale: order.locale || "en",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (req.method === "POST" || req.method === "PATCH" || req.method === "PUT") {
      // Turnstile verification (fail open when not configured — verifyTurnstile returns true if no secret is set)
      const turnstileToken = postBody?.turnstileToken || "";
      const turnstileValid = await verifyTurnstile(turnstileToken, clientIp);
      if (!turnstileValid) {
        return new Response(
          JSON.stringify({ error: "Bot verification failed" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { requirements: incoming } = postBody as { requirements: RequirementEntry[] };

      if (!Array.isArray(incoming) || incoming.length === 0) {
        return new Response(
          JSON.stringify({ error: "No requirements provided." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const incomingIds = incoming.map((r) => r.placementId);
      if (new Set(incomingIds).size !== incomingIds.length || incomingIds.some((id) => !placementIds.includes(id))) {
        return new Response(
          JSON.stringify({ error: "Invalid placement data." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      for (const r of incoming) {
        if (!r.willProvideLater) {
          if (!r.targetUrl?.trim()) {
            return new Response(
              JSON.stringify({ error: "Target URL is required for placements not marked 'will provide later'." }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
          }
          if (!r.anchor?.trim() && !r.letVladenzaRecommend) {
            return new Response(
              JSON.stringify({ error: "Preferred anchor text is required, or select 'Let Vladenza recommend'." }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
          }
        }
      }

      const merged = mergeRequirements(existingRequirements, incoming, placementIds);
      const { requirementsStatus, orderStatus } = computeStatus(merged, placementIds.length);

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          requirements: merged,
          requirements_status: requirementsStatus,
          order_status: orderStatus,
        })
        .eq("id", order.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      const allComplete = requirementsStatus === "received";
      const orderLocale = String(order.locale || "en");

      // Send agency notification email
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      if (RESEND_API_KEY) {
        try {
          const reqSummary = merged.map((r, i) =>
            `  ${i + 1}. ${r.willProvideLater ? "(will provide later)" : `URL: ${r.targetUrl || "—"} | Anchor: ${r.anchor || (r.letVladenzaRecommend ? "(agency pick)" : "—")}${r.niche ? ` | Niche: ${r.niche}` : ""}${r.notes ? ` | Notes: ${r.notes}` : ""}`}`
          ).join("\n");

          const agencySubject = `Requirements ${allComplete ? "received" : "partially received"} — ${order.order_number}`;
          const agencyHtml = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f8f8f8;font-family:sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:24px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;max-width:600px;">
  <tr><td style="padding:32px 40px;">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;">Order Requirements ${allComplete ? "Received" : "Partially Received"}</h1>
    <p style="font-size:14px;color:#333;margin:0 0 8px;"><strong>Order:</strong> ${order.order_number}</p>
    <p style="font-size:14px;color:#333;margin:0 0 8px;"><strong>Customer:</strong> ${order.name || "—"}</p>
    <p style="font-size:14px;color:#333;margin:0 0 8px;"><strong>Email:</strong> ${order.email || "—"}</p>
    <p style="font-size:14px;color:#333;margin:0 0 16px;"><strong>Requirements status:</strong> ${requirementsStatus}</p>
    <h2 style="font-size:15px;color:#111;margin:0 0 8px;">Requirements Detail</h2>
    <pre style="font-size:13px;color:#555;line-height:1.6;white-space:pre-wrap;margin:0 0 16px;">${reqSummary}</pre>
    <p style="font-size:14px;margin:16px 0 0;"><a href="https://vladenza.com/admin" style="color:#F97316;">View in admin dashboard</a></p>
  </td></tr>
</table></td></tr></table></body></html>`;

          const agencyText = `Order Requirements ${allComplete ? "Received" : "Partially Received"}

Order: ${order.order_number}
Customer: ${order.name || "—"}
Email: ${order.email || "—"}
Requirements status: ${requirementsStatus}

Requirements Detail:
${reqSummary}

View in admin dashboard: https://vladenza.com/admin`;

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Vladenza Orders <info@vladenza.com>",
              to: "info@vladenza.com",
              reply_to: "info@vladenza.com",
              subject: agencySubject,
              html: agencyHtml,
              text: agencyText,
            }),
          });
        } catch (emailErr) {
          console.error("Agency notification email failed:", emailErr);
        }
      }

      const successMsgEn = allComplete
        ? "Requirements saved successfully."
        : "Requirements partially saved. You can return later to complete the remaining placements.";
      const successMsgUk = allComplete
        ? "Вимоги успішно збережено."
        : "Вимоги частково збережено. Ви можете повернутися пізніше, щоб завершити решту розміщень.";

      return new Response(
        JSON.stringify({
          success: true,
          message: orderLocale === "uk" ? successMsgUk : successMsgEn,
          requirementsStatus,
          allComplete,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("order-requirements error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
