import { pool } from "./connection.js";

const result = await pool.query("SELECT NOW()");
console.log("Banco conectado em:", result.rows[0].now);

process.exit();
