// src/lib/database/schemas.js

// 1) Tên bảng thật trong DB MySQL `myphamshop`
export const TABLES = Object.freeze({
  USERS: "nguoi_dung",              // Người dùng: khách, admin, nhân viên, kho
  USER_OAUTH: "lien_ket_dang_nhap", // Liên kết đăng nhập Google
  ADDRESSES: "dia_chi",             // Địa chỉ giao hàng / thanh toán
  PRODUCTS: "sanpham",              // Sản phẩm
  CATEGORIES: "danh_muc",           // Danh mục
  BRANDS: "thuong_hieu",            // Thương hiệu
  ORDERS: "don_hang",               // Đơn hàng
  ORDER_ITEMS: "don_hang_chi_tiet", // Chi tiết đơn
  REVIEWS: "danh_gia",              // Đánh giá sản phẩm
  WAREHOUSES: "kho_moi",            // Kho
  STOCKS: "ton_kho",                // Tồn kho
  // Lưu ý: hiện SQL chưa có bảng notifications riêng
  // nếu sau này tạo bảng `notifications`, chỉ cần thêm vào đây.
});

// 2) User schema – view model dựa trên nguoi_dung + lien_ket_dang_nhap + dia_chi
export const UserSchema = Object.freeze({
  // nguoi_dung
  id: "Number",              // BIGINT
  email: "String",           // email
  normalizedEmail: "String", // email_thuong (LOWER(email))
  loginName: "String",       // ten_dang_nhap
  displayName: "String",     // ten_hien_thi
  lastName: "String",        // ho
  firstName: "String",       // ten
  avatar: "String",          // anh_dai_dien
  birthDate: "Date",         // ngay_sinh
  gender: "String",          // gioi_tinh: 'Male'|'Female'|'Other'
  role: "String",            // vai_tro: 'Admin'|'Staff'|'WareHouse'|'Customer'
  isActive: "Boolean",       // dang_hoat_dong
  createdAt: "DateTime",     // thoi_gian_tao
  updatedAt: "DateTime",     // thoi_gian_cap_nhat

  // Các tài khoản đăng nhập ngoài (Google) từ lien_ket_dang_nhap
  providerAccounts: [
    {
      id: "Number",              // id (BIGINT)
      provider: "String",        // nha_cung_cap (vd: 'google')
      providerUserId: "String",  // ma_nguoi_dung_ncc
      emailAtProvider: "String", // email_tai_ncc
      avatarAtProvider: "String",// anh_tai_ncc
      createdAt: "DateTime",     // thoi_gian_tao
    },
  ],

  // Địa chỉ người dùng từ bảng dia_chi + join tinh_thanh / quan_huyen / phuong_xa
  addresses: [
    {
      id: "Number",        // id
      type: "String",      // loai: 'Shipping' | 'Billing'
      isDefault: "Boolean",// mac_dinh

      name: "String",      // ten_nguoi_nhan
      phone: "String",     // so_dien_thoai
      addressLine: "String", // dia_chi_chi_tiet
      street: "String",      // duong

      wardId: "Number",       // phuong_xa_id
      wardName: "String",     // phuong_xa.ten (join)
      districtId: "Number",   // quan_huyen_id
      districtName: "String", // quan_huyen.ten (join)
      provinceId: "Number",   // tinh_thanh_id
      provinceName: "String", // tinh_thanh.ten (join)

      createdAt: "DateTime",  // thoi_gian_tao
      updatedAt: "DateTime",  // thoi_gian_cap_nhat
    },
  ],
});

// 3) Product schema – dựa trên sanpham + danh_muc + thuong_hieu + ảnh & rating
export const ProductSchema = Object.freeze({
  id: "Number",              // sanpham.MaSanPham
  name: "String",            // TenSanPham
  description: "String",     // MoTa

  categoryId: "Number",      // MaDanhMuc
  categoryName: "String",    // danh_muc.ten (join)
  brandId: "Number",         // MaThuongHieu
  brandName: "String",       // thuong_hieu.ten (join)

  price: "Number",           // Gia
  originalPrice: "Number",   // GiaGoc

  isHidden: "Boolean",       // is_an
  hiddenAt: "DateTime",      // thoi_gian_an
  hiddenBy: "Number",        // an_boi (FK nguoi_dung.id)

  images: ["String"],        // tổng hợp từ san_pham_anh.url (ưu tiên la_anh_dai_dien)
  tags: ["String"],          // tổng hợp từ tag.ten (JOIN san_pham_tag)
  ingredients: ["String"],   // tổng hợp từ thanh_phan.ten (JOIN san_pham_thanh_phan)

  rating: "Number",          // trung bình sao từ danh_gia
  reviewCount: "Number",     // số lượng đánh giá từ danh_gia

  createdAt: "DateTime",     // NgayTao
  updatedAt: "DateTime",     // NgayCapNhat
});

// 4) Order schema – dựa trên don_hang + don_hang_chi_tiet
export const OrderSchema = Object.freeze({
  id: "Number",           // don_hang.id
  userId: "Number",       // nguoi_dung_id

  status: "String",       // trang_thai
  paymentMethod: "String",// phuong_thuc_tt
  paymentStatus: "String",// trang_thai_tt

  // Tóm tắt địa chỉ giao hàng (copy từ các cột ship_*)
  shipping: {
    name: "String",        // ship_ten_nguoi_nhan
    phone: "String",       // ship_so_dien_thoai
    addressLine: "String", // ship_dia_chi_chi_tiet
    street: "String",      // ship_duong

    wardId: "Number",        // ship_phuong_xa_id
    wardName: "String",      // ship_ten_phuong_xa
    districtId: "Number",    // ship_quan_huyen_id
    districtName: "String",  // ship_ten_quan_huyen
    provinceId: "Number",    // ship_tinh_thanh_id
    provinceName: "String",  // ship_ten_tinh_thanh
  },

  // Tổng tiền
  subtotal: "Number",     // tong_hang
  shippingFee: "Number",  // phi_van_chuyen
  discountTotal: "Number",// tong_giam_gia
  grandTotal: "Number",   // tong_thanh_toan

  confirmedBy: "Number",  // xac_nhan_boi
  shippedBy: "Number",    // giao_hang_boi
  cancelReason: "String", // ly_do_huy
  failReason: "String",   // ly_do_that_bai

  // Items từ don_hang_chi_tiet
  items: [
    {
      id: "Number",          // don_hang_chi_tiet.id
      productId: "Number",   // san_pham_id
      name: "String",        // TenSanPham (join sanpham)
      listPrice: "Number",   // gia_niem_yet
      unitPrice: "Number",   // don_gia
      discountPercent: "Number", // pt_giam
      discountAmount: "Number",  // tien_giam
      quantity: "Number",    // so_luong
      lineTotal: "Number",   // thanh_tien (generated)
      image: "String",       // ảnh đại diện từ san_pham_anh (nếu có)
    },
  ],

  createdAt: "DateTime",   // thoi_gian_tao
  updatedAt: "DateTime",   // thoi_gian_cap_nhat
});

// 5) Review schema – dựa trên danh_gia
export const ReviewSchema = Object.freeze({
  id: "Number",         // id
  productId: "Number",  // san_pham_id
  userId: "Number",     // nguoi_dung_id
  rating: "Number",     // sao (1–5)
  content: "String",    // noi_dung
  status: "String",     // trang_thai: 'CHO_DUYET'|'HIEN'|'AN'
  createdAt: "DateTime",// thoi_gian_tao
  updatedAt: "DateTime",// thoi_gian_cap_nhat

  // option: view model cho FE
  userDisplayName: "String",
  userAvatar: "String",
});

// 6) Stock schema – dựa trên ton_kho
export const StockSchema = Object.freeze({
  warehouseId: "Number",      // kho_id
  productId: "Number",        // san_pham_id
  quantityOnHand: "Number",   // so_luong_ton
  quantityReserved: "Number", // so_luong_giu_cho
});

// 7) Notification schema – view model (chưa có bảng riêng trong SQL)
// Có thể build từ nhat_ky_hoat_dong hoặc future table `notifications`
export const NotificationSchema = Object.freeze({
  id: "String",
  userId: "Number",
  type: "String",     // 'order' | 'promotion' | 'system' | ...
  title: "String",
  message: "String",
  isRead: "Boolean",
  action: {
    type: "String",   // 'link' | 'rate' | ...
    label: "String",
    url: "String",
    orderId: "Number",
  },
  createdAt: "DateTime",
});
