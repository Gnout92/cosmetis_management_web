// src/pages/api/search/index.js
import { getPool } from "../../../lib/database/db";
import { withAuth } from "../../../lib/middleware/auth";

/**
 * API: Tìm kiếm sản phẩm
 * GET: Tìm kiếm sản phẩm với filter và phân trang
 */

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const pool = getPool();

  try {
    const {
      q = '',
      page = 1,
      limit = 12,
      category_id,
      brand_id,
      min_price,
      max_price,
      rating,
      in_stock,
      sort_by = 'relevance',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    // Xây dựng WHERE clause cho tìm kiếm
    let whereConditions = [
      "sp.trang_thai = 'active'",
      "sp.duyet = 1" // Sản phẩm đã được duyệt
    ];
    let queryParams = [];

    // Tìm kiếm theo từ khóa
    if (q && q.trim()) {
      const searchTerm = `%${q.trim()}%`;
      whereConditions.push(`
        (sp.ten LIKE ? 
         OR sp.ma_sp LIKE ? 
         OR sp.mo_ta LIKE ?
         OR EXISTS (
           SELECT 1 FROM sanpham_danhmuc spdm 
           JOIN danh_muc dm ON spdm.danh_muc_id = dm.id 
           WHERE spdm.san_pham_id = sp.id AND dm.ten LIKE ?
         )
         OR EXISTS (
           SELECT 1 FROM product_tags pt 
           WHERE pt.san_pham_id = sp.id 
           AND (pt.ten LIKE ? OR pt.gia_tri LIKE ?)
         ))
      `);
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Filter theo danh mục
    if (category_id) {
      whereConditions.push(`
        EXISTS (
          SELECT 1 FROM sanpham_danhmuc spdm 
          WHERE spdm.san_pham_id = sp.id AND spdm.danh_muc_id = ?
        )
      `);
      queryParams.push(category_id);
    }

    // Filter theo thương hiệu
    if (brand_id) {
      whereConditions.push(`
        EXISTS (
          SELECT 1 FROM sanpham_thuonghieu stt 
          WHERE stt.san_pham_id = sp.id AND stt.thuong_hieu_id = ?
        )
      `);
      queryParams.push(brand_id);
    }

    // Filter theo giá
    if (min_price) {
      whereConditions.push("sp.gia_ban >= ?");
      queryParams.push(min_price);
    }

    if (max_price) {
      whereConditions.push("sp.gia_ban <= ?");
      queryParams.push(max_price);
    }

    // Filter theo rating
    if (rating) {
      whereConditions.push("sp.danh_gia_trung_binh >= ?");
      queryParams.push(rating);
    }

    // Filter theo tồn kho
    if (in_stock === 'true') {
      whereConditions.push(`
        EXISTS (
          SELECT 1 FROM ton_kho tk 
          WHERE tk.san_pham_id = sp.id AND tk.so_luong > 0
        )
      `);
    }

    const whereClause = whereConditions.join(" AND ");

    // Xây dựng ORDER BY
    let orderByClause = "";
    switch (sort_by) {
      case 'price_asc':
        orderByClause = "sp.gia_ban ASC";
        break;
      case 'price_desc':
        orderByClause = "sp.gia_ban DESC";
        break;
      case 'name_asc':
        orderByClause = "sp.ten ASC";
        break;
      case 'name_desc':
        orderByClause = "sp.ten DESC";
        break;
      case 'rating':
        orderByClause = "sp.danh_gia_trung_binh DESC, sp.so_luong_danh_gia DESC";
        break;
      case 'newest':
        orderByClause = "sp.ngay_tao DESC";
        break;
      case 'popular':
        orderByClause = "(sp.so_luong_ban * 0.7 + sp.so_luong_danh_gia * 0.3) DESC";
        break;
      case 'relevance':
      default:
        if (q && q.trim()) {
          // Tính điểm relevance cho tìm kiếm
          orderByClause = `
            CASE 
              WHEN sp.ten LIKE '${`%${q.trim()}%`}' THEN 100
              WHEN sp.ma_sp LIKE '${`%${q.trim()}%`}' THEN 90
              WHEN sp.mo_ta LIKE '${`%${q.trim()}%`}' THEN 80
              ELSE 70
            END DESC,
            sp.danh_gia_trung_binh DESC,
            sp.so_luong_ban DESC
          `;
        } else {
          orderByClause = "sp.ngay_tao DESC";
        }
        break;
    }

    // Lấy danh sách sản phẩm
    const query = `
      SELECT 
        sp.id,
        sp.ma_sp,
        sp.ten,
        sp.gia_ban,
        sp.gia_khuyen_mai,
        sp.mo_ta,
        sp.hinh_anh,
        sp.danh_gia_trung_binh,
        sp.so_luong_danh_gia,
        sp.so_luong_ban,
        sp.ngay_tao,
        sp.ngay_cap_nhat,
        -- Thông tin tồn kho
        COALESCE((SELECT SUM(tk.so_luong) FROM ton_kho tk WHERE tk.san_pham_id = sp.id), 0) as total_stock,
        -- Danh mục
        GROUP_CONCAT(DISTINCT dm.ten ORDER BY dm.ten SEPARATOR ', ') as categories,
        -- Thương hiệu
        GROUP_CONCAT(DISTINCT th.ten ORDER BY th.ten SEPARATOR ', ') as brands,
        -- Tags
        GROUP_CONCAT(DISTINCT CONCAT(pt.ten, ':', pt.gia_tri) ORDER BY pt.loai SEPARATOR '; ') as tags
      FROM sanpham sp
      LEFT JOIN sanpham_danhmuc spdm ON sp.id = spdm.san_pham_id
      LEFT JOIN danh_muc dm ON spdm.danh_muc_id = dm.id
      LEFT JOIN sanpham_thuonghieu stt ON sp.id = stt.san_pham_id
      LEFT JOIN thuong_hieu th ON stt.thuong_hieu_id = th.id
      LEFT JOIN product_tags pt ON sp.id = pt.san_pham_id
      WHERE ${whereClause}
      GROUP BY sp.id
      ORDER BY ${orderByClause}
      LIMIT ? OFFSET ?
    `;

    queryParams.push(parseInt(limit), offset);

    const [products] = await pool.execute(query, queryParams);

    // Lấy tổng số sản phẩm cho phân trang
    const countQuery = `
      SELECT COUNT(DISTINCT sp.id) as total
      FROM sanpham sp
      LEFT JOIN sanpham_danhmuc spdm ON sp.id = spdm.san_pham_id
      LEFT JOIN danh_muc dm ON spdm.danh_muc_id = dm.id
      LEFT JOIN sanpham_thuonghieu stt ON sp.id = stt.san_pham_id
      LEFT JOIN thuong_hieu th ON stt.thuong_hieu_id = th.id
      LEFT JOIN product_tags pt ON sp.id = pt.san_pham_id
      WHERE ${whereClause}
    `;

    const [countResult] = await pool.execute(countQuery, queryParams.slice(0, -2)); // Loại bỏ LIMIT và OFFSET
    const totalProducts = countResult[0].total;

    const totalPages = Math.ceil(totalProducts / limit);

    // Lấy suggestions cho autocomplete
    let suggestions = [];
    if (q && q.trim().length > 2) {
      const [suggestionResults] = await pool.execute(`
        SELECT DISTINCT sp.ten, sp.ma_sp
        FROM sanpham sp
        WHERE sp.trang_thai = 'active' 
          AND (sp.ten LIKE ? OR sp.ma_sp LIKE ?)
        ORDER BY 
          CASE WHEN sp.ten LIKE ? THEN 1 ELSE 2 END,
          sp.ten
        LIMIT 5
      `, [`%${q.trim()}%`, `%${q.trim()}%`, `${q.trim()}%`]);

      suggestions = suggestionResults.map(item => ({
        text: item.ten,
        type: 'product',
        code: item.ma_sp
      }));
    }

    // Lấy danh sách danh mục và thương hiệu để filter
    const [categories] = await pool.execute(`
      SELECT dm.id, dm.ten, COUNT(sp.id) as product_count
      FROM danh_muc dm
      LEFT JOIN sanpham_danhmuc spdm ON dm.id = spdm.danh_muc_id
      LEFT JOIN sanpham sp ON spdm.san_pham_id = sp.id AND sp.trang_thai = 'active'
      GROUP BY dm.id, dm.ten
      HAVING product_count > 0
      ORDER BY dm.ten
    `);

    const [brands] = await pool.execute(`
      SELECT th.id, th.ten, COUNT(sp.id) as product_count
      FROM thuong_hieu th
      LEFT JOIN sanpham_thuonghieu stt ON th.id = stt.thuong_hieu_id
      LEFT JOIN sanpham sp ON stt.san_pham_id = sp.id AND sp.trang_thai = 'active'
      GROUP BY th.id, th.ten
      HAVING product_count > 0
      ORDER BY th.ten
    `);

    // Xử lý dữ liệu sản phẩm
    const processedProducts = products.map(product => ({
      ...product,
      categories: product.categories ? product.categories.split(', ') : [],
      brands: product.brands ? product.brands.split(', ') : [],
      tags: product.tags ? product.tags.split('; ').map(tag => {
        const [key, value] = tag.split(':');
        return { key, value };
      }) : [],
      in_stock: product.total_stock > 0,
      final_price: product.gia_khuyen_mai && product.gia_khuyen_mai < product.gia_ban 
        ? product.gia_khuyen_mai 
        : product.gia_ban,
      discount_percent: product.gia_khuyen_mai && product.gia_khuyen_mai < product.gia_ban
        ? Math.round(((product.gia_ban - product.gia_khuyen_mai) / product.gia_ban) * 100)
        : 0
    }));

    res.status(200).json({
      success: true,
      data: {
        products: processedProducts,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: totalProducts,
          total_pages: totalPages,
          has_next: page < totalPages,
          has_prev: page > 1
        },
        suggestions: suggestions,
        filters: {
          categories: categories,
          brands: brands,
          price_range: {
            min: Math.min(...products.map(p => p.gia_ban)),
            max: Math.max(...products.map(p => p.gia_ban))
          }
        },
        search_info: {
          query: q,
          total_found: totalProducts,
          search_time: Date.now()
        }
      }
    });

  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tìm kiếm sản phẩm",
      error: error.message
    });
  }
}

export default withAuth(handler);
