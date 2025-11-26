// src/pages/api/locations/provinces.js
import { getPool } from '@/lib/database/pool';
// Import các hằng số từ schema nếu bạn sử dụng
// import { TABLES, COLUMNS, selectList } from '@/lib/database/schema'; 

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const pool = getPool();
  let conn;

  try {
    conn = await pool.getConnection();

    // Dùng SELECT đơn giản để lấy ID và Tên
    const [rows] = await conn.execute(
      // id: VARCHAR(5) PRIMARY KEY, ten: VARCHAR(100) NOT NULL
      `SELECT id, ten as name FROM tinh_thanh ORDER BY ten ASC`
    );

    return res.status(200).json({ provinces: rows });

  } catch (error) {
    console.error('Provinces API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
}