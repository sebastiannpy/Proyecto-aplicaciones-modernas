export function adminOnly(req, res, next) {
  const userRole = req.user?.app_metadata?.role || req.user?.user_metadata?.role;

  if (userRole !== "admin") {
    return res.status(403).json({ message: "Acceso restringido a administradores" });
  }

  next();
}
