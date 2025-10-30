import { verifyGoogleToken } from "@/lib/auth/googleVerify";
import { findCustomerByEmail, createCustomerFromGoogle } from "@/lib/auth/userRepo";
import { signAppToken } from "@/lib/auth/jwt";

/**
 * POST /api/auth/google
 * body: { token: <google_id_token> }
 * Trả về:
 * { token: <jwt>, user: { id, name, email, phone, picture }, isNewUser: bool }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 1. Parse body
    const { token } = req.body || {};
    if (!token) {
      return res.status(400).json({ error: "Missing Google token" });
    }

    // 2. Verify token với Google
    const googleUser = await verifyGoogleToken(token);
    if (!googleUser.email_verified) {
      return res.status(401).json({ error: "Email Google chưa xác thực" });
    }

    // googleUser = { email, name, picture, sub, email_verified }

    // 3. Tìm user trong DB
    let dbUser = await findCustomerByEmail(googleUser.email);
    let isNewUser = false;

    if (!dbUser) {
      // 3b. Nếu chưa có -> tạo mới
      dbUser = await createCustomerFromGoogle({
        name: googleUser.name,
        email: googleUser.email,
      });
      isNewUser = true;
    }

    // dbUser = { MaKH, HoVaTen, DienThoai, Email, ... }

    if (!dbUser) {
      // fallback defensive
      return res.status(500).json({ error: "Không thể tạo/tải user" });
    }

    // 4. Tạo JWT app của bạn (FE sẽ lưu localStorage)
    // payload gọn: chỉ đưa info cần để nhận diện
    const appJwt = signAppToken({
      userId: dbUser.MaKH,
      email: dbUser.Email,
      name: dbUser.HoVaTen,
    });

    // 5. Chuẩn hoá user trả về FE
    const userResponse = {
      id: dbUser.MaKH,
      name: dbUser.HoVaTen,
      email: dbUser.Email,
      phone: dbUser.DienThoai || null,
      picture: googleUser.picture || null,
    };

    return res.status(200).json({
      token: appJwt,
      user: userResponse,
      isNewUser,
    });
  } catch (err) {
    console.error("auth/google error:", err);
    return res.status(500).json({ error: err.message || "Auth failed" });
  }
}
