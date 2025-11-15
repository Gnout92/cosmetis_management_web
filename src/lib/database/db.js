// src/lib/database/db.js
import mysql from "mysql2/promise";

let pool;

function getConfig() {
  // Ưu tiên MYSQL_*, fallback DB_*
  const host = process.env.MYSQL_HOST || process.env.DB_HOST || "127.0.0.1";
  const user = process.env.MYSQL_USER || process.env.DB_USERNAME || "root";
  // LƯU Ý: nếu Laragon không đặt password thì để chuỗi rỗng "", KHÔNG có khoảng trắng
  const password = (process.env.MYSQL_PASSWORD ?? process.env.DB_PASSWORD ?? "");
  const database = process.env.MYSQL_DB || process.env.DB_DATABASE || "myphamshop";
  const port = Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306);

  return {
    host, user, password, database, port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
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

export async function connect() {
  return getPool().getConnection();
}

export async function withTransaction(fn) {
  const pool = getPool();
  const conn = await pool.getConnection();
  try { await conn.beginTransaction(); const r = await fn(conn); await conn.commit(); return r; }
  catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
}
