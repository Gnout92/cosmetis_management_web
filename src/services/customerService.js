// src/services/customerService.js
import { connect } from "@/lib/db";

/**
 * Lấy danh sách tất cả khách hàng
 */
export async function getAllCustomers() {
  const connection = await connect();
  const [rows] = await connection.query("SELECT * FROM customers");
  await connection.end();
  return rows;
}

/**
 * Lấy thông tin khách hàng theo ID
 * @param {number} id - ID của khách hàng
 */
export async function getCustomerById(id) {
  const connection = await connect();
  const [rows] = await connection.query("SELECT * FROM customers WHERE id = ?", [id]);
  await connection.end();
  return rows[0];
}

/**
 * Thêm khách hàng mới
 * @param {object} customer - thông tin khách hàng
 */
export async function addCustomer(customer) {
  const connection = await connect();
  const { name, email, phone } = customer;
  const [result] = await connection.query(
    "INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)",
    [name, email, phone]
  );
  await connection.end();
  return result.insertId;
}

/**
 * Cập nhật thông tin khách hàng
 * @param {number} id - ID khách hàng
 * @param {object} customer - dữ liệu cập nhật
 */
export async function updateCustomer(id, customer) {
  const connection = await connect();
  const { name, email, phone } = customer;
  const [result] = await connection.query(
    "UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?",
    [name, email, phone, id]
  );
  await connection.end();
  return result.affectedRows;
}

/**
 * Xóa khách hàng theo ID
 * @param {number} id - ID khách hàng
 */
export async function deleteCustomer(id) {
  const connection = await connect();
  const [result] = await connection.query("DELETE FROM customers WHERE id = ?", [id]);
  await connection.end();
  return result.affectedRows;
}
