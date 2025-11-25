// src/pages/api/locations/districts.js
import { getPool } from '@/lib/database/pool';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { provinceId } = req.query; // Lấy provinceId từ query string: ?provinceId=...
  
  if (!provinceId) {
    return res.status(400).json({ error: 'Missing provinceId query parameter' });
  }

  const pool = getPool();
  let conn;

  try {
    conn = await pool.getConnection();

    // Lấy Quận/Huyện có tinh_thanh_id = provinceId
    const [rows] = await conn.execute(
      // id: INT PRIMARY KEY, ten: VARCHAR(100) NOT NULL
      `SELECT id, ten as name FROM quan_huyen WHERE tinh_thanh_id = ? ORDER BY ten ASC`,
      [provinceId]
    );

    return res.status(200).json({ districts: rows });

  } catch (error) {
    console.error('Districts API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
}