// src/pages/api/qlkho/export.js
import { getPool } from "../../../lib/database/db";
import { withAuth } from "../../../lib/middleware/auth";

/**
 * API: Xuất kho
 * POST: Xuất sản phẩm khỏi kho
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
        message: "Vui lòng nhập đầy đủ sản phẩm và số lượng xuất kho",
      });
    }

    // Kiểm tra tồn kho
    const [stocks] = await pool.execute(
      `SELECT 
        tk.so_luong_ton,
        tk.so_luong_giu_cho,
        sp.TenSanPham,
        km.ten_kho
      FROM ton_kho tk
      JOIN sanpham sp ON tk.san_pham_id = sp.MaSanPham
      JOIN kho_moi km ON tk.kho_id = km.id
      WHERE tk.san_pham_id = ? AND tk.kho_id = ?`,
      [productId, warehouseId]
    );

    if (!stocks || stocks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm chưa có trong kho",
      });
    }

    const currentStock = stocks[0];
    const availableQuantity =
      currentStock.so_luong_ton - currentStock.so_luong_giu_cho;

    if (availableQuantity < parseInt(quantity)) {
      return res.status(400).json({
        success: false,
        message: `Không đủ hàng trong kho. Tồn kho khả dụng: ${availableQuantity}`,
      });
    }

    // Bắt đầu transaction
    await pool.query("START TRANSACTION");

    try {
      // Giảm tồn kho
      await pool.execute(
        `UPDATE ton_kho 
        SET so_luong_ton = so_luong_ton - ? 
        WHERE san_pham_id = ? AND kho_id = ?`,
        [parseInt(quantity), productId, warehouseId]
      );

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
              action: 'EXPORT',
              productId,
              warehouseId,
              quantity: parseInt(quantity),
              note,
              warehouse: currentStock.ten_kho
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
        message: `Xuất kho thành công ${quantity} sản phẩm`,
        data: updatedStock[0],
      });
    } catch (err) {
      await pool.query("ROLLBACK");
      throw err;
    }
  } catch (err) {
    console.error("[/api/qlkho/export] error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi xuất kho: " + err.message,
    });
  }
}

export default withAuth(handler, ["Admin", "QL_Kho"]);
