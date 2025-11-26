// src/pages/api/products/[id]/media.js
import { getPool } from "../../../../lib/database/db";
import { withAuth } from "../../../../lib/middleware/auth";
import { hasPermission } from "../../../../lib/auth/permissionManager";
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

/**
 * API: Cập nhật hình ảnh sản phẩm
 * POST: Upload hình ảnh mới
 * DELETE: Xóa hình ảnh
 */

// Cấu hình multer cho upload hình ảnh
const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'products');
      try {
        await fs.mkdir(uploadPath, { recursive: true });
        cb(null, uploadPath);
      } catch (error) {
        cb(error);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `product-${req.params.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file hình ảnh (jpeg, jpg, png, gif, webp)'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

/**
 * Upload hình ảnh mới
 */
async function uploadHandler(req, res) {
  const pool = getPool();
  const { id } = req.query;

  try {
    // Kiểm tra quyền truy cập
    if (!hasPermission(req.user, 'product.media_update')) {
      return res.status(403).json({ 
        success: false, 
        message: "Bạn không có quyền cập nhật hình ảnh sản phẩm" 
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

    // Upload file
    const uploadMiddleware = upload.single('image');
    
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Không có file nào được upload"
        });
      }

      const imageUrl = `/uploads/products/${req.file.filename}`;

      try {
        // Cập nhật URL hình ảnh trong database
        await pool.execute(
          `UPDATE sanpham SET hinh_anh = ?, ngay_cap_nhat = NOW() WHERE id = ?`,
          [imageUrl, id]
        );

        res.status(200).json({
          success: true,
          message: "Cập nhật hình ảnh thành công",
          imageUrl: imageUrl,
          filename: req.file.filename
        });

      } catch (error) {
        // Xóa file đã upload nếu có lỗi database
        try {
          await fs.unlink(path.join(process.cwd(), 'public', imageUrl));
        } catch (unlinkError) {
          console.error('Error deleting uploaded file:', unlinkError);
        }
        
        console.error('Error updating product image:', error);
        res.status(500).json({
          success: false,
          message: "Lỗi server khi cập nhật hình ảnh"
        });
      }
    });

  } catch (error) {
    console.error('Error in upload handler:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
}

/**
 * Xóa hình ảnh
 */
async function deleteHandler(req, res) {
  const pool = getPool();
  const { id } = req.query;
  const { imageUrl } = req.body;

  try {
    // Kiểm tra quyền truy cập
    if (!hasPermission(req.user, 'product.media_update')) {
      return res.status(403).json({ 
        success: false, 
        message: "Bạn không có quyền xóa hình ảnh sản phẩm" 
      });
    }

    // Xóa file vật lý
    if (imageUrl && imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', imageUrl);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.warn('File not found or could not be deleted:', filePath);
      }
    }

    // Cập nhật database
    await pool.execute(
      `UPDATE sanpham SET hinh_anh = NULL, ngay_cap_nhat = NOW() WHERE id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Xóa hình ảnh thành công"
    });

  } catch (error) {
    console.error('Error deleting product image:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa hình ảnh"
    });
  }
}

async function handler(req, res) {
  if (req.method === "POST") {
    return uploadHandler(req, res);
  } else if (req.method === "DELETE") {
    return deleteHandler(req, res);
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default withAuth(handler);
