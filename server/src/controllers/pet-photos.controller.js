import { pool } from "../db/connection.js";
import { uploadBufferToCloudinary } from "../services/photo.service.js";

export async function uploadPostPhoto(req, res) {
  const ownerId = req.user.id;
  const { id: postId } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "Arquivo não enviado (field: photo)" });
  }

  // Confere se post existe e se é do dono
  const post = await pool.query(
    "SELECT id FROM pet_posts WHERE id = $1 AND owner_id = $2",
    [postId, ownerId]
  );

  if (post.rows.length === 0) {
    return res.status(403).json({ error: "Sem permissão ou anúncio não encontrado" });
  }

  const uploaded = await uploadBufferToCloudinary(req.file.buffer, "adotapet/posts");

  const result = await pool.query(
    `INSERT INTO pet_photos (post_id, url)
     VALUES ($1, $2)
     RETURNING id, post_id, url, created_at`,
    [postId, uploaded.secure_url]
  );

  return res.status(201).json(result.rows[0]);
}

export async function deletePhoto(req, res) {
  const ownerId = req.user.id;
  const { id: photoId } = req.params;

  // Confere se foto pertence a um post do dono
  const photo = await pool.query(
    `SELECT ph.id, ph.url, p.owner_id
     FROM pet_photos ph
     JOIN pet_posts p ON p.id = ph.post_id
     WHERE ph.id = $1`,
    [photoId]
  );

  if (photo.rows.length === 0) {
    return res.status(404).json({ error: "Foto não encontrada" });
  }

  if (photo.rows[0].owner_id !== ownerId) {
    return res.status(403).json({ error: "Sem permissão para remover esta foto" });
  }

  await pool.query("DELETE FROM pet_photos WHERE id = $1", [photoId]);
  return res.json({ ok: true });
}
