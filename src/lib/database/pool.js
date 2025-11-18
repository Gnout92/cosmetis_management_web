// src/lib/database/pool.js
import mysql from 'mysql2/promise';

let pool;

/**
 * Lấy MySQL connection pool (singleton pattern)
 * @returns {mysql.Pool}
 */
export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'myphamshop',
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      timezone: '+00:00' // UTC timezone
    });

    console.log('✅ MySQL connection pool created');
  }

  return pool;
}

/**
 * Đóng connection pool
 */
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('✅ MySQL connection pool closed');
  }
}

/**
 * Test database connection
 */
export async function testConnection() {
  try {
    const pool = getPool();
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}
