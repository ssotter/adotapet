import { pool } from "../db/connection.js";

export async function createVisitRequest(req, res) {
  const requesterId = req.user.id;
  const { postId } = req.params;
  const { message } = req.body;

  // Verifica se o post existe e está ativo
  const post = await pool.query(
    "SELECT id, owner_id, status FROM pet_posts WHERE id = $1",
    [postId],
  );

  if (post.rows.length === 0) {
    return res.status(404).json({ error: "Anúncio não encontrado" });
  }

  if (post.rows[0].status !== "ACTIVE") {
    return res.status(400).json({ error: "Anúncio não está ativo" });
  }

  // Evita o dono solicitar a própria visita
  if (post.rows[0].owner_id === requesterId) {
    return res
      .status(400)
      .json({ error: "Você não pode solicitar visita no seu próprio anúncio" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO visit_requests (post_id, requester_id, message, status)
       VALUES ($1, $2, NULLIF($3, ''), 'PENDING')
       RETURNING id, post_id, requester_id, message, status, created_at`,
      [postId, requesterId, message ?? ""],
    );

    return res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    // UNIQUE(post_id, requester_id) → já solicitou antes
    if (err.code === "23505") {
      return res
        .status(409)
        .json({ error: "Você já solicitou visita para este anúncio" });
    }
    throw err;
  }
}

export async function listMyVisitRequests(req, res) {
  const requesterId = req.user.id;

  const result = await pool.query(
    `SELECT
       vr.id, vr.post_id, vr.requester_id, vr.message, vr.status, vr.created_at,
       p.type, p.species, p.name, p.color, p.age_months, p.weight_kg,
       n.name AS neighborhood
     FROM visit_requests vr
     JOIN pet_posts p ON p.id = vr.post_id
     JOIN neighborhoods n ON n.id = p.neighborhood_id
     WHERE vr.requester_id = $1
     ORDER BY vr.created_at DESC`,
    [requesterId],
  );

  return res.json({ data: result.rows });
}

export async function listReceivedVisitRequests(req, res) {
  const ownerId = req.user.id;

  const result = await pool.query(
    `SELECT
       vr.id, vr.post_id, vr.requester_id, vr.message, vr.status, vr.created_at,
       u.name AS requester_name, u.email AS requester_email,
       p.type, p.species, p.name AS pet_name, p.color, p.age_months, p.weight_kg,
       n.name AS neighborhood
     FROM visit_requests vr
     JOIN pet_posts p ON p.id = vr.post_id
     JOIN users u ON u.id = vr.requester_id
     JOIN neighborhoods n ON n.id = p.neighborhood_id
     WHERE p.owner_id = $1
     ORDER BY vr.created_at DESC`,
    [ownerId],
  );

  return res.json({ data: result.rows });
}

export async function updateVisitRequestStatus(req, res) {
  const ownerId = req.user.id;
  const { id } = req.params;
  const { status } = req.body;

  // Só o dono do post pode aprovar/rejeitar
  const result = await pool.query(
    `UPDATE visit_requests vr
     SET status = $1, updated_at = now()
     FROM pet_posts p
     WHERE vr.id = $2
       AND p.id = vr.post_id
       AND p.owner_id = $3
       AND vr.status = 'PENDING'
     RETURNING vr.id, vr.post_id, vr.requester_id, vr.status, vr.updated_at`,
    [status, id, ownerId],
  );

  if (result.rows.length === 0) {
    return res.status(403).json({
      error: "Sem permissão, solicitação não encontrada ou já foi processada",
    });
  }

  return res.json({ data: result.rows[0] });
}
