// src/pages/api/qlkho/history.js
import { getPool } from "../../../lib/database/db";
import { withAuth } from "../../../lib/middleware/auth";

/**
 * API: Lịch sử nhập/xuất kho
 * GET: Lấy lịch sử thay đổi tồn kho từ bảng nhat_ky_hoat_dong
 * Chỉ cho phép: QL_Kho, Admin
 */

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();

  try {
    const {
      productId = "",
      warehouseId = "",
      type = "", // IMPORT, EXPORT
      startDate = "",
      endDate = "",
      page = 1,
      limit = 50,
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereConditions = ["nk.bang = 'ton_kho'"];
    let queryParams = [];

    if (productId) {
      whereConditions.push("nk.ban_ghi_id = ?");
      queryParams.push(productId);
    }

    if (type) {
      whereConditions.push("JSON_EXTRACT(nk.du_lieu_moi, '$.action') = ?");
      queryParams.push(type);
    }

    if (warehouseId) {
      whereConditions.push("JSON_EXTRACT(nk.du_lieu_moi, '$.warehouseId') = ?");
      queryParams.push(warehouseId);
    }

    if (startDate) {
      whereConditions.push("DATE(nk.thoi_gian_tao) >= ?");
      queryParams.push(startDate);
    }

    if (endDate) {
      whereConditions.push("DATE(nk.thoi_gian_tao) <= ?");
      queryParams.push(endDate);
    }

    const whereClause =
      whereConditions.length > 0
        ? "WHERE " + whereConditions.join(" AND ")
        : "";

    // Query lịch sử từ nhat_ky_hoat_dong
    const [history] = await pool.execute(
      `SELECT 
        nk.id,
        nk.ban_ghi_id as productId,
        sp.TenSanPham as productName,
        JSON_EXTRACT(nk.du_lieu_moi, '$.warehouseId') as warehouseId,
        JSON_EXTRACT(nk.du_lieu_moi, '$.warehouse') as warehouseName,
        JSON_EXTRACT(nk.du_lieu_moi, '$.action') as transactionType,
        JSON_EXTRACT(nk.du_lieu_moi, '$.quantity') as quantity,
        JSON_EXTRACT(nk.du_lieu_moi, '$.note') as note,
        nk.thuc_hien_boi as performedBy,
        nd.ten_hien_thi as performedByName,
        nk.thoi_gian_tao as timestamp
      FROM nhat_ky_hoat_dong nk
      LEFT JOIN sanpham sp ON nk.ban_ghi_id = sp.MaSanPham
      LEFT JOIN nguoi_dung nd ON nk.thuc_hien_boi = nd.id
      ${whereClause}
      ORDER BY nk.thoi_gian_tao DESC
      LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    // Count total
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total
      FROM nhat_ky_hoat_dong nk
      ${whereClause}`,
      queryParams
    );

    const total = countResult[0]?.total || 0;

    // Clean up JSON values (remove quotes)
    const cleanedHistory = history.map(item => ({
      ...item,
      warehouseId: item.warehouseId ? parseInt(item.warehouseId) : null,
      warehouseName: item.warehouseName ? item.warehouseName.replace(/"/g, '') : null,
      transactionType: item.transactionType ? item.transactionType.replace(/"/g, '') : null,
      quantity: item.quantity ? parseInt(item.quantity) : 0,
      note: item.note ? item.note.replace(/"/g, '') : '',
    }));

    return res.status(200).json({
      success: true,
      data: cleanedHistory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("[/api/qlkho/history] error:", err);

    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + err.message,
    });
  }
}

export default withAuth(handler, ["Admin", "QL_Kho"]);
