import { createHandler } from "@/lib/api/handler";
import { getAllEmployees, addEmployee } from "@/services/employeeService";

export default createHandler({
  async GET(req, res) {
    const { page, pageSize, q } = req.query;
    const data = await getAllEmployees({ page, pageSize, q });
    return res.status(200).json(data);
  },

  async POST(req, res) {
    const body = req.parsedBody || {}; 
    if (!body.name || !body.email || !body.phone) {
      return res.status(400).json({ error: "Missing fields: name, email, phone" });
    }
    const { id } = await addEmployee(body);
    return res.status(201).json({ id });
  },
});
