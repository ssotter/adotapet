import { pool } from "../db/connection.js";

/**
 * GET /favorites
 * Lista os posts favoritados pelo usuário logado
 */
export async function listFavorites(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.type,
        p.status,
        p.species,
        p.name,
        p.color,
        p.age_months,
        p.weight_kg,
        p.sex,
        p.size,
        p.description,
        p.event_date,
        p.created_at,

        n.name AS neighborhood,
        p.neighborhood_id,
        p.cover_photo_id,

        -- fotos
        COALESCE(
          json_agg(
            json_build_object(
              'id', ph.id,
              'url', ph.url,
              'created_at', ph.created_at
            )
          ) FILTER (WHERE ph.id IS NOT NULL),
          '[]'
        ) AS photos

      FROM favorites f
      JOIN pet_posts p ON p.id = f.post_id
      JOIN neighborhoods n ON n.id = p.neighborhood_id
      LEFT JOIN pet_photos ph ON ph.post_id = p.id

      WHERE f.user_id = $1
        AND p.status = 'ACTIVE'

      GROUP BY
        p.id,
        n.name,
        p.neighborhood_id,
        p.cover_photo_id

      ORDER BY p.created_at DESC
      `,
      [userId]
    );

    return res.json({ data: result.rows });
  } catch (err) {
    console.error("❌ Erro listFavorites:", err);
    next(err);
  }
}

/**
 * GET /favorites/ids
 * Retorna apenas os IDs dos posts favoritados
 */
export async function listFavoriteIds(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT post_id
      FROM favorites
      WHERE user_id = $1
      `,
      [userId]
    );

    return res.json({
      data: result.rows.map((r) => r.post_id),
    });
  } catch (err) {
    console.error("❌ Erro listFavoriteIds:", err);
    next(err);
  }
}

/**
 * POST /favorites/:postId
 */
export async function favoritePost(req, res, next) {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    await pool.query(
      `
      INSERT INTO favorites (user_id, post_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      `,
      [userId, postId]
    );

    return res.status(201).json({ data: { favorited: true } });
  } catch (err) {
    console.error("❌ Erro favoritePost:", err);
    next(err);
  }
}

/**
 * DELETE /favorites/:postId
 */
export async function unfavoritePost(req, res, next) {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    await pool.query(
      `
      DELETE FROM favorites
      WHERE user_id = $1 AND post_id = $2
      `,
      [userId, postId]
    );

    return res.json({ data: { favorited: false } });
  } catch (err) {
    console.error("❌ Erro unfavoritePost:", err);
    next(err);
  }
}
