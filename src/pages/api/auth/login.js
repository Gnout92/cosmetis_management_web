// src/pages/api/auth/login.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getPool } from "../../../lib/database/db";

/**
 * API: Đăng nhập bằng TÊN ĐĂNG NHẬP và MẬT KHẨU
 * Sử dụng hệ thống RBAC: bảng vai_tro
 * 
 * Flow:
 * 1. Nhận username và password từ client
 * 2. Tìm user trong database (nguoi_dung)
 * 3. Verify password với bcrypt
 * 4. Lấy vai trò từ bảng nguoi_dung_vai_tro JOIN vai_tro
 * 5. Tạo JWT token với roles
 * 6. Trả về thông tin user + roles để frontend redirect
 */

function signAppToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d", issuer: "beauty-shop" }
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { username, password } = req.body || {};

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Vui lòng nhập tên đăng nhập và mật khẩu" 
      });
    }

    const pool = getPool();

    // Tìm user trong database
    const [users] = await pool.execute(
      `SELECT 
        id,
        ten_dang_nhap,
        email,
        ten_hien_thi,
        ho,
        ten,
        anh_dai_dien,
        mat_khau_hash,
        dang_hoat_dong,
        thoi_gian_tao
      FROM nguoi_dung 
      WHERE ten_dang_nhap = ? AND dang_hoat_dong = 1
      LIMIT 1`,
      [username]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không chính xác" 
      });
    }

    const user = users[0];

    // Kiểm tra password
    if (!user.mat_khau_hash) {
      return res.status(401).json({ 
        success: false,
        message: "Tài khoản này chưa thiết lập mật khẩu. Vui lòng đăng nhập bằng Google" 
      });
    }

    const validPassword = await bcrypt.compare(password, user.mat_khau_hash);

    if (!validPassword) {
      return res.status(401).json({ 
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không chính xác" 
      });
    }

    // Lấy vai trò từ bảng RBAC
    const [roleRows] = await pool.execute(
      `SELECT vt.ten, vt.mo_ta
       FROM nguoi_dung_vai_tro nvt
       JOIN vai_tro vt ON vt.id = nvt.vai_tro_id
       WHERE nvt.nguoi_dung_id = ?`,
      [user.id]
    );

    // Nếu không có vai trò nào, mặc định là Customer
    const roles = roleRows.length > 0 
      ? roleRows.map(r => r.ten) 
      : ['Customer'];

    // Xác định vai trò chính (ưu tiên: Admin > QL_* > Customer)
    let primaryRole = 'Customer';
    let redirectPath = '/';

    if (roles.includes('Admin')) {
      primaryRole = 'Admin';
      redirectPath = '/NoiBo/Admin';
    } else if (roles.includes('QL_SanPham')) {
      primaryRole = 'QL_SanPham';
      redirectPath = '/NoiBo/QLSP';
    } else if (roles.includes('QL_Kho')) {
      primaryRole = 'QL_Kho';
      redirectPath = '/NoiBo/QLKho';
    } else if (roles.includes('QL_KhachHang')) {
      primaryRole = 'QL_KhachHang';
      redirectPath = '/NoiBo/QLKH';
    }

    // Tạo JWT token
    const appToken = signAppToken({
      uid: user.id,
      email: user.email,
      roles: roles,
      primaryRole: primaryRole,
      username: user.ten_dang_nhap,
      provider: "password",
    });

    // Tạo object user trả về
    const userData = {
      id: user.id,
      username: user.ten_dang_nhap,
      email: user.email,
      displayName: user.ten_hien_thi || user.ten_dang_nhap,
      firstName: user.ho,
      lastName: user.ten,
      avatar: user.anh_dai_dien || "/images/default-avatar.png",
      roles: roles,
      primaryRole: primaryRole,
      createdAt: user.thoi_gian_tao,
    };

    // Log đăng nhập (audit trail)
    try {
      await pool.execute(
        `INSERT INTO nhat_ky_hoat_dong (bang, ban_ghi_id, hanh_dong, du_lieu_moi, thuc_hien_boi) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          'nguoi_dung', 
          user.id, 
          'CREATE',
          JSON.stringify({ action: 'LOGIN', method: 'password', roles: roles }),
          user.id
        ]
      );
    } catch (logErr) {
      console.error('Failed to log activity:', logErr);
      // Không throw error vì không ảnh hưởng đến login
    }

    return res.status(200).json({ 
      success: true,
      token: appToken, 
      user: userData,
      redirect: redirectPath,
      message: "Đăng nhập thành công"
    });

  } catch (err) {
    console.error("[/api/auth/login] error:", err);
    const msg = typeof err?.message === "string" ? err.message : "Lỗi hệ thống. Vui lòng thử lại sau";
    return res.status(500).json({ 
      success: false,
      message: msg 
    });
  }
}
