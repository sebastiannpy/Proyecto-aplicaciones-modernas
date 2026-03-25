// filtrar productos por categoria
// filtrar productos por precio
// filtrar productos por nombre (busqueda parcial)
// ordenar productos por precio (ascendente o descendente)
// ordenar productos por nombre (A-Z o Z-A)

import supabase from "../data/supabaseClient.js";


export async function getAllProducts() {
    const {data, error} = await supabase
    .from("products")
    .select("*");
    if (error) throw error;{
        return data;
    }
}


// crea un nuevo producto con un id y se organizan a medida que se van creando
export async function CreateProduct({ name, price, category, brand, stock }) {
    const {data, error} = await supabase
    .from("products")
    .insert({ name, price, category, brand, stock })
    .select("*")
    if (error) throw error; 
        return data[0];
}

// actualizar un producto por id
export async function updateProductById(id, { name, price, category, brand, stock }) {
    const { data, error } = await supabase
        .from("products")
        .update({ name, price, category, brand, stock })
        .eq("id", id)
        .select("*")
    if (error) throw error;
    return data;
}



// productos con stock menor o igual a 5
export async function getLowStockProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .lte("stock", 5);

    if (error) throw error;

    return data;
}

export async function sortProductsByName(order = "asc") {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: order === "asc" });

    if (error) throw error;

    return data;
}


export async function sortProductsByPrice(order = "desc") {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("price", { ascending: order === "asc" });

    if (error) throw error;

    return data;
}

export async function searchProductsByName(name) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${name}%`);

    if (error) throw error;

    return data;
}

export async function filterByCategory(category) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category);

    if (error) throw error;

    return data;
}

export async function filterByPrice(min, max) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .gte("price", min)
        .lte("price", max);

    if (error) throw error;

    return data;
}


// busqueda por id exacto
export async function findProductById(id) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
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


