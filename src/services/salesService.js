// src/services/salesService.js
import { getPool, query } from "@/lib/database/db";
import { TABLES, COLUMNS, selectList } from "@/lib/database/schema";

/**
 * interface SalesService
 *  - getAllSales(): danh sách "sales" (giờ là HoaDon), kèm tổng tiền, ngày tạo, số item
 *  - getSaleById(id): 1 "sale" + mảng items (chi tiết)
 *  - addSale({ productId, quantity, totalPrice, customerId }): tạo hóa đơn 1 dòng hàng
 *  - updateSale(id, sale): cập nhật header + (nếu có) dòng hàng đầu tiên
 *  - deleteSale(id): xóa hóa đơn và các dòng của nó
 *  - DB thật: HoaDon (header) & ChiTietHoaDon (items)
 *  - TongTien của HoaDon sẽ được cập nhật = SUM(ThanhTien) từ items
 */

const T_HD = TABLES.ORDERS || "HoaDon";
const T_CTHD = TABLES.ORDER_ITEMS || "ChiTietHoaDon";

// Map header dùng alias theo “code cũ”
const HEADER_ALIAS = `
  h.MaHD        AS id,
  h.MaKH        AS customerId,
  h.NgayLap     AS createdAt,
  h.TongTien    AS totalPrice,
  h.TrangThai   AS status
`;

// ------------------------------
// GET: danh sách sales (per order)
// ------------------------------
export async function getAllSales() {
  // Trả 1 dòng / 1 hóa đơn (tổng hợp)
  const rows = await query(
    `
    SELECT
      ${HEADER_ALIAS},
      COUNT(i.MaCTHD) AS itemCount
    FROM ${T_HD} h
    LEFT JOIN ${T_CTHD} i ON i.MaHD = h.MaHD
    GROUP BY h.MaHD
    ORDER BY h.NgayLap DESC
    `
  );

  // Giữ trường quen thuộc: id, customerId, totalPrice, createdAt
  // (status, itemCount là bổ sung an toàn)
  return rows.map((r) => ({
    id: r.id,
    customerId: r.customerId,
    totalPrice: Number(r.totalPrice || 0),
    createdAt: r.createdAt,
    status: r.status,
    itemCount: Number(r.itemCount || 0),
  }));
}

// ------------------------------
// GET: 1 sale + items
// ------------------------------
export async function getSaleById(id) {
  const [header] = await query(
    `
    SELECT
      ${HEADER_ALIAS}
    FROM ${T_HD} h
    WHERE h.MaHD = ?
    `,
    [id]
  );

  if (!header) return null;

  const items = await query(
    `
    SELECT
      MaCTHD      AS itemId,
      MaSanPham   AS productId,
      SoLuong     AS quantity,
      DonGia      AS unitPrice,
      ThanhTien   AS lineTotal
    FROM ${T_CTHD}
    WHERE MaHD = ?
    ORDER BY MaCTHD ASC
    `,
    [id]
  );

  return {
    id: header.id,
    customerId: header.customerId,
    totalPrice: Number(header.totalPrice || 0),
    createdAt: header.createdAt,
    status: header.status,
    items: items.map((it) => ({
      itemId: it.itemId,
      productId: it.productId,
      quantity: Number(it.quantity || 0),
      unitPrice: Number(it.unitPrice || 0),
      lineTotal: Number(it.lineTotal || 0),
    })),
  };
}

// ------------------------------
// POST: tạo sale 1 dòng (tương thích code cũ)
// ------------------------------
export async function addSale({ productId, quantity, totalPrice, customerId }) {
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Tạo header (tạm TongTien=0, sẽ update sau)
    const [insH] = await conn.execute(
      `INSERT INTO ${T_HD} (MaKH, MaNV, NgayLap, TongTien, TrangThai)
       VALUES (?, NULL, NOW(), 0, 'ChuaXacNhan')`,
      [customerId]
    );
    const saleId = insH.insertId;

    // 2) Thêm 1 dòng item (giữ tương thích code cũ: 1 transaction = 1 product)
    //    Nếu totalPrice có, suy ra unitPrice theo quantity; fallback nếu thiếu.
    const qty = Math.max(1, Number(quantity || 1));
    const unitPrice =
      totalPrice != null
        ? Number(totalPrice) / qty
        : 0;

    await conn.execute(
      `INSERT INTO ${T_CTHD} (MaHD, MaSanPham, SoLuong, DonGia)
       VALUES (?, ?, ?, ?)`,
      [saleId, productId, qty, unitPrice]
    );

    // 3) Cập nhật TongTien = SUM(ThanhTien) (ThanhTien là cột GENERATED)
    await conn.execute(
      `UPDATE ${T_HD} h
       JOIN (SELECT MaHD, COALESCE(SUM(ThanhTien),0) AS tong FROM ${T_CTHD} WHERE MaHD = ? GROUP BY MaHD) x
         ON x.MaHD = h.MaHD
       SET h.TongTien = x.tong
       WHERE h.MaHD = ?`,
      [saleId, saleId]
    );

    await conn.commit();
    return saleId;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

// ------------------------------
// PUT/PATCH: cập nhật sale (header + dòng đầu tiên)
// ------------------------------
export async function updateSale(id, sale) {
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const fieldsH = [];
    const paramsH = [];

    // Cho phép đổi customerId, status, totalPrice (totalPrice sẽ quy về đơn giá của dòng đầu)
    if (sale.customerId != null) {
      fieldsH.push(`MaKH = ?`);
      paramsH.push(sale.customerId);
    }
    if (sale.status) {
      fieldsH.push(`TrangThai = ?`);
      paramsH.push(sale.status);
    }

    if (fieldsH.length) {
      await conn.execute(
        `UPDATE ${T_HD} SET ${fieldsH.join(", ")} WHERE MaHD = ?`,
        [...paramsH, id]
      );
    }

    // Lấy dòng item đầu tiên (giả định legacy chỉ 1 dòng/đơn)
    const [[firstItem] = []] = await conn.query(
      `SELECT MaCTHD, SoLuong, DonGia FROM ${T_CTHD} WHERE MaHD = ? ORDER BY MaCTHD ASC LIMIT 1`,
      [id]
    );

    if (firstItem) {
      // Tính lại quantity / unitPrice nếu được truyền
      let newQty = firstItem.SoLuong;
      let newUnitPrice = firstItem.DonGia;

      if (sale.quantity != null) newQty = Math.max(1, Number(sale.quantity));
      if (sale.totalPrice != null) {
        const qty = newQty || 1;
        newUnitPrice = Number(sale.totalPrice) / qty;
      }
      if (sale.productId != null) {
        // đổi sản phẩm của dòng đầu
        await conn.execute(
          `UPDATE ${T_CTHD} SET MaSanPham = ? WHERE MaCTHD = ?`,
          [sale.productId, firstItem.MaCTHD]
        );
      }
      // cập nhật qty/unit
      await conn.execute(
        `UPDATE ${T_CTHD} SET SoLuong = ?, DonGia = ? WHERE MaCTHD = ?`,
        [newQty, newUnitPrice, firstItem.MaCTHD]
      );
    }

    // Cập nhật lại tổng tiền header theo SUM(ThanhTien)
    await conn.execute(
      `UPDATE ${T_HD} h
       JOIN (SELECT MaHD, COALESCE(SUM(ThanhTien),0) AS tong FROM ${T_CTHD} WHERE MaHD = ? GROUP BY MaHD) x
         ON x.MaHD = h.MaHD
       SET h.TongTien = x.tong
       WHERE h.MaHD = ?`,
      [id, id]
    );

    await conn.commit();
    return 1; // giống affectedRows=1
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

// ------------------------------
// DELETE: xóa sale (header + items)
// ------------------------------
export async function deleteSale(id) {
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(`DELETE FROM ${T_CTHD} WHERE MaHD = ?`, [id]);
    const [res] = await conn.execute(`DELETE FROM ${T_HD} WHERE MaHD = ?`, [id]);
    await conn.commit();
    return res.affectedRows || 0;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}
