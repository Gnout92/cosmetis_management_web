// src/services/warehouseService.js
import { connect } from "@/lib/db";

/**
 * Lấy tất cả sản phẩm trong kho
 */
export async function getAllWarehouseItems() {
  const connection = await connect();
  const [rows] = await connection.query("SELECT * FROM warehouse ORDER BY id ASC");
  await connection.end();
  return rows;
}

/**
 * Lấy sản phẩm trong kho theo ID
 * @param {number} id - ID sản phẩm
 */
export async function getWarehouseItemById(id) {
  const connection = await connect();
  const [rows] = await connection.query("SELECT * FROM warehouse WHERE id = ?", [id]);
  await connection.end();
  return rows[0];
}

/**
 * Thêm sản phẩm mới vào kho
 * @param {object} item - dữ liệu sản phẩm
 */
export async function addWarehouseItem(item) {
  const connection = await connect();
  const { productName, quantity, location } = item;
  const [result] = await connection.query(
    "INSERT INTO warehouse (product_name, quantity, location, created_at) VALUES (?, ?, ?, NOW())",
    [productName, quantity, location]
  );
  await connection.end();
  return result.insertId;
}

/**
 * Cập nhật thông tin sản phẩm trong kho
 * @param {number} id - ID sản phẩm
 * @param {object} item - dữ liệu cập nhật
 */
export async function updateWarehouseItem(id, item) {
  const connection = await connect();
  const { productName, quantity, location } = item;
  const [result] = await connection.query(
    "UPDATE warehouse SET product_name = ?, quantity = ?, location = ? WHERE id = ?",
    [productName, quantity, location, id]
  );
  await connection.end();
  return result.affectedRows;
}

/**
 * Xóa sản phẩm trong kho theo ID
 * @param {number} id - ID sản phẩm
 */
export async function deleteWarehouseItem(id) {
  const connection = await connect();
  const [result] = await connection.query("DELETE FROM warehouse WHERE id = ?", [id]);
  await connection.end();
  return result.affectedRows;
}
