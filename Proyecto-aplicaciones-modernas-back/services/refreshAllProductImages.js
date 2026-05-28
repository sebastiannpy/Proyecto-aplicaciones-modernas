// services/refreshAllProductImages.js
// Uso: npm run images:refresh-all
//      npm run images:refresh-all -- --force

import supabaseAdmin from "../data/supabaseAdminClient.js";

const FORCE = process.argv.includes("--force");

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

// Orden importa: más específico primero
const REGLAS = [
  { regex: /(pastilla|zapata)/i,                                         key: "pastillas"    },
  { regex: /(disco.*freno|freno.*disco|bomba.*freno|sensor.*desgaste|herraje|kit.*freno)/i, key: "pastillas" },
  { regex: /(liquido.*freno|dot\s*4)/i,                                  key: "aceite"       },
  { regex: /(filtro.*aceite|aceite.*filtro)/i,                           key: "filtro"       },
  { regex: /(filtro.*aire|aire.*filtro|filtro.*cabina|cabina.*filtro|filtro)/i, key: "filtro" },
  { regex: /(bujia|bujía)/i,                                             key: "bujia"        },
  { regex: /(bobina.*encendido|encendido.*bobina)/i,                     key: "bujia"        },
  { regex: /(correa|tensor.*correa|correa.*tensor|empaque.*culata|culata.*empaque|bomba.*agua)/i, key: "filtro" },
  { regex: /(aceite|lubricante|grasa|aditivo|atf)/i,                     key: "aceite"       },
  { regex: /(kit.*suspens|suspens.*kit)/i,                               key: "kitSus"       },
  { regex: /(amortiguador|suspens|strut|bieleta|brazo.*suspens|base.*amortiguador|terminal.*direcc)/i, key: "amortiguador" },
  { regex: /(bateria|batería)/i,                                         key: "bateria"      },
  { regex: /(alternador|motor.*arranque|arranque)/i,                     key: "bateria"      },
  { regex: /(sensor.*oxig|sensor)/i,                                     key: "bujia"        },
  { regex: /(rele|relé|fusible)/i,                                       key: "bateria"      },
  { regex: /(llanta.*205|llanta.*215|rin|rueda)/i,                       key: "llanta2"      },
  { regex: /(llanta|neumatico|neumático|valvula.*llanta)/i,               key: "llanta"       },
  { regex: /(espejo|manija|manguera|tapon|tap[oó]n|emblema|sticker|calcomania)/i, key: "filtro" },
];

const CATEGORIA_FALLBACK = {
  "Frenos":       "pastillas",
  "Motor":        "bujia",
  "Suspensión":   "amortiguador",
  "Electricidad": "bateria",
  "Llantas":      "llanta",
  "Lubricantes":  "aceite",
  "Repuestos":    "filtro",
};

const URL_GENERICAS = /unsplash\.com|source\.unsplash|pexels\.com|loremflickr|picsum|dummyimage|placehold|lorempixel/i;

function resolverImagen(p) {
  const texto = `${p.name || ""} ${p.description || ""}`.trim();
  const regla = REGLAS.find((r) => r.regex.test(texto));
  if (regla) return CL[regla.key];
  const fbKey = CATEGORIA_FALLBACK[p.category];
  if (fbKey) return CL[fbKey];
  return CL.filtro;
}

async function main() {
  console.log(`Modo: ${FORCE ? "FORZADO" : "solo genéricas/vacías"}`);

  const { data: products, error } = await supabaseAdmin
    .from("products").select("id, name, category, image_url, description").limit(1000);
  if (error) throw error;
  if (!products?.length) { console.log("Sin productos."); return; }

  let updated = 0, skipped = 0, failed = 0;

  for (const p of products) {
    const actual = String(p.image_url || "").trim();
    if (!FORCE && actual && !URL_GENERICAS.test(actual)) { skipped++; continue; }

    try {
      const newUrl = resolverImagen(p);
      const { error: upErr } = await supabaseAdmin
        .from("products").update({ image_url: newUrl }).eq("id", p.id);
      if (upErr) throw upErr;
      updated++;
      console.log(`✔ ${p.name}`);
    } catch (err) {
      failed++;
      console.error(`✖ ${p.name || p.id}: ${err.message}`);
    }
  }

  console.log(`\nActualizados: ${updated} | Omitidos: ${skipped} | Fallidos: ${failed}`);
}

main().catch((err) => { console.error(err.message); process.exit(1); });