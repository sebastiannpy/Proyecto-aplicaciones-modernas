// ─────────────────────────────────────────────────────────────────────────────
// Imágenes Cloudinary — mismas que usa el backend (productCatalogBootstrap.js)
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Imágenes Wikimedia Commons — para productos sin imagen propia en Cloudinary
// Nota: Wikimedia permite hotlinking desde browsers (no desde servidores)
// ─────────────────────────────────────────────────────────────────────────────
const WM = {
  discoFreno:    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Disc_brake_rotor.jpg/400px-Disc_brake_rotor.jpg",
  radiador:      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Car_radiator.jpg/400px-Car_radiator.jpg",
  alternador:    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Automotive_alternator.jpg/400px-Automotive_alternator.jpg",
  embrague:      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Clutch_disc.jpg/400px-Clutch_disc.jpg",
  discoEmbrague: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Clutch_pressure_plate.jpg/400px-Clutch_pressure_plate.jpg",
};

export const productos = [
  // ── FRENOS ──────────────────────────────────────────────────────────────────
  { id: 1,  nombre: "Pastillas de freno",          precio: 120000, categoria: "Frenos",       etiqueta: "OFERTA",    descripcion: "Alto rendimiento.",               imagen: CL.pastillas    },
  { id: 2,  nombre: "Disco de freno",              precio: 180000, categoria: "Frenos",                              descripcion: "Disco de freno ventilado.",       imagen: WM.discoFreno   },

  // ── MOTOR ───────────────────────────────────────────────────────────────────
  { id: 3,  nombre: "Bujia",                       precio:  45000, categoria: "Motor",         etiqueta: "NUEVO",     descripcion: "Bujia de encendido.",             imagen: CL.bujia        },
  { id: 5,  nombre: "Filtro de aire",              precio:  35000, categoria: "Motor",                               descripcion: "Filtro de aire motor.",           imagen: CL.filtro       },
  { id: 6,  nombre: "Aceite",                      precio:  80000, categoria: "Motor",         etiqueta: "POPULAR",   descripcion: "Aceite sintético.",               imagen: CL.aceite       },
  { id: 11, nombre: "Filtro de aceite",            precio:  25000, categoria: "Motor",                               descripcion: "Filtro de aceite.",               imagen: CL.filtro       },
  { id: 12, nombre: "Kit de embrague",             precio: 600000, categoria: "Motor",                               descripcion: "Kit completo de embrague.",       imagen: WM.embrague     },
  { id: 14, nombre: "Disco de embrague",           precio: 200000, categoria: "Motor",                               descripcion: "Disco de embrague.",              imagen: WM.discoEmbrague},

  // ── SUSPENSIÓN ──────────────────────────────────────────────────────────────
  { id: 4,  nombre: "Amortiguador",                precio: 210000, categoria: "Suspensión",                          descripcion: "Suspensión reforzada.",           imagen: CL.amortiguador },
  { id: 13, nombre: "Kit de amortiguador trasero", precio: 230000, categoria: "Suspensión",                          descripcion: "Kit de suspensión trasero.",      imagen: CL.kitSus       },

  // ── ELECTRICIDAD ────────────────────────────────────────────────────────────
  { id: 7,  nombre: "Radiador",                    precio: 300000, categoria: "Electricidad",                        descripcion: "Radiador de aluminio.",           imagen: WM.radiador     },
  { id: 9,  nombre: "Batería 12V",                 precio: 320000, categoria: "Electricidad",                        descripcion: "Batería automotriz.",             imagen: CL.bateria      },
  { id: 10, nombre: "Alternador",                  precio: 520000, categoria: "Electricidad",                        descripcion: "Alternador de alto rendimiento.", imagen: WM.alternador   },

  // ── LLANTAS ─────────────────────────────────────────────────────────────────
  { id: 8,  nombre: "Llanta deportiva",            precio: 450000, categoria: "Llantas",       etiqueta: "DESTACADO", descripcion: "Llanta de alto rendimiento.",     imagen: CL.llanta2      },
  { id: 15, nombre: "Llanta todo terreno",         precio: 500000, categoria: "Llantas",                             descripcion: "Llanta todo terreno.",            imagen: CL.llanta       },
];