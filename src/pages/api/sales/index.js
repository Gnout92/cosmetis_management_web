import { createHandler } from "@/lib/api/handler";
import { getAllSales, addSale } from "@/services/salesService";


export default createHandler({
  async GET(req, res) {
    const { id, customerId } = req.query;

    // /api/sales?id=123 -> chi tiết 1 đơn
    if (id) {
      const sale = await getSaleById(Number(id));
      if (!sale) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(sale);
    }

    // /api/sales?customerId=5 -> danh sách đơn của user
    const list = await getAllSales({
      customerId: customerId ? Number(customerId) : undefined,
    });
    return res.status(200).json(list);
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
