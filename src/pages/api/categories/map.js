// src/pages/api/categories/map.js
import { createHandler } from "@/lib/api/handler";
import { getAllCategories } from "@/services/categoryServices";

export default createHandler({
  async GET(req, res) {
    const { q } = req.query;

    const { items } = await getAllCategories({
      page: 1,
      pageSize: 5000,
      q: q || undefined,
      sortBy: "name",
      sortDir: "asc",
    });

    const map = {};
    for (const c of items) {
      map[c.id] = c.name;
    }
    return res.status(200).json(map);
  },
});
