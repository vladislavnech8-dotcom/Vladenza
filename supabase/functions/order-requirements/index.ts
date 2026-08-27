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
  niche: string;
  notes: string;
  willProvideLater: boolean;
}

/** Build the full list of placement slots from order_items. */
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
    !!r.anchor?.trim() &&
    !!r.niche?.trim();
}

/** Compute requirements_status and order_status from the requirements array. */
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

/** Merge incoming requirements into existing ones by placementId. */
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
      // Customer submitted this one — use the new data
      result.push({
        placementId: pid,
        targetUrl: incomingEntry.targetUrl ?? "",
        anchor: incomingEntry.anchor ?? "",
        niche: incomingEntry.niche ?? "",
        notes: incomingEntry.notes ?? "",
        willProvideLater: incomingEntry.willProvideLater ?? false,
      });
    } else if (existingEntry) {
      // Not in this submission — keep existing data
      result.push(existingEntry);
    } else {
      // No data yet — placeholder
      result.push({
        placementId: pid,
        targetUrl: "",
        anchor: "",
        niche: "",
        notes: "",
        willProvideLater: false,
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

  try {
    const url = new URL(req.url);
    let token = url.searchParams.get("token");
    let postBody: { token?: string; requirements?: RequirementEntry[] } | null = null;

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
      .select("id, order_number, order_status, name, email, order_items, requirements, requirements_status, amount, currency, cart_snapshot")
      .eq("requirements_token_hash", tokenHash)
      .single();

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

    // GET: return order info + existing requirements (always allow re-entry)
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
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // POST / PATCH / PUT: save (or merge) requirements
    if (req.method === "POST" || req.method === "PATCH" || req.method === "PUT") {
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

      // Validate incoming requirements that are NOT willProvideLater
      for (const r of incoming) {
        if (!r.willProvideLater) {
          if (!r.targetUrl?.trim()) {
            return new Response(
              JSON.stringify({ error: "Target URL is required for placements not marked 'will provide later'." }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
          }
          if (!r.anchor?.trim()) {
            return new Response(
              JSON.stringify({ error: "Preferred anchor text is required for placements not marked 'will provide later'." }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
          }
          if (!r.niche?.trim()) {
            return new Response(
              JSON.stringify({ error: "Website niche/topic is required for placements not marked 'will provide later'." }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
          }
        }
      }

      // Merge incoming with existing by placementId
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

      return new Response(
        JSON.stringify({
          success: true,
          message: allComplete
            ? "Requirements saved successfully."
            : "Requirements partially saved. You can return later to complete the remaining placements.",
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
