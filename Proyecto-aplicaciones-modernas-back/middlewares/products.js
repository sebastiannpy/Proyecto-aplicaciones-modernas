// validar campos de productos
// body() → sirve para validar campos enviados en el req.body
// validationResult() → recoge los errores generados por los validadores
import { body, validationResult } from "express-validator";


// este bloque realiza la funcion de validar los campos de un producto al crear o actualizar un producto
// body("name") → toma el campo name del body
// trim() → elimina espacios al inicio y al final
export const productValidators = [
    body("name").trim().notEmpty().withMessage("El nombre del producto es obligatorio"),
    body("price").isFloat({ gt: 0 }).withMessage("El precio debe ser un número mayor que 0"),
    body("category").trim().notEmpty().withMessage("La categoría del producto es obligatoria")
];

// este bloque realiza el proceso de validación de los campos del producto y si hay errores devuelve un error 400 con los detalles de los errores, si no hay errores continua con el siguiente middleware o controlador
export const validateProducts = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// busca por id y valida que el id sea un string no vacío, si no es válido devuelve un error 400, si es válido continua con el siguiente
export const validateProductId = (req, res, next) => {
    const { id } = req.params;
    if (!id || typeof id !== "string" || id.trim() === "") {
        return res.status(400).json({ error: "ID de producto inválido" });
    }
    next();
};