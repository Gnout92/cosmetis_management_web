//src/services/productService:
import { query } from "@/lib/database/db";
import { TABLES, COLUMNS, selectList, toDbPayload } from "@/lib/database/schema";

const MAP = COLUMNS.products;
const TABLE = TABLES.PRODUCTS;

export async function getAllProducts() {
  return query(`SELECT ${selectList(MAP)} FROM ${TABLE}`);
}

export async function getProductById(id) {
  const [row] = await query(`SELECT ${selectList(MAP)} FROM ${TABLE} WHERE ${MAP.id} = ?`, [id]);
  return row || null;
}

export async function addProduct(product) {
  const payload = toDbPayload(product, MAP);
  const cols = Object.keys(payload);
  const vals = Object.values(payload);
  const sql = `INSERT INTO ${TABLE} (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`;
  const result = await query(sql, vals);
  
  return { id: result.insertId };


}

export async function updateProduct(id, product) {
  const payload = toDbPayload(product, MAP);
  const sets = Object.keys(payload).map((c) => `${c} = ?`).join(", ");
  const result = await query(
    `UPDATE ${TABLE} SET ${sets} WHERE ${MAP.id} = ?`,
    [...Object.values(payload), id]
  );
  return result.affectedRows;
}

export async function deleteProduct(id) {
  const result = await query(`DELETE FROM ${TABLE} WHERE ${MAP.id} = ?`, [id]);
  return result.affectedRows;
}
