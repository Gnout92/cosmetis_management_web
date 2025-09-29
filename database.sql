-- =========================
-- Tạo Database
-- =========================
CREATE DATABASE IF NOT EXISTS MyPhamShop
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE MyPhamShop;

-- =========================
-- 1. Bảng Danh mục sản phẩm
-- =========================
CREATE TABLE DanhMuc (
    MaDanhMuc INT AUTO_INCREMENT PRIMARY KEY,
    TenDanhMuc VARCHAR(100) NOT NULL,
    MoTa VARCHAR(500) NULL,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    SoLuong INT DEFAULT 0,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_SanPham_DanhMuc FOREIGN KEY (MaDanhMuc) REFERENCES DanhMuc(MaDanhMuc)
);

-- =========================
-- 3. Bảng Kho
-- =========================
CREATE TABLE Kho (
    MaKho INT AUTO_INCREMENT PRIMARY KEY,
    TenKho VARCHAR(100) NOT NULL,
    ViTri VARCHAR(255) NULL,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- 4. Bảng Nhân viên
-- =========================
CREATE TABLE NhanVien (
    MaNV INT AUTO_INCREMENT PRIMARY KEY,
    HoVaTen VARCHAR(200) NOT NULL,
    DienThoai VARCHAR(20) NULL,
    Email VARCHAR(100) NULL,
    MatKhau VARCHAR(255) NOT NULL,
    VaiTro VARCHAR(50) NULL,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- 5. Bảng Khách hàng
-- =========================
CREATE TABLE KhachHang (
    MaKH INT AUTO_INCREMENT PRIMARY KEY,
    HoVaTen VARCHAR(200) NOT NULL,
    DienThoai VARCHAR(20) NULL,
    Email VARCHAR(100) NULL,
    MatKhau VARCHAR(255) NULL,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- 6. Bảng Địa chỉ khách hàng
-- =========================
CREATE TABLE DiaChi (
    MaDC INT AUTO_INCREMENT PRIMARY KEY,
    MaKH INT NOT NULL,
    Duong VARCHAR(100) NOT NULL,
    Phuong VARCHAR(50) NULL,
    QuanHuyen VARCHAR(50) NULL,
    TinhThanh VARCHAR(50) NULL,
    CONSTRAINT FK_DiaChi_KhachHang FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH)
);

-- =========================
-- 7. Bảng Hóa đơn
-- =========================
CREATE TABLE HoaDon (
    MaHD INT AUTO_INCREMENT PRIMARY KEY,
    MaKH INT NOT NULL,
    MaNV INT NULL,
    NgayLap DATETIME DEFAULT CURRENT_TIMESTAMP,
    TongTien DECIMAL(18,2) DEFAULT 0,
    TrangThai VARCHAR(50) DEFAULT 'ChuaXacNhan',
    CONSTRAINT FK_HoaDon_KhachHang FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH),
    CONSTRAINT FK_HoaDon_NhanVien FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV)
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
    ThanhTien DECIMAL(18,2) GENERATED ALWAYS AS (SoLuong * DonGia) STORED,
    CONSTRAINT FK_ChiTietHoaDon_HoaDon FOREIGN KEY (MaHD) REFERENCES HoaDon(MaHD),
    CONSTRAINT FK_ChiTietHoaDon_SanPham FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham)
);

-- =========================
-- 9. Bảng Bảo hành
-- =========================
CREATE TABLE BaoHanh (
    MaBH INT AUTO_INCREMENT PRIMARY KEY,
    MaSanPham INT NOT NULL,
    DienThoai VARCHAR(20) NOT NULL,
    Serial VARCHAR(100) NULL,
    GhiChu VARCHAR(500) NULL,
    NgayGui DATETIME DEFAULT CURRENT_TIMESTAMP,
    MaXacNhan VARCHAR(100) NULL,
    CONSTRAINT FK_BaoHanh_SanPham FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham)
);

-- =========================
-- 10. Bảng Tài khoản người dùng
-- =========================
CREATE TABLE TaiKhoanNguoiDung (
    MaTaiKhoan INT AUTO_INCREMENT PRIMARY KEY,
    MaNV INT NULL,
    MaKH INT NULL,
    TenDangNhap VARCHAR(100) NOT NULL UNIQUE,
    MatKhauHash VARCHAR(255) NOT NULL,
    VaiTro VARCHAR(50) NOT NULL DEFAULT 'NhanVien',
    DangHoatDong BOOLEAN NOT NULL DEFAULT 1,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_TaiKhoan_NhanVien FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV),
    CONSTRAINT FK_TaiKhoan_KhachHang FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH)
);

-- =========================
-- DỮ LIỆU MẪU
-- =========================

-- Danh mục
INSERT INTO DanhMuc (TenDanhMuc, MoTa) VALUES
('Sữa rửa mặt', 'Các loại sữa rửa mặt cho da mặt'),
('Kem chống nắng', 'Kem chống nắng bảo vệ da khỏi tia UV'),
('Dầu gội', 'Dầu gội chăm sóc tóc'),
('Mặt nạ', 'Mặt nạ dưỡng da'),
('Sữa tắm', 'Sữa tắm hương thơm dịu nhẹ'),
('Kem dưỡng ẩm', 'Kem dưỡng ẩm cho da mềm mịn'),
('Xịt khoáng', 'Xịt khoáng giữ ẩm cho da'),
('Toner', 'Nước hoa hồng cân bằng da');

-- Kho
INSERT INTO Kho (TenKho, ViTri) VALUES
('Kho trung tâm', 'Hà Nội'),
('Kho chi nhánh Hồ Chí Minh', 'TP.HCM'),
('Kho TP Đà Nẵng', 'Đà Nẵng'),
('Kho Hải Phòng', 'Hải Phòng'),
('Kho Bình Dương', 'Bình Dương');

-- Nhân viên
INSERT INTO NhanVien (HoVaTen, DienThoai, Email, MatKhau, VaiTro) VALUES
('Nguyen Van A', '0901234567', 'a@shop.com', '123456', 'Admin'),
('Tran Thi B', '0902345678', 'b@shop.com', '123456', 'NhanVien'),
('Le Thi C', '0903456789', 'c@shop.com', '123456', 'NhanVien'),
('Pham Van D', '0904567890', 'd@shop.com', '123456', 'NhanVien'),
('Hoang Thi E', '0905678901', 'e@shop.com', '123456', 'NhanVien');

-- Khách hàng
INSERT INTO KhachHang (HoVaTen, DienThoai, Email, MatKhau) VALUES
('Nguyen Van K', '0981111111', 'k@shop.com', '123456'),
('Tran Thi L', '0982222222', 'l@shop.com', '123456'),
('Le Van M', '0983333333', 'm@shop.com', '123456'),
('Pham Thi N', '0984444444', 'n@shop.com', '123456'),
('Hoang Van O', '0985555555', 'o@shop.com', '123456');

-- Địa chỉ khách hàng
INSERT INTO DiaChi (MaKH, Duong, Phuong, QuanHuyen, TinhThanh) VALUES
(1, '123 Đường Lê Lợi', 'Phường 1', 'Quận 1', 'TP.HCM'),
(2, '456 Đường Trần Hưng Đạo', 'Phường 2', 'Quận 5', 'TP.HCM'),
(3, '789 Đường Nguyễn Văn Cừ', 'Phường 3', 'Quận 3', 'TP.HCM'),
(4, '321 Đường Lê Văn Sỹ', 'Phường 4', 'Quận 10', 'TP.HCM'),
(5, '654 Đường Hồ Biểu Chánh', 'Phường 5', 'Quận Phú Nhuận', 'TP.HCM');

-- Sản phẩm (ví dụ 10 sản phẩm, bạn có thể thêm tiếp từ script cũ)
INSERT INTO SanPham (TenSanPham, MoTa, MaDanhMuc, Gia, GiaGoc, SoLuong) VALUES
('Son môi đỏ Ruby', 'Son đỏ Ruby lâu trôi', 1, 200000, 250000, 50),
('Son môi hồng Coral', 'Son hồng nhẹ nhàng', 1, 180000, 220000, 40),
('Son môi cam Sunset', 'Son cam tươi sáng', 1, 190000, 230000, 35),
('Kem dưỡng ẩm ban ngày', 'Dưỡng ẩm và chống nắng', 2, 150000, 180000, 30),
('Kem dưỡng ẩm ban đêm', 'Dưỡng ẩm sâu cho da', 2, 160000, 200000, 25),
('Serum vitamin C', 'Serum sáng da và mờ thâm', 2, 220000, 260000, 20),
('Sữa rửa mặt làm sạch sâu', 'Loại bỏ bụi bẩn và bã nhờn', 1, 120000, 150000, 50),
('Sữa rửa mặt dịu nhẹ', 'Phù hợp da nhạy cảm', 1, 110000, 140000, 45),
('Toner cân bằng da', 'Cân bằng độ pH cho da', 8, 90000, 120000, 60),
('Xịt khoáng dưỡng ẩm', 'Giữ ẩm tức thì cho da', 7, 95000, 130000, 40),
('Mặt nạ giấy dưỡng da', 'Dưỡng ẩm và làm sáng da', 4, 70000, 100000, 70),
('Mặt nạ đất sét', 'Làm sạch lỗ chân lông', 4, 75000, 105000, 60),
('Nước hoa Chanel No.5', 'Hương thơm nữ tính', 3, 1200000, 1500000, 20),
('Nước hoa Dior Sauvage', 'Hương thơm nam tính', 3, 1300000, 1600000, 15),
('Kem chống nắng SPF50+', 'Bảo vệ da khỏi tia UV', 2, 180000, 220000, 50),
('Kem chống nắng SPF30', 'Bảo vệ da hàng ngày', 2, 150000, 190000, 45),
('Dầu gội dưỡng tóc mềm', 'Dưỡng tóc suôn mượt', 3, 120000, 150000, 40),
('Dầu gội trị gàu', 'Ngăn ngừa gàu hiệu quả', 3, 130000, 160000, 35),
('Dầu xả dưỡng tóc', 'Giữ tóc mềm mượt', 3, 100000, 130000, 40),
('Son dưỡng có màu', 'Dưỡng và tạo màu nhẹ', 1, 90000, 120000, 55),
('Son bóng dưỡng ẩm', 'Tạo độ bóng và mềm môi', 1, 85000, 110000, 50),
('Kem dưỡng mắt chống nhăn', 'Giảm quầng thâm mắt', 2, 200000, 250000, 30),
('Serum chống lão hóa', 'Giữ da trẻ trung', 2, 250000, 300000, 25),
('Sữa rửa mặt tạo bọt', 'Loại bỏ bụi bẩn hiệu quả', 1, 100000, 130000, 50),
('Sữa rửa mặt không tạo bọt', 'Dịu nhẹ cho da nhạy cảm', 1, 105000, 135000, 45),
('Toner làm sáng da', 'Làm sáng và đều màu da', 8, 95000, 125000, 60),
('Xịt khoáng khoáng chất', 'Dưỡng ẩm và làm dịu da', 7, 98000, 128000, 50),
('Mặt nạ ngủ', 'Dưỡng ẩm sâu qua đêm', 4, 80000, 110000, 65),
('Mặt nạ giấy cấp ẩm', 'Cấp nước tức thì', 4, 75000, 105000, 60),
('Nước hoa Versace Eros', 'Hương nam mạnh mẽ', 3, 1250000, 1550000, 20),
('Nước hoa Gucci Bloom', 'Hương nữ tính nhẹ nhàng', 3, 1150000, 1450000, 18),
('Kem chống nắng dạng gel', 'Dạng gel thấm nhanh', 2, 170000, 210000, 50),
('Kem chống nắng dạng sữa', 'Dạng sữa dễ thoa', 2, 160000, 200000, 45),
('Dầu gội thảo mộc', 'Ngăn rụng tóc', 3, 140000, 170000, 35),
('Dầu gội nam', 'Giữ tóc khỏe mạnh', 3, 130000, 160000, 30),
('Dầu xả phục hồi tóc', 'Hồi phục tóc hư tổn', 3, 120000, 150000, 40),
('Son môi nude', 'Tông nude tự nhiên', 1, 180000, 220000, 50),
('Son môi đỏ cherry', 'Đỏ cherry tươi sáng', 1, 190000, 230000, 40),
('Kem dưỡng tay', 'Dưỡng ẩm và mềm da tay', 2, 100000, 130000, 50),
('Kem dưỡng chân', 'Dưỡng ẩm và mềm da chân', 2, 90000, 120000, 45),
('Serum trị mụn', 'Giảm mụn và thâm', 2, 230000, 270000, 25),
('Sữa rửa mặt than hoạt tính', 'Loại bỏ bụi bẩn và dầu thừa', 1, 110000, 140000, 50),
('Sữa rửa mặt trà xanh', 'Làm dịu da nhạy cảm', 1, 105000, 135000, 50),
('Toner dịu nhẹ', 'Dịu nhẹ cho da nhạy cảm', 8, 90000, 120000, 60),
('Xịt khoáng se khít lỗ chân lông', 'Se khít lỗ chân lông', 7, 95000, 125000, 50),
('Mặt nạ ngủ dưỡng trắng', 'Dưỡng trắng da qua đêm', 4, 85000, 110000, 65),
('Mặt nạ than hoạt tính', 'Làm sạch sâu', 4, 80000, 105000, 60),
('Nước hoa Lancome La Vie Est Belle', 'Hương nữ tính', 3, 1200000, 1500000, 20),
('Nước hoa Dior Homme', 'Hương nam tính sang trọng', 3, 1300000, 1600000, 20);

-- Bảo hành
INSERT INTO BaoHanh (MaSanPham, DienThoai, Serial, GhiChu) VALUES
(3, '0912345678', 'SN123456', 'Bảo hành 12 tháng'),
(4, '0912345679', 'SN234567', 'Bảo hành 12 tháng'),
(5, '0923456789', 'SN345678', 'Bảo hành 24 tháng'),
(6, '0934567890', 'SN456789', 'Bảo hành 12 tháng');

-- Mở tất cả bảng
-- Danh mục
SELECT 'DanhMuc' AS Bang, MaDanhMuc, TenDanhMuc, MoTa FROM DanhMuc;

-- Kho
SELECT 'Kho' AS Bang, MaKho, TenKho, ViTri FROM Kho;

-- Nhân viên
SELECT 'NhanVien' AS Bang, MaNV, HoVaTen, DienThoai, Email, VaiTro FROM NhanVien;

-- Khách hàng
SELECT 'KhachHang' AS Bang, MaKH, HoVaTen, DienThoai, Email FROM KhachHang;

-- Địa chỉ
SELECT 'DiaChi' AS Bang, MaKH, Duong, Phuong, QuanHuyen, TinhThanh FROM DiaChi;


-- Bảo hành
SELECT 'BaoHanh' AS Bang, MaBH, MaSanPham, DienThoai, Serial, GhiChu FROM BaoHanh;

-- Sản phẩm
SELECT 'SanPham' AS Bang, MaSanPham, TenSanPham, MoTa, MaDanhMuc, Gia, GiaGoc, SoLuong FROM SanPham;

