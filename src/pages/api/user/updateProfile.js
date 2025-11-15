// API endpoint để cập nhật thông tin profile người dùng
// File: /api/auth/update-profile.js hoặc backend route tương ứng

const mysql = require('mysql2/promise');

export default async function handler(req, res) {
  // Chỉ cho phép PUT request
  if (req.method !== 'PUT') {
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

    // Lấy dữ liệu từ request body
    const { ten_hien_thi, so_dien_thoai } = req.body;

    // Validation
    if (!ten_hien_thi || typeof ten_hien_thi !== 'string' || ten_hien_thi.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tên hiển thị không được để trống' 
      });
    }

    if (ten_hien_thi.length > 200) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tên hiển thị không được vượt quá 200 ký tự' 
      });
    }

    if (so_dien_thoai && so_dien_thoai.length > 20) {
      return res.status(400).json({ 
        success: false, 
        message: 'Số điện thoại không được vượt quá 20 ký tự' 
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

    // Kiểm tra user có tồn tại và hoạt động không
    const [existingUser] = await connection.execute(
      'SELECT id FROM nguoi_dung WHERE id = ? AND dang_hoat_dong = 1',
      [userId]
    );

    if (existingUser.length === 0) {
      await connection.end();
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy thông tin người dùng' 
      });
    }

    // Cập nhật thông tin profile
    const updateFields = [];
    const updateValues = [];

    if (ten_hien_thi) {
      updateFields.push('ten_hien_thi = ?');
      updateValues.push(ten_hien_thi.trim());
    }

    if (so_dien_thoai !== undefined) {
      updateFields.push('so_dien_thoai = ?');
      updateValues.push(so_dien_thoai.trim());
    }

    if (updateFields.length === 0) {
      await connection.end();
      return res.status(400).json({ 
        success: false, 
        message: 'Không có thông tin nào để cập nhật' 
      });
    }

    updateValues.push(userId);

    const updateQuery = `
      UPDATE nguoi_dung 
      SET ${updateFields.join(', ')}, thoi_gian_cap_nhat = NOW()
      WHERE id = ?
    `;

    const [result] = await connection.execute(updateQuery, updateValues);

    await connection.end();

    // Kiểm tra xem có dòng nào được cập nhật không
    if (result.affectedRows === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Không có thông tin nào được cập nhật' 
      });
    }

    // Lấy thông tin đã cập nhật để trả về
    const connection2 = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'myphamshop',
      charset: 'utf8mb4'
    });

    const [updatedUser] = await connection2.execute(
      `SELECT 
         id,
         email,
         ten_dang_nhap,
         ten_hien_thi,
         so_dien_thoai
       FROM nguoi_dung 
       WHERE id = ?`,
      [userId]
    );

    await connection2.end();

    const userInfo = updatedUser[0];

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công!',
      data: {
        id: userInfo.id,
        email: userInfo.email,
        ten_hien_thi: userInfo.ten_hien_thi,
        ten_dang_nhap: userInfo.ten_dang_nhap,
        so_dien_thoai: userInfo.so_dien_thoai
      }
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server khi cập nhật thông tin profile' 
    });
  }
}