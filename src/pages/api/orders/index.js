// src/pages/api/orders/index.js
import jwt from 'jsonwebtoken';
import { getPool } from '@/lib/database/pool';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_change_me';
/**
 * Lấy userId từ JWT trong header Authorization
 */
function getUserIdFromReq(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded?.uid || null;
  } catch (err) {
    console.error('[orders] Invalid token:', err.message);
    return null;
  }
}

  const FIXED_SHIPPING_FEE = 20000; // Khai báo hằng số rõ ràng

  function calculateShippingFee(address, shippingMethod = 'standard') {
  // **FIXED RATE LOGIC**
  return FIXED_SHIPPING_FEE; 
}
  

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ success: false, message: 'Method Not Allowed' });
  }

  const userId = getUserIdFromReq(req);
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: 'Unauthorized (no/invalid token)' });
  }

  const { addressId, items, shippingMethod } = req.body || {};

  // ==== 1. Validate dữ liệu từ FE ====

  if (!addressId) {
    return res
      .status(400)
      .json({ success: false, message: 'addressId is required' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: 'Cart items is required' });
  }

  // Chuẩn hoá item: productId = số, quantity > 0
  const cleanItems = items
    .map((it) => ({
      productId: Number(it.productId),
      quantity: Number(it.quantity),
    }))
    .filter((it) => it.productId > 0 && it.quantity > 0);

  if (cleanItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No valid items in cart',
    });
  }

  const pool = getPool();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // ==== 2. Lấy địa chỉ giao hàng (snapshot) ====
    const [addrRows] = await conn.execute(
      `
      SELECT 
        dc.id,
        dc.ten_nguoi_nhan,
        dc.so_dien_thoai,
        dc.dia_chi_chi_tiet,
        dc.duong,
        dc.phuong_xa_id,
        px.ten AS ten_phuong_xa,
        dc.quan_huyen_id,
        qh.ten AS ten_quan_huyen,
        dc.tinh_thanh_id,
        tt.id  AS tinh_thanh_id,   -- dùng id cho rule ship
        tt.ten AS ten_tinh_thanh
      FROM dia_chi dc
      LEFT JOIN phuong_xa  px ON px.id = dc.phuong_xa_id
      LEFT JOIN quan_huyen qh ON qh.id = dc.quan_huyen_id
      LEFT JOIN tinh_thanh tt ON tt.id = dc.tinh_thanh_id
      WHERE dc.id = ? AND dc.nguoi_dung_id = ?
      LIMIT 1
    `,
      [addressId, userId]
    );

    if (!addrRows.length) {
      await conn.rollback();
      return res.status(400).json({
        success: false,
        message: 'Địa chỉ không tồn tại hoặc không thuộc về bạn',
      });
    }

    const address = addrRows[0];

    // ==== 3. Lấy thông tin sản phẩm ====
    const productIds = [...new Set(cleanItems.map((it) => it.productId))];
    const placeholders = productIds.map(() => '?').join(', ');

    const [productRows] = await conn.query(
      `
      SELECT 
        sp.MaSanPham,
        sp.TenSanPham,
        sp.Gia,
        sp.GiaGoc
      FROM sanpham sp
      WHERE sp.MaSanPham IN (${placeholders})
    `,
      productIds
    );

    if (productRows.length !== productIds.length) {
      const foundIds = new Set(productRows.map((p) => p.MaSanPham));
      const missing = productIds.filter((id) => !foundIds.has(id));
      await conn.rollback();
      return res.status(400).json({
        success: false,
        message: 'Một số sản phẩm không tồn tại',
        missingProductIds: missing,
      });
    }

    const productMap = new Map(productRows.map((p) => [p.MaSanPham, p]));

    // ==== 4. Kiểm tra tồn kho (tổng) ====
    const [stockRows] = await conn.query(
      `
      SELECT 
        tk.san_pham_id,
        SUM(tk.so_luong_ton - tk.so_luong_giu_cho) AS available
      FROM ton_kho tk
      WHERE tk.san_pham_id IN (${placeholders})
      GROUP BY tk.san_pham_id
    `,
      productIds
    );

    const stockMap = new Map(
      stockRows.map((r) => [r.san_pham_id, Number(r.available || 0)])
    );

    for (const item of cleanItems) {
      const available = stockMap.get(item.productId) ?? 0;
      if (available <= 0 || item.quantity > available) {
        await conn.rollback();
        return res.status(400).json({
          success: false,
          message: 'Sản phẩm không đủ tồn kho',
          productId: item.productId,
          available,
          requested: item.quantity,
        });
      }
    }

    // ==== 5. Tính tiền ====
    let subtotal = 0;
    const detailItems = [];

    for (const item of cleanItems) {
      const p = productMap.get(item.productId);

      const giaBan = Number(p.Gia); // giá đang bán
      const giaGoc = p.GiaGoc != null ? Number(p.GiaGoc) : giaBan; // giá niêm yết

      const lineTotal = giaBan * item.quantity;
      subtotal += lineTotal;

      detailItems.push({
        productId: item.productId,
        quantity: item.quantity,
        priceList: giaGoc,
        unitPrice: giaBan,
        discountPercent: null,
        discountAmount: 0,
      });
    }

    const shippingFee = calculateShippingFee(address, shippingMethod || 'standard');
    const discountTotal = 0; // tạm thời chưa có mã giảm giá ở BE
    const grandTotal = subtotal + shippingFee - discountTotal;

    // ==== 6. Insert đơn hàng (don_hang) ====
    // Lưu ý:
    //  - phuong_thuc_tt: chỉ có 'COD' nên hardcode
    //  - tong_hang, tong_thanh_toan: có thể set 0, triggers sẽ cập nhật lại
    const [orderResult] = await conn.execute(
  `
  INSERT INTO don_hang (
    nguoi_dung_id,
    trang_thai,
    phuong_thuc_tt,
    trang_thai_tt,
    ship_phuong_xa_id,
    ship_quan_huyen_id,
    ship_tinh_thanh_id,
    ship_ten_phuong_xa,
    ship_ten_quan_huyen,
    ship_ten_tinh_thanh,
    ship_ten_nguoi_nhan,
    ship_so_dien_thoai,
    ship_dia_chi_chi_tiet,
    ship_duong,
    tong_hang,
    phi_van_chuyen,
    tong_giam_gia,
    tong_thanh_toan
  )
  VALUES (
    ?, ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?, ?, ?
  )
  `,
  [
    userId,                     // nguoi_dung_id
    'PENDING',                  // trang_thai
    'COD',                      // phuong_thuc_tt
    'UNPAID',                   // trang_thai_tt
    address.phuong_xa_id,       // ship_phuong_xa_id
    address.quan_huyen_id,      // ship_quan_huyen_id
    address.tinh_thanh_id,      // ship_tinh_thanh_id
    address.ten_phuong_xa,      // ship_ten_phuong_xa
    address.ten_quan_huyen,     // ship_ten_quan_huyen
    address.ten_tinh_thanh,     // ship_ten_tinh_thanh
    address.ten_nguoi_nhan,     // ship_ten_nguoi_nhan
    address.so_dien_thoai,      // ship_so_dien_thoai
    address.dia_chi_chi_tiet,   // ship_dia_chi_chi_tiet
    address.duong,              // ship_duong
    subtotal,                   // tong_hang
    shippingFee,                // phi_van_chuyen
    discountTotal,              // tong_giam_gia
    grandTotal,                 // tong_thanh_toan
  ]
);


    const orderId = orderResult.insertId;

    // ==== 7. Insert chi tiết đơn hàng (don_hang_chi_tiet) ====
    const detailPlaceholders = [];
    const detailValues = [];

    for (const d of detailItems) {
      detailPlaceholders.push('(?,?,?,?,?,?,?)');
      detailValues.push(
        orderId,
        d.productId,
        d.priceList,
        d.unitPrice,
        d.discountPercent,
        d.discountAmount,
        d.quantity
      );
    }

    await conn.query(
      `
      INSERT INTO don_hang_chi_tiet (
        don_hang_id,
        san_pham_id,
        gia_niem_yet,
        don_gia,
        pt_giam,
        tien_giam,
        so_luong
      )
      VALUES ${detailPlaceholders.join(', ')}
    `,
      detailValues
    );
    // AFTER INSERT trigger:
    //  - trg_dhct_after_ins        -> cập nhật tong_hang & tong_thanh_toan
    //  - trg_dhct_after_reserve    -> tạo giu_cho + cập nhật ton_kho

    await conn.commit();

    return res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      orderId,
      status: 'PENDING',
      totals: {
        subtotal,
        shippingFee,
        discountTotal,
        grandTotal,
      },
    });
  } catch (err) {
    await conn.rollback();
    console.error('[orders] Error creating order:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    });
  } finally {
    conn.release();
  }
}
