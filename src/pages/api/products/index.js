import { createHandler } from "@/lib/api/handler";
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productService";

export default createHandler({
  async GET(req, res) {
    const { id, page, pageSize, q, categoryId } = req.query;

    if (id) {
      const product = await getProductById(Number(id));
      if (!product) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json(product);
    }

    const data = await getAllProducts({
      page,
      pageSize,
      q,
      categoryId: categoryId != null ? Number(categoryId) : undefined,
    });

    return res.status(200).json(data);
  },

  async POST(req, res) {
    const body = req.parsedBody || {};
    if (!body.name || body.price == null || body.categoryId == null) {
      return res.status(400).json({ error: "Missing required fields: name, price, categoryId" });
    }

    const { id } = await addProduct(body);
    return res.status(201).json({ id });
  },

 async PUT(req, res) {
  const id = Number(req.query.id); // ← lấy từ query string
  const body = req.parsedBody || {};

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Missing or invalid product ID" });
  }

  const { affected } = await updateProduct(id, body);
  return res.status(200).json({ affected });
},


  async DELETE(req, res) {
    const id = Number(req.query.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Missing or invalid product ID" });
    }

    const { affected } = await deleteProduct(id);
    return res.status(200).json({ affected });
  },
});
