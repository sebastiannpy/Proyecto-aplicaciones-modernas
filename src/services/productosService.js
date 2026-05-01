// src/services/productosService.js
// Llama al backend y mapea los campos del API al formato que usa el frontend

import { supabase } from '@/supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const API_URL = `${API_BASE_URL}/api/products`

const IMAGEN_DEFAULT = 'https://via.placeholder.com/900x600?text=Imagen+pendiente'

const CATEGORIAS_CANONICAS = {
  frenos: 'Frenos',
  motor: 'Motor',
  suspension: 'Suspensión',
  suspencion: 'Suspensión',
  electricidad: 'Electricidad',
  electrico: 'Electricidad',
  llantas: 'Llantas',
  llanta: 'Llantas',
  lubricante: 'Lubricantes',
  lubricantes: 'Lubricantes',
  repuesto: 'Repuestos',
  repuestos: 'Repuestos',
  respuesto: 'Repuestos',
  respuestos: 'Repuestos',
}

const CATEGORIAS_GENERICAS_NORMALIZADAS = new Set([
  'general',
  'otros',
  'otro',
])

function normalizarTexto(value = '') {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function normalizarCategoria(category = '') {
  const normalizada = normalizarTexto(category)
  return CATEGORIAS_CANONICAS[normalizada] || category || 'Motor'
}

function inferirCategoriaPorTexto(producto = {}) {
  const texto = `${producto?.name || ''} ${producto?.description || ''}`
  if (/(calcomania|calcomanía|sticker|emblema|adhesivo|vinilo)/i.test(texto)) return 'Repuestos'
  if (/(llanta|rin|neumatico|neum[aá]tico)/i.test(texto)) return 'Llantas'
  if (/(pastilla|disco|freno|dot\s*4|liquido\s*de\s*freno|zapata)/i.test(texto)) return 'Frenos'
  if (/(aceite|lubricante|atf|grasa|aditivo)/i.test(texto)) return 'Lubricantes'
  if (/(amortiguador|suspension|suspensi[oó]n|strut|resorte|bieleta|brazo)/i.test(texto)) return 'Suspensión'
  if (/(bateria|alternador|arranque|bobina|sensor|fusible|rele|eléctrico|electrico)/i.test(texto)) return 'Electricidad'
  return 'Motor'
}

function construirImagenVisual(imageUrl, producto) {
  if (!imageUrl) return null
  if (/^data:image\//i.test(imageUrl)) return imageUrl

  try {
    const u = new URL(imageUrl)
    const version = producto?.updated_at || producto?.id || Date.now()
    u.searchParams.set('v', String(version))
    return u.toString()
  } catch {
    return imageUrl
  }
}

// Mapea un producto del backend al formato del frontend
function mapearProducto(p) {
  let categoria = normalizarCategoria(p.category)
  if (CATEGORIAS_GENERICAS_NORMALIZADAS.has(normalizarTexto(categoria))) {
    categoria = inferirCategoriaPorTexto(p)
  }
  const imagenOriginal = p.image_url || ''
  const imagenVisual = construirImagenVisual(imagenOriginal, p)
  return {
    id:          p.id,
    nombre:      p.name,
    precio:      Number(p.price),
    categoria,
    marca:       p.brand,
    stock:       p.stock,
    descripcion: p.description || `${p.name} - ${p.brand}`,
    imagen:      imagenVisual || IMAGEN_DEFAULT,
    imagenOriginal,
    etiqueta:    p.stock <= 5 ? 'ÚLTIMAS UNIDADES' : undefined,
  }
}

// Obtiene todos los productos del backend
export async function obtenerProductos() {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error('Error al cargar productos')
  const data = await response.json()
  return data.map(mapearProducto)
}

async function getToken() {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token
}

export async function crearProductoAdmin(payload) {
  const token = await getToken()
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'No se pudo crear el producto')
  }
  return data
}

export async function actualizarProductoAdmin(productId, payload) {
  const token = await getToken()
  const res = await fetch(`${API_URL}/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'No se pudo actualizar el producto')
  }
  return data
}

export async function eliminarProductoAdmin(productId) {
  const token = await getToken()
  const res = await fetch(`${API_URL}/${productId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'No se pudo eliminar el producto')
  }
  return data
}

export async function bootstrapProductosAdmin() {
  const token = await getToken()
  const res = await fetch(`${API_URL}/bootstrap`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'No se pudo ejecutar el bootstrap de productos')
  }
  return data
}

export async function refrescarImagenesProductosAdmin() {
  const token = await getToken()
  const res = await fetch(`${API_URL}/refresh-images?force=1`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'No se pudo refrescar imágenes de productos')
  }
  return data
}

export async function subirImagenProductoStorage(file) {
  if (!file) throw new Error('Archivo de imagen requerido')
  const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase()
  const safeExt = /^(jpg|jpeg|png|webp|gif)$/i.test(ext) ? ext : 'jpg'
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExt}`

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, file, { upsert: false, contentType: file.type || 'image/jpeg' })

  if (uploadError) {
    throw new Error(uploadError.message || 'No se pudo subir la imagen a Storage')
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data?.publicUrl || ''
}
