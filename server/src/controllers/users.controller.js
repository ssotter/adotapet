import { pool } from "../db/connection.js";
import { uploadBufferToCloudinary } from "../services/photo.service.js";
import { ok, fail } from "../utils/http.js";

export async function uploadMyAvatar(req, res) {
  const userId = req.user.id;

  if (!req.file) {
    return fail(res, "Arquivo não enviado (field: avatar)", 400, "VALIDATION_ERROR");
  }

  const result = await uploadBufferToCloudinary(req.file.buffer, "adotapet/avatars");
  const avatarUrl = result.secure_url || result.url;

  const updated = await pool.query(
    `UPDATE users
     SET avatar_url = $1, updated_at = now()
     WHERE id = $2
     RETURNING id, name, email, whatsapp, avatar_url`,
    [avatarUrl, userId]
  );

  return ok(res, updated.rows[0]);
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
    return fail(res, "Usuário não encontrado", 404, "NOT_FOUND");
  }

  return ok(res, result.rows[0]);
}

