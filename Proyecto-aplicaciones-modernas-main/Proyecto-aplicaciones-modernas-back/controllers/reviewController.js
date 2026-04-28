import { findProductById } from "../models/productsModel.js";
import {
  listReviewsByProduct,
  hasUserPurchasedProduct,
  getUserReview,
  upsertReview,
} from "../models/reviewModel.js";

function buildSummary(reviews) {
  if (!reviews.length) return { count: 0, average: 0 };
  const sum = reviews.reduce((acc, review) => acc + Number(review.rating || 0), 0);
  return {
    count: reviews.length,
    average: Number((sum / reviews.length).toFixed(1)),
  };
}

export async function getProductReviews(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    const product = await findProductById(productId);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    const reviews = await listReviewsByProduct(productId);
    res.json({
      reviews,
      summary: buildSummary(reviews),
    });
  } catch (err) {
    next(err);
  }
}

export async function getMyReviewStatus(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    const userId = req.user.id;
    const product = await findProductById(productId);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    const canReview = await hasUserPurchasedProduct(userId, productId);
    const myReview = canReview ? await getUserReview(userId, productId) : null;
    res.json({ canReview, myReview });
  } catch (err) {
    next(err);
  }
}

export async function saveReview(req, res, next) {
  try {
    const userId = req.user.id;
    const productId = Number(req.body.product_id);
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || "").trim();

    const product = await findProductById(productId);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    const canReview = await hasUserPurchasedProduct(userId, productId);
    if (!canReview) {
      return res.status(403).json({ message: "Solo puedes reseñar productos que ya compraste" });
    }

    const reviewerName =
      req.user?.user_metadata?.name ||
      req.user?.email?.split("@")[0] ||
      "Comprador";

    const review = await upsertReview({
      userId,
      productId,
      rating,
      comment,
      reviewerName,
    });

    res.status(201).json({ message: "Reseña guardada correctamente", review });
  } catch (err) {
    next(err);
  }
}
