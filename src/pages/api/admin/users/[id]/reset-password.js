// src/pages/api/admin/users/[id]/reset-password.js
import { getPool } from "../../../../../lib/database/db";
import { withAuth } from "../../../../../lib/middleware/auth";
import bcrypt from "bcryptjs";

/**
 * API: Reset mật khẩu người dùng (Admin only)
 * PUT: Reset password
 */

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();
  const { id } = req.query;
  const { newPassword } = req.body;

  if (!id || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin ID hoặc mật khẩu mới",
    });
  }

  try {
    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự",
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

    // Hash password mới
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Cập nhật password
    await pool.execute(
      `UPDATE nguoi_dung SET mat_khau_hash = ?, thoi_gian_cap_nhat = NOW() WHERE id = ?`,
      [passwordHash, id]
    );

    // Log action
    try {
      await pool.execute(
        `INSERT INTO log_hoat_dong (nguoi_dung_id, hanh_dong, chi_tiet) 
         VALUES (?, 'RESET_PASSWORD', ?)`,
        [
          req.user.id,
          JSON.stringify({
            targetUserId: id,
            targetUsername: users[0].ten_dang_nhap,
          }),
        ]
      );
    } catch (logErr) {
      console.log("Log table not found, skipping...");
    }

    return res.status(200).json({
      success: true,
      message: "Reset mật khẩu thành công",
      data: {
        userId: id,
        username: users[0].ten_dang_nhap,
      },
    });
  } catch (err) {
    console.error("[/api/admin/users/[id]/reset-password] error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + err.message,
    });
  }
}

export default withAuth(handler, ["Admin"]);
