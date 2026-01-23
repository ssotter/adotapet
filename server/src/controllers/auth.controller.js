import bcrypt from "bcrypt";
import { pool } from "../db/connection.js";
import { generateToken } from "../utils/jwt.js";

export async function register(req, res) {
  const { name, email, password, whatsapp } = req.body;

  // Verifica se já existe
  const exists = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );
  if (exists.rows.length > 0) {
    return res.status(409).json({ error: "E-mail já cadastrado" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, whatsapp)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, whatsapp, avatar_url`,
    [name, email, passwordHash, whatsapp]
  );

  const user = result.rows[0];
  const token = generateToken({ id: user.id, email: user.email });

  return res.status(201).json({ user, token });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const result = await pool.query(
    `SELECT
       id,
       name,
       email,
       whatsapp,
       avatar_url,
       password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: "Usuário ou senha inválidos" });
  }

  const user = result.rows[0];

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ error: "Usuário ou senha inválidos" });
  }

  const token = generateToken({ id: user.id, email: user.email });

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
      avatar_url: user.avatar_url,
    },
    token,
  });
}
