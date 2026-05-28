import fetch from "node-fetch";
import supabaseAdmin from "../data/supabaseAdminClient.js";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_ENDPOINT = "https://api.pexels.com/v1/search";
const MAX_RESULTS = Number(process.env.IMAGE_FILL_LIMIT || 200);
const FORCE_REPLACE = process.argv.includes("--force");

if (!PEXELS_API_KEY) {
  console.error("Falta PEXELS_API_KEY en .env");
  process.exit(1);
}

function buildQuery(product) {
  const name = (product?.name || "").trim();
  const brand = (product?.brand || "").trim();
  const category = (product?.category || "repuesto automotriz").trim();
  return `${name} ${brand} ${category} auto part`;
}

async function searchImageUrl(query) {
  const url = `${PEXELS_ENDPOINT}?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const res = await fetch(url, {
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Pexels error ${res.status}: ${txt}`);
  }

  const data = await res.json();
  const first = data?.photos?.[0];
  if (!first) return null;

  return (
    first?.src?.large2x ||
    first?.src?.large ||
    first?.src?.medium ||
    first?.src?.original ||
    null
  );
}

async function main() {
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("id,name,brand,category,image_url")
    .limit(MAX_RESULTS);

  if (error) throw error;

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const p of products || []) {
    try {
      if (!FORCE_REPLACE && p.image_url) {
        skipped += 1;
        continue;
      }

      const query = buildQuery(p);
      const imageUrl = await searchImageUrl(query);

      if (!imageUrl) {
        failed += 1;
        continue;
      }

      const { error: upErr } = await supabaseAdmin
        .from("products")
        .update({ image_url: imageUrl })
        .eq("id", p.id);

      if (upErr) {
        failed += 1;
        continue;
      }

      updated += 1;
      console.log(`✔ ${p.name} -> imagen asignada`);
    } catch (err) {
      failed += 1;
      console.error(`✖ ${p?.name || p?.id}: ${err.message}`);
    }
  }

  console.log("\nResumen:");
  console.log(`Actualizados: ${updated}`);
  console.log(`Omitidos (ya tenían imagen): ${skipped}`);
  console.log(`Fallidos/sin resultado: ${failed}`);
}

main().catch((err) => {
  console.error("Error general:", err.message);
  process.exit(1);
});
