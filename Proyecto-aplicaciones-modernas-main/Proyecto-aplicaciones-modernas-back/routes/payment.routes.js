import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateProcessPayment } from "../middlewares/validators.js";
import { getPaymentMethods, processPayment } from "../controllers/paymentController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Procesamiento de pagos
 */

/**
 * @swagger
 * /payments/methods:
 *   get:
 *     summary: Obtener métodos de pago disponibles
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Métodos disponibles
 */
router.get("/methods", authMiddleware, getPaymentMethods);

/**
 * @swagger
 * /payments/process:
 *   post:
 *     summary: Procesar pago
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             method: card
 *             details:
 *               cardNumber: "4242424242424242"
 *               holder: "Juan Perez"
 *               expiry: "12/30"
 *               cvv: "123"
 *     responses:
 *       200:
 *         description: Pago aprobado
 *       400:
 *         description: Datos inválidos
 *       402:
 *         description: Pago rechazado
 */
router.post("/process", authMiddleware, validateProcessPayment, processPayment);

export default router;
