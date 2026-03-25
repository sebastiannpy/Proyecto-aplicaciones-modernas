import express from "express";
import { body, validationResult } from "express-validator";
import {
  getAllProducts,
  CreateProduct,
  findProductById,
  getLowStockProducts,
  sortProductsByPrice,
  sortProductsByName,
  updateProductById,
  deleteProductById
} from "../models/productsModel.js";

const router = express.Router();

// obtener productos
router.get("/", async (req, res) => {
  const productNew = await getAllProducts();
  res.json(productNew);
});

router.get("/price/range/:min/:max", async (req, res) => {
  const { min, max } = req.params;

  const products = await getAllProducts();

  const filtered = products.filter(
    (p) => p.price >= Number(min) && p.price <= Number(max),
  );

  if (filtered.length === 0) {
    return res.json({ message: "No hay productos en ese rango de precio" });
  }

  res.json(filtered);
});

// crear producto

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("price").notEmpty().withMessage("El precio es obligatorio"),
    body("category").notEmpty().withMessage("La categoría es obligatoria"),
    body("brand").notEmpty().withMessage("La marca es obligatoria"),
    body("stock").notEmpty().withMessage("El stock es obligatorio"),
  ],

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { name, price, category, brand, stock } = req.body;

    const productsNew = await getAllProducts();

    const exists = productsNew.find(
      (p) =>
        p.name.toLowerCase() === name.toLowerCase() &&
        p.brand.toLowerCase() === brand.toLowerCase(),
    );

    if (exists) {
      return res
        .status(400)
        .json({ message: "Producto ya existe en la base de datos" });
    }

    const productNew = await CreateProduct({
      name,
      price,
      category,
      brand,
      stock,
    });

    res.status(201).json(productNew);
  },
);

//filtrar productos por nombre (busqueda parcial)
router.get("/search/:name", async (req, res) => {
  const { name } = req.params;
  const products = await getAllProducts();
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(name.toLowerCase()),
  );
  res.json(filtered);
});

//filtrar productos por categoria
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  const products = await getAllProducts();
  const filtered = products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase(),
  );
  res.json(filtered);
});

// filtrar productos por marca
router.get("/brand/:brand", async (req, res) => {
  const { brand } = req.params;
  const products = await getAllProducts();
  const filtered = products.filter(
    (p) => p.brand.toLowerCase() === brand.toLowerCase(),
  );
  res.json(filtered);
});

// actualizar producto 
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, brand, stock } = req.body;

    if (!name || !price || !category || !brand || !stock) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const updatedProduct = await updateProductById( id, {
      name, 
      price,
      category,
      brand,
      stock,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Este producto no existe en la base de datos" });
    }

    res.json({
      message: "Producto actualizado exitosamente",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto" });
  }

});

// productos sin stock o con stock bajo (5 o menos)
router.get("/low-stock", async (req, res) => {
  const products = await getLowStockProducts();

  if (products.length === 0) {
    return res.json({ message: "No hay productos con stock bajo" });
  }

  res.json(products);
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const deletedProduct = await deleteProductById(id);

  if (!deletedProduct) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  res.json({
    message: "Producto eliminado correctamente",
    product: deletedProduct,
  });
});

// buscar por id
router.get("/id/:id", async (req, res) => {
  const product = await findProductById(Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  res.json(product);
});

export default router;
