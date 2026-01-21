import { Router } from "express";
import { pool } from "../db/connection.js";

const router = Router();

router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT id, name FROM neighborhoods ORDER BY name"
  );

  res.json(result.rows);
});

export default router;
