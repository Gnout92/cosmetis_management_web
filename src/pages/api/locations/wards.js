// src/pages/api/locations/wards.js
import { getPool } from '@/lib/database/pool';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let { districtId } = req.query;

  // Nếu Next.js trả về dạng mảng (vd ?districtId=1&districtId=2)
  if (Array.isArray(districtId)) {
    districtId = districtId[0];
  }

  console.log('[WARDS] raw districtId from query =', districtId);

  if (!districtId) {
    return res.status(400).json({ error: 'Missing districtId query parameter' });
  }

  

  const pool = getPool();
  let conn;

  try {
    conn = await pool.getConnection();

    const [rows] = await conn.execute(
      `SELECT id, ten AS name 
       FROM phuong_xa 
       WHERE quan_huyen_id = ? 
       ORDER BY ten ASC`,
      [districtId]                 // dùng trực tiếp districtId
    );

    console.log('[WARDS] found rows =', rows.length);

    return res.status(200).json({ wards: rows });
  } catch (error) {
    console.error('Wards API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (conn) conn.release();
  }
}
