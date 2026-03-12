import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  findProductById
} from "../models/productsModel.js";

const router = express.Router();


// obtener productos
router.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});


// crear producto
router.post("/", async (req, res) => {
  try {
    const { name, price, category } = req.body;

    const product = await createProduct({ name, price, category });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});


// buscar por id
router.get("/:id", async (req, res) => {
  try {
    const product = await findProductById(Number(req.params.id));

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json(error);
  }
});


// actualizar producto
router.put("/:id", async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const { id } = req.params;

    const result = await updateProduct(id, { name, price, category });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({
      message: "Producto actualizado"
    });

  } catch (error) {
    res.status(500).json(error);
  }
});


// eliminar producto
router.delete("/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const result = await deleteProduct(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({
      message: "Producto eliminado"
    });

  } catch (error) {
    res.status(500).json(error);
  }
});


export default router;