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
    const { currency, name, email, phone, website, message, type, items } = body as {
      currency?: string;
      name?: string;
      email?: string;
      phone?: string;
      website?: string;
      message?: string;
      type?: string;
      items?: CartItemInput[];
    };

    // --- Determine amount and product names from cart items if provided ---
    let amount: number;
    let productNames: string[];
    let productCounts: number[];
    let productPrices: number[];
    let packageName: string;

    if (items && Array.isArray(items) && items.length > 0) {
      // Cart-based checkout: compute totals server-side from item data
      // unitPrice comes from the client but is validated: must be positive number
      let computedTotal = 0;
      productNames = [];
      productCounts = [];
      productPrices = [];

      for (const item of items) {
        const price = Number(item.unitPrice);
        const qty = Number(item.quantity);
        if (!Number.isFinite(price) || price <= 0) {
          return new Response(JSON.stringify({ error: "Invalid item price" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (!Number.isFinite(qty) || qty < 1 || !Number.isInteger(qty)) {
          return new Response(JSON.stringify({ error: "Invalid item quantity" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const lineTotal = price * qty;
        computedTotal += lineTotal;
        productNames.push(item.name || item.productId);
        productCounts.push(qty);
        productPrices.push(price);
      }

      amount = Math.round(computedTotal * 100) / 100;
      if (amount <= 0) {
        return new Response(JSON.stringify({ error: "Cart total must be greater than zero" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      packageName = productNames.join("; ");
    } else {
      // Legacy single-package checkout (backward compatible with OrderModal)
      packageName = body.packageName || "Custom Package";
      amount = Number(body.amount);
      productNames = [packageName];
      productCounts = [1];
      productPrices = [amount];
    }

    if (type !== "consultation") {
      if (!website || typeof website !== "string") {
        return new Response(JSON.stringify({ error: "Website URL is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      try {
        const parsed = new URL(website);
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
      } catch {
        return new Response(JSON.stringify({ error: "Invalid website URL" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!phone || typeof phone !== "string" || phone.trim().length < 7) {
        return new Response(JSON.stringify({ error: "Valid phone number is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const orderRef = `vladenza-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const orderDate = Math.floor(Date.now() / 1000);

    const { error: dbError } = await supabase.from("orders").insert({
      order_ref: orderRef,
      package_name: packageName,
      amount: amount,
      currency: currency || "USD",
      type: type || "payment",
      name: name || "",
      email: email || "",
      website: website || "",
      message: message || "",
      status: type === "consultation" ? "consultation" : "pending",
    });

    if (dbError) throw new Error(dbError.message);

    if (type === "consultation") {
      return new Response(JSON.stringify({ success: true, orderRef }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
      clientPhone: phone || "000000000000",
      language: "EN",
      serviceUrl: `${Deno.env.get("SUPABASE_URL")}/functions/v1/wayforpay-webhook`,
    };

    return new Response(JSON.stringify({ success: true, orderRef, checkoutData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
