// src/pages/api/orders/[id]/status.js
import { getPool } from "../../../../lib/database/db";
import { withAuth } from "../../../../lib/middleware/auth";
import { hasPermission } from "../../../../lib/auth/permissionManager";

/**
 * API: Cập nhật trạng thái đơn hàng
 * PUT: Cập nhật trạng thái đơn hàng (Admin & QL_Orders only)
 */

const VALID_STATUSES = [
  'pending',      // Chờ xử lý
  'confirmed',    // Đã xác nhận
  'processing',   // Đang chuẩn bị
  'shipping',     // Đang giao hàng
  'delivered',    // Đã giao hàng
  'cancelled',    // Đã hủy
  'refunded'      // Đã hoàn tiền
];

const STATUS_TRANSITIONS = {
  'pending': ['confirmed', 'cancelled'],
  'confirmed': ['processing', 'cancelled'],
  'processing': ['shipping', 'cancelled'],
  'shipping': ['delivered', 'cancelled'],
  'delivered': ['refunded'],
  'cancelled': [], // Không thể chuyển từ cancelled
  'refunded': []   // Không thể chuyển từ refunded
};

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();
  const { id } = req.query;

  try {
    // Kiểm tra quyền truy cập
    if (!hasPermission(req.user, 'order.set_status')) {
      return res.status(403).json({ 
        success: false, 
        message: "Bạn không có quyền cập nhật trạng thái đơn hàng" 
      });
    }

    const { status, note, reason } = req.body;

    // Validation
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Trạng thái không hợp lệ. Các trạng thái hợp lệ: ${VALID_STATUSES.join(', ')}`
      });
    }

    // Lấy thông tin đơn hàng hiện tại
    const [orderExists] = await pool.execute(
      `SELECT dh.*, nd.ho_ten as customer_name 
       FROM don_hang dh
       LEFT JOIN nguoi_dung nd ON dh.nguoi_dung_id = nd.id
       WHERE dh.id = ?`,
      [id]
    );

    if (!orderExists || orderExists.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Đơn hàng không tồn tại" 
      });
    }

    const order = orderExists[0];
    const currentStatus = order.trang_thai;

    // Kiểm tra transition hợp lệ
    if (currentStatus === status) {
      return res.status(400).json({
        success: false,
        message: "Đơn hàng đã ở trạng thái này"
      });
    }

    const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowedTransitions.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Không thể chuyển từ trạng thái "${currentStatus}" sang "${status}"`
      });
    }

    // Kiểm tra logic đặc biệt
    const canTransition = await validateStatusTransition(pool, id, currentStatus, status, order);
    if (!canTransition.valid) {
      return res.status(400).json({
        success: false,
        message: canTransition.message
      });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Cập nhật trạng thái đơn hàng
      await connection.execute(
        `UPDATE don_hang 
         SET trang_thai = ?, 
             ghi_chu = CONCAT(IFNULL(ghi_chu, ''), '\n[', NOW(), '] ', ?),
             thoi_gian_cap_nhat = NOW()
         WHERE id = ?`,
        [status, `Trạng thái đã cập nhật: ${currentStatus} → ${status}${note ? ' - ' + note : ''}`, id]
      );

      // Ghi lịch sử thay đổi
      await connection.execute(
        `INSERT INTO don_hang_lich_su (don_hang_id, trang_thai_cu, trang_thai_moi, ghi_chu, nguoi_cap_nhat_id, thoi_gian_cap_nhat)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [id, currentStatus, status, note || null, req.user.id]
      );

      // Xử lý logic đặc biệt cho từng trạng thái
      await handleStatusSpecificLogic(connection, id, currentStatus, status, req.user.id);

      await connection.commit();

      // Lấy thông tin đơn hàng sau khi cập nhật
      const [updatedOrder] = await connection.execute(
        `SELECT dh.*, nd.ho_ten as customer_name, nd.email as customer_email
         FROM don_hang dh
         LEFT JOIN nguoi_dung nd ON dh.nguoi_dung_id = nd.id
         WHERE dh.id = ?`,
        [id]
      );

      res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái đơn hàng thành công",
        data: {
          order: updatedOrder[0],
          status_change: {
            from: currentStatus,
            to: status,
            note: note,
            updated_by: req.user.id,
            updated_at: new Date().toISOString()
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
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật trạng thái đơn hàng",
      error: error.message
    });
  }
}

/**
 * Validate việc chuyển đổi trạng thái
 */
async function validateStatusTransition(pool, orderId, fromStatus, toStatus, order) {
  try {
    if (toStatus === 'delivered') {
      // Kiểm tra đã giao hàng chưa
      const [deliveries] = await pool.execute(
        `SELECT * FROM don_hang_chi_tiet WHERE don_hang_id = ?`,
        [orderId]
      );
      
      if (deliveries.length === 0) {
        return { valid: false, message: "Đơn hàng không có sản phẩm để giao" };
      }
    }

    if (toStatus === 'cancelled') {
      // Kiểm tra đơn hàng có thể hủy không
      if (fromStatus === 'delivered') {
        return { valid: false, message: "Không thể hủy đơn hàng đã giao" };
      }
      
      if (fromStatus === 'refunded') {
        return { valid: false, message: "Không thể hủy đơn hàng đã hoàn tiền" };
      }
    }

    return { valid: true, message: "OK" };
  } catch (error) {
    return { valid: false, message: "Lỗi kiểm tra trạng thái" };
  }
}

/**
 * Xử lý logic đặc biệt cho từng trạng thái
 */
async function handleStatusSpecificLogic(connection, orderId, fromStatus, toStatus, userId) {
  switch (toStatus) {
    case 'shipping':
      // Cập nhật tồn kho khi bắt đầu giao hàng
      await connection.execute(`
        UPDATE ton_kho tk
        JOIN don_hang_chitiet dhct ON tk.san_pham_id = dhct.san_pham_id
        SET tk.so_luong = tk.so_luong - dhct.so_luong
        WHERE dhct.don_hang_id = ?
      `, [orderId]);
      break;

    case 'cancelled':
      // Hoàn trả tồn kho khi hủy đơn hàng
      if (['confirmed', 'processing', 'shipping'].includes(fromStatus)) {
        await connection.execute(`
          UPDATE ton_kho tk
          JOIN don_hang_chitiet dhct ON tk.san_pham_id = dhct.san_pham_id
          SET tk.so_luong = tk.so_luong + dhct.so_luong
          WHERE dhct.don_hang_id = ?
        `, [orderId]);
      }
      break;

    case 'delivered':
      // Có thể thêm logic hoàn thành đơn hàng
      break;

    case 'refunded':
      // Hoàn trả tồn kho và xử lý hoàn tiền
      await connection.execute(`
        UPDATE ton_kho tk
        JOIN don_hang_chitiet dhct ON tk.san_pham_id = dhct.san_pham_id
        SET tk.so_luong = tk.so_luong + dhct.so_luong
        WHERE dhct.don_hang_id = ?
      `, [orderId]);
      break;
  }
}

export default withAuth(handler);
