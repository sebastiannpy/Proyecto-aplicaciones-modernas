import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getMyOrders } from "../controllers/orderController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Pedidos del usuario
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Obtener pedidos del usuario autenticado
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get("/", authMiddleware, getMyOrders);

export default router;
