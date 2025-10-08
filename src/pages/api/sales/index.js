import { createHandler } from "@/lib/api/handler";
import { getAllSales, addSale } from "@/services/salesService";

export default createHandler({
  async GET(req, res) {
    const rows = await getAllSales(); // tổng hợp theo hóa đơn
    return res.status(200).json({ data: rows });
  },

  async POST(req, res) {
    // body: { productId, quantity, totalPrice, customerId }
    const body = req.parsedBody || {}; 
    if (!body.productId || !body.customerId) {
      return res.status(400).json({ error: "Missing fields: productId, customerId" });
    }
    const id = await addSale({
      productId: Number(body.productId),
      quantity: body.quantity != null ? Number(body.quantity) : 1,
      totalPrice: body.totalPrice != null ? Number(body.totalPrice) : undefined,
      customerId: Number(body.customerId),
    });
    return res.status(201).json({ id });
  },
});
