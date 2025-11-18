// src/pages/api/qlkho/import.js
import { getPool } from "../../../lib/database/db";
import { withAuth } from "../../../lib/middleware/auth";

/**
 * API: Nhập kho
 * POST: Nhập sản phẩm vào kho
 * Chỉ cho phép: QL_Kho, Admin
 */

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();

  try {
    const { productId, warehouseId = 1, quantity, note = "" } = req.body;

    // Validation
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ sản phẩm và số lượng nhập kho",
      });
    }

    // Kiểm tra sản phẩm tồn tại
    const [products] = await pool.execute(
      `SELECT MaSanPham, TenSanPham, MaDanhMuc FROM sanpham WHERE MaSanPham = ?`,
      [productId]
    );

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    const product = products[0];

    // Kiểm tra kho có tồn tại không
    const [warehouses] = await pool.execute(
      `SELECT id, ten_kho, danh_muc_id FROM kho_moi WHERE id = ?`,
      [warehouseId]
    );

    if (!warehouses || warehouses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy kho",
      });
    }

    const warehouse = warehouses[0];

    // Kiểm tra danh mục của sản phẩm và kho có khớp không (theo database constraint)
    if (product.MaDanhMuc !== warehouse.danh_muc_id) {
      return res.status(400).json({
        success: false,
        message: `Sản phẩm thuộc danh mục khác với kho. Kho chỉ chứa sản phẩm cùng danh mục.`,
      });
    }

    // Bắt đầu transaction
    await pool.query("START TRANSACTION");

    try {
      // Kiểm tra xem đã có record tồn kho chưa
      const [existingStock] = await pool.execute(
        `SELECT so_luong_ton FROM ton_kho 
        WHERE san_pham_id = ? AND kho_id = ?`,
        [productId, warehouseId]
      );

      if (existingStock && existingStock.length > 0) {
        // Update tồn kho
        await pool.execute(
          `UPDATE ton_kho 
          SET so_luong_ton = so_luong_ton + ? 
          WHERE san_pham_id = ? AND kho_id = ?`,
          [parseInt(quantity), productId, warehouseId]
        );
      } else {
        // Insert record mới
        await pool.execute(
          `INSERT INTO ton_kho (san_pham_id, kho_id, so_luong_ton, so_luong_giu_cho) 
          VALUES (?, ?, ?, 0)`,
          [productId, warehouseId, parseInt(quantity)]
        );
      }

      // Ghi log vào bảng nhat_ky_hoat_dong
      try {
        await pool.execute(
          `INSERT INTO nhat_ky_hoat_dong (bang, ban_ghi_id, hanh_dong, du_lieu_moi, thuc_hien_boi) 
          VALUES (?, ?, ?, ?, ?)`,
          [
            'ton_kho',
            productId,
            'UPDATE',
            JSON.stringify({
              action: 'IMPORT',
              productId,
              warehouseId,
              quantity: parseInt(quantity),
              note,
              warehouse: warehouse.ten_kho
            }),
            req.user.id
          ]
        );
      } catch (logErr) {
        console.log("Log insert failed, skipping...", logErr.message);
      }

      await pool.query("COMMIT");

      // Lấy tồn kho mới
      const [updatedStock] = await pool.execute(
        `SELECT 
          sp.MaSanPham as productId,
          sp.TenSanPham as productName,
          tk.so_luong_ton as quantityOnHand,
          tk.so_luong_giu_cho as quantityReserved,
          (tk.so_luong_ton - tk.so_luong_giu_cho) as availableQuantity,
          km.ten_kho as warehouseName
        FROM ton_kho tk
        JOIN sanpham sp ON tk.san_pham_id = sp.MaSanPham
        JOIN kho_moi km ON tk.kho_id = km.id
        WHERE tk.san_pham_id = ? AND tk.kho_id = ?`,
        [productId, warehouseId]
      );

      return res.status(200).json({
        success: true,
        message: `Nhập kho thành công ${quantity} sản phẩm`,
        data: updatedStock[0],
      });
    } catch (err) {
      await pool.query("ROLLBACK");
      throw err;
    }
  } catch (err) {
    console.error("[/api/qlkho/import] error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi nhập kho: " + err.message,
    });
  }
}

export default withAuth(handler, ["Admin", "QL_Kho"]);
