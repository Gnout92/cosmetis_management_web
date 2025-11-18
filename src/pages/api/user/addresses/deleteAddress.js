// API endpoint để xóa địa chỉ
// File: src/pages/api/user/addresses/deleteAddress.js

const mysql = require('mysql2/promise');

export default async function handler(req, res) {
  // Chỉ cho phép DELETE request
  if (req.method !== 'DELETE') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method không được phép' 
    });
  }

  try {
    // Kiểm tra token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token xác thực không hợp lệ' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Token parsing
    let userId = null;
    const parsingStrategies = [
      {
        test: (t) => t && t.includes('.'),
        extract: (t) => {
          const parts = t.split('.');
          return parts.length > 1 && parts[1] ? parseInt(parts[1]) : null;
        }
      },
      {
        test: (t) => /^[0-9]+$/.test(t),
        extract: (t) => parseInt(t)
      },
      {
        test: (t) => true,
        extract: (t) => {
          const match = t.match(/[0-9]+/);
          return match ? parseInt(match[0]) : null;
        }
      }
    ];

    for (let strategy of parsingStrategies) {
      if (!userId && strategy.test(token)) {
        const extracted = strategy.extract(token);
        if (extracted && !isNaN(extracted) && extracted > 0) {
          userId = extracted;
          break;
        }
      }
    }
    
    if (!userId) {
      userId = 1;
    }

    // Lấy ID từ query hoặc body
    const addressId = req.query.id || req.body.id;

    if (!addressId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu ID địa chỉ' 
      });
    }

    let connection;
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'myphamshop',
        charset: 'utf8mb4'
      });

      await connection.beginTransaction();

      // Kiểm tra địa chỉ có thuộc về user không
      const [existing] = await connection.execute(
        'SELECT id, mac_dinh FROM dia_chi WHERE id = ? AND nguoi_dung_id = ?',
        [addressId, userId]
      );

      if (existing.length === 0) {
        await connection.rollback();
        await connection.end();
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy địa chỉ' 
        });
      }

      const wasDefault = existing[0].mac_dinh === 1;

      // Xóa địa chỉ
      await connection.execute(
        'DELETE FROM dia_chi WHERE id = ? AND nguoi_dung_id = ?',
        [addressId, userId]
      );

      // Nếu địa chỉ vừa xóa là mặc định, đặt địa chỉ đầu tiên làm mặc định
      if (wasDefault) {
        await connection.execute(
          `UPDATE dia_chi 
           SET mac_dinh = 1 
           WHERE nguoi_dung_id = ? 
           ORDER BY thoi_gian_tao ASC 
           LIMIT 1`,
          [userId]
        );
      }

      await connection.commit();
      await connection.end();

      res.status(200).json({
        success: true,
        message: 'Xóa địa chỉ thành công!'
      });

    } catch (dbError) {
      if (connection) {
        await connection.rollback();
        await connection.end();
      }
      console.error('Database error:', dbError);
      throw new Error('Không thể xóa địa chỉ');
    }

  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Lỗi server khi xóa địa chỉ'
    });
  }
}
