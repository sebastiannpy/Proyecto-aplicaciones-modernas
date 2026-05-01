import supabaseAdmin from "../data/supabaseAdminClient.js";

export async function listReviewsByProduct(productId) {
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getUserReview(userId, productId) {
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

export async function hasUserPurchasedProduct(userId, productId) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("items_snapshot")
    .eq("user_id", userId);

  if (error) throw error;
  const orders = data || [];

  return orders.some((order) => {
    const items = Array.isArray(order.items_snapshot) ? order.items_snapshot : [];
    return items.some((item) => Number(item.product_id) === Number(productId));
  });
}

export async function upsertReview({
  userId,
  productId,
  rating,
  comment,
  reviewerName,
}) {
  const existing = await getUserReview(userId, productId);

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .update({
        rating,
        comment,
        reviewer_name: reviewerName,
      })
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .insert({
      user_id: userId,
      product_id: productId,
      rating,
      comment,
      reviewer_name: reviewerName,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
