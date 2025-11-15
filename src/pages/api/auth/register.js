// pages/api/auth/register.js
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'vertrigo', // ⚠ đổi thành mật khẩu bạn dùng trong phpMyAdmin
  database: 'shop_my_pham',
  port: 3306
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { fullName, phone, email, password } = req.body;

    // Validate input data
    if (!fullName || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tất cả các trường đều bắt buộc'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email không hợp lệ'
      });
    }

    // Validate phone number format (bắt đầu bằng 0 và có 10 chữ số)
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    // Create database connection
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Check if email already exists
      const [existingUser] = await connection.execute(
        'SELECT Email FROM KhachHang WHERE Email = ?',
        [email]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email đã được sử dụng. Vui lòng chọn email khác.'
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert new customer (MaKH will be auto-generated)
      const [result] = await connection.execute(
        `INSERT INTO KhachHang (HoVaTen, DienThoai, Email, MatKhau, DiemTichLuy, NgayTao, TrangThai) 
         VALUES (?, ?, ?, ?, ?, NOW(), 1)`,
        [
          fullName,
          phone,
          email,
          hashedPassword,
          0 // Default points
        ]
      );

      // Get the generated customer ID
      const newCustomerId = result.insertId;

      // Return success response
      return res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: {
          customerId: newCustomerId,
          fullName,
          phone,
          email,
          registeredAt: new Date().toISOString()
        }
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Lỗi hệ thống. Vui lòng thử lại sau.'
      });
    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ. Vui lòng thử lại.'
    });
  }
}