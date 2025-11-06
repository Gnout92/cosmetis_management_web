import { createHandler } from "@/lib/api/handler";
import { getEmployeeById, updateEmployee, deleteEmployee } from "@/services/employeeService";

export default createHandler({
  async GET(req, res) {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const row = await getEmployeeById(id);
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(row);
  },

  async PUT(req, res) {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const { affected } = await updateEmployee(id, req.body || {});
    return res.status(200).json({ affected });
  },

  async PATCH(req, res) {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const { affected } = await updateEmployee(id, req.body || {});
    return res.status(200).json({ affected });
  },

  async DELETE(req, res) {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const { affected } = await deleteEmployee(id);
    return res.status(200).json({ affected });
  },
});
