import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { createHmac, createHash } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function hmacMd5(key: string, data: string): string {
  return createHmac("md5", key).update(data).digest("hex");
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// AES-256-GCM authenticated encryption using Web Crypto API
// Output format: "ivHex:tagHex:ciphertextHex"
async function encryptToken(token: string, keyHex: string): Promise<string> {
  const keyBytes = new Uint8Array(keyHex.match(/.{2}/g)!.map(h => parseInt(h, 16)));
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
  const encoded = new TextEncoder().encode(token);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cryptoKey, encoded);
  const encryptedBytes = new Uint8Array(encrypted);
  // Web Crypto AES-GCM appends the 16-byte tag to the ciphertext
  const ciphertext = encryptedBytes.slice(0, encryptedBytes.length - 16);
  const tag = encryptedBytes.slice(encryptedBytes.length - 16);
  const toHex = (arr: Uint8Array) => Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
  return `${toHex(iv)}:${toHex(tag)}:${toHex(ciphertext)}`;
}

// Fetch the encryption key from env or database fallback
async function getEncryptionKey(supabase: ReturnType<typeof createClient>): Promise<string> {
  const envKey = Deno.env.get("REQUIREMENTS_TOKEN_ENCRYPTION_KEY");
  if (envKey) return envKey;

  const { data, error } = await supabase
    .from("app_secrets")
    .select("value")
    .eq("name", "REQUIREMENTS_TOKEN_ENCRYPTION_KEY")
    .single();

  if (error || !data) throw new Error("Encryption key not configured");
  return data.value as string;
}

// Server-side canonical pricing — the only source of truth for prices
const VALID_PRICES: Record<string, number> = {
  "niche-edit-dr10": 70,
  "niche-edit-dr20": 90,
  "niche-edit-dr30": 110,
  "niche-edit-dr40": 200,
  "niche-edit-dr50": 280,
  "niche-edit-dr60": 400,
};

interface CartItemInput {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { currency, name, email, phone, website, company, message, type, items, requirements, requirementsStatus } = body as {
      currency?: string;
      name?: string;
      email?: string;
      phone?: string;
      website?: string;
      company?: string;
      message?: string;
      type?: string;
      items?: CartItemInput[];
      requirements?: unknown;
      requirementsStatus?: string;
    };

    let amount: number;
    let productNames: string[];
    let productCounts: number[];
    let productPrices: number[];
    let packageName: string;

    if (items && Array.isArray(items) && items.length > 0) {
      let computedTotal = 0;
      productNames = [];
      productCounts = [];
      productPrices = [];

      for (const item of items) {
        const qty = Number(item.quantity);
        if (!Number.isFinite(qty) || qty < 1 || !Number.isInteger(qty)) {
          return new Response(JSON.stringify({ error: "Invalid item quantity" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        const canonicalPrice = VALID_PRICES[item.productId];
        if (canonicalPrice === undefined) {
          return new Response(JSON.stringify({ error: `Unknown product: ${item.productId}` }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        productPrices.push(canonicalPrice);
        productCounts.push(qty);
        productNames.push(item.name || item.productId);
        computedTotal += canonicalPrice * qty;
      }

      amount = Math.round(computedTotal * 100) / 100;
      if (amount <= 0) {
        return new Response(JSON.stringify({ error: "Cart total must be greater than zero" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      packageName = productNames.join("; ");
    } else {
      packageName = body.packageName || "Custom Package";
      amount = Number(body.amount);
      productNames = [packageName];
      productCounts = [1];
      productPrices = [amount];
    }

    const safeWebsite = website || "";
    const safePhone = (phone && phone.trim().length >= 7) ? phone : "000000000000";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const orderRef = `vladenza-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const orderDate = Math.floor(Date.now() / 1000);

    // Generate cryptographically random requirements access token
    const requirementsToken = generateToken();
    const requirementsTokenHash = hashToken(requirementsToken);

    // Encrypt the token for server-side storage (decryptable by email function)
    const encryptionKey = await getEncryptionKey(supabase);
    const requirementsTokenEncrypted = await encryptToken(requirementsToken, encryptionKey);

    const { data: numData } = await supabase.rpc("generate_order_number");
    const orderNumber = numData as string || `NE-${Date.now()}`;

    // Store order items as a proper JSON array of objects (never stringified)
    const storedItems: CartItemInput[] = items && Array.isArray(items) ? items.map((item) => ({
      productId: item.productId,
      name: item.name || item.productId,
      unitPrice: VALID_PRICES[item.productId] || item.unitPrice,
      quantity: item.quantity,
    })) : [];

    const reqStatus = requirementsStatus === "provided" ? "received" : "pending";

    const insertPayload: Record<string, unknown> = {
      order_ref: orderRef,
      order_number: orderNumber,
      package_name: packageName,
      amount: amount,
      currency: currency || "USD",
      type: type || "payment",
      name: name || "",
      email: email || "",
      website: safeWebsite,
      company: company || "",
      message: message || "",
      status: type === "consultation" ? "consultation" : "pending_payment",
      order_status: type === "consultation" ? "pending_payment" : "pending_payment",
      order_items: storedItems,
      requirements: Array.isArray(requirements) ? requirements : [],
      requirements_status: reqStatus,
      requirements_token_hash: requirementsTokenHash,
    };

    if (requirementsTokenEncrypted) {
      insertPayload.requirements_token_encrypted = requirementsTokenEncrypted;
    }

    const { error: dbError } = await supabase.from("orders").insert(insertPayload);

    if (dbError) throw new Error(dbError.message);

    if (type === "consultation") {
      return new Response(JSON.stringify({ success: true, orderRef }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const merchantLogin = Deno.env.get("WFP_MERCHANT_LOGIN")!;
    const merchantSecret = Deno.env.get("WFP_MERCHANT_SECRET")!;

    if (!merchantLogin || !merchantSecret) {
      throw new Error("WayForPay credentials not configured");
    }

    const cur = currency || "USD";
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    const secureType = "AUTO";
    const signString = [
      merchantLogin,
      "vladenza.com",
      orderRef,
      orderDate.toString(),
      amount.toString(),
      cur,
      ...productNames,
      ...productCounts.map(String),
      ...productPrices.map(String),
    ].join(";");

    const signature = hmacMd5(merchantSecret, signString);

    const nameParts = (name || "").trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "-";

    const checkoutData = {
      merchantAccount: merchantLogin,
      merchantDomainName: "vladenza.com",
      merchantTransactionSecureType: secureType,
      authorizationType: "SimpleSignature",
      merchantSignature: signature,
      orderReference: orderRef,
      orderDate: orderDate,
      amount: amount,
      currency: cur,
      productName: productNames,
      productCount: productCounts,
      productPrice: productPrices,
      clientFirstName: firstName,
      clientLastName: lastName,
      clientEmail: email,
      clientPhone: safePhone,
      language: "EN",
      serviceUrl: `${Deno.env.get("SUPABASE_URL")}/functions/v1/wayforpay-webhook`,
    };

    return new Response(JSON.stringify({ success: true, orderRef, orderNumber, requirementsToken, checkoutData }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
