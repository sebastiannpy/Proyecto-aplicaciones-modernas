import supabaseAdmin from "../data/supabaseAdminClient.js";

let cached = null;

async function hasColumn(columnName) {
  const { error } = await supabaseAdmin
    .from("products")
    .select(columnName)
    .limit(1);
  return !error;
}

export async function getProductsSchemaCapabilities() {
  if (cached) return cached;

  const [hasImageUrl, hasDescription] = await Promise.all([
    hasColumn("image_url"),
    hasColumn("description"),
  ]);

  cached = { hasImageUrl, hasDescription };
  return cached;
}

export async function getProductsSelectFields() {
  const caps = await getProductsSchemaCapabilities();
  const fields = ["id", "name", "price", "brand", "category", "stock"];
  if (caps.hasImageUrl) fields.push("image_url");
  if (caps.hasDescription) fields.push("description");
  return fields.join(", ");
}

export async function sanitizeProductPayload(payload = {}) {
  const caps = await getProductsSchemaCapabilities();
  const clean = {
    name: payload.name,
    price: payload.price,
    category: payload.category,
    brand: payload.brand,
    stock: payload.stock,
  };

  if (caps.hasImageUrl && "image_url" in payload) clean.image_url = payload.image_url;
  if (caps.hasDescription && "description" in payload) clean.description = payload.description;
  return clean;
}
