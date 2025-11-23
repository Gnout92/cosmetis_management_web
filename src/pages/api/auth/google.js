// pages/api/auth/google.js
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { getPool, withTransaction } from "../../../lib/database/db";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
  const p = ticket.getPayload();
  return {
    sub: p.sub,
    email: p.email,
    emailVerified: p.email_verified,
    name: p.name,
    givenName: p.given_name,
    familyName: p.family_name,
    picture: p.picture,
  };
}

function signAppToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || "super_secret_change_me",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d", issuer: "beauty-shop" }
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const { token: idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ message: "Thiếu Google token" });

    const profile = await verifyGoogleToken(idToken);
    if (!profile.email || !profile.emailVerified) {
      return res.status(401).json({ message: "Email Google chưa xác thực" });
    }

    const result = await withTransaction(async (conn) => {
      // 0) Lấy role_id của 'Customer' để gán mặc định
      const [rRole] = await conn.execute(
        "SELECT id FROM vai_tro WHERE ten='Customer' LIMIT 1"
      );
      if (!rRole.length) throw new Error("Thiếu role 'Customer' trong bảng vai_tro");
      const customerRoleId = rRole[0].id;

      // 1) Tìm theo liên kết google
      const [lk] = await conn.execute(
        "SELECT nguoi_dung_id FROM lien_ket_dang_nhap WHERE nha_cung_cap='google' AND ma_nguoi_dung_ncc=? LIMIT 1",
        [profile.sub]
      );

      let userId, isNewUser = false;

      // Đảm bảo luôn có tên hiển thị
      const displayName = profile.name || profile.givenName || profile.email?.split('@')[0] || 'User';
      const firstName = profile.familyName || '';
      const lastName = profile.givenName || '';

      if (lk.length) {
        userId = lk[0].nguoi_dung_id;
        // Cập nhật thông tin cơ bản từ Google
        await conn.execute(
          "UPDATE nguoi_dung SET email=?, ten_hien_thi=?, ho=?, ten=?, anh_dai_dien=? WHERE id=?",
          [profile.email, displayName, firstName, lastName, profile.picture || null, userId]
        );
      } else {
        // 2) Nếu chưa có link, tìm theo email
        const [u] = await conn.execute(
          "SELECT id FROM nguoi_dung WHERE email_thuong=LOWER(?) LIMIT 1",
          [profile.email]
        );

        if (u.length) {
          userId = u[0].id;
          // Cập nhật tên/ảnh
          await conn.execute(
            "UPDATE nguoi_dung SET anh_dai_dien=?, ten_hien_thi=?, ho=?, ten=? WHERE id=?",
            [profile.picture || null, displayName, firstName, lastName, userId]
          );
        } else {
          // 3) Tạo user mới (KHÔNG set cột vai_tro vì đã bỏ)
          const [ins] = await conn.execute(
            "INSERT INTO nguoi_dung (email, ten_hien_thi, ho, ten, anh_dai_dien) VALUES (?, ?, ?, ?, ?)",
            [profile.email, displayName, firstName, lastName, profile.picture || null]
          );
          userId = ins.insertId;
          isNewUser = true;
        }

        // 4) Gắn link google (idempotent)
        await conn.execute(
          "INSERT IGNORE INTO lien_ket_dang_nhap (nguoi_dung_id, nha_cung_cap, ma_nguoi_dung_ncc, email_tai_ncc, anh_tai_ncc) VALUES (?, 'google', ?, ?, ?)",
          [userId, profile.sub, profile.email, profile.picture || null]
        );
      }

      // 5) Đảm bảo user luôn có 1 role duy nhất: Customer (idempotent)
      await conn.execute(
        "INSERT IGNORE INTO nguoi_dung_vai_tro (nguoi_dung_id, vai_tro_id) VALUES (?, ?)",
        [userId, customerRoleId]
      );

      // 6) Lấy user + role để trả về FE (JOIN, không đọc cột vai_tro ở nguoi_dung)
      const [rows] = await conn.execute(
        `SELECT 
           u.id, u.email, u.ten_hien_thi, u.ho, u.ten, u.anh_dai_dien, u.thoi_gian_tao,
           v.ten AS vai_tro
         FROM nguoi_dung u
         LEFT JOIN nguoi_dung_vai_tro nvt ON nvt.nguoi_dung_id = u.id
         LEFT JOIN vai_tro v ON v.id = nvt.vai_tro_id
         WHERE u.id = ?
         LIMIT 1`,
        [userId]
      );

      return { user: rows[0], isNewUser };
    });

    const roleName = result.user?.vai_tro || "Customer"; // fallback an toàn
    const appToken = signAppToken({
      uid: result.user.id,
      email: result.user.email,
      roles: [roleName],
      primaryRole: roleName,
      provider: "google",
    });

    // Chuẩn hoá payload trả về giống /login
    const userPayload = {
      id: result.user.id,
      email: result.user.email,
      displayName: result.user.ten_hien_thi || result.user.email,
      firstName: result.user.ho,
      lastName: result.user.ten,
      avatar: result.user.anh_dai_dien || "/images/default-avatar.png",
      createdAt: result.user.thoi_gian_tao,
      roles: [roleName],
      primaryRole: roleName,
      role: roleName,
      vai_tro: roleName,
      username: result.user.email, // Google không có username -> tạm gán email
    };

    return res.status(200).json({
      token: appToken,
      user: userPayload,
      isNewUser: result.isNewUser
    });

  } catch (err) {
    console.error("[/api/auth/google] error:", err);
    const msg = typeof err?.message === "string" ? err.message : "Không thể đăng nhập bằng Google";
    return res.status(400).json({ message: msg });
  }
}
