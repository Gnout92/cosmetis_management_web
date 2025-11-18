/* ===========================================================
   MY PHAM SHOP – FULL MIGRATION (MySQL 8.x)
   Tác giả: GPT-5 Thinking (theo yêu cầu của Tường Trần)
   Chú ý:
   - Chạy bằng tài khoản có quyền DDL.
   - Test trên staging trước khi chạy production.
   =========================================================== */

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

-- ==========================================================
-- 0) BACKUP TÊN BẢNG CŨ (nếu muốn an toàn hơn, đổi thành RENAME)
-- (Bỏ qua nếu bạn đã có backup ngoài)
-- ==========================================================
-- CREATE TABLE IF NOT EXISTS _backup_hoadon LIKE hoadon;
-- INSERT INTO _backup_hoadon SELECT * FROM hoadon;
-- CREATE TABLE IF NOT EXISTS _backup_chitiethoadon LIKE chitiethoadon;
-- INSERT INTO _backup_chitiethoadon SELECT * FROM chitiethoadon;
-- CREATE TABLE IF NOT EXISTS _backup_khachhang LIKE khachhang;
-- INSERT INTO _backup_khachhang SELECT * FROM khachhang;
-- CREATE TABLE IF NOT EXISTS _backup_nhanvien LIKE nhanvien;
-- INSERT INTO _backup_nhanvien SELECT * FROM nhanvien;
-- CREATE TABLE IF NOT EXISTS _backup_diachi LIKE diachi;
-- INSERT INTO _backup_diachi SELECT * FROM diachi;
-- CREATE TABLE IF NOT EXISTS _backup_kho LIKE kho;
-- INSERT INTO _backup_kho SELECT * FROM kho;
-- CREATE TABLE IF NOT EXISTS _backup_danhmuc LIKE danhmuc;
-- INSERT INTO _backup_danhmuc SELECT * FROM danhmuc;

-- ==========================================================
-- 1) NGƯỜI DÙNG & OAUTH
-- ==========================================================
CREATE TABLE IF NOT EXISTS nguoi_dung (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  email           VARCHAR(255) NOT NULL,
  email_thuong    VARCHAR(255) AS (LOWER(email)) STORED,
  ten_dang_nhap   VARCHAR(100) NULL UNIQUE,       -- chỉ nhân viên nội bộ
  mat_khau_hash   VARCHAR(255) NULL,              -- chỉ nhân viên nội bộ
  ten_hien_thi    VARCHAR(200) NULL,
  ho              VARCHAR(100) NULL,
  ten             VARCHAR(100) NULL,
  anh_dai_dien    VARCHAR(500) NULL,
  ngay_sinh       DATE NULL,
  gioi_tinh       ENUM('Male','Female','Other') NULL,
  -- Giữ cột vai_tro để tương thích (BE dùng RBAC là chính):
  vai_tro         ENUM('Admin','Staff','WareHouse','Customer') NOT NULL DEFAULT 'Customer',
  dang_hoat_dong  TINYINT(1) NOT NULL DEFAULT 1,
  thoi_gian_tao   DATETIME DEFAULT CURRENT_TIMESTAMP,
  thoi_gian_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_nguoidung_email_lc (email_thuong)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lien_ket_dang_nhap (
  id                BIGINT PRIMARY KEY AUTO_INCREMENT,
  nguoi_dung_id     BIGINT NOT NULL,
  nha_cung_cap      ENUM('google') NOT NULL,
  ma_nguoi_dung_ncc VARCHAR(255) NOT NULL,
  email_tai_ncc     VARCHAR(255) NULL,
  anh_tai_ncc       VARCHAR(500) NULL,
  thoi_gian_tao     DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_provider_user (nha_cung_cap, ma_nguoi_dung_ncc),
  CONSTRAINT fk_lkdn_user FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- 2) RBAC (VAI TRÒ, QUYỀN, GÁN)
-- ==========================================================
CREATE TABLE IF NOT EXISTS vai_tro (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  ten          VARCHAR(50) NOT NULL UNIQUE,   -- 'Admin','QL_SanPham','QL_KhachHang','QL_Kho','Customer'
  mo_ta        VARCHAR(255) NULL,
  thoi_gian_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  thoi_gian_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quyen (
  id        BIGINT PRIMARY KEY AUTO_INCREMENT,
  ma_quyen  VARCHAR(100) NOT NULL UNIQUE,     -- ví dụ: 'product.delete_soft'
  mo_ta     VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vai_tro_quyen (
  vai_tro_id BIGINT NOT NULL,
  quyen_id   BIGINT NOT NULL,
  PRIMARY KEY (vai_tro_id, quyen_id),
  CONSTRAINT fk_vtq_role FOREIGN KEY (vai_tro_id) REFERENCES vai_tro(id),
  CONSTRAINT fk_vtq_perm FOREIGN KEY (quyen_id) REFERENCES quyen(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS nguoi_dung_vai_tro (
  nguoi_dung_id BIGINT NOT NULL,
  vai_tro_id    BIGINT NOT NULL,
  PRIMARY KEY (nguoi_dung_id, vai_tro_id),
  CONSTRAINT fk_ndvt_user FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
  CONSTRAINT fk_ndvt_role FOREIGN KEY (vai_tro_id) REFERENCES vai_tro(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed vai_tro
INSERT IGNORE INTO vai_tro (ten, mo_ta) VALUES
 ('Admin','Toan quyen he thong'),
 ('QL_SanPham','Quan ly san pham'),
 ('QL_KhachHang','Quan ly khach hang'),
 ('QL_Kho','Quan ly kho'),
 ('Customer','Khach hang');

-- Seed quyen
INSERT IGNORE INTO quyen (ma_quyen, mo_ta) VALUES
 ('product.view','Xem san pham'),
 ('product.create','Tao san pham'),
 ('product.update','Cap nhat san pham'),
 ('product.delete_soft','An san pham khoi FE'),
 ('product.price_update','Doi gia san pham'),
 ('product.media_update','Cap nhat hinh anh'),
 ('product.tag_manage','Quan ly tag/thuoc tinh san pham'),
 ('customer.view','Xem KH'),
 ('customer.update','Cap nhat KH'),
 ('customer.purchase_history.view','Xem lich su mua KH'),
 ('cart.manage_self','Quan ly gio hang cua minh'),
 ('order.create','Tao don hang'),
 ('review.create_self','Tao danh gia'),
 ('review.moderate','Duyet/an review'),
 ('auth.login_google','Dang nhap Google'),
 ('profile.update_self','Cap nhat ho so ca nhan'),
 ('search.use_public','Tim kiem cong khai'),
 ('promo.view','Xem khuyen mai'),
 ('promo.manage','Quan ly khuyen mai'),
 ('order.view_all','Xem tat ca don'),
 ('order.set_status','Dat trang thai don'),
 ('stock.view','Xem ton kho'),
 ('stock.adjust','Dieu chinh nhap/xuat ton');

-- Gán quyền theo ma trận (Admin: tất cả TRỪ product.delete_soft theo yêu cầu)
-- Map vai_tro -> quyen
-- Helper inserts:
INSERT IGNORE INTO vai_tro_quyen
SELECT v.id, q.id FROM vai_tro v JOIN quyen q
WHERE v.ten='Customer' AND q.ma_quyen IN
('search.use_public','auth.login_google','profile.update_self','cart.manage_self','order.create','review.create_self','customer.update','customer.purchase_history.view','product.view','promo.view');

INSERT IGNORE INTO vai_tro_quyen
SELECT v.id, q.id FROM vai_tro v JOIN quyen q
WHERE v.ten='QL_SanPham' AND q.ma_quyen IN
('product.view','product.create','product.update','product.delete_soft','product.price_update','product.media_update','product.tag_manage','promo.manage','review.moderate');

INSERT IGNORE INTO vai_tro_quyen
SELECT v.id, q.id FROM vai_tro v JOIN quyen q
WHERE v.ten='QL_KhachHang' AND q.ma_quyen IN
('customer.view','customer.update','customer.purchase_history.view','review.moderate','product.view');

INSERT IGNORE INTO vai_tro_quyen
SELECT v.id, q.id FROM vai_tro v JOIN quyen q
WHERE v.ten='QL_Kho' AND q.ma_quyen IN
('stock.view','stock.adjust','product.delete_soft','product.view');

-- Admin: tất cả ngoại trừ product.delete_soft
INSERT IGNORE INTO vai_tro_quyen
SELECT v.id, q.id FROM vai_tro v JOIN quyen q
WHERE v.ten='Admin' AND q.ma_quyen NOT IN ('product.delete_soft');

-- ==========================================================
-- 3) DANH MỤC ĐỊA GIỚI & ĐỊA CHỈ (ID có thể để NULL trong migration)
-- ==========================================================
CREATE TABLE IF NOT EXISTS tinh_thanh (
  id   INT PRIMARY KEY,
  ten  VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quan_huyen (
  id             INT PRIMARY KEY,
  tinh_thanh_id  INT NOT NULL,
  ten            VARCHAR(100) NOT NULL,
  CONSTRAINT fk_qh_tt FOREIGN KEY (tinh_thanh_id) REFERENCES tinh_thanh(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS phuong_xa (
  id            INT PRIMARY KEY,
  quan_huyen_id INT NOT NULL,
  ten           VARCHAR(100) NOT NULL,
  CONSTRAINT fk_px_qh FOREIGN KEY (quan_huyen_id) REFERENCES quan_huyen(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS dia_chi (
  id                 BIGINT PRIMARY KEY AUTO_INCREMENT,
  nguoi_dung_id      BIGINT NOT NULL,
  loai               ENUM('Shipping','Billing') NOT NULL DEFAULT 'Shipping',
  mac_dinh           TINYINT(1) NOT NULL DEFAULT 0,
  ten_nguoi_nhan     VARCHAR(200) NOT NULL,
  so_dien_thoai      VARCHAR(20) NOT NULL,
  dia_chi_chi_tiet   VARCHAR(255) NOT NULL,
  duong              VARCHAR(150) NOT NULL,
  phuong_xa_id       INT NULL,
  quan_huyen_id      INT NULL,
  tinh_thanh_id      INT NULL,
  thoi_gian_tao      DATETIME DEFAULT CURRENT_TIMESTAMP,
  thoi_gian_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_dc_user FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
  CONSTRAINT fk_dc_px FOREIGN KEY (phuong_xa_id) REFERENCES phuong_xa(id),
  CONSTRAINT fk_dc_qh FOREIGN KEY (quan_huyen_id) REFERENCES quan_huyen(id),
  CONSTRAINT fk_dc_tt FOREIGN KEY (tinh_thanh_id) REFERENCES tinh_thanh(id),
  INDEX ix_dc_user (nguoi_dung_id, loai, mac_dinh)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- 4) DANH MỤC & KHO (1–1) + TRIGGER tự tạo danh_muc theo tên kho
-- ==========================================================
-- Tạo bảng danh_muc mới (độc lập bảng cũ 'danhmuc')
CREATE TABLE IF NOT EXISTS danh_muc (
  id               INT PRIMARY KEY AUTO_INCREMENT,
  ten              VARCHAR(100) NOT NULL UNIQUE,
  mo_ta            VARCHAR(500) NULL,
  thoi_gian_tao    DATETIME DEFAULT CURRENT_TIMESTAMP,
  thoi_gian_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Khởi tạo từ dữ liệu cũ (nếu có)
INSERT IGNORE INTO danh_muc (id, ten, mo_ta, thoi_gian_tao, thoi_gian_cap_nhat)
SELECT MaDanhMuc, TenDanhMuc, MoTa, NgayTao, NgayCapNhat FROM danhmuc;

-- Bảng kho (1–1 danh_muc)
CREATE TABLE IF NOT EXISTS kho_moi (
  id               INT PRIMARY KEY AUTO_INCREMENT,
  ma_kho           VARCHAR(30) NOT NULL UNIQUE,
  ten_kho          VARCHAR(150) NOT NULL,
  danh_muc_id      INT NOT NULL UNIQUE,
  vi_tri           VARCHAR(255) NULL,
  nguoi_quan_ly_id BIGINT NULL,
  trang_thai       ENUM('Hoat_dong','Tam_dung') NOT NULL DEFAULT 'Hoat_dong',
  thoi_gian_tao    DATETIME DEFAULT CURRENT_TIMESTAMP,
  thoi_gian_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_kho_dm FOREIGN KEY (danh_muc_id) REFERENCES danh_muc(id),
  CONSTRAINT fk_kho_mgr FOREIGN KEY (nguoi_quan_ly_id) REFERENCES nguoi_dung(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed kho cho mỗi danh_muc chưa có kho, ma_kho = 'DM' + id
INSERT IGNORE INTO kho_moi (ma_kho, ten_kho, danh_muc_id)
SELECT CONCAT('DM', id), CONCAT('Kho ', ten), id FROM danh_muc
WHERE id NOT IN (SELECT danh_muc_id FROM kho_moi);

-- Trigger tự tạo danh_muc nếu chèn kho mới mà thiếu danh_muc_id
DROP TRIGGER IF EXISTS trg_kho_moi_before_insert;
DELIMITER $$
CREATE TRIGGER trg_kho_moi_before_insert
BEFORE INSERT ON kho_moi
FOR EACH ROW
BEGIN
  IF NEW.danh_muc_id IS NULL OR NEW.danh_muc_id = 0 THEN
    DECLARE dm_id INT;
    SELECT id INTO dm_id FROM danh_muc WHERE ten = NEW.ten_kho LIMIT 1;
    IF dm_id IS NULL THEN
      INSERT INTO danh_muc (ten) VALUES (NEW.ten_kho);
      SET dm_id = LAST_INSERT_ID();
    END IF;
    SET NEW.danh_muc_id = dm_id;
  END IF;
  -- đảm bảo unique(danh_muc_id) tự check bởi key
END$$
DELIMITER ;

-- ==========================================================
-- 5) SẢN PHẨM – MỞ RỘNG & SOFT-DELETE & LỊCH SỬ GIÁ
-- ==========================================================
-- Mở rộng bảng sanpham cũ
ALTER TABLE sanpham
  ADD COLUMN is_an TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN thoi_gian_an DATETIME NULL,
  ADD COLUMN an_boi BIGINT NULL,
  ADD CONSTRAINT fk_sp_an_boi FOREIGN KEY (an_boi) REFERENCES nguoi_dung(id);

-- Bảng thương hiệu / tag / liên kết / ảnh / thành phần
CREATE TABLE IF NOT EXISTS thuong_hieu (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ten VARCHAR(150) NOT NULL UNIQUE,
  mo_ta VARCHAR(500) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE sanpham
  ADD COLUMN MaThuongHieu INT NULL,
  ADD CONSTRAINT fk_sp_brand FOREIGN KEY (MaThuongHieu) REFERENCES thuong_hieu(id);

CREATE TABLE IF NOT EXISTS tag (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ten VARCHAR(100) NOT NULL,
  loai ENUM('Cong_dung','Loai_da','Chu_de') NOT NULL,
  mo_ta VARCHAR(300) NULL,
  UNIQUE KEY uq_tag (ten, loai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS san_pham_tag (
  san_pham_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (san_pham_id, tag_id),
  FOREIGN KEY (san_pham_id) REFERENCES sanpham(MaSanPham),
  FOREIGN KEY (tag_id) REFERENCES tag(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS thanh_phan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ten VARCHAR(150) NOT NULL UNIQUE,
  mo_ta VARCHAR(500) NULL,
  canh_bao VARCHAR(300) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS san_pham_thanh_phan (
  san_pham_id INT NOT NULL,
  thanh_phan_id INT NOT NULL,
  ti_le DECIMAL(6,2) NULL,
  PRIMARY KEY (san_pham_id, thanh_phan_id),
  FOREIGN KEY (san_pham_id) REFERENCES sanpham(MaSanPham),
  FOREIGN KEY (thanh_phan_id) REFERENCES thanh_phan(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS san_pham_anh (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  san_pham_id INT NOT NULL,
  url VARCHAR(500) NOT NULL,
  thu_tu INT NOT NULL DEFAULT 0,
  la_anh_dai_dien TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (san_pham_id) REFERENCES sanpham(MaSanPham),
  INDEX ix_sp_anh (san_pham_id, la_anh_dai_dien, thu_tu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lịch sử giá (ghi mỗi lần sanpham.Gia đổi)
CREATE TABLE IF NOT EXISTS san_pham_gia_lich_su (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  san_pham_id INT NOT NULL,
  gia DECIMAL(18,2) NOT NULL,
  hieu_luc_tu DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  hieu_luc_den DATETIME NULL,
  cap_nhat_boi BIGINT NULL,
  FOREIGN KEY (san_pham_id) REFERENCES sanpham(MaSanPham),
  FOREIGN KEY (cap_nhat_boi) REFERENCES nguoi_dung(id),
  INDEX ix_gia_sp (san_pham_id, hieu_luc_tu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TRIGGER IF EXISTS trg_sp_price_history;
DELIMITER $$
CREATE TRIGGER trg_sp_price_history
BEFORE UPDATE ON sanpham
FOR EACH ROW
BEGIN
  IF NEW.Gia <> OLD.Gia THEN
    -- đóng record hiện hành nếu có
    UPDATE san_pham_gia_lich_su 
      SET hieu_luc_den = NOW()
    WHERE san_pham_id = OLD.MaSanPham AND hieu_luc_den IS NULL;
    -- mở record mới
    INSERT INTO san_pham_gia_lich_su (san_pham_id, gia, hieu_luc_tu)
    VALUES (OLD.MaSanPham, NEW.Gia, NOW());
  END IF;
END$$
DELIMITER ;

-- ==========================================================
-- 6) ĐÁNH GIÁ CÓ DUYỆT
-- ==========================================================
CREATE TABLE IF NOT EXISTS danh_gia (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  san_pham_id INT NOT NULL,
  nguoi_dung_id BIGINT NOT NULL,
  sao TINYINT NOT NULL CHECK (sao BETWEEN 1 AND 5),
  noi_dung TEXT NULL,
  trang_thai ENUM('CHO_DUYET','HIEN','AN') NOT NULL DEFAULT 'CHO_DUYET',
  thoi_gian_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  thoi_gian_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (san_pham_id) REFERENCES sanpham(MaSanPham),
  FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
  INDEX ix_review_sp (san_pham_id, trang_thai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- 7) ĐƠN HÀNG & CHI TIẾT (thay hoadon / chitiethoadon)
-- ==========================================================
CREATE TABLE IF NOT EXISTS don_hang (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nguoi_dung_id BIGINT NOT NULL,       -- KH
  trang_thai ENUM('PENDING','SHIPPING','DELIVERED','FAILED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  phuong_thuc_tt ENUM('COD') NOT NULL DEFAULT 'COD',
  trang_thai_tt ENUM('UNPAID','PAID') NOT NULL DEFAULT 'UNPAID',

  -- Snapshot địa chỉ giao (ID + tên + chi tiết)
  ship_phuong_xa_id INT NULL,
  ship_quan_huyen_id INT NULL,
  ship_tinh_thanh_id INT NULL,
  ship_ten_phuong_xa VARCHAR(100) NULL,
  ship_ten_quan_huyen VARCHAR(100) NULL,
  ship_ten_tinh_thanh VARCHAR(100) NULL,
  ship_ten_nguoi_nhan VARCHAR(200) NOT NULL,
  ship_so_dien_thoai VARCHAR(20) NOT NULL,
  ship_dia_chi_chi_tiet VARCHAR(255) NOT NULL,
  ship_duong VARCHAR(150) NOT NULL,

  -- Tiền
  tong_hang DECIMAL(18,2) NOT NULL DEFAULT 0,
  phi_van_chuyen DECIMAL(18,2) NOT NULL DEFAULT 0,
  tong_giam_gia DECIMAL(18,2) NOT NULL DEFAULT 0,
  tong_thanh_toan DECIMAL(18,2) NOT NULL DEFAULT 0,

  -- Dấu vết NV (chỉ NV thao tác)
  xac_nhan_boi BIGINT NULL,
  giao_hang_boi BIGINT NULL,
  ly_do_huy VARCHAR(300) NULL,
  ly_do_that_bai VARCHAR(300) NULL,

  thoi_gian_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  thoi_gian_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
  FOREIGN KEY (ship_phuong_xa_id) REFERENCES phuong_xa(id),
  FOREIGN KEY (ship_quan_huyen_id) REFERENCES quan_huyen(id),
  FOREIGN KEY (ship_tinh_thanh_id) REFERENCES tinh_thanh(id),
  FOREIGN KEY (xac_nhan_boi) REFERENCES nguoi_dung(id),
  FOREIGN KEY (giao_hang_boi) REFERENCES nguoi_dung(id),

  INDEX ix_don_user_status (nguoi_dung_id, trang_thai),
  INDEX ix_don_created (thoi_gian_tao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS don_hang_chi_tiet (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  don_hang_id BIGINT NOT NULL,
  san_pham_id INT NOT NULL,
  gia_niem_yet DECIMAL(18,2) NOT NULL,
  don_gia DECIMAL(18,2) NOT NULL,
  pt_giam DECIMAL(5,2) NULL,
  tien_giam DECIMAL(18,2) NULL DEFAULT 0,
  so_luong INT NOT NULL CHECK (so_luong > 0),
  thanh_tien DECIMAL(18,2)
    GENERATED ALWAYS AS (GREATEST(so_luong * don_gia - COALESCE(tien_giam,0), 0)) STORED,

  FOREIGN KEY (don_hang_id) REFERENCES don_hang(id),
  FOREIGN KEY (san_pham_id) REFERENCES sanpham(MaSanPham),
  INDEX ix_dhct_don (don_hang_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trigger tính tổng đơn
DROP TRIGGER IF EXISTS trg_dhct_after_ins;
DROP TRIGGER IF EXISTS trg_dhct_after_upd;
DROP TRIGGER IF EXISTS trg_dhct_after_del;
DELIMITER $$
CREATE TRIGGER trg_dhct_after_ins
AFTER INSERT ON don_hang_chi_tiet
FOR EACH ROW
BEGIN
  UPDATE don_hang
  SET tong_hang = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=NEW.don_hang_id),
      tong_thanh_toan = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=NEW.don_hang_id) + phi_van_chuyen - tong_giam_gia
  WHERE id = NEW.don_hang_id;
END$$

CREATE TRIGGER trg_dhct_after_upd
AFTER UPDATE ON don_hang_chi_tiet
FOR EACH ROW
BEGIN
  UPDATE don_hang
  SET tong_hang = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=NEW.don_hang_id),
      tong_thanh_toan = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=NEW.don_hang_id) + phi_van_chuyen - tong_giam_gia
  WHERE id = NEW.don_hang_id;
END$$

CREATE TRIGGER trg_dhct_after_del
AFTER DELETE ON don_hang_chi_tiet
FOR EACH ROW
BEGIN
  UPDATE don_hang
  SET tong_hang = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=OLD.don_hang_id),
      tong_thanh_toan = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=OLD.don_hang_id) + phi_van_chuyen - tong_giam_gia
  WHERE id = OLD.don_hang_id;
END$$
DELIMITER ;

-- ==========================================================
-- 8) TỒN KHO & GIỮ CHỖ (kho↔danh_muc 1–1, chặn lệch danh mục)
-- ==========================================================
CREATE TABLE IF NOT EXISTS ton_kho (
  kho_id INT NOT NULL,
  san_pham_id INT NOT NULL,
  so_luong_ton INT NOT NULL DEFAULT 0 CHECK (so_luong_ton >= 0),
  so_luong_giu_cho INT NOT NULL DEFAULT 0 CHECK (so_luong_giu_cho >= 0),
  PRIMARY KEY (kho_id, san_pham_id),
  FOREIGN KEY (kho_id) REFERENCES kho_moi(id),
  FOREIGN KEY (san_pham_id) REFERENCES sanpham(MaSanPham)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS giu_cho (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  don_hang_ct_id BIGINT NOT NULL,
  kho_id INT NOT NULL,
  so_luong INT NOT NULL CHECK (so_luong > 0),
  thoi_gian_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_gc (don_hang_ct_id, kho_id),
  FOREIGN KEY (don_hang_ct_id) REFERENCES don_hang_chi_tiet(id),
  FOREIGN KEY (kho_id) REFERENCES kho_moi(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chặn sản phẩm khác danh mục của kho
DROP TRIGGER IF EXISTS trg_tonkho_check_dm;
DROP TRIGGER IF EXISTS trg_giucho_check_dm;
DELIMITER $$
CREATE TRIGGER trg_tonkho_check_dm
BEFORE INSERT ON ton_kho
FOR EACH ROW
BEGIN
  DECLARE dm_kho INT; DECLARE dm_sp INT;
  SELECT danh_muc_id INTO dm_kho FROM kho_moi WHERE id = NEW.kho_id;
  SELECT MaDanhMuc INTO dm_sp FROM sanpham WHERE MaSanPham = NEW.san_pham_id;
  IF dm_kho IS NULL OR dm_sp IS NULL OR dm_kho <> dm_sp THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Danh muc cua kho va san pham khong khop';
  END IF;
END$$

CREATE TRIGGER trg_giucho_check_dm
BEFORE INSERT ON giu_cho
FOR EACH ROW
BEGIN
  DECLARE dm_kho INT; DECLARE dm_sp INT;
  DECLARE sp_id INT;
  SELECT san_pham_id INTO sp_id FROM don_hang_chi_tiet WHERE id = NEW.don_hang_ct_id;
  SELECT danh_muc_id INTO dm_kho FROM kho_moi WHERE id = NEW.kho_id;
  SELECT MaDanhMuc INTO dm_sp FROM sanpham WHERE MaSanPham = sp_id;
  IF dm_kho IS NULL OR dm_sp IS NULL OR dm_kho <> dm_sp THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Danh muc cua kho va san pham khong khop (giu_cho)';
  END IF;
END$$
DELIMITER ;

-- Reservation khi tạo chi tiết đơn (PENDING)
DROP TRIGGER IF EXISTS trg_dhct_after_reserve;
DELIMITER $$
CREATE TRIGGER trg_dhct_after_reserve
AFTER INSERT ON don_hang_chi_tiet
FOR EACH ROW
BEGIN
  DECLARE dm INT; DECLARE khoid INT;
  SELECT MaDanhMuc INTO dm FROM sanpham WHERE MaSanPham = NEW.san_pham_id;
  SELECT id INTO khoid FROM kho_moi WHERE danh_muc_id = dm;
  IF khoid IS NOT NULL THEN
    INSERT IGNORE INTO giu_cho (don_hang_ct_id, kho_id, so_luong) VALUES (NEW.id, khoid, NEW.so_luong);
    INSERT INTO ton_kho (kho_id, san_pham_id, so_luong_ton, so_luong_giu_cho)
      VALUES (khoid, NEW.san_pham_id, 0, NEW.so_luong)
      ON DUPLICATE KEY UPDATE so_luong_giu_cho = so_luong_giu_cho + NEW.so_luong;
  END IF;
END$$
DELIMITER ;

-- Chuyển trạng thái đơn để trừ/hoàn tồn + COD=PAID khi DELIVERED
DROP TRIGGER IF EXISTS trg_donhang_after_update_status;
DELIMITER $$
CREATE TRIGGER trg_donhang_after_update_status
AFTER UPDATE ON don_hang
FOR EACH ROW
BEGIN
  -- Nếu chuyển sang SHIPPING: trừ tồn thực, đưa giữ chỗ về 0
  IF NEW.trang_thai = 'SHIPPING' AND OLD.trang_thai = 'PENDING' THEN
    -- mỗi chi tiết đơn
    INSERT INTO ton_kho (kho_id, san_pham_id, so_luong_ton, so_luong_giu_cho)
    SELECT km.id, sp.MaSanPham, 0, 0
    FROM don_hang_chi_tiet d
    JOIN sanpham sp ON sp.MaSanPham = d.san_pham_id
    JOIN kho_moi km ON km.danh_muc_id = sp.MaDanhMuc
    WHERE d.don_hang_id = NEW.id
    ON DUPLICATE KEY UPDATE so_luong_ton = so_luong_ton; -- no-op seed

    -- trừ tồn & xóa giữ chỗ
    UPDATE ton_kho tk
    JOIN (
      SELECT km.id AS kho_id, d.san_pham_id, SUM(d.so_luong) AS sl
      FROM don_hang_chi_tiet d
      JOIN sanpham sp ON sp.MaSanPham = d.san_pham_id
      JOIN kho_moi km ON km.danh_muc_id = sp.MaDanhMuc
      WHERE d.don_hang_id = NEW.id
      GROUP BY km.id, d.san_pham_id
    ) x ON x.kho_id = tk.kho_id AND x.san_pham_id = tk.san_pham_id
    SET tk.so_luong_ton = GREATEST(tk.so_luong_ton - x.sl, 0),
        tk.so_luong_giu_cho = GREATEST(tk.so_luong_giu_cho - x.sl, 0);

    -- gỡ giu_cho bản ghi liên quan (tùy bạn có muốn xóa hay giữ log; ở đây xóa)
    DELETE gc FROM giu_cho gc
    JOIN don_hang_chi_tiet d ON d.id = gc.don_hang_ct_id
    WHERE d.don_hang_id = NEW.id;
  END IF;

  -- Nếu CANCELLED khi PENDING: trả giữ chỗ
  IF NEW.trang_thai = 'CANCELLED' AND OLD.trang_thai = 'PENDING' THEN
    UPDATE ton_kho tk
    JOIN (
      SELECT km.id AS kho_id, d.san_pham_id, SUM(d.so_luong) AS sl
      FROM don_hang_chi_tiet d
      JOIN sanpham sp ON sp.MaSanPham = d.san_pham_id
      JOIN kho_moi km ON km.danh_muc_id = sp.MaDanhMuc
      WHERE d.don_hang_id = NEW.id
      GROUP BY km.id, d.san_pham_id
    ) x ON x.kho_id = tk.kho_id AND x.san_pham_id = tk.san_pham_id
    SET tk.so_luong_giu_cho = GREATEST(tk.so_luong_giu_cho - x.sl, 0);

    DELETE gc FROM giu_cho gc
    JOIN don_hang_chi_tiet d ON d.id = gc.don_hang_ct_id
    WHERE d.don_hang_id = NEW.id;
  END IF;

  -- Nếu FAILED khi SHIPPING: nhập trả tồn
  IF NEW.trang_thai = 'FAILED' AND OLD.trang_thai = 'SHIPPING' THEN
    UPDATE ton_kho tk
    JOIN (
      SELECT km.id AS kho_id, d.san_pham_id, SUM(d.so_luong) AS sl
      FROM don_hang_chi_tiet d
      JOIN sanpham sp ON sp.MaSanPham = d.san_pham_id
      JOIN kho_moi km ON km.danh_muc_id = sp.MaDanhMuc
      WHERE d.don_hang_id = NEW.id
      GROUP BY km.id, d.san_pham_id
    ) x ON x.kho_id = tk.kho_id AND x.san_pham_id = tk.san_pham_id
    SET tk.so_luong_ton = tk.so_luong_ton + x.sl;
  END IF;

  -- Nếu DELIVERED: set COD = PAID
  IF NEW.trang_thai = 'DELIVERED' AND OLD.trang_thai IN ('SHIPPING') THEN
    UPDATE don_hang SET trang_thai_tt = 'PAID' WHERE id = NEW.id;
  END IF;
END$$
DELIMITER ;

-- ==========================================================
-- 9) YÊU CẦU HỦY ĐƠN (KH gửi khi PENDING)
-- ==========================================================
CREATE TABLE IF NOT EXISTS yeu_cau_huy_don (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  don_hang_id BIGINT NOT NULL,
  nguoi_dung_id BIGINT NOT NULL,
  ly_do_huy_cua_khach VARCHAR(500) NOT NULL,
  trang_thai_xu_ly ENUM('CHO_DUYET','DA_CHAP_NHAN','DA_TU_CHOI') NOT NULL DEFAULT 'CHO_DUYET',
  xu_ly_boi BIGINT NULL,
  thoi_gian_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  thoi_gian_xu_ly DATETIME NULL,
  FOREIGN KEY (don_hang_id) REFERENCES don_hang(id),
  FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
  FOREIGN KEY (xu_ly_boi) REFERENCES nguoi_dung(id),
  INDEX ix_huy_don (don_hang_id, trang_thai_xu_ly)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- 10) NHẬT KÝ HOẠT ĐỘNG (Audit)
-- ==========================================================
CREATE TABLE IF NOT EXISTS nhat_ky_hoat_dong (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  bang VARCHAR(100) NOT NULL,
  ban_ghi_id BIGINT NOT NULL,
  hanh_dong ENUM('CREATE','UPDATE','DELETE_SOFT','RESTORE','PRICE_UPDATE','MEDIA_UPDATE','TAG_UPDATE','REVIEW_MODERATE') NOT NULL,
  du_lieu_cu JSON NULL,
  du_lieu_moi JSON NULL,
  thuc_hien_boi BIGINT NULL,
  thoi_gian_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (thuc_hien_boi) REFERENCES nguoi_dung(id),
  INDEX ix_nk (bang, ban_ghi_id, hanh_dong, thoi_gian_tao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- (Bạn có thể thêm trigger ghi audit cho sanpham.is_an, ảnh/tag… ở BE hoặc DB tùy chiến lược)

-- ==========================================================
-- 11) MIGRATE TỐI THIỂU DỮ LIỆU CŨ → MỚI
-- ==========================================================
/* USERS:
   - KH (khachhang) => nguoi_dung (role Customer), password_hash NULL (OAuth)
   - NV (nhanvien)  => nguoi_dung (role map: 'Admin'->Admin, 'NhanVien'->Staff), mat_khau_hash = SHA2(plaintext) tạm
*/
INSERT IGNORE INTO nguoi_dung (id, email, ten_hien_thi, anh_dai_dien, vai_tro, thoi_gian_tao, thoi_gian_cap_nhat)
SELECT MaKH, COALESCE(Email, CONCAT('kh', MaKH, '@example.local')), HoVaTen, NULL, 'Customer', NgayTao, NgayCapNhat
FROM khachhang;

INSERT IGNORE INTO nguoi_dung (id, email, ten_hien_thi, ten_dang_nhap, mat_khau_hash, vai_tro, thoi_gian_tao, thoi_gian_cap_nhat)
SELECT 100000 + MaNV,
       COALESCE(Email, CONCAT('nv', MaNV, '@example.local')),
       HoVaTen,
       Email,                                  -- tạm dùng email làm username
       SHA2(COALESCE(MatKhau,''), 256),        -- hash tạm, khuyến nghị reset
       CASE WHEN VaiTro='Admin' THEN 'Admin' ELSE 'Staff' END,
       NgayTao, NgayCapNhat
FROM nhanvien;

/* ADDRESS: map diachi -> dia_chi (ID địa giới để NULL, chỉ đi text)
   - Nếu muốn chuẩn hoá ID, bạn nạp danh mục tinh_thanh/quan_huyen/phuong_xa rồi viết script map phù hợp.
*/
INSERT IGNORE INTO dia_chi (nguoi_dung_id, loai, mac_dinh, ten_nguoi_nhan, so_dien_thoai, dia_chi_chi_tiet, duong,
                             phuong_xa_id, quan_huyen_id, tinh_thanh_id, thoi_gian_tao, thoi_gian_cap_nhat)
SELECT MaKH, 'Shipping', 1, k.HoVaTen, k.DienThoai,
       d.Duong, d.Duong, NULL, NULL, NULL, NOW(), NOW()
FROM diachi d
JOIN khachhang k ON k.MaKH = d.MaKH;

/* ORDERS: hoadon -> don_hang (snapshot địa chỉ để trống tên ID nếu chưa có)
   - TrangThai cũ: 'ChuaXacNhan' => PENDING
*/
INSERT IGNORE INTO don_hang (id, nguoi_dung_id, trang_thai, phuong_thuc_tt, trang_thai_tt,
                             ship_ten_nguoi_nhan, ship_so_dien_thoai, ship_dia_chi_chi_tiet, ship_duong,
                             ship_ten_phuong_xa, ship_ten_quan_huyen, ship_ten_tinh_thanh,
                             tong_hang, phi_van_chuyen, tong_giam_gia, tong_thanh_toan,
                             thoi_gian_tao, thoi_gian_cap_nhat)
SELECT h.MaHD, h.MaKH,
       'PENDING', 'COD', 'UNPAID',
       COALESCE(k.HoVaTen,'Khach hang'),
       k.DienThoai,
       COALESCE((SELECT Duong FROM diachi d WHERE d.MaKH = h.MaKH LIMIT 1),''),
       COALESCE((SELECT Duong FROM diachi d WHERE d.MaKH = h.MaKH LIMIT 1),''),
       COALESCE((SELECT Phuong FROM diachi d WHERE d.MaKH = h.MaKH LIMIT 1),''),
       COALESCE((SELECT QuanHuyen FROM diachi d WHERE d.MaKH = h.MaKH LIMIT 1),''),
       COALESCE((SELECT TinhThanh FROM diachi d WHERE d.MaKH = h.MaKH LIMIT 1),''),
       h.TongTien, 0, 0, h.TongTien,
       h.NgayLap, h.NgayLap
FROM hoadon h
LEFT JOIN khachhang k ON k.MaKH = h.MaKH;

-- order_items: chitiethoadon -> don_hang_chi_tiet
INSERT IGNORE INTO don_hang_chi_tiet (id, don_hang_id, san_pham_id, gia_niem_yet, don_gia, pt_giam, tien_giam, so_luong)
SELECT c.MaCTHD, c.MaHD, c.MaSanPham,
       COALESCE(sp.GiaGoc, c.DonGia) AS gia_niem_yet,
       c.DonGia, NULL, 0, c.SoLuong
FROM chitiethoadon c
JOIN sanpham sp ON sp.MaSanPham = c.MaSanPham;

-- Sau khi nạp item, kích hoạt trigger tổng tiền đã cộng (đã set khi insert)

-- ==========================================================
-- 12) INDEX TÌM KIẾM (mở công khai) & RÀNG BUỘC FE ẨN
-- ==========================================================
-- Fulltext (nếu cần) cho tìm kiếm
ALTER TABLE sanpham ADD FULLTEXT KEY ftx_sp_ten_mota (TenSanPham, MoTa);

-- FE phải lọc WHERE is_an=0 (RBAC ở BE bảo vệ mutate)

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

/* KẾT THÚC MIGRATION
   Ghi chú hậu kiểm:
   1) Nạp danh mục địa giới (tinh_thanh/quan_huyen/phuong_xa) và cập nhật lại dia_chi.*_id nếu muốn map chính xác.
   2) Phân quyền BE:
      - Chỉ role có 'product.delete_soft' (QL_SanPham, QL_Kho) được UPDATE sanpham.is_an = 1.
      - Admin KHÔNG có 'product.delete_soft' theo xác nhận của bạn.
   3) Luồng kho:
      - PENDING: trigger giữ chỗ.
      - SHIPPING: trừ tồn thực, xóa giữ chỗ.
      - DELIVERED: set trang_thai_tt = PAID (COD).
      - CANCELLED (từ PENDING): trả giữ chỗ.
      - FAILED (từ SHIPPING): nhập trả tồn.
*/
