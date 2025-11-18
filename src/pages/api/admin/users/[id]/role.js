// src/pages/api/admin/users/[id]/role.js
import { getPool } from "../../../../../lib/database/db";
import { withAuth } from "../../../../../lib/middleware/auth";

/**
 * API: Cập nhật vai trò người dùng với RBAC (Admin only)
 * PUT: Thay đổi roles (có thể gán nhiều vai trò)
 * Body: { roles: ["Admin", "QL_SanPham"] }
 */

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();
  const { id } = req.query;
  const { roles } = req.body;

  if (!id || !roles) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin ID hoặc vai trò",
    });
  }

  try {
    // Validate roles
    const validRoles = ["Customer", "Admin", "QL_SanPham", "QL_Kho", "QL_KhachHang"];
    const rolesToAssign = Array.isArray(roles) ? roles : [roles];

    for (const role of rolesToAssign) {
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: `Vai trò không hợp lệ: ${role}. Chỉ chấp nhận: ${validRoles.join(", ")}`,
        });
      }
    }

    // Không cho phép tự thay đổi role của chính mình
    if (parseInt(id) === req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Không thể thay đổi vai trò của chính bạn",
      });
    }

    // Kiểm tra user tồn tại
    const [users] = await pool.execute(
      `SELECT nd.id, nd.ten_dang_nhap, GROUP_CONCAT(vt.ten SEPARATOR ', ') as currentRoles
       FROM nguoi_dung nd
       LEFT JOIN nguoi_dung_vai_tro nvt ON nd.id = nvt.nguoi_dung_id
       LEFT JOIN vai_tro vt ON nvt.vai_tro_id = vt.id
       WHERE nd.id = ?
       GROUP BY nd.id`,
      [id]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    const user = users[0];
    const oldRoles = user.currentRoles ? user.currentRoles.split(', ') : [];

    // Bắt đầu transaction
    await pool.query("START TRANSACTION");

    try {
      // Xóa tất cả vai trò hiện tại của user
      await pool.execute(
        `DELETE FROM nguoi_dung_vai_tro WHERE nguoi_dung_id = ?`,
        [id]
      );

      // Gán vai trò mới
      for (const roleName of rolesToAssign) {
        // Lấy role_id từ tên vai trò
        const [roleResult] = await pool.execute(
          `SELECT id FROM vai_tro WHERE ten = ?`,
          [roleName]
        );

        if (roleResult && roleResult.length > 0) {
          await pool.execute(
            `INSERT INTO nguoi_dung_vai_tro (nguoi_dung_id, vai_tro_id) VALUES (?, ?)`,
            [id, roleResult[0].id]
          );
        }
      }

      // Log hoạt động
      await pool.execute(
        `INSERT INTO nhat_ky_hoat_dong (bang, ban_ghi_id, hanh_dong, du_lieu_cu, du_lieu_moi, thuc_hien_boi)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          'nguoi_dung_vai_tro',
          id,
          'UPDATE',
          JSON.stringify({ oldRoles }),
          JSON.stringify({ newRoles: rolesToAssign }),
          req.user.id
        ]
      );

      await pool.query("COMMIT");

      return res.status(200).json({
        success: true,
        message: `Đã cập nhật vai trò thành: ${rolesToAssign.join(', ')}`,
        data: {
          userId: id,
          username: user.ten_dang_nhap,
          oldRoles,
          newRoles: rolesToAssign,
        },
      });
    } catch (err) {
      await pool.query("ROLLBACK");
      throw err;
    }
  } catch (err) {
    console.error("[/api/admin/users/[id]/role] error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + err.message,
    });
  }
}

export default withAuth(handler, ["Admin"]);
