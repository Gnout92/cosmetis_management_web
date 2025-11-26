// src/pages/api/reviews/create.js
import { getPool } from "../../../lib/database/db";
import { withAuth } from "../../../lib/middleware/auth";

/**
 * API: Tạo đánh giá sản phẩm mới
 * POST: Tạo đánh giá mới (Customer only)
 * PUT: Cập nhật đánh giá đã tạo
 */

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

async function handler(req, res) {
  const pool = getPool();

  try {
    if (req.method === "POST") {
      return createNewReview(req, res, pool);
    } else if (req.method === "PUT") {
      return updateExistingReview(req, res, pool);
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

  } catch (error) {
    console.error('Error in create review handler:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
}

/**
 * Tạo đánh giá mới
 */
async function createNewReview(req, res, pool) {
  const { product_id, rating, comment, images } = req.body;

  try {
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

    if (comment && comment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Bình luận không được vượt quá 1000 ký tự"
      });
    }

    if (images && images.length > MAX_IMAGES) {
      return res.status(400).json({
        success: false,
        message: `Tối đa chỉ được upload ${MAX_IMAGES} hình ảnh`
      });
    }

    // Kiểm tra sản phẩm tồn tại và đang bán
    const [productExists] = await pool.execute(
      `SELECT id, ten, ma_sp, trang_thai FROM sanpham WHERE id = ?`,
      [product_id]
    );

    if (!productExists || productExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại"
      });
    }

    const product = productExists[0];
    
    if (product.trang_thai !== 'active') {
      return res.status(400).json({
        success: false,
        message: "Không thể đánh giá sản phẩm không còn bán"
      });
    }

    // Kiểm tra user đã mua sản phẩm này chưa
    const [purchaseCheck] = await pool.execute(`
      SELECT dh.id, dh.ma_don_hang, dh.thoi_gian_tao
      FROM don_hang dh
      JOIN don_hang_chitiet dhct ON dh.id = dhct.don_hang_id
      WHERE dh.nguoi_dung_id = ? 
        AND dhct.san_pham_id = ? 
        AND dh.trang_thai = 'delivered'
        AND dh.thoi_gian_tao >= DATE_SUB(NOW(), INTERVAL 365 DAY) -- Chỉ cho phép đánh giá trong vòng 1 năm
      LIMIT 1
    `, [req.user.id, product_id]);

    if (!purchaseCheck || purchaseCheck.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Bạn chỉ có thể đánh giá sản phẩm đã mua và nhận hàng trong vòng 1 năm"
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
        message: "Bạn đã đánh giá sản phẩm này rồi. Hãy cập nhật đánh giá cũ thay vì tạo mới.",
        existing_review_id: existingReview[0].id
      });
    }

    // Kiểm tra đơn hàng tương ứng (để liên kết đánh giá với đơn hàng cụ thể)
    const orderInfo = purchaseCheck[0];

    // Xử lý upload hình ảnh nếu có
    let imageUrls = null;
    if (images && images.length > 0) {
      imageUrls = await processReviewImages(images);
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Tạo đánh giá mới
      const [result] = await connection.execute(
        `INSERT INTO danh_gia (
          nguoi_dung_id, san_pham_id, don_hang_id, danh_gia, binh_luan, 
          hinh_anh, trang_thai, thoi_gian_tao, thoi_gian_cap_nhat
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
        [
          req.user.id, 
          product_id,
          orderInfo.id,
          rating, 
          comment || null,
          imageUrls ? JSON.stringify(imageUrls) : null
        ]
      );

      const newReviewId = result.insertId;

      await connection.commit();

      // Lấy thông tin đánh giá vừa tạo với thông tin đầy đủ
      const [newReview] = await connection.execute(`
        SELECT 
          dg.*,
          sp.ten as product_name,
          sp.ma_sp as product_code,
          sp.hinh_anh as product_image,
          nd.ho_ten as user_name,
          nd.avatar as user_avatar,
          dh.ma_don_hang as order_code
        FROM danh_gia dg
        LEFT JOIN sanpham sp ON dg.san_pham_id = sp.id
        LEFT JOIN nguoi_dung nd ON dg.nguoi_dung_id = nd.id
        LEFT JOIN don_hang dh ON dg.don_hang_id = dh.id
        WHERE dg.id = ?
      `, [newReviewId]);

      res.status(201).json({
        success: true,
        message: "Đánh giá đã được gửi và đang chờ duyệt. Cảm ơn bạn đã chia sẻ trải nghiệm!",
        data: {
          review: newReview[0],
          status: 'pending',
          expected_review_time: '1-2 ngày làm việc'
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo đánh giá"
    });
  }
}

/**
 * Cập nhật đánh giá đã tạo
 */
async function updateExistingReview(req, res, pool) {
  const { review_id, rating, comment, images } = req.body;

  try {
    // Validation
    if (!review_id) {
      return res.status(400).json({
        success: false,
        message: "ID đánh giá là bắt buộc"
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Đánh giá phải từ 1 đến 5 sao"
      });
    }

    // Lấy thông tin đánh giá hiện tại
    const [reviewExists] = await pool.execute(
      `SELECT * FROM danh_gia WHERE id = ? AND nguoi_dung_id = ?`,
      [review_id, req.user.id]
    );

    if (!reviewExists || reviewExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Đánh giá không tồn tại hoặc bạn không có quyền cập nhật"
      });
    }

    const review = reviewExists[0];

    // Nếu đánh giá đã được duyệt, cần admin duyệt lại
    const requiresReapproval = review.trang_thai === 'approved';

    // Xử lý hình ảnh nếu có
    let imageUrls = review.hinh_anh;
    if (images && images.length > 0) {
      if (images.length > MAX_IMAGES) {
        return res.status(400).json({
          success: false,
          message: `Tối đa chỉ được upload ${MAX_IMAGES} hình ảnh`
        });
      }
      imageUrls = await processReviewImages(images);
    }

    await pool.execute(
      `UPDATE danh_gia 
       SET danh_gia = ?, 
           binh_luan = ?, 
           hinh_anh = ?, 
           trang_thai = ?,
           thoi_gian_cap_nhat = NOW()
       WHERE id = ?`,
      [
        rating,
        comment || null,
        imageUrls ? JSON.stringify(imageUrls) : null,
        requiresReapproval ? 'pending' : review.trang_thai,
        review_id
      ]
    );

    // Lấy thông tin sau khi cập nhật
    const [updatedReview] = await pool.execute(`
      SELECT 
        dg.*,
        sp.ten as product_name,
        sp.ma_sp as product_code,
        nd.ho_ten as user_name
      FROM danh_gia dg
      LEFT JOIN sanpham sp ON dg.san_pham_id = sp.id
      LEFT JOIN nguoi_dung nd ON dg.nguoi_dung_id = nd.id
      WHERE dg.id = ?
    `, [review_id]);

    res.status(200).json({
      success: true,
      message: requiresReapproval ? 
        "Cập nhật đánh giá thành công. Đánh giá sẽ được duyệt lại." :
        "Cập nhật đánh giá thành công",
      data: {
        review: updatedReview[0],
        requires_reapproval: requiresReapproval
      }
    });

  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật đánh giá"
    });
  }
}

/**
 * Xử lý upload hình ảnh đánh giá
 */
async function processReviewImages(images) {
  // TODO: Implement image upload logic
  // Trong thực tế, cần upload lên cloud storage và trả về URLs
  // Hiện tại trả về mock URLs để demo
  
  const imageUrls = images.map((image, index) => ({
    url: `/uploads/reviews/review-image-${Date.now()}-${index}.jpg`,
    original_name: image.name || `image-${index + 1}`,
    size: image.size || 0
  }));

  return imageUrls;
}

export default withAuth(handler);
