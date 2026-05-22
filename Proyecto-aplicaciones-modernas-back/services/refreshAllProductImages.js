import supabaseAdmin from "../data/supabaseAdminClient.js";

function slugify(text = "") {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildImageUrl(product) {
  const query = slugify(`${product.name || "auto-part"} ${product.category || "automotive"}`) || "auto-part";
  const seed = String(product.id || Math.floor(Math.random() * 100000));
  // Fuente sin API key, con semilla para que quede estable por producto.
  return `https://loremflickr.com/1200/800/${query}?lock=${seed}`;
}

async function main() {
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("id,name,category,image_url")
    .limit(1000);

  if (error) throw error;
  if (!products?.length) {
    console.log("No hay productos para actualizar.");
    return;
  }

  let updated = 0;
  let failed = 0;

  for (const p of products) {
    try {
      const newUrl = buildImageUrl(p);
      const { error: upErr } = await supabaseAdmin
        .from("products")
        .update({ image_url: newUrl })
        .eq("id", p.id);

      if (upErr) throw upErr;
      updated += 1;
      console.log(`✔ ${p.name} -> ${newUrl}`);
    } catch (err) {
      failed += 1;
      console.error(`✖ ${p.name || p.id}: ${err.message}`);
    }
  }

  console.log("\nResumen final:");
  console.log(`Actualizados: ${updated}`);
  console.log(`Fallidos: ${failed}`);
}

main().catch((err) => {
  console.error("Error general:", err.message);
  process.exit(1);
});
