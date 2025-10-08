// src/lib/database/schema.js

// 1) Tên bảng thật trong DB (VN)
export const TABLES = Object.freeze({
  CUSTOMERS: "KhachHang",
  EMPLOYEES: "NhanVien",
  PRODUCTS: "SanPham",
  WAREHOUSE: "Kho",                  // chú ý: Kho là danh mục kho, không phải tồn kho chi tiết
  // nếu có thêm HoaDon, ChiTietHoaDon... thêm tại đây
});

// 2) Mapping cột: appField ↔ dbColumn
export const COLUMNS = Object.freeze({
  // services/customerService.js (giữ name/email/phone ở UI)
  customers: {
    id: "MaKH",
    name: "HoVaTen",
    email: "Email",
    phone: "DienThoai",
    password: "MatKhau",            // optional
    createdAt: "NgayTao",
    updatedAt: "NgayCapNhat",
  },

  // services/employeeService.js
  employees: {
    id: "MaNV",
    name: "HoVaTen",
    email: "Email",
    phone: "DienThoai",
    position: "VaiTro",             // minh hoạ: map position ↔ VaiTro
    password: "MatKhau",
    createdAt: "NgayTao",
    updatedAt: "NgayCapNhat",
  },

  // services/productService.js
  products: {
    id: "MaSanPham",
    name: "TenSanPham",
    description: "MoTa",
    categoryId: "MaDanhMuc",
    price: "Gia",
    originalPrice: "GiaGoc",
    quantity: "SoLuong",
    createdAt: "NgayTao",
    updatedAt: "NgayCapNhat",
  },

  // services/warehouseService.js (Kho)
  warehouses: {
    id: "MaKho",
    name: "TenKho",
    location: "ViTri",
    createdAt: "NgayTao",
    updatedAt: "NgayCapNhat",
  },
});

// 3) Helper: build SELECT list dựa theo appFields
export function selectList(map, alias = null) {
  // { name:'HoVaTen', email:'Email' } -> "HoVaTen AS name, Email AS email"
  const prefix = alias ? `${alias}.` : "";
  return Object.entries(map)
    .map(([appKey, dbCol]) => `${prefix}${dbCol} AS ${appKey}`)
    .join(", ");
}

// 4) Helper: map input (app → db) & output (db → app)
export function toDbPayload(appPayload, map) {
  const out = {};
  Object.entries(appPayload || {}).forEach(([k, v]) => {
    if (map[k]) out[map[k]] = v;
  });
  return out;
}

export function toAppRow(dbRow, map) {
  if (!dbRow) return null;
  const out = {};
  Object.entries(map).forEach(([appKey, dbCol]) => {
    if (dbCol in dbRow) out[appKey] = dbRow[dbCol];
  });
  return out;
}
