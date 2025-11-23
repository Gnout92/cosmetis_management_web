// src/lib/database/schema.js

// 1) Tên bảng thật trong DB myphamshop
export const TABLES = Object.freeze({
  // Cùng trỏ về bảng nguoi_dung – 
  // khi query nhớ WHERE vai_tro = 'Customer' hoặc 'Staff' / 'Admin'
  CUSTOMERS: "v_nguoi_dung",
  EMPLOYEES: "v_nguoi_dung",

  PRODUCTS: "sanpham",
  CATEGORIES: "danh_muc",
  BRANDS: "thuong_hieu",

  WAREHOUSES: "kho_moi",
  STOCKS: "ton_kho",

  ORDERS: "don_hang",
  ORDER_ITEMS: "don_hang_chi_tiet",

  REVIEWS: "danh_gia",
});

// 2) Mapping cột: appField ↔ dbColumn
export const COLUMNS = Object.freeze({
  // View KHÁCH HÀNG – dùng nguoi_dung, lọc vai_tro = 'Customer'
  customers: {
    id: "id",
    email: "email",
    normalizedEmail: "email_thuong",
    username: "ten_dang_nhap",
    displayName: "ten_hien_thi",
    firstName: "ho",
    lastName: "ten",
    avatar: "anh_dai_dien",
    birthDate: "ngay_sinh",
    gender: "gioi_tinh",
    role: "vai_tro",
    isActive: "dang_hoat_dong",
    passwordHash: "mat_khau_hash",
    createdAt: "thoi_gian_tao",
    updatedAt: "thoi_gian_cap_nhat",
    // Lưu ý: không có cột phone riêng, phone nằm trong bảng dia_chi
  },

  // View NHÂN VIÊN – cũng là nguoi_dung, lọc vai_tro <> 'Customer'
  employees: {
    id: "id",
    email: "email",
    username: "ten_dang_nhap",
    displayName: "ten_hien_thi",
    firstName: "ho",
    lastName: "ten",
    avatar: "anh_dai_dien",
    birthDate: "ngay_sinh",
    gender: "gioi_tinh",
    role: "vai_tro",
    isActive: "dang_hoat_dong",
    passwordHash: "mat_khau_hash",
    createdAt: "thoi_gian_tao",
    updatedAt: "thoi_gian_cap_nhat",
  },

  // Sản phẩm – bảng sanpham
  products: {
    id: "MaSanPham",
    categoryId: "MaDanhMuc",
    brandId: "MaThuongHieu",
    name: "TenSanPham",
    description: "MoTa",
    price: "Gia",
    originalPrice: "GiaGoc",

    isHidden: "is_an",
    hiddenAt: "thoi_gian_an",
    hiddenBy: "an_boi",

    createdAt: "NgayTao",
    updatedAt: "NgayCapNhat",
    // Lưu ý: không có quantity ở đây – tồn kho nằm ở bảng ton_kho
  },

  // Kho – bảng kho_moi
  warehouses: {
    id: "id",
    code: "ma_kho",
    name: "ten_kho",
    categoryId: "danh_muc_id",
    location: "vi_tri",
    managerId: "nguoi_quan_ly_id",
    status: "trang_thai",
    createdAt: "thoi_gian_tao",
    updatedAt: "thoi_gian_cap_nhat",
  },

  // Tồn kho – bảng ton_kho
  stocks: {
    warehouseId: "kho_id",
    productId: "san_pham_id",
    quantityOnHand: "so_luong_ton",
    quantityReserved: "so_luong_giu_cho",
  },

  // Đơn hàng – bảng don_hang
  orders: {
    id: "id",
    userId: "nguoi_dung_id",
    status: "trang_thai",
    paymentMethod: "phuong_thuc_tt",
    paymentStatus: "trang_thai_tt",

    shipWardId: "ship_phuong_xa_id",
    shipDistrictId: "ship_quan_huyen_id",
    shipProvinceId: "ship_tinh_thanh_id",

    shipWardName: "ship_ten_phuong_xa",
    shipDistrictName: "ship_ten_quan_huyen",
    shipProvinceName: "ship_ten_tinh_thanh",

    shipName: "ship_ten_nguoi_nhan",
    shipPhone: "ship_so_dien_thoai",
    shipAddress: "ship_dia_chi_chi_tiet",
    shipStreet: "ship_duong",

    subTotal: "tong_hang",
    shippingFee: "phi_van_chuyen",
    totalDiscount: "tong_giam_gia",
    grandTotal: "tong_thanh_toan",

    confirmedBy: "xac_nhan_boi",
    shippedBy: "giao_hang_boi",
    cancelReason: "ly_do_huy",
    failedReason: "ly_do_that_bai",

    createdAt: "thoi_gian_tao",
    updatedAt: "thoi_gian_cap_nhat",
  },

  // Chi tiết đơn hàng – bảng don_hang_chi_tiet
  orderItems: {
    id: "id",
    orderId: "don_hang_id",
    productId: "san_pham_id",

    listPrice: "gia_niem_yet",
    unitPrice: "don_gia",

    discountPercent: "pt_giam",
    discountAmount: "tien_giam",

    quantity: "so_luong",
    lineTotal: "thanh_tien",
  },

  // Đánh giá – bảng danh_gia
  reviews: {
    id: "id",
    productId: "san_pham_id",
    userId: "nguoi_dung_id",
    rating: "sao",
    content: "noi_dung",
    status: "trang_thai",
    createdAt: "thoi_gian_tao",
    updatedAt: "thoi_gian_cap_nhat",
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
