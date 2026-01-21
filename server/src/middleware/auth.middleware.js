import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Authorization header ausente" });
  }

  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Formato do token inválido (Bearer)" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, email, iat, exp }
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
