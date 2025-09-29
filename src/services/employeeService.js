// src/services/employeeService.js
import { connect } from "@/lib/db";

/**
 * Lấy danh sách tất cả nhân viên
 */
export async function getAllEmployees() {
  const connection = await connect();
  const [rows] = await connection.query("SELECT * FROM employees");
  await connection.end();
  return rows;
}

/**
 * Lấy thông tin nhân viên theo ID
 * @param {number} id - ID của nhân viên
 */
export async function getEmployeeById(id) {
  const connection = await connect();
  const [rows] = await connection.query("SELECT * FROM employees WHERE id = ?", [id]);
  await connection.end();
  return rows[0];
}

/**
 * Thêm nhân viên mới
 * @param {object} employee - thông tin nhân viên
 */
export async function addEmployee(employee) {
  const connection = await connect();
  const { name, email, phone, position } = employee;
  const [result] = await connection.query(
    "INSERT INTO employees (name, email, phone, position) VALUES (?, ?, ?, ?)",
    [name, email, phone, position]
  );
  await connection.end();
  return result.insertId;
}

/**
 * Cập nhật thông tin nhân viên
 * @param {number} id - ID nhân viên
 * @param {object} employee - dữ liệu cập nhật
 */
export async function updateEmployee(id, employee) {
  const connection = await connect();
  const { name, email, phone, position } = employee;
  const [result] = await connection.query(
    "UPDATE employees SET name = ?, email = ?, phone = ?, position = ? WHERE id = ?",
    [name, email, phone, position, id]
  );
  await connection.end();
  return result.affectedRows;
}

/**
 * Xóa nhân viên theo ID
 * @param {number} id - ID nhân viên
 */
export async function deleteEmployee(id) {
  const connection = await connect();
  const [result] = await connection.query("DELETE FROM employees WHERE id = ?", [id]);
  await connection.end();
  return result.affectedRows;
}
