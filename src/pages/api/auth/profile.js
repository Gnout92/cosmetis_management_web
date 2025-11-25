// src/pages/api/auth/profile.js
import { withAuth } from "@/lib/middleware/auth";
import { getPool } from "@/lib/database/db";
import { getUserRole } from "@/lib/auth/userRepo";

async function handler(req, res) {
  const userId = req.user.id;

  try {
    const pool = getPool();
    
    // Lấy thông tin user từ database
    const [users] = await pool.execute(
      `SELECT id, ten_dang_nhap, email, ten_hien_thi, ho, ten, anh_dai_dien,
              thoi_gian_tao
         FROM nguoi_dung 
        WHERE id = ? AND dang_hoat_dong = 1
        LIMIT 1`,
      [userId]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "User không tồn tại" 
      });
    }

    const user = users[0];
    
    // Lấy role từ userRepo
    const primaryRole = await getUserRole(userId);

    // Trả về thông tin profile
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.ten_dang_nhap,
        email: user.email,
        displayName: user.ten_hien_thi || user.ten_dang_nhap,
        firstName: user.ho,
        lastName: user.ten,
        avatar: user.anh_dai_dien || "/images/default-avatar.png",
        primaryRole,
        role: primaryRole,
        vai_tro: primaryRole,
        createdAt: user.thoi_gian_tao,
      }
    });

  } catch (err) {
    console.error("[/api/auth/profile] error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Lỗi server" 
    });
  }
}

export default withAuth(handler);