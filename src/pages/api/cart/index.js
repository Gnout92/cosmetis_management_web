// src/pages/api/cart/index.js
import { getPool } from "../../../lib/database/db";
import { withAuth } from "../../../lib/middleware/auth";
import { hasPermission } from "../../../lib/auth/permissionManager";

/**
 * API: Quản lý giỏ hàng
 * GET: Lấy thông tin giỏ hàng của user
 * POST: Thêm sản phẩm vào giỏ hàng
 * PUT: Cập nhật số lượng sản phẩm trong giỏ hàng
 * DELETE: Xóa sản phẩm khỏi giỏ hàng
 * DELETE: Xóa toàn bộ giỏ hàng
 */

async function handler(req, res) {
  const pool = getPool();

  try {
    if (req.method === "GET") {
      return getCart(req, res, pool);
    } else if (req.method === "POST") {
      return addToCart(req, res, pool);
    } else if (req.method === "PUT") {
      return updateCartItem(req, res, pool);
    } else if (req.method === "DELETE") {
      return clearCart(req, res, pool);
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

  } catch (error) {
    console.error('Error in cart handler:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
}

/**
 * Lấy thông tin giỏ hàng
 */
async function getCart(req, res, pool) {
  try {
    // Kiểm tra quyền
    if (!hasPermission(req.user, 'cart.manage_self') && req.user.role !== 'Customer') {
      return res.status(403).json({ 
        success: false, 
        message: "Bạn không có quyền truy cập giỏ hàng" 
      });
    }

    const [cartItems] = await pool.execute(`
      SELECT 
        gh.id,
        gh.so_luong,
        gh.ngay_them,
        sp.id as product_id,
        sp.ma_sp,
        sp.ten,
        sp.gia_ban,
        sp.gia_khuyen_mai,
        sp.hinh_anh,
        sp.mo_ta,
        sp.danh_gia_trung_binh,
        sp.so_luong_danh_gia,
        -- Thông tin tồn kho
        COALESCE((SELECT SUM(tk.so_luong) FROM ton_kho tk WHERE tk.san_pham_id = sp.id), 0) as stock_quantity,
        -- Tính toán giá
        CASE 
          WHEN sp.gia_khuyen_mai IS NOT NULL AND sp.gia_khuyen_mai < sp.gia_ban 
          THEN sp.gia_khuyen_mai 
          ELSE sp.gia_ban 
        END as final_price,
        CASE 
          WHEN sp.gia_khuyen_mai IS NOT NULL AND sp.gia_khuyen_mai < sp.gia_ban 
          THEN sp.gia_ban - sp.gia_khuyen_mai 
          ELSE 0 
        END as discount_amount,
        CASE 
          WHEN sp.gia_khuyen_mai IS NOT NULL AND sp.gia_khuyen_mai < sp.gia_ban 
          THEN ROUND(((sp.gia_ban - sp.gia_khuyen_mai) / sp.gia_ban) * 100)
          ELSE 0 
        END as discount_percent,
        -- Tính tổng cho item
        gh.so_luong * CASE 
          WHEN sp.gia_khuyen_mai IS NOT NULL AND sp.gia_khuyen_mai < sp.gia_ban 
          THEN sp.gia_khuyen_mai 
          ELSE sp.gia_ban 
        END as item_total
      FROM gio_hang gh
      JOIN sanpham sp ON gh.san_pham_id = sp.id
      WHERE gh.nguoi_dung_id = ?
        AND sp.trang_thai = 'active'
      ORDER BY gh.ngay_them DESC
    `, [req.user.id]);

    // Tính toán tổng giỏ hàng
    let totalItems = 0;
    let totalAmount = 0;
    let totalDiscount = 0;

    const processedCartItems = cartItems.map(item => {
      totalItems += item.so_luong;
      totalAmount += item.item_total;
      totalDiscount += item.discount_amount * item.so_luong;

      return {
        ...item,
        in_stock: item.stock_quantity > 0,
        stock_status: item.stock_quantity > 10 ? 'in_stock' : 
                     item.stock_quantity > 0 ? 'low_stock' : 'out_of_stock',
        can_purchase: item.stock_quantity > 0
      };
    });

    // Thống kê theo danh mục
    const [categoryStats] = await pool.execute(`
      SELECT 
        dm.ten as category_name,
        COUNT(*) as item_count,
        SUM(gh.so_luong * CASE 
          WHEN sp.gia_khuyen_mai IS NOT NULL AND sp.gia_khuyen_mai < sp.gia_ban 
          THEN sp.gia_khuyen_mai 
          ELSE sp.gia_ban 
        END) as category_total
      FROM gio_hang gh
      JOIN sanpham sp ON gh.san_pham_id = sp.id
      JOIN sanpham_danhmuc spdm ON sp.id = spdm.san_pham_id
      JOIN danh_muc dm ON spdm.danh_muc_id = dm.id
      WHERE gh.nguoi_dung_id = ? AND sp.trang_thai = 'active'
      GROUP BY dm.id, dm.ten
      ORDER BY category_total DESC
    `, [req.user.id]);

    // Sản phẩm gợi ý (cùng danh mục với sản phẩm trong giỏ hàng)
    let recommendedProducts = [];
    if (cartItems.length > 0) {
      const productIds = cartItems.map(item => item.product_id).join(',');
      
      const [recommendations] = await pool.execute(`
        SELECT DISTINCT
          sp.id,
          sp.ma_sp,
          sp.ten,
          sp.gia_ban,
          sp.gia_khuyen_mai,
          sp.hinh_anh,
          sp.danh_gia_trung_binh,
          COALESCE((SELECT SUM(tk.so_luong) FROM ton_kho tk WHERE tk.san_pham_id = sp.id), 0) as stock_quantity
        FROM sanpham sp
        JOIN sanpham_danhmuc spdm ON sp.id = spdm.san_pham_id
        WHERE spdm.danh_muc_id IN (
          SELECT DISTINCT spdm2.danh_muc_id 
          FROM sanpham_danhmuc spdm2 
          WHERE spdm2.san_pham_id IN (${productIds})
        )
          AND sp.id NOT IN (${productIds})
          AND sp.trang_thai = 'active'
          AND sp.duyet = 1
        ORDER BY sp.danh_gia_trung_binh DESC, sp.so_luong_ban DESC
        LIMIT 5
      `);

      recommendedProducts = recommendations.map(product => ({
        ...product,
        final_price: product.gia_khuyen_mai && product.gia_khuyen_mai < product.gia_ban 
          ? product.gia_khuyen_mai 
          : product.gia_ban,
        in_stock: product.stock_quantity > 0
      }));
    }

    res.status(200).json({
      success: true,
      data: {
        cart_items: processedCartItems,
        summary: {
          total_items: totalItems,
          total_amount: totalAmount,
          total_discount: totalDiscount,
          final_amount: totalAmount - totalDiscount,
          item_count: cartItems.length
        },
        category_stats: categoryStats,
        recommendations: recommendedProducts,
        cart_info: {
          created_at: cartItems.length > 0 ? cartItems[0].ngay_them : null,
          last_updated: cartItems.length > 0 ? cartItems[0].ngay_them : null
        }
      }
    });

  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin giỏ hàng"
    });
  }
}

/**
 * Thêm sản phẩm vào giỏ hàng
 */
async function addToCart(req, res, pool) {
  const { product_id, quantity = 1 } = req.body;

  try {
    // Validation
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "ID sản phẩm là bắt buộc"
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Số lượng phải lớn hơn 0"
      });
    }

    // Kiểm tra sản phẩm tồn tại và còn hàng
    const [productCheck] = await pool.execute(`
      SELECT sp.*, 
             COALESCE((SELECT SUM(tk.so_luong) FROM ton_kho tk WHERE tk.san_pham_id = sp.id), 0) as stock_quantity
      FROM sanpham sp
      WHERE sp.id = ? AND sp.trang_thai = 'active'
    `, [product_id]);

    if (!productCheck || productCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại hoặc không còn bán"
      });
    }

    const product = productCheck[0];
    
    if (product.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Sản phẩm "${product.ten}" chỉ còn ${product.stock_quantity} trong kho`
      });
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const [existingItem] = await pool.execute(
      `SELECT * FROM gio_hang WHERE nguoi_dung_id = ? AND san_pham_id = ?`,
      [req.user.id, product_id]
    );

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      let cartItemId;
      let message;

      if (existingItem && existingItem.length > 0) {
        // Cập nhật số lượng nếu đã có
        const currentQuantity = existingItem[0].so_luong;
        const newQuantity = currentQuantity + quantity;

        if (newQuantity > product.stock_quantity) {
          throw new Error(`Không thể thêm quá số lượng tồn kho. Tối đa có thể thêm ${product.stock_quantity - currentQuantity} sản phẩm`);
        }

        await connection.execute(
          `UPDATE gio_hang SET so_luong = ?, ngay_cap_nhat = NOW() WHERE id = ?`,
          [newQuantity, existingItem[0].id]
        );

        cartItemId = existingItem[0].id;
        message = `Đã cập nhật số lượng sản phẩm "${product.ten}" trong giỏ hàng`;
      } else {
        // Thêm mới
        const [result] = await connection.execute(
          `INSERT INTO gio_hang (nguoi_dung_id, san_pham_id, so_luong, ngay_them)
           VALUES (?, ?, ?, NOW())`,
          [req.user.id, product_id, quantity]
        );

        cartItemId = result.insertId;
        message = `Đã thêm "${product.ten}" vào giỏ hàng`;
      }

      await connection.commit();

      // Lấy thông tin giỏ hàng sau khi cập nhật
      const [updatedCart] = await connection.execute(`
        SELECT COUNT(*) as total_items, 
               SUM(so_luong * (
                 SELECT CASE 
                   WHEN sp.gia_khuyen_mai IS NOT NULL AND sp.gia_khuyen_mai < sp.gia_ban 
                   THEN sp.gia_khuyen_mai 
                   ELSE sp.gia_ban 
                 END
                 FROM sanpham sp WHERE sp.id = gio_hang.san_pham_id
               )) as total_amount
        FROM gio_hang 
        WHERE nguoi_dung_id = ?
      `, [req.user.id]);

      const cartSummary = updatedCart[0];

      res.status(201).json({
        success: true,
        message: message,
        data: {
          cart_item_id: cartItemId,
          product_id: product_id,
          quantity: existingItem ? existingItem[0].so_luong + quantity : quantity,
          cart_summary: {
            total_items: cartSummary.total_items,
            total_amount: cartSummary.total_amount
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
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi thêm sản phẩm vào giỏ hàng"
    });
  }
}

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 */
async function updateCartItem(req, res, pool) {
  const { cart_item_id, quantity } = req.body;

  try {
    if (!cart_item_id || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "ID item và số lượng là bắt buộc"
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Số lượng không được âm"
      });
    }

    // Lấy thông tin item hiện tại
    const [itemCheck] = await pool.execute(`
      SELECT gh.*, sp.ten, sp.stock_quantity
      FROM gio_hang gh
      JOIN sanpham sp ON gh.san_pham_id = sp.id
      WHERE gh.id = ? AND gh.nguoi_dung_id = ?
    `, [cart_item_id, req.user.id]);

    if (!itemCheck || itemCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item không tồn tại trong giỏ hàng"
      });
    }

    const item = itemCheck[0];

    if (quantity === 0) {
      // Xóa item nếu số lượng = 0
      await pool.execute(
        `DELETE FROM gio_hang WHERE id = ?`,
        [cart_item_id]
      );

      res.status(200).json({
        success: true,
        message: `Đã xóa "${item.ten}" khỏi giỏ hàng`
      });
    } else {
      // Cập nhật số lượng
      if (quantity > item.stock_quantity) {
        return res.status(400).json({
          success: false,
          message: `Số lượng vượt quá tồn kho. Tối đa có thể đặt ${item.stock_quantity} sản phẩm`
        });
      }

      await pool.execute(
        `UPDATE gio_hang SET so_luong = ?, ngay_cap_nhat = NOW() WHERE id = ?`,
        [quantity, cart_item_id]
      );

      res.status(200).json({
        success: true,
        message: `Đã cập nhật số lượng "${item.ten}" thành ${quantity}`
      });
    }

  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật giỏ hàng"
    });
  }
}

/**
 * Xóa toàn bộ giỏ hàng
 */
async function clearCart(req, res, pool) {
  try {
    const { cart_item_id } = req.query;

    if (cart_item_id) {
      // Xóa một item cụ thể
      await pool.execute(
        `DELETE FROM gio_hang WHERE id = ? AND nguoi_dung_id = ?`,
        [cart_item_id, req.user.id]
      );

      res.status(200).json({
        success: true,
        message: "Đã xóa sản phẩm khỏi giỏ hàng"
      });
    } else {
      // Xóa toàn bộ giỏ hàng
      await pool.execute(
        `DELETE FROM gio_hang WHERE nguoi_dung_id = ?`,
        [req.user.id]
      );

      res.status(200).json({
        success: true,
        message: "Đã xóa toàn bộ giỏ hàng"
      });
    }

  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa giỏ hàng"
    });
  }
}

export default withAuth(handler);
