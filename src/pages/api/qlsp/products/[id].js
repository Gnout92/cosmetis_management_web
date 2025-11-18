// src/pages/api/qlsp/products/[id].js
import { getPool } from "../../../../lib/database/db";
import { withAuth } from "../../../../lib/middleware/auth";
import { TABLES } from "../../../../lib/database/schema";

/**
 * API: Quản lý sản phẩm theo ID
 * GET: Lấy chi tiết sản phẩm
 * PUT: Cập nhật sản phẩm
 * DELETE: Xóa/ẩn sản phẩm
 */

async function handler(req, res) {
  const pool = getPool();
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Thiếu ID sản phẩm",
    });
  }

  try {
    // GET: Lấy chi tiết sản phẩm
    if (req.method === "GET") {
      const [products] = await pool.execute(
        `SELECT 
          sp.MaSanPham as id,
          sp.TenSanPham as name,
          sp.MoTa as description,
          sp.Gia as price,
          sp.GiaGoc as originalPrice,
          sp.MaDanhMuc as categoryId,
          sp.MaThuongHieu as brandId,
          sp.is_an as isHidden,
          sp.NgayTao as createdAt,
          sp.NgayCapNhat as updatedAt,
          dm.ten as categoryName,
          th.ten as brandName,
          COALESCE(SUM(tk.so_luong_ton), 0) as totalStock
        FROM sanpham sp
        LEFT JOIN danh_muc dm ON sp.MaDanhMuc = dm.id
        LEFT JOIN thuong_hieu th ON sp.MaThuongHieu = th.id
        LEFT JOIN ton_kho tk ON sp.MaSanPham = tk.san_pham_id
        WHERE sp.MaSanPham = ?
        GROUP BY sp.MaSanPham`,
        [id]
      );

      if (!products || products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm",
        });
      }

      return res.status(200).json({
        success: true,
        data: products[0],
      });
    }

    // PUT: Cập nhật sản phẩm
    if (req.method === "PUT") {
      const {
        name,
        description,
        price,
        originalPrice,
        categoryId,
        brandId,
        isHidden,
      } = req.body;

      // Kiểm tra sản phẩm tồn tại
      const [existing] = await pool.execute(
        `SELECT MaSanPham FROM sanpham WHERE MaSanPham = ?`,
        [id]
      );

      if (!existing || existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm",
        });
      }

      // Build UPDATE query dynamically
      let updateFields = [];
      let updateValues = [];

      if (name !== undefined) {
        updateFields.push("TenSanPham = ?");
        updateValues.push(name);
      }
      if (description !== undefined) {
        updateFields.push("MoTa = ?");
        updateValues.push(description);
      }
      if (price !== undefined) {
        updateFields.push("Gia = ?");
        updateValues.push(parseFloat(price));
      }
      if (originalPrice !== undefined) {
        updateFields.push("GiaGoc = ?");
        updateValues.push(parseFloat(originalPrice));
      }
      if (categoryId !== undefined) {
        updateFields.push("MaDanhMuc = ?");
        updateValues.push(categoryId);
      }
      if (brandId !== undefined) {
        updateFields.push("MaThuongHieu = ?");
        updateValues.push(brandId);
      }
      if (isHidden !== undefined) {
        updateFields.push("is_an = ?");
        updateValues.push(isHidden ? 1 : 0);
        if (isHidden) {
          updateFields.push("thoi_gian_an = NOW()");
          updateFields.push("an_boi = ?");
          updateValues.push(req.user.id);
        }
      }

      updateFields.push("NgayCapNhat = NOW()");

      if (updateFields.length === 1) {
        // Chỉ có NgayCapNhat
        return res.status(400).json({
          success: false,
          message: "Không có dữ liệu để cập nhật",
        });
      }

      await pool.execute(
        `UPDATE sanpham 
        SET ${updateFields.join(", ")} 
        WHERE MaSanPham = ?`,
        [...updateValues, id]
      );

      // Lấy thông tin sản phẩm sau khi update
      const [updated] = await pool.execute(
        `SELECT 
          sp.MaSanPham as id,
          sp.TenSanPham as name,
          sp.MoTa as description,
          sp.Gia as price,
          sp.GiaGoc as originalPrice,
          sp.MaDanhMuc as categoryId,
          sp.MaThuongHieu as brandId,
          sp.is_an as isHidden,
          dm.ten as categoryName,
          th.ten as brandName
        FROM sanpham sp
        LEFT JOIN danh_muc dm ON sp.MaDanhMuc = dm.id
        LEFT JOIN thuong_hieu th ON sp.MaThuongHieu = th.id
        WHERE sp.MaSanPham = ?`,
        [id]
      );

      return res.status(200).json({
        success: true,
        message: "Cập nhật sản phẩm thành công",
        data: updated[0],
      });
    }

    // DELETE: Xóa/ẩn sản phẩm
    if (req.method === "DELETE") {
      // Không xóa hẳn, chỉ đánh dấu ẩn
      await pool.execute(
        `UPDATE sanpham 
        SET is_an = 1, thoi_gian_an = NOW(), an_boi = ? 
        WHERE MaSanPham = ?`,
        [req.user.id, id]
      );

      return res.status(200).json({
        success: true,
        message: "Ẩn sản phẩm thành công",
      });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    console.error("[/api/qlsp/products/[id]] error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + err.message,
    });
  }
}

export default withAuth(handler, ["Admin", "QL_SanPham"]);
