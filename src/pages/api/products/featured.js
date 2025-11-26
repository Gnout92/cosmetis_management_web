// src/pages/api/products/featured.js
import { getPool } from "@/lib/database/db";
import { TABLES, COLUMNS } from "@/lib/database/schema";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const pool = getPool();
    const P = COLUMNS.products;
    const T = TABLES;

    const [rows] = await pool.execute(
      `
      SELECT
        sp.${P.id}               AS id,
        sp.${P.name}             AS name,
        sp.${P.price}            AS price,
        sp.${P.originalPrice}    AS originalPrice,

        /* Discount percent: chỉ tính khi originalPrice > 0 */
        CASE 
          WHEN sp.${P.originalPrice} > 0 
            THEN FLOOR(((sp.${P.originalPrice} - sp.${P.price}) / sp.${P.originalPrice}) * 100)
          ELSE 0
        END AS discountPercent,

        /* Ảnh đại diện: ưu tiên ảnh có la_anh_dai_dien = 1; nếu không có thì lấy ảnh đầu tiên */
        (
          SELECT i.url 
          FROM ${T.PRODUCT_IMAGES} i 
          WHERE i.san_pham_id = sp.${P.id}
          ORDER BY (i.la_anh_dai_dien = 1) DESC, i.thu_tu ASC, i.id ASC
          LIMIT 1
        ) AS image,

        /* Rating trung bình (chỉ các review đang hiển thị) */
        (
          SELECT AVG(r.sao) 
          FROM ${T.REVIEWS} r 
          WHERE r.san_pham_id = sp.${P.id} AND (r.trang_thai = 'HIEN' OR r.trang_thai IS NULL)
        ) AS rating,

        th.id     AS brandId,
        th.ten    AS brandName,
        dm.ten    AS categoryName
      FROM ${T.PRODUCTS} sp
      LEFT JOIN ${T.BRANDS}     th ON th.id = sp.${P.brandId}
      LEFT JOIN ${T.CATEGORIES} dm ON dm.id = sp.${P.categoryId}
      WHERE 
        /* đang bán: không ẩn */
        (sp.${P.isHidden} = 0 OR sp.${P.isHidden} IS NULL)
        /* có khuyến mãi (tạm thay cho 'nổi bật') */
        AND sp.${P.price} IS NOT NULL
        AND sp.${P.originalPrice} IS NOT NULL
        AND sp.${P.price} < sp.${P.originalPrice}
      ORDER BY sp.${P.updatedAt} DESC
      LIMIT 15
      `
    );

    const data = rows.map((r) => {
      const price = r.price != null ? Number(r.price) : null;
      const originalPrice = r.originalPrice != null ? Number(r.originalPrice) : null;
      const ratingAvg = r.rating != null ? Math.round(Number(r.rating) * 10) / 10 : 4.5;
      const discountPercent = Number.isFinite(r.discountPercent) ? Number(r.discountPercent) : 0;

      return {
        id: r.id,
        name: r.name,
        price,
        originalPrice,
        image: r.image || "/images/default-product.png",
        rating: ratingAvg, // number, 1 chữ số thập phân
        discount: discountPercent > 0 ? `${discountPercent}%` : null,
        brand: { id: r.brandId, name: r.brandName },
        categoryName: r.categoryName || null,
      };
    });

    return res.status(200).json({ success: true, data });
  } catch (e) {
    console.error("[/api/products/featured]", e);
    return res.status(500).json({ success: false, message: "Lỗi Server khi tải sản phẩm nổi bật" });
  }
}
