//src/services/warehouseService:
import { query } from "@/lib/database/db";
import { TABLES, COLUMNS, selectList, toDbPayload } from "@/lib/database/schema";

const MAP = COLUMNS.warehouses;
const TABLE = TABLES.WAREHOUSE;

export async function getAllWarehouseItems() {
  return query(`SELECT ${selectList(MAP)} FROM ${TABLE} ORDER BY ${MAP.id} ASC`);
}

export async function getWarehouseItemById(id) {
  const [row] = await query(`SELECT ${selectList(MAP)} FROM ${TABLE} WHERE ${MAP.id} = ?`, [id]);
  return row || null;
}

export async function addWarehouseItem(item) {
  // { name, location }
  const payload = toDbPayload(item, MAP); // -> { TenKho, ViTri }
  const cols = Object.keys(payload);
  const vals = Object.values(payload);
  const result = await query(
    `INSERT INTO ${TABLE} (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`,
    vals
  );
  return result.insertId;
}

export async function updateWarehouseItem(id, item) {
  const payload = toDbPayload(item, MAP);
  const sets = Object.keys(payload).map((c) => `${c} = ?`).join(", ");
  const result = await query(
    `UPDATE ${TABLE} SET ${sets} WHERE ${MAP.id} = ?`,
    [...Object.values(payload), id]
  );
  return result.affectedRows;
}

export async function deleteWarehouseItem(id) {
  const result = await query(`DELETE FROM ${TABLE} WHERE ${MAP.id} = ?`, [id]);
  return result.affectedRows;
}
