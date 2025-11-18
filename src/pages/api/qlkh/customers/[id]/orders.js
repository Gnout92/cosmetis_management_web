// src/pages/api/qlkh/customers/[id]/orders.js
import { getPool } from "../../../../../lib/database/db";
import { withAuth } from "../../../../../lib/middleware/auth";

/**
 * API: Lịch sử đơn hàng của khách hàng
 * GET: Lấy danh sách đơn hàng của một khách hàng
 * Chỉ cho phép: QL_KhachHang, Admin
 */

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Thiếu ID khách hàng",
    });
  }

  try {
    const { page = 1, limit = 10, status = "" } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereConditions = ["nguoi_dung_id = ?"];
    let queryParams = [id];

    if (status) {
      whereConditions.push("trang_thai = ?");
      queryParams.push(status);
    }

    const whereClause = "WHERE " + whereConditions.join(" AND ");

    // Query đơn hàng với chi tiết
    const [orders] = await pool.execute(
      `SELECT 
        dh.id,
        dh.trang_thai as status,
        dh.phuong_thuc_tt as paymentMethod,
        dh.trang_thai_tt as paymentStatus,
        dh.ship_ten_nguoi_nhan as shipName,
        dh.ship_so_dien_thoai as shipPhone,
        dh.ship_dia_chi_chi_tiet as shipAddress,
        dh.ship_duong as shipStreet,
        dh.ship_ten_phuong_xa as shipWard,
        dh.ship_ten_quan_huyen as shipDistrict,
        dh.ship_ten_tinh_thanh as shipProvince,
        dh.tong_hang as subTotal,
        dh.phi_van_chuyen as shippingFee,
        dh.tong_giam_gia as totalDiscount,
        dh.tong_thanh_toan as grandTotal,
        dh.ly_do_huy as cancelReason,
        dh.ly_do_that_bai as failReason,
        dh.thoi_gian_tao as createdAt,
        dh.thoi_gian_cap_nhat as updatedAt,
        COUNT(dhct.id) as itemCount
      FROM don_hang dh
      LEFT JOIN don_hang_chi_tiet dhct ON dh.id = dhct.don_hang_id
      ${whereClause}
      GROUP BY dh.id
      ORDER BY dh.thoi_gian_tao DESC
      LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    // Format order IDs
    const formattedOrders = orders.map((order) => ({
      ...order,
      orderId: `DH${String(order.id).padStart(6, "0")}`,
      statusText: getStatusText(order.status),
    }));

    // Count total
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total
      FROM don_hang
      ${whereClause}`,
      queryParams
    );

    const total = countResult[0]?.total || 0;

    return res.status(200).json({
      success: true,
      data: formattedOrders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("[/api/qlkh/customers/[id]/orders] error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + err.message,
    });
  }
}

// Helper function để convert status sang tiếng Việt
function getStatusText(status) {
  const statusMap = {
    'PENDING': 'Chờ xác nhận',
    'SHIPPING': 'Đang giao hàng',
    'DELIVERED': 'Đã giao hàng',
    'FAILED': 'Giao hàng thất bại',
    'CANCELLED': 'Đã hủy'
  };
  return statusMap[status] || status;
}

export default withAuth(handler, ["Admin", "QL_KhachHang"]);
