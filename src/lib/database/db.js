// src/lib/database/db.js (ESM thuần)
import mysql from "mysql2/promise";

let pool;

function getConfig() {
  return {
    host: process.env.DB_HOST || process.env.MYSQL_HOST || "127.0.0.1",
    user: process.env.DB_USER || process.env.MYSQL_USER || "root",
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || "",
    database: process.env.DB_NAME || process.env.MYSQL_DB || "myphamshop",
    port: Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4"
  };
}

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(getConfig());
  }
  return pool;
}

export async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

export async function withTransaction(fn) {
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function testConnection() {
  try {
    await query("SELECT 1");
    return true;
  } catch (e) {
    console.error("DB test failed:", e?.message);
    return false;
  }
}
