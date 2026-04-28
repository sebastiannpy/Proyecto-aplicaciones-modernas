import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { listNotifications, readNotification } from "../controllers/notificationController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Bandeja de notificaciones del usuario
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Listar notificaciones del usuario autenticado
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Notificaciones listadas
 */
router.get("/", authMiddleware, listNotifications);

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Marcar notificación como leída
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notificación actualizada
 */
router.patch("/:id/read", authMiddleware, readNotification);

export default router;
