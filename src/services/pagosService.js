import { supabase } from "@/supabase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const BASE = `${API_BASE_URL}/api/payments`;

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

export async function obtenerMetodosPago() {
  const res = await fetch(`${BASE}/methods`, { headers: await headers() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "No se pudieron cargar los métodos de pago");
  return data.methods || [];
}

export async function procesarPago(payload) {
  const res = await fetch(`${BASE}/process`, {
    method: "POST",
    headers: await headers(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "No se pudo procesar el pago");
  return data;
}
