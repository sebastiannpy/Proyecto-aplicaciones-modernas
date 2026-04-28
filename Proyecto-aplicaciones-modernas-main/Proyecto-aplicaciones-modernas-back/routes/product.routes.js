import express from "express";
import {
  getAllProducts,
  CreateProduct,
  findProductById,
  updateProductById,
  deleteProductById
} from "../models/productsModel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateProduct } from "../middlewares/validators.js";
import { adminOnly } from "../middlewares/roleMiddleware.js";
import { ensureProductCatalog } from "../services/productCatalogBootstrap.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestión de productos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 */
router.get("/", async (req, res) => {
  const productNew = await getAllProducts();
  res.json(productNew);
});

/**
 * @swagger
 * /products/price/range/{min}/{max}:
 *   get:
 *     summary: Filtrar por rango de precio
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: min
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: max
 *         required: true
 *         schema:
 *           type: number
 */
router.get("/price/range/:min/:max", async (req, res) => {
  const { min, max } = req.params;
  const products = await getAllProducts();

  const filtered = products.filter(
    (p) => p.price >= Number(min) && p.price <= Number(max),
  );

  res.json(filtered);
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Laptop"
 *             price: 2000
 *             category: "Tecnología"
 *             brand: "HP"
 *             stock: 10
 */
router.post("/", authMiddleware, adminOnly, validateProduct, async (req, res) => {
  const { name, price, category, brand, stock, image_url, description } = req.body;

  const productNew = await CreateProduct({
    name,
    price,
    category,
    brand,
    stock,
    image_url,
    description,
  });

  res.status(201).json(productNew);
});

router.post("/bootstrap", authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const result = await ensureProductCatalog();
    res.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /products/search/{name}:
 *   get:
 *     summary: Buscar por nombre
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/search/:name", async (req, res) => {
  const { name } = req.params;
  const products = await getAllProducts();
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(name.toLowerCase()),
  );
  res.json(filtered);
});

/**
 * @swagger
 * /products/category/{category}:
 *   get:
 *     summary: Filtrar por categoría
 *     tags: [Products]
 */
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  const products = await getAllProducts();
  const filtered = products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase(),
  );
  res.json(filtered);
});

/**
 * @swagger
 * /products/brand/{brand}:
 *   get:
 *     summary: Filtrar por marca
 *     tags: [Products]
 */
router.get("/brand/:brand", async (req, res) => {
  const { brand } = req.params;
  const products = await getAllProducts();
  const filtered = products.filter(
    (p) => p.brand.toLowerCase() === brand.toLowerCase(),
  );
  res.json(filtered);
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put("/:id", authMiddleware, adminOnly, validateProduct, async (req, res) => {
  const updatedProduct = await updateProductById(req.params.id, req.body);
  if (!updatedProduct) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  res.json(updatedProduct);
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  const deletedProduct = await deleteProductById(Number(req.params.id));
  res.json(deletedProduct);
});

/**
 * @swagger
 * /products/id/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/id/:id", async (req, res) => {
  const product = await findProductById(Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  res.json(product);
});

export default router;
