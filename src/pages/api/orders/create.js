// src/pages/api/orders/create.js
import { getPool } from "../../../lib/database/db";
import { withAuth } from "../../../lib/middleware/auth";
import { hasPermission } from "../../../lib/auth/permissionManager";

/**
 * API: Tạo đơn hàng mới
 * POST: Tạo đơn hàng mới (Admin, Staff, Customer self)
 */

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();

  try {
    // Kiểm tra quyền truy cập
    const canCreateOrder = req.user.role === 'Admin' || 
                          req.user.role === 'QL_DonHang' || 
                          hasPermission(req.user, 'order.create');
    
    if (!canCreateOrder) {
      return res.status(403).json({ 
        success: false, 
        message: "Bạn không có quyền tạo đơn hàng" 
      });
    }

    const {
      customer_id,
      items,
      shipping_address,
      billing_address,
      payment_method,
      notes,
      discount_code,
      shipping_fee = 0
    } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Danh sách sản phẩm không hợp lệ"
      });
    }

    if (!customer_id) {
      return res.status(400).json({
        success: false,
        message: "ID khách hàng là bắt buộc"
      });
    }

    // Kiểm tra khách hàng tồn tại
    const [customerExists] = await pool.execute(
      `SELECT * FROM nguoi_dung WHERE id = ?`,
      [customer_id]
    );

    if (!customerExists || customerExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Khách hàng không tồn tại"
      });
    }

    const customer = customerExists[0];

    // Validate từng sản phẩm trong đơn hàng
    for (const item of items) {
      if (!item.product_id || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Thông tin sản phẩm không hợp lệ"
        });
      }

      // Kiểm tra sản phẩm tồn tại và còn hàng
      const [productExists] = await pool.execute(
        `SELECT sp.*, tk.so_luong as stock_quantity
         FROM sanpham sp
         LEFT JOIN ton_kho tk ON sp.id = tk.san_pham_id
         WHERE sp.id = ? AND sp.trang_thai = 'active'`,
        [item.product_id]
      );

      if (!productExists || productExists.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Sản phẩm ID ${item.product_id} không tồn tại hoặc không còn bán`
        });
      }

      const product = productExists[0];
      
      // Kiểm tra số lượng tồn kho
      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm "${product.ten}" không đủ hàng. Tồn kho: ${product.stock_quantity}, yêu cầu: ${item.quantity}`
        });
      }
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Tạo mã đơn hàng
      const orderCode = await generateOrderCode(connection);
      
      // Tính toán tổng tiền
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const [productData] = await connection.execute(
          `SELECT sp.*, tk.so_luong as stock_quantity
           FROM sanpham sp
           LEFT JOIN ton_kho tk ON sp.id = tk.san_pham_id
           WHERE sp.id = ?`,
          [item.product_id]
        );

        const product = productData[0];
        const itemTotal = product.gia_ban * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: product.gia_ban,
          total_price: itemTotal,
          product_name: product.ten
        });
      }

      // Áp dụng mã giảm giá nếu có
      let discount_amount = 0;
      if (discount_code) {
        const [discountData] = await connection.execute(
          `SELECT * FROM khuyen_mai 
           WHERE ma_code = ? AND trang_thai = 'active' 
           AND thoi_gian_bat_dau <= NOW() AND thoi_gian_ket_thuc >= NOW()
           AND so_luong_su_dung < so_luong_toi_da`,
          [discount_code]
        );

        if (discountData && discountData.length > 0) {
          const discount = discountData[0];
          if (discount.loai === 'percent') {
            discount_amount = (subtotal * discount.gia_tri) / 100;
          } else {
            discount_amount = discount.gia_tri;
          }
          
          // Đảm bảo discount không vượt quá subtotal
          discount_amount = Math.min(discount_amount, subtotal);
        }
      }

      const total_amount = subtotal - discount_amount + shipping_fee;

      // Tạo đơn hàng
      const [orderResult] = await connection.execute(
        `INSERT INTO don_hang (
          ma_don_hang, nguoi_dung_id, tong_tien, 
          phuong_thuc_thanh_toan, trang_thai, 
          ghi_chu, dia_chi_giao_hang, dia_chi_hoa_don,
          khuyen_mai_id, tien_giam_gia, phi_ship
        ) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?)`,
        [
          orderCode, 
          customer_id, 
          total_amount,
          payment_method || 'cash',
          notes || null,
          shipping_address || customer.dia_chi,
          billing_address || shipping_address || customer.dia_chi,
          discount_code || null,
          discount_amount,
          shipping_fee
        ]
      );

      const orderId = orderResult.insertId;

      // Thêm chi tiết đơn hàng
      for (const item of orderItems) {
        await connection.execute(
          `INSERT INTO don_hang_chitiet (don_hang_id, san_pham_id, so_luong, don_gia)
           VALUES (?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.unit_price]
        );

        // Cập nhật tồn kho tạm thời (sẽ cập nhật khi xác nhận đơn hàng)
        await connection.execute(
          `UPDATE ton_kho 
           SET so_luong = so_luong - ? 
           WHERE san_pham_id = ?`,
          [item.quantity, item.product_id]
        );
      }

      // Cập nhật số lần sử dụng mã giảm giá
      if (discount_code) {
        await connection.execute(
          `UPDATE khuyen_mai 
           SET so_luong_su_dung = so_luong_su_dung + 1 
           WHERE ma_code = ?`,
          [discount_code]
        );
      }

      await connection.commit();

      // Lấy thông tin đơn hàng vừa tạo
      const [newOrder] = await connection.execute(
        `SELECT dh.*, nd.ho_ten as customer_name, nd.email as customer_email
         FROM don_hang dh
         LEFT JOIN nguoi_dung nd ON dh.nguoi_dung_id = nd.id
         WHERE dh.id = ?`,
        [orderId]
      );

      res.status(201).json({
        success: true,
        message: "Tạo đơn hàng thành công",
        data: {
          order: newOrder[0],
          items: orderItems,
          summary: {
            subtotal: subtotal,
            discount_amount: discount_amount,
            shipping_fee: shipping_fee,
            total_amount: total_amount
          }
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo đơn hàng",
      error: error.message
    });
  }
}

/**
 * Tạo mã đơn hàng tự động
 */
async function generateOrderCode(connection) {
  const prefix = 'DH';
  const today = new Date();
  const dateStr = today.getFullYear().toString().slice(-2) + 
                  (today.getMonth() + 1).toString().padStart(2, '0') + 
                  today.getDate().toString().padStart(2, '0');
  
  const [lastOrder] = await connection.execute(
    `SELECT ma_don_hang 
     FROM don_hang 
     WHERE ma_don_hang LIKE ? 
     ORDER BY id DESC 
     LIMIT 1`,
    [`${prefix}${dateStr}%`]
  );

  let sequence = 1;
  if (lastOrder && lastOrder.length > 0) {
    const lastCode = lastOrder[0].ma_don_hang;
    const lastSequence = parseInt(lastCode.slice(-4));
    sequence = lastSequence + 1;
  }

  return `${prefix}${dateStr}${sequence.toString().padStart(4, '0')}`;
}

export default withAuth(handler);
