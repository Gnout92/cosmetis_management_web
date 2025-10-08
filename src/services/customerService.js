//src/services/customerSevice: 
import { query } from "@/lib/database/db";
import { TABLES, COLUMNS, selectList, toDbPayload } from "@/lib/database/schema";

const MAP = COLUMNS.customers;
const TABLE = TABLES.CUSTOMERS;

export async function getAllCustomers() {
  const rows = await query(`SELECT ${selectList(MAP)} FROM ${TABLE}`);
  return rows; // đã AS theo app field (name,email,phone…)
}

export async function getCustomerById(id) {
  const [row] = await query(`SELECT ${selectList(MAP)} FROM ${TABLE} WHERE ${MAP.id} = ?`, [id]);
  return row || null;
}

export async function addCustomer(customer) {
  // customer: { name, email, phone, password? }
  const payload = toDbPayload(customer, MAP); // -> { HoVaTen, Email, DienThoai, MatKhau? }
  const cols = Object.keys(payload);
  const vals = Object.values(payload);
  const placeholders = cols.map(() => "?").join(", ");

  const sql = `INSERT INTO ${TABLE} (${cols.join(", ")}) VALUES (${placeholders})`;
  const result = await query(sql, vals);
  return result.insertId;
}

export async function updateCustomer(id, customer) {
  const payload = toDbPayload(customer, MAP);
  const sets = Object.keys(payload).map((c) => `${c} = ?`).join(", ");
  const vals = Object.values(payload);
  const sql = `UPDATE ${TABLE} SET ${sets} WHERE ${MAP.id} = ?`;
  const result = await query(sql, [...vals, id]);
  return result.affectedRows;
}

export async function deleteCustomer(id) {
  const result = await query(`DELETE FROM ${TABLE} WHERE ${MAP.id} = ?`, [id]);
  return result.affectedRows;
}
