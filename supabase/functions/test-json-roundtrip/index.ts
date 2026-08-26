import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const testRef = `test-rt-${Date.now()}`;

  // Nested objects and arrays that would become "[object Object]" if string-coerced
  const orderItems = [
    {
      productId: "niche-edit-dr10",
      name: "Niche Edit — DR10+",
      quantity: 2,
      unitPrice: 70,
    },
    {
      productId: "niche-edit-dr30",
      name: "Niche Edit — DR30+",
      quantity: 1,
      unitPrice: 110,
    },
  ];

  const paymentResult = {
    transactionStatus: "Approved",
    transactionId: "test-tx-123",
    authCode: "test-auth",
    cardPan: "54****8763",
    reasonCode: 1100,
    verifiedAt: new Date().toISOString(),
  };

  const cartSnapshot = {
    items: orderItems.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    total: 250,
    currency: "USD",
  };

  // Insert
  const { error: insertError } = await supabase.from("orders").insert({
    order_ref: testRef,
    order_number: `TEST-${Date.now()}`,
    package_name: "Test Package",
    amount: 250,
    currency: "USD",
    type: "payment",
    name: "Test User",
    email: "test@test.com",
    website: "https://test.com",
    status: "pending",
    order_status: "pending_payment",
    order_items: orderItems,
    payment_result: paymentResult,
    cart_snapshot: cartSnapshot,
  });

  if (insertError) {
    return new Response(
      JSON.stringify({ success: false, stage: "insert", error: insertError.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Read back
  const { data: fetched, error: fetchError } = await supabase
    .from("orders")
    .select("order_items, payment_result, cart_snapshot")
    .eq("order_ref", testRef)
    .single();

  if (fetchError || !fetched) {
    return new Response(
      JSON.stringify({ success: false, stage: "fetch", error: fetchError?.message || "no data" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Verify no string coercion happened
  const checks = {
    order_items_is_array: Array.isArray(fetched.order_items),
    order_items_length: Array.isArray(fetched.order_items) ? fetched.order_items.length : 0,
    order_items_no_coercion: JSON.stringify(fetched.order_items).indexOf("[object Object]") === -1,
    payment_result_is_object: typeof fetched.payment_result === "object" && fetched.payment_result !== null,
    payment_result_no_coercion: JSON.stringify(fetched.payment_result).indexOf("[object Object]") === -1,
    cart_snapshot_is_object: typeof fetched.cart_snapshot === "object" && fetched.cart_snapshot !== null,
    cart_snapshot_no_coercion: JSON.stringify(fetched.cart_snapshot).indexOf("[object Object]") === -1,
    cart_snapshot_has_total: typeof fetched.cart_snapshot?.total === "number",
    cart_snapshot_has_currency: typeof fetched.cart_snapshot?.currency === "string",
    cart_snapshot_items_is_array: Array.isArray(fetched.cart_snapshot?.items),
  };

  const allPassed = Object.values(checks).every((v) => v === true || (typeof v === "number" && v > 0));

  // Clean up
  await supabase.from("orders").delete().eq("order_ref", testRef);

  return new Response(
    JSON.stringify({
      success: allPassed,
      testRef,
      checks,
      fetchedData: fetched,
    }),
    {
      status: allPassed ? 200 : 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
