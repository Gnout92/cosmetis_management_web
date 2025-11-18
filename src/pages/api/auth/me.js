// src/pages/api/auth/me.js
import jwt from "jsonwebtoken";
import { getPool } from "../../../lib/database/db";

/**
 * API: Lấy thông tin user hiện tại
 * 
 * Flow:
 * 1. Verify JWT token từ Authorization header hoặc cookie
 * 2. Lấy thông tin chi tiết từ database
 * 3. Trả về thông tin user + địa chỉ (nếu có)
 */

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
  } catch (err) {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Lấy token từ header hoặc cookie
    let token = null;
    
    // Thử lấy từ Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
    
    // Nếu không có trong header, thử lấy từ cookie
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized - No token provided" 
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.uid) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized - Invalid token" 
      });
    }

    const pool = getPool();

    // Lấy thông tin user từ database
    const [users] = await pool.execute(
      `SELECT 
        id,
        ten_dang_nhap,
        email,
        ten_hien_thi,
        ho,
        ten,
        anh_dai_dien,
        vai_tro,
        ngay_sinh,
        gioi_tinh,
        dang_hoat_dong,
        thoi_gian_tao,
        thoi_gian_cap_nhat
      FROM nguoi_dung 
      WHERE id = ? AND dang_hoat_dong = 1
      LIMIT 1`,
      [decoded.uid]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "User not found or inactive" 
      });
    }

    const user = users[0];

    // Tạo object user trả về
    // CHỈ LẤY THÔNG TIN TỪ BẢNG nguoi_dung
    // Ưu tiên hiển thị: ten_hien_thi (Gmail name) > ho + ten > ten_dang_nhap > email
    const fullName = user.ten_hien_thi || 
                     (user.ho && user.ten ? `${user.ho} ${user.ten}`.trim() : null) ||
                     user.ten_dang_nhap || 
                     user.email?.split('@')[0] || 
                     'User';
    
    const userData = {
      id: user.id,
      username: user.ten_dang_nhap || user.email?.split('@')[0] || '',
      email: user.email || '',
      displayName: fullName,
      firstName: user.ho || '',
      lastName: user.ten || '',
      avatar: user.anh_dai_dien || "/images/default-avatar.png",
      role: user.vai_tro || "Customer",
      birthDate: user.ngay_sinh || null,
      gender: user.gioi_tinh || null,
      isActive: user.dang_hoat_dong || 0,
      createdAt: user.thoi_gian_tao || null,
      updatedAt: user.thoi_gian_cap_nhat || null,
    };

    return res.status(200).json({ 
      success: true,
      user: userData 
    });

  } catch (err) {
    console.error("[/api/auth/me] error:", err);
    const msg = typeof err?.message === "string" ? err.message : "Internal server error";
    return res.status(500).json({ 
      success: false,
      message: msg 
    });
  }
}
