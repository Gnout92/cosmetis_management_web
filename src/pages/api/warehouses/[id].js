import { createHandler } from "@/lib/api/handler";
import { getWarehouseItemById, updateWarehouseItem, deleteWarehouseItem } from "@/services/warehouseService";

export default createHandler({
  async GET(req, res) {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const row = await getWarehouseItemById(id);
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(row);
  },

  async PUT(req, res) {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const { affected } = await updateWarehouseItem(id, req.body || {});
    return res.status(200).json({ affected });
  },

  async PATCH(req, res) {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const { affected } = await updateWarehouseItem(id, req.body || {});
    return res.status(200).json({ affected });
  },

  async DELETE(req, res) {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const { affected } = await deleteWarehouseItem(id);
    return res.status(200).json({ affected });
  },
});
