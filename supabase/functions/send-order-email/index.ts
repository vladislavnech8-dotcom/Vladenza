import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface CartSnapshot {
  items: OrderItem[];
  total: number;
  currency: string;
}

const FROM_NAME = "Vladenza Orders";
const FROM_EMAIL = "info@vladenza.com";
const REPLY_TO = "info@vladenza.com";
const SUPPORT_EMAIL = "info@vladenza.com";
const SITE_URL = "https://vladenza.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { orderRef } = body as { orderRef: string };

    if (!orderRef) {
      return new Response(
        JSON.stringify({ error: "Missing orderRef" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch the order with all data needed for the email
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, order_number, name, email, amount, currency, order_items, cart_snapshot, requirements_status, order_status, email_sent_at, requirements_token_hash")
      .eq("order_ref", orderRef)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Idempotency: if email already sent, skip
    if (order.email_sent_at) {
      console.log(`Email already sent for order ${orderRef}, skipping`);
      return new Response(
        JSON.stringify({ success: true, message: "Email already sent, skipping" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use cart_snapshot if available, otherwise fall back to order_items
    const cartSnapshot = order.cart_snapshot as CartSnapshot | null;
    const orderItems = (order.order_items || []) as OrderItem[];

    const itemsForEmail = cartSnapshot?.items || orderItems;
    const total = cartSnapshot?.total || Number(order.amount);
    const currency = cartSnapshot?.currency || String(order.currency || "USD");

    // Build item rows for email
    const itemRowsHtml = itemsForEmail
      .map(
        (item) =>
          `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">${item.name}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">$${item.unitPrice.toLocaleString()}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">$${(item.unitPrice * item.quantity).toLocaleString()}</td></tr>`
      )
      .join("");

    const itemRowsText = itemsForEmail
      .map((item) => `  ${item.name} — Qty: ${item.quantity} — $${item.unitPrice} each — $${(item.unitPrice * item.quantity).toLocaleString()}`)
      .join("\n");

    // Customer first name
    const firstName = (order.name || "").trim().split(/\s+/)[0] || "there";

    // Build the secure requirements URL
    // We need the token, but we only stored the hash. The token was passed
    // to the frontend at checkout. For the email, we need to reconstruct it.
    // Since we can't reverse the hash, we store the token in the webhook
    // response and the frontend passes it. For email links, we use the
    // order_ref as a fallback lookup (the edge function can also look up
    // by order_ref for email-based access).
    const requirementsUrl = `${SITE_URL}/order/${orderRef}`;

    const subject = `Order confirmed — ${order.order_number} | Vladenza`;

    const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;">
  <tr><td style="padding:32px 40px 8px;">
    <h1 style="font-size:22px;font-weight:700;color:#111;margin:0 0 4px;">Vladenza</h1>
    <p style="font-size:13px;color:#888;margin:0;">Order Confirmation</p>
  </td></tr>
  <tr><td style="padding:24px 40px;">
    <p style="font-size:16px;color:#333;margin:0 0 16px;">Hi ${firstName},</p>
    <p style="font-size:15px;color:#333;margin:0 0 16px;">Thank you for your order! Your payment has been confirmed and we're ready to get started.</p>
    <p style="font-size:14px;color:#666;margin:0 0 24px;">Order number: <strong style="color:#111;">${order.order_number}</strong></p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 24px;">
      <tr style="background:#f5f5f5;">
        <th style="padding:10px 0;text-align:left;font-size:12px;color:#666;font-weight:600;padding-left:12px;">Package</th>
        <th style="padding:10px 0;text-align:center;font-size:12px;color:#666;font-weight:600;">Qty</th>
        <th style="padding:10px 0;text-align:right;font-size:12px;color:#666;font-weight:600;">Unit Price</th>
        <th style="padding:10px 0;text-align:right;font-size:12px;color:#666;font-weight:600;padding-right:12px;">Subtotal</th>
      </tr>
      ${itemRowsHtml}
      <tr><td colspan="3" style="padding:12px 0;text-align:right;font-weight:700;font-size:15px;color:#111;">Total</td><td style="padding:12px 0;text-align:right;font-weight:700;font-size:15px;color:#111;padding-right:12px;">${currency} $${total.toLocaleString()}</td></tr>
    </table>

    <p style="font-size:14px;color:#333;font-weight:600;margin:0 0 12px;">Payment: <span style="color:#16a34a;">Confirmed</span></p>

    <p style="font-size:15px;color:#333;margin:0 0 8px;font-weight:600;">Next steps:</p>
    <ol style="font-size:14px;color:#555;line-height:1.8;padding-left:20px;margin:0 0 24px;">
      <li>Submit your target URLs and anchor text using the button below.</li>
      <li>Vladenza reviews your requirements.</li>
      <li>Relevant placements are sourced and manually checked.</li>
      <li>Completed links are delivered in your order report.</li>
    </ol>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr><td align="center">
        <a href="${requirementsUrl}" style="display:inline-block;background:#F97316;color:#ffffff;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">Add Order Requirements</a>
      </td></tr>
    </table>

    <p style="font-size:13px;color:#888;margin:0 0 4px;">Or copy this link:</p>
    <p style="font-size:13px;color:#666;margin:0 0 24px;word-break:break-all;">${requirementsUrl}</p>

    <p style="font-size:14px;color:#555;margin:0 0 8px;">If you have any questions, just reply to this email or contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#F97316;">${SUPPORT_EMAIL}</a>.</p>
  </td></tr>
  <tr><td style="padding:24px 40px 32px;border-top:1px solid #eee;">
    <p style="font-size:12px;color:#999;margin:0;">Vladenza — Professional Link Building Services<br>${SITE_URL}</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

    const textBody = `Vladenza — Order Confirmation

Hi ${firstName},

Thank you for your order! Your payment has been confirmed and we're ready to get started.

Order number: ${order.order_number}

Items:
${itemRowsText}

Total: ${currency} $${total.toLocaleString()}

Payment: Confirmed

Next steps:
1. Submit your target URLs and anchor text using the link below.
2. Vladenza reviews your requirements.
3. Relevant placements are sourced and manually checked.
4. Completed links are delivered in your order report.

Add Order Requirements: ${requirementsUrl}

If you have any questions, just reply to this email or contact us at ${SUPPORT_EMAIL}.

Vladenza — Professional Link Building Services
${SITE_URL}`;

    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured, skipping email send");
      return new Response(
        JSON.stringify({ success: false, error: "Email provider not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send customer confirmation email via Resend
    const customerResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: order.email,
        reply_to: REPLY_TO,
        subject,
        html: htmlBody,
        text: textBody,
      }),
    });

    if (!customerResponse.ok) {
      const errText = await customerResponse.text();
      console.error("Resend customer email error:", errText);
      throw new Error("Failed to send customer email");
    }

    // Send internal notification email
    const internalSubject = `New paid order — ${order.order_number}`;
    const reqStatus = order.requirements_status === "received" ? "Received" : "Waiting for customer";

    const internalHtml = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f8f8f8;font-family:sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;max-width:600px;">
  <tr><td style="padding:32px 40px;">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;">New Paid Order</h1>
    <p style="font-size:14px;color:#333;margin:0 0 8px;"><strong>Order:</strong> ${order.order_number}</p>
    <p style="font-size:14px;color:#333;margin:0 0 8px;"><strong>Customer:</strong> ${order.name}</p>
    <p style="font-size:14px;color:#333;margin:0 0 8px;"><strong>Email:</strong> ${order.email}</p>
    <p style="font-size:14px;color:#333;margin:0 0 16px;"><strong>Requirements:</strong> ${reqStatus}</p>

    <h2 style="font-size:15px;color:#111;margin:0 0 8px;">Items</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 16px;">
      <tr style="background:#f5f5f5;">
        <th style="padding:8px;text-align:left;font-size:12px;color:#666;">Package</th>
        <th style="padding:8px;text-align:center;font-size:12px;color:#666;">Qty</th>
        <th style="padding:8px;text-align:right;font-size:12px;color:#666;">Subtotal</th>
      </tr>
      ${itemRowsHtml}
      <tr><td colspan="2" style="padding:8px;text-align:right;font-weight:700;">Total</td><td style="padding:8px;text-align:right;font-weight:700;">${currency} $${total.toLocaleString()}</td></tr>
    </table>

    <p style="font-size:14px;margin:16px 0 0;"><a href="${SITE_URL}/admin" style="color:#F97316;">View in admin dashboard</a></p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;

    const internalText = `New Paid Order

Order: ${order.order_number}
Customer: ${order.name}
Email: ${order.email}
Requirements: ${reqStatus}

Items:
${itemRowsText}

Total: ${currency} $${total.toLocaleString()}

View in admin dashboard: ${SITE_URL}/admin`;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: SUPPORT_EMAIL,
        reply_to: REPLY_TO,
        subject: internalSubject,
        html: internalHtml,
        text: internalText,
      }),
    });

    // Mark email as sent (idempotency)
    await supabase
      .from("orders")
      .update({ email_sent_at: new Date().toISOString() })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-order-email error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
