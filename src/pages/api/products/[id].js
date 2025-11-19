// src/pages/api/products/[id].js
import { createHandler } from "@/lib/api/handler";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/services/productService";

export default createHandler({
  async GET(req, res) {
    const id = Number(req.query.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const row = await getProductById(id);
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(row);
  },

  async PUT(req, res) {
    const id = Number(req.query.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const body = req.parsedBody || req.body || {};
    const { affected } = await updateProduct(id, body);
    return res.status(200).json({ affected });
  },

  async PATCH(req, res) {
    const id = Number(req.query.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const body = req.parsedBody || req.body || {};
    const { affected } = await updateProduct(id, body);
    return res.status(200).json({ affected });
  },

  async DELETE(req, res) {
    const id = Number(req.query.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const soft = req.query.soft !== "0";
    const hiddenBy =
      req.query.hiddenBy != null ? Number(req.query.hiddenBy) : null;
    const { affected } = await deleteProduct(id, { soft, hiddenBy });
    return res.status(200).json({ affected, soft });
  },
});
