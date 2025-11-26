// src/pages/api/products/[id]/delete.js
import { getPool } from "../../../../lib/database/db";
import { withAuth } from "../../../../lib/middleware/auth";
import { hasPermission } from "../../../../lib/auth/permissionManager";

/**
 * API: Xóa sản phẩm
 * DELETE: Xóa sản phẩm (Admin & QL_SanPham only)
 */
async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();
  const { id } = req.query;

  try {
    // Kiểm tra quyền truy cập
    if (!hasPermission(req.user, 'product.delete')) {
      return res.status(403).json({ 
        success: false, 
        message: "Bạn không có quyền xóa sản phẩm" 
      });
    }

    // Kiểm tra sản phẩm tồn tại
    const [productExists] = await pool.execute(
      `SELECT sp.*, 
              (SELECT COUNT(*) FROM don_hang_chitiet dhct WHERE dhct.san_pham_id = sp.id) as order_count
       FROM sanpham sp 
       WHERE sp.id = ?`,
      [id]
    );

    if (!productExists || productExists.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Sản phẩm không tồn tại" 
      });
    }

    const product = productExists[0];

    // Không cho phép xóa sản phẩm đã có trong đơn hàng
    if (product.order_count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Không thể xóa sản phẩm đã có trong đơn hàng. Hãy vô hiệu hóa sản phẩm thay thế." 
      });
    }

    // Bắt đầu transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Xóa các liên quan trong bảng trung gian trước
      await connection.execute(
        `DELETE FROM sanpham_thuonghieu WHERE san_pham_id = ?`,
        [id]
      );
      
      await connection.execute(
        `DELETE FROM sanpham_danhmuc WHERE san_pham_id = ?`,
        [id]
      );

      // Xóa tồn kho liên quan
      await connection.execute(
        `DELETE FROM ton_kho WHERE san_pham_id = ?`,
        [id]
      );

      // Xóa sản phẩm chính
      await connection.execute(
        `DELETE FROM sanpham WHERE id = ?`,
        [id]
      );

      await connection.commit();
      
      res.status(200).json({
        success: true,
        message: "Xóa sản phẩm thành công",
        deletedProduct: {
          id: product.id,
          ten: product.ten,
          ma_sp: product.ma_sp
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa sản phẩm",
      error: error.message
    });
  }
}

export default withAuth(handler);
