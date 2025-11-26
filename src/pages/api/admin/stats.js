// src/pages/api/admin/stats.js
import { getPool } from "../../../lib/database/db";
import { withAuth } from "../../../lib/middleware/auth";

/**
 * API: Thống kê tổng quan (Admin only)
 * GET: Lấy các chỉ số thống kê
 * Updated: Sử dụng RBAC và tên bảng mới
 */

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();

  try {
    const { period = "all" } = req.query; // all, today, week, month, year

    let dateCondition = "";
    if (period === "today") {
      dateCondition = "WHERE DATE(thoi_gian_tao) = CURDATE()";
    } else if (period === "week") {
      dateCondition = "WHERE thoi_gian_tao >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    } else if (period === "month") {
      dateCondition = "WHERE thoi_gian_tao >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    } else if (period === "year") {
      dateCondition =
        "WHERE thoi_gian_tao >= DATE_SUB(NOW(), INTERVAL 365 DAY)";
    }

    // Tổng số người dùng
    const [totalUsers] = await pool.execute(
      `SELECT COUNT(*) as count FROM nguoi_dung`
    );

    // Tổng số khách hàng (RBAC)
    const [totalCustomers] = await pool.execute(
      `SELECT COUNT(DISTINCT nd.id) as count 
       FROM nguoi_dung nd
       JOIN nguoi_dung_vai_tro ndvt ON nd.id = ndvt.nguoi_dung_id
       JOIN vai_tro vt ON ndvt.vai_tro_id = vt.id
       WHERE vt.ten = 'Customer'`
    );

    // Tổng số sản phẩm
    const [totalProducts] = await pool.execute(
      `SELECT COUNT(*) as count FROM sanpham`
    );

    // Sản phẩm đang hiển thị
    const [activeProducts] = await pool.execute(
      `SELECT COUNT(*) as count FROM sanpham WHERE (is_an = 0 OR is_an IS NULL)`
    );

    // Tổng số đơn hàng
    const [totalOrders] = await pool.execute(
      `SELECT COUNT(*) as count FROM don_hang ${dateCondition}`
    );

    // Đơn hàng theo trạng thái
    const [ordersByStatus] = await pool.execute(
      `SELECT 
        trang_thai as status,
        COUNT(*) as count
      FROM don_hang
      ${dateCondition}
      GROUP BY trang_thai`
    );

    // Doanh thu
    const [revenue] = await pool.execute(
      `SELECT 
        COALESCE(SUM(tong_thanh_toan), 0) as total,
        COALESCE(SUM(tong_hang), 0) as subTotal,
        COALESCE(SUM(phi_van_chuyen), 0) as shippingFee,
        COALESCE(SUM(tong_giam_gia), 0) as discount
      FROM don_hang
      WHERE trang_thai IN ('delivered', 'shipping')
      ${dateCondition ? dateCondition.replace("WHERE", "AND") : ""}`
    );

    // Sản phẩm bán chạy
    const [topProducts] = await pool.execute(
      `SELECT 
        sp.id as productId,
        sp.ten as productName,
        SUM(dhct.so_luong) as totalSold,
        SUM(dhct.so_luong * dhct.don_gia) as totalRevenue
      FROM don_hang_chitiet dhct
      JOIN sanpham sp ON dhct.san_pham_id = sp.id
      JOIN don_hang dh ON dhct.don_hang_id = dh.id
      WHERE dh.trang_thai IN ('delivered', 'shipping')
      ${dateCondition ? dateCondition.replace("WHERE", "AND") : ""}
      GROUP BY sp.id
      ORDER BY totalSold DESC
      LIMIT 10`
    );

    // Tồn kho thấp
    const [lowStockProducts] = await pool.execute(
      `SELECT 
        sp.id as productId,
        sp.ten as productName,
        COALESCE(SUM(tk.so_luong_ton - tk.so_luong_giu), 0) as availableStock,
        COALESCE(SUM(tk.so_luong_ton), 0) as totalStock
      FROM sanpham sp
      LEFT JOIN ton_kho tk ON sp.id = tk.san_pham_id
      GROUP BY sp.id
      HAVING availableStock <= 10
      ORDER BY availableStock ASC
      LIMIT 10`
    );

    // Khách hàng VIP (chi tiêu nhiều) - sử dụng RBAC
    const [topCustomers] = await pool.execute(
      `SELECT 
        nd.id,
        nd.ten_hien_thi as name,
        nd.email,
        COUNT(dh.id) as totalOrders,
        COALESCE(SUM(dh.tong_thanh_toan), 0) as totalSpent
      FROM nguoi_dung nd
      JOIN nguoi_dung_vai_tro ndvt ON nd.id = ndvt.nguoi_dung_id
      JOIN vai_tro vt ON ndvt.vai_tro_id = vt.id
      JOIN don_hang dh ON nd.id = dh.nguoi_dung_id
      WHERE vt.ten = 'Customer' AND dh.trang_thai IN ('delivered', 'shipping')
      GROUP BY nd.id
      ORDER BY totalSpent DESC
      LIMIT 10`
    );

    // Doanh thu theo ngày (7 ngày gần nhất)
    const [dailyRevenue] = await pool.execute(
      `SELECT 
        DATE(thoi_gian_tao) as date,
        COUNT(*) as orderCount,
        COALESCE(SUM(tong_thanh_toan), 0) as revenue
      FROM don_hang
      WHERE thoi_gian_tao >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        AND trang_thai IN ('delivered', 'shipping')
      GROUP BY DATE(thoi_gian_tao)
      ORDER BY date DESC`
    );

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers: totalUsers[0]?.count || 0,
          totalCustomers: totalCustomers[0]?.count || 0,
          totalProducts: totalProducts[0]?.count || 0,
          activeProducts: activeProducts[0]?.count || 0,
          totalOrders: totalOrders[0]?.count || 0,
          revenue: revenue[0] || { total: 0, subTotal: 0, shippingFee: 0, discount: 0 },
        },
        ordersByStatus,
        topProducts,
        lowStockProducts,
        topCustomers,
        dailyRevenue,
      },
    });
  } catch (err) {
    console.error("[/api/admin/stats] error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + err.message,
    });
  }
}

export default withAuth(handler, ["Admin"]);
