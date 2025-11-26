// src/pages/api/reviews/index.js
import { getPool } from "../../../lib/database/db";
import { withAuth } from "../../../lib/middleware/auth";

/**
 * API: Quản lý đánh giá sản phẩm
 * GET: Danh sách đánh giá với phân trang và filter
 * POST: Tạo đánh giá mới
 */

async function handler(req, res) {
  const pool = getPool();

  try {
    if (req.method === "GET") {
      return getReviews(req, res, pool);
    } else if (req.method === "POST") {
      return createReview(req, res, pool);
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

  } catch (error) {
    console.error('Error in reviews handler:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
}

/**
 * Lấy danh sách đánh giá
 */
async function getReviews(req, res, pool) {
  const { 
    page = 1, 
    limit = 10, 
    product_id, 
    user_id, 
    rating, 
    status,
    sort_by = 'created_at',
    sort_order = 'DESC'
  } = req.query;

  const offset = (page - 1) * limit;

  // Xây dựng WHERE clause
  let whereConditions = ["1=1"];
  let queryParams = [];

  if (product_id) {
    whereConditions.push("dg.san_pham_id = ?");
    queryParams.push(product_id);
  }

  if (user_id) {
    whereConditions.push("dg.nguoi_dung_id = ?");
    queryParams.push(user_id);
  }

  if (rating) {
    whereConditions.push("dg.danh_gia = ?");
    queryParams.push(rating);
  }

  if (status) {
    if (status === 'pending') {
      whereConditions.push("dg.trang_thai = 'pending'");
    } else if (status === 'approved') {
      whereConditions.push("dg.trang_thai = 'approved'");
    } else if (status === 'rejected') {
      whereConditions.push("dg.trang_thai = 'rejected'");
    }
  } else {
    // Mặc định chỉ hiển thị đánh giá đã được duyệt cho public
    whereConditions.push("dg.trang_thai = 'approved'");
  }

  const whereClause = whereConditions.join(" AND ");

  // Validate sort parameters
  const allowedSortFields = ['created_at', 'danh_gia', 'updated_at'];
  const allowedSortOrders = ['ASC', 'DESC'];
  
  const finalSortBy = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
  const finalSortOrder = allowedSortOrders.includes(sort_order.toUpperCase()) ? sort_order.toUpperCase() : 'DESC';

  // Lấy danh sách đánh giá
  const query = `
    SELECT 
      dg.id,
      dg.san_pham_id,
      dg.nguoi_dung_id,
      dg.danh_gia,
      dg.binh_luan,
      dg.hinh_anh,
      dg.trang_thai,
      dg.thoi_gian_tao,
      dg.thoi_gian_cap_nhat,
      sp.ten as product_name,
      sp.ma_sp as product_code,
      sp.hinh_anh as product_image,
      nd.ho_ten as user_name,
      nd.avatar as user_avatar,
      -- Tính trung bình rating cho sản phẩm
      (SELECT AVG(danh_gia) FROM danh_gia dg2 WHERE dg2.san_pham_id = dg.san_pham_id AND dg2.trang_thai = 'approved') as product_avg_rating,
      (SELECT COUNT(*) FROM danh_gia dg3 WHERE dg3.san_pham_id = dg.san_pham_id AND dg3.trang_thai = 'approved') as product_review_count
    FROM danh_gia dg
    LEFT JOIN sanpham sp ON dg.san_pham_id = sp.id
    LEFT JOIN nguoi_dung nd ON dg.nguoi_dung_id = nd.id
    WHERE ${whereClause}
    ORDER BY dg.${finalSortBy} ${finalSortOrder}
    LIMIT ? OFFSET ?
  `;

  queryParams.push(parseInt(limit), offset);

  const [reviews] = await pool.execute(query, queryParams);

  // Lấy tổng số đánh giá cho phân trang
  const countQuery = `
    SELECT COUNT(*) as total
    FROM danh_gia dg
    LEFT JOIN sanpham sp ON dg.san_pham_id = sp.id
    LEFT JOIN nguoi_dung nd ON dg.nguoi_dung_id = nd.id
    WHERE ${whereClause}
  `;

  const [countResult] = await pool.execute(countQuery, queryParams.slice(0, -2)); // Loại bỏ LIMIT và OFFSET
  const totalReviews = countResult[0].total;

  const totalPages = Math.ceil(totalReviews / limit);

  // Lấy thống kê rating
  const statsQuery = `
    SELECT 
      COUNT(*) as total_reviews,
      AVG(danh_gia) as avg_rating,
      SUM(CASE WHEN danh_gia = 5 THEN 1 ELSE 0 END) as rating_5,
      SUM(CASE WHEN danh_gia = 4 THEN 1 ELSE 0 END) as rating_4,
      SUM(CASE WHEN danh_gia = 3 THEN 1 ELSE 0 END) as rating_3,
      SUM(CASE WHEN danh_gia = 2 THEN 1 ELSE 0 END) as rating_2,
      SUM(CASE WHEN danh_gia = 1 THEN 1 ELSE 0 END) as rating_1,
      SUM(CASE WHEN trang_thai = 'pending' THEN 1 ELSE 0 END) as pending_count,
      SUM(CASE WHEN trang_thai = 'approved' THEN 1 ELSE 0 END) as approved_count,
      SUM(CASE WHEN trang_thai = 'rejected' THEN 1 ELSE 0 END) as rejected_count
    FROM danh_gia dg
    LEFT JOIN sanpham sp ON dg.san_pham_id = sp.id
    WHERE ${whereClause}
  `;

  const [stats] = await pool.execute(statsQuery, queryParams.slice(0, -2));

  // Nếu có product_id, lấy thống kê cho sản phẩm cụ thể
  let productStats = null;
  if (product_id) {
    const [productStatsResult] = await pool.execute(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(danh_gia) as avg_rating,
        SUM(CASE WHEN danh_gia = 5 THEN 1 ELSE 0 END) as rating_5,
        SUM(CASE WHEN danh_gia = 4 THEN 1 ELSE 0 END) as rating_4,
        SUM(CASE WHEN danh_gia = 3 THEN 1 ELSE 0 END) as rating_3,
        SUM(CASE WHEN danh_gia = 2 THEN 1 ELSE 0 END) as rating_2,
        SUM(CASE WHEN danh_gia = 1 THEN 1 ELSE 0 END) as rating_1
      FROM danh_gia 
      WHERE san_pham_id = ? AND trang_thai = 'approved'
    `, [product_id]);

    productStats = productStatsResult[0];
  }

  res.status(200).json({
    success: true,
    data: {
      reviews: reviews,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: totalReviews,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1
      },
      stats: stats[0],
      product_stats: productStats,
      filters: {
        product_id,
        user_id,
        rating,
        status,
        sort_by: finalSortBy,
        sort_order: finalSortOrder
      }
    }
  });
}

/**
 * Tạo đánh giá mới
 */
async function createReview(req, res, pool) {
  const { product_id, rating, comment, images } = req.body;

  // Validation
  if (!product_id || !rating) {
    return res.status(400).json({
      success: false,
      message: "ID sản phẩm và đánh giá là bắt buộc"
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Đánh giá phải từ 1 đến 5 sao"
    });
  }

  // Kiểm tra sản phẩm tồn tại
  const [productExists] = await pool.execute(
    `SELECT * FROM sanpham WHERE id = ?`,
    [product_id]
  );

  if (!productExists || productExists.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Sản phẩm không tồn tại"
    });
  }

  // Kiểm tra user đã mua sản phẩm này chưa
  const [purchaseCheck] = await pool.execute(`
    SELECT dh.id
    FROM don_hang dh
    JOIN don_hang_chitiet dhct ON dh.id = dhct.don_hang_id
    WHERE dh.nguoi_dung_id = ? 
      AND dhct.san_pham_id = ? 
      AND dh.trang_thai = 'delivered'
    LIMIT 1
  `, [req.user.id, product_id]);

  if (!purchaseCheck || purchaseCheck.length === 0) {
    return res.status(403).json({
      success: false,
      message: "Bạn chỉ có thể đánh giá sản phẩm đã mua và nhận hàng"
    });
  }

  // Kiểm tra user đã đánh giá sản phẩm này chưa
  const [existingReview] = await pool.execute(
    `SELECT * FROM danh_gia 
     WHERE nguoi_dung_id = ? AND san_pham_id = ?`,
    [req.user.id, product_id]
  );

  if (existingReview && existingReview.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Bạn đã đánh giá sản phẩm này rồi"
    });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO danh_gia (
        nguoi_dung_id, san_pham_id, danh_gia, binh_luan, 
        hinh_anh, trang_thai, thoi_gian_tao
      ) VALUES (?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        req.user.id, 
        product_id, 
        rating, 
        comment || null,
        images || null
      ]
    );

    const newReviewId = result.insertId;

    // Lấy thông tin đánh giá vừa tạo
    const [newReview] = await pool.execute(`
      SELECT 
        dg.*,
        sp.ten as product_name,
        sp.ma_sp as product_code,
        nd.ho_ten as user_name
      FROM danh_gia dg
      LEFT JOIN sanpham sp ON dg.san_pham_id = sp.id
      LEFT JOIN nguoi_dung nd ON dg.nguoi_dung_id = nd.id
      WHERE dg.id = ?
    `, [newReviewId]);

    res.status(201).json({
      success: true,
      message: "Đánh giá đã được gửi và đang chờ duyệt",
      data: newReview[0]
    });

  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo đánh giá"
    });
  }
}

export default withAuth(handler);
