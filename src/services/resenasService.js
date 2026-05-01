import { supabase } from "@/supabase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const BASE = `${API_BASE_URL}/api/reviews`;

async function getToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

async function authHeaders() {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function obtenerResenasProducto(productId) {
  const res = await fetch(`${BASE}/product/${productId}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "No se pudieron cargar las reseñas");
  return data;
}

export async function obtenerEstadoMiResena(productId) {
  const res = await fetch(`${BASE}/product/${productId}/me`, {
    headers: await authHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "No se pudo consultar tu estado de reseña");
  return data;
}

export async function guardarResena(payload) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const validationError = data.errors?.[0]?.msg;
    throw new Error(validationError || data.message || "No se pudo guardar la reseña");
  }
  return data.review;
}
