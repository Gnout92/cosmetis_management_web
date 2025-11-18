// src/pages/api/user/profile.js
import jwt from 'jsonwebtoken';
import { getPool } from '@/lib/database/pool';
import { TABLES, COLUMNS } from '@/lib/database/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_change_me';

/**
 * GET  /api/user/profile - Lấy thông tin profile user
 * PUT  /api/user/profile - Cập nhật profile user
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

    // GET - Lấy thông tin profile
    if (req.method === 'GET') {
      // Lấy thông tin user
      const [userRows] = await conn.execute(
        `SELECT 
          ${COLUMNS.customers.id} as id,
          ${COLUMNS.customers.email} as email,
          ${COLUMNS.customers.username} as username,
          ${COLUMNS.customers.displayName} as displayName,
          ${COLUMNS.customers.firstName} as firstName,
          ${COLUMNS.customers.lastName} as lastName,
          ${COLUMNS.customers.avatar} as avatar,
          ${COLUMNS.customers.birthDate} as birthDate,
          ${COLUMNS.customers.gender} as gender,
          ${COLUMNS.customers.role} as role,
          ${COLUMNS.customers.createdAt} as createdAt
        FROM ${TABLES.CUSTOMERS}
        WHERE ${COLUMNS.customers.id} = ?`,
        [userId]
      );

      if (userRows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = userRows[0];

      // Lấy danh sách địa chỉ
      const [addressRows] = await conn.execute(
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

      // Lấy OAuth accounts nếu có
      const [oauthRows] = await conn.execute(
        `SELECT 
          id,
          nha_cung_cap as provider,
          ma_nguoi_dung_ncc as providerUserId,
          email_tai_ncc as emailAtProvider,
          anh_tai_ncc as avatarAtProvider,
          thoi_gian_tao as createdAt
        FROM lien_ket_dang_nhap
        WHERE nguoi_dung_id = ?`,
        [userId]
      );

      return res.status(200).json({
        user,
        addresses: addressRows,
        oauthAccounts: oauthRows
      });
    }

    // PUT - Cập nhật thông tin profile
    if (req.method === 'PUT') {
      const {
        displayName,
        firstName,
        lastName,
        birthDate,
        gender,
        avatar
      } = req.body;

      const updateFields = [];
      const updateValues = [];

      if (displayName !== undefined) {
        updateFields.push(`${COLUMNS.customers.displayName} = ?`);
        updateValues.push(displayName);
      }
      if (firstName !== undefined) {
        updateFields.push(`${COLUMNS.customers.firstName} = ?`);
        updateValues.push(firstName);
      }
      if (lastName !== undefined) {
        updateFields.push(`${COLUMNS.customers.lastName} = ?`);
        updateValues.push(lastName);
      }
      if (birthDate !== undefined) {
        updateFields.push(`${COLUMNS.customers.birthDate} = ?`);
        updateValues.push(birthDate);
      }
      if (gender !== undefined) {
        updateFields.push(`${COLUMNS.customers.gender} = ?`);
        updateValues.push(gender);
      }
      if (avatar !== undefined) {
        updateFields.push(`${COLUMNS.customers.avatar} = ?`);
        updateValues.push(avatar);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      updateValues.push(userId);

      await conn.execute(
        `UPDATE ${TABLES.CUSTOMERS} 
         SET ${updateFields.join(', ')}
         WHERE ${COLUMNS.customers.id} = ?`,
        updateValues
      );

      // Lấy thông tin user sau khi update
      const [updatedRows] = await conn.execute(
        `SELECT 
          ${COLUMNS.customers.id} as id,
          ${COLUMNS.customers.email} as email,
          ${COLUMNS.customers.username} as username,
          ${COLUMNS.customers.displayName} as displayName,
          ${COLUMNS.customers.firstName} as firstName,
          ${COLUMNS.customers.lastName} as lastName,
          ${COLUMNS.customers.avatar} as avatar,
          ${COLUMNS.customers.birthDate} as birthDate,
          ${COLUMNS.customers.gender} as gender,
          ${COLUMNS.customers.role} as role
        FROM ${TABLES.CUSTOMERS}
        WHERE ${COLUMNS.customers.id} = ?`,
        [userId]
      );

      return res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedRows[0]
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Profile API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    if (conn) conn.release();
  }
}
