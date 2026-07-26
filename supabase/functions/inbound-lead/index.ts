import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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

// Very basic email format check beyond what browsers do
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// Rate limit: simple in-memory store (resets per function cold start)
const recentIPs = new Map<string, number[]>();
const RATE_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT = 3; // max 3 submissions per IP per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (recentIPs.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS);
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
    const { email, messenger, website, budget, message, source, service, _ts } = body;

    // Required field
    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Missing email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Email format
    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Disposable email check
    if (isDisposable(email)) {
      // Silent reject — don't tell bots why it failed
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Time-gate: _ts should be within last 30 minutes and not in the future
    if (_ts) {
      const age = Date.now() - Number(_ts);
      if (age < 2000 || age > 30 * 60 * 1000) {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Forward to Telegram notification (if configured)
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

    let tgResult: unknown = null;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const lines = [
        `🔔 *New Lead — ${service ?? "vladenza.com"}*`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `📧 *Email:* ${email}`,
        messenger ? `💬 *Messenger:* ${messenger}` : null,
        website ? `🌐 *Website:* ${website}` : null,
        budget ? `💰 *Budget:* ${budget}` : null,
        message ? `📝 *Message:* ${message}` : null,
        `📍 *Source:* ${source ?? "unknown"}`,
        `━━━━━━━━━━━━━━━━━━━━`,
      ].filter(Boolean) as string[];

      const chatIds = TELEGRAM_CHAT_ID.split(",").map(id => id.trim()).filter(Boolean);

      const results = await Promise.all(
        chatIds.map(chat_id =>
          fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id,
              text: lines.join("\n"),
              parse_mode: "Markdown",
            }),
          }).then(r => r.json()).catch(() => ({}))
        )
      );
      tgResult = results;
      console.log("TG result:", JSON.stringify(tgResult));
    } else {
      tgResult = { skipped: true, token: !!TELEGRAM_BOT_TOKEN, chat: !!TELEGRAM_CHAT_ID };
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
