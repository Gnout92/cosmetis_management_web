// src/pages/api/categories/index.js
import { createHandler } from "@/lib/api/handler";
import { getAllCategories } from "@/services/categoryServices"; // plural

export default createHandler({
  async GET(req, res) {
    const {
      page = "1",
      pageSize = "100",
      q,
      sortBy = "name", // 'name' | 'createdAt'
      sortDir = "asc", // 'asc' | 'desc'
    } = req.query;

    const data = await getAllCategories({
      page: Number(page),
      pageSize: Number(pageSize),
      q: q || undefined,
      sortBy: String(sortBy),
      sortDir: String(sortDir),
    });

    return res.status(200).json(data);
  },
});
