// src/services/warehouseService.js
import { query } from "@/lib/database/db";

const TABLE = "Kho";

export async function getAllWarehouses() {
  const rows = await query(`SELECT MaKho, TenKho, ViTri, NgayTao, NgayCapNhat FROM ${TABLE} ORDER BY MaKho ASC`);
  return rows;
}

export async function getWarehouseById(id) {
  const rows = await query(
    `SELECT MaKho, TenKho, ViTri, NgayTao, NgayCapNhat FROM ${TABLE} WHERE MaKho = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function addWarehouse({ TenKho, ViTri }) {
  const result = await query(
    `INSERT INTO ${TABLE} (TenKho, ViTri) VALUES (?, ?)`,
    [TenKho, ViTri]
  );
  return result.insertId; // MaKho
}

export async function updateWarehouse(id, { TenKho, ViTri }) {
  const result = await query(
    `UPDATE ${TABLE} SET TenKho = ?, ViTri = ? WHERE MaKho = ?`,
    [TenKho, ViTri, id]
  );
  return result.affectedRows;
}

export async function deleteWarehouse(id) {
  const result = await query(`DELETE FROM ${TABLE} WHERE MaKho = ?`, [id]);
  return result.affectedRows;
}
