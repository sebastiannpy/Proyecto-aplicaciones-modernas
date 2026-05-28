// src/services/carritoService.js
import { supabase } from '@/supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const BASE = `${API_BASE_URL}/api/cart`

async function getToken() {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token
}

async function headers() {
  const token = await getToken()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export async function obtenerCarrito() {
  const res = await fetch(BASE, { headers: await headers() })
  if (!res.ok) throw new Error('Error al obtener carrito')
  return res.json()
}

export async function agregarItem(product_id, quantity = 1) {
  const pid = Number(product_id)
  if (!Number.isInteger(pid) || pid <= 0) {
    throw new Error('Producto inválido para agregar al carrito')
  }

  const res = await fetch(`${BASE}/items`, {
    method: 'POST',
    headers: await headers(),
    body: JSON.stringify({ product_id: pid, quantity })
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const validationMsg = Array.isArray(data?.errors) ? data.errors.map((e) => e.msg).join(' | ') : ''
    throw new Error(data.message || validationMsg || 'Error al agregar')
  }
  return data
}

export async function actualizarItem(itemId, quantity) {
  const res = await fetch(`${BASE}/items/${itemId}`, {
    method: 'PUT',
    headers: await headers(),
    body: JSON.stringify({ quantity })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al actualizar')
  return data
}

export async function eliminarItem(itemId) {
  const res = await fetch(`${BASE}/items/${itemId}`, {
    method: 'DELETE',
    headers: await headers()
  })
  if (!res.ok) throw new Error('Error al eliminar item')
  return res.json()
}

export async function vaciarCarrito() {
  const res = await fetch(BASE, {
    method: 'DELETE',
    headers: await headers()
  })
  if (!res.ok) throw new Error('Error al vaciar carrito')
  return res.json()
}
