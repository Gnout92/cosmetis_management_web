//src/services/employeeService: 
import { query } from "@/lib/database/db";
import { TABLES, COLUMNS, selectList, toDbPayload } from "@/lib/database/schema";

const MAP = COLUMNS.employees;
const TABLE = TABLES.EMPLOYEES;

export async function getAllEmployees() {
  return query(`SELECT ${selectList(MAP)} FROM ${TABLE}`);
}

export async function getEmployeeById(id) {
  const [row] = await query(`SELECT ${selectList(MAP)} FROM ${TABLE} WHERE ${MAP.id} = ?`, [id]);
  return row || null;
}

export async function addEmployee(employee) {
  // { name, email, phone, position, password? }
  const payload = toDbPayload(employee, MAP);
  const cols = Object.keys(payload);
  const vals = Object.values(payload);
  const sql = `INSERT INTO ${TABLE} (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`;
  const result = await query(sql, vals);
  return result.insertId;
}

export async function updateEmployee(id, employee) {
  const payload = toDbPayload(employee, MAP);
  const sets = Object.keys(payload).map((c) => `${c} = ?`).join(", ");
  const sql = `UPDATE ${TABLE} SET ${sets} WHERE ${MAP.id} = ?`;
  const result = await query(sql, [...Object.values(payload), id]);
  return result.affectedRows;
}

export async function deleteEmployee(id) {
  const result = await query(`DELETE FROM ${TABLE} WHERE ${MAP.id} = ?`, [id]);
  return result.affectedRows;
}
