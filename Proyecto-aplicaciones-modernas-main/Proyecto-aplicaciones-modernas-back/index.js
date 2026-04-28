import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import fetch from "node-fetch";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js"; // ✅ NUEVO
import paymentRoutes from "./routes/payment.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";
import orderRoutes from "./routes/order.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import { ensureAdminUser } from "./services/adminBootstrap.js";
import { ensureProductCatalog } from "./services/productCatalogBootstrap.js";

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

global.fetch = fetch;
const PORT = process.env.PORT || 3000;
const CORS_ORIGINS = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// ✅ CORS PRIMERO (ANTES DE TODO)
app.use(cors({
  origin(origin, callback) {
    const isLocalDevOrigin =
      /^http:\/\/localhost:\d+$/.test(origin || "") ||
      /^http:\/\/127\.0\.0\.1:\d+$/.test(origin || "");

    if (!origin || CORS_ORIGINS.includes(origin) || isLocalDevOrigin) return callback(null, true);
    return callback(new Error("Origen no permitido por CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));

// JSON (permite imagenes base64 en payloads de admin)
app.use(express.json({ limit: "10mb" }));

// ✅ RUTAS
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes); // ✅ NUEVO
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// Página raíz
app.get("/", (req, res) => {
  res.send("API de autenticación de usuarios");
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Server error"
  });
});

async function startServer() {
  try {
    await ensureAdminUser();
  } catch (error) {
    console.error("[admin-bootstrap] Error al preparar usuario admin:", error.message);
  }

  try {
    await ensureProductCatalog();
  } catch (error) {
    console.error("[products-bootstrap] Error al preparar catalogo base:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Documentacion disponible en http://localhost:${PORT}/api-docs`);
  });
}

startServer();
