/**
 * refreshImages.js
 * 
 * Script de un solo uso para actualizar TODAS las imágenes de productos
 * en Supabase usando la lógica mejorada de productCatalogBootstrap.js
 * 
 * Uso:
 *   node refreshImages.js
 * 
 * Ejecutar desde la carpeta: Proyecto-aplicaciones-modernas-back/
 */

import { refreshAllProductImages } from "./services/productCatalogBootstrap.js";

console.log("🔄 Actualizando imágenes de productos en Supabase...");

try {
  const result = await refreshAllProductImages({ force: true });
  console.log(`✅ Listo. ${result.message}`);
} catch (err) {
  console.error("❌ Error:", err.message);
  process.exit(1);
}
