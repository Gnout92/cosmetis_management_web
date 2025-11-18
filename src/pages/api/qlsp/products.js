// src/pages/api/qlsp/products.js
import { getPool } from "../../../lib/database/db";
import { withAuth } from "../../../lib/middleware/auth";
import { TABLES, COLUMNS } from "../../../lib/database/schema";

/**
 * API: Quản lý sản phẩm
 * GET: Lấy danh sách sản phẩm (có phân trang, tìm kiếm, lọc)
 * POST: Thêm sản phẩm mới
 */

async function handler(req, res) {
  const pool = getPool();

  try {
    // GET: Lấy danh sách sản phẩm
    if (req.method === "GET") {
      const {
        page = 1,
        limit = 20,
        search = "",
        categoryId = "",
        brandId = "",
        minPrice = "",
        maxPrice = "",
        status = "all", // all, active, hidden
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);

      // Build WHERE clause
      let whereConditions = [];
      let queryParams = [];

      if (search) {
        whereConditions.push(
          "(TenSanPham LIKE ? OR MoTa LIKE ?)"
        );
        queryParams.push(`%${search}%`, `%${search}%`);
      }

      if (categoryId) {
        whereConditions.push("MaDanhMuc = ?");
        queryParams.push(categoryId);
      }

      if (brandId) {
        whereConditions.push("MaThuongHieu = ?");
        queryParams.push(brandId);
      }

      if (minPrice) {
        whereConditions.push("Gia >= ?");
        queryParams.push(parseFloat(minPrice));
      }

      if (maxPrice) {
        whereConditions.push("Gia <= ?");
        queryParams.push(parseFloat(maxPrice));
      }

      if (status === "active") {
        whereConditions.push("(is_an = 0 OR is_an IS NULL)");
      } else if (status === "hidden") {
        whereConditions.push("is_an = 1");
      }

      const whereClause =
        whereConditions.length > 0
          ? "WHERE " + whereConditions.join(" AND ")
          : "";

      // Query sản phẩm với JOIN
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
        ${whereClause}
        GROUP BY sp.MaSanPham
        ORDER BY sp.NgayCapNhat DESC
        LIMIT ? OFFSET ?`,
        [...queryParams, parseInt(limit), offset]
      );

      // Count total
      const [countResult] = await pool.execute(
        `SELECT COUNT(DISTINCT sp.MaSanPham) as total
        FROM sanpham sp
        ${whereClause}`,
        queryParams
      );

      const total = countResult[0]?.total || 0;

      return res.status(200).json({
        success: true,
        data: products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    }

    // POST: Thêm sản phẩm mới
    if (req.method === "POST") {
      const {
        name,
        description,
        price,
        originalPrice,
        categoryId,
        brandId,
      } = req.body;

      // Validation
      if (!name || !price || !categoryId) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập đầy đủ: Tên sản phẩm, Giá, Danh mục",
        });
      }

      // Insert sản phẩm
      const [result] = await pool.execute(
        `INSERT INTO sanpham 
        (TenSanPham, MoTa, Gia, GiaGoc, MaDanhMuc, MaThuongHieu, NgayTao, NgayCapNhat) 
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          name,
          description || "",
          parseFloat(price),
          originalPrice ? parseFloat(originalPrice) : parseFloat(price),
          categoryId,
          brandId || null,
        ]
      );

      // Lấy thông tin sản phẩm vừa tạo
      const [newProduct] = await pool.execute(
        `SELECT 
          sp.MaSanPham as id,
          sp.TenSanPham as name,
          sp.MoTa as description,
          sp.Gia as price,
          sp.GiaGoc as originalPrice,
          sp.MaDanhMuc as categoryId,
          sp.MaThuongHieu as brandId,
          dm.ten as categoryName,
          th.ten as brandName,
          sp.NgayTao as createdAt
        FROM sanpham sp
        LEFT JOIN danh_muc dm ON sp.MaDanhMuc = dm.id
        LEFT JOIN thuong_hieu th ON sp.MaThuongHieu = th.id
        WHERE sp.MaSanPham = ?`,
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message: "Thêm sản phẩm thành công",
        data: newProduct[0],
      });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    console.error("[/api/qlsp/products] error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + err.message,
    });
  }
}

// Chỉ Admin và QL_SanPham mới có quyền truy cập
export default withAuth(handler, ["Admin", "QL_SanPham"]);
