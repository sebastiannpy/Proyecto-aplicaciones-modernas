import {
  getCartWithItems,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} from "../models/cartModel.js";

import { findProductById } from "../models/productsModel.js";

// GET /api/cart
export async function getCart(req, res, next) {
  try {
    const userId = req.user.id;
    const cart = await getCartWithItems(userId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

// POST /api/cart/items
export async function addItem(req, res, next) {
  try {
    const userId = req.user.id;
    const productId = Number(req.body.product_id);
    const quantity = Number(req.body.quantity ?? 1);

    const product = await findProductById(productId);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Stock insuficiente. Disponible: ${product.stock}` });
    }

    const cart = await getCartWithItems(userId);
    const existing = cart.items.find((item) => item.product_id === productId);
    const nextQuantity = (existing?.quantity || 0) + quantity;

    if (nextQuantity > product.stock) {
      return res.status(400).json({
        message: `Stock insuficiente. Disponible: ${product.stock}, en carrito: ${existing?.quantity || 0}`,
      });
    }

    const item = await addItemToCart(userId, productId, quantity);
    res.status(201).json({ message: "Producto agregado al carrito", item });
  } catch (err) {
    next(err);
  }
}

// PUT /api/cart/items/:id
export async function updateItem(req, res, next) {
  try {
    const userId = req.user.id;
    const itemId = Number(req.params.id);
    const quantity = Number(req.body.quantity);

    const cart = await getCartWithItems(userId);
    const existingItem = cart.items.find((item) => item.id === itemId);
    if (!existingItem) {
      return res.status(404).json({ message: "Item no encontrado en tu carrito" });
    }

    const availableStock = existingItem.products?.stock ?? 0;
    if (quantity > availableStock) {
      return res.status(400).json({ message: `Stock insuficiente. Disponible: ${availableStock}` });
    }

    const updated = await updateCartItem(userId, itemId, quantity);
    if (!updated) return res.status(404).json({ message: "Item no encontrado en tu carrito" });

    res.json({ message: "Cantidad actualizada", item: updated });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart/items/:id
export async function removeItem(req, res, next) {
  try {
    const userId = req.user.id;
    const itemId = Number(req.params.id);

    const result = await removeItemFromCart(userId, itemId);
    if (!result) return res.status(404).json({ message: "Item no encontrado en tu carrito" });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart
export async function emptyCart(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await clearCart(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
