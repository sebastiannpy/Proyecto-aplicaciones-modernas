import { body, validationResult } from "express-validator";

// Helper reutilizable para manejar errores de validación
// Revisa si algún validador anterior generó un error.
// Si hay errores → responde con 400 y un JSON con todos los errores.
// Si NO hay errores → llama a next() y continúa hacia el controlador.
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}

// ─── AUTH ────────────────────────────────────────────────────

// body("name") → toma el campo name del body
// trim() → elimina espacios al inicio y al final
// notEmpty() → exige que no esté vacío
// isEmail() → valida que tenga formato correcto
// normalizeEmail() → lo convierte a un formato estándar (minúsculas, etc.)
export const registerValidators = [
  body("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  handleValidationErrors,
];

// body("email") → toma el campo email del body
// body("password") → toma el campo password del body
// notEmpty() → exige que no esté vacío
export const loginValidators = [
  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
  body("password").notEmpty().withMessage("Contraseña obligatoria"),
  handleValidationErrors,
];

// ─── PRODUCTOS ───────────────────────────────────────────────

export const validateProduct = [
  body("name").notEmpty().withMessage("El nombre es requerido"),
  body("price").isFloat({ gt: 0 }).withMessage("El precio debe ser mayor a 0"),
  body("stock").isInt({ min: 0 }).withMessage("El stock debe ser un número entero >= 0"),
  body("category").notEmpty().withMessage("La categoría es requerida"),
  body("brand").notEmpty().withMessage("La marca es requerida"),
  handleValidationErrors,
];

// ─── CARRITO ─────────────────────────────────────────────────

// Validación para agregar un item (POST /cart/items)
export const validateAddItem = [
  body("product_id")
    .notEmpty().withMessage("El product_id es requerido")
    .isInt({ gt: 0 }).withMessage("El product_id debe ser un número entero positivo"),
  body("quantity")
    .optional()
    .isInt({ gt: 0 }).withMessage("La cantidad debe ser un número entero mayor a 0"),
  handleValidationErrors,
];

// Validación para actualizar cantidad (PUT /cart/items/:id)
export const validateUpdateItem = [
  body("quantity")
    .notEmpty().withMessage("La cantidad es requerida")
    .isInt({ gt: 0 }).withMessage("La cantidad debe ser un número entero mayor a 0"),
  handleValidationErrors,
];

// ─── PAGOS ───────────────────────────────────────────────────

export const validateProcessPayment = [
  body("method")
    .notEmpty().withMessage("El método de pago es requerido")
    .isIn(["card", "pse", "cash_on_delivery"]).withMessage("Método de pago inválido"),
  body("details")
    .optional()
    .isObject().withMessage("Los detalles del pago deben ser un objeto"),
  body("delivery")
    .optional()
    .isObject().withMessage("La información de entrega debe ser un objeto"),
  handleValidationErrors,
];

// ─── ENTREGA ─────────────────────────────────────────────────

export const validateEstimateDelivery = [
  body("ciudad")
    .trim()
    .notEmpty().withMessage("La ciudad es requerida"),
  body("direccion")
    .trim()
    .notEmpty().withMessage("La dirección es requerida"),
  body("referencia")
    .optional()
    .isString().withMessage("La referencia debe ser texto"),
  handleValidationErrors,
];

// ─── RESEÑAS ────────────────────────────────────────────────

export const validateCreateReview = [
  body("product_id")
    .notEmpty().withMessage("El product_id es requerido")
    .isInt({ gt: 0 }).withMessage("El product_id debe ser un entero positivo"),
  body("rating")
    .notEmpty().withMessage("La calificación es requerida")
    .isInt({ min: 1, max: 5 }).withMessage("La calificación debe estar entre 1 y 5"),
  body("comment")
    .trim()
    .notEmpty().withMessage("El comentario es requerido")
    .isLength({ min: 3, max: 600 }).withMessage("El comentario debe tener entre 3 y 600 caracteres"),
  handleValidationErrors,
];
