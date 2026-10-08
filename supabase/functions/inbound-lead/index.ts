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

const recentIPs = new Map<string, number[]>();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (recentIPs.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT) return true;
  timestamps.push(now);
  recentIPs.set(ip, timestamps);
  return false;
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

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { email, messenger, website, budget, message, source, service, name, packageName, packageDetails, _ts } = body;

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

    if (_ts) {
      const age = Date.now() - Number(_ts);
      if (age < 2000 || age > 30 * 60 * 1000) {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

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
              parse_mode: "Markdown",
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
