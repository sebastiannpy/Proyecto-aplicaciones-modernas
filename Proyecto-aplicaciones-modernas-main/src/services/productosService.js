// src/services/productosService.js
// Llama al backend y mapea los campos del API al formato que usa el frontend

import { supabase } from '@/supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const API_URL = `${API_BASE_URL}/api/products`

// Imagen por defecto por categoría si el producto no tiene imagen en BD
const IMAGENES = {
  'Frenos':       'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774496131/pastillas_br4ude.jpg',
  'Motor':        'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774496115/bujia_vphaxm.jpg',
  'Suspensión':   'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774496100/amortiguador_egqox4.jpg',
  'Electricidad': 'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774496027/bateria_f009t4.jpg',
  'Llantas':      'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774496042/llanta_jhrwxh.jpg',
}

const IMAGEN_DEFAULT = 'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774496084/filtro_udekev.jpg'

const CATEGORIAS_CANONICAS = {
  frenos: 'Frenos',
  motor: 'Motor',
  suspension: 'Suspensión',
  suspencion: 'Suspensión',
  electricidad: 'Electricidad',
  electrico: 'Electricidad',
  llantas: 'Llantas',
  llanta: 'Llantas',
}

const IMAGENES_POR_KEYWORD = [
  { regex: /(pastilla|disco|freno|dot\s*4|liquido\s*de\s*freno)/i, image: 'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774496131/pastillas_br4ude.jpg' },
  { regex: /(bujia|filtro|aceite|radiador|motor)/i, image: 'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774496115/bujia_vphaxm.jpg' },
  { regex: /(amortiguador|suspension|suspensi[oó]n|strut|resorte)/i, image: 'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774496100/amortiguador_egqox4.jpg' },
  { regex: /(bateria|alternador|arranque|bobina|electri)/i, image: 'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774496027/bateria_f009t4.jpg' },
  { regex: /(llanta|rin|neumatico|neum[aá]tico)/i, image: 'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774496042/llanta_jhrwxh.jpg' },
]

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

function imagenPorTipoProducto(producto) {
  const texto = `${producto?.name || ''} ${producto?.description || ''}`
  const encontrada = IMAGENES_POR_KEYWORD.find((item) => item.regex.test(texto))
  if (encontrada) return encontrada.image
  const categoria = normalizarCategoria(producto?.category)
  return IMAGENES[categoria] || IMAGEN_DEFAULT
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
  const categoria = normalizarCategoria(p.category)
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
    imagen:      imagenVisual || imagenPorTipoProducto(p),
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
