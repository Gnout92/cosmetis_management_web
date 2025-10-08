import { createHandler } from "@/lib/api/handler";
import { getAllProducts, addProduct } from "@/services/productService";

export default createHandler({
  async GET(req, res) {
    const { page, pageSize, q, categoryId } = req.query;
    const data = await getAllProducts({
      page, pageSize, q,
      categoryId: categoryId != null ? Number(categoryId) : undefined,
    });
    return res.status(200).json(data); // { data, page, pageSize, total }
  },

  async POST(req, res) {
    const body = req.parsedBody || {}; 
    if (!body.name || body.price == null) {
      return res.status(400).json({ error: "Missing required fields: name, price" });
    }
    const { id } = await addProduct(body);
    return res.status(201).json({ id });
  },
});
