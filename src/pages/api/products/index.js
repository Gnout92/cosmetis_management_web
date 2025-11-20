// src/pages/api/products/index.js
import { createHandler } from "@/lib/api/handler";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productService";

const VALID_SORT_BY = new Set(["name", "price", "stock"]);
const VALID_SORT_DIR = new Set(["asc", "desc"]);
const VALID_STOCK = new Set(["in-stock", "low-stock", "out-of-stock"]);

export default createHandler({
  async GET(req, res) {
    const {
      page = "1",
      pageSize = "20",
      q,
      categoryId,
      price,      // "min-max" (optional)
      minPrice,
      maxPrice,
      stock,      // 'in-stock' | 'low-stock' | 'out-of-stock'
      sortBy = "name",
      sortDir = "asc",
      includeHidden, // '1' => true
    } = req.query;

    // parse range
    let _min = minPrice != null ? Number(minPrice) : undefined;
    let _max = maxPrice != null ? Number(maxPrice) : undefined;
    if (_min == null && _max == null && typeof price === "string" && price.includes("-")) {
      const [a, b] = price.split("-").map(Number);
      if (!Number.isNaN(a)) _min = a;
      if (!Number.isNaN(b)) _max = b;
    }

    const data = await getAllProducts({
      page: Number(page),
      pageSize: Number(pageSize),
      q: q || undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      minPrice: _min,
      maxPrice: _max,
      stock: VALID_STOCK.has(stock) ? stock : undefined,
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
      return res.status(400).json({ error: "Missing required fields: name, price, categoryId" });
    }
    const { id } = await addProduct(body);
    return res.status(201).json({ id });
  },

  // Cho phép PATCH (partial update) ở route index cũng được
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
    const hiddenBy = req.query.hiddenBy != null ? Number(req.query.hiddenBy) : null;

    const { affected } = await deleteProduct(id, { soft, hiddenBy });
    return res.status(200).json({ affected, soft });
  },
});
