// models/cartModel.js
// Lógica de base de datos para el carrito y sus items
// user_id es UUID que viene de profiles/auth.users (req.user.id)

import supabase from "../data/supabaseClient.js";

// ─── CARRITO ────────────────────────────────────────────────

// Obtiene o crea el carrito del usuario
export async function getOrCreateCart(userId) {
  let { data: cart, error } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !cart) {
    const { data: newCart, error: createError } = await supabase
      .from("cart")
      .insert({ user_id: userId })
      .select("*")
      .single();

    if (createError) throw createError;
    return newCart;
  }

  return cart;
}

// Obtiene el carrito completo con sus items y datos del producto
export async function getCartWithItems(userId) {
  const cart = await getOrCreateCart(userId);

  const { data: items, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      product_id,
      products (
        id,
        name,
        description,
        image_url,
        price,
        brand,
        category,
        stock
      )
    `)
    .eq("cart_id", cart.id);

  if (error) throw error;

  const total = items.reduce((sum, item) => {
    return sum + item.quantity * (item.products?.price || 0);
  }, 0);

  return {
    cart_id: cart.id,
    user_id: userId,
    items: items || [],
    total: parseFloat(total.toFixed(2)),
  };
}

// ─── ITEMS ──────────────────────────────────────────────────

// Agrega un producto al carrito (POST /cart/items)
// Si el producto ya existe, incrementa la cantidad
export async function addItemToCart(userId, productId, quantity) {
  const cart = await getOrCreateCart(userId);

  const { data: existing } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("cart_items")
    .insert({ cart_id: cart.id, product_id: productId, quantity })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

// Actualiza la cantidad de un item (PUT /cart/items/:id)
export async function updateCartItem(userId, itemId, quantity) {
  const cart = await getOrCreateCart(userId);

  const { data: item, error: findError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("id", itemId)
    .eq("cart_id", cart.id)
    .single();

  if (findError || !item) return null;

  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

// Elimina un producto del carrito (DELETE /cart/items/:id)
export async function removeItemFromCart(userId, itemId) {
  const cart = await getOrCreateCart(userId);

  const { data: item, error: findError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("id", itemId)
    .eq("cart_id", cart.id)
    .single();

  if (findError || !item) return null;

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", itemId);

  if (error) throw error;
  return { message: "Producto eliminado del carrito" };
}

// Vacía todo el carrito (DELETE /cart)
export async function clearCart(userId) {
  const cart = await getOrCreateCart(userId);

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id);

  if (error) throw error;
  return { message: "Carrito vaciado" };
}
