import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const isProd = process.env.NODE_ENV === "production";

// Protege contra deploy quebrar “silenciosamente” sem variável
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL não está definida. Configure a variável de ambiente no .env (local) e no provedor (produção)."
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Postgres na nuvem geralmente exige SSL (no seu caso: SHOW ssl = on)
  ssl: isProd ? { rejectUnauthorized: false } : false,

  // Ajustes para estabilidade do pool (opcional, mas recomendado)
  max: Number(process.env.PG_POOL_MAX || 10),
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS || 30000),
  connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT_MS || 10000),
});
