import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateEstimateDelivery } from "../middlewares/validators.js";
import { estimateDelivery } from "../controllers/deliveryController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Delivery
 *   description: Estimación de entrega
 */

/**
 * @swagger
 * /delivery/estimate:
 *   post:
 *     summary: Calcular tiempo estimado de entrega
 *     tags: [Delivery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             ciudad: "Bogotá"
 *             direccion: "Calle 100 #10-20"
 *             referencia: "Apartamento 302"
 *     responses:
 *       200:
 *         description: Estimación calculada o no calculable
 */
router.post("/estimate", authMiddleware, validateEstimateDelivery, estimateDelivery);

export default router;
