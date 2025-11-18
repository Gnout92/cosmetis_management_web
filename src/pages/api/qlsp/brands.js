// src/pages/api/qlsp/brands.js
import { getPool } from "../../../lib/database/db";
import { withAuth } from "../../../lib/middleware/auth";
import { TABLES } from "../../../lib/database/schema";

/**
 * API: Lấy danh sách thương hiệu
 */

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();

  try {
    const [brands] = await pool.execute(
      `SELECT 
        id,
        ten as name,
        mo_ta as description
      FROM thuong_hieu
      ORDER BY ten ASC`
    );

    return res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (err) {
    console.error("[/api/qlsp/brands] error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + err.message,
    });
  }
}

export default withAuth(handler, ["Admin", "QL_SanPham"]);
