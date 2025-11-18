// src/pages/api/qlkh/customers.js
import { getPool } from "../../../lib/database/db";
import { withAuth } from "../../../lib/middleware/auth";

/**
 * API: Quản lý khách hàng
 * GET: Lấy danh sách khách hàng với thống kê
 * Chỉ cho phép: QL_KhachHang, Admin
 */

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();

  try {
    const {
      search = "",
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereConditions = [];
    let queryParams = [];

    // Chỉ lấy khách hàng (không lấy nhân viên nội bộ)
    // Khách hàng là người có vai trò Customer trong bảng nguoi_dung_vai_tro
    whereConditions.push(
      `EXISTS (
        SELECT 1 FROM nguoi_dung_vai_tro nvt 
        JOIN vai_tro vt ON nvt.vai_tro_id = vt.id 
        WHERE nvt.nguoi_dung_id = nd.id AND vt.ten = 'Customer'
      )`
    );

    if (search) {
      whereConditions.push(
        "(nd.ten_hien_thi LIKE ? OR nd.email LIKE ? OR nd.ten_dang_nhap LIKE ?)"
      );
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = "WHERE " + whereConditions.join(" AND ");

    // Query khách hàng với thống kê đơn hàng
    const [customers] = await pool.execute(
      `SELECT 
        nd.id,
        nd.ten_dang_nhap as username,
        nd.email,
        nd.ten_hien_thi as displayName,
        nd.ho as firstName,
        nd.ten as lastName,
        nd.anh_dai_dien as avatar,
        nd.ngay_sinh as birthDate,
        nd.gioi_tinh as gender,
        nd.dang_hoat_dong as isActive,
        nd.thoi_gian_tao as createdAt,
        COUNT(DISTINCT dh.id) as totalOrders,
        COALESCE(SUM(dh.tong_thanh_toan), 0) as totalSpent,
        MAX(dh.thoi_gian_tao) as lastOrderDate
      FROM nguoi_dung nd
      LEFT JOIN don_hang dh ON nd.id = dh.nguoi_dung_id
      ${whereClause}
      GROUP BY nd.id
      ORDER BY ${sortBy === "totalSpent" ? "totalSpent" : "nd.thoi_gian_tao"} ${
        order === "ASC" ? "ASC" : "DESC"
      }
      LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    // Count total
    const [countResult] = await pool.execute(
      `SELECT COUNT(DISTINCT nd.id) as total
      FROM nguoi_dung nd
      ${whereClause}`,
      queryParams
    );

    const total = countResult[0]?.total || 0;

    // Xác định tier dựa trên totalSpent (hạng khách hàng)
    const customersWithTier = customers.map((customer) => ({
      ...customer,
      tier:
        customer.totalSpent >= 10000000
          ? "diamond"  // >= 10 triệu
          : customer.totalSpent >= 5000000
          ? "gold"     // >= 5 triệu
          : customer.totalSpent >= 2000000
          ? "silver"   // >= 2 triệu
          : "bronze",  // < 2 triệu
    }));

    return res.status(200).json({
      success: true,
      data: customersWithTier,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("[/api/qlkh/customers] error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + err.message,
    });
  }
}

export default withAuth(handler, ["Admin", "QL_KhachHang"]);
