// src/pages/api/admin/users.js
import { getPool } from "../../../lib/database/db";
import { withAuth } from "../../../lib/middleware/auth";
import bcrypt from "bcryptjs";

/**
 * API: Quản lý tài khoản người dùng (Admin only)
 * GET: Lấy danh sách tất cả users với vai trò từ RBAC
 * POST: Tạo tài khoản mới và gán vai trò
 */

async function handler(req, res) {
  const pool = getPool();

  try {
    // GET: Lấy danh sách users với vai trò RBAC
    if (req.method === "GET") {
      const {
        role = "",
        search = "",
        page = 1,
        limit = 20,
        isActive = "",
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);

      let whereConditions = [];
      let queryParams = [];

      if (role) {
        whereConditions.push("vt.ten = ?");
        queryParams.push(role);
      }

      if (search) {
        whereConditions.push(
          "(nd.ten_hien_thi LIKE ? OR nd.email LIKE ? OR nd.ten_dang_nhap LIKE ?)"
        );
        queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (isActive !== "") {
        whereConditions.push("nd.dang_hoat_dong = ?");
        queryParams.push(isActive === "true" ? 1 : 0);
      }

      const whereClause =
        whereConditions.length > 0
          ? "WHERE " + whereConditions.join(" AND ")
          : "";

      // Query users với vai trò (group_concat để lấy tất cả vai trò của user)
      const [users] = await pool.execute(
        `SELECT 
          nd.id,
          nd.ten_dang_nhap as username,
          nd.email,
          nd.ten_hien_thi as displayName,
          nd.ho as firstName,
          nd.ten as lastName,
          nd.anh_dai_dien as avatar,
          nd.dang_hoat_dong as isActive,
          nd.thoi_gian_tao as createdAt,
          nd.thoi_gian_cap_nhat as updatedAt,
          GROUP_CONCAT(vt.ten SEPARATOR ', ') as roles
        FROM nguoi_dung nd
        LEFT JOIN nguoi_dung_vai_tro nvt ON nd.id = nvt.nguoi_dung_id
        LEFT JOIN vai_tro vt ON nvt.vai_tro_id = vt.id
        ${whereClause}
        GROUP BY nd.id
        ORDER BY nd.thoi_gian_tao DESC
        LIMIT ? OFFSET ?`,
        [...queryParams, parseInt(limit), offset]
      );

      // Format roles thành array
      const formattedUsers = users.map(user => ({
        ...user,
        roles: user.roles ? user.roles.split(', ') : ['Customer']
      }));

      const [countResult] = await pool.execute(
        `SELECT COUNT(DISTINCT nd.id) as total 
        FROM nguoi_dung nd
        LEFT JOIN nguoi_dung_vai_tro nvt ON nd.id = nvt.nguoi_dung_id
        LEFT JOIN vai_tro vt ON nvt.vai_tro_id = vt.id
        ${whereClause}`,
        queryParams
      );

      const total = countResult[0]?.total || 0;

      return res.status(200).json({
        success: true,
        data: formattedUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    }

    // POST: Tạo tài khoản mới với vai trò RBAC
    if (req.method === "POST") {
      const {
        username,
        email,
        password,
        displayName,
        firstName,
        lastName,
        roles = ["Customer"], // Array of roles
      } = req.body;

      // Validation
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập đầy đủ: Tên đăng nhập, Email, Mật khẩu",
        });
      }

      // Validate roles
      const validRoles = ["Customer", "Admin", "QL_SanPham", "QL_Kho", "QL_KhachHang"];
      const rolesToAssign = Array.isArray(roles) ? roles : [roles];
      
      for (const role of rolesToAssign) {
        if (!validRoles.includes(role)) {
          return res.status(400).json({
            success: false,
            message: `Vai trò không hợp lệ: ${role}`,
          });
        }
      }

      // Kiểm tra username/email đã tồn tại chưa
      const [existing] = await pool.execute(
        `SELECT id FROM nguoi_dung WHERE ten_dang_nhap = ? OR email = ?`,
        [username, email]
      );

      if (existing && existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Tên đăng nhập hoặc email đã tồn tại",
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Bắt đầu transaction
      await pool.query("START TRANSACTION");

      try {
        // Insert user
        const [result] = await pool.execute(
          `INSERT INTO nguoi_dung 
          (ten_dang_nhap, email, mat_khau_hash, ten_hien_thi, ho, ten, dang_hoat_dong, thoi_gian_tao, thoi_gian_cap_nhat) 
          VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
          [
            username,
            email,
            passwordHash,
            displayName || username,
            firstName || "",
            lastName || "",
          ]
        );

        const userId = result.insertId;

        // Gán vai trò cho user
        for (const roleName of rolesToAssign) {
          // Lấy role_id từ tên vai trò
          const [roleResult] = await pool.execute(
            `SELECT id FROM vai_tro WHERE ten = ?`,
            [roleName]
          );

          if (roleResult && roleResult.length > 0) {
            await pool.execute(
              `INSERT INTO nguoi_dung_vai_tro (nguoi_dung_id, vai_tro_id) VALUES (?, ?)`,
              [userId, roleResult[0].id]
            );
          }
        }

        // Log hoạt động
        await pool.execute(
          `INSERT INTO nhat_ky_hoat_dong (bang, ban_ghi_id, hanh_dong, du_lieu_moi, thuc_hien_boi)
           VALUES (?, ?, ?, ?, ?)`,
          [
            'nguoi_dung',
            userId,
            'CREATE',
            JSON.stringify({ username, email, roles: rolesToAssign }),
            req.user.id
          ]
        );

        await pool.query("COMMIT");

        // Lấy thông tin user vừa tạo
        const [newUser] = await pool.execute(
          `SELECT 
            nd.id,
            nd.ten_dang_nhap as username,
            nd.email,
            nd.ten_hien_thi as displayName,
            nd.thoi_gian_tao as createdAt,
            GROUP_CONCAT(vt.ten SEPARATOR ', ') as roles
          FROM nguoi_dung nd
          LEFT JOIN nguoi_dung_vai_tro nvt ON nd.id = nvt.nguoi_dung_id
          LEFT JOIN vai_tro vt ON nvt.vai_tro_id = vt.id
          WHERE nd.id = ?
          GROUP BY nd.id`,
          [userId]
        );

        return res.status(201).json({
          success: true,
          message: "Tạo tài khoản thành công",
          data: {
            ...newUser[0],
            roles: newUser[0].roles ? newUser[0].roles.split(', ') : []
          },
        });
      } catch (err) {
        await pool.query("ROLLBACK");
        throw err;
      }
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    console.error("[/api/admin/users] error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + err.message,
    });
  }
}

// Chỉ Admin mới được truy cập
export default withAuth(handler, ["Admin"]);
