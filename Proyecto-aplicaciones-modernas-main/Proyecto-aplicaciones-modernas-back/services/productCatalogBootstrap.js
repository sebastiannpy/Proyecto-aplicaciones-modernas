import supabaseAdmin from "../data/supabaseAdminClient.js";

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
];

export async function ensureProductCatalog() {
  const { data: existentes, error: errorExistentes } = await supabaseAdmin
    .from("products")
    .select("id, name, image_url");

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
    const { error: errorInsert } = await supabaseAdmin
      .from("products")
      .insert(faltantes);

    if (errorInsert) {
      throw errorInsert;
    }
  }

  const actualizacionesImagen = CATALOGO_BASE
    .map((item) => {
      const existente = existentesPorNombre.get(item.name.trim().toLowerCase());
      if (!existente) return null;
      if (existente.image_url) return null;
      return { id: existente.id, image_url: item.image_url };
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
