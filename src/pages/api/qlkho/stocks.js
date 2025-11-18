// src/pages/api/qlkho/stocks.js
import { getPool } from "../../../lib/database/db";
import { withAuth } from "../../../lib/middleware/auth";
import { TABLES } from "../../../lib/database/schema";

/**
 * API: Quản lý tồn kho
 * GET: Lấy danh sách tồn kho tất cả sản phẩm
 */

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();

  try {
    const {
      warehouseId = "",
      lowStock = "false",
      search = "",
      page = 1,
      limit = 50,
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereConditions = [];
    let queryParams = [];

    if (warehouseId) {
      whereConditions.push("tk.kho_id = ?");
      queryParams.push(warehouseId);
    }

    if (search) {
      whereConditions.push("(sp.TenSanPham LIKE ? OR sp.MoTa LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const whereClause =
      whereConditions.length > 0
        ? "WHERE " + whereConditions.join(" AND ")
        : "";

    // Query tồn kho
    const [stocks] = await pool.execute(
      `SELECT 
        sp.MaSanPham as productId,
        sp.TenSanPham as productName,
        dm.ten as categoryName,
        th.ten as brandName,
        sp.Gia as price,
        COALESCE(tk.kho_id, 1) as warehouseId,
        COALESCE(km.ten_kho, 'Kho chính') as warehouseName,
        COALESCE(tk.so_luong_ton, 0) as quantityOnHand,
        COALESCE(tk.so_luong_giu_cho, 0) as quantityReserved,
        (COALESCE(tk.so_luong_ton, 0) - COALESCE(tk.so_luong_giu_cho, 0)) as availableQuantity
      FROM sanpham sp
      LEFT JOIN ton_kho tk ON sp.MaSanPham = tk.san_pham_id
      LEFT JOIN kho_moi km ON tk.kho_id = km.id
      LEFT JOIN danh_muc dm ON sp.MaDanhMuc = dm.id
      LEFT JOIN thuong_hieu th ON sp.MaThuongHieu = th.id
      ${whereClause}
      ${lowStock === "true" ? "HAVING availableQuantity <= 10" : ""}
      ORDER BY availableQuantity ASC, sp.TenSanPham ASC
      LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    // Count total
    const [countResult] = await pool.execute(
      `SELECT COUNT(DISTINCT sp.MaSanPham) as total
      FROM sanpham sp
      LEFT JOIN ton_kho tk ON sp.MaSanPham = tk.san_pham_id
      ${whereClause}`,
      queryParams
    );

    const total = countResult[0]?.total || 0;

    return res.status(200).json({
      success: true,
      data: stocks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("[/api/qlkho/stocks] error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + err.message,
    });
  }
}

export default withAuth(handler, ["Admin", "QL_Kho"]);
