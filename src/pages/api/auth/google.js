import { verifyGoogleToken } from "../../../lib/auth/googleVerify";
import { signAppToken } from "../../../lib/auth/jwt";
import { getPool } from "../../../lib/database/db";

/**
 * Body FE gửi: { token: "<google id_token>" }
 * Trả về:
 * {
 *   token: "<jwt của shop>",
 *   user: { id, name, email, avatar },
 *   isNewUser: boolean
 * }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { token: googleIdToken } = req.body || {};
    if (!googleIdToken) {
      return res.status(400).json({ message: "Missing Google token" });
    }

    // 1. Xác thực token Google
    const googleProfile = await verifyGoogleToken(googleIdToken);

    if (!googleProfile.email || !googleProfile.emailVerified) {
      return res
        .status(401)
        .json({ message: "Google account has no verified email" });
    }

    const pool = getPool();

    // 2. Kiểm tra user trong bảng khachhang
    const [rows] = await pool.query(
      "SELECT MaKH, HoVaTen, Email FROM khachhang WHERE Email = ? LIMIT 1",
      [googleProfile.email]
    );

    let userId;
    let isNewUser = false;

    if (rows.length === 0) {
      // 2a. Nếu chưa tồn tại -> tạo mới
      const [insertResult] = await pool.query(
        `INSERT INTO khachhang (HoVaTen, DienThoai, Email, MatKhau, NgayTao, NgayCapNhat)
         VALUES (?, ?, ?, NULL, NOW(), NOW())`,
        [
          googleProfile.name || "Khách hàng",
          null, // DienThoai chưa có
          googleProfile.email,
        ]
      );
      userId = insertResult.insertId;
      isNewUser = true;
    } else {
      // 2b. Nếu đã có, dùng lại
      userId = rows[0].MaKH;
    }

    // 3. Build object user FE sẽ lưu
    const userObj = {
      id: userId,
      name: googleProfile.name,
      email: googleProfile.email,
      avatar: googleProfile.picture || "/default-avatar.png",
      provider: "google",
    };

    // 4. Ký JWT nội bộ để FE dùng cho các request cần auth sau này
    const appToken = signAppToken({
      id: userObj.id,
      email: userObj.email,
      provider: "google",
      role: "customer", // sau này có thể gắn quyền Admin/NhanVien nếu cần
    });

    // 5. Trả kết quả
    return res.status(200).json({
      token: appToken,
      user: userObj,
      isNewUser,
    });
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({
      message: "Không thể đăng nhập bằng Google",
      detail: err.message,
    });
  }
}
