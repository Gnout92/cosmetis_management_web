// src/pages/api/products/[id]/tags.js
import { getPool } from "../../../../lib/database/db";
import { withAuth } from "../../../../lib/middleware/auth";
import { hasPermission } from "../../../../lib/auth/permissionManager";

/**
 * API: Quản lý tags/thuộc tính sản phẩm
 * GET: Lấy danh sách tags của sản phẩm
 * POST: Thêm tag mới
 * PUT: Cập nhật tags
 * DELETE: Xóa tag
 */

async function handler(req, res) {
  const pool = getPool();
  const { id } = req.query;

  try {
    // Kiểm tra quyền truy cập
    if (!hasPermission(req.user, 'product.tag_manage')) {
      return res.status(403).json({ 
        success: false, 
        message: "Bạn không có quyền quản lý tags sản phẩm" 
      });
    }

    // Kiểm tra sản phẩm tồn tại
    const [productExists] = await pool.execute(
      `SELECT * FROM sanpham WHERE id = ?`,
      [id]
    );

    if (!productExists || productExists.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Sản phẩm không tồn tại" 
      });
    }

    if (req.method === "GET") {
      return getProductTags(req, res, pool, id);
    } else if (req.method === "POST") {
      return addProductTag(req, res, pool, id);
    } else if (req.method === "PUT") {
      return updateProductTags(req, res, pool, id);
    } else if (req.method === "DELETE") {
      return deleteProductTag(req, res, pool, id);
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

  } catch (error) {
    console.error('Error in product tags handler:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
}

/**
 * Lấy danh sách tags của sản phẩm
 */
async function getProductTags(req, res, pool, productId) {
  try {
    const [tags] = await pool.execute(
      `SELECT 
          pt.id,
          pt.ten as tag_name,
          pt.gia_tri as tag_value,
          pt.loai as tag_type,
          pt.mau_sac as color,
          pt.kich_thuoc as size,
          pt.trong_luong as weight,
          pt.ngay_tao,
          pt.ngay_cap_nhat
       FROM product_tags pt
       WHERE pt.san_pham_id = ?
       ORDER BY pt.loai, pt.ten`,
      [productId]
    );

    // Nhóm tags theo loại
    const groupedTags = tags.reduce((acc, tag) => {
      if (!acc[tag.tag_type]) {
        acc[tag.tag_type] = [];
      }
      acc[tag.tag_type].push(tag);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        tags: tags,
        groupedTags: groupedTags,
        total: tags.length
      }
    });

  } catch (error) {
    console.error('Error getting product tags:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách tags"
    });
  }
}

/**
 * Thêm tag mới cho sản phẩm
 */
async function addProductTag(req, res, pool, productId) {
  const { tag_name, tag_value, tag_type, color, size, weight } = req.body;

  // Validation
  if (!tag_name || !tag_type) {
    return res.status(400).json({
      success: false,
      message: "Tên tag và loại tag là bắt buộc"
    });
  }

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Thêm tag mới
      const [result] = await connection.execute(
        `INSERT INTO product_tags (
          san_pham_id, ten, gia_tri, loai, mau_sac, kich_thuoc, trong_luong, ngay_tao
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [productId, tag_name, tag_value || tag_name, tag_type, color, size, weight]
      );

      const newTagId = result.insertId;

      // Lấy tag vừa tạo
      const [newTag] = await connection.execute(
        `SELECT * FROM product_tags WHERE id = ?`,
        [newTagId]
      );

      await connection.commit();

      res.status(201).json({
        success: true,
        message: "Thêm tag thành công",
        data: newTag[0]
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error adding product tag:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm tag"
    });
  }
}

/**
 * Cập nhật tags của sản phẩm
 */
async function updateProductTags(req, res, pool, productId) {
  const { tags } = req.body;

  if (!Array.isArray(tags)) {
    return res.status(400).json({
      success: false,
      message: "Danh sách tags phải là mảng"
    });
  }

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Xóa tất cả tags cũ
      await connection.execute(
        `DELETE FROM product_tags WHERE san_pham_id = ?`,
        [productId]
      );

      // Thêm tags mới
      if (tags.length > 0) {
        const values = tags.map(tag => [
          productId, 
          tag.tag_name, 
          tag.tag_value || tag.tag_name, 
          tag.tag_type,
          tag.color,
          tag.size,
          tag.weight,
          NOW()
        ]);

        await connection.execute(
          `INSERT INTO product_tags (
            san_pham_id, ten, gia_tri, loai, mau_sac, kich_thuoc, trong_luong, ngay_tao
          ) VALUES ?`,
          [values]
        );
      }

      await connection.commit();

      res.status(200).json({
        success: true,
        message: "Cập nhật tags thành công",
        data: {
          updatedCount: tags.length
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error updating product tags:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật tags"
    });
  }
}

/**
 * Xóa tag
 */
async function deleteProductTag(req, res, pool, productId) {
  const { tag_id } = req.body;

  if (!tag_id) {
    return res.status(400).json({
      success: false,
      message: "ID tag là bắt buộc"
    });
  }

  try {
    const [result] = await pool.execute(
      `DELETE FROM product_tags 
       WHERE id = ? AND san_pham_id = ?`,
      [tag_id, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Tag không tồn tại"
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa tag thành công"
    });

  } catch (error) {
    console.error('Error deleting product tag:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa tag"
    });
  }
}

export default withAuth(handler);
