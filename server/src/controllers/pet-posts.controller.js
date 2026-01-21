import { pool } from "../db/connection.js";

function toNumber(value) {
  if (value === undefined) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export async function createPost(req, res) {
  const ownerId = req.user.id;

  const {
    type,
    species,
    name,
    color,
    ageMonths,
    weightKg,
    sex = "UNKNOWN",
    size = null,
    neighborhoodId,
    description,
    eventDate,
  } = req.body;

  // Regra: event_date obrigatório em FOUND_LOST
  if (type === "FOUND_LOST" && (!eventDate || String(eventDate).trim() === "")) {
    return res.status(400).json({ error: "eventDate é obrigatório para FOUND_LOST" });
  }

  // Valida neighborhoodId existe
  const nb = await pool.query("SELECT id FROM neighborhoods WHERE id = $1", [neighborhoodId]);
  if (nb.rows.length === 0) {
    return res.status(400).json({ error: "Bairro inválido (neighborhoodId não encontrado)" });
  }

  const result = await pool.query(
    `INSERT INTO pet_posts
      (owner_id, type, status, species, name, color, age_months, weight_kg, sex, size, neighborhood_id, description, event_date)
     VALUES
      ($1, $2, 'ACTIVE', $3, NULLIF($4, ''), $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING id, owner_id, type, status, species, name, color, age_months, weight_kg, sex, size, neighborhood_id, description, event_date, created_at`,
    [
      ownerId,
      type,
      species,
      name ?? "",
      color,
      ageMonths,
      weightKg,
      sex,
      size,
      neighborhoodId,
      description,
      eventDate || null,
    ]
  );

  return res.status(201).json(result.rows[0]);
}

export async function listPosts(req, res) {
  // filtros
  const { type, neighborhoodId, color, ageMin, ageMax, weightMin, weightMax } = req.query;

  const where = ["p.status = 'ACTIVE'"];
  const params = [];
  let i = 1;

  if (type) {
    where.push(`p.type = $${i++}`);
    params.push(type);
  }

  if (neighborhoodId) {
    where.push(`p.neighborhood_id = $${i++}`);
    params.push(neighborhoodId);
  }

  if (color) {
    where.push(`LOWER(p.color) LIKE LOWER($${i++})`);
    params.push(`%${color}%`);
  }

  const aMin = toNumber(ageMin);
  const aMax = toNumber(ageMax);
  const wMin = toNumber(weightMin);
  const wMax = toNumber(weightMax);

  if (aMin !== undefined) {
    where.push(`p.age_months >= $${i++}`);
    params.push(aMin);
  }
  if (aMax !== undefined) {
    where.push(`p.age_months <= $${i++}`);
    params.push(aMax);
  }
  if (wMin !== undefined) {
    where.push(`p.weight_kg >= $${i++}`);
    params.push(wMin);
  }
  if (wMax !== undefined) {
    where.push(`p.weight_kg <= $${i++}`);
    params.push(wMax);
  }

  const sql = `
    SELECT
      p.id, p.type, p.status, p.species, p.name, p.color,
      p.age_months, p.weight_kg, p.sex, p.size,
      p.description, p.event_date, p.created_at,
      n.name AS neighborhood,
      p.neighborhood_id
    FROM pet_posts p
    JOIN neighborhoods n ON n.id = p.neighborhood_id
    WHERE ${where.join(" AND ")}
    ORDER BY p.created_at DESC
    LIMIT 50;
  `;

  const result = await pool.query(sql, params);
  return res.json(result.rows);
}

export async function getPostById(req, res) {
  const { id } = req.params;

  const result = await pool.query(
    `SELECT
      p.id, p.owner_id, p.type, p.status, p.species, p.name, p.color,
      p.age_months, p.weight_kg, p.sex, p.size,
      p.description, p.event_date, p.created_at,
      n.name AS neighborhood,
      p.neighborhood_id
     FROM pet_posts p
     JOIN neighborhoods n ON n.id = p.neighborhood_id
     WHERE p.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Anúncio não encontrado" });
  }

  return res.json(result.rows[0]);
}

export async function listMyPosts(req, res) {
  const ownerId = req.user.id;

  const result = await pool.query(
    `SELECT
      p.id, p.type, p.status, p.species, p.name, p.color,
      p.age_months, p.weight_kg, p.sex, p.size,
      p.description, p.event_date, p.created_at,
      n.name AS neighborhood,
      p.neighborhood_id
     FROM pet_posts p
     JOIN neighborhoods n ON n.id = p.neighborhood_id
     WHERE p.owner_id = $1
     ORDER BY p.created_at DESC`,
    [ownerId]
  );

  return res.json(result.rows);
}

export async function updatePost(req, res) {
  const ownerId = req.user.id;
  const { id } = req.params;

  // Confere se é dono
  const owns = await pool.query("SELECT id, type FROM pet_posts WHERE id = $1 AND owner_id = $2", [id, ownerId]);
  if (owns.rows.length === 0) {
    return res.status(403).json({ error: "Você não tem permissão para editar este anúncio" });
  }

  const currentType = owns.rows[0].type;

  // Monta update dinâmico
  const fields = [];
  const params = [];
  let i = 1;

  const body = req.body;

  // Se trocar type para FOUND_LOST (ou já for), eventDate pode precisar
  const newType = body.type ?? currentType;
  if (newType === "FOUND_LOST" && (body.eventDate === undefined || body.eventDate === null || String(body.eventDate).trim() === "")) {
    // só exige se veio no payload? aqui vamos exigir caso type resulte FOUND_LOST e o post não tenha event_date
    const hasEvent = await pool.query("SELECT event_date FROM pet_posts WHERE id = $1", [id]);
    const existing = hasEvent.rows[0]?.event_date;
    if (!existing) {
      return res.status(400).json({ error: "eventDate é obrigatório para FOUND_LOST" });
    }
  }

  // neighborhoodId: validar existe
  if (body.neighborhoodId) {
    const nb = await pool.query("SELECT id FROM neighborhoods WHERE id = $1", [body.neighborhoodId]);
    if (nb.rows.length === 0) {
      return res.status(400).json({ error: "Bairro inválido (neighborhoodId não encontrado)" });
    }
  }

  const map = [
    ["type", "type"],
    ["species", "species"],
    ["name", "name"],
    ["color", "color"],
    ["ageMonths", "age_months"],
    ["weightKg", "weight_kg"],
    ["sex", "sex"],
    ["size", "size"],
    ["description", "description"],
    ["eventDate", "event_date"],
    ["neighborhoodId", "neighborhood_id"],
  ];

  for (const [k, col] of map) {
    if (body[k] !== undefined) {
      fields.push(`${col} = $${i++}`);
      params.push(k === "name" ? (body[k] === "" ? null : body[k]) : body[k]);
    }
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "Nenhum campo enviado para atualização" });
  }

  params.push(id);
  params.push(ownerId);

  const sql = `
    UPDATE pet_posts
    SET ${fields.join(", ")}, updated_at = now()
    WHERE id = $${i++} AND owner_id = $${i++}
    RETURNING id, owner_id, type, status, species, name, color, age_months, weight_kg, sex, size, neighborhood_id, description, event_date, updated_at
  `;

  const result = await pool.query(sql, params);
  return res.json(result.rows[0]);
}

export async function setPostStatus(req, res) {
  const ownerId = req.user.id;
  const { id } = req.params;
  const { status } = req.body;

  if (!["ACTIVE", "RESOLVED"].includes(status)) {
    return res.status(400).json({ error: "status deve ser ACTIVE ou RESOLVED" });
  }

  const result = await pool.query(
    `UPDATE pet_posts
     SET status = $1, updated_at = now()
     WHERE id = $2 AND owner_id = $3
     RETURNING id, status, updated_at`,
    [status, id, ownerId]
  );

  if (result.rows.length === 0) {
    return res.status(403).json({ error: "Sem permissão ou anúncio não encontrado" });
  }

  return res.json(result.rows[0]);
}
