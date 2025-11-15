// API endpoint để lấy thông tin profile người dùng
// File: /api/auth/profile.js hoặc backend route tương ứng

const mysql = require('mysql2/promise');

export default async function handler(req, res) {
  // Chỉ cho phép GET request
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method không được phép' 
    });
  }

  try {
    // Kiểm tra token xác thực từ header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token xác thực không hợp lệ' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Giải mã token để lấy user ID (đây là ví dụ đơn giản)
    // Trong thực tế, bạn cần verify JWT token properly
    const userId = parseInt(token.split('.')[1]) || null;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token không hợp lệ' 
      });
    }

    // Kết nối database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'myphamshop',
      charset: 'utf8mb4'
    });

    // Truy vấn thông tin người dùng
    const [rows] = await connection.execute(
      `SELECT 
         id,
         email,
         ten_dang_nhap,
         ten_hien_thi,
         so_dien_thoai
       FROM nguoi_dung 
       WHERE id = ? AND dang_hoat_dong = 1`,
      [userId]
    );

    await connection.end();

    // Kiểm tra user có tồn tại không
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy thông tin người dùng' 
      });
    }

    const userInfo = rows[0];
    
    // Trả về thông tin user
    res.status(200).json({
      success: true,
      data: {
        id: userInfo.id,
        email: userInfo.email,
        ten_hien_thi: userInfo.ten_hien_thi || userInfo.ten_dang_nhap || '',
        ten_dang_nhap: userInfo.ten_dang_nhap || '',
        so_dien_thoai: userInfo.so_dien_thoai || ''
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server khi lấy thông tin profile' 
    });
  }
}