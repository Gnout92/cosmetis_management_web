// src/services/employeeService.js
import { query } from "@/lib/database/db";

const TABLE = "NhanVien";

export async function getAllEmployees() {
  const rows = await query(
    `SELECT MaNV, HoVaTen, DienThoai, Email, VaiTro, NgayTao, NgayCapNhat FROM ${TABLE}`
  );
  return rows;
}

export async function getEmployeeById(id) {
  const rows = await query(
    `SELECT MaNV, HoVaTen, DienThoai, Email, VaiTro, NgayTao, NgayCapNhat FROM ${TABLE} WHERE MaNV = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function addEmployee({ HoVaTen, DienThoai, Email, MatKhau, VaiTro = "NhanVien" }) {
  const result = await query(
    `INSERT INTO ${TABLE} (HoVaTen, DienThoai, Email, MatKhau, VaiTro) VALUES (?, ?, ?, ?, ?)`,
    [HoVaTen, DienThoai, Email, MatKhau, VaiTro]
  );
  return result.insertId; // MaNV
}

export async function updateEmployee(id, { HoVaTen, DienThoai, Email, MatKhau, VaiTro }) {
  const result = await query(
    `UPDATE ${TABLE} SET HoVaTen = ?, DienThoai = ?, Email = ?, MatKhau = ?, VaiTro = ? WHERE MaNV = ?`,
    [HoVaTen, DienThoai, Email, MatKhau, VaiTro, id]
  );
  return result.affectedRows;
}

export async function deleteEmployee(id) {
  const result = await query(`DELETE FROM ${TABLE} WHERE MaNV = ?`, [id]);
  return result.affectedRows;
}
