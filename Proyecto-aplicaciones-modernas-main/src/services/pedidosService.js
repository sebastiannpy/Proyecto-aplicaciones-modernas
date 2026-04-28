import { supabase } from "@/supabase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const BASE = `${API_BASE_URL}/api/orders`;

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

export async function obtenerPedidos() {
  const res = await fetch(BASE, { headers: await headers() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "No se pudieron cargar los pedidos");
  return data.orders || [];
}
