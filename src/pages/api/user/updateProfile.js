// src/pages/api/user/updateProfile.js
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_change_me";

export default async function handler(req, res) {
  // Chỉ cho phép PUT
  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, message: "Method không được phép" });
  }

  try {
    // 1) Verify token trong header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const rawToken = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(rawToken, JWT_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    const userId = decoded?.uid;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid token payload" });
    }

    // 2) Nhận dữ liệu cập nhật (KHÔNG có phone)
    const { displayName, ten_hien_thi, ho, ten, ngay_sinh, gioi_tinh } = req.body;
    const finalDisplayName = (displayName || ten_hien_thi || "").trim();

    // 3) Validate cơ bản
    if (!finalDisplayName) {
      return res.status(400).json({ success: false, message: "Tên hiển thị không được để trống" });
    }
    if (finalDisplayName.length > 200) {
      return res.status(400).json({ success: false, message: "Tên hiển thị không được vượt quá 200 ký tự" });
    }
    if (ho && ho.length > 100) {
      return res.status(400).json({ success: false, message: "Họ không được vượt quá 100 ký tự" });
    }
    if (ten && ten.length > 100) {
      return res.status(400).json({ success: false, message: "Tên không được vượt quá 100 ký tự" });
    }
    if (gioi_tinh && !["Nam", "Nữ", "Khác"].includes(gioi_tinh)) {
      return res.status(400).json({ success: false, message: "Giới tính phải là Nam, Nữ hoặc Khác" });
    }
    if (ngay_sinh) {
      const re = /^\d{4}-\d{2}-\d{2}$/;
      if (!re.test(ngay_sinh)) {
        return res.status(400).json({ success: false, message: "Ngày sinh phải có định dạng YYYY-MM-DD" });
      }
      const d = new Date(ngay_sinh);
      if (d > new Date()) {
        return res.status(400).json({ success: false, message: "Ngày sinh không thể lớn hơn ngày hiện tại" });
      }
    }

    // 4) Kết nối DB
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "myphamshop",
      charset: "utf8mb4",
    });

    try {
      // 5) Kiểm tra user tồn tại
      const [exist] = await connection.execute("SELECT id FROM nguoi_dung WHERE id = ?", [userId]);
      if (exist.length === 0) {
        await connection.end();
        return res.status(404).json({ success: false, message: "Không tìm thấy thông tin người dùng" });
      }

      // 6) Build câu UPDATE động
      const fields = [];
      const values = [];

      fields.push("ten_hien_thi = ?");
      values.push(finalDisplayName);

      if (ho !== undefined) {
        fields.push("ho = ?");
        values.push(ho ? ho.trim() : null);
      }
      if (ten !== undefined) {
        fields.push("ten = ?");
        values.push(ten ? ten.trim() : null);
      }
      if (ngay_sinh !== undefined) {
        fields.push("ngay_sinh = ?");
        values.push(ngay_sinh || null);
      }
      if (gioi_tinh !== undefined) {
        fields.push("gioi_tinh = ?");
        values.push(gioi_tinh || null);
      }

      if (fields.length === 0) {
        await connection.end();
        return res.status(400).json({ success: false, message: "Không có thông tin nào để cập nhật" });
      }

      fields.push("thoi_gian_cap_nhat = NOW()");
      values.push(userId);

      const sql = `UPDATE nguoi_dung SET ${fields.join(", ")} WHERE id = ?`;
      const [result] = await connection.execute(sql, values);
      await connection.end();

      if (result.affectedRows === 0) {
        return res.status(500).json({ success: false, message: "Không có hàng nào được cập nhật" });
      }

      return res.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công!",
        data: {
          id: userId,
          ten_hien_thi: finalDisplayName,
          ho: ho ?? null,
          ten: ten ?? null,
          ngay_sinh: ngay_sinh ?? null,
          gioi_tinh: gioi_tinh ?? null,
        },
      });
    } catch (dbErr) {
      try { await connection.end(); } catch {}
      console.error("[updateProfile] DB error:", dbErr);
      return res.status(500).json({ success: false, message: "Lỗi database khi cập nhật thông tin" });
    }
  } catch (err) {
    console.error("[updateProfile] error:", err);
    return res.status(500).json({ success: false, message: "Lỗi server khi cập nhật thông tin profile" });
  }
}
