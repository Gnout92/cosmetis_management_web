// src/pages/api/admin/users/[id]/toggle-status.js
import { getPool } from "../../../../../lib/database/db";
import { withAuth } from "../../../../../lib/middleware/auth";

/**
 * API: Kích hoạt/Khóa tài khoản (Admin only)
 * PUT: Toggle active status
 */

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();
  const { id } = req.query;
  const { isActive } = req.body;

  if (!id || isActive === undefined) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin",
    });
  }

  try {
    // Không cho phép khóa chính mình
    if (parseInt(id) === req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Không thể khóa tài khoản của chính bạn",
      });
    }

    // Kiểm tra user tồn tại
    const [users] = await pool.execute(
      `SELECT id, ten_dang_nhap FROM nguoi_dung WHERE id = ?`,
      [id]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Cập nhật trạng thái
    await pool.execute(
      `UPDATE nguoi_dung SET dang_hoat_dong = ?, thoi_gian_cap_nhat = NOW() WHERE id = ?`,
      [isActive ? 1 : 0, id]
    );

    return res.status(200).json({
      success: true,
      message: isActive ? "Đã kích hoạt tài khoản" : "Đã khóa tài khoản",
      data: {
        userId: id,
        username: users[0].ten_dang_nhap,
        isActive,
      },
    });
  } catch (err) {
    console.error("[/api/admin/users/[id]/toggle-status] error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + err.message,
    });
  }
}

export default withAuth(handler, ["Admin"]);
