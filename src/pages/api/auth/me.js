// src/pages/api/auth/me.js
import jwt from "jsonwebtoken";
import { getPool } from "@/lib/database/db"; // dùng cùng module với login/google

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_change_me";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ success: false, message: "Method Not Allowed" });

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.slice(7);
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET); // phải trùng secret
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  const uid = decoded?.uid;
  if (!uid) return res.status(401).json({ success: false, message: "Invalid token payload" });

  try {
    const pool = getPool();
    // Lấy từ VIEW đã có cột vai_tro (đã tạo trước đó)
    const [rows] = await pool.execute(
      `SELECT 
         id,
         email,
         ten_dang_nhap AS username,
         ten_hien_thi AS displayName,
         ho AS firstName,
         ten AS lastName,
         anh_dai_dien AS avatar,
         ngay_sinh AS birthDate,
         gioi_tinh AS gender,
         vai_tro AS role,
         thoi_gian_tao AS createdAt
       FROM v_nguoi_dung
       WHERE id = ?
       LIMIT 1`,
      [uid]
    );

    if (!rows.length) return res.status(404).json({ success: false, message: "User not found" });

    const u = rows[0];
    // đồng bộ alias cho FE cũ
    return res.status(200).json({
      success: true,
      user: {
        ...u,
        roles: [u.role || "Customer"],
        primaryRole: u.role || "Customer",
        vai_tro: u.role || "Customer",
      },
    });
  } catch (e) {
    console.error("[/api/auth/me] error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
