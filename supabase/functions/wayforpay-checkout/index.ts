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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { packageName, amount, currency, name, email, phone, website, message, type } = await req.json();

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
      amount: parseFloat(amount),
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
    const amountValue = Number(amount);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      throw new Error("Invalid payment amount");
    }

    const secureType = "AUTO";
    const productNames = [packageName];
    const productCounts = [1];
    const productPrices = [amountValue];
    const signString = [
      merchantLogin,
      "vladenza.com",
      orderRef,
      orderDate.toString(),
      amountValue.toString(),
      cur,
      ...productNames,
      ...productCounts.map(String),
      ...productPrices.map(String),
    ].join(";");

    console.log("WayForPay merchantSignature input:", signString);
    const signature = hmacMd5(merchantSecret, signString);

    const nameParts = (name as string).trim().split(/\s+/);
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
      amount: amountValue,
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
