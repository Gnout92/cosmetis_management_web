// API endpoint để cập nhật địa chỉ
// File: src/pages/api/user/addresses/updateAddress.js

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

    // Lấy dữ liệu từ request
    const {
      id,
      ten_nguoi_nhan,
      so_dien_thoai,
      dia_chi_cu_the,
      phuong_xa,
      quan_huyen,
      tinh_thanh_pho,
      loai,
      mac_dinh
    } = req.body;

    // Validation
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu ID địa chỉ' 
      });
    }

    if (!ten_nguoi_nhan || !dia_chi_cu_the || !phuong_xa || !quan_huyen || !tinh_thanh_pho) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin địa chỉ' 
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
        'SELECT id FROM dia_chi WHERE id = ? AND nguoi_dung_id = ?',
        [id, userId]
      );

      if (existing.length === 0) {
        await connection.rollback();
        await connection.end();
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy địa chỉ' 
        });
      }

      // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
      if (mac_dinh) {
        await connection.execute(
          'UPDATE dia_chi SET mac_dinh = 0 WHERE nguoi_dung_id = ?',
          [userId]
        );
      }

      // Cập nhật địa chỉ
      await connection.execute(
        `UPDATE dia_chi SET
          ten_nguoi_nhan = ?,
          so_dien_thoai = ?,
          dia_chi_cu_the = ?,
          phuong_xa = ?,
          quan_huyen = ?,
          tinh_thanh_pho = ?,
          loai = ?,
          mac_dinh = ?,
          thoi_gian_cap_nhat = NOW()
         WHERE id = ? AND nguoi_dung_id = ?`,
        [
          ten_nguoi_nhan,
          so_dien_thoai || '',
          dia_chi_cu_the,
          phuong_xa,
          quan_huyen,
          tinh_thanh_pho,
          loai || 'Shipping',
          mac_dinh ? 1 : 0,
          id,
          userId
        ]
      );

      await connection.commit();

      // Lấy địa chỉ đã cập nhật
      const [updated] = await connection.execute(
        'SELECT * FROM dia_chi WHERE id = ?',
        [id]
      );

      await connection.end();

      res.status(200).json({
        success: true,
        message: 'Cập nhật địa chỉ thành công!',
        data: {
          id: updated[0].id,
          ten_nguoi_nhan: updated[0].ten_nguoi_nhan,
          so_dien_thoai: updated[0].so_dien_thoai,
          dia_chi_cu_the: updated[0].dia_chi_cu_the,
          phuong_xa: updated[0].phuong_xa,
          quan_huyen: updated[0].quan_huyen,
          tinh_thanh_pho: updated[0].tinh_thanh_pho,
          loai: updated[0].loai,
          mac_dinh: updated[0].mac_dinh === 1
        }
      });

    } catch (dbError) {
      if (connection) {
        await connection.rollback();
        await connection.end();
      }
      console.error('Database error:', dbError);
      throw new Error('Không thể cập nhật địa chỉ');
    }

  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Lỗi server khi cập nhật địa chỉ'
    });
  }
}
