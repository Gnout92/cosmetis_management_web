// src/pages/api/reviews/[id]/moderate.js
import { getPool } from "../../../../lib/database/db";
import { withAuth } from "../../../../lib/middleware/auth";
import { hasPermission } from "../../../../lib/auth/permissionManager";

/**
 * API: Duyệt/ẩn đánh giá sản phẩm
 * PUT: Cập nhật trạng thái đánh giá (Admin & Review moderators only)
 */

const VALID_STATUSES = ['pending', 'approved', 'rejected'];

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();
  const { id } = req.query;

  try {
    // Kiểm tra quyền truy cập
    if (!hasPermission(req.user, 'review.moderate')) {
      return res.status(403).json({ 
        success: false, 
        message: "Bạn không có quyền duyệt đánh giá" 
      });
    }

    const { status, reason } = req.body;

    // Validation
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Trạng thái không hợp lệ. Các trạng thái hợp lệ: ${VALID_STATUSES.join(', ')}`
      });
    }

    // Lấy thông tin đánh giá hiện tại
    const [reviewExists] = await pool.execute(
      `SELECT dg.*, sp.ten as product_name, nd.ho_ten as user_name
       FROM danh_gia dg
       LEFT JOIN sanpham sp ON dg.san_pham_id = sp.id
       LEFT JOIN nguoi_dung nd ON dg.nguoi_dung_id = nd.id
       WHERE dg.id = ?`,
      [id]
    );

    if (!reviewExists || reviewExists.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Đánh giá không tồn tại" 
      });
    }

    const review = reviewExists[0];
    const currentStatus = review.trang_thai;

    // Nếu đã ở trạng thái này rồi
    if (currentStatus === status) {
      return res.status(400).json({
        success: false,
        message: "Đánh giá đã ở trạng thái này"
      });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Cập nhật trạng thái đánh giá
      await connection.execute(
        `UPDATE danh_gia 
         SET trang_thai = ?, 
             ghi_chu_admin = CONCAT(IFNULL(ghi_chu_admin, ''), '\n[', NOW(), '] ', ?),
             nguoi_duyet_id = ?,
             thoi_gian_duyet = NOW()
         WHERE id = ?`,
        [status, `Trạng thái đã cập nhật: ${currentStatus} → ${status}${reason ? ' - Lý do: ' + reason : ''}`, req.user.id, id]
      );

      // Ghi lịch sử thay đổi
      await connection.execute(
        `INSERT INTO danh_gia_lich_su (danh_gia_id, trang_thai_cu, trang_thai_moi, ghi_chu, nguoi_cap_nhat_id, thoi_gian_cap_nhat)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [id, currentStatus, status, reason || null, req.user.id]
      );

      // Xử lý logic đặc biệt khi duyệt đánh giá
      if (status === 'approved') {
        await handleApprovedReview(connection, review, req.user.id);
      } else if (status === 'rejected') {
        await handleRejectedReview(connection, review, req.user.id, reason);
      }

      await connection.commit();

      // Lấy thông tin đánh giá sau khi cập nhật
      const [updatedReview] = await connection.execute(
        `SELECT dg.*, sp.ten as product_name, nd.ho_ten as user_name, admin.ho_ten as moderator_name
         FROM danh_gia dg
         LEFT JOIN sanpham sp ON dg.san_pham_id = sp.id
         LEFT JOIN nguoi_dung nd ON dg.nguoi_dung_id = nd.id
         LEFT JOIN nguoi_dung admin ON dg.nguoi_duyet_id = admin.id
         WHERE dg.id = ?`,
        [id]
      );

      res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái đánh giá thành công",
        data: {
          review: updatedReview[0],
          status_change: {
            from: currentStatus,
            to: status,
            reason: reason,
            moderated_by: req.user.id,
            moderated_at: new Date().toISOString()
          }
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error moderating review:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi duyệt đánh giá",
      error: error.message
    });
  }
}

/**
 * Xử lý khi đánh giá được duyệt
 */
async function handleApprovedReview(connection, review, moderatorId) {
  try {
    // Cập nhật rating trung bình cho sản phẩm
    await connection.execute(`
      UPDATE sanpham 
      SET 
        danh_gia_trung_binh = (
          SELECT AVG(danh_gia) 
          FROM danh_gia 
          WHERE san_pham_id = ? AND trang_thai = 'approved'
        ),
        so_luong_danh_gia = (
          SELECT COUNT(*) 
          FROM danh_gia 
          WHERE san_pham_id = ? AND trang_thai = 'approved'
        )
      WHERE id = ?
    `, [review.san_pham_id, review.san_pham_id, review.san_pham_id]);

    // Gửi thông báo cho user (nếu có hệ thống thông báo)
    // await sendNotification(review.nguoi_dung_id, 'review_approved', review.id);

  } catch (error) {
    console.error('Error handling approved review:', error);
    throw error;
  }
}

/**
 * Xử lý khi đánh giá bị từ chối
 */
async function handleRejectedReview(connection, review, moderatorId, reason) {
  try {
    // Có thể gửi thông báo cho user về lý do từ chối
    // await sendNotification(review.nguoi_dung_id, 'review_rejected', { review_id: review.id, reason });

    // Log sự kiện cho audit trail
    await connection.execute(`
      INSERT INTO audit_log (
        table_name, record_id, action, old_values, new_values, 
        user_id, ip_address, user_agent, created_at
      ) VALUES (
        'danh_gia', ?, 'REJECT', 
        JSON_OBJECT('status', ?), 
        JSON_OBJECT('status', ?, 'reason', ?),
        ?, ?, ?, NOW()
      )
    `, [
      review.id, 
      review.trang_thai, 
      'rejected', 
      reason,
      moderatorId,
      // Có thể lấy từ req headers
      '127.0.0.1',
      'MiniMax-Agent'
    ]);

  } catch (error) {
    console.error('Error handling rejected review:', error);
    throw error;
  }
}

export default withAuth(handler);
