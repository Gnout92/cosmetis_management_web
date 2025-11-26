// src/pages/api/orders/my-orders.js
import jwt from "jsonwebtoken";
import { getPool } from "../../../lib/database/pool";


/**
 * API: Lấy danh sách đơn hàng của user đang đăng nhập
 */

// ✅ ĐÃ CHUẨN HÓA CÁC GIÁ TRỊ ENUM DB SANG CHỮ THƯỜNG TRONG MAPPING
const ORDER_STATUS_MAP = {
  'pending': 'Chờ xác nhận',
  'confirmed': 'Đã xác nhận',
  'preparing': 'Đang chuẩn bị', // Bổ sung trạng thái chuẩn bị nếu có
  'shipping': 'Đang vận chuyển',
  'delivering': 'Đang giao hàng', // Trạng thái này thường được dùng sau SHIPPING
  'delivered': 'Đã giao',
  'cancelled': 'Đã hủy',
  'failed': 'Thất bại', // Bổ sung trạng thái FAILED
};

// Màu sắc cho từng trạng thái
const ORDER_STATUS_COLOR = {
  'pending': '#FFA500',      
  'confirmed': '#4169E1',    
  'preparing': '#9370DB',    
  'shipping': '#00BFFF',     
  'delivering': '#00A0FF',   
  'delivered': '#32CD32',    
  'cancelled': '#DC143C',    
  'failed': '#DC143C'       
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
      GROUP BY dh.id, dh.trang_thai, dh.phuong_thuc_tt, dh.trang_thai_tt, dh.ship_ten_nguoi_nhan, dh.ship_so_dien_thoai, dh.ship_dia_chi_chi_tiet, dh.ship_ten_quan_huyen, dh.ship_ten_tinh_thanh, dh.tong_hang, dh.phi_van_chuyen, dh.tong_giam_gia, dh.tong_thanh_toan, dh.thoi_gian_tao, dh.thoi_gian_cap_nhat
      ORDER BY dh.thoi_gian_tao DESC`,
      [userId]
    );

    // Format dữ liệu trả về
    const formattedOrders = orders.map(order => {
        // ✅ CHUẨN HÓA TRẠNG THÁI TỪ DB (HOA) SANG FE (thường)
        const rawStatus = order.trang_thai || 'PENDING';
        const statusKey = rawStatus.toLowerCase();
        
        // Tên đầy đủ địa chỉ
        const fullAddress = `${order.ship_dia_chi_chi_tiet}${order.ship_ten_quan_huyen ? ', ' + order.ship_ten_quan_huyen : ''}${order.ship_ten_tinh_thanh ? ', ' + order.ship_ten_tinh_thanh : ''}`;

        return {
            id: order.id,
            orderId: `DH${String(order.id).padStart(6, '0')}`, 

            // ✅ SỬ DỤNG statusKey CHO MAPPING
            status: statusKey,          // 'pending', 'shipping', 'delivered'
            statusRaw: rawStatus,       // 'PENDING', 'SHIPPING', 'DELIVERED'
            statusText: ORDER_STATUS_MAP[statusKey] || 'Chờ xác nhận',
            statusColor: ORDER_STATUS_COLOR[statusKey] || '#FFA500',

            paymentMethod: order.phuong_thuc_tt || 'COD', // Enum: COD
            paymentStatus: order.trang_thai_tt || 'UNPAID', // Enum: UNPAID, PAID
            
            // Thông tin giao hàng
            shippingInfo: {
                name: order.ship_ten_nguoi_nhan,
                phone: order.ship_so_dien_thoai,
                address: order.ship_dia_chi_chi_tiet,
                district: order.ship_ten_quan_huyen,
                province: order.ship_ten_tinh_thanh,
                fullAddress: fullAddress,
            },
            
            // Thông tin giá (FE cần Number)
            subtotal: Number(order.tong_hang || 0),
            shippingFee: Number(order.phi_van_chuyen || 0),
            discount: Number(order.tong_giam_gia || 0),
            total: Number(order.tong_thanh_toan || 0),
            
            // Thông tin khác
            productCount: Number(order.so_san_pham || 0),
            createdAt: order.thoi_gian_tao,
            updatedAt: order.thoi_gian_cap_nhat,
        };
    });

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