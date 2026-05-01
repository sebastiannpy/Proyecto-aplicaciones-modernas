// Verifica que el request tenga un token JWT válido en el header Authorization
// Si es válido, adjunta el usuario decodificado en req.user para usarlo en los controllers
 
import supabase from "../data/supabaseClient.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }
    const token = authHeader.split(" ")[1];
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ message: "Token inválido" });
    }
    req.user = data.user;
    next();
  } catch (err) {
    next(err);
  }
};