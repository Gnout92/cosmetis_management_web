// src/pages/api/qlkho/warehouses.js
import { getPool } from "../../../lib/database/db";
import { withAuth } from "../../../lib/middleware/auth";

/**
 * API: Danh sách kho
 * GET: Lấy danh sách kho
 * Chỉ cho phép: QL_Kho, Admin
 */

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();

  try {
    const [warehouses] = await pool.execute(
      `SELECT 
        km.id,
        km.ma_kho as code,
        km.ten_kho as name,
        km.vi_tri as location,
        km.trang_thai as status,
        km.danh_muc_id as categoryId,
        dm.ten as categoryName,
        km.nguoi_quan_ly_id as managerId,
        nd.ten_hien_thi as managerName,
        km.thoi_gian_tao as createdAt,
        COUNT(tk.san_pham_id) as totalProducts,
        SUM(tk.so_luong_ton) as totalStock
      FROM kho_moi km
      LEFT JOIN danh_muc dm ON km.danh_muc_id = dm.id
      LEFT JOIN nguoi_dung nd ON km.nguoi_quan_ly_id = nd.id
      LEFT JOIN ton_kho tk ON km.id = tk.kho_id
      WHERE km.trang_thai = 'Hoat_dong'
      GROUP BY km.id
      ORDER BY km.ten_kho ASC`
    );

    return res.status(200).json({
      success: true,
      data: warehouses,
    });
  } catch (err) {
    console.error("[/api/qlkho/warehouses] error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + err.message,
    });
  }
}

export default withAuth(handler, ["Admin", "QL_Kho"]);
