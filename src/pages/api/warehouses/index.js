import { createHandler } from "@/lib/api/handler";
import { getAllWarehouseItems, addWarehouseItem } from "@/services/warehouseService";

export default createHandler({
  async GET(req, res) {
    const { page, pageSize, q } = req.query;
    const data = await getAllWarehouseItems({ page, pageSize, q });
    return res.status(200).json(data);
  },

  async POST(req, res) {
    const body = req.parsedBody || {}; 
    if (!body.name) return res.status(400).json({ error: "Missing field: name" });
    const { id } = await addWarehouseItem(body);
    return res.status(201).json({ id });
  },
});
