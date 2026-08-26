import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function hmacMd5(key: string, data: string): string {
  return createHmac("md5", key).update(data).digest("hex");
}

interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface PlacementRequirement {
  cartItemId: string;
  packageLabel: string;
  targetUrl: string;
  anchor: string;
  letVladenzaRecommend: boolean;
  notes: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      orderReference,
      transactionStatus,
      merchantSignature,
      transactionId,
      amount,
      currency,
      authCode,
      cardPan,
      reasonCode,
    } = body as Record<string, string | undefined>;

    const merchantSecret = Deno.env.get("WFP_MERCHANT_SECRET") || "";

    if (!orderReference || !transactionStatus) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the WayForPay callback signature using the exact required sequence:
    // merchantAccount;orderReference;amount;currency;authCode;cardPan;transactionStatus;reasonCode
    if (merchantSecret) {
      const merchantAccount = Deno.env.get("WFP_MERCHANT_LOGIN") || "";
      const signString = [
        merchantAccount,
        orderReference,
        String(amount ?? ""),
        String(currency ?? ""),
        String(authCode ?? ""),
        String(cardPan ?? ""),
        transactionStatus,
        String(reasonCode ?? ""),
      ].join(";");

      const expectedSig = hmacMd5(merchantSecret, signString);
      if (expectedSig !== merchantSignature) {
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch the order stored on the server — never trust browser-supplied data
    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select(
        "id, status, order_status, order_number, name, email, website, amount, currency, order_items, requirements, requirements_status, wfp_transaction_id"
      )
      .eq("order_ref", orderReference)
      .single();

    if (fetchError || !existingOrder) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Idempotency: if already paid, return accept without re-processing
    const alreadyPaid =
      existingOrder.order_status === "paid" ||
      existingOrder.order_status === "ready_for_review" ||
      existingOrder.order_status === "requirements_pending";

    if (alreadyPaid) {
      console.log(`Order ${orderReference} already processed, skipping duplicate callback`);
      const responseSig = merchantSecret
        ? hmacMd5(merchantSecret, [orderReference, "accept"].join(";"))
        : "demo";
      return new Response(
        JSON.stringify({
          orderReference,
          status: "accept",
          time: Math.floor(Date.now() / 1000),
          signature: responseSig,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate that amount and currency match the order stored on the server
    const serverAmount = Number(existingOrder.amount);
    const serverCurrency = String(existingOrder.currency || "USD");
    const callbackAmount = Number(amount);
    const callbackCurrency = String(currency || "USD");

    if (
      !Number.isFinite(callbackAmount) ||
      Math.abs(callbackAmount - serverAmount) > 0.01 ||
      callbackCurrency.toUpperCase() !== serverCurrency.toUpperCase()
    ) {
      console.error(
        `Amount/currency mismatch for ${orderReference}: server=${serverAmount} ${serverCurrency}, callback=${callbackAmount} ${callbackCurrency}`
      );
      return new Response(JSON.stringify({ error: "Amount or currency mismatch" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark as paid ONLY when transactionStatus is exactly "Approved"
    const isApproved = transactionStatus === "Approved";

    // Store the verified payment result and original cart snapshot
    const paymentResult = {
      transactionStatus,
      transactionId: transactionId || null,
      authCode: authCode || null,
      cardPan: cardPan || null,
      reasonCode: reasonCode || null,
      verifiedAt: new Date().toISOString(),
    };

    const cartSnapshot = (existingOrder.order_items || []) as OrderItem[];

    const update: Record<string, unknown> = {
      status: isApproved ? "paid" : "failed",
      order_status: isApproved
        ? existingOrder.requirements_status === "received"
          ? "ready_for_review"
          : "requirements_pending"
        : "payment_failed",
      wfp_transaction_id: transactionId || null,
      paid_at: isApproved ? new Date().toISOString() : null,
      payment_result: paymentResult,
      cart_snapshot: cartSnapshot,
    };

    const { error: updateError } = await supabase
      .from("orders")
      .update(update)
      .eq("order_ref", orderReference);

    if (updateError) throw new Error(updateError.message);

    // Send Telegram notification ONLY for confirmed payments
    if (isApproved) {
      await sendTelegramNotification(supabase, existingOrder, orderReference);
    }

    // Return the signed WayForPay acknowledgement:
    // orderReference;status;time  (signed with HMAC_MD5)
    const responseSig = merchantSecret
      ? hmacMd5(merchantSecret, [orderReference, "accept"].join(";"))
      : "demo";

    return new Response(
      JSON.stringify({
        orderReference,
        status: "accept",
        time: Math.floor(Date.now() / 1000),
        signature: responseSig,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("wayforpay-webhook error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function sendTelegramNotification(
  supabase: ReturnType<typeof createClient>,
  order: Record<string, unknown>,
  orderRef: string
) {
  const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log("Telegram not configured, skipping notification");
    return;
  }

  const items = (order.order_items || []) as OrderItem[];
  const requirements = (order.requirements || []) as PlacementRequirement[];
  const reqStatus = order.requirements_status as string;

  const itemLines = items
    .map((item) => `🔗 ${item.name} ×${item.quantity} — $${(item.unitPrice * item.quantity).toLocaleString()}`)
    .join("\n");

  const targetUrlCount = requirements.filter((r) => r.targetUrl && r.targetUrl.trim()).length;
  const anchorCount = requirements.filter((r) => r.anchor && r.anchor.trim()).length;
  const agencyRecCount = requirements.filter((r) => r.letVladenzaRecommend).length;

  const reqLine =
    reqStatus === "received"
      ? `📋 Requirements: Received\n🎯 Target URLs: ${targetUrlCount}\n⚓ Anchors: ${anchorCount} supplied${agencyRecCount > 0 ? ` / ${agencyRecCount} agency recommendation` : ""}`
      : `📋 Requirements: Waiting for customer`;

  const message = [
    `💰 NEW PAID ORDER`,
    ``,
    `#${order.order_number || orderRef}`,
    ``,
    `👤 ${order.name || "—"}`,
    `✉️ ${order.email || "—"}`,
    `🌐 ${order.website || "—"}`,
    ``,
    itemLines,
    ``,
    `💵 Total: $${Number(order.amount).toLocaleString()}`,
    `✅ Payment: PAID`,
    ``,
    reqLine,
  ].join("\n");

  const chatIds = TELEGRAM_CHAT_ID.split(",").map((id) => id.trim()).filter(Boolean);

  await Promise.all(
    chatIds.map((chat_id) =>
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id,
          text: message,
          parse_mode: "HTML",
        }),
      })
        .then((r) => r.json())
        .catch((e) => console.error("Telegram send error:", e))
    )
  );
}
