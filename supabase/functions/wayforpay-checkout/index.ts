import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { createHmac, createHash } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const VALID_PRICES: Record<string, number> = {
  "niche-edit-good-place": 90,
  "niche-edit-better-place": 200,
  "niche-edit-picky-mode": 280,
  "guest-post-start": 510,
  "guest-post-grow": 825,
  "guest-post-scale": 1600,
  "crowd-marketing-start": 199,
  "crowd-marketing-grow": 399,
  "crowd-marketing-scale": 749,
};

interface CartItemInput {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface StoredOrder {
  order_ref: string;
  order_number: string;
  order_status: string;
  amount: number;
  currency: string;
  name: string;
  email: string;
  order_items: CartItemInput[];
  requirements_token_encrypted: string;
}

function hmacMd5(key: string, data: string): string {
  return createHmac("md5", key).update(data).digest("hex");
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(value: string): Uint8Array {
  if (!/^[0-9a-f]+$/i.test(value) || value.length % 2 !== 0) throw new Error("Invalid encryption value");
  return new Uint8Array(value.match(/.{2}/g)!.map((part) => parseInt(part, 16)));
}

async function encryptToken(token: string, keyHex: string): Promise<string> {
  const keyBytes = fromHex(keyHex);
  if (keyBytes.length !== 32) throw new Error("Invalid encryption key");
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cryptoKey, new TextEncoder().encode(token)));
  return `${toHex(iv)}:${toHex(encrypted.slice(encrypted.length - 16))}:${toHex(encrypted.slice(0, encrypted.length - 16))}`;
}

async function decryptToken(encryptedValue: string, keyHex: string): Promise<string> {
  const [ivHex, tagHex, ciphertextHex] = encryptedValue.split(":");
  if (!ivHex || !tagHex || !ciphertextHex) throw new Error("Invalid encrypted token");
  const keyBytes = fromHex(keyHex);
  if (keyBytes.length !== 32) throw new Error("Invalid encryption key");
  const iv = fromHex(ivHex);
  const tag = fromHex(tagHex);
  const ciphertext = fromHex(ciphertextHex);
  const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  const combined = new Uint8Array(ciphertext.length + tag.length);
  combined.set(ciphertext);
  combined.set(tag, ciphertext.length);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cryptoKey, combined);
  return new TextDecoder().decode(decrypted);
}

async function getEncryptionKey(supabase: ReturnType<typeof createClient>): Promise<string> {
  const envKey = Deno.env.get("REQUIREMENTS_TOKEN_ENCRYPTION_KEY");
  if (envKey) return envKey;
  const { data, error } = await supabase.from("app_secrets").select("value").eq("name", "REQUIREMENTS_TOKEN_ENCRYPTION_KEY").maybeSingle();
  if (error || !data) throw new Error("Encryption key not configured");
  return data.value as string;
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

function buildCheckoutData(order: StoredOrder, merchantLogin: string, merchantSecret: string, requirementsToken: string) {
  const items = Array.isArray(order.order_items) ? order.order_items : [];
  const productNames = items.map((item) => item.name || item.productId);
  const productCounts = items.map((item) => Number(item.quantity));
  const productPrices = items.map((item) => VALID_PRICES[item.productId]);
  const orderDate = Math.floor(Number(order.order_ref.split("-")[1]) / 1000);
  const signature = hmacMd5(merchantSecret, [
    merchantLogin,
    "vladenza.com",
    order.order_ref,
    orderDate.toString(),
    Number(order.amount).toString(),
    order.currency,
    ...productNames,
    ...productCounts.map(String),
    ...productPrices.map(String),
  ].join(";"));
  const nameParts = (order.name || "").trim().split(/\s+/);

  return {
    success: true,
    orderRef: order.order_ref,
    orderNumber: order.order_number,
    requirementsToken,
    checkoutData: {
      merchantAccount: merchantLogin,
      merchantDomainName: "vladenza.com",
      merchantTransactionSecureType: "AUTO",
      authorizationType: "SimpleSignature",
      merchantSignature: signature,
      orderReference: order.order_ref,
      orderDate,
      amount: Number(order.amount),
      currency: order.currency,
      productName: productNames,
      productCount: productCounts,
      productPrice: productPrices,
      clientFirstName: nameParts[0] || "",
      clientLastName: nameParts.slice(1).join(" ") || "-",
      clientEmail: order.email,
      clientPhone: "000000000000",
      language: "EN",
      serviceUrl: `${Deno.env.get("SUPABASE_URL")}/functions/v1/wayforpay-webhook`,
    },
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const body = await req.json() as Record<string, unknown>;
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    if (body.action === "status") {
      const orderRef = typeof body.orderRef === "string" ? body.orderRef : "";
      const checkoutAttemptId = typeof body.checkoutAttemptId === "string" ? body.checkoutAttemptId : "";
      if (!orderRef || !checkoutAttemptId) return jsonResponse({ error: "Invalid status request" }, 400);
      const { data: order, error } = await supabase.from("orders").select("order_status").eq("order_ref", orderRef).eq("checkout_attempt_id", checkoutAttemptId).maybeSingle();
      if (error || !order) return jsonResponse({ success: true, status: "pending" });
      const status = order.order_status === "paid" || order.order_status === "ready_for_review" || order.order_status === "requirements_pending"
        ? "paid"
        : order.order_status === "payment_failed" ? "failed" : "pending";
      return jsonResponse({ success: true, status });
    }

    const currency = typeof body.currency === "string" ? body.currency.toUpperCase() : "USD";
    const checkoutAttemptId = typeof body.checkoutAttemptId === "string" ? body.checkoutAttemptId : "";
    const name = typeof body.name === "string" ? body.name : "";
    const email = typeof body.email === "string" ? body.email : "";
    const website = typeof body.website === "string" ? body.website : "";
    const company = typeof body.company === "string" ? body.company : "";
    const type = typeof body.type === "string" ? body.type : "payment";
    const items = Array.isArray(body.items) ? body.items as CartItemInput[] : [];

    if (!checkoutAttemptId || checkoutAttemptId.length > 20 || checkoutAttemptId.length > 100) return jsonResponse({ error: "Invalid checkout attempt" }, 400);
    if (currency !== "USD") return jsonResponse({ error: "Unsupported currency" }, 400);
    if (!name.trim() || !email.trim()) return jsonResponse({ error: "Missing customer details" }, 400);
    if (type !== "payment") return jsonResponse({ error: "Unsupported checkout type" }, 400);
    if (items.length === 0) return jsonResponse({ error: "Cart is empty" }, 400);

    const merchantLogin = Deno.env.get("WFP_MERCHANT_LOGIN");
    const merchantSecret = Deno.env.get("WFP_MERCHANT_SECRET");
    if (!merchantLogin || !merchantSecret) return jsonResponse({ error: "Payment configuration unavailable" }, 503);

    let amount = 0;
    const normalizedItems: CartItemInput[] = [];
    for (const item of items) {
      const quantity = Number(item.quantity);
      const canonicalPrice = VALID_PRICES[item.productId];
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100 || canonicalPrice === undefined) return jsonResponse({ error: "Invalid cart item" }, 400);
      amount += canonicalPrice * quantity;
      normalizedItems.push({ productId: item.productId, name: typeof item.name === "string" && item.name ? item.name : item.productId, unitPrice: canonicalPrice, quantity });
    }
    amount = Math.round(amount * 100) / 100;

    const orderFields = "order_ref, order_number, order_status, amount, currency, name, email, order_items, requirements_token_encrypted";
    const { data: existingOrder } = await supabase.from("orders").select(orderFields).eq("checkout_attempt_id", checkoutAttemptId).maybeSingle();
    if (existingOrder) {
      if (existingOrder.order_status !== "pending_payment") return jsonResponse({ error: "Checkout attempt already completed" }, 409);
      if (Number(existingOrder.amount) !== amount || String(existingOrder.currency).toUpperCase() !== currency) return jsonResponse({ error: "Checkout attempt does not match cart" }, 409);
      const requirementsToken = await decryptToken(existingOrder.requirements_token_encrypted, await getEncryptionKey(supabase));
      return jsonResponse(buildCheckoutData({ ...existingOrder, order_items: existingOrder.order_items as CartItemInput[] }, merchantLogin, merchantSecret, requirementsToken));
    }

    const requirementsToken = generateToken();
    const requirementsTokenEncrypted = await encryptToken(requirementsToken, await getEncryptionKey(supabase));
    const orderRef = `vladenza-${Date.now()}-${crypto.randomUUID().slice(0, 5)}`;
    const orderNumberResult = await supabase.rpc("generate_order_number");
    const orderNumber = orderNumberResult.data as string || `NE-${Date.now()}`;
    const requirementsStatus = body.requirementsStatus === "provided" ? "received" : "pending";

    const insertPayload = {
      order_ref: orderRef,
      order_number: orderNumber,
      checkout_attempt_id: checkoutAttemptId,
      package_name: normalizedItems.map((item) => item.name).join("; "),
      amount,
      currency,
      type: "payment",
      name,
      email,
      website,
      company,
      message: typeof body.message === "string" ? body.message : "",
      status: "pending_payment",
      order_status: "pending_payment",
      order_items: normalizedItems,
      requirements: Array.isArray(body.requirements) ? body.requirements : [],
      requirements_status: requirementsStatus,
      requirements_token_hash: hashToken(requirementsToken),
      requirements_token_encrypted: requirementsTokenEncrypted,
    };

    const { error: insertError } = await supabase.from("orders").insert(insertPayload);
    if (insertError) {
      if (insertError.code === "23505") {
        const { data: racedOrder } = await supabase.from("orders").select(orderFields).eq("checkout_attempt_id", checkoutAttemptId).maybeSingle();
        if (racedOrder && racedOrder.order_status === "pending_payment" && Number(racedOrder.amount) === amount) {
          const racedToken = await decryptToken(racedOrder.requirements_token_encrypted, await getEncryptionKey(supabase));
          return jsonResponse(buildCheckoutData({ ...racedOrder, order_items: racedOrder.order_items as CartItemInput[] }, merchantLogin, merchantSecret, racedToken));
        }
      }
      console.error("wayforpay-checkout insert failed", insertError);
      return jsonResponse({ error: "Could not create checkout" }, 500);
    }

    return jsonResponse(buildCheckoutData({
      order_ref: orderRef,
      order_number: orderNumber,
      order_status: "pending_payment",
      amount,
      currency,
      name,
      email,
      order_items: normalizedItems,
      requirements_token_encrypted: requirementsTokenEncrypted,
    }, merchantLogin, merchantSecret, requirementsToken));
  } catch (err) {
    console.error("wayforpay-checkout error", err);
    return jsonResponse({ error: "Could not start checkout" }, 500);
  }
});
