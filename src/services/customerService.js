// src/services/customerService.js
import { query } from "@/lib/database/db";

const TABLE = "KhachHang";

export async function getAllCustomers() {
  const rows = await query(`SELECT MaKH, HoVaTen, DienThoai, Email, NgayTao, NgayCapNhat FROM ${TABLE}`);
  return rows;
}

export async function getCustomerById(id) {
  const rows = await query(
    `SELECT MaKH, HoVaTen, DienThoai, Email, NgayTao, NgayCapNhat FROM ${TABLE} WHERE MaKH = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function addCustomer({ HoVaTen, DienThoai, Email, MatKhau = null }) {
  const result = await query(
    `INSERT INTO ${TABLE} (HoVaTen, DienThoai, Email, MatKhau) VALUES (?, ?, ?, ?)`,
    [HoVaTen, DienThoai, Email, MatKhau]
  );
  return result.insertId; // MaKH mới
}

export async function updateCustomer(id, { HoVaTen, DienThoai, Email, MatKhau = null }) {
  const result = await query(
    `UPDATE ${TABLE} SET HoVaTen = ?, DienThoai = ?, Email = ?, MatKhau = ? WHERE MaKH = ?`,
    [HoVaTen, DienThoai, Email, MatKhau, id]
  );
  return result.affectedRows; // 1 nếu OK
}

export async function deleteCustomer(id) {
  const result = await query(`DELETE FROM ${TABLE} WHERE MaKH = ?`, [id]);
  return result.affectedRows;
}
