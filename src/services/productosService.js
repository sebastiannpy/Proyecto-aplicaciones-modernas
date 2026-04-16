// src/services/productosService.js
// Llama al backend y mapea los campos del API al formato que usa el frontend

const API_URL = 'http://localhost:3000/api/products'

// Imagen por defecto por categoría si el producto no tiene imagen en BD
const IMAGENES = {
  'Frenos':       'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774496131/pastillas_br4ude.jpg',
  'Motor':        'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774496115/bujia_vphaxm.jpg',
  'Suspensión':   'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774496100/amortiguador_egqox4.jpg',
  'Electricidad': 'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774495865/radiador_njswnj.jpg',
  'Llantas':      'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774496042/llanta_jhrwxh.jpg',
}

const IMAGEN_DEFAULT = 'https://res.cloudinary.com/db69rnqvy/image/upload/q_auto,f_auto,w_400/v1774496084/filtro_udekev.jpg'

// Mapea un producto del backend al formato del frontend
function mapearProducto(p) {
  return {
    id:          p.id,
    nombre:      p.name,
    precio:      Number(p.price),
    categoria:   p.category,
    marca:       p.brand,
    stock:       p.stock,
    descripcion: p.description || `${p.name} - ${p.brand}`,
    imagen:      p.image_url || IMAGENES[p.category] || IMAGEN_DEFAULT,
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