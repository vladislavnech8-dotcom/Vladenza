import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com","guerrillamail.com","10minutemail.com","trashmail.com",
  "yopmail.com","tempmail.com","throwam.com","sharklasers.com","guerrillamailblock.com",
  "grr.la","guerrillamail.info","guerrillamail.biz","guerrillamail.de","guerrillamail.net",
  "guerrillamail.org","spam4.me","fakeinbox.com","dispostable.com","maildrop.cc",
  "mailnull.com","spamgourmet.com","trashmail.at","tempr.email","discard.email",
  "spamhereplease.com","spamtrap.ro","0-mail.com","jetable.fr.nf","nomail.xl.cx",
  "mail.mezimages.net","spamfree24.org","spoofmail.de","powered.name","deadaddress.com",
]);

function isDisposable(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return DISPOSABLE_DOMAINS.has(domain);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const ip = getClientIp(req);

    // Persistent rate limiting: 3 leads per minute per IP
    const allowed = await checkRateLimit(supabase, "contact", ip, 3, 60_000);
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { email, messenger, website, budget, message, source, service, name, packageName, packageDetails, _ts, turnstileToken } = body;

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Missing email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (isDisposable(email)) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Honeypot timestamp check
    if (_ts) {
      const age = Date.now() - Number(_ts);
      if (age < 2000 || age > 30 * 60 * 1000) {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Turnstile verification
    if (!turnstileToken || typeof turnstileToken !== "string") {
      return new Response(JSON.stringify({ error: "Bot verification required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const turnstileValid = await verifyTurnstile(turnstileToken, ip);
    if (!turnstileValid) {
      return new Response(JSON.stringify({ error: "Bot verification failed" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const leadName = typeof name === "string" ? name : "";
    const leadMessenger = typeof messenger === "string" ? messenger : "";
    const leadWebsite = typeof website === "string" ? website : "";
    const leadBudget = typeof budget === "string" ? budget : "";
    const leadService = typeof service === "string" ? service : "General Inquiry";
    const leadPackage = typeof packageName === "string" ? packageName : "Quote Request";
    const leadPackageDetails = typeof packageDetails === "string" ? packageDetails : (typeof message === "string" ? message : "");
    const leadSource = typeof source === "string" ? source : "vladenza.com";

    const { error: dbError } = await supabase.from("leads").insert({
      name: leadName,
      email,
      messenger: leadMessenger,
      website: leadWebsite,
      service: leadService,
      package: leadPackage,
      package_details: leadPackageDetails,
      budget: leadBudget,
      source: leadSource,
    });

    if (dbError) {
      console.error("Lead insert error:", dbError);
      return new Response(JSON.stringify({ error: "Could not save lead" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const lines = [
        `🔔 *New Lead — ${leadService}*`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `📧 *Email:* ${email}`,
        leadName ? `👤 *Name:* ${leadName}` : null,
        leadMessenger ? `💬 *Messenger:* ${leadMessenger}` : null,
        leadWebsite ? `🌐 *Website:* ${leadWebsite}` : null,
        leadBudget ? `💰 *Budget:* ${leadBudget}` : null,
        leadPackageDetails ? `📝 *Details:* ${leadPackageDetails}` : null,
        `📍 *Source:* ${leadSource}`,
        `━━━━━━━━━━━━━━━━━━━━`,
      ].filter(Boolean) as string[];

      const chatIds = TELEGRAM_CHAT_ID.split(",").map((id) => id.trim()).filter(Boolean);

      await Promise.all(
        chatIds.map((chat_id) =>
          fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id,
              text: lines.join("\n"),
            }),
          }).then((r) => r.json()).catch(() => ({}))
        )
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("inbound-lead error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
