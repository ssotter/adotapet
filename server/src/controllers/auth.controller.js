import bcrypt from "bcrypt";
import crypto from "crypto";
import { pool } from "../db/connection.js";
import { generateToken } from "../utils/jwt.js";
import { sendResetPasswordEmail } from "../utils/email.js";

export async function register(req, res) {
  const { name, email, password, whatsapp } = req.body;

  const exists = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);
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

// ✅ 1) Trocar senha (logado)
export async function changePassword(req, res) {
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;

  const result = await pool.query(
    `SELECT id, password_hash FROM users WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  const user = result.rows[0];
  const ok = await bcrypt.compare(currentPassword, user.password_hash);

  if (!ok) {
    return res.status(400).json({ error: "Senha atual incorreta" });
  }

  const newHash = await bcrypt.hash(newPassword, 10);

  await pool.query(
    `UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2`,
    [newHash, userId]
  );

  return res.json({ data: { message: "Senha alterada com sucesso" } });
}

// ✅ 2) Forgot password (e-mail/token)
export async function forgotPassword(req, res) {
  const { email } = req.body;

  // resposta neutra (não vaza se e-mail existe)
  const okResponse = {
    data: {
      message:
        "Se este e-mail estiver cadastrado, enviaremos instruções para redefinir sua senha.",
    },
  };

  const result = await pool.query(
    `SELECT id, name, email FROM users WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    return res.json(okResponse);
  }

  const user = result.rows[0];

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

  // invalida tokens anteriores ainda não usados
  await pool.query(
    `UPDATE password_reset_tokens
     SET used_at = now()
     WHERE user_id = $1 AND used_at IS NULL`,
    [user.id]
  );

  await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [user.id, tokenHash, expiresAt]
  );

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

  await sendResetPasswordEmail({
    to: user.email,
    name: user.name,
    resetUrl,
  });

  return res.json(okResponse);
}

// ✅ 3) Reset password (token + nova senha)
export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const tokenRes = await pool.query(
    `SELECT id, user_id, expires_at, used_at
     FROM password_reset_tokens
     WHERE token_hash = $1
     LIMIT 1`,
    [tokenHash]
  );

  if (tokenRes.rows.length === 0) {
    return res.status(400).json({ error: "Token inválido ou expirado" });
  }

  const prt = tokenRes.rows[0];

  if (prt.used_at) {
    return res.status(400).json({ error: "Token já utilizado" });
  }

  if (new Date(prt.expires_at).getTime() < Date.now()) {
    return res.status(400).json({ error: "Token expirado" });
  }

  const newHash = await bcrypt.hash(newPassword, 10);

  await pool.query(
    `UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2`,
    [newHash, prt.user_id]
  );

  await pool.query(
    `UPDATE password_reset_tokens SET used_at = now() WHERE id = $1`,
    [prt.id]
  );

  return res.json({ data: { message: "Senha redefinida com sucesso" } });
}