// src/lib/middleware/auth.js
import jwt from "jsonwebtoken";
import { getPool } from "../database/db";

/**
 * Middleware: Xác thực JWT token và phân quyền RBAC
 */

export function verifyToken(token) {
  try {
    // Xử lý Bearer token
    const actualToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
    
    if (!actualToken) {
      return { valid: false, error: "Token không hợp lệ" };
    }

    const decoded = jwt.verify(
      actualToken,
      process.env.JWT_SECRET || "dev_secret"
    );

    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

/**
 * Middleware: Kiểm tra quyền truy cập theo vai trò RBAC
 * @param {Array} allowedRoles - Danh sách vai trò được phép (e.g., ['Admin', 'QL_SanPham'])
 */
export async function requireAuth(req, allowedRoles = []) {
  const token = req.headers.authorization || req.headers.Authorization;

  const { valid, decoded, error } = verifyToken(token);

  if (!valid) {
    return {
      authorized: false,
      status: 401,
      message: "Vui lòng đăng nhập để tiếp tục",
      error,
    };
  }

  // Lấy thông tin user từ database để verify role
  const pool = getPool();
  try {
    const [users] = await pool.execute(
      `SELECT id, ten_dang_nhap, email, dang_hoat_dong 
       FROM nguoi_dung 
       WHERE id = ? LIMIT 1`,
      [decoded.uid]
    );

    if (!users || users.length === 0) {
      return {
        authorized: false,
        status: 401,
        message: "Tài khoản không tồn tại",
      };
    }

    const user = users[0];

    // Kiểm tra tài khoản có active không
    if (!user.dang_hoat_dong) {
      return {
        authorized: false,
        status: 403,
        message: "Tài khoản đã bị khóa",
      };
    }

    // Lấy vai trò từ RBAC
    const [roleRows] = await pool.execute(
      `SELECT vt.ten, vt.mo_ta
       FROM nguoi_dung_vai_tro nvt
       JOIN vai_tro vt ON vt.id = nvt.vai_tro_id
       WHERE nvt.nguoi_dung_id = ?`,
      [user.id]
    );

    const userRoles = roleRows.length > 0 
      ? roleRows.map(r => r.ten) 
      : ['Customer'];

    // Kiểm tra quyền truy cập
    if (allowedRoles.length > 0) {
      const hasPermission = allowedRoles.some(role => userRoles.includes(role));
      
      if (!hasPermission) {
        return {
          authorized: false,
          status: 403,
          message: "Bạn không có quyền truy cập chức năng này",
        };
      }
    }

    return {
      authorized: true,
      user: {
        id: user.id,
        username: user.ten_dang_nhap,
        email: user.email,
        roles: userRoles,
      },
    };
  } catch (dbErr) {
    console.error("[requireAuth] DB error:", dbErr);
    return {
      authorized: false,
      status: 500,
      message: "Lỗi xác thực. Vui lòng thử lại",
    };
  }
}

/**
 * Helper: Wrapper cho API handlers với phân quyền
 */
export function withAuth(handler, allowedRoles = []) {
  return async (req, res) => {
    const authResult = await requireAuth(req, allowedRoles);

    if (!authResult.authorized) {
      return res.status(authResult.status).json({
        success: false,
        message: authResult.message,
      });
    }

    // Gắn user info vào request để handler sử dụng
    req.user = authResult.user;

    return handler(req, res);
  };
}

/**
 * Helper: Kiểm tra user có vai trò cụ thể không
 */
export function hasRole(userRoles, requiredRole) {
  if (!Array.isArray(userRoles)) return false;
  return userRoles.includes(requiredRole);
}

/**
 * Helper: Kiểm tra user có ít nhất một trong các vai trò không
 */
export function hasAnyRole(userRoles, requiredRoles) {
  if (!Array.isArray(userRoles) || !Array.isArray(requiredRoles)) return false;
  return requiredRoles.some(role => userRoles.includes(role));
}
