// src/lib/auth/userRepo.js
import { query } from "@/lib/database/db";

/**
 * Tối giản: dùng bảng KHÁCH HÀNG hiện có.
 * Nếu bạn đang map tên bảng/column bằng helper, có thể đổi sang SELECT alias tương đương.
 */

export async function findCustomerByEmail(email) {
  const lowerEmail = email.toLowerCase();
  const rows = await query(
    `SELECT id, ten_hien_thi AS name, email, mat_khau_hash AS passwordHash, vai_tro AS role
     FROM nguoi_dung
     WHERE email_thuong = ?  
     LIMIT 1`,
    [lowerEmail]
  );
  return rows[0] || null;
}

export async function createCustomerFromGoogle(profile) {
  const name = profile.name || profile.email;
  const email = profile.email;
  const avatar = profile.picture || null;

  //Tạo người dùng mới
  const result = await query(
   'INSERT INTO nguoi_dung (email, ten_hien_thi, anh_dai_dien, vai_tro) VALUES (?, ?, ?, \'Customer\')',
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
