import supabaseAdmin from "../data/supabaseAdminClient.js";
import {
  getProductsSchemaCapabilities,
  sanitizeProductPayload,
} from "./productsSchema.js";

// ─── Imágenes Cloudinary (propias del proyecto) ───────────────────────────────
const CL = {
  pastillas:    "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496131/pastillas_br4ude.jpg",
  bujia:        "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496115/bujia_vphaxm.jpg",
  filtro:       "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496069/filtro_gezkpd.jpg",
  aceite:       "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496056/aceite_kpo22t.jpg",
  amortiguador: "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496100/amortiguador_egqox4.jpg",
  kitSus:       "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496007/2-11403-11404-001_Unity_Fully_Loaded_Strut_Set_Of_2_For_Chevy_Left_Right_Pair_qeku8i.jpg",
  bateria:      "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496027/bateria_f009t4.jpg",
  llanta:       "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496042/llanta_jhrwxh.jpg",
  llanta2:      "https://res.cloudinary.com/db69rnqvy/image/upload/v1774495989/llanta2_wa551a.jpg",
};

// ─── Imágenes Wikimedia Commons (acceso público sin restricción) ───────────────
const WM = {
  // Frenos
  discoFreno:       "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Disc_brake_rotor.jpg/400px-Disc_brake_rotor.jpg",
  zapatas:          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Brake_pads.JPG/400px-Brake_pads.JPG",
  liquidoFreno:     "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Brake_fluid.jpg/400px-Brake_fluid.jpg",
  bombaFreno:       "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Brake_master_cylinder.jpg/400px-Brake_master_cylinder.jpg",

  // Motor
  correa:           "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Timing_belt_%28camshaft%29.jpg/400px-Timing_belt_%28camshaft%29.jpg",
  filtroAceite:     "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Oil_filter.jpg/400px-Oil_filter.jpg",
  bombaAgua:        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Water_pump_assembly.jpg/400px-Water_pump_assembly.jpg",
  empaque:          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Head_gasket.jpg/400px-Head_gasket.jpg",

  // Suspensión
  terminal:         "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Tie_rod_end.jpg/400px-Tie_rod_end.jpg",
  brazo:            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Control_arm.jpg/400px-Control_arm.jpg",

  // Electricidad
  alternador:       "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Automotive_alternator.jpg/400px-Automotive_alternator.jpg",
  arranque:         "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Starter_motor.jpg/400px-Starter_motor.jpg",
  sensorOxigeno:    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Oxygen_sensor.jpg/400px-Oxygen_sensor.jpg",
  rele:             "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Relay_of_a_car.JPG/400px-Relay_of_a_car.JPG",

  // Llantas
  rinAluminio:      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Enkei_alloy_wheel.jpg/400px-Enkei_alloy_wheel.jpg",
  valvulaTpms:      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Tire_pressure_gauge.jpg/400px-Tire_pressure_gauge.jpg",

  // Repuestos varios
  espejo:           "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Car_side_mirror.jpg/400px-Car_side_mirror.jpg",
  manguera:         "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Car_radiator.jpg/400px-Car_radiator.jpg",
  radiador:         "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Car_radiator.jpg/400px-Car_radiator.jpg",
  tapon:            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Car_radiator.jpg/400px-Car_radiator.jpg",
  manija:           "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Car_door_handle.jpg/400px-Car_door_handle.jpg",

  // Lubricantes
  grasa:            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Lithium_grease.jpg/400px-Lithium_grease.jpg",
  aditivo:          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Motor_Oil_Brands.jpg/400px-Motor_Oil_Brands.jpg",
  atf:              "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Motor_Oil_Brands.jpg/400px-Motor_Oil_Brands.jpg",
};

// ─── Reglas por regex — ORDEN IMPORTA: más específico primero ─────────────────
const IMG_POR_TIPO = [
  // FRENOS
  { regex: /(pastilla)/i,                                               url: CL.pastillas    },
  { regex: /(zapata)/i,                                                 url: WM.zapatas      },
  { regex: /(disco.*freno|freno.*disco)/i,                              url: WM.discoFreno   },
  { regex: /(bomba.*freno|freno.*bomba|master.*cylinder)/i,             url: WM.bombaFreno   },
  { regex: /(liquido.*freno|dot\s*4)/i,                                 url: WM.liquidoFreno },
  { regex: /(sensor.*desgaste|desgaste.*sensor|herraje|kit.*freno)/i,   url: CL.pastillas    },

  // MOTOR — filtro de aceite ANTES que el genérico "filtro"
  { regex: /(filtro.*aceite|aceite.*filtro)/i,                          url: WM.filtroAceite },
  { regex: /(filtro.*aire|aire.*filtro)/i,                              url: CL.filtro       },
  { regex: /(filtro.*cabina|cabina.*filtro)/i,                          url: WM.filtroAceite },
  { regex: /(filtro)/i,                                                 url: CL.filtro       },

  // BUJÍA / ENCENDIDO
  { regex: /(bujia|bujía)/i,                                            url: CL.bujia        },
  { regex: /(bobina.*encendido|encendido.*bobina)/i,                    url: CL.bujia        },

  // CORREA / DISTRIBUCIÓN
  { regex: /(correa.*distribuc|distribuc.*correa|timing)/i,             url: WM.correa       },
  { regex: /(tensor.*correa|correa.*tensor)/i,                          url: WM.correa       },

  // MOTOR MECÁNICO
  { regex: /(empaque.*culata|culata.*empaque|junta.*culata)/i,          url: WM.empaque      },
  { regex: /(bomba.*agua|agua.*bomba)/i,                                url: WM.bombaAgua    },

  // ACEITES / LUBRICANTES
  { regex: /(grasa)/i,                                                  url: WM.grasa        },
  { regex: /(aditivo|limpiador.*inyect)/i,                              url: WM.aditivo      },
  { regex: /(atf|transmision.*aceite|aceite.*transmision)/i,            url: WM.atf          },
  { regex: /(aceite|lubricante)/i,                                      url: CL.aceite       },

  // SUSPENSIÓN — kit ANTES que genérico
  { regex: /(kit.*suspens|suspens.*kit)/i,                              url: CL.kitSus       },
  { regex: /(amortiguador|strut|base.*amortiguador)/i,                  url: CL.amortiguador },
  { regex: /(brazo.*suspens|suspens.*brazo|control.*arm)/i,             url: WM.brazo        },
  { regex: /(terminal.*direcc|direcc.*terminal|tie.*rod)/i,             url: WM.terminal     },
  { regex: /(bieleta)/i,                                                url: CL.amortiguador },

  // ELECTRICIDAD
  { regex: /(bateria|batería)/i,                                        url: CL.bateria      },
  { regex: /(alternador)/i,                                             url: WM.alternador   },
  { regex: /(motor.*arranque|arranque)/i,                               url: WM.arranque     },
  { regex: /(sensor.*oxig|oxig.*sensor)/i,                              url: WM.sensorOxigeno},
  { regex: /(sensor)/i,                                                 url: CL.bujia        },
  { regex: /(rele|relé)/i,                                              url: WM.rele         },
  { regex: /(fusible)/i,                                                url: CL.bateria      },

  // LLANTAS / RINES
  { regex: /(rin|rueda.*aluminio)/i,                                    url: WM.rinAluminio  },
  { regex: /(valvula.*llanta|tpms)/i,                                   url: WM.valvulaTpms  },
  { regex: /(llanta.*205|llanta.*215)/i,                                url: CL.llanta2      },
  { regex: /(llanta|neumatico|neumático)/i,                             url: CL.llanta       },

  // REPUESTOS VARIOS
  { regex: /(espejo)/i,                                                 url: WM.espejo       },
  { regex: /(manija)/i,                                                 url: WM.manija       },
  { regex: /(manguera.*radiador|radiador.*manguera)/i,                  url: WM.manguera     },
  { regex: /(tapon.*radiador|radiador.*tapon)/i,                        url: WM.tapon        },
  { regex: /(radiador)/i,                                               url: WM.radiador     },
  { regex: /(calcomania|sticker|emblema)/i,                             url: CL.llanta       },
];

// ─── Fallback por categoría ───────────────────────────────────────────────────
const IMG_CATEGORIA = {
  Frenos:       CL.pastillas,
  Motor:        CL.bujia,
  "Suspensión": CL.amortiguador,
  Electricidad: CL.bateria,
  Llantas:      CL.llanta,
  Lubricantes:  CL.aceite,
  Repuestos:    WM.filtroAceite,
};

function resolverImagenCatalogo(item = {}) {
  const texto = `${item.name || ""} ${item.description || ""}`.trim();
  const porTipo = IMG_POR_TIPO.find((x) => x.regex.test(texto));
  if (porTipo) return porTipo.url;
  if (item.category && IMG_CATEGORIA[item.category]) return IMG_CATEGORIA[item.category];
  return WM.filtroAceite;
}

const CATALOGO_BASE = [
  // ── FRENOS ──────────────────────────────────────────────────────────────────
  { name: "Pastillas de freno delanteras", price: 120000, category: "Frenos",     brand: "Bosch",        stock: 18 },
  { name: "Disco de freno ventilado",       price: 210000, category: "Frenos",     brand: "Brembo",       stock: 12 },
  { name: "Liquido de frenos DOT 4",        price:  38000, category: "Frenos",     brand: "Motul",        stock: 30 },
  { name: "Zapatas de freno traseras",      price:  99000, category: "Frenos",     brand: "TRW",          stock: 15 },
  { name: "Sensor de desgaste de freno",    price:  52000, category: "Frenos",     brand: "Bosch",        stock: 20 },
  { name: "Kit de herrajes de freno",       price:  67000, category: "Frenos",     brand: "Raybestos",    stock: 11 },
  { name: "Bomba principal de freno",       price: 295000, category: "Frenos",     brand: "ATE",          stock:  8 },
  // ── MOTOR ────────────────────────────────────────────────────────────────────
  { name: "Bujia iridium",                  price:  45000, category: "Motor",      brand: "NGK",          stock: 25 },
  { name: "Filtro de aceite premium",       price:  28000, category: "Motor",      brand: "Mann",         stock: 40 },
  { name: "Aceite 5W-30 sintetico",         price: 165000, category: "Motor",      brand: "Mobil",        stock: 22 },
  { name: "Filtro de aire de motor",        price:  36000, category: "Motor",      brand: "Mann",         stock: 28 },
  { name: "Correa de distribución",         price: 185000, category: "Motor",      brand: "Gates",        stock: 10 },
  { name: "Tensor de correa",               price: 128000, category: "Motor",      brand: "INA",          stock: 14 },
  { name: "Bomba de agua",                  price: 210000, category: "Motor",      brand: "SKF",          stock:  9 },
  { name: "Empaque de culata",              price:  92000, category: "Motor",      brand: "Victor Reinz", stock: 12 },
  // ── SUSPENSIÓN ───────────────────────────────────────────────────────────────
  { name: "Amortiguador delantero",         price: 260000, category: "Suspensión", brand: "Monroe",       stock: 14 },
  { name: "Kit de suspension",              price: 520000, category: "Suspensión", brand: "KYB",          stock:  8 },
  { name: "Brazo de suspensión inferior",   price: 265000, category: "Suspensión", brand: "Moog",         stock: 10 },
  { name: "Terminal de dirección",          price:  74000, category: "Suspensión", brand: "TRW",          stock: 22 },
  { name: "Bieleta de barra estabilizadora",price:  58000, category: "Suspensión", brand: "Febi",         stock: 25 },
  { name: "Base de amortiguador",           price:  84000, category: "Suspensión", brand: "Monroe",       stock: 13 },
  // ── ELECTRICIDAD ─────────────────────────────────────────────────────────────
  { name: "Bateria 12V 65Ah",               price: 390000, category: "Electricidad", brand: "ACDelco",    stock: 16 },
  { name: "Alternador",                     price: 680000, category: "Electricidad", brand: "Valeo",      stock:  7 },
  { name: "Motor de arranque",              price: 740000, category: "Electricidad", brand: "Valeo",      stock:  6 },
  { name: "Bobina de encendido",            price: 146000, category: "Electricidad", brand: "NGK",        stock: 17 },
  { name: "Sensor de oxígeno",              price: 198000, category: "Electricidad", brand: "Denso",      stock: 12 },
  { name: "Relé automotriz 12V",            price:  32000, category: "Electricidad", brand: "Hella",      stock: 26 },
  { name: "Fusibles mini blade surtidos",   price:  24000, category: "Electricidad", brand: "Bosch",      stock: 30 },
  // ── LLANTAS ──────────────────────────────────────────────────────────────────
  { name: "Llanta 195/65 R15",              price: 320000, category: "Llantas",    brand: "Michelin",     stock: 20 },
  { name: "Llanta 205/55 R16",              price: 360000, category: "Llantas",    brand: "Pirelli",      stock: 18 },
  { name: "Llanta 185/65 R14",              price: 285000, category: "Llantas",    brand: "Bridgestone",  stock: 16 },
  { name: "Llanta 215/45 R17",              price: 430000, category: "Llantas",    brand: "Continental",  stock: 11 },
  { name: "Rin de aluminio 16 pulgadas",    price: 520000, category: "Llantas",    brand: "Enkei",        stock:  7 },
  { name: "Válvula para llanta TPMS",       price:  48000, category: "Llantas",    brand: "Schrader",     stock: 24 },
  // ── LUBRICANTES ──────────────────────────────────────────────────────────────
  { name: "Aceite sintético 5W-30 1L",      price:  52000, category: "Lubricantes", brand: "Mobil",       stock: 26 },
  { name: "Aceite semisintético 10W-40 1L", price:  42000, category: "Lubricantes", brand: "Castrol",     stock: 22 },
  { name: "Aditivo limpiador de inyectores",price:  36000, category: "Lubricantes", brand: "Liqui Moly",  stock: 18 },
  { name: "Grasa multipropósito automotriz",price:  28000, category: "Lubricantes", brand: "Shell",       stock: 30 },
  { name: "Aceite para transmisión ATF",    price:  76000, category: "Lubricantes", brand: "Valvoline",   stock: 14 },
  // ── REPUESTOS ────────────────────────────────────────────────────────────────
  { name: "Filtro de cabina",               price:  39000, category: "Repuestos",  brand: "Mann",         stock: 19 },
  { name: "Espejo lateral derecho",         price: 185000, category: "Repuestos",  brand: "TYC",          stock:  9 },
  { name: "Manija exterior de puerta",      price:  74000, category: "Repuestos",  brand: "Dorman",       stock: 15 },
  { name: "Manguera superior de radiador",  price:  62000, category: "Repuestos",  brand: "Gates",        stock: 13 },
  { name: "Tapón de radiador",              price:  27000, category: "Repuestos",  brand: "Stant",        stock: 21 },
];

const URL_GENERICAS = /unsplash\.com|source\.unsplash|pexels\.com|loremflickr|picsum|dummyimage|placehold|lorempixel/i;

export async function ensureProductCatalog() {
  const caps = await getProductsSchemaCapabilities();
  const selectFields = caps.hasImageUrl ? "id, name, image_url" : "id, name";
  const { data: existentes, error: errorExistentes } = await supabaseAdmin
    .from("products").select(selectFields);
  if (errorExistentes) throw errorExistentes;

  const existentesPorNombre = new Map(
    (existentes || []).filter((p) => p.name)
      .map((p) => [p.name.trim().toLowerCase(), p]),
  );

  const faltantes = CATALOGO_BASE.filter(
    (p) => !existentesPorNombre.has(p.name.trim().toLowerCase()),
  );

  if (faltantes.length) {
    const payload = await Promise.all(
      faltantes.map((item) =>
        sanitizeProductPayload({ ...item, image_url: resolverImagenCatalogo(item) })
      ),
    );
    const { error } = await supabaseAdmin.from("products").insert(payload);
    if (error) throw error;
  }

  let actualizaciones = [];
  if (caps.hasImageUrl) {
    actualizaciones = CATALOGO_BASE.map((item) => {
      const existente = existentesPorNombre.get(item.name.trim().toLowerCase());
      if (!existente) return null;
      const actual = String(existente.image_url || "").trim();
      if (actual && !URL_GENERICAS.test(actual)) return null;
      return { id: existente.id, image_url: resolverImagenCatalogo(item) };
    }).filter(Boolean);

    for (const u of actualizaciones) {
      const { error } = await supabaseAdmin.from("products")
        .update({ image_url: u.image_url }).eq("id", u.id);
      if (error) console.error("[products-bootstrap] Error actualizando imagen:", u.id, error.message);
    }
  }

  if (!faltantes.length && !actualizaciones.length) {
    console.log("[products-bootstrap] Catalogo base ya estaba completo");
    return { inserted: 0, updatedImages: 0 };
  }
  console.log(`[products-bootstrap] Insertados: ${faltantes.length} | Imágenes actualizadas: ${actualizaciones.length}`);
  return { inserted: faltantes.length, updatedImages: actualizaciones.length };
}

export async function refreshAllProductImages({ force = false } = {}) {
  const caps = await getProductsSchemaCapabilities();
  if (!caps.hasImageUrl) return { updatedImages: 0 };

  const { data: productos, error } = await supabaseAdmin
    .from("products").select("id, name, category, image_url, description");
  if (error) throw error;

  const updates = (productos || []).map((p) => {
    const actual = String(p.image_url || "").trim();
    // Con force=true actualiza todos; sin force solo actualiza los que usan la imagen de filtro azul genérica
    const esGenerico = actual === "https://res.cloudinary.com/db69rnqvy/image/upload/v1774496069/filtro_gezkpd.jpg";
    if (!force && actual && !URL_GENERICAS.test(actual) && !esGenerico) return null;
    const nueva = resolverImagenCatalogo(p);
    if (actual === nueva) return null;
    return { id: p.id, image_url: nueva };
  }).filter(Boolean);

  for (const u of updates) {
    const { error } = await supabaseAdmin.from("products")
      .update({ image_url: u.image_url }).eq("id", u.id);
    if (error) console.error("[products-images] Error:", u.id, error.message);
  }

  console.log(`[products-images] Imágenes actualizadas: ${updates.length}`);
  return { updatedImages: updates.length, message: `Imágenes actualizadas: ${updates.length}` };
}