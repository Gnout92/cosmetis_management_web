// src/services/productService.js
import { getPool } from "@/lib/database/db";
import { TABLES } from "@/lib/database/schema";

// ===== Helper chuyển sort UI -> cột DB =====
const ORDER_MAP = {
  name: "s.TenSanPham",
  price: "s.Gia",
  stock: "coalesce(st.total_on_hand - st.total_reserved, 0)",
};

function normalizeSort(sortBy = "name", sortDir = "asc") {
  const col = ORDER_MAP[sortBy] || ORDER_MAP.name;
  const dir = (sortDir || "asc").toLowerCase() === "desc" ? "DESC" : "ASC";
  return { col, dir };
}

// ====== Query builder cho WHERE ======
function buildWhere({
  q,
  categoryId,
  minPrice,
  maxPrice,
  stock, // 'in-stock' | 'low-stock' | 'out-of-stock'
  includeHidden = false, // mặc định ẩn sản phẩm is_an=1
}) {
  const where = [];
  const args = [];

  if (!includeHidden) {
    where.push("s.is_an = 0");
  }

  if (q) {
    // Ưu tiên fulltext nếu có, fallback LIKE
    where.push(
      "( (MATCH(s.TenSanPham, s.MoTa) AGAINST (? IN BOOLEAN MODE)) OR (s.TenSanPham LIKE ? OR s.MoTa LIKE ?) )"
    );
    args.push(`+${q}*`, `%${q}%`, `%${q}%`);
  }

  if (categoryId != null) {
    where.push("s.MaDanhMuc = ?");
    args.push(Number(categoryId));
  }

  if (minPrice != null) {
    where.push("s.Gia >= ?");
    args.push(Number(minPrice));
  }
  if (maxPrice != null) {
    where.push("s.Gia <= ?");
    args.push(Number(maxPrice));
  }

  // stock filter dựa trên tổng tồn - giữ chỗ
  if (stock === "in-stock") {
    where.push("COALESCE(st.total_on_hand - st.total_reserved, 0) > 10");
  } else if (stock === "low-stock") {
    where.push(
      "COALESCE(st.total_on_hand - st.total_reserved, 0) BETWEEN 1 AND 10"
    );
  } else if (stock === "out-of-stock") {
    where.push("COALESCE(st.total_on_hand - st.total_reserved, 0) = 0");
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  return { whereSql, args };
}

// ====== SELECT chung dùng cho list/detail ======
const BASE_SELECT = `
  s.MaSanPham     AS id,
  s.TenSanPham    AS name,
  s.MoTa          AS description,
  s.MaDanhMuc     AS categoryId,
  dm.ten          AS categoryName,
  s.MaThuongHieu  AS brandId,
  th.ten          AS brandName,
  s.Gia           AS price,
  s.GiaGoc        AS originalPrice,
  COALESCE(img.url, '/images/banners/placeholder.jpg') AS image,
  COALESCE(rw.avg_rating, 0) AS rating,
  COALESCE(rw.review_count, 0) AS reviews,
  COALESCE(st.total_on_hand - st.total_reserved, 0) AS stock,
  s.is_an         AS isHidden,
  s.NgayTao       AS createdAt,
  s.NgayCapNhat   AS updatedAt
`;

// subqueries: ảnh đại diện, rating, stock
const JOINS = `
  LEFT JOIN ${TABLES.CATEGORIES} dm ON dm.id = s.MaDanhMuc
  LEFT JOIN ${TABLES.BRANDS}    th ON th.id = s.MaThuongHieu
  LEFT JOIN (
    SELECT spa.san_pham_id, 
           -- chọn ảnh đại diện, nếu không có thì ảnh thứ tự nhỏ nhất
           COALESCE(
             (SELECT url FROM san_pham_anh i WHERE i.san_pham_id = spa.san_pham_id AND i.la_anh_dai_dien = 1 ORDER BY i.thu_tu ASC LIMIT 1),
             (SELECT url FROM san_pham_anh i2 WHERE i2.san_pham_id = spa.san_pham_id ORDER BY i2.thu_tu ASC LIMIT 1)
           ) AS url
    FROM san_pham_anh spa
    GROUP BY spa.san_pham_id
  ) AS img ON img.san_pham_id = s.MaSanPham
  LEFT JOIN (
    SELECT san_pham_id,
           AVG(sao) AS avg_rating,
           COUNT(*) AS review_count
    FROM ${TABLES.REVIEWS}
    WHERE trang_thai = 'HIEN'
    GROUP BY san_pham_id
  ) AS rw ON rw.san_pham_id = s.MaSanPham
  LEFT JOIN (
    SELECT tk.san_pham_id,
           SUM(tk.so_luong_ton)        AS total_on_hand,
           SUM(tk.so_luong_giu_cho)    AS total_reserved
    FROM ${TABLES.STOCKS} tk
    GROUP BY tk.san_pham_id
  ) AS st ON st.san_pham_id = s.MaSanPham
`;

export async function getAllProducts(params = {}) {
  const {
    page = 1,
    pageSize = 20,
    q,
    categoryId,
    minPrice,
    maxPrice,
    stock,
    sortBy = "name",
    sortDir = "asc",
    includeHidden = false,
  } = params;

  const pool = getPool();

  const { whereSql, args } = buildWhere({
    q,
    categoryId,
    minPrice,
    maxPrice,
    stock,
    includeHidden,
  });

  const { col, dir } = normalizeSort(sortBy, sortDir);
  const limit = Number(pageSize);
  const offset = (Number(page) - 1) * limit;

  // total
  const [countRows] = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM ${TABLES.PRODUCTS} s
    LEFT JOIN ${TABLES.CATEGORIES} dm ON dm.id = s.MaDanhMuc
    ${whereSql}
  `,
    args
  );
  const total = countRows?.[0]?.total || 0;

  // data
  const [rows] = await pool.query(
    `
    SELECT
      ${BASE_SELECT}
    FROM ${TABLES.PRODUCTS} s
    ${JOINS}
    ${whereSql}
    ORDER BY ${col} ${dir}
    LIMIT ? OFFSET ?
  `,
    [...args, limit, offset]
  );

  return {
    items: rows,
    total,
    page: Number(page),
    pageSize: limit,
  };
}

export async function getProductById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `
    SELECT
      ${BASE_SELECT}
    FROM ${TABLES.PRODUCTS} s
    ${JOINS}
    WHERE s.MaSanPham = ? AND s.is_an = 0
    LIMIT 1
  `,
    [Number(id)]
  );
  const row = rows?.[0];
  if (!row) return null;

  // Lấy danh sách ảnh & tags (nếu FE cần chi tiết)
  const [[images], [tags]] = await Promise.all([
    pool.query(
      `SELECT url FROM san_pham_anh WHERE san_pham_id = ? ORDER BY la_anh_dai_dien DESC, thu_tu ASC`,
      [Number(id)]
    ),
    pool.query(
      `SELECT t.ten FROM san_pham_tag spt JOIN tag t ON t.id = spt.tag_id WHERE spt.san_pham_id = ?`,
      [Number(id)]
    ),
  ]);

  return {
    ...row,
    images: images?.map((r) => r.url) || (row.image ? [row.image] : []),
    tags: tags?.map((r) => r.ten) || [],
  };
}

export async function addProduct(payload) {
  // Chỉ nhận các field hợp lệ
  const {
    name,
    description,
    categoryId,
    brandId = null,
    price,
    originalPrice = null,
  } = payload || {};

  if (!name || categoryId == null || price == null) {
    throw new Error("Missing fields: name, categoryId, price");
  }

  const pool = getPool();
  const [rs] = await pool.query(
    `
    INSERT INTO ${TABLES.PRODUCTS}
      (MaDanhMuc, TenSanPham, MoTa, Gia, GiaGoc, MaThuongHieu, is_an)
    VALUES (?, ?, ?, ?, ?, ?, 0)
  `,
    [
      Number(categoryId),
      String(name),
      description ?? null,
      Number(price),
      originalPrice != null ? Number(originalPrice) : null,
      brandId != null ? Number(brandId) : null,
    ]
  );

  const id = rs.insertId;
  return { id };
}

export async function updateProduct(id, payload) {
  // Chỉ map những cột cho phép sửa
  const fields = [];
  const args = [];

  const allow = {
    name: "TenSanPham",
    description: "MoTa",
    categoryId: "MaDanhMuc",
    brandId: "MaThuongHieu",
    price: "Gia",
    originalPrice: "GiaGoc",
    isHidden: "is_an",
  };

  Object.entries(allow).forEach(([app, db]) => {
    if (payload[app] !== undefined) {
      fields.push(`${db} = ?`);
      args.push(payload[app]);
    }
  });

  if (!fields.length) return { affected: 0 };

  const pool = getPool();
  const [rs] = await pool.query(
    `
    UPDATE ${TABLES.PRODUCTS}
    SET ${fields.join(", ")}, NgayCapNhat = NOW()
    WHERE MaSanPham = ?
  `,
    [...args, Number(id)]
  );

  return { affected: rs.affectedRows || 0 };
}

export async function deleteProduct(id, { soft = true, hiddenBy = null } = {}) {
  const pool = getPool();

  if (soft) {
    const [rs] = await pool.query(
      `
      UPDATE ${TABLES.PRODUCTS}
      SET is_an = 1, thoi_gian_an = NOW(), an_boi = ?
      WHERE MaSanPham = ?
    `,
      [hiddenBy, Number(id)]
    );
    return { affected: rs.affectedRows || 0, soft: true };
  }

  // Hard delete (ít dùng)
  const [rs] = await pool.query(
    `DELETE FROM ${TABLES.PRODUCTS} WHERE MaSanPham = ?`,
    [Number(id)]
  );
  return { affected: rs.affectedRows || 0, soft: false };
}
