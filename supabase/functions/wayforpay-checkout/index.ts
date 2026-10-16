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
  promo_code_id: string | null;
  discount_amount: number;
  original_amount: number;
  locale?: string;
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

// ── Turnstile verification ──
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

// ── Persistent rate limiting via Supabase ──
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
    return true; // fail open — don't block legitimate customers if DB is down
  }
  return data === true;
}

function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip")?.trim() || "unknown";
}

function buildCheckoutData(order: StoredOrder, merchantLogin: string, merchantSecret: string, requirementsToken: string, orderLocale: string) {
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
      language: orderLocale === "uk" ? "UA" : "EN",
      serviceUrl: `${Deno.env.get("SUPABASE_URL")}/functions/v1/wayforpay-webhook`,
    },
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const body = await req.json() as Record<string, unknown>;
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const clientIp = getClientIp(req);

    // ── Status check (no Turnstile needed, lightweight) ──
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

    // ── Promo validation (rate limited, no Turnstile) ──
    if (body.action === "validate_promo") {
      const allowed = await checkRateLimit(supabase, "promo", clientIp, 10, 60_000);
      if (!allowed) return jsonResponse({ error: "too_many_requests" }, 429);

      const promoCode = typeof body.promoCode === "string" ? body.promoCode.trim() : "";
      const items = Array.isArray(body.items) ? body.items as CartItemInput[] : [];
      if (!promoCode) return jsonResponse({ valid: false, error: "empty_code" }, 400);
      if (items.length === 0) return jsonResponse({ valid: false, error: "empty_cart" }, 400);

      const cartItemsForValidation = items.map((item) => {
        const canonicalPrice = VALID_PRICES[item.productId];
        const eligibleAmount = (canonicalPrice ?? 0) * Number(item.quantity);
        return {
          productId: item.productId,
          quantity: Number(item.quantity),
          eligibleAmount: Math.round(eligibleAmount * 100) / 100,
        };
      });

      const { data: promoResult, error: promoError } = await supabase.rpc("validate_promo_code", {
        p_code: promoCode,
        p_cart_items: cartItemsForValidation,
        p_order_ref: "validation_only",
      });

      if (promoError) {
        console.error("Promo validation error:", promoError);
        return jsonResponse({ valid: false, error: "validation_error" }, 400);
      }

      return jsonResponse(promoResult as Record<string, unknown>);
    }

    // ── Payment creation (rate limited + Turnstile) ──
    const currency = typeof body.currency === "string" ? body.currency.toUpperCase() : "USD";
    const checkoutAttemptId = typeof body.checkoutAttemptId === "string" ? body.checkoutAttemptId : "";
    const name = typeof body.name === "string" ? body.name : "";
    const email = typeof body.email === "string" ? body.email : "";
    const website = typeof body.website === "string" ? body.website : "";
    const company = typeof body.company === "string" ? body.company : "";
    const type = typeof body.type === "string" ? body.type : "payment";
    const items = Array.isArray(body.items) ? body.items as CartItemInput[] : [];
    const promoCode = typeof body.promoCode === "string" ? body.promoCode.trim() : "";
    const locale = typeof body.locale === "string" ? body.locale : "en";
    const turnstileToken = typeof body.turnstileToken === "string" ? body.turnstileToken : "";

    // Rate limit: max 5 checkout attempts per minute per IP
    const allowed = await checkRateLimit(supabase, "checkout", clientIp, 5, 60_000);
    if (!allowed) return jsonResponse({ error: "too_many_requests" }, 429);

    // Turnstile verification (fail open when not configured — verifyTurnstile returns true if no secret is set)
    const turnstileValid = await verifyTurnstile(turnstileToken, clientIp);
    if (!turnstileValid) return jsonResponse({ error: "Bot verification failed" }, 403);

    if (!checkoutAttemptId || checkoutAttemptId.length < 20 || checkoutAttemptId.length > 100) return jsonResponse({ error: "Invalid checkout attempt" }, 400);
    if (currency !== "USD") return jsonResponse({ error: "Unsupported currency" }, 400);
    if (!name.trim() || !email.trim()) return jsonResponse({ error: "Missing customer details" }, 400);
    if (type !== "payment") return jsonResponse({ error: "Unsupported checkout type" }, 400);
    if (items.length === 0) return jsonResponse({ error: "Cart is empty" }, 400);

    const merchantLogin = Deno.env.get("WFP_MERCHANT_LOGIN");
    const merchantSecret = Deno.env.get("WFP_MERCHANT_SECRET");
    if (!merchantLogin || !merchantSecret) return jsonResponse({ error: "Payment configuration unavailable" }, 503);

    let originalAmount = 0;
    const normalizedItems: CartItemInput[] = [];
    for (const item of items) {
      const quantity = Number(item.quantity);
      const canonicalPrice = VALID_PRICES[item.productId];
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100 || canonicalPrice === undefined) return jsonResponse({ error: "Invalid cart item" }, 400);
      originalAmount += canonicalPrice * quantity;
      normalizedItems.push({ productId: item.productId, name: typeof item.name === "string" && item.name ? item.name : item.productId, unitPrice: canonicalPrice, quantity });
    }
    originalAmount = Math.round(originalAmount * 100) / 100;

    let discountAmount = 0;
    let promoCodeId: string | null = null;
    let promoCodeSnapshot: string | null = null;

    if (promoCode) {
      const cartItemsForValidation = normalizedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        eligibleAmount: Math.round(VALID_PRICES[item.productId] * item.quantity * 100) / 100,
      }));

      const { data: promoResult, error: promoError } = await supabase.rpc("validate_promo_code", {
        p_code: promoCode,
        p_cart_items: cartItemsForValidation,
        p_order_ref: "checkout_" + checkoutAttemptId,
      });

      if (promoError || !promoResult) {
        const errMsg = promoError?.message || "Promo code validation failed";
        return jsonResponse({ error: errMsg }, 400);
      }

      const result = promoResult as Record<string, unknown>;
      if (result.valid !== true) {
        return jsonResponse({ error: "Invalid promo code" }, 400);
      }

      discountAmount = Number(result.discount_amount) || 0;
      promoCodeId = result.promo_code_id as string;
      promoCodeSnapshot = result.code as string;
    }

    const amount = Math.round((originalAmount - discountAmount) * 100) / 100;

    const orderFields = "order_ref, order_number, order_status, amount, currency, name, email, order_items, requirements_token_encrypted, promo_code_id, discount_amount, original_amount, locale";
    const { data: existingOrder } = await supabase.from("orders").select(orderFields).eq("checkout_attempt_id", checkoutAttemptId).maybeSingle();
    if (existingOrder) {
      if (existingOrder.order_status !== "pending_payment") return jsonResponse({ error: "Checkout attempt already completed" }, 409);
      if (Number(existingOrder.amount) !== amount || String(existingOrder.currency).toUpperCase() !== currency) return jsonResponse({ error: "Checkout attempt does not match cart" }, 409);
      const requirementsToken = await decryptToken(existingOrder.requirements_token_encrypted, await getEncryptionKey(supabase));
      return jsonResponse(buildCheckoutData({ ...existingOrder, order_items: existingOrder.order_items as CartItemInput[] }, merchantLogin, merchantSecret, requirementsToken, existingOrder.locale || locale));
    }

    const requirementsToken = generateToken();
    const requirementsTokenEncrypted = await encryptToken(requirementsToken, await getEncryptionKey(supabase));
    const orderRef = `vladenza-${Date.now()}-${crypto.randomUUID().slice(0, 5)}`;
    const orderNumberResult = await supabase.rpc("generate_order_number");
    const orderNumber = orderNumberResult.data as string || `NE-${Date.now()}`;
    const requirementsStatus = body.requirementsStatus === "provided" ? "received" : "pending";

    const insertPayload: Record<string, unknown> = {
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
      locale: locale === "uk" ? "uk" : "en",
      message: typeof body.message === "string" ? body.message : "",
      status: "pending_payment",
      order_status: "pending_payment",
      order_items: normalizedItems,
      requirements: Array.isArray(body.requirements) ? body.requirements : [],
      requirements_status: requirementsStatus,
      requirements_token_hash: hashToken(requirementsToken),
      requirements_token_encrypted: requirementsTokenEncrypted,
    };

    if (promoCodeId) {
      insertPayload.promo_code_id = promoCodeId;
      insertPayload.promo_code_snapshot = promoCodeSnapshot;
      insertPayload.discount_amount = discountAmount;
      insertPayload.original_amount = originalAmount;
    } else {
      insertPayload.discount_amount = 0;
      insertPayload.original_amount = originalAmount;
    }

    const { data: insertedOrder, error: insertError } = await supabase.from("orders").insert(insertPayload).select("id").single();

    if (insertError) {
      if (insertError.code === "23505") {
        const { data: racedOrder } = await supabase.from("orders").select(orderFields).eq("checkout_attempt_id", checkoutAttemptId).maybeSingle();
        if (racedOrder && racedOrder.order_status === "pending_payment" && Number(racedOrder.amount) === amount) {
          const racedToken = await decryptToken(racedOrder.requirements_token_encrypted, await getEncryptionKey(supabase));
          return jsonResponse(buildCheckoutData({ ...racedOrder, order_items: racedOrder.order_items as CartItemInput[] }, merchantLogin, merchantSecret, racedToken, locale));
        }
      }
      console.error("wayforpay-checkout insert failed", insertError);
      return jsonResponse({ error: "Could not create checkout" }, 500);
    }

    if (promoCodeId && insertedOrder) {
      await supabase.rpc("reserve_promo_code", {
        p_promo_code_id: promoCodeId,
        p_order_id: insertedOrder.id,
        p_discount_amount: discountAmount,
      });
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
      promo_code_id: promoCodeId,
      discount_amount: discountAmount,
      original_amount: originalAmount,
      locale: locale === "uk" ? "uk" : "en",
    }, merchantLogin, merchantSecret, requirementsToken, locale));
  } catch (err) {
    console.error("wayforpay-checkout error", err);
    return jsonResponse({ error: "Could not start checkout" }, 500);
  }
});
