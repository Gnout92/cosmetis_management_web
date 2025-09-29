// src/services/salesService.js
import { connect } from "@/lib/db";

/**
 * Lấy tất cả giao dịch bán hàng
 */
export async function getAllSales() {
  const connection = await connect();
  const [rows] = await connection.query("SELECT * FROM sales ORDER BY created_at DESC");
  await connection.end();
  return rows;
}

/**
 * Lấy giao dịch theo ID
 * @param {number} id - ID giao dịch
 */
export async function getSaleById(id) {
  const connection = await connect();
  const [rows] = await connection.query("SELECT * FROM sales WHERE id = ?", [id]);
  await connection.end();
  return rows[0];
}

/**
 * Thêm giao dịch mới
 * @param {object} sale - dữ liệu giao dịch
 */
export async function addSale(sale) {
  const connection = await connect();
  const { productId, quantity, totalPrice, customerId } = sale;
  const [result] = await connection.query(
    "INSERT INTO sales (product_id, quantity, total_price, customer_id, created_at) VALUES (?, ?, ?, ?, NOW())",
    [productId, quantity, totalPrice, customerId]
  );
  await connection.end();
  return result.insertId;
}

/**
 * Cập nhật giao dịch
 * @param {number} id - ID giao dịch
 * @param {object} sale - dữ liệu cập nhật
 */
export async function updateSale(id, sale) {
  const connection = await connect();
  const { productId, quantity, totalPrice, customerId } = sale;
  const [result] = await connection.query(
    "UPDATE sales SET product_id = ?, quantity = ?, total_price = ?, customer_id = ? WHERE id = ?",
    [productId, quantity, totalPrice, customerId, id]
  );
  await connection.end();
  return result.affectedRows;
}

/**
 * Xóa giao dịch theo ID
 * @param {number} id - ID giao dịch
 */
export async function deleteSale(id) {
  const connection = await connect();
  const [result] = await connection.query("DELETE FROM sales WHERE id = ?", [id]);
  await connection.end();
  return result.affectedRows;
}
