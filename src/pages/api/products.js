//src/pages/api/products.js:
import { connect } from "../../lib/database/db";

export default async function handler(req, res) {
  try {
    const connection = await connect();
    const [rows] = await connection.query("SELECT * FROM MatHang");
    await connection.end();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
