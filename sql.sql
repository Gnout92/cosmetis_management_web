-- =========================
-- Tạo Database shop_my_pham - PHIÊN BẢN CUỐI CÙNG (KHÔNG CÓ UPDATE)
-- =========================

-- Xóa tất cả bảng cũ (nếu có)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS BaoHanh;
DROP TABLE IF EXISTS ChiTietHoaDon;
DROP TABLE IF EXISTS HoaDon;
DROP TABLE IF EXISTS DiaChi;
DROP TABLE IF EXISTS NhapHang;
DROP TABLE IF EXISTS SanPham;
DROP TABLE IF EXISTS KhachHang;
DROP TABLE IF EXISTS NhanVien;
DROP TABLE IF EXISTS Kho;
DROP TABLE IF EXISTS DanhMuc;
SET FOREIGN_KEY_CHECKS = 1;

-- Xóa database cũ và tạo mới
DROP DATABASE IF EXISTS shop_my_pham;
CREATE DATABASE IF NOT EXISTS shop_my_pham
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE shop_my_pham;

-- =========================
-- 1. Bảng Danh mục sản phẩm
-- =========================

CREATE TABLE DanhMuc (
    MaDanhMuc INT AUTO_INCREMENT PRIMARY KEY,
    TenDanhMuc VARCHAR(100) NOT NULL UNIQUE,
    MoTa VARCHAR(500) NULL,
    TrangThai TINYINT DEFAULT 1,
    NgayTao DATETIME NULL,
    NgayCapNhat DATETIME NULL
);

-- =========================
-- 2. Bảng Sản phẩm
-- =========================

CREATE TABLE SanPham (
    MaSanPham INT AUTO_INCREMENT PRIMARY KEY,
    TenSanPham VARCHAR(200) NOT NULL,
    MoTa VARCHAR(1000) NULL,
    MaDanhMuc INT NOT NULL,
    Gia DECIMAL(18,2) NOT NULL,
    GiaGoc DECIMAL(18,2) NULL,
    GiaKhuyenMai DECIMAL(18,2) NULL,
    SoLuong INT DEFAULT 0,
    TrangThai TINYINT DEFAULT 1,
    NgayTao DATETIME NULL,
    NgayCapNhat DATETIME NULL,
    CONSTRAINT FK_SanPham_DanhMuc FOREIGN KEY (MaDanhMuc) REFERENCES DanhMuc(MaDanhMuc)
);

-- =========================
-- 3. Bảng Kho
-- =========================

CREATE TABLE Kho (
    MaKho INT AUTO_INCREMENT PRIMARY KEY,
    TenKho VARCHAR(100) NOT NULL UNIQUE,
    ViTri VARCHAR(255) NULL,
    TrangThai TINYINT DEFAULT 1,
    NgayTao DATETIME NULL,
    NgayCapNhat DATETIME NULL
);

-- =========================
-- 4. Bảng Nhân viên
-- =========================

CREATE TABLE NhanVien (
    MaNV INT AUTO_INCREMENT PRIMARY KEY,
    HoVaTen VARCHAR(200) NOT NULL,
    DienThoai VARCHAR(20) NULL UNIQUE,
    Email VARCHAR(100) NULL UNIQUE,
    NgaySinh DATE NULL,
    GioiTinh TINYINT NULL COMMENT '1: Nam, 0: Nữ',
    DiaChi TEXT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    VaiTro VARCHAR(50) NOT NULL DEFAULT 'NhanVien' COMMENT 'Admin, NhanVien',
    Luong DECIMAL(18,2) NULL,
    TrangThai TINYINT DEFAULT 1,
    NgayTao DATETIME NULL,
    NgayCapNhat DATETIME NULL
);

-- =========================
-- 5. Bảng Khách hàng
-- =========================

CREATE TABLE KhachHang (
    MaKH INT AUTO_INCREMENT PRIMARY KEY,
    HoVaTen VARCHAR(200) NOT NULL,
    DienThoai VARCHAR(20) NULL UNIQUE,
    Email VARCHAR(100) NULL UNIQUE,
    NgaySinh DATE NULL,
    GioiTinh TINYINT NULL COMMENT '1: Nam, 0: Nữ',
    DiemTichLuy INT DEFAULT 0,
    MatKhau VARCHAR(255) NULL,
    TrangThai TINYINT DEFAULT 1,
    NgayTao DATETIME NULL,
    NgayCapNhat DATETIME NULL
);

-- =========================
-- 6. Bảng Địa chỉ khách hàng
-- =========================

CREATE TABLE DiaChi (
    MaDC INT AUTO_INCREMENT PRIMARY KEY,
    MaKH INT NOT NULL,
    TenNguoiNhan VARCHAR(200) NOT NULL,
    SoDienThoai VARCHAR(20) NOT NULL,
    Duong VARCHAR(100) NOT NULL,
    Phuong VARCHAR(50) NULL,
    QuanHuyen VARCHAR(50) NULL,
    TinhThanh VARCHAR(50) NULL,
    MacDinh TINYINT DEFAULT 0,
    NgayTao DATETIME NULL,
    CONSTRAINT FK_DiaChi_KhachHang FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH)
);

-- =========================
-- 7. Bảng Hóa đơn
-- =========================

CREATE TABLE HoaDon (
    MaHD INT AUTO_INCREMENT PRIMARY KEY,
    MaKH INT NOT NULL,
    MaNV INT NULL,
    MaDC INT NULL,
    NgayLap DATETIME NULL,
    TongTien DECIMAL(18,2) DEFAULT 0,
    TrangThai VARCHAR(50) DEFAULT 'ChuaXacNhan' COMMENT 'ChuaXacNhan, DaXacNhan, DangGiao, DaGiao, Huy',
    GhiChu VARCHAR(500) NULL,
    CONSTRAINT FK_HoaDon_KhachHang FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH),
    CONSTRAINT FK_HoaDon_NhanVien FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV),
    CONSTRAINT FK_HoaDon_DiaChi FOREIGN KEY (MaDC) REFERENCES DiaChi(MaDC)
);

-- =========================
-- 8. Bảng Chi tiết hóa đơn
-- =========================

CREATE TABLE ChiTietHoaDon (
    MaCTHD INT AUTO_INCREMENT PRIMARY KEY,
    MaHD INT NOT NULL,
    MaSanPham INT NOT NULL,
    SoLuong INT NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    ThanhTien DECIMAL(18,2) NOT NULL,
    CONSTRAINT FK_ChiTietHoaDon_HoaDon FOREIGN KEY (MaHD) REFERENCES HoaDon(MaHD),
    CONSTRAINT FK_ChiTietHoaDon_SanPham FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham)
);

-- =========================
-- 9. Bảng Bảo hành
-- =========================

CREATE TABLE BaoHanh (
    MaBH INT AUTO_INCREMENT PRIMARY KEY,
    MaSanPham INT NOT NULL,
    MaKH INT NULL,
    SoHD INT NULL,
    DienThoai VARCHAR(20) NOT NULL,
    Serial VARCHAR(100) NULL,
    GhiChu VARCHAR(500) NULL,
    NgayGui DATETIME NULL,
    MaXacNhan VARCHAR(100) NULL UNIQUE,
    TrangThai VARCHAR(50) DEFAULT 'DangXuLy' COMMENT 'DangXuLy, DaTiepNhan, DangSua, DaSua, TuChoi',
    CONSTRAINT FK_BaoHanh_SanPham FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham),
    CONSTRAINT FK_BaoHanh_KhachHang FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH),
    CONSTRAINT FK_BaoHanh_HoaDon FOREIGN KEY (SoHD) REFERENCES HoaDon(MaHD)
);

-- =========================
-- 10. Bảng Nhập hàng
-- =========================

CREATE TABLE NhapHang (
    MaNH INT AUTO_INCREMENT PRIMARY KEY,
    MaSanPham INT NOT NULL,
    SoLuong INT NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    ThanhTien DECIMAL(18,2) NOT NULL,
    NgayNhap DATETIME NULL,
    NhaCungCap VARCHAR(200) NULL,
    GhiChu VARCHAR(500) NULL,
    CONSTRAINT FK_NhapHang_SanPham FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham)
);

-- =========================
-- DỮ LIỆU MẪU (THỨ TỰ ĐÃ ĐƯỢC SẮP XẾP)
-- =========================

-- 1. Danh mục
INSERT INTO DanhMuc (TenDanhMuc, MoTa, TrangThai, NgayTao) VALUES
('Son môi', 'Các loại son môi', 1, NOW()),
('Kem chống nắng', 'Kem chống nắng bảo vệ da khỏi tia UV', 1, NOW()),
('Chăm sóc tóc', 'Dầu gội, dầu xả chăm sóc tóc', 1, NOW()),
('Mặt nạ', 'Mặt nạ dưỡng da', 1, NOW()),
('Sữa tắm', 'Sữa tắm hương thơm dịu nhẹ', 1, NOW()),
('Kem dưỡng', 'Kem dưỡng ẩm cho da mềm mịn', 1, NOW()),
('Xịt khoáng', 'Xịt khoáng giữ ẩm cho da', 1, NOW()),
('Toner', 'Nước hoa hồng cân bằng da', 1, NOW()),
('Nước hoa', 'Nước hoa các loại', 1, NOW()),
('Serum', 'Serum dưỡng da', 1, NOW());

-- 2. Kho
INSERT INTO Kho (TenKho, ViTri, TrangThai, NgayTao) VALUES
('Kho trung tâm', 'Hà Nội', 1, NOW()),
('Kho chi nhánh Hồ Chí Minh', 'TP.HCM', 1, NOW()),
('Kho TP Đà Nẵng', 'Đà Nẵng', 1, NOW());

-- 3. Nhân viên
INSERT INTO NhanVien (HoVaTen, DienThoai, Email, MatKhau, VaiTro, Luong, TrangThai, NgayTao) VALUES
('minh tien', '0911234567', 'admin1@shop.com', '123', 'Admin', 15000000, 1, NOW()),
('minh tuong', '0901234567', 'admin2@shop.com', '123', 'Admin', 15000000, 1, NOW()),
('Trần Thị Bán hàng', '0902345678', 'banhang@shop.com', '123456', 'NhanVien', 8000000, 1, NOW()),
('Lê Thị Kế toán', '0903456789', 'ketoan@shop.com', '123456', 'NhanVien', 9000000, 1, NOW()),
('Phạm Văn Kho', '0904567890', 'kho@shop.com', '123456', 'NhanVien', 8500000, 1, NOW());

-- 4. Khách hàng
INSERT INTO KhachHang (HoVaTen, DienThoai, Email, MatKhau, DiemTichLuy, TrangThai, NgayTao) VALUES
('Nguyễn Văn Khách', '0981111111', 'khach1@shop.com', 'customer123', 150, 1, NOW()),
('Trần Thị Long', '0982222222', 'khach2@shop.com', 'customer123', 200, 1, NOW()),
('Lê Văn Minh', '0983333333', 'khach3@shop.com', 'customer123', 50, 1, NOW()),
('Phạm Thị Nam', '0984444444', 'khach4@shop.com', 'customer123', 300, 1, NOW()),
('Hoàng Văn Oanh', '0985555555', 'khach5@shop.com', 'customer123', 100, 1, NOW());

-- 5. Địa chỉ khách hàng
INSERT INTO DiaChi (MaKH, TenNguoiNhan, SoDienThoai, Duong, Phuong, QuanHuyen, TinhThanh, MacDinh, NgayTao) VALUES
(1, 'Nguyễn Văn Khách', '0981111111', '123 Đường Lê Lợi', 'Phường 1', 'Quận 1', 'TP.HCM', 1, NOW()),
(2, 'Trần Thị Long', '0982222222', '456 Đường Trần Hưng Đạo', 'Phường 2', 'Quận 5', 'TP.HCM', 1, NOW()),
(3, 'Lê Văn Minh', '0983333333', '789 Đường Nguyễn Văn Cừ', 'Phường 3', 'Quận 3', 'TP.HCM', 1, NOW()),
(4, 'Phạm Thị Nam', '0984444444', '321 Đường Lê Văn Sỹ', 'Phường 4', 'Quận 10', 'TP.HCM', 1, NOW()),
(5, 'Hoàng Văn Oanh', '0985555555', '654 Đường Hồ Biểu Chánh', 'Phường 5', 'Quật Phú Nhuận', 'TP.HCM', 1, NOW());

-- 6. Sản phẩm (THÊM TRƯỚC để ChiTietHoaDon có thể tham chiếu)
INSERT INTO SanPham (TenSanPham, MoTa, MaDanhMuc, Gia, GiaGoc, GiaKhuyenMai, SoLuong, NgayTao) VALUES
-- Son môi (MaDanhMuc = 1)
('Son môi đỏ Ruby', 'Son đỏ Ruby lâu trôi', 1, 200000, 250000, 180000, 50, NOW()),
('Son môi hồng Coral', 'Son hồng nhẹ nhàng', 1, 180000, 220000, 160000, 40, NOW()),
('Son môi cam Sunset', 'Son cam tươi sáng', 1, 190000, 230000, 170000, 35, NOW()),
('Son môi nude', 'Tông nude tự nhiên', 1, 180000, 220000, 160000, 50, NOW()),
('Son môi đỏ cherry', 'Đỏ cherry tươi sáng', 1, 190000, 230000, 170000, 40, NOW()),
('Son dưỡng có màu', 'Dưỡng và tạo màu nhẹ', 1, 90000, 120000, 85000, 55, NOW()),
('Son bóng dưỡng ẩm', 'Tạo độ bóng và mềm môi', 1, 85000, 110000, 80000, 50, NOW()),

-- Kem chống nắng (MaDanhMuc = 2)  
('Kem dưỡng ẩm ban ngày', 'Dưỡng ẩm và chống nắng', 2, 150000, 180000, 140000, 30, NOW()),
('Kem dưỡng ẩm ban đêm', 'Dưỡng ẩm sâu cho da', 2, 160000, 200000, 150000, 25, NOW()),
('Serum vitamin C', 'Serum sáng da và mờ thâm', 2, 220000, 260000, 200000, 20, NOW()),
('Kem chống nắng SPF50+', 'Bảo vệ da khỏi tia UV', 2, 180000, 220000, 170000, 50, NOW()),
('Kem chống nắng SPF30', 'Bảo vệ da hàng ngày', 2, 150000, 190000, 140000, 45, NOW()),
('Kem dưỡng mắt chống nhăn', 'Giảm quầng thâm mắt', 2, 200000, 250000, 185000, 30, NOW()),
('Serum chống lão hóa', 'Giữ da trẻ trung', 2, 250000, 300000, 230000, 25, NOW()),
('Serum trị mụn', 'Giảm mụn và thâm', 2, 230000, 270000, 210000, 25, NOW()),
('Kem dưỡng tay', 'Dưỡng ẩm và mềm da tay', 2, 100000, 130000, 95000, 50, NOW()),
('Kem dưỡng chân', 'Dưỡng ẩm và mềm da chân', 2, 90000, 120000, 85000, 45, NOW()),

-- Chăm sóc tóc (MaDanhMuc = 3)
('Dầu gội dưỡng tóc mềm', 'Dưỡng tóc suôn mượt', 3, 120000, 150000, 110000, 40, NOW()),
('Dầu gội trị gàu', 'Ngăn ngừa gàu hiệu quả', 3, 130000, 160000, 120000, 35, NOW()),
('Dầu xả dưỡng tóc', 'Giữ tóc mềm mượt', 3, 100000, 130000, 95000, 40, NOW()),
('Dầu gội thảo mộc', 'Ngăn rụng tóc', 3, 140000, 170000, 130000, 35, NOW()),
('Dầu gội nam', 'Giữ tóc khỏe mạnh', 3, 130000, 160000, 120000, 30, NOW()),
('Dầu xả phục hồi tóc', 'Hồi phục tóc hư tổn', 3, 120000, 150000, 110000, 40, NOW()),

-- Mặt nạ (MaDanhMuc = 4)
('Mặt nạ giấy dưỡng da', 'Dưỡng ẩm và làm sáng da', 4, 70000, 100000, 65000, 70, NOW()),
('Mặt nạ đất sét', 'Làm sạch lỗ chân lông', 4, 75000, 105000, 70000, 60, NOW()),
('Mặt nạ ngủ', 'Dưỡng ẩm sâu qua đêm', 4, 80000, 110000, 75000, 65, NOW()),
('Mặt nạ giấy cấp ẩm', 'Cấp nước tức thì', 4, 75000, 105000, 70000, 60, NOW()),
('Mặt nạ ngủ dưỡng trắng', 'Dưỡng trắng da qua đêm', 4, 85000, 110000, 80000, 65, NOW()),
('Mặt nạ than hoạt tính', 'Làm sạch sâu', 4, 80000, 105000, 75000, 60, NOW()),

-- Nước hoa (MaDanhMuc = 9)
('Nước hoa Chanel No.5', 'Hương thơm nữ tính', 9, 1200000, 1500000, 1150000, 20, NOW()),
('Nước hoa Dior Sauvage', 'Hương thơm nam tính', 9, 1300000, 1600000, 1250000, 15, NOW()),
('Nước hoa Versace Eros', 'Hương nam mạnh mẽ', 9, 1250000, 1550000, 1200000, 20, NOW()),
('Nước hoa Gucci Bloom', 'Hương nữ tính nhẹ nhàng', 9, 1150000, 1450000, 1100000, 18, NOW()),
('Nước hoa Lancome La Vie Est Belle', 'Hương nữ tính', 9, 1200000, 1500000, 1150000, 20, NOW()),
('Nước hoa Dior Homme', 'Hương nam tính sang trọng', 9, 1300000, 1600000, 1250000, 20, NOW()),

-- Sữa tắm (MaDanhMuc = 5)
('Sữa tắm dịu nhẹ', 'Dịu nhẹ cho da nhạy cảm', 5, 85000, 110000, 80000, 40, NOW()),
('Sữa tắm hương hoa', 'Thơm mát hương hoa', 5, 90000, 115000, 85000, 35, NOW()),
('Sữa tắm trị mụn', 'Ngăn ngừa mụn lưng', 5, 95000, 120000, 90000, 30, NOW()),

-- Toner (MaDanhMuc = 8)
('Toner cân bằng da', 'Cân bằng độ pH cho da', 8, 90000, 120000, 85000, 60, NOW()),
('Toner làm sáng da', 'Làm sáng và đều màu da', 8, 95000, 125000, 90000, 60, NOW()),
('Toner dịu nhẹ', 'Dịu nhẹ cho da nhạy cảm', 8, 90000, 120000, 85000, 60, NOW()),

-- Xịt khoáng (MaDanhMuc = 7)
('Xịt khoáng dưỡng ẩm', 'Giữ ẩm tức thì cho da', 7, 95000, 130000, 90000, 40, NOW()),
('Xịt khoáng khoáng chất', 'Dưỡng ẩm và làm dịu da', 7, 98000, 128000, 93000, 50, NOW()),
('Xịt khoáng se khít lỗ chân lông', 'Se khít lỗ chân lông', 7, 95000, 125000, 90000, 50, NOW()),

-- Serum (MaDanhMuc = 10)
('Serum vitamin C 10%', 'Sáng da và mờ thâm', 10, 180000, 220000, 170000, 35, NOW()),
('Serum hyaluronic acid', 'Cấp ẩm sâu', 10, 200000, 240000, 190000, 30, NOW()),
('Serum retinol', 'Chống lão hóa', 10, 250000, 300000, 230000, 25, NOW()),
('Serum niacinamide', 'Kiểm soát dầu', 10, 170000, 210000, 160000, 40, NOW()),
('Serum peptide', 'Tăng đàn hồi da', 10, 280000, 350000, 260000, 20, NOW());

-- 7. Hóa đơn (VỚI TỔNG TIỀN ĐÃ TÍNH CHÍNH XÁC)
-- HD1: (1,1,2,200000,400000) + (1,5,1,190000,190000) = 590000
-- HD2: (2,3,2,180000,360000) + (2,8,1,150000,150000) + (2,15,2,95000,190000) = 700000  
-- HD3: (3,2,1,180000,180000) + (3,12,1,150000,150000) = 330000
-- HD4: (4,6,2,120000,240000) + (4,20,1,130000,130000) + (4,25,3,75000,225000) = 595000
INSERT INTO HoaDon (MaKH, MaNV, MaDC, NgayLap, TongTien, TrangThai, GhiChu) VALUES
(1, 2, 1, NOW(), 590000, 'DaXacNhan', 'Đơn hàng đầu tiên'),
(2, 3, 2, NOW(), 700000, 'DaGiao', 'Thanh toán đầy đủ'),
(3, 2, 3, NOW(), 330000, 'DangGiao', 'Vận chuyển nhanh'),
(4, 4, 4, NOW(), 595000, 'DaXacNhan', 'Khách hàng VIP');

-- 8. Chi tiết hóa đơn (THÊM SAU SanPham và HoaDon)
INSERT INTO ChiTietHoaDon (MaHD, MaSanPham, SoLuong, DonGia, ThanhTien) VALUES
(1, 1, 2, 200000, 400000),
(1, 5, 1, 190000, 190000),
(2, 3, 2, 180000, 360000),
(2, 8, 1, 150000, 150000),
(2, 15, 2, 95000, 190000),
(3, 2, 1, 180000, 180000),
(3, 12, 1, 150000, 150000),
(4, 6, 2, 120000, 240000),
(4, 20, 1, 130000, 130000),
(4, 25, 3, 75000, 225000);

-- 9. Nhập hàng
INSERT INTO NhapHang (MaSanPham, SoLuong, DonGia, ThanhTien, NgayNhap, NhaCungCap, GhiChu) VALUES
(1, 100, 200000, 20000000, NOW(), 'Công ty A', 'Nhập hàng lần 1'),
(2, 80, 180000, 14400000, NOW(), 'Công ty B', 'Nhập hàng đầu tiên'),
(3, 60, 190000, 11400000, NOW(), 'Công ty A', 'Tồn kho đầu năm'),
(4, 100, 180000, 18000000, NOW(), 'Công ty C', 'Nhập hàng thường xuyên'),
(5, 90, 190000, 17100000, NOW(), 'Công ty B', 'Nhập hàng theo kế hoạch'),
(6, 120, 90000, 10800000, NOW(), 'Công ty A', 'Hàng bán chạy'),
(7, 110, 85000, 9350000, NOW(), 'Công ty C', 'Tồn kho cuối tháng'),
(8, 50, 150000, 7500000, NOW(), 'Công ty B', 'Hàng mới nhập'),
(9, 45, 160000, 7200000, NOW(), 'Công ty A', 'Nhập theo đơn hàng'),
(10, 40, 220000, 8800000, NOW(), 'Công ty B', 'Hàng cao cấp'),
(11, 80, 180000, 14400000, NOW(), 'Công ty C', 'Nhập hàng quý'),
(12, 75, 150000, 11250000, NOW(), 'Công ty A', 'Hàng trung cấp'),
(13, 35, 200000, 7000000, NOW(), 'Công ty B', 'Nhập hàng cao cấp'),
(14, 30, 250000, 7500000, NOW(), 'Công ty C', 'Hàng premium'),
(15, 35, 230000, 8050000, NOW(), 'Công ty A', 'Chăm sóc da chuyên nghiệp'),
(16, 70, 100000, 7000000, NOW(), 'Công ty B', 'Hàng thông dụng'),
(17, 65, 90000, 5850000, NOW(), 'Công ty C', 'Nhập định kỳ'),
(18, 70, 120000, 8400000, NOW(), 'Công ty A', 'Dầu gội cao cấp'),
(19, 60, 130000, 7800000, NOW(), 'Công ty B', 'Trị gàu hiệu quả'),
(20, 80, 100000, 8000000, NOW(), 'Công ty C', 'Dầu xả dưỡng tóc'),
(21, 60, 140000, 8400000, NOW(), 'Công ty A', 'Thảo mộc tự nhiên'),
(22, 50, 130000, 6500000, NOW(), 'Công ty B', 'Chuyên nam giới'),
(23, 70, 120000, 8400000, NOW(), 'Công ty C', 'Phục hồi tóc hư tổn'),
(24, 120, 70000, 8400000, NOW(), 'Công ty A', 'Mặt nạ giấy phổ biến'),
(25, 100, 75000, 7500000, NOW(), 'Công ty B', 'Đất sét tự nhiên'),
(26, 110, 80000, 8800000, NOW(), 'Công ty C', 'Mặt nạ ngủ'),
(27, 100, 75000, 7500000, NOW(), 'Công ty A', 'Cấp ẩm tức thì'),
(28, 110, 85000, 9350000, NOW(), 'Công ty B', 'Dưỡng trắng'),
(29, 100, 80000, 8000000, NOW(), 'Công ty C', 'Làm sạch sâu'),
(30, 1000, 1200000, 1200000000, NOW(), 'Chanel', 'Nhập chính hãng'),
(31, 800, 1300000, 1040000000, NOW(), 'Dior', 'Nhập chính hãng'),
(32, 900, 1250000, 1125000000, NOW(), 'Versace', 'Nhập chính hãng'),
(33, 850, 1150000, 977500000, NOW(), 'Gucci', 'Nhập chính hãng'),
(34, 1000, 1200000, 1200000000, NOW(), 'Lancome', 'Nhập chính hãng'),
(35, 900, 1300000, 1170000000, NOW(), 'Dior', 'Nhập chính hãng'),
(36, 70, 85000, 5950000, NOW(), 'Công ty A', 'Dịu nhẹ cho da'),
(37, 65, 90000, 5850000, NOW(), 'Công ty B', 'Hương hoa thơm mát'),
(38, 60, 95000, 5700000, NOW(), 'Công ty C', 'Trị mụn hiệu quả'),
(39, 100, 90000, 9000000, NOW(), 'Công ty A', 'Cân bằng da'),
(40, 95, 95000, 9025000, NOW(), 'Công ty B', 'Làm sáng da'),
(41, 95, 90000, 8550000, NOW(), 'Công ty C', 'Dịu nhẹ'),
(42, 70, 95000, 6650000, NOW(), 'Công ty A', 'Dưỡng ẩm tức thì'),
(43, 80, 98000, 7840000, NOW(), 'Công ty B', 'Khoáng chất tự nhiên'),
(44, 80, 95000, 7600000, NOW(), 'Công ty C', 'Se khít lỗ chân lông'),
(45, 60, 180000, 10800000, NOW(), 'Công ty A', 'Vitamin C chất lượng cao'),
(46, 50, 200000, 10000000, NOW(), 'Công ty B', 'Cấp ẩm sâu'),
(47, 40, 250000, 10000000, NOW(), 'Công ty C', 'Chống lão hóa'),
(48, 65, 170000, 11050000, NOW(), 'Công ty A', 'Kiểm soát dầu'),
(49, 35, 280000, 9800000, NOW(), 'Công ty B', 'Tăng đàn hồi da');

-- 10. Bảo hành mẫu
INSERT INTO BaoHanh (MaSanPham, MaKH, SoHD, DienThoai, Serial, GhiChu, MaXacNhan, TrangThai, NgayGui) VALUES
(1, 1, 1, '0981111111', 'SN123456', 'Bảo hành son môi', 'BH001', 'DangXuLy', NOW()),
(3, 2, 2, '0982222222', 'SN234567', 'Bảo hành son môi', 'BH002', 'DaTiepNhan', NOW()),
(8, 3, 3, '0983333333', 'SN345678', 'Bảo hành kem chống nắng', 'BH003', 'DangSua', NOW()),
(12, 4, 4, '0984444444', 'SN456789', 'Bảo hành kem chống nắng SPF30', 'BH004', 'DaSua', NOW()),
(15, 1, 1, '0981111111', 'SN567890', 'Bảo hành serum', 'BH005', 'DangXuLy', NOW()),
(20, 2, 2, '0982222222', 'SN678901', 'Bảo hành dầu xả', 'BH006', 'DaTiepNhan', NOW()),
(24, 3, 3, '0983333333', 'SN789012', 'Bảo hành mặt nạ giấy', 'BH007', 'DangSua', NOW()),
(30, 4, 4, '0984444444', 'SN890123', 'Bảo hành nước hoa Chanel', 'BH008', 'DaSua', NOW()),
(31, 5, NULL, '0985555555', 'SN901234', 'Bảo hành nước hoa Dior', 'BH009', 'DangXuLy', NOW()),
(35, 1, 1, '0981111111', 'SN012345', 'Bảo hành nước hoa Dior Homme', 'BH010', 'DaTiepNhan', NOW());

-- =========================
-- HIỂN THỊ DỮ LIỆU
-- =========================

-- Danh mục
SELECT 'DanhMuc' AS Bang, MaDanhMuc, TenDanhMuc, MoTa, TrangThai FROM DanhMuc ORDER BY MaDanhMuc;

-- Nhân viên
SELECT 'NhanVien' AS Bang, MaNV, HoVaTen, DienThoai, Email, VaiTro, TrangThai FROM NhanVien ORDER BY MaNV;

-- Khách hàng
SELECT 'KhachHang' AS Bang, MaKH, HoVaTen, DienThoai, Email, DiemTichLuy, TrangThai FROM KhachHang ORDER BY MaKH;

-- Sản phẩm
SELECT 'SanPham' AS Bang, MaSanPham, TenSanPham, MoTa, MaDanhMuc, Gia, GiaGoc, GiaKhuyenMai, SoLuong, TrangThai FROM SanPham ORDER BY MaDanhMuc, MaSanPham;

-- Bảo hành
SELECT 'BaoHanh' AS Bang, MaBH, MaSanPham, MaKH, SoHD, DienThoai, Serial, GhiChu, MaXacNhan, TrangThai FROM BaoHanh ORDER BY MaBH;

-- Nhập hàng
SELECT 'NhapHang' AS Bang, MaNH, MaSanPham, SoLuong, DonGia, ThanhTien, NhaCungCap, GhiChu FROM NhapHang ORDER BY MaNH;

-- =========================
-- TRUY VẤN BÁO CÁO
-- =========================

-- 1. Thống kê sản phẩm theo danh mục
SELECT 
    dm.TenDanhMuc,
    COUNT(sp.MaSanPham) as SoLuongSanPham,
    SUM(sp.SoLuong) as TongSoLuongTon,
    AVG(sp.Gia) as GiaTrungBinh,
    MIN(sp.Gia) as GiaMin,
    MAX(sp.Gia) as GiaMax
FROM DanhMuc dm
LEFT JOIN SanPham sp ON dm.MaDanhMuc = sp.MaDanhMuc
GROUP BY dm.MaDanhMuc, dm.TenDanhMuc
ORDER BY dm.TenDanhMuc;

-- 2. Sản phẩm sắp hết hàng (số lượng <= 10)
SELECT 
    TenSanPham,
    SoLuong,
    Gia,
    (SELECT TenDanhMuc FROM DanhMuc WHERE MaDanhMuc = SanPham.MaDanhMuc) as DanhMuc
FROM SanPham 
WHERE SoLuong <= 10 
ORDER BY SoLuong ASC;

-- 3. Thống kê hóa đơn theo trạng thái
SELECT 
    TrangThai,
    COUNT(*) as SoLuongHoaDon,
    SUM(TongTien) as TongTienTheoTrangThai,
    AVG(TongTien) as GiaTriTrungBinh
FROM HoaDon
GROUP BY TrangThai
ORDER BY SoLuongHoaDon DESC;

-- 4. Top 5 sản phẩm bán chạy nhất
SELECT 
    sp.TenSanPham,
    SUM(cthd.SoLuong) as SoLuongBan,
    SUM(cthd.ThanhTien) as DoanhThu,
    (SELECT TenDanhMuc FROM DanhMuc WHERE MaDanhMuc = sp.MaDanhMuc) as DanhMuc
FROM ChiTietHoaDon cthd
INNER JOIN SanPham sp ON cthd.MaSanPham = sp.MaSanPham
GROUP BY sp.MaSanPham, sp.TenSanPham
ORDER BY SoLuongBan DESC
LIMIT 5;

-- 5. Thống kê khách hàng theo cấp độ VIP
SELECT 
    CASE 
        WHEN DiemTichLuy >= 200 THEN 'VIP'
        WHEN DiemTichLuy >= 100 THEN 'Thân thiết'
        ELSE 'Thường'
    END as CapDo,
    COUNT(*) as SoLuongKhachHang,
    AVG(DiemTichLuy) as DiemTrungBinh,
    SUM(DiemTichLuy) as TongDiemTichLuy
FROM KhachHang 
GROUP BY 
    CASE 
        WHEN DiemTichLuy >= 200 THEN 'VIP'
        WHEN DiemTichLuy >= 100 THEN 'Thân thiết'
        ELSE 'Thường'
    END
ORDER BY SoLuongKhachHang DESC;

-- 6. Báo cáo bảo hành theo trạng thái (QUERY GỐC CỦA USER)
SELECT 
    TrangThai,
    COUNT(*) as SoLuong,
    COUNT(DISTINCT MaSanPham) as SoLoaiSanPham
FROM BaoHanh 
GROUP BY TrangThai
ORDER BY SoLuong DESC;

-- 7. Nhập hàng trong tháng này
SELECT 
    nh.MaSanPham,
    sp.TenSanPham,
    nh.SoLuong,
    nh.DonGia,
    nh.ThanhTien,
    nh.NgayNhap,
    nh.NhaCungCap
FROM NhapHang nh
INNER JOIN SanPham sp ON nh.MaSanPham = sp.MaSanPham
WHERE MONTH(nh.NgayNhap) = MONTH(CURRENT_DATE())
    AND YEAR(nh.NgayNhap) = YEAR(CURRENT_DATE())
ORDER BY nh.NgayNhap DESC;

-- 8. Doanh thu theo nhân viên
SELECT 
    nv.HoVaTen,
    nv.VaiTro,
    COUNT(hd.MaHD) as SoLuongHoaDon,
    SUM(hd.TongTien) as DoanhThu,
    AVG(hd.TongTien) as GiaTriDonHangTrungBinh
FROM NhanVien nv
LEFT JOIN HoaDon hd ON nv.MaNV = hd.MaNV
WHERE hd.TrangThai IN ('DaXacNhan', 'DaGiao') OR hd.TrangThai IS NULL
GROUP BY nv.MaNV, nv.HoVaTen, nv.VaiTro
ORDER BY DoanhThu DESC;

-- 9. Sản phẩm có giá khuyến mãi cao nhất (giảm > 30%)
SELECT 
    sp.TenSanPham,
    sp.GiaGoc,
    sp.Gia,
    sp.GiaKhuyenMai,
    ROUND(((sp.GiaGoc - sp.GiaKhuyenMai) / sp.GiaGoc) * 100, 2) as PhanTramGiam,
    (SELECT TenDanhMuc FROM DanhMuc WHERE MaDanhMuc = sp.MaDanhMuc) as DanhMuc
FROM SanPham sp
WHERE sp.GiaKhuyenMai IS NOT NULL 
    AND ((sp.GiaGoc - sp.GiaKhuyenMai) / sp.GiaGoc) > 0.30
ORDER BY PhanTramGiam DESC;

-- 10. Tổng quan cửa hàng
SELECT 
    (SELECT COUNT(*) FROM DanhMuc WHERE TrangThai = 1) as TongSoDanhMuc,
    (SELECT COUNT(*) FROM SanPham WHERE TrangThai = 1) as TongSoSanPham,
    (SELECT COUNT(*) FROM NhanVien WHERE TrangThai = 1) as TongSoNhanVien,
    (SELECT COUNT(*) FROM KhachHang WHERE TrangThai = 1) as TongSoKhachHang,
    (SELECT SUM(SoLuong) FROM SanPham) as TongSoLuongTonKho,
    (SELECT SUM(TongTien) FROM HoaDon WHERE TrangThai IN ('DaXacNhan', 'DaGiao')) as DoanhThu,
    (SELECT COUNT(*) FROM BaoHanh) as SoLuongBaoHanh;