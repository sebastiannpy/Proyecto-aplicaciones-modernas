import supabaseAdmin from "../data/supabaseAdminClient.js";
import {
  getProductsSchemaCapabilities,
  sanitizeProductPayload,
} from "./productsSchema.js";

const IMG_CATEGORIA = {
  Frenos: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80",
  Motor: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&w=1200&q=80",
  "Suspensión": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  Electricidad: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
  Llantas: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
  Lubricantes: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80",
  Repuestos: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
};

const IMG_POR_PRODUCTO = {
  "pastillas de freno delanteras": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80",
  "disco de freno ventilado": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80",
  "liquido de frenos dot 4": "https://images.unsplash.com/photo-1581091215367-59ab6dcef573?auto=format&fit=crop&w=1200&q=80",
  "bujia iridium": "https://images.unsplash.com/photo-1619641805634-c95c72d8f7f9?auto=format&fit=crop&w=1200&q=80",
  "filtro de aceite premium": "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=1200&q=80",
  "aceite 5w-30 sintetico": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
  "amortiguador delantero": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80",
  "kit de suspension": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  "bateria 12v 65ah": "https://images.unsplash.com/photo-1530041539828-114de669390e?auto=format&fit=crop&w=1200&q=80",
  "alternador": "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
  "llanta 195/65 r15": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
  "llanta 205/55 r16": "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80",
  "zapatas de freno traseras": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80",
  "sensor de desgaste de freno": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80",
  "kit de herrajes de freno": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80",
  "bomba principal de freno": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80",
  "filtro de aire de motor": "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=1200&q=80",
  "correa de distribución": "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&w=1200&q=80",
  "tensor de correa": "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&w=1200&q=80",
  "bomba de agua": "https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?auto=format&fit=crop&w=1200&q=80",
  "empaque de culata": "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&w=1200&q=80",
  "brazo de suspensión inferior": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  "terminal de dirección": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  "bieleta de barra estabilizadora": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  "base de amortiguador": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80",
  "motor de arranque": "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
  "bobina de encendido": "https://images.unsplash.com/photo-1619641805634-c95c72d8f7f9?auto=format&fit=crop&w=1200&q=80",
  "sensor de oxígeno": "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
  "relé automotriz 12v": "https://images.unsplash.com/photo-1530041539828-114de669390e?auto=format&fit=crop&w=1200&q=80",
  "fusibles mini blade surtidos": "https://images.unsplash.com/photo-1530041539828-114de669390e?auto=format&fit=crop&w=1200&q=80",
  "llanta 185/65 r14": "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80",
  "llanta 215/45 r17": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
  "rin de aluminio 16 pulgadas": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
  "valvula para llanta tpms": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
  "aceite sintetico 5w-30 1l": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
  "aceite semisintetico 10w-40 1l": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
  "aditivo limpiador de inyectores": "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80",
  "grasa multipropósito automotriz": "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80",
  "aceite para transmisión atf": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
  "filtro de cabina": "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=1200&q=80",
  "espejo lateral derecho": "https://source.unsplash.com/1200x800/?car,side,mirror,auto,part",
  "manija exterior de puerta": "https://source.unsplash.com/1200x800/?car,door,handle,auto,part",
  "manguera superior de radiador": "https://source.unsplash.com/1200x800/?car,radiator,hose,engine,part",
  "tapon de radiador": "https://source.unsplash.com/1200x800/?car,radiator,cap,coolant,part"
};

function normalizarNombre(nombre = "") {
  return nombre
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const IMG_POR_TIPO = [
  { regex: /(pastilla|zapata)/i, url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80" },
  { regex: /(disco\s*de\s*freno|bomba\s*principal)/i, url: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80" },
  { regex: /(liquido\s*de\s*freno|dot\s*4)/i, url: "https://images.unsplash.com/photo-1581091215367-59ab6dcef573?auto=format&fit=crop&w=1200&q=80" },
  { regex: /(bujia|encendido)/i, url: "https://images.unsplash.com/photo-1619641805634-c95c72d8f7f9?auto=format&fit=crop&w=1200&q=80" },
  { regex: /(filtro)/i, url: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=1200&q=80" },
  { regex: /(aceite|lubricante|grasa|aditivo)/i, url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80" },
  { regex: /(amortiguador|suspension|suspensi[oó]n|strut|bieleta|brazo)/i, url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80" },
  { regex: /(bateria|alternador|arranque|fusible|rele|rel[ée])/i, url: "https://images.unsplash.com/photo-1530041539828-114de669390e?auto=format&fit=crop&w=1200&q=80" },
  { regex: /(llanta|rin|neumatico|neum[aá]tico)/i, url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80" },
  { regex: /(espejo|manija|tapon|tap[oó]n|manguera|emblema|sticker|calcomania|calcoman[ií]a)/i, url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80" },
];

function resolverImagenCatalogo(item = {}) {
  const byName = IMG_POR_PRODUCTO[normalizarNombre(item.name)];
  if (byName) return byName;
  const texto = `${item.name || ""} ${item.description || ""}`.trim();
  const porTipo = IMG_POR_TIPO.find((x) => x.regex.test(texto));
  if (porTipo) return porTipo.url;
  if (item.category && IMG_CATEGORIA[item.category]) return IMG_CATEGORIA[item.category];
  if (item.image_url) return item.image_url;
  return "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80";
}

const CATALOGO_BASE = [
  {
    name: "Pastillas de freno delanteras",
    price: 120000,
    category: "Frenos",
    brand: "Bosch",
    stock: 18,
    image_url: "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496131/pastillas_br4ude.jpg",
  },
  {
    name: "Disco de freno ventilado",
    price: 210000,
    category: "Frenos",
    brand: "Brembo",
    stock: 12,
    image_url: "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496131/pastillas_br4ude.jpg",
  },
  {
    name: "Liquido de frenos DOT 4",
    price: 38000,
    category: "Frenos",
    brand: "Motul",
    stock: 30,
    image_url: "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496131/pastillas_br4ude.jpg",
  },
  {
    name: "Bujia iridium",
    price: 45000,
    category: "Motor",
    brand: "NGK",
    stock: 25,
    image_url: "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496115/bujia_vphaxm.jpg",
  },
  {
    name: "Filtro de aceite premium",
    price: 28000,
    category: "Motor",
    brand: "Mann",
    stock: 40,
    image_url: "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496069/filtro_gezkpd.jpg",
  },
  {
    name: "Aceite 5W-30 sintetico",
    price: 165000,
    category: "Motor",
    brand: "Mobil",
    stock: 22,
    image_url: "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496056/aceite_kpo22t.jpg",
  },
  {
    name: "Amortiguador delantero",
    price: 260000,
    category: "Suspensión",
    brand: "Monroe",
    stock: 14,
    image_url: "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496100/amortiguador_egqox4.jpg",
  },
  {
    name: "Kit de suspension",
    price: 520000,
    category: "Suspensión",
    brand: "KYB",
    stock: 8,
    image_url: "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496007/2-11403-11404-001_Unity_Fully_Loaded_Strut_Set_Of_2_For_Chevy_Left_Right_Pair_qeku8i.jpg",
  },
  {
    name: "Bateria 12V 65Ah",
    price: 390000,
    category: "Electricidad",
    brand: "ACDelco",
    stock: 16,
    image_url: "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496027/bateria_f009t4.jpg",
  },
  {
    name: "Alternador",
    price: 680000,
    category: "Electricidad",
    brand: "Valeo",
    stock: 7,
    image_url: "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496027/bateria_f009t4.jpg",
  },
  {
    name: "Llanta 195/65 R15",
    price: 320000,
    category: "Llantas",
    brand: "Michelin",
    stock: 20,
    image_url: "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496042/llanta_jhrwxh.jpg",
  },
  {
    name: "Llanta 205/55 R16",
    price: 360000,
    category: "Llantas",
    brand: "Pirelli",
    stock: 18,
    image_url: "https://res.cloudinary.com/db69rnqvy/image/upload/v1774495989/llanta2_wa551a.jpg",
  },
  // Frenos
  {
    name: "Zapatas de freno traseras",
    price: 99000,
    category: "Frenos",
    brand: "TRW",
    stock: 15,
    image_url: null,
  },
  {
    name: "Sensor de desgaste de freno",
    price: 52000,
    category: "Frenos",
    brand: "Bosch",
    stock: 20,
    image_url: null,
  },
  {
    name: "Kit de herrajes de freno",
    price: 67000,
    category: "Frenos",
    brand: "Raybestos",
    stock: 11,
    image_url: null,
  },
  {
    name: "Bomba principal de freno",
    price: 295000,
    category: "Frenos",
    brand: "ATE",
    stock: 8,
    image_url: null,
  },
  // Motor
  {
    name: "Filtro de aire de motor",
    price: 36000,
    category: "Motor",
    brand: "Mann",
    stock: 28,
    image_url: null,
  },
  {
    name: "Correa de distribución",
    price: 185000,
    category: "Motor",
    brand: "Gates",
    stock: 10,
    image_url: null,
  },
  {
    name: "Tensor de correa",
    price: 128000,
    category: "Motor",
    brand: "INA",
    stock: 14,
    image_url: null,
  },
  {
    name: "Bomba de agua",
    price: 210000,
    category: "Motor",
    brand: "SKF",
    stock: 9,
    image_url: null,
  },
  {
    name: "Empaque de culata",
    price: 92000,
    category: "Motor",
    brand: "Victor Reinz",
    stock: 12,
    image_url: null,
  },
  // Suspensión
  {
    name: "Brazo de suspensión inferior",
    price: 265000,
    category: "Suspensión",
    brand: "Moog",
    stock: 10,
    image_url: null,
  },
  {
    name: "Terminal de dirección",
    price: 74000,
    category: "Suspensión",
    brand: "TRW",
    stock: 22,
    image_url: null,
  },
  {
    name: "Bieleta de barra estabilizadora",
    price: 58000,
    category: "Suspensión",
    brand: "Febi",
    stock: 25,
    image_url: null,
  },
  {
    name: "Base de amortiguador",
    price: 84000,
    category: "Suspensión",
    brand: "Monroe",
    stock: 13,
    image_url: null,
  },
  // Electricidad
  {
    name: "Motor de arranque",
    price: 740000,
    category: "Electricidad",
    brand: "Valeo",
    stock: 6,
    image_url: null,
  },
  {
    name: "Bobina de encendido",
    price: 146000,
    category: "Electricidad",
    brand: "NGK",
    stock: 17,
    image_url: null,
  },
  {
    name: "Sensor de oxígeno",
    price: 198000,
    category: "Electricidad",
    brand: "Denso",
    stock: 12,
    image_url: null,
  },
  {
    name: "Relé automotriz 12V",
    price: 32000,
    category: "Electricidad",
    brand: "Hella",
    stock: 26,
    image_url: null,
  },
  {
    name: "Fusibles mini blade surtidos",
    price: 24000,
    category: "Electricidad",
    brand: "Bosch",
    stock: 30,
    image_url: null,
  },
  // Llantas
  {
    name: "Llanta 185/65 R14",
    price: 285000,
    category: "Llantas",
    brand: "Bridgestone",
    stock: 16,
    image_url: null,
  },
  {
    name: "Llanta 215/45 R17",
    price: 430000,
    category: "Llantas",
    brand: "Continental",
    stock: 11,
    image_url: null,
  },
  {
    name: "Rin de aluminio 16 pulgadas",
    price: 520000,
    category: "Llantas",
    brand: "Enkei",
    stock: 7,
    image_url: null,
  },
  {
    name: "Válvula para llanta TPMS",
    price: 48000,
    category: "Llantas",
    brand: "Schrader",
    stock: 24,
    image_url: null,
  },
  // Lubricantes
  {
    name: "Aceite sintético 5W-30 1L",
    price: 52000,
    category: "Lubricantes",
    brand: "Mobil",
    stock: 26,
    image_url: null,
  },
  {
    name: "Aceite semisintético 10W-40 1L",
    price: 42000,
    category: "Lubricantes",
    brand: "Castrol",
    stock: 22,
    image_url: null,
  },
  {
    name: "Aditivo limpiador de inyectores",
    price: 36000,
    category: "Lubricantes",
    brand: "Liqui Moly",
    stock: 18,
    image_url: null,
  },
  {
    name: "Grasa multipropósito automotriz",
    price: 28000,
    category: "Lubricantes",
    brand: "Shell",
    stock: 30,
    image_url: null,
  },
  {
    name: "Aceite para transmisión ATF",
    price: 76000,
    category: "Lubricantes",
    brand: "Valvoline",
    stock: 14,
    image_url: null,
  },
  // Repuestos
  {
    name: "Filtro de cabina",
    price: 39000,
    category: "Repuestos",
    brand: "Mann",
    stock: 19,
    image_url: null,
  },
  {
    name: "Espejo lateral derecho",
    price: 185000,
    category: "Repuestos",
    brand: "TYC",
    stock: 9,
    image_url: null,
  },
  {
    name: "Manija exterior de puerta",
    price: 74000,
    category: "Repuestos",
    brand: "Dorman",
    stock: 15,
    image_url: null,
  },
  {
    name: "Manguera superior de radiador",
    price: 62000,
    category: "Repuestos",
    brand: "Gates",
    stock: 13,
    image_url: null,
  },
  {
    name: "Tapón de radiador",
    price: 27000,
    category: "Repuestos",
    brand: "Stant",
    stock: 21,
    image_url: null,
  },
];

export async function ensureProductCatalog() {
  const caps = await getProductsSchemaCapabilities();
  const selectFields = caps.hasImageUrl ? "id, name, image_url" : "id, name";
  const { data: existentes, error: errorExistentes } = await supabaseAdmin
    .from("products")
    .select(selectFields);

  if (errorExistentes) {
    throw errorExistentes;
  }

  const existentesPorNombre = new Map(
    (existentes || [])
      .filter((p) => p.name)
      .map((p) => [p.name.trim().toLowerCase(), p]),
  );

  const faltantes = CATALOGO_BASE.filter(
    (p) => !existentesPorNombre.has(p.name.trim().toLowerCase()),
  );

  if (faltantes.length) {
    const faltantesConImagen = faltantes.map((item) => ({
      ...item,
      image_url: resolverImagenCatalogo(item),
    }));
    const faltantesSanitizados = await Promise.all(
      faltantesConImagen.map((item) => sanitizeProductPayload(item)),
    );
    const { error: errorInsert } = await supabaseAdmin
      .from("products")
      .insert(faltantesSanitizados);

    if (errorInsert) {
      throw errorInsert;
    }
  }

  let actualizacionesImagen = [];
  if (caps.hasImageUrl) {
    actualizacionesImagen = CATALOGO_BASE
      .map((item) => {
        const existente = existentesPorNombre.get(item.name.trim().toLowerCase());
        if (!existente) return null;
        const nuevaImagen = resolverImagenCatalogo(item);
        const actual = String(existente.image_url || "").trim();
        if (actual === nuevaImagen) return null;
        return { id: existente.id, image_url: nuevaImagen };
      })
      .filter(Boolean);

    for (const update of actualizacionesImagen) {
      const { error: errorUpdate } = await supabaseAdmin
        .from("products")
        .update({ image_url: update.image_url })
        .eq("id", update.id);

      if (errorUpdate) {
        console.error("[products-bootstrap] No se pudo actualizar imagen de producto:", update.id, errorUpdate.message);
      }
    }
  }

  if (!faltantes.length && !actualizacionesImagen.length) {
    console.log("[products-bootstrap] Catalogo base ya estaba completo");
    return { inserted: 0, updatedImages: 0, message: "Catalogo base ya estaba completo" };
  }

  console.log(`[products-bootstrap] Productos insertados: ${faltantes.length}`);
  if (actualizacionesImagen.length) {
    console.log(`[products-bootstrap] Imagenes actualizadas: ${actualizacionesImagen.length}`);
  }
  return {
    inserted: faltantes.length,
    updatedImages: actualizacionesImagen.length,
    message: "Catalogo base procesado",
  };
}

export async function refreshAllProductImages({ force = false } = {}) {
  const caps = await getProductsSchemaCapabilities();
  if (!caps.hasImageUrl) {
    return {
      updatedImages: 0,
      message: "La tabla products no tiene la columna image_url",
    };
  }

  const { data: productos, error } = await supabaseAdmin
    .from("products")
    .select("id, name, category, image_url, description");

  if (error) throw error;

  const updates = (productos || [])
    .map((p) => {
      const byName = IMG_POR_PRODUCTO[normalizarNombre(p.name)];
      if (!byName) return null;
      const nuevaImagen = byName;
      const actual = String(p.image_url || "").trim();
      if (!force && actual === nuevaImagen) return null;
      return { id: p.id, image_url: nuevaImagen };
    })
    .filter(Boolean);

  for (const item of updates) {
    const { error: updateError } = await supabaseAdmin
      .from("products")
      .update({ image_url: item.image_url })
      .eq("id", item.id);
    if (updateError) {
      console.error("[products-images] No se pudo actualizar producto:", item.id, updateError.message);
    }
  }

  return {
    updatedImages: updates.length,
    message: "Imagenes de productos actualizadas",
  };
}
