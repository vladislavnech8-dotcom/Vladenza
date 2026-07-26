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
    const body = await req.json();
    const { orderReference, transactionStatus, merchantSignature } = body;

    const merchantSecret = Deno.env.get("WFP_MERCHANT_SECRET") || "";

    if (merchantSecret) {
      const signString = [orderReference, transactionStatus].join(";");
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

    const status = transactionStatus === "Approved" ? "paid" : "failed";
    const update: Record<string, unknown> = { status };
    if (status === "paid") update.paid_at = new Date().toISOString();

    await supabase.from("orders").update(update).eq("order_ref", orderReference);

    const merchantLogin = Deno.env.get("WFP_MERCHANT_LOGIN") || "";
    const responseSignString = [orderReference, "accept"].join(";");
    const responseSig = merchantSecret ? hmacMd5(merchantSecret, responseSignString) : "demo";

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
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
