import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { createHmac, randomBytes, createHash } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function hmacMd5(key: string, data: string): string {
  return createHmac("md5", key).update(data).digest("hex");
}

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// Server-side canonical pricing — the only source of truth for prices
const VALID_PRICES: Record<string, number> = {
  "niche-edit-dr10": 1,
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

        // Server-side price verification: look up canonical price by productId
        const canonicalPrice = VALID_PRICES[item.productId];
        if (canonicalPrice === undefined) {
          return new Response(JSON.stringify({ error: `Unknown product: ${item.productId}` }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        // Use the server-verified price, NOT the client-supplied price
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

    // Generate a cryptographically random requirements access token
    const requirementsToken = generateToken();
    const requirementsTokenHash = hashToken(requirementsToken);

    // Generate human-readable order number
    const { data: numData } = await supabase.rpc("generate_order_number");
    const orderNumber = numData as string || `NE-${Date.now()}`;

    // Store order items with server-verified prices
    const storedItems = items && Array.isArray(items) ? items.map((item) => ({
      productId: item.productId,
      name: item.name || item.productId,
      unitPrice: VALID_PRICES[item.productId] || item.unitPrice,
      quantity: item.quantity,
    })) : [];

    const reqStatus = requirementsStatus === "provided" ? "received" : "pending";

    const { error: dbError } = await supabase.from("orders").insert({
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
      requirements: requirements || [],
      requirements_status: reqStatus,
      requirements_token_hash: requirementsTokenHash,
    });

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
