// src/pages/api/products/brands.js
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
        th.id,
        th.ten       AS name,
        th.logo_url  AS logo,
        th.mo_ta     AS description,
        COALESCE(COUNT(sp.${P.id}), 0) AS products
      FROM ${T.BRANDS} th
      LEFT JOIN ${T.PRODUCTS} sp 
        ON sp.${P.brandId} = th.id 
        AND (sp.${P.isHidden} = 0 OR sp.${P.isHidden} IS NULL)
      WHERE th.noi_bat = 1
      GROUP BY th.id, th.ten, th.logo_url, th.mo_ta
      ORDER BY products DESC, th.ten ASC
      LIMIT 12
      `
    );

    const data = rows.map((r) => ({
      id: r.id,
      name: r.name,
      logo: r.logo || "/images/brand-default.png",
      description: r.description || "",
      products: Number(r.products || 0),
      url: `/thuong-hieu/${r.id}`,
    }));

    return res.status(200).json({ success: true, data });
  } catch (e) {
    console.error("[/api/products/brands]", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
