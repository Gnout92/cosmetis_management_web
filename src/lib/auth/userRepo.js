// import { query } from "@/lib/database/db";

// /**
//  * Lấy khách hàng theo email
//  */
// export async function findCustomerByEmail(email) {
//   const rows = await query(
//     "SELECT MaKH, HoVaTen, DienThoai, Email, NgayTao, NgayCapNhat FROM khachhang WHERE Email = ? LIMIT 1",
//     [email]
//   );
//   return rows[0] || null;
// }

// /**
//  * Tạo khách hàng mới từ info Google
//  */
// export async function createCustomerFromGoogle({ name, email }) {
//   const result = await query(
//     `INSERT INTO khachhang (HoVaTen, Email, MatKhau, DienThoai)
//      VALUES (?, ?, NULL, NULL)`,
//     [name || "Khách hàng", email]
//   );

//   // Lấy lại record vừa tạo
//   const newId = result.insertId;
//   const rows = await query(
//     "SELECT MaKH, HoVaTen, DienThoai, Email, NgayTao, NgayCapNhat FROM khachhang WHERE MaKH = ?",
//     [newId]
//   );
//   return rows[0] || null;
// }

// src/lib/auth/userRepo.js
import { query } from "@/lib/database/db";

/**
 * Tối giản: dùng bảng KHÁCH HÀNG hiện có.
 * Nếu bạn đang map tên bảng/column bằng helper, có thể đổi sang SELECT alias tương đương.
 */

export async function findCustomerByEmail(email) {
  const rows = await query(
    `SELECT MaKH AS id, HoVaTen AS name, Email AS email
     FROM khachhang
     WHERE Email = ?
     LIMIT 1`,
    [email]
  );
  return rows[0] || null;
}

export async function createCustomerFromGoogle(profile) {
  // Có thể bổ sung thêm DienThoai/MatKhau tùy nghiệp vụ
  const name = profile.name || profile.email;
  const email = profile.email;

  const result = await query(
    `INSERT INTO khachhang (HoVaTen, Email, DienThoai)
     VALUES (?, ?, NULL)`,
    [name, email]
  );

  return {
    id: result.insertId,
    name,
    email,
  };
}
