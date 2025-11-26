// src/pages/api/promotions/index.js
import { getPool } from "../../../lib/database/db";
import { withAuth } from "../../../lib/middleware/auth";
import { hasPermission } from "../../../lib/auth/permissionManager";

/**
 * API: Quản lý khuyến mãi
 * GET: Danh sách khuyến mãi (Public & Admin view)
 * POST: Tạo khuyến mãi mới (Admin only)
 * PUT: Cập nhật khuyếm mãi (Admin only)
 * DELETE: Xóa khuyến mãi (Admin only)
 */

const PROMOTION_TYPES = ['percent', 'fixed', 'free_shipping', 'buy_x_get_y'];

async function handler(req, res) {
  const pool = getPool();

  try {
    if (req.method === "GET") {
      return getPromotions(req, res, pool);
    } else if (req.method === "POST") {
      return createPromotion(req, res, pool);
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

  } catch (error) {
    console.error('Error in promotions handler:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
}

/**
 * Lấy danh sách khuyến mãi
 */
async function getPromotions(req, res, pool) {
  const {
    page = 1,
    limit = 10,
    status,
    type,
    active_only = 'true',
    user_id
  } = req.query;

  const offset = (page - 1) * limit;

  // Xây dựng WHERE clause
  let whereConditions = ["1=1"];
  let queryParams = [];

  // Chỉ hiển thị khuyến mãi active cho public
  if (active_only === 'true') {
    whereConditions.push(`
      km.trang_thai = 'active'
      AND km.thoi_gian_bat_dau <= NOW()
      AND km.thoi_gian_ket_thuc >= NOW()
      AND (km.so_luong_su_dung < km.so_luong_toi_da OR km.so_luong_toi_da IS NULL)
    `);
  }

  if (status) {
    whereConditions.push("km.trang_thai = ?");
    queryParams.push(status);
  }

  if (type) {
    whereConditions.push("km.loai = ?");
    queryParams.push(type);
  }

  if (user_id) {
    whereConditions.push("km.tao_boi_id = ?");
    queryParams.push(user_id);
  }

  const whereClause = whereConditions.join(" AND ");

  // Lấy danh sách khuyến mãi
  const query = `
    SELECT 
      km.id,
      km.ma_code,
      km.ten,
      km.mo_ta,
      km.loai,
      km.gia_tri,
      km.dieu_kien_toi_thieu,
      km.so_luong_toi_da,
      km.so_luong_su_dung,
      km.thoi_gian_bat_dau,
      km.thoi_gian_ket_thuc,
      km.trang_thai,
      km.ngay_tao,
      km.ngay_cap_nhat,
      nd.ho_ten as created_by_name,
      -- Tính toán trạng thái
      CASE 
        WHEN km.thoi_gian_ket_thuc < NOW() THEN 'expired'
        WHEN km.so_luong_su_dung >= km.so_luong_toi_da THEN 'out_of_stock'
        WHEN km.thoi_gian_bat_dau > NOW() THEN 'upcoming'
        ELSE 'active'
      END as display_status,
      -- Tính phần trăm sử dụng
      CASE 
        WHEN km.so_luong_toi_da IS NOT NULL 
        THEN ROUND((km.so_luong_su_dung * 100.0 / km.so_luong_toi_da), 2)
        ELSE 0
      END as usage_percent
    FROM khuyen_mai km
    LEFT JOIN nguoi_dung nd ON km.tao_boi_id = nd.id
    WHERE ${whereClause}
    ORDER BY km.ngay_tao DESC
    LIMIT ? OFFSET ?
  `;

  queryParams.push(parseInt(limit), offset);

  const [promotions] = await pool.execute(query, queryParams);

  // Lấy tổng số khuyến mãi cho phân trang
  const countQuery = `
    SELECT COUNT(*) as total
    FROM khuyen_mai km
    WHERE ${whereClause}
  `;

  const [countResult] = await pool.execute(countQuery, queryParams.slice(0, -2));
  const totalPromotions = countResult[0].total;

  const totalPages = Math.ceil(totalPromotions / limit);

  // Lấy thống kê
  const statsQuery = `
    SELECT 
      COUNT(*) as total_promotions,
      SUM(CASE WHEN trang_thai = 'active' THEN 1 ELSE 0 END) as active_count,
      SUM(CASE WHEN trang_thai = 'inactive' THEN 1 ELSE 0 END) as inactive_count,
      SUM(CASE WHEN thoi_gian_ket_thuc < NOW() THEN 1 ELSE 0 END) as expired_count,
      SUM(so_luong_su_dung) as total_usage,
      AVG(so_luong_su_dung) as avg_usage
    FROM khuyen_mai km
    WHERE ${whereClause.replace(/km\./g, '')}
  `;

  const [stats] = await pool.execute(statsQuery, queryParams.slice(0, -2));

  // Lấy danh sách loại khuyến mãi cho filter
  const [types] = await pool.execute(`
    SELECT DISTINCT loai, COUNT(*) as count
    FROM khuyen_mai 
    GROUP BY loai
    ORDER BY loai
  `);

  res.status(200).json({
    success: true,
    data: {
      promotions: promotions,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: totalPromotions,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1
      },
      stats: stats[0],
      types: types,
      filters: {
        status,
        type,
        active_only,
        user_id
      }
    }
  });
}

/**
 * Tạo khuyến mãi mới
 */
async function createPromotion(req, res, pool) {
  try {
    // Kiểm tra quyền
    if (!hasPermission(req.user, 'promo.manage')) {
      return res.status(403).json({ 
        success: false, 
        message: "Bạn không có quyền quản lý khuyến mãi" 
      });
    }

    const {
      ma_code,
      ten,
      mo_ta,
      loai,
      gia_tri,
      dieu_kien_toi_thieu = 0,
      so_luong_toi_da,
      thoi_gian_bat_dau,
      thoi_gian_ket_thuc,
      trang_thai = 'active'
    } = req.body;

    // Validation
    if (!ma_code || !ten || !loai || !gia_tri || !thoi_gian_bat_dau || !thoi_gian_ket_thuc) {
      return res.status(400).json({
        success: false,
        message: "Các trường bắt buộc: mã code, tên, loại, giá trị, thời gian bắt đầu và kết thúc"
      });
    }

    if (!PROMOTION_TYPES.includes(loai)) {
      return res.status(400).json({
        success: false,
        message: `Loại khuyến mãi không hợp lệ. Các loại hợp lệ: ${PROMOTION_TYPES.join(', ')}`
      });
    }

    if (new Date(thoi_gian_bat_dau) >= new Date(thoi_gian_ket_thuc)) {
      return res.status(400).json({
        success: false,
        message: "Thời gian kết thúc phải sau thời gian bắt đầu"
      });
    }

    if (gia_tri <= 0) {
      return res.status(400).json({
        success: false,
        message: "Giá trị khuyến mãi phải lớn hơn 0"
      });
    }

    // Kiểm tra mã code đã tồn tại chưa
    const [existingCode] = await pool.execute(
      `SELECT id FROM khuyen_mai WHERE ma_code = ?`,
      [ma_code]
    );

    if (existingCode && existingCode.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Mã khuyến mãi đã tồn tại"
      });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [result] = await connection.execute(
        `INSERT INTO khuyen_mai (
          ma_code, ten, mo_ta, loai, gia_tri, dieu_kien_toi_thieu,
          so_luong_toi_da, thoi_gian_bat_dau, thoi_gian_ket_thuc,
          trang_thai, so_luong_su_dung, tao_boi_id, ngay_tao, ngay_cap_nhat
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, NOW(), NOW())`,
        [
          ma_code.trim().toUpperCase(),
          ten.trim(),
          mo_ta || null,
          loai,
          gia_tri,
          dieu_kien_toi_thieu,
          so_luong_toi_da,
          thoi_gian_bat_dau,
          thoi_gian_ket_thuc,
          trang_thai,
          req.user.id
        ]
      );

      const newPromotionId = result.insertId;

      await connection.commit();

      // Lấy thông tin khuyến mãi vừa tạo
      const [newPromotion] = await connection.execute(`
        SELECT 
          km.*,
          nd.ho_ten as created_by_name
        FROM khuyen_mai km
        LEFT JOIN nguoi_dung nd ON km.tao_boi_id = nd.id
        WHERE km.id = ?
      `, [newPromotionId]);

      res.status(201).json({
        success: true,
        message: "Tạo khuyến mãi thành công",
        data: newPromotion[0]
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error creating promotion:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo khuyến mãi"
    });
  }
}

export default withAuth(handler);
