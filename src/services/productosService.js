// src/services/productosService.js
import { supabase } from '@/supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const API_URL = `${API_BASE_URL}/api/products`

// ─── Imágenes Cloudinary del proyecto (siempre disponibles) ───────────────────
const CL = {
  pastillas:    'https://res.cloudinary.com/db69rnqvy/image/upload/v1774496131/pastillas_br4ude.jpg',
  bujia:        'https://res.cloudinary.com/db69rnqvy/image/upload/v1774496115/bujia_vphaxm.jpg',
  filtro:       'https://res.cloudinary.com/db69rnqvy/image/upload/v1774496069/filtro_gezkpd.jpg',
  aceite:       'https://res.cloudinary.com/db69rnqvy/image/upload/v1774496056/aceite_kpo22t.jpg',
  amortiguador: 'https://res.cloudinary.com/db69rnqvy/image/upload/v1774496100/amortiguador_egqox4.jpg',
  kitSus:       'https://res.cloudinary.com/db69rnqvy/image/upload/v1774496007/2-11403-11404-001_Unity_Fully_Loaded_Strut_Set_Of_2_For_Chevy_Left_Right_Pair_qeku8i.jpg',
  bateria:      'https://res.cloudinary.com/db69rnqvy/image/upload/v1774496027/bateria_f009t4.jpg',
  llanta:       'https://res.cloudinary.com/db69rnqvy/image/upload/v1774496042/llanta_jhrwxh.jpg',
  llanta2:      'https://res.cloudinary.com/db69rnqvy/image/upload/v1774495989/llanta2_wa551a.jpg',
}

// ─── Reglas de imagen por nombre/descripción ─────────────────────────────────
// Orden importa: más específico primero
const IMAGENES_POR_NOMBRE = [
  // FRENOS
  { re: /(pastilla)/i,                                                          url: CL.pastillas    },
  { re: /(zapata)/i,                                                            url: CL.pastillas    },
  { re: /(disco.*freno|freno.*disco|disco.*freno|freno ventilado)/i,            url: CL.pastillas    },
  { re: /(bomba.*freno|freno.*bomba|bomba principal)/i,                         url: CL.pastillas    },
  { re: /(liquido.*freno|dot\s*4)/i,                                            url: CL.aceite       },
  { re: /(sensor.*desgaste|desgaste.*sensor|herraje|kit.*freno)/i,              url: CL.pastillas    },

  // MOTOR — filtros específicos antes que genérico
  { re: /(filtro.*aceite|aceite.*filtro|filtro.*premium)/i,                     url: CL.filtro       },
  { re: /(filtro.*aire|aire.*filtro|filtro.*motor)/i,                           url: CL.filtro       },
  { re: /(filtro.*cabina|cabina.*filtro)/i,                                     url: CL.filtro       },
  { re: /(filtro)/i,                                                            url: CL.filtro       },

  // BUJÍA / ENCENDIDO
  { re: /(bujia|bujía)/i,                                                       url: CL.bujia        },
  { re: /(bobina.*encendido|encendido.*bobina)/i,                               url: CL.bujia        },
  { re: /(sensor.*oxig|oxig.*sensor)/i,                                         url: CL.bujia        },

  // MOTOR MECÁNICO
  { re: /(correa.*distribuc|distribuc.*correa|tensor.*correa|correa.*tensor|timing)/i, url: CL.bateria },
  { re: /(empaque.*culata|culata.*empaque|junta.*culata)/i,                     url: CL.bateria      },
  { re: /(bomba.*agua|agua.*bomba)/i,                                           url: CL.bateria      },

  // ACEITES / LUBRICANTES
  { re: /(grasa)/i,                                                             url: CL.aceite       },
  { re: /(aditivo|limpiador.*inyect)/i,                                         url: CL.aceite       },
  { re: /(atf|transmis)/i,                                                      url: CL.aceite       },
  { re: /(aceite|lubricante)/i,                                                 url: CL.aceite       },

  // SUSPENSIÓN
  { re: /(kit.*suspens|suspens.*kit)/i,                                         url: CL.kitSus       },
  { re: /(amortiguador)/i,                                                      url: CL.amortiguador },
  { re: /(brazo.*suspens|suspens.*brazo|brazo.*inferior|brazo.*superior)/i,     url: CL.amortiguador },
  { re: /(terminal.*direcc|direcc.*terminal)/i,                                 url: CL.amortiguador },
  { re: /(bieleta|base.*amortiguador)/i,                                        url: CL.amortiguador },

  // ELECTRICIDAD
  { re: /(bateria|batería)/i,                                                   url: CL.bateria      },
  { re: /(alternador)/i,                                                        url: CL.bateria      },
  { re: /(motor.*arranque|arranque)/i,                                          url: CL.bateria      },
  { re: /(rele|relé)/i,                                                         url: CL.bateria      },
  { re: /(fusible)/i,                                                           url: CL.bateria      },
  { re: /(sensor)/i,                                                            url: CL.bujia        },

  // LLANTAS / RINES
  { re: /(rin|rueda.*alumin)/i,                                                 url: CL.llanta2      },
  { re: /(valvula.*llanta|tpms)/i,                                              url: CL.llanta       },
  { re: /(llanta.*205|llanta.*215)/i,                                           url: CL.llanta2      },
  { re: /(llanta|neumatico|neumático)/i,                                        url: CL.llanta       },

  // REPUESTOS VARIOS
  { re: /(espejo)/i,                                                            url: CL.bateria      },
  { re: /(manija)/i,                                                            url: CL.bateria      },
  { re: /(manguera.*radiador|tapon.*radiador|radiador)/i,                       url: CL.bateria      },
  { re: /(calcomania|sticker|emblema)/i,                                        url: CL.llanta       },
]

const CATEGORIAS_CANONICAS = {
  frenos: 'Frenos', motor: 'Motor',
  suspension: 'Suspensión', suspencion: 'Suspensión',
  electricidad: 'Electricidad', electrico: 'Electricidad',
  llantas: 'Llantas', llanta: 'Llantas',
  lubricante: 'Lubricantes', lubricantes: 'Lubricantes',
  repuesto: 'Repuestos', repuestos: 'Repuestos',
}

function normalizarTexto(v = '') {
  return v.toString().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function normalizarCategoria(category = '') {
  return CATEGORIAS_CANONICAS[normalizarTexto(category)] || category || 'Motor'
}

function inferirCategoriaPorTexto(p = {}) {
  const t = `${p?.name || ''} ${p?.description || ''}`
  if (/(calcomania|sticker|emblema|espejo|manija|manguera|tapon)/i.test(t)) return 'Repuestos'
  if (/(llanta|rin|neumatico)/i.test(t)) return 'Llantas'
  if (/(pastilla|disco.*freno|freno|dot\s*4|zapata)/i.test(t)) return 'Frenos'
  if (/(aceite|lubricante|atf|grasa|aditivo)/i.test(t)) return 'Lubricantes'
  if (/(amortiguador|suspension|strut|bieleta|brazo|terminal)/i.test(t)) return 'Suspensión'
  if (/(bateria|alternador|arranque|bobina|sensor|fusible|rele)/i.test(t)) return 'Electricidad'
  return 'Motor'
}

// URLs que no son imágenes reales de producto
const URL_INVALIDAS = /unsplash\.com|pexels\.com|loremflickr|picsum|dummyimage|placehold|lorempixel|wikimedia|wikipedia/i

function imagenPorNombre(p = {}) {
  const texto = `${p?.name || ''} ${p?.description || ''}`
  return IMAGENES_POR_NOMBRE.find(r => r.re.test(texto))?.url || CL.filtro
}

function resolverImagen(p) {
  const url = (p.image_url || '').trim()
  // Si no tiene URL, o es una URL inválida/genérica → usar imagen por nombre
  if (!url || URL_INVALIDAS.test(url)) return imagenPorNombre(p)
  try {
    new URL(url)
    return url
  } catch {
    return imagenPorNombre(p)
  }
}

function mapearProducto(p) {
  let categoria = normalizarCategoria(p.category)
  if (['general', 'otros', 'otro'].includes(normalizarTexto(categoria))) {
    categoria = inferirCategoriaPorTexto(p)
  }

  return {
    id:           p.id,
    nombre:       p.name,
    precio:       Number(p.price),
    categoria,
    marca:        p.brand,
    stock:        p.stock,
    descripcion:  p.description || `${p.name} - ${p.brand}`,
    imagen:       resolverImagen(p),
    imagenOriginal: p.image_url || '',
    etiqueta:     p.stock <= 5 ? 'ÚLTIMAS UNIDADES' : undefined,
  }
}

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
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'No se pudo crear el producto')
  return data
}

export async function actualizarProductoAdmin(productId, payload) {
  const token = await getToken()
  const res = await fetch(`${API_URL}/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'No se pudo actualizar el producto')
  return data
}

export async function eliminarProductoAdmin(productId) {
  const token = await getToken()
  const res = await fetch(`${API_URL}/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'No se pudo eliminar el producto')
  return data
}

export async function bootstrapProductosAdmin() {
  const token = await getToken()
  const res = await fetch(`${API_URL}/bootstrap`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'No se pudo ejecutar el bootstrap')
  return data
}

export async function refrescarImagenesProductosAdmin() {
  const token = await getToken()
  const res = await fetch(`${API_URL}/refresh-images?force=1`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'No se pudo refrescar imágenes')
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

  if (uploadError) throw new Error(uploadError.message || 'No se pudo subir la imagen')

  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data?.publicUrl || ''
}