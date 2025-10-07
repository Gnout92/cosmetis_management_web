// src/services/productService.js
import { query } from "@/lib/database/db";

const TABLE = "SanPham";

export async function getAllProducts() {
  const rows = await query(
    `SELECT MaSanPham, TenSanPham, MoTa, MaDanhMuc, Gia, GiaGoc, SoLuong, NgayTao, NgayCapNhat FROM ${TABLE}`
  );
  return rows;
}

export async function getProductById(id) {
  const rows = await query(
    `SELECT MaSanPham, TenSanPham, MoTa, MaDanhMuc, Gia, GiaGoc, SoLuong, NgayTao, NgayCapNhat FROM ${TABLE} WHERE MaSanPham = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function addProduct({ TenSanPham, MoTa, MaDanhMuc, Gia, GiaGoc = null, SoLuong = 0 }) {
  const result = await query(
    `INSERT INTO ${TABLE} (TenSanPham, MoTa, MaDanhMuc, Gia, GiaGoc, SoLuong) VALUES (?, ?, ?, ?, ?, ?)`,
    [TenSanPham, MoTa, MaDanhMuc, Gia, GiaGoc, SoLuong]
  );
  return result.insertId; // MaSanPham
}

export async function updateProduct(id, { TenSanPham, MoTa, MaDanhMuc, Gia, GiaGoc, SoLuong }) {
  const result = await query(
    `UPDATE ${TABLE} SET TenSanPham = ?, MoTa = ?, MaDanhMuc = ?, Gia = ?, GiaGoc = ?, SoLuong = ? WHERE MaSanPham = ?`,
    [TenSanPham, MoTa, MaDanhMuc, Gia, GiaGoc, SoLuong, id]
  );
  return result.affectedRows;
}

export async function deleteProduct(id) {
  const result = await query(`DELETE FROM ${TABLE} WHERE MaSanPham = ?`, [id]);
  return result.affectedRows;
}
