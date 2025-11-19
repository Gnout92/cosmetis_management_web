// src/pages/api/products/index.js
import { createHandler } from "./lib/api/handler";

import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./src/services/productService.js";


// tiện ích: parse "100000-500000" hoặc min/max rời
function parsePriceQuery({ price, minPrice, maxPrice }) {
  let _min = minPrice != null ? Number(minPrice) : undefined;
  let _max = maxPrice != null ? Number(maxPrice) : undefined;

  if (!_min && !_max && typeof price === "string" && price.includes("-")) {
    const [a, b] = price.split("-").map((v) => Number(v));
    if (!Number.isNaN(a)) _min = a;
    if (!Number.isNaN(b)) _max = b;
  }
  return { minPrice: _min, maxPrice: _max };
}

// map sort đầu vào từ FE -> service
const VALID_SORT_BY = new Set(["name", "price", "stock"]);
const VALID_SORT_DIR = new Set(["asc", "desc"]);

export default createHandler({
  async GET(req, res) {
    const {
      id,
      page = "1",
      pageSize = "20",
      q,
      categoryId,
      price,      // "a-b" (tùy chọn)
      minPrice,
      maxPrice,
      stock,      // 'in-stock' | 'low-stock' | 'out-of-stock'
      sortBy = "name",
      sortDir = "asc",
      includeHidden, // '1' => true
    } = req.query;

    // /api/products?id=123 -> trả chi tiết 1 sp
    if (id) {
      const row = await getProductById(Number(id));
      if (!row) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json(row);
    }

    const { minPrice: _min, maxPrice: _max } = parsePriceQuery({
      price,
      minPrice,
      maxPrice,
    });

    const data = await getAllProducts({
      page: Number(page),
      pageSize: Number(pageSize),
      q: q || undefined,
      categoryId:
        categoryId != null && categoryId !== "" ? Number(categoryId) : undefined,
      minPrice: _min,
      maxPrice: _max,
      stock: ["in-stock", "low-stock", "out-of-stock"].includes(stock)
        ? stock
        : undefined,
      sortBy: VALID_SORT_BY.has(String(sortBy)) ? String(sortBy) : "name",
      sortDir: VALID_SORT_DIR.has(String(sortDir).toLowerCase())
        ? String(sortDir).toLowerCase()
        : "asc",
      includeHidden: includeHidden === "1",
    });

    return res.status(200).json(data);
  },

  async POST(req, res) {
    const body = req.parsedBody || req.body || {};
    if (body.name == null || body.price == null || body.categoryId == null) {
      return res
        .status(400)
        .json({ error: "Missing required fields: name, price, categoryId" });
    }
    const { id } = await addProduct(body);
    return res.status(201).json({ id });
  },

  async PUT(req, res) {
    const id = Number(req.query.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Missing or invalid product ID" });
    }
    const body = req.parsedBody || req.body || {};
    const { affected } = await updateProduct(id, body);
    return res.status(200).json({ affected });
  },

  async PATCH(req, res) {
    const id = Number(req.query.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Missing or invalid product ID" });
    }
    const body = req.parsedBody || req.body || {};
    const { affected } = await updateProduct(id, body);
    return res.status(200).json({ affected });
  },

  async DELETE(req, res) {
    const id = Number(req.query.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Missing or invalid product ID" });
    }
    const soft = req.query.soft !== "0"; // mặc định soft-delete
    const hiddenBy =
      req.query.hiddenBy != null ? Number(req.query.hiddenBy) : null;

    const { affected } = await deleteProduct(id, { soft, hiddenBy });
    return res.status(200).json({ affected, soft });
  },
});
