// src/pages/api/auth/login.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getPool } from "@/lib/database/db";

function signAppToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d", issuer: "beauty-shop" }
  );
}

// Chuẩn hoá tên role để map route
function normalizeRole(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "");
}

function resolveRedirect(roleName) {
  const norm = normalizeRole(roleName || "Customer");
  if (norm === "admin") return "/NoiBo/Admin";
  if (["warehouse","warehous","qlkho","ql_kho"].includes(norm)) return "/NoiBo/QLKho";
  if (["product","qlsanpham","ql_sanpham","sales","qlbh","staff","qlkhachhang","ql_khachhang"].includes(norm)) {
    return "/NoiBo/QLBH";
  }
  return "/";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập tên đăng nhập và mật khẩu" });
    }

    const pool = getPool();

    // 1) Tìm user (active)
    const [users] = await pool.execute(
      `SELECT id, ten_dang_nhap, email, ten_hien_thi, ho, ten, anh_dai_dien,
              mat_khau_hash, dang_hoat_dong, thoi_gian_tao
         FROM nguoi_dung 
        WHERE ten_dang_nhap = ? AND dang_hoat_dong = 1
        LIMIT 1`,
      [username]
    );
    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, message: "Tên đăng nhập hoặc mật khẩu không chính xác" });
    }
    const user = users[0];

    // 2) Verify password
    if (!user.mat_khau_hash) {
      return res.status(401).json({ success: false, message: "Tài khoản này chưa thiết lập mật khẩu. Vui lòng đăng nhập bằng Google" });
    }
    const ok = await bcrypt.compare(password, user.mat_khau_hash);
    if (!ok) {
      return res.status(401).json({ success: false, message: "Tên đăng nhập hoặc mật khẩu không chính xác" });
    }

    // 3) Lấy vai_tro duy nhất (từ VIEW hoặc JOIN 1 record)
    // Cách A (đọc từ VIEW):
    const [r1] = await pool.execute(
      `SELECT vai_tro FROM v_nguoi_dung WHERE id = ? LIMIT 1`,
      [user.id]
    );
    let primaryRole = r1?.[0]?.vai_tro || "Customer";

    // (Tuỳ chọn) Cách B (JOIN trực tiếp 1 role):
    // const [r1] = await pool.execute(
    //   `SELECT v.ten AS vai_tro
    //      FROM nguoi_dung_vai_tro nvt
    //      JOIN vai_tro v ON v.id = nvt.vai_tro_id
    //     WHERE nvt.nguoi_dung_id = ?
    //     LIMIT 1`,
    //   [user.id]
    // );
    // let primaryRole = r1?.[0]?.vai_tro || "Customer";

    const roles = [primaryRole]; // mảng 1 phần tử cho FE cũ

    const redirectPath = resolveRedirect(primaryRole);

    // 4) JWT
    const token = signAppToken({
      uid: user.id,
      email: user.email,
      roles,
      primaryRole,
      username: user.ten_dang_nhap,
      provider: "password",
    });

    // 5) Payload trả FE
    const userData = {
      id: user.id,
      username: user.ten_dang_nhap,
      email: user.email,
      displayName: user.ten_hien_thi || user.ten_dang_nhap,
      firstName: user.ho,
      lastName: user.ten,
      avatar: user.anh_dai_dien || "/images/default-avatar.png",
      roles,
      primaryRole,
      role: primaryRole,     // alias
      vai_tro: primaryRole,  // alias
      createdAt: user.thoi_gian_tao,
    };

    // 6) Audit (không chặn login nếu lỗi)
    try {
      await pool.execute(
        `INSERT INTO nhat_ky_hoat_dong (bang, ban_ghi_id, hanh_dong, du_lieu_moi, thuc_hien_boi) 
         VALUES (?, ?, ?, ?, ?)`,
        ['nguoi_dung', user.id, 'CREATE', JSON.stringify({ action: 'LOGIN', method: 'password', role: primaryRole }), user.id]
      );
    } catch {}

    return res.status(200).json({
      success: true,
      token,
      user: userData,
      redirect: redirectPath,
      message: "Đăng nhập thành công",
    });

  } catch (err) {
    console.error("[/api/auth/login] error:", err);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống. Vui lòng thử lại sau" });
  }
}
