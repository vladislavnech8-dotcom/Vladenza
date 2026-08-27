import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const VALID_ORDER_STATUSES = [
  "requirements_pending",
  "ready_for_review",
  "in_progress",
  "completed",
  "cancelled",
];

interface OrderRow {
  id: string;
  order_ref: string;
  order_number: string | null;
  package_name: string;
  amount: number;
  currency: string;
  type: string;
  name: string;
  email: string;
  website: string;
  company: string;
  message: string;
  status: string;
  order_status: string;
  order_items: unknown;
  requirements: unknown;
  requirements_status: string;
  cart_snapshot: unknown;
  created_at: string;
  paid_at: string | null;
  updated_at: string | null;
  wfp_transaction_id: string | null;
  admin_notes: string;
  status_changed_by: string;
}

function sanitizeOrder(row: OrderRow) {
  return {
    id: row.id,
    orderRef: row.order_ref,
    orderNumber: row.order_number ?? "",
    packageName: row.package_name,
    amount: Number(row.amount),
    currency: row.currency,
    type: row.type,
    name: row.name,
    email: row.email,
    website: row.website,
    company: row.company,
    message: row.message,
    status: row.status,
    orderStatus: row.order_status,
    orderItems: row.order_items ?? [],
    requirements: row.requirements ?? [],
    requirementsStatus: row.requirements_status,
    cartSnapshot: row.cart_snapshot ?? null,
    createdAt: row.created_at,
    paidAt: row.paid_at,
    updatedAt: row.updated_at,
    wfpTransactionId: row.wfp_transaction_id ?? "",
    adminNotes: row.admin_notes ?? "",
    statusChangedBy: row.status_changed_by ?? "",
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    // Extract the user's JWT from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userToken = authHeader.replace("Bearer ", "");

    // Verify the user's session and get their email
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: { headers: { Authorization: `Bearer ${userToken}` } },
      },
    );

    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userEmail = userData.user.email;
    if (!userEmail) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin allowlist
    const { data: allowlistData } = await supabase
      .from("app_secrets")
      .select("value")
      .eq("name", "ADMIN_EMAIL_ALLOWLIST")
      .single();

    const allowlist = (allowlistData?.value ?? "")
      .split(",")
      .map((e: string) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!allowlist.includes(userEmail.toLowerCase())) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);

    // GET: list orders with pagination, search, filters
    if (req.method === "GET") {
      const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
      const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get("perPage") ?? "20", 10)));
      const search = (url.searchParams.get("search") ?? "").trim();
      const paymentStatus = url.searchParams.get("paymentStatus") ?? "all";
      const orderStatus = url.searchParams.get("orderStatus") ?? "all";
      const reqStatus = url.searchParams.get("requirementsStatus") ?? "all";

      let query = supabase
        .from("orders")
        .select(
          "id, order_ref, order_number, package_name, amount, currency, type, name, email, website, company, message, status, order_status, order_items, requirements, requirements_status, cart_snapshot, created_at, paid_at, updated_at, wfp_transaction_id, admin_notes, status_changed_by",
          { count: "exact" },
        );

      // Only show paid orders
      query = query.in("status", ["paid", "refunded", "cancelled"]);

      if (paymentStatus !== "all") {
        query = query.eq("status", paymentStatus);
      }
      if (orderStatus !== "all") {
        query = query.eq("order_status", orderStatus);
      }
      if (reqStatus !== "all") {
        query = query.eq("requirements_status", reqStatus);
      }
      if (search) {
        query = query.or(
          `order_number.ilike.%${search}%,email.ilike.%${search}%,name.ilike.%${search}%,website.ilike.%${search}%`,
        );
      }

      query = query.order("created_at", { ascending: false });
      query = query.range((page - 1) * perPage, page * perPage - 1);

      const { data: rows, error: queryError, count } = await query;

      if (queryError) {
        return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          orders: (rows ?? []).map(sanitizeOrder),
          total: count ?? 0,
          page,
          perPage,
          totalPages: Math.ceil((count ?? 0) / perPage),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // POST: update order status or admin notes
    if (req.method === "POST") {
      const body = await req.json();
      const { orderId, action, value } = body as {
        orderId: string;
        action: "updateStatus" | "updateNotes";
        value: string;
      };

      if (!orderId || !action || !value) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (action === "updateStatus") {
        if (!VALID_ORDER_STATUSES.includes(value)) {
          return new Response(JSON.stringify({ error: "Invalid status" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { error: updateError } = await supabase
          .from("orders")
          .update({
            order_status: value,
            status_changed_by: userEmail,
          })
          .eq("id", orderId);

        if (updateError) {
          return new Response(JSON.stringify({ error: "Failed to update status" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(
          JSON.stringify({ success: true, message: "Status updated" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if (action === "updateNotes") {
        const { error: updateError } = await supabase
          .from("orders")
          .update({ admin_notes: value })
          .eq("id", orderId);

        if (updateError) {
          return new Response(JSON.stringify({ error: "Failed to update notes" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(
          JSON.stringify({ success: true, message: "Notes updated" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      return new Response(JSON.stringify({ error: "Unknown action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("admin-orders error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
