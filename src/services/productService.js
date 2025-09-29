// src/services/productService.js
import { connect } from "@/lib/db";

/**
 * Lấy tất cả sản phẩm
 */
export async function getAllProducts() {
  const connection = await connect();
  const [rows] = await connection.query("SELECT * FROM products");
  await connection.end();
  return rows;
}

/**
 * Lấy sản phẩm theo ID
 * @param {number} id - ID sản phẩm
 */
export async function getProductById(id) {
  const connection = await connect();
  const [rows] = await connection.query("SELECT * FROM products WHERE id = ?", [id]);
  await connection.end();
  return rows[0];
}

/**
 * Thêm sản phẩm mới
 * @param {object} product - thông tin sản phẩm
 */
export async function addProduct(product) {
  const connection = await connect();
  const { name, price, image, inStock, discount } = product;
  const [result] = await connection.query(
    "INSERT INTO products (name, price, image, inStock, discount) VALUES (?, ?, ?, ?, ?)",
    [name, price, image, inStock ? 1 : 0, discount || null]
  );
  await connection.end();
  return result.insertId;
}

/**
 * Cập nhật sản phẩm
 * @param {number} id - ID sản phẩm
 * @param {object} product - dữ liệu cập nhật
 */
export async function updateProduct(id, product) {
  const connection = await connect();
  const { name, price, image, inStock, discount } = product;
  const [result] = await connection.query(
    "UPDATE products SET name = ?, price = ?, image = ?, inStock = ?, discount = ? WHERE id = ?",
    [name, price, image, inStock ? 1 : 0, discount || null, id]
  );
  await connection.end();
  return result.affectedRows;
}

/**
 * Xóa sản phẩm theo ID
 * @param {number} id - ID sản phẩm
 */
export async function deleteProduct(id) {
  const connection = await connect();
  const [result] = await connection.query("DELETE FROM products WHERE id = ?", [id]);
  await connection.end();
  return result.affectedRows;
}
