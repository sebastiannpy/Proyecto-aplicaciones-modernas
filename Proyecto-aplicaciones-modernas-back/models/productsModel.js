// filtrar productos por categoria
// filtrar productos por precio
// filtrar productos por nombre (busqueda parcial)
// ordenar productos por precio (ascendente o descendente)
// ordenar productos por nombre (A-Z o Z-A)

import supabase from "../data/supabaseClient.js";
import { getProductsSelectFields, sanitizeProductPayload } from "../services/productsSchema.js";


export async function getAllProducts() {
    const fields = await getProductsSelectFields();
    const {data, error} = await supabase
    .from("products")
    .select(fields);
    if (error) throw error;{
        return data;
    }
}


// crea un nuevo producto con un id y se organizan a medida que se van creando
export async function CreateProduct({
    name,
    price,
    category,
    brand,
    stock,
    image_url = null,
    description = null,
}) {
    const payload = await sanitizeProductPayload({
        name, price, category, brand, stock, image_url, description
    });
    const fields = await getProductsSelectFields();
    const {data, error} = await supabase
    .from("products")
    .insert([payload])
    .select(fields)
    if (error) throw error; 
        return data[0];
}

// actualizar un producto por id
export async function updateProductById(id, {
    name,
    price,
    category,
    brand,
    stock,
    image_url = null,
    description = null,
}) {
    const payload = await sanitizeProductPayload({
        name, price, category, brand, stock, image_url, description
    });
    const fields = await getProductsSelectFields();
    const { data, error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", id)
        .select(fields)
    if (error) throw error;
    return data?.[0] || null;
}



// productos con stock menor o igual a 5
export async function getLowStockProducts() {
    const fields = await getProductsSelectFields();
    const { data, error } = await supabase
        .from("products")
        .select(fields)
        .lte("stock", 5);

    if (error) throw error;

    return data;
}

export async function sortProductsByName(order = "asc") {
    const fields = await getProductsSelectFields();
    const { data, error } = await supabase
        .from("products")
        .select(fields)
        .order("name", { ascending: order === "asc" });

    if (error) throw error;

    return data;
}


export async function sortProductsByPrice(order = "desc") {
    const fields = await getProductsSelectFields();
    const { data, error } = await supabase
        .from("products")
        .select(fields)
        .order("price", { ascending: order === "asc" });

    if (error) throw error;

    return data;
}

export async function searchProductsByName(name) {
    const fields = await getProductsSelectFields();
    const { data, error } = await supabase
        .from("products")
        .select(fields)
        .ilike("name", `%${name}%`);

    if (error) throw error;

    return data;
}

export async function filterByCategory(category) {
    const fields = await getProductsSelectFields();
    const { data, error } = await supabase
        .from("products")
        .select(fields)
        .eq("category", category);

    if (error) throw error;

    return data;
}

export async function filterByPrice(min, max) {
    const fields = await getProductsSelectFields();
    const { data, error } = await supabase
        .from("products")
        .select(fields)
        .gte("price", min)
        .lte("price", max);

    if (error) throw error;

    return data;
}


// busqueda por id exacto
export async function findProductById(id) {
    const fields = await getProductsSelectFields();
    const { data, error } = await supabase
        .from("products")
        .select(fields)
        .eq("id", id)
        .single();

    if (error) return null;

    return data;
}

export async function deleteProductById(id) {
    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (error) throw error;

    return { message: "Producto eliminado" };
}
