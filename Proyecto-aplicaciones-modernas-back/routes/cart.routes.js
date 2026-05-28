import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateAddItem, validateUpdateItem } from "../middlewares/validators.js";
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  emptyCart,
} from "../controllers/cartController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Carrito de compras
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Obtener carrito
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Carrito obtenido
 */
router.get("/", authMiddleware, getCart);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Agregar producto al carrito
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             product_id: 1
 *             quantity: 2
 *     responses:
 *       201:
 *         description: Producto agregado
 */
router.post("/items", authMiddleware, validateAddItem, addItem);

/**
 * @swagger
 * /cart/items/{id}:
 *   put:
 *     summary: Actualizar producto del carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             quantity: 3
 *     responses:
 *       200:
 *         description: Item actualizado
 */
router.put("/items/:id", authMiddleware, validateUpdateItem, updateItem);

/**
 * @swagger
 * /cart/items/{id}:
 *   delete:
 *     summary: Eliminar producto del carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item eliminado
 */
router.delete("/items/:id", authMiddleware, removeItem);

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Vaciar carrito
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Carrito vaciado
 */
router.delete("/", authMiddleware, emptyCart);

export default router;
