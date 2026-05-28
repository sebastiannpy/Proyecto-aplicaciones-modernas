import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateCreateReview } from "../middlewares/validators.js";
import {
  getProductReviews,
  getMyReviewStatus,
  saveReview,
} from "../controllers/reviewController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Calificaciones y reseñas de productos
 */

/**
 * @swagger
 * /reviews/product/{productId}:
 *   get:
 *     summary: Listar reseñas de un producto
 *     tags: [Reviews]
 */
router.get("/product/:productId", getProductReviews);

/**
 * @swagger
 * /reviews/product/{productId}/me:
 *   get:
 *     summary: Obtener si el usuario puede reseñar y su reseña actual
 *     tags: [Reviews]
 */
router.get("/product/:productId/me", authMiddleware, getMyReviewStatus);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Crear/actualizar reseña de producto comprado
 *     tags: [Reviews]
 */
router.post("/", authMiddleware, validateCreateReview, saveReview);

export default router;
