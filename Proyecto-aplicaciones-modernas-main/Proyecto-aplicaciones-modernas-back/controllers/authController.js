// controllers/authController.js
// Usa Supabase Auth (igual que el equipo)
// registerUser y loginUser vienen de supabaseAuth.js (services)

import { registerUser, loginUser } from "../services/supabaseAuth.js";
import { createNotification } from "../models/notificationModel.js";

// REGISTRO
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const data = await registerUser(name, email, password);
    if (!data || data.error) {
      return res.status(400).json({
        message: data?.error || "Error al registrar usuario",
      });
    }

    if (data.user?.id) {
      try {
        await createNotification({
          userId: data.user.id,
          type: "registration_success",
          message: "Registro exitoso",
          metadata: { email },
        });
      } catch (error) {
        console.error("[notifications] Error al crear notificación de registro:", error.message);
      }
    }

    res.status(201).json({
      message: "Usuario registrado",
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    next(err);
  }
}

// LOGIN
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);
    if (!data || data.error) {
      return res.status(401).json({
        message: data?.error || "Credenciales inválidas",
      });
    }
    res.json({
      message: "Login exitoso",
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    next(err);
  }
}

// LOGOUT
export async function logout(req, res, next) {
  try {
    // Con JWT stateless, el cliente elimina el token localmente.
    // Revocación global de tokens requeriría estrategia adicional (denylist/rotación).
    res.json({ message: "Logout exitoso" });
  } catch (err) {
    next(err);
  }
}
