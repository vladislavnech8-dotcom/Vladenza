import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { createHash } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface RequirementInput {
  targetUrl: string;
  anchor: string;
  niche: string;
  notes: string;
  willProvideLater: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const url = new URL(req.url);
    let token = url.searchParams.get("token");
    let postBody: { token?: string; requirements?: RequirementInput[] } | null = null;

    // For POST, always read the body (contains requirements, and possibly token)
    if (req.method === "POST") {
      postBody = await req.json();
      if (!token) token = postBody?.token;
    }

    if (!token || token.length < 16) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing token" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokenHash = hashToken(token);

    // Look up order by token hash — never expose the database ID
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, order_number, order_status, name, email, order_items, requirements, requirements_status, amount, currency, cart_snapshot")
      .eq("requirements_token_hash", tokenHash)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired link" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only allow access if the order is paid
    const paidStatuses = ["paid", "ready_for_review", "requirements_pending", "in_progress", "completed"];
    if (!paidStatuses.includes(order.order_status)) {
      return new Response(
        JSON.stringify({ error: "This order has not been confirmed yet." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET: return order info for rendering the form
    if (req.method === "GET") {
      const orderItems = (order.order_items || []) as OrderItem[];
      const alreadySubmitted = order.requirements_status === "received";

      // Build placement sections from order_items
      const placements = orderItems.flatMap((item, itemIdx) => {
        const sections = [];
        for (let i = 0; i < item.quantity; i++) {
          sections.push({
            placementId: `${item.productId}-${itemIdx}-${i}`,
            packageLabel: item.name,
            productId: item.productId,
          });
        }
        return sections;
      });

      // Include any previously saved requirements
      const existingRequirements = (order.requirements || []) as unknown[];

      return new Response(
        JSON.stringify({
          success: true,
          orderNumber: order.order_number,
          alreadySubmitted,
          placements,
          existingRequirements,
          customerName: order.name,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST: save requirements
    if (req.method === "POST") {
      // Reject if already submitted
      if (order.requirements_status === "received") {
        return new Response(
          JSON.stringify({ error: "Requirements have already been submitted for this order." }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { requirements } = postBody as { requirements: RequirementInput[] };

      if (!Array.isArray(requirements) || requirements.length === 0) {
        return new Response(
          JSON.stringify({ error: "No requirements provided." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate each requirement
      const orderItems = (order.order_items || []) as OrderItem[];
      const expectedCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);

      if (requirements.length !== expectedCount) {
        return new Response(
          JSON.stringify({ error: `Expected ${expectedCount} placement requirements, received ${requirements.length}.` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      for (let i = 0; i < requirements.length; i++) {
        const r = requirements[i];
        if (!r.willProvideLater) {
          if (!r.targetUrl || !r.targetUrl.trim()) {
            return new Response(
              JSON.stringify({ error: `Placement ${i + 1}: Target URL is required.` }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          if (!r.anchor || !r.anchor.trim()) {
            return new Response(
              JSON.stringify({ error: `Placement ${i + 1}: Preferred anchor text is required.` }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          if (!r.niche || !r.niche.trim()) {
            return new Response(
              JSON.stringify({ error: `Placement ${i + 1}: Website niche/topic is required.` }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
      }

      // Save requirements and update status
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          requirements: requirements,
          requirements_status: "received",
          order_status: "ready_for_review",
        })
        .eq("id", order.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      return new Response(
        JSON.stringify({ success: true, message: "Requirements saved successfully." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("order-requirements error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
