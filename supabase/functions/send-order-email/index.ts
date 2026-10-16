import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function decryptToken(encrypted: string, keyHex: string): Promise<string> {
  const parts = encrypted.split(":");
  if (parts.length !== 3) throw new Error("Invalid encrypted token format");
  const fromHex = (hex: string) => new Uint8Array(hex.match(/.{2}/g)!.map(h => parseInt(h, 16)));
  const keyBytes = fromHex(keyHex);
  const iv = fromHex(parts[0]);
  const tag = fromHex(parts[1]);
  const ciphertext = fromHex(parts[2]);
  const combined = new Uint8Array(ciphertext.length + tag.length);
  combined.set(ciphertext, 0);
  combined.set(tag, ciphertext.length);
  const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cryptoKey, combined);
  return new TextDecoder().decode(decrypted);
}

async function getEncryptionKey(supabase: ReturnType<typeof createClient>): Promise<string> {
  const envKey = Deno.env.get("REQUIREMENTS_TOKEN_ENCRYPTION_KEY");
  if (envKey) return envKey;
  const { data, error } = await supabase
    .from("app_secrets")
    .select("value")
    .eq("name", "REQUIREMENTS_TOKEN_ENCRYPTION_KEY")
    .maybeSingle();
  if (error || !data) throw new Error("Encryption key not configured");
  return data.value as string;
}

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
  original_amount?: number;
  discount_amount?: number;
  promo_code?: string;
  paid_amount?: number;
}

interface PlacementRequirement {
  cartItemId?: string;
  placementId?: string;
  packageLabel?: string;
  targetUrl: string;
  anchor: string;
  letVladenzaRecommend?: boolean;
  notes?: string;
  niche?: string;
  willProvideLater?: boolean;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatMoney(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const FROM_NAME = "Vladenza Orders";
const FROM_EMAIL = "info@vladenza.com";
const REPLY_TO = "info@vladenza.com";
const SUPPORT_EMAIL = "info@vladenza.com";
const SITE_URL = "https://vladenza.com";

// ─── Email content in English ───
const en = {
  subject: (orderNum: string) => `Order confirmed — ${orderNum} | Vladenza`,
  greeting: (name: string) => `Hi ${name},`,
  body1: "Thank you for your order! Your payment has been confirmed and we're ready to get started.",
  orderNumber: "Order number:",
  payment: "Payment:",
  paymentConfirmed: "Confirmed",
  whatHappensNext: "What happens next:",
  nextStepsReceived: [
    "We review your website and submitted requirements.",
    "We source placements within the selected metrics.",
    "Placements are manually checked before delivery.",
    "You'll receive the completed links in your order report.",
  ],
  nextStepsPending: [
    "Submit your target URLs and anchor text using the button below.",
    "Vladenza reviews your requirements.",
    "Relevant placements are sourced and manually checked.",
    "Completed links are delivered in your order report.",
  ],
  reqsReceivedNote: "Your requirements have been received. Our team will review your order.",
  addReqsBtn: "Add Order Requirements",
  orCopyLink: "Or copy this link:",
  questionsLine: `If you have any questions, just reply to this email or contact us at`,
  footer: "Vladenza — Professional Link Building Services",
  internalSubject: (orderNum: string) => `New paid order — ${orderNum}`,
  internalReqReceived: "Received",
  internalReqWaiting: "Waiting for customer",
  internalRequirementsLabel: "Requirements:",
  internalCustomerLabel: "Customer:",
  internalEmailLabel: "Email:",
  internalWebsiteLabel: "Website:",
  internalCompanyLabel: "Company:",
  internalOrderLabel: "Order:",
  internalPaymentLabel: "Payment:",
  internalReqDetailTitle: "Requirements Detail",
  viewInAdmin: "View in admin dashboard",
  tablePackage: "Package",
  tableQty: "Qty",
  tableUnitPrice: "Unit Price",
  tableSubtotal: "Subtotal",
  tableTargetUrl: "Target URL",
  tableAnchor: "Anchor",
  tableNotes: "Notes",
  totalLabel: "Total",
  totalPaidLabel: "Total Paid",
  subtotalLabel: "Subtotal",
  discountLabel: "Discount",
  agencyPick: "(agency pick)",
};

// ─── Email content in Ukrainian (native, not translated from English) ───
const uk = {
  subject: (orderNum: string) => `Замовлення підтверджено — ${orderNum} | Vladenza`,
  greeting: (name: string) => `Вітаємо, ${name}!`,
  body1: "Дякуємо за замовлення! Ваш платіж підтверджено, і ми готові розпочати роботу.",
  orderNumber: "Номер замовлення:",
  payment: "Оплата:",
  paymentConfirmed: "Підтверджено",
  whatHappensNext: "Що далі:",
  nextStepsReceived: [
    "Ми переглядаємо ваш сайт і надіслані вимоги.",
    "Підбираємо розміщення за обраними метриками.",
    "Розміщення перевіряються вручну перед доставкою.",
    "Ви отримаєте готові посилання у звіті про замовлення.",
  ],
  nextStepsPending: [
    "Надішліть цільові URL та якірні тексти через кнопку нижче.",
    "Vladenza переглядає ваші вимоги.",
    "Відповідні розміщення підбираються та перевіряються вручну.",
    "Готові посилання доставляються у звіті про замовлення.",
  ],
  reqsReceivedNote: "Ваші вимоги отримано. Наша команда перегляне ваше замовлення.",
  addReqsBtn: "Додати вимоги до замовлення",
  orCopyLink: "Або скопіюйте це посилання:",
  questionsLine: "Якщо у вас є запитання — просто дайте відповідь на цей лист або напишіть нам на",
  footer: "Vladenza — Професійні послуги з лінкбілдингу",
  internalSubject: (orderNum: string) => `Нове оплачене замовлення — ${orderNum}`,
  internalReqReceived: "Отримано",
  internalReqWaiting: "Очікує на клієнта",
  internalRequirementsLabel: "Вимоги:",
  internalCustomerLabel: "Клієнт:",
  internalEmailLabel: "Email:",
  internalWebsiteLabel: "Сайт:",
  internalCompanyLabel: "Компанія:",
  internalOrderLabel: "Замовлення:",
  internalPaymentLabel: "Оплата:",
  internalReqDetailTitle: "Деталі вимог",
  viewInAdmin: "Переглянути в адмін-панелі",
  tablePackage: "Пакет",
  tableQty: "К-ть",
  tableUnitPrice: "Ціна",
  tableSubtotal: "Сума",
  tableTargetUrl: "Цільовий URL",
  tableAnchor: "Якір",
  tableNotes: "Нотатки",
  totalLabel: "Разом",
  totalPaidLabel: "Сплачено",
  subtotalLabel: "Підсумок",
  discountLabel: "Знижка",
  agencyPick: "(підбирає агентство)",
};

type L = typeof en;

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

    // ── Security: verify the order is actually paid before sending any email ──
    const { data: orderCheck, error: checkError } = await supabase
      .from("orders")
      .select("order_status, status")
      .eq("order_ref", orderRef)
      .maybeSingle();

    if (checkError || !orderCheck) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const paidStatuses = ["paid", "ready_for_review", "requirements_pending", "in_progress", "completed"];
    if (!paidStatuses.includes(orderCheck.order_status)) {
      console.log(`Email send blocked for order ${orderRef}: order_status is '${orderCheck.order_status}', not paid`);
      return new Response(
        JSON.stringify({ error: "Order is not in a paid state" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Idempotency: claim the email sending atomically ──
    const { data: claimed, error: claimError } = await supabase.rpc("claim_email_sending", {
      p_order_ref: orderRef,
    });

    if (claimError) throw new Error(claimError.message);

    if (!claimed) {
      console.log(`Email claim denied for order ${orderRef} (already claimed or sent)`);
      return new Response(
        JSON.stringify({ success: true, message: "Email already claimed or sent" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, order_number, name, email, amount, currency, order_items, cart_snapshot, requirements_status, order_status, requirements_token_encrypted, original_amount, discount_amount, promo_code_snapshot, requirements, website, company, locale")
      .eq("order_ref", orderRef)
      .single();

    if (orderError || !order) {
      await supabase.from("orders").update({ email_status: "failed" }).eq("order_ref", orderRef);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Select language based on stored locale
    const locale = String(order.locale || "en");
    const L: L = locale === "uk" ? uk : en;

    let requirementsToken: string | null = null;
    if (order.requirements_token_encrypted) {
      try {
        const encryptionKey = await getEncryptionKey(supabase);
        requirementsToken = await decryptToken(order.requirements_token_encrypted as string, encryptionKey);
      } catch (decryptErr) {
        console.error("Token decryption failed:", decryptErr);
      }
    }

    const requirementsUrl = requirementsToken
      ? `${SITE_URL}/order/${requirementsToken}`
      : `${SITE_URL}/order/${orderRef}`;

    const cartSnapshot = order.cart_snapshot as CartSnapshot | null;
    const orderItems = (order.order_items || []) as OrderItem[];

    const itemsForEmail = cartSnapshot?.items || orderItems;
    const paidAmount = Number(order.amount) || 0;
    const originalAmount = Number(order.original_amount) || cartSnapshot?.original_amount || cartSnapshot?.total || Number(order.amount) || 0;
    const discountAmount = Number(order.discount_amount) || cartSnapshot?.discount_amount || 0;
    const promoCode = (order.promo_code_snapshot as string) || cartSnapshot?.promo_code || "";
    const currency = String(order.currency || cartSnapshot?.currency || "USD");

    const hasDiscount = discountAmount > 0;
    const reqStatus = order.requirements_status as string;
    const requirementsReceived = reqStatus === "received";
    const requirements = (order.requirements || []) as PlacementRequirement[];

    const firstName = escapeHtml((order.name || "").trim().split(/\s+/)[0] || (locale === "uk" ? "там" : "there"));
    const subject = L.subject(order.order_number);

    const itemRowsHtml = itemsForEmail
      .map(
        (item) =>
          `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(item.name)}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">$${formatMoney(item.unitPrice)}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">$${formatMoney(item.unitPrice * item.quantity)}</td></tr>`
      )
      .join("");

    const itemRowsText = itemsForEmail
      .map((item) => `  ${item.name} — Qty: ${item.quantity} — $${formatMoney(item.unitPrice)} each — $${formatMoney(item.unitPrice * item.quantity)}`)
      .join("\n");

    // Build pricing rows
    const pricingRowsHtml = hasDiscount
      ? `<tr><td colspan="3" style="padding:8px 0;text-align:right;font-size:14px;color:#666;">${L.subtotalLabel}</td><td style="padding:8px 0;text-align:right;font-size:14px;color:#666;">$${formatMoney(originalAmount)}</td></tr>
         <tr><td colspan="3" style="padding:8px 0;text-align:right;font-size:14px;color:#F97316;font-weight:600;">${L.discountLabel}${promoCode ? ` (${escapeHtml(promoCode)})` : ""}</td><td style="padding:8px 0;text-align:right;font-size:14px;color:#F97316;font-weight:600;">−$${formatMoney(discountAmount)}</td></tr>
         <tr><td colspan="3" style="padding:12px 0;text-align:right;font-weight:700;font-size:15px;color:#111;">${L.totalPaidLabel}</td><td style="padding:12px 0;text-align:right;font-weight:700;font-size:15px;color:#111;">$${formatMoney(paidAmount)}</td></tr>`
      : `<tr><td colspan="3" style="padding:12px 0;text-align:right;font-weight:700;font-size:15px;color:#111;">${L.totalLabel}</td><td style="padding:12px 0;text-align:right;font-weight:700;font-size:15px;color:#111;">$${formatMoney(paidAmount)}</td></tr>`;

    const pricingRowsText = hasDiscount
      ? `${L.subtotalLabel}: $${formatMoney(originalAmount)}\n${L.discountLabel}${promoCode ? ` (${promoCode})` : ""}: −$${formatMoney(discountAmount)}\n${L.totalPaidLabel}: $${formatMoney(paidAmount)}`
      : `${L.totalLabel}: $${formatMoney(paidAmount)}`;

    // Conditional next-steps section based on requirements status
    let nextStepsHtml: string;
    let nextStepsText: string;
    let requirementsButtonHtml: string;

    if (requirementsReceived) {
      const stepsOl = L.nextStepsReceived.map((s) => `<li>${s}</li>`).join("");
      nextStepsHtml = `<p style="font-size:15px;color:#333;margin:0 0 8px;font-weight:600;">${L.whatHappensNext}</p>
      <ol style="font-size:14px;color:#555;line-height:1.8;padding-left:20px;margin:0 0 24px;">
        ${stepsOl}
      </ol>
      <p style="font-size:14px;color:#16a34a;font-weight:600;margin:0 0 24px;">✓ ${L.reqsReceivedNote}</p>`;
      nextStepsText = `${L.whatHappensNext}\n${L.nextStepsReceived.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n${L.reqsReceivedNote}`;
      requirementsButtonHtml = "";
    } else {
      const stepsOl = L.nextStepsPending.map((s) => `<li>${s}</li>`).join("");
      nextStepsHtml = `<p style="font-size:15px;color:#333;margin:0 0 8px;font-weight:600;">${L.whatHappensNext}</p>
      <ol style="font-size:14px;color:#555;line-height:1.8;padding-left:20px;margin:0 0 24px;">
        ${stepsOl}
      </ol>`;
      nextStepsText = `${L.whatHappensNext}\n${L.nextStepsPending.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
      requirementsButtonHtml = `<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr><td align="center">
          <a href="${requirementsUrl}" style="display:inline-block;background:#F97316;color:#ffffff;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">${L.addReqsBtn}</a>
        </td></tr>
      </table>
      <p style="font-size:13px;color:#888;margin:0 0 4px;">${L.orCopyLink}</p>
      <p style="font-size:13px;color:#666;margin:0 0 24px;word-break:break-all;">${requirementsUrl}</p>`;
    }

    const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;">
  <tr><td style="padding:32px 40px 8px;">
    <h1 style="font-size:22px;font-weight:700;color:#111;margin:0 0 4px;">Vladenza</h1>
    <p style="font-size:13px;color:#888;margin:0;">${locale === "uk" ? "Підтвердження замовлення" : "Order Confirmation"}</p>
  </td></tr>
  <tr><td style="padding:24px 40px;">
    <p style="font-size:16px;color:#333;margin:0 0 16px;">${L.greeting(firstName)}</p>
    <p style="font-size:15px;color:#333;margin:0 0 16px;">${L.body1}</p>
    <p style="font-size:14px;color:#666;margin:0 0 24px;">${L.orderNumber} <strong style="color:#111;">${order.order_number}</strong></p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 24px;">
      <tr style="background:#f5f5f5;">
        <th style="padding:10px 0;text-align:left;font-size:12px;color:#666;font-weight:600;padding-left:12px;">${L.tablePackage}</th>
        <th style="padding:10px 0;text-align:center;font-size:12px;color:#666;font-weight:600;">${L.tableQty}</th>
        <th style="padding:10px 0;text-align:right;font-size:12px;color:#666;font-weight:600;">${L.tableUnitPrice}</th>
        <th style="padding:10px 0;text-align:right;font-size:12px;color:#666;font-weight:600;padding-right:12px;">${L.tableSubtotal}</th>
      </tr>
      ${itemRowsHtml}
      ${pricingRowsHtml}
    </table>

    <p style="font-size:14px;color:#333;font-weight:600;margin:0 0 12px;">${L.payment} <span style="color:#16a34a;">${L.paymentConfirmed}</span></p>

    ${nextStepsHtml}
    ${requirementsButtonHtml}

    <p style="font-size:14px;color:#555;margin:0 0 8px;">${L.questionsLine} <a href="mailto:${SUPPORT_EMAIL}" style="color:#F97316;">${SUPPORT_EMAIL}</a>.</p>
  </td></tr>
  <tr><td style="padding:24px 40px 32px;border-top:1px solid #eee;">
    <p style="font-size:12px;color:#999;margin:0;">${L.footer}<br>${SITE_URL}</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

    const textBody = `Vladenza — ${locale === "uk" ? "Підтвердження замовлення" : "Order Confirmation"}

${L.greeting(firstName)}

${L.body1}

${L.orderNumber} ${order.order_number}

${locale === "uk" ? "Позиції:" : "Items:"}
${itemRowsText}

${pricingRowsText}

${L.payment} ${L.paymentConfirmed}

${nextStepsText}
${requirementsReceived ? "" : `\n${L.addReqsBtn}: ${requirementsUrl}\n`}

${L.questionsLine} ${SUPPORT_EMAIL}.

${L.footer}
${SITE_URL}`;

    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured, releasing email claim");
      await supabase.from("orders").update({ email_status: "failed" }).eq("id", order.id);
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

    const customerData = await customerResponse.json();
    if (!customerResponse.ok) {
      console.error("Resend customer email error:", customerData);
      await supabase.from("orders").update({ email_status: "failed" }).eq("id", order.id);
      throw new Error("Failed to send customer email");
    }

    // Build internal (agency) email — always in English for internal team
    const targetUrls = requirements.filter((r) => r.targetUrl?.trim()).map((r) => r.targetUrl);
    const anchors = requirements.filter((r) => r.anchor?.trim()).map((r) => r.anchor);
    const reqStatusInternal = requirementsReceived ? en.internalReqReceived : en.internalReqWaiting;

    const internalPricingRows = hasDiscount
      ? `<tr><td colspan="2" style="padding:8px;text-align:right;font-size:13px;color:#666;">${en.subtotalLabel}</td><td style="padding:8px;text-align:right;font-size:13px;color:#666;">$${formatMoney(originalAmount)}</td></tr>
         <tr><td colspan="2" style="padding:8px;text-align:right;font-size:13px;color:#F97316;">${en.discountLabel}${promoCode ? ` (${escapeHtml(promoCode)})` : ""}</td><td style="padding:8px;text-align:right;font-size:13px;color:#F97316;">−$${formatMoney(discountAmount)}</td></tr>
         <tr><td colspan="2" style="padding:8px;text-align:right;font-weight:700;">${en.totalPaidLabel}</td><td style="padding:8px;text-align:right;font-weight:700;">$${formatMoney(paidAmount)}</td></tr>`
      : `<tr><td colspan="2" style="padding:8px;text-align:right;font-weight:700;">${en.totalLabel}</td><td style="padding:8px;text-align:right;font-weight:700;">$${formatMoney(paidAmount)}</td></tr>`;

    const internalHtml = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f8f8f8;font-family:sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;max-width:600px;">
  <tr><td style="padding:32px 40px;">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;">New Paid Order</h1>
    <p style="font-size:14px;color:#333;margin:0 0 8px;"><strong>${en.internalOrderLabel}</strong> ${order.order_number}</p>
    <p style="font-size:14px;color:#333;margin:0 0 8px;"><strong>${en.internalCustomerLabel}</strong> ${escapeHtml(order.name || "")}</p>
    <p style="font-size:14px;color:#333;margin:0 0 8px;"><strong>${en.internalEmailLabel}</strong> ${escapeHtml(order.email || "")}</p>
    <p style="font-size:14px;color:#333;margin:0 0 8px;"><strong>${en.internalWebsiteLabel}</strong> ${escapeHtml(order.website || "—")}</p>
    <p style="font-size:14px;color:#333;margin:0 0 8px;"><strong>${en.internalCompanyLabel}</strong> ${escapeHtml(order.company || "—")}</p>
    <p style="font-size:14px;color:#333;margin:0 0 16px;"><strong>${en.internalRequirementsLabel}</strong> ${reqStatusInternal}</p>

    <h2 style="font-size:15px;color:#111;margin:0 0 8px;">Items</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 16px;">
      <tr style="background:#f5f5f5;">
        <th style="padding:8px;text-align:left;font-size:12px;color:#666;">${en.tablePackage}</th>
        <th style="padding:8px;text-align:center;font-size:12px;color:#666;">${en.tableQty}</th>
        <th style="padding:8px;text-align:right;font-size:12px;color:#666;">${en.tableSubtotal}</th>
      </tr>
      ${itemRowsHtml}
      ${internalPricingRows}
    </table>

    <p style="font-size:14px;color:#333;margin:16px 0 8px;"><strong>${en.internalPaymentLabel}</strong> <span style="color:#16a34a;">PAID</span></p>

    ${requirementsReceived ? `<h2 style="font-size:15px;color:#111;margin:16px 0 8px;">${en.internalReqDetailTitle}</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 16px;font-size:13px;">
      <tr style="background:#f5f5f5;">
        <th style="padding:6px;text-align:left;">#</th>
        <th style="padding:6px;text-align:left;">${en.tableTargetUrl}</th>
        <th style="padding:6px;text-align:left;">${en.tableAnchor}</th>
        <th style="padding:6px;text-align:left;">${en.tableNotes}</th>
      </tr>
      ${requirements.map((r, i) => `<tr><td style="padding:6px;border-bottom:1px solid #eee;">${i + 1}</td><td style="padding:6px;border-bottom:1px solid #eee;word-break:break-all;">${escapeHtml(r.targetUrl || "—")}</td><td style="padding:6px;border-bottom:1px solid #eee;">${escapeHtml(r.anchor || (r.letVladenzaRecommend ? en.agencyPick : "—"))}</td><td style="padding:6px;border-bottom:1px solid #eee;">${escapeHtml(r.notes || "—")}</td></tr>`).join("")}
    </table>` : ""}

    <p style="font-size:14px;margin:16px 0 0;"><a href="${SITE_URL}/admin" style="color:#F97316;">${en.viewInAdmin}</a></p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;

    const internalText = `New Paid Order

${en.internalOrderLabel} ${order.order_number}
${en.internalCustomerLabel} ${order.name}
${en.internalEmailLabel} ${order.email}
${en.internalWebsiteLabel} ${order.website || "—"}
${en.internalCompanyLabel} ${order.company || "—"}
${en.internalRequirementsLabel} ${reqStatusInternal}

Items:
${itemRowsText}

${pricingRowsText}

${en.internalPaymentLabel} PAID
${requirementsReceived ? `\nRequirements Detail:\n${requirements.map((r, i) => `  ${i + 1}. URL: ${r.targetUrl || "—"} | Anchor: ${r.anchor || (r.letVladenzaRecommend ? en.agencyPick : "—")} | Notes: ${r.notes || "—"}`).join("\n")}` : ""}

${en.viewInAdmin}: ${SITE_URL}/admin`;

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
        subject: en.internalSubject(order.order_number),
        html: internalHtml,
        text: internalText,
      }),
    });

    const { error: completeError } = await supabase
      .from("orders")
      .update({ email_status: "sent", email_sent_at: new Date().toISOString() })
      .eq("id", order.id);

    if (completeError) {
      console.error("Failed to mark email as sent:", completeError.message);
    }

    return new Response(
      JSON.stringify({ success: true, messageId: customerData.id }),
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
