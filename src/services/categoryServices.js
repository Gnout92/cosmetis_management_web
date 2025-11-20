// src/services/categoryServices.js
import { getPool } from "@/lib/database/db";
import { TABLES } from "@/lib/database/schema";

// Bảng: danh_muc (id INT PK AI, ten VARCHAR(100) UNIQUE, mo_ta VARCHAR(500), thoi_gian_tao, thoi_gian_cap_nhat)

export async function getAllCategories({
  page = 1,
  pageSize = 50,
  q,
  sortBy = "name",     // name | createdAt
  sortDir = "asc",     // asc | desc
} = {}) {
  const pool = getPool();

  const offset = Math.max(0, (Number(page) - 1) * Number(pageSize));
  const limit = Math.max(1, Number(pageSize));

  const where = [];
  const args = [];

  if (q && q.trim()) {
    where.push("(dm.ten LIKE ? OR dm.mo_ta LIKE ?)");
    args.push(`%${q.trim()}%`, `%${q.trim()}%`);
  }

  const WHERE = where.length ? `WHERE ${where.join(" AND ")}` : "";

  let orderCol = "dm.ten";
  if (String(sortBy) === "createdAt") orderCol = "dm.thoi_gian_tao";
  const orderDir = String(sortDir).toLowerCase() === "desc" ? "DESC" : "ASC";

  const [rows] = await pool.query(
    `
      SELECT dm.id,
             dm.ten           AS name,
             dm.mo_ta         AS description,
             dm.thoi_gian_tao AS createdAt,
             dm.thoi_gian_cap_nhat AS updatedAt
      FROM ${TABLES.CATEGORIES} dm
      ${WHERE}
      ORDER BY ${orderCol} ${orderDir}
      LIMIT ? OFFSET ?
    `,
    [...args, limit, offset]
  );

  const [[{ total } = { total: 0 }]] = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM ${TABLES.CATEGORIES} dm
      ${WHERE}
    `,
    args
  );

  return {
    items: rows,
    total,
    page: Number(page),
    pageSize: Number(pageSize),
  };
}

export async function getCategoryById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `
      SELECT dm.id,
             dm.ten           AS name,
             dm.mo_ta         AS description,
             dm.thoi_gian_tao AS createdAt,
             dm.thoi_gian_cap_nhat AS updatedAt
      FROM ${TABLES.CATEGORIES} dm
      WHERE dm.id = ?
      LIMIT 1
    `,
    [Number(id)]
  );
  return rows?.[0] || null;
}

export async function addCategory({ name, description }) {
  const pool = getPool();
  const [res] = await pool.query(
    `INSERT INTO ${TABLES.CATEGORIES} (ten, mo_ta) VALUES (?, ?)`,
    [name, description || null]
  );
  return { id: res.insertId };
}

export async function updateCategory(id, { name, description }) {
  const pool = getPool();
  const sets = [];
  const args = [];

  if (name !== undefined) {
    sets.push("ten = ?");
    args.push(name);
  }
  if (description !== undefined) {
    sets.push("mo_ta = ?");
    args.push(description);
  }
  if (sets.length === 0) return { affected: 0 };

  const [res] = await pool.query(
    `UPDATE ${TABLES.CATEGORIES} SET ${sets.join(", ")} WHERE id = ?`,
    [...args, Number(id)]
  );
  return { affected: res.affectedRows || 0 };
}

export async function deleteCategory(id) {
  const pool = getPool();
  const [res] = await pool.query(
    `DELETE FROM ${TABLES.CATEGORIES} WHERE id = ?`,
    [Number(id)]
  );
  return { affected: res.affectedRows || 0 };
}
