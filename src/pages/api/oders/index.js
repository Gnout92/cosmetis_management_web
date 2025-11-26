// src/pages/api/orders/index.js
import jwt from 'jsonwebtoken';
import { getPool } from '@/lib/database/pool';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_change_me';
const FIXED_SHIPPING_FEE = 20000; // tạm thời set cứng như FE đang dùng

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

  const { addressId, shippingMethod, items } = req.body || {};

  // Validate cơ bản
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

  // Chuẩn hoá items
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

    // 1) Lấy thông tin địa chỉ, join tên phường/xã, quận/huyện, tỉnh/thành
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

    // 2) Lấy thông tin sản phẩm và kiểm tra tồn kho cơ bản
    const productIds = [...new Set(cleanItems.map((it) => it.productId))];

    const [productRows] = await conn.query(
      `
      SELECT 
        sp.MaSanPham,
        sp.TenSanPham,
        sp.Gia,
        sp.GiaGoc
      FROM sanpham sp
      WHERE sp.MaSanPham IN ( ${productIds.map(() => '?').join(', ')} )
    `,
      productIds
    );

    if (productRows.length !== productIds.length) {
      // có id không tồn tại
      const foundIds = new Set(productRows.map((p) => p.MaSanPham));
      const missing = productIds.filter((id) => !foundIds.has(id));
      await conn.rollback();
      return res.status(400).json({
        success: false,
        message: 'Một số sản phẩm không tồn tại',
        missingProductIds: missing,
      });
    }

    // Map sản phẩm theo id
    const productMap = new Map(
      productRows.map((p) => [p.MaSanPham, p])
    );

    // 2b) Check tồn kho tổng (so_luong_ton - so_luong_giu_cho)
    const [stockRows] = await conn.query(
      `
      SELECT 
        tk.san_pham_id,
        SUM(tk.so_luong_ton - tk.so_luong_giu_cho) AS available
      FROM ton_kho tk
      WHERE tk.san_pham_id IN ( ${productIds.map(() => '?').join(', ')} )
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

    // 3) Tính tiền
    let subtotal = 0;

    const detailItems = cleanItems.map((item) => {
      const p = productMap.get(item.productId);
      const giaBan = Number(p.Gia);
      const giaGoc = p.GiaGoc != null ? Number(p.GiaGoc) : giaBan;

      const lineTotal = giaBan * item.quantity;
      subtotal += lineTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        priceList: giaGoc,
        unitPrice: giaBan,
        discountPercent: null,
        discountAmount: 0,
      };
    });

    const shippingFee = FIXED_SHIPPING_FEE;
    const discountTotal = 0; // tạm thời chưa xử lý mã giảm giá ở BE

    const grandTotal = subtotal + shippingFee - discountTotal;

    // 4) Insert đơn hàng (don_hang)
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
      VALUES (?, 'PENDING', 'COD', 'UNPAID',
              ?, ?, ?,
              ?, ?, ?,
              ?, ?, ?, ?,
              ?, ?, ?, ?)
    `,
      [
        userId,
        address.phuong_xa_id,
        address.quan_huyen_id,
        address.tinh_thanh_id,
        address.ten_phuong_xa,
        address.ten_quan_huyen,
        address.ten_tinh_thanh,
        address.ten_nguoi_nhan,
        address.so_dien_thoai,
        address.dia_chi_chi_tiet,
        address.duong,
        subtotal,
        shippingFee,
        discountTotal,
        grandTotal,
      ]
    );

    const orderId = orderResult.insertId;

    // 5) Insert chi tiết đơn hàng (don_hang_chi_tiet)
    const detailValues = [];
    const detailPlaceholders = [];

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
    // Trigger trg_dhct_after_ins sẽ tự cập nhật tong_hang, tong_thanh_toan + giu_cho/ton_kho

    await conn.commit();

    return res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      orderId,
      totals: {
        subtotal,
        shippingFee,
        discountTotal,
        grandTotal,
      },
      meta: {
        shippingMethod: shippingMethod || 'standard',
      },
    });
  } catch (err) {
    await conn.rollback();
    console.error('[orders] Error creating order:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  } finally {
    conn.release();
  }
}
