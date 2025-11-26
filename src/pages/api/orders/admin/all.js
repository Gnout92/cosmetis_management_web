// src/pages/api/orders/admin/all.js
import { getPool } from "../../../../lib/database/db";
import { withAuth } from "../../../../lib/middleware/auth";
import { hasPermission } from "../../../../lib/auth/permissionManager";

/**
 * API: Xem tất cả đơn hàng (Admin only)
 * GET: Danh sách tất cả đơn hàng với phân trang và filter
 */

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();

  try {
    // Kiểm tra quyền truy cập
    if (!hasPermission(req.user, 'order.view_all')) {
      return res.status(403).json({ 
        success: false, 
        message: "Bạn không có quyền xem tất cả đơn hàng" 
      });
    }

    const { 
      page = 1, 
      limit = 10, 
      status, 
      customer_id, 
      date_from, 
      date_to, 
      min_amount, 
      max_amount,
      search 
    } = req.query;

    const offset = (page - 1) * limit;

    // Xây dựng WHERE clause
    let whereConditions = ["1=1"];
    let queryParams = [];

    if (status) {
      whereConditions.push("dh.trang_thai = ?");
      queryParams.push(status);
    }

    if (customer_id) {
      whereConditions.push("dh.nguoi_dung_id = ?");
      queryParams.push(customer_id);
    }

    if (date_from) {
      whereConditions.push("DATE(dh.thoi_gian_tao) >= ?");
      queryParams.push(date_from);
    }

    if (date_to) {
      whereConditions.push("DATE(dh.thoi_gian_tao) <= ?");
      queryParams.push(date_to);
    }

    if (min_amount) {
      whereConditions.push("dh.tong_tien >= ?");
      queryParams.push(min_amount);
    }

    if (max_amount) {
      whereConditions.push("dh.tong_tien <= ?");
      queryParams.push(max_amount);
    }

    if (search) {
      whereConditions.push("(dh.ma_don_hang LIKE ? OR nd.ho_ten LIKE ? OR nd.email LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.join(" AND ");

    // Lấy danh sách đơn hàng
    const query = `
      SELECT 
        dh.id,
        dh.ma_don_hang,
        dh.nguoi_dung_id,
        dh.tong_tien,
        dh.trang_thai,
        dh.phuong_thuc_thanh_toan,
        dh.thoi_gian_tao,
        dh.thoi_gian_cap_nhat,
        dh.ghi_chu,
        nd.ho_ten as customer_name,
        nd.email as customer_email,
        nd.so_dien_thoai as customer_phone,
        COUNT(dhct.id) as total_items,
        SUM(dhct.so_luong) as total_quantity
      FROM don_hang dh
      LEFT JOIN nguoi_dung nd ON dh.nguoi_dung_id = nd.id
      LEFT JOIN don_hang_chitiet dhct ON dh.id = dhct.don_hang_id
      WHERE ${whereClause}
      GROUP BY dh.id
      ORDER BY dh.thoi_gian_tao DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(parseInt(limit), offset);

    const [orders] = await pool.execute(query, queryParams);

    // Lấy tổng số đơn hàng cho phân trang
    const countQuery = `
      SELECT COUNT(DISTINCT dh.id) as total
      FROM don_hang dh
      LEFT JOIN nguoi_dung nd ON dh.nguoi_dung_id = nd.id
      WHERE ${whereClause}
    `;

    const [countResult] = await pool.execute(countQuery, queryParams.slice(0, -2)); // Loại bỏ LIMIT và OFFSET
    const totalOrders = countResult[0].total;

    const totalPages = Math.ceil(totalOrders / limit);

    // Lấy thống kê
    const statsQuery = `
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN trang_thai = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN trang_thai = 'confirmed' THEN 1 END) as confirmed_orders,
        COUNT(CASE WHEN trang_thai = 'shipping' THEN 1 END) as shipping_orders,
        COUNT(CASE WHEN trang_thai = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN trang_thai = 'cancelled' THEN 1 END) as cancelled_orders,
        COALESCE(SUM(tong_tien), 0) as total_revenue,
        COALESCE(AVG(tong_tien), 0) as avg_order_value
      FROM don_hang dh
      WHERE ${whereClause}
    `;

    const [stats] = await pool.execute(statsQuery, queryParams.slice(0, -2));

    // Lấy chi tiết items cho mỗi đơn hàng (top 5 đơn hàng gần nhất)
    const recentOrders = orders.slice(0, 5);
    
    for (let order of recentOrders) {
      const [items] = await pool.execute(`
        SELECT 
          dhct.so_luong,
          dhct.don_gia,
          sp.ten as product_name,
          sp.ma_sp as product_code,
          sp.hinh_anh as product_image
        FROM don_hang_chitiet dhct
        LEFT JOIN sanpham sp ON dhct.san_pham_id = sp.id
        WHERE dhct.don_hang_id = ?
        ORDER BY dhct.so_luong DESC
        LIMIT 3
      `, [order.id]);
      
      order.items = items;
    }

    res.status(200).json({
      success: true,
      data: {
        orders: orders,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: totalOrders,
          total_pages: totalPages,
          has_next: page < totalPages,
          has_prev: page > 1
        },
        stats: stats[0],
        filters: {
          status,
          customer_id,
          date_from,
          date_to,
          min_amount,
          max_amount,
          search
        }
      }
    });

  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách đơn hàng",
      error: error.message
    });
  }
}

export default withAuth(handler);
