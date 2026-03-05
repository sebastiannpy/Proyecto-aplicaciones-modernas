import express from "express";
import { getAllProducts, CreateProduct, findProductById } from "../models/productsModel.js";

const router = express.Router();

// obtener productos
router.get("/", async (req, res) => {
  const products = await getAllProducts();
  res.json(products);
});


// crear producto
router.post("/", async (req, res) => {
  const { name, price, category } = req.body;

  const product = await CreateProduct({ name, price, category });

  res.status(201).json(product);
});

//filtrar productos por precio
router.get("/price/:price", async (req, res) => {
  const { price } = req.params;
  const products = await getAllProducts();
  const filtered = products.filter(p => p.price <= Number(price));
  res.json({message: "No hay productos por ese precio", products: filtered});
});

//filtrar productos por nombre (busqueda parcial)
router.get("/search/:name", async (req, res) => {
  const { name } = req.params;
  const products = await getAllProducts();
  const filtered = products.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
  res.json(filtered);
});

//filtrar productos por categoria
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  const products = await getAllProducts();
  const filtered = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  res.json(filtered);
});


// actualizar producto
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, category } = req.body;

  const products = await getAllProducts();
  const index = products.findIndex(p => p.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  // actualizar datos
  products[index] = {
    ...products[index],
    name,
    price,
    category
  };

  res.json({
    message: "Producto actualizado",
    product: products[index]
  });
});


// buscar por id
router.get("/:_id", async (req, res) => {
  const product = await findProductById(Number(req.params._id));

  if (!product) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  res.json(product);
});

export default router;