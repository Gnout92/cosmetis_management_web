// src/pages/api/user/addresses.js
import jwt from 'jsonwebtoken';
import { getPool } from '@/lib/database/pool';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_change_me';

/**
 * GET    /api/user/addresses - Lấy danh sách địa chỉ
 * POST   /api/user/addresses - Tạo địa chỉ mới
 * PUT    /api/user/addresses - Cập nhật địa chỉ
 * DELETE /api/user/addresses - Xóa địa chỉ
 */
export default async function handler(req, res) {
  // Verify JWT token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const userId = decoded.uid;
  const pool = getPool();
  let conn;

  try {
    conn = await pool.getConnection();

    // GET - Lấy danh sách địa chỉ
    if (req.method === 'GET') {
      const [rows] = await conn.execute(
        `SELECT 
          dc.id,
          dc.loai as type,
          dc.mac_dinh as isDefault,
          dc.ten_nguoi_nhan as name,
          dc.so_dien_thoai as phone,
          dc.dia_chi_chi_tiet as addressLine,
          dc.duong as street,
          dc.phuong_xa_id as wardId,
          px.ten as wardName,
          dc.quan_huyen_id as districtId,
          qh.ten as districtName,
          dc.tinh_thanh_id as provinceId,
          tt.ten as provinceName
        FROM dia_chi dc
        LEFT JOIN phuong_xa px ON dc.phuong_xa_id = px.id
        LEFT JOIN quan_huyen qh ON dc.quan_huyen_id = qh.id
        LEFT JOIN tinh_thanh tt ON dc.tinh_thanh_id = tt.id
        WHERE dc.nguoi_dung_id = ?
        ORDER BY dc.mac_dinh DESC, dc.id ASC`,
        [userId]
      );

      return res.status(200).json({ addresses: rows });
    }

    // POST - Tạo địa chỉ mới
    if (req.method === 'POST') {
      const {
        type = 'Shipping',
        isDefault = false,
        name,
        phone,
        addressLine,
        street,
        wardId,
        districtId,
        provinceId
      } = req.body;

      // Validate required fields
      if (!name || !phone || !addressLine || !street) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await conn.beginTransaction();

      try {
        // Nếu set làm mặc định, bỏ mặc định của các địa chỉ khác
        if (isDefault) {
          await conn.execute(
            `UPDATE dia_chi SET mac_dinh = 0 WHERE nguoi_dung_id = ? AND loai = ?`,
            [userId, type]
          );
        }

        // Lấy tên địa giới từ IDs
        let wardName = null, districtName = null, provinceName = null;
        
        if (wardId) {
          const [ward] = await conn.execute('SELECT ten FROM phuong_xa WHERE id = ?', [wardId]);
          wardName = ward[0]?.ten || null;
        }
        if (districtId) {
          const [district] = await conn.execute('SELECT ten FROM quan_huyen WHERE id = ?', [districtId]);
          districtName = district[0]?.ten || null;
        }
        if (provinceId) {
          const [province] = await conn.execute('SELECT ten FROM tinh_thanh WHERE id = ?', [provinceId]);
          provinceName = province[0]?.ten || null;
        }

        // Insert địa chỉ mới
        const [result] = await conn.execute(
          `INSERT INTO dia_chi (
            nguoi_dung_id, loai, mac_dinh, ten_nguoi_nhan, so_dien_thoai,
            dia_chi_chi_tiet, duong, phuong_xa_id, quan_huyen_id, tinh_thanh_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
          [userId, type, isDefault ? 1 : 0, name, phone, addressLine, street, wardId, districtId, provinceId]
        );

        await conn.commit();

        return res.status(201).json({
          message: 'Address created successfully',
          addressId: result.insertId
        });

      } catch (error) {
        await conn.rollback();
        throw error;
      }
    }

    // PUT - Cập nhật địa chỉ
    if (req.method === 'PUT') {
      const {
        addressId,
        type,
        isDefault,
        name,
        phone,
        addressLine,
        street,
        wardId,
        districtId,
        provinceId
      } = req.body;

      if (!addressId) {
        return res.status(400).json({ error: 'addressId is required' });
      }

      // Kiểm tra ownership
      const [checkRows] = await conn.execute(
        'SELECT id FROM dia_chi WHERE id = ? AND nguoi_dung_id = ?',
        [addressId, userId]
      );

      if (checkRows.length === 0) {
        return res.status(404).json({ error: 'Address not found' });
      }

      await conn.beginTransaction();

      try {
        // Nếu set làm mặc định, bỏ mặc định của các địa chỉ khác
        if (isDefault) {
          await conn.execute(
            `UPDATE dia_chi SET mac_dinh = 0 WHERE nguoi_dung_id = ? AND loai = ? AND id != ?`,
            [userId, type || 'Shipping', addressId]
          );
        }

        const updateFields = [];
        const updateValues = [];

        if (type !== undefined) {
          updateFields.push('loai = ?');
          updateValues.push(type);
        }
        if (isDefault !== undefined) {
          updateFields.push('mac_dinh = ?');
          updateValues.push(isDefault ? 1 : 0);
        }
        if (name !== undefined) {
          updateFields.push('ten_nguoi_nhan = ?');
          updateValues.push(name);
        }
        if (phone !== undefined) {
          updateFields.push('so_dien_thoai = ?');
          updateValues.push(phone);
        }
        if (addressLine !== undefined) {
          updateFields.push('dia_chi_chi_tiet = ?');
          updateValues.push(addressLine);
        }
        if (street !== undefined) {
          updateFields.push('duong = ?');
          updateValues.push(street);
        }
        if (wardId !== undefined) {
          updateFields.push('phuong_xa_id = ?');
          updateValues.push(wardId);
        }
        if (districtId !== undefined) {
          updateFields.push('quan_huyen_id = ?');
          updateValues.push(districtId);
        }
        if (provinceId !== undefined) {
          updateFields.push('tinh_thanh_id = ?');
          updateValues.push(provinceId);
        }

        if (updateFields.length > 0) {
          updateValues.push(addressId);
          await conn.execute(
            `UPDATE dia_chi SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
          );
        }

        await conn.commit();

        return res.status(200).json({ message: 'Address updated successfully' });

      } catch (error) {
        await conn.rollback();
        throw error;
      }
    }

    // DELETE - Xóa địa chỉ
    if (req.method === 'DELETE') {
      const { addressId } = req.query;

      if (!addressId) {
        return res.status(400).json({ error: 'addressId is required' });
      }

      // Kiểm tra ownership
      const [checkRows] = await conn.execute(
        'SELECT id FROM dia_chi WHERE id = ? AND nguoi_dung_id = ?',
        [addressId, userId]
      );

      if (checkRows.length === 0) {
        return res.status(404).json({ error: 'Address not found' });
      }

      await conn.execute('DELETE FROM dia_chi WHERE id = ?', [addressId]);

      return res.status(200).json({ message: 'Address deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Addresses API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    if (conn) conn.release();
  }
}
