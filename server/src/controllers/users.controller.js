import { pool } from "../db/connection.js";
import { uploadBufferToCloudinary } from "../services/photo.service.js";

export async function uploadMyAvatar(req, res) {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ error: "Arquivo não enviado (field: avatar)" });
  }

  try {
    // Upload para pasta específica no Cloudinary
    const result = await uploadBufferToCloudinary(req.file.buffer, "adotapet/avatars");
    const avatarUrl = result.secure_url || result.url;

    const updated = await pool.query(
      `UPDATE users
       SET avatar_url = $1, updated_at = now()
       WHERE id = $2
       RETURNING id, name, email, whatsapp, avatar_url`,
      [avatarUrl, userId]
    );

    return res.json(updated.rows[0]);
  } catch (err) {
    console.error("uploadMyAvatar error:", err);
    return res.status(500).json({ error: "Erro ao enviar avatar" });
  }
}

export async function me(req, res) {
  const userId = req.user.id;

  const result = await pool.query(
    `SELECT id, name, email, whatsapp, avatar_url
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  return res.json(result.rows[0]);
}
