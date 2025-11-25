// src/lib/auth/userRepo.js
import { query } from "@/lib/database/db";

/**
 * Repository để lấy thông tin user từ database
 */

export async function findCustomerByEmail(email) {
  const lowerEmail = email.toLowerCase();
  const rows = await query(
    `SELECT id, ten_hien_thi AS name, email, mat_khau_hash AS passwordHash
     FROM nguoi_dung
     WHERE email = ?  
     LIMIT 1`,
    [lowerEmail]
  );
  return rows[0] || null;
}

export async function findCustomerByUsername(username) {
  const rows = await query(
    `SELECT id, ten_dang_nhap, email, ten_hien_thi, ho, ten, anh_dai_dien,
            mat_khau_hash, dang_hoat_dong
     FROM nguoi_dung
     WHERE ten_dang_nhap = ? AND dang_hoat_dong = 1
     LIMIT 1`,
    [username]
  );
  return rows[0] || null;
}

export async function findUserById(id) {
  const rows = await query(
    `SELECT id, ten_dang_nhap, email, ten_hien_thi, ho, ten, anh_dai_dien,
            dang_hoat_dong, thoi_gian_tao
     FROM nguoi_dung
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function getUserRole(id) {
  const rows = await query(
    `SELECT vai_tro FROM v_nguoi_dung WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0]?.vai_tro || 'Customer';
}

export async function createCustomerFromGoogle(profile) {
  const name = profile.name || profile.email;
  const email = profile.email;
  const avatar = profile.picture || null;

  // Tạo người dùng mới
  const result = await query(
   `INSERT INTO nguoi_dung (email, ten_hien_thi, anh_dai_dien, vai_tro) 
    VALUES (?, ?, ?, 'Customer')`,
    [email, name, avatar]
  );

  const userId = result.insertId;

  // Connect with google account
  await query(
    'INSERT INTO lien_ket_dang_nhap (nguoi_dung_id,nha_cung_cap, ma_nguoi_dung_ncc, email_tai_ncc, anh_tai_ncc) VALUES (?, \'google\', ?, ?, ?)',
    [userId, profile.sub, profile.email, profile.picture]
  );
  
  return {
    id: userId,
    name,
    email,
  };
}
