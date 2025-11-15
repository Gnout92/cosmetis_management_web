// src/lib/database/db.js
import mysql from "mysql2/promise";

let pool = null;

function getPool() {
  if (!pool) {
    // Tạo connection pool với environment variables
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'shop_my_pham',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
      charset: 'utf8mb4',
    });
  }
  return pool;
}

// Function để test connection
async function testConnection() {
  try {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT 1 as test');
    console.log('✅ Database connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

module.exports = {
  getPool,
  testConnection,
};