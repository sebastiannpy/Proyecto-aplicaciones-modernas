import { supabase } from "@/supabase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const BASE = `${API_BASE_URL}/api/delivery`;

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

export async function estimarEntrega(payload) {
  const res = await fetch(`${BASE}/estimate`, {
    method: "POST",
    headers: await headers(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const firstValidationError = data.errors?.[0]?.msg;
    throw new Error(firstValidationError || data.message || "No se pudo calcular el tiempo de entrega");
  }
  return data;
}
