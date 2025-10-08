// src/lib/database/schema.js

// 1) Tên bảng thật trong DB (VN)
export const TABLES = Object.freeze({
  CUSTOMERS: "KhachHang",
  EMPLOYEES: "NhanVien",
  PRODUCTS: "SanPham",
  WAREHOUSE: "Kho",          // Danh mục kho
  ORDERS: "HoaDon",          // Thêm cho salesService
  ORDER_ITEMS: "ChiTietHoaDon",
});

// 2) Mapping cột: appField ↔ dbColumn
export const COLUMNS = Object.freeze({
  customers: {
    id: "MaKH",
    name: "HoVaTen",
    email: "Email",
    phone: "DienThoai",
    password: "MatKhau",      // optional
    createdAt: "NgayTao",
    updatedAt: "NgayCapNhat",
  },

  employees: {
    id: "MaNV",
    name: "HoVaTen",
    email: "Email",
    phone: "DienThoai",
    position: "VaiTro",
    password: "MatKhau",
    createdAt: "NgayTao",
    updatedAt: "NgayCapNhat",
  },

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

  warehouses: {
    id: "MaKho",
    name: "TenKho",
    location: "ViTri",
    createdAt: "NgayTao",
    updatedAt: "NgayCapNhat",
  },

  // Tuỳ nhu cầu, có thể dùng hoặc không dùng các map này ở service
  orders: {
    id: "MaHD",
    customerId: "MaKH",
    employeeId: "MaNV",
    createdAt: "NgayLap",
    totalPrice: "TongTien",
    status: "TrangThai",
  },

  orderItems: {
    itemId: "MaCTHD",
    orderId: "MaHD",
    productId: "MaSanPham",
    quantity: "SoLuong",
    unitPrice: "DonGia",
    lineTotal: "ThanhTien",
  },
});

// 3) Helper: build SELECT list dựa theo appFields
export function selectList(map, alias = null) {
  const prefix = alias ? `${alias}.` : "";
  return Object.entries(map)
    .map(([appKey, dbCol]) => `${prefix}${dbCol} AS ${appKey}`)
    .join(", ");
}

// 4) Helper: map input (app → db) & output (db → app)
export function toDbPayload(appPayload, map) {
  const out = {};
  Object.entries(appPayload || {}).forEach(([k, v]) => {
    if (map[k] !== undefined && v !== undefined) out[map[k]] = v;
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
