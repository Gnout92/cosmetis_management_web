// src/lib/database/db.js
import mysql from "mysql2/promise";

let pool; //Singleton pool cho cả app

function getConfig() {
  // Dùng biến môi trường thay vì hard-code credential
  return {
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DB || "myphamshop",
    port: Number(process.env.MYSQL_PORT || 3306),
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

// Helper query ngắn gọn
export async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

//  API tương tự connect() cũ nhưng dùng pool.getConnection()
export async function connect() {
  return getPool().getConnection();
}
