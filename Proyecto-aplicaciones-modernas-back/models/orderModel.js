import supabaseAdmin from "../data/supabaseAdminClient.js";

function makeOrderNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  return `ORD-${y}${m}${d}-${random}`;
}

export async function createOrder({
  userId,
  totalAmount,
  paymentMethod,
  delivery = {},
  items = [],
}) {
  const orderNumber = makeOrderNumber();

  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: userId,
      status: "pendiente",
      total_amount: totalAmount,
      payment_method: paymentMethod,
      delivery_city: delivery.ciudad || null,
      delivery_address: delivery.direccion || null,
      delivery_reference: delivery.referencia || null,
      estimated_delivery_at: delivery.estimatedDate || null,
      items_snapshot: items,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function listOrdersByUser(userId) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}
