// src/pages/api/qlkh/customers/[id].js
import { getPool } from "../../../../lib/database/db";
import { withAuth } from "../../../../lib/middleware/auth";

/**
 * API: Chi tiết và cập nhật thông tin khách hàng
 * GET: Lấy thông tin chi tiết
 * PUT: Cập nhật thông tin
 * Chỉ cho phép: QL_KhachHang, Admin
 */

async function handler(req, res) {
  const pool = getPool();
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Thiếu ID khách hàng",
    });
  }

  try {
    // GET: Lấy thông tin chi tiết khách hàng
    if (req.method === "GET") {
      const [customers] = await pool.execute(
        `SELECT 
          nd.id,
          nd.ten_dang_nhap as username,
          nd.email,
          nd.ten_hien_thi as displayName,
          nd.ho as firstName,
          nd.ten as lastName,
          nd.anh_dai_dien as avatar,
          nd.ngay_sinh as birthDate,
          nd.gioi_tinh as gender,
          nd.dang_hoat_dong as isActive,
          nd.thoi_gian_tao as createdAt,
          COUNT(DISTINCT dh.id) as totalOrders,
          COALESCE(SUM(dh.tong_thanh_toan), 0) as totalSpent,
          MAX(dh.thoi_gian_tao) as lastOrderDate
        FROM nguoi_dung nd
        LEFT JOIN don_hang dh ON nd.id = dh.nguoi_dung_id
        WHERE nd.id = ?
          AND EXISTS (
            SELECT 1 FROM nguoi_dung_vai_tro nvt 
            JOIN vai_tro vt ON nvt.vai_tro_id = vt.id 
            WHERE nvt.nguoi_dung_id = nd.id AND vt.ten = 'Customer'
          )
        GROUP BY nd.id`,
        [id]
      );

      if (!customers || customers.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy khách hàng",
        });
      }

      const customer = customers[0];

      // Lấy địa chỉ của khách hàng
      const [addresses] = await pool.execute(
        `SELECT 
          id,
          loai as type,
          mac_dinh as isDefault,
          ten_nguoi_nhan as receiverName,
          so_dien_thoai as phoneNumber,
          dia_chi_chi_tiet as addressDetail,
          duong as street,
          phuong_xa_id as wardId,
          quan_huyen_id as districtId,
          tinh_thanh_id as provinceId
        FROM dia_chi
        WHERE nguoi_dung_id = ?
        ORDER BY mac_dinh DESC, thoi_gian_tao DESC`,
        [id]
      );

      customer.addresses = addresses;

      // Xác định tier (hạng khách hàng)
      customer.tier =
        customer.totalSpent >= 10000000
          ? "diamond"
          : customer.totalSpent >= 5000000
          ? "gold"
          : customer.totalSpent >= 2000000
          ? "silver"
          : "bronze";

      return res.status(200).json({
        success: true,
        data: customer,
      });
    }

    // PUT: Cập nhật thông tin khách hàng
    if (req.method === "PUT") {
      const { displayName, firstName, lastName, birthDate, gender, isActive } =
        req.body;

      // Build UPDATE query
      let updateFields = [];
      let updateValues = [];

      if (displayName !== undefined) {
        updateFields.push("ten_hien_thi = ?");
        updateValues.push(displayName);
      }
      if (firstName !== undefined) {
        updateFields.push("ho = ?");
        updateValues.push(firstName);
      }
      if (lastName !== undefined) {
        updateFields.push("ten = ?");
        updateValues.push(lastName);
      }
      if (birthDate !== undefined) {
        updateFields.push("ngay_sinh = ?");
        updateValues.push(birthDate);
      }
      if (gender !== undefined) {
        updateFields.push("gioi_tinh = ?");
        updateValues.push(gender);
      }
      if (isActive !== undefined) {
        updateFields.push("dang_hoat_dong = ?");
        updateValues.push(isActive ? 1 : 0);
      }

      updateFields.push("thoi_gian_cap_nhat = NOW()");

      if (updateFields.length === 1) {
        return res.status(400).json({
          success: false,
          message: "Không có dữ liệu để cập nhật",
        });
      }

      await pool.execute(
        `UPDATE nguoi_dung 
        SET ${updateFields.join(", ")} 
        WHERE id = ?`,
        [...updateValues, id]
      );

      // Log hoạt động
      try {
        await pool.execute(
          `INSERT INTO nhat_ky_hoat_dong (bang, ban_ghi_id, hanh_dong, du_lieu_moi, thuc_hien_boi)
           VALUES (?, ?, ?, ?, ?)`,
          [
            'nguoi_dung',
            id,
            'UPDATE',
            JSON.stringify({ action: 'UPDATE_CUSTOMER_INFO', updates: req.body }),
            req.user.id
          ]
        );
      } catch (logErr) {
        console.log("Log insert failed, skipping...");
      }

      // Lấy thông tin sau khi update
      const [updated] = await pool.execute(
        `SELECT 
          id,
          ten_dang_nhap as username,
          email,
          ten_hien_thi as displayName,
          ho as firstName,
          ten as lastName,
          ngay_sinh as birthDate,
          gioi_tinh as gender,
          dang_hoat_dong as isActive
        FROM nguoi_dung
        WHERE id = ?`,
        [id]
      );

      return res.status(200).json({
        success: true,
        message: "Cập nhật thông tin khách hàng thành công",
        data: updated[0],
      });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    console.error("[/api/qlkh/customers/[id]] error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + err.message,
    });
  }
}

export default withAuth(handler, ["Admin", "QL_KhachHang"]);
