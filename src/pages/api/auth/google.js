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
    process.env.JWT_SECRET || "dev_secret",
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
      // Tìm theo liên kết google
      const [lk] = await conn.execute(
        "SELECT nguoi_dung_id FROM lien_ket_dang_nhap WHERE nha_cung_cap='google' AND ma_nguoi_dung_ncc=? LIMIT 1",
        [profile.sub]
      );

      let userId, isNewUser = false;
      
      // Đảm bảo luôn có tên hiển thị: Ưu tiên name > givenName > email
      const displayName = profile.name || profile.givenName || profile.email?.split('@')[0] || 'User';
      const firstName = profile.familyName || '';
      const lastName = profile.givenName || '';

      if (lk.length) {
        userId = lk[0].nguoi_dung_id;
        // Cập nhật thông tin từ Gmail, đảm bảo tên luôn có giá trị
        await conn.execute(
          "UPDATE nguoi_dung SET email=?, ten_hien_thi=?, ho=?, ten=?, anh_dai_dien=? WHERE id=?",
          [profile.email, displayName, firstName, lastName, profile.picture || null, userId]
        );
      } else {
        // Tìm theo email
        const [u] = await conn.execute(
          "SELECT id FROM nguoi_dung WHERE email_thuong=LOWER(?) LIMIT 1",
          [profile.email]
        );
        if (u.length) {
          userId = u[0].id;
          // Cập nhật ảnh đại diện và tên từ Gmail cho user hiện có
          await conn.execute(
            "UPDATE nguoi_dung SET anh_dai_dien=?, ten_hien_thi=?, ho=?, ten=? WHERE id=?",
            [profile.picture || null, displayName, firstName, lastName, userId]
          );
        } else {
          // Tạo user mới với:
          // - Ảnh đại diện = ảnh Gmail
          // - Tên hiển thị = tên Gmail (đảm bảo luôn có giá trị)
          // - Email = email Gmail
          // - Role mặc định = Customer
          const [ins] = await conn.execute(
            "INSERT INTO nguoi_dung (email, ten_hien_thi, ho, ten, anh_dai_dien, vai_tro) VALUES (?, ?, ?, ?, ?, 'Customer')",
            [profile.email, displayName, firstName, lastName, profile.picture || null]
          );
          userId = ins.insertId;
          isNewUser = true;
        }

        // Gắn link google (idempotent)
        await conn.execute(
          "INSERT IGNORE INTO lien_ket_dang_nhap (nguoi_dung_id, nha_cung_cap, ma_nguoi_dung_ncc, email_tai_ncc, anh_tai_ncc) VALUES (?, 'google', ?, ?, ?)",
          [userId, profile.sub, profile.email, profile.picture || null]
        );
      }

      const [userRows] = await conn.execute(
        "SELECT id, email, ten_hien_thi, ho, ten, anh_dai_dien, vai_tro, thoi_gian_tao FROM nguoi_dung WHERE id=?",
        [userId]
      );
      return { user: userRows[0], isNewUser };
    });

    const appToken = signAppToken({
      uid: result.user.id,
      email: result.user.email,
      role: result.user.vai_tro || "Customer",
      provider: "google",
    });

    return res.status(200).json({ token: appToken, user: result.user, isNewUser: result.isNewUser });
  } catch (err) {
    console.error("[/api/auth/google] error:", err);
    const msg = typeof err?.message === "string" ? err.message : "Không thể đăng nhập bằng Google";
    return res.status(400).json({ message: msg });
  }
}
