import supabaseAdmin from "../data/supabaseAdminClient.js";

const ALLOWED_TYPES = [
  "registration_success",
  "purchase_confirmed",
  "purchase_in_transit",
  "purchase_delivered",
];

export async function createNotification({ userId, type, message, metadata = {} }) {
  if (!ALLOWED_TYPES.includes(type)) {
    throw new Error("Tipo de notificación inválido");
  }

  const { data, error } = await supabaseAdmin
    .from("notifications")
    .insert({
      user_id: userId,
      type,
      message,
      is_read: false,
      metadata,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function getNotificationsByUser(userId) {
  const { data, error } = await supabaseAdmin
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function markNotificationAsRead(userId, notificationId) {
  const { data, error } = await supabaseAdmin
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) return null;
  return data;
}
