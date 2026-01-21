import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { pool } from "../db/connection.js";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  const result = await pool.query(
    "SELECT id, name, email, whatsapp FROM users WHERE id = $1",
    [req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  return res.json(result.rows[0]);
});

export default router;
