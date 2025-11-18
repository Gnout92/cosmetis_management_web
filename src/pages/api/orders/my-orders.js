// src/pages/api/orders/my-orders.js
import jwt from "jsonwebtoken";
import { getPool } from "../../../lib/database/db";

/**
 * API: Lấy danh sách đơn hàng của user đang đăng nhập
 * 
 * Method: GET
 * Auth: Required (JWT Token)
 * 
 * Response: Danh sách đơn hàng với thông tin:
 * - Mã đơn hàng
 * - Ngày đặt hàng
 * - Trạng thái đơn hàng
 * - Tổng tiền
 * - Số lượng sản phẩm
 */

// Mapping trạng thái từ database sang hiển thị
const ORDER_STATUS_MAP = {
  'pending': 'Chờ xác nhận',
  'confirmed': 'Đã xác nhận',
  'packing': 'Đang đóng gói',
  'shipping': 'Đang vận chuyển',
  'delivered': 'Đã giao',
  'cancelled': 'Đã hủy',
  'returned': 'Đã trả hàng'
};

// Màu sắc cho từng trạng thái
const ORDER_STATUS_COLOR = {
  'pending': '#FFA500',      // Orange
  'confirmed': '#4169E1',    // Royal Blue
  'packing': '#9370DB',      // Medium Purple
  'shipping': '#00BFFF',     // Deep Sky Blue
  'delivered': '#32CD32',    // Lime Green
  'cancelled': '#DC143C',    // Crimson
  'returned': '#FF6347'      // Tomato
};

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
  } catch (err) {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Lấy và verify token
    let token = null;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized - No token provided" 
      });
    }

    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.uid) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized - Invalid token" 
      });
    }

    const userId = decoded.uid;
    const pool = getPool();

    // Query lấy danh sách đơn hàng của user
    const [orders] = await pool.execute(
      `SELECT 
        dh.id,
        dh.trang_thai,
        dh.phuong_thuc_tt,
        dh.trang_thai_tt,
        dh.ship_ten_nguoi_nhan,
        dh.ship_so_dien_thoai,
        dh.ship_dia_chi_chi_tiet,
        dh.ship_ten_quan_huyen,
        dh.ship_ten_tinh_thanh,
        dh.tong_hang,
        dh.phi_van_chuyen,
        dh.tong_giam_gia,
        dh.tong_thanh_toan,
        dh.thoi_gian_tao,
        dh.thoi_gian_cap_nhat,
        COUNT(dhct.id) as so_san_pham
      FROM don_hang dh
      LEFT JOIN don_hang_chi_tiet dhct ON dh.id = dhct.don_hang_id
      WHERE dh.nguoi_dung_id = ?
      GROUP BY dh.id
      ORDER BY dh.thoi_gian_tao DESC`,
      [userId]
    );

    // Format dữ liệu trả về
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderId: `DH${String(order.id).padStart(6, '0')}`, // Format: DH000001
      status: order.trang_thai || 'pending',
      statusText: ORDER_STATUS_MAP[order.trang_thai] || 'Chờ xác nhận',
      statusColor: ORDER_STATUS_COLOR[order.trang_thai] || '#FFA500',
      paymentMethod: order.phuong_thuc_tt || 'cod',
      paymentStatus: order.trang_thai_tt || 'pending',
      
      // Thông tin giao hàng
      shippingInfo: {
        name: order.ship_ten_nguoi_nhan,
        phone: order.ship_so_dien_thoai,
        address: order.ship_dia_chi_chi_tiet,
        district: order.ship_ten_quan_huyen,
        province: order.ship_ten_tinh_thanh,
        fullAddress: `${order.ship_dia_chi_chi_tiet}, ${order.ship_ten_quan_huyen}, ${order.ship_ten_tinh_thanh}`
      },
      
      // Thông tin giá
      subtotal: order.tong_hang || 0,
      shippingFee: order.phi_van_chuyen || 0,
      discount: order.tong_giam_gia || 0,
      total: order.tong_thanh_toan || 0,
      
      // Thông tin khác
      productCount: order.so_san_pham || 0,
      createdAt: order.thoi_gian_tao,
      updatedAt: order.thoi_gian_cap_nhat,
    }));

    return res.status(200).json({ 
      success: true,
      orders: formattedOrders,
      total: formattedOrders.length
    });

  } catch (err) {
    console.error("[/api/orders/my-orders] error:", err);
    const msg = typeof err?.message === "string" ? err.message : "Internal server error";
    return res.status(500).json({ 
      success: false,
      message: msg 
    });
  }
}
