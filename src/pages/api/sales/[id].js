import { createHandler } from "@/lib/api/handler";
import { getSaleById, updateSale, deleteSale } from "@/services/salesService";

export default createHandler({
  async GET(req, res) {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const data = await getSaleById(id);
    if (!data) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(data);
  },

  async PATCH(req, res) {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    // body có thể: { customerId, status, quantity, totalPrice, productId }
    const affected = await updateSale(id, req.body || {});
    return res.status(200).json({ affected });
  },

  async DELETE(req, res) {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const affected = await deleteSale(id);
    return res.status(200).json({ affected });
  },
});
