// server/src/controllers/favorites.controller.js
import { pool } from "../db/connection.js";

export async function addFavorite(req, res, next) {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const result = await pool.query(
      `
      INSERT INTO favorites (user_id, post_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, post_id) DO NOTHING
      RETURNING id, user_id, post_id, created_at
      `,
      [userId, postId]
    );

    // Idempotente: se já existia, retorna OK do mesmo jeito
    if (result.rowCount === 0) {
      return res.status(200).json({ data: { favorited: true } });
    }

    return res.status(201).json({
      data: { favorited: true, favorite: result.rows[0] },
    });
  } catch (err) {
    return next(err);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const result = await pool.query(
      `
      DELETE FROM favorites
      WHERE user_id = $1 AND post_id = $2
      RETURNING id
      `,
      [userId, postId]
    );

    // Idempotente
    return res.status(200).json({
      data: { favorited: false, removed: result.rowCount > 0 },
    });
  } catch (err) {
    return next(err);
  }
}

export async function listFavoriteIds(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT post_id
      FROM favorites
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({ data: result.rows.map((r) => r.post_id) });
  } catch (err) {
    return next(err);
  }
}

export async function listFavorites(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.owner_id,
        p.type,
        p.status,
        p.species,
        p.name,
        p.color,
        p.age_months,
        p.weight_kg,
        p.sex,
        p.size,
        p.neighborhood_id,
        n.name AS neighborhood_name,
        p.description,
        p.event_date,
        p.cover_photo_id,
        p.created_at,
        p.updated_at,

        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ph.id,
              'url', ph.url
            )
          ) FILTER (WHERE ph.id IS NOT NULL),
          '[]'::json
        ) AS photos

      FROM favorites f
      JOIN pet_posts p ON p.id = f.post_id
      JOIN neighborhoods n ON n.id = p.neighborhood_id
      LEFT JOIN pet_photos ph ON ph.post_id = p.id
      WHERE f.user_id = $1
      GROUP BY p.id, n.name
      ORDER BY f.created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({ data: result.rows });
  } catch (err) {
    return next(err);
  }
}
