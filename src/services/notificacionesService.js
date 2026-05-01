import { supabase } from "@/supabase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const BASE = `${API_BASE_URL}/api/notifications`;

async function getToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

async function headers() {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function obtenerNotificaciones() {
  const res = await fetch(BASE, { headers: await headers() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "No se pudieron cargar notificaciones");
  return {
    notifications: data.notifications || [],
    unreadCount: data.unreadCount || 0,
  };
}

export async function marcarNotificacionLeida(id) {
  const res = await fetch(`${BASE}/${id}/read`, {
    method: "PATCH",
    headers: await headers(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "No se pudo marcar notificación");
  return data.notification;
}
