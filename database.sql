/* ===========================
   MY PHAM SHOP – FRESH INSTALL (MySQL 8.4.3)
   Tác giả: GPT-5 Thinking (for Tuong Tran)
   Chạy một lần duy nhất trên DB rỗng.
   =========================== */

-- 0) Khởi tạo DB sạch
DROP DATABASE IF EXISTS myphamshop;
CREATE DATABASE myphamshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE myphamshop;

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET FOREIGN_KEY_CHECKS = 0;

-- 1) USERS & OAUTH
CREATE TABLE nguoi_dung (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  email_thuong VARCHAR(255) AS (LOWER(email)) STORED,
  ten_dang_nhap VARCHAR(100) NULL UNIQUE,
  mat_khau_hash VARCHAR(255) NULL,
  ten_hien_thi VARCHAR(200) NULL,
  ho VARCHAR(100) NULL,
  ten VARCHAR(100) NULL,
  anh_dai_dien VARCHAR(500) NULL,
  ngay_sinh DATE NULL,
  gioi_tinh ENUM('Male','Female','Other') NULL,
  vai_tro ENUM('Admin','Staff','WareHouse','Customer') NOT NULL DEFAULT 'Customer',
  dang_hoat_dong TINYINT(1) NOT NULL DEFAULT 1,
  thoi_gian_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  thoi_gian_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_nguoidung_email_lc (email_thuong)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE lien_ket_dang_nhap (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nguoi_dung_id BIGINT NOT NULL,
  nha_cung_cap ENUM('google') NOT NULL,
  ma_nguoi_dung_ncc VARCHAR(255) NOT NULL,
  email_tai_ncc VARCHAR(255) NULL,
  anh_tai_ncc VARCHAR(500) NULL,
  thoi_gian_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_provider_user (nha_cung_cap, ma_nguoi_dung_ncc),
  CONSTRAINT fk_lkdn_user FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2) RBAC
CREATE TABLE vai_tro (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ten VARCHAR(50) NOT NULL UNIQUE,
  mo_ta VARCHAR(255) NULL,
  thoi_gian_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  thoi_gian_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE quyen (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ma_quyen VARCHAR(100) NOT NULL UNIQUE,
  mo_ta VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE vai_tro_quyen (
  vai_tro_id BIGINT NOT NULL,
  quyen_id BIGINT NOT NULL,
  PRIMARY KEY (vai_tro_id, quyen_id),
  CONSTRAINT fk_vtq_role FOREIGN KEY (vai_tro_id) REFERENCES vai_tro(id),
  CONSTRAINT fk_vtq_perm FOREIGN KEY (quyen_id) REFERENCES quyen(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE nguoi_dung_vai_tro (
  nguoi_dung_id BIGINT NOT NULL,
  vai_tro_id BIGINT NOT NULL,
  PRIMARY KEY (nguoi_dung_id, vai_tro_id),
  CONSTRAINT fk_ndvt_user FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
  CONSTRAINT fk_ndvt_role FOREIGN KEY (vai_tro_id) REFERENCES vai_tro(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed role/permission
INSERT INTO vai_tro (ten, mo_ta) VALUES
('Admin','Toan quyen he thong'),
('QL_SanPham','Quan ly san pham'),
('QL_KhachHang','Quan ly khach hang'),
('QL_Kho','Quan ly kho'),
('Customer','Khach hang');

INSERT INTO quyen (ma_quyen, mo_ta) VALUES
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

INSERT INTO vai_tro_quyen
SELECT v.id, q.id FROM vai_tro v JOIN quyen q
WHERE v.ten='Customer' AND q.ma_quyen IN
('search.use_public','auth.login_google','profile.update_self','cart.manage_self','order.create','review.create_self','customer.update','customer.purchase_history.view','product.view','promo.view');

INSERT INTO vai_tro_quyen
SELECT v.id, q.id FROM vai_tro v JOIN quyen q
WHERE v.ten='QL_SanPham' AND q.ma_quyen IN
('product.view','product.create','product.update','product.delete_soft','product.price_update','product.media_update','product.tag_manage','promo.manage','review.moderate');

INSERT INTO vai_tro_quyen
SELECT v.id, q.id FROM vai_tro v JOIN quyen q
WHERE v.ten='QL_KhachHang' AND q.ma_quyen IN
('customer.view','customer.update','customer.purchase_history.view','review.moderate','product.view');

INSERT INTO vai_tro_quyen
SELECT v.id, q.id FROM vai_tro v JOIN quyen q
WHERE v.ten='QL_Kho' AND q.ma_quyen IN
('stock.view','stock.adjust','product.delete_soft','product.view');

INSERT INTO vai_tro_quyen
SELECT v.id, q.id FROM vai_tro v JOIN quyen q
WHERE v.ten='Admin' AND q.ma_quyen NOT IN ('product.delete_soft');

-- 3) ĐỊA GIỚI & ĐỊA CHỈ
CREATE TABLE tinh_thanh (
  id INT PRIMARY KEY,
  ten VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE quan_huyen (
  id INT PRIMARY KEY,
  tinh_thanh_id INT NOT NULL,
  ten VARCHAR(100) NOT NULL,
  CONSTRAINT fk_qh_tt FOREIGN KEY (tinh_thanh_id) REFERENCES tinh_thanh(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE phuong_xa (
  id INT PRIMARY KEY,
  quan_huyen_id INT NOT NULL,
  ten VARCHAR(100) NOT NULL,
  CONSTRAINT fk_px_qh FOREIGN KEY (quan_huyen_id) REFERENCES quan_huyen(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE dia_chi (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nguoi_dung_id BIGINT NOT NULL,
  loai ENUM('Shipping','Billing') NOT NULL DEFAULT 'Shipping',
  mac_dinh TINYINT(1) NOT NULL DEFAULT 0,
  ten_nguoi_nhan VARCHAR(200) NOT NULL,
  so_dien_thoai VARCHAR(20) NOT NULL,
  dia_chi_chi_tiet VARCHAR(255) NOT NULL,
  duong VARCHAR(150) NOT NULL,
  phuong_xa_id INT NULL,
  quan_huyen_id INT NULL,
  tinh_thanh_id INT NULL,
  thoi_gian_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  thoi_gian_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
  FOREIGN KEY (phuong_xa_id) REFERENCES phuong_xa(id),
  FOREIGN KEY (quan_huyen_id) REFERENCES quan_huyen(id),
  FOREIGN KEY (tinh_thanh_id) REFERENCES tinh_thanh(id),
  INDEX ix_dc_user (nguoi_dung_id, loai, mac_dinh)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4) DANH MỤC & KHO (kèm trigger tự khởi tạo danh_muc khi danh_muc_id NULL)
CREATE TABLE danh_muc (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ten VARCHAR(100) NOT NULL UNIQUE,
  mo_ta VARCHAR(500) NULL,
  thoi_gian_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  thoi_gian_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE kho_moi (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ma_kho VARCHAR(30) NOT NULL UNIQUE,
  ten_kho VARCHAR(150) NOT NULL,
  danh_muc_id INT NOT NULL,
  vi_tri VARCHAR(255) NULL,
  nguoi_quan_ly_id BIGINT NULL,
  trang_thai ENUM('Hoat_dong','Tam_dung') NOT NULL DEFAULT 'Hoat_dong',
  thoi_gian_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  thoi_gian_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_kho_dm FOREIGN KEY (danh_muc_id) REFERENCES danh_muc(id),
  CONSTRAINT fk_kho_mgr FOREIGN KEY (nguoi_quan_ly_id) REFERENCES nguoi_dung(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Trigger: nếu chưa có danh_muc_id thì tự tạo theo ten_kho
DROP TRIGGER IF EXISTS trg_kho_moi_before_insert;
DELIMITER $$
CREATE TRIGGER trg_kho_moi_before_insert
BEFORE INSERT ON kho_moi
FOR EACH ROW
BEGIN
  DECLARE dm_id INT DEFAULT NULL;
  IF NEW.danh_muc_id IS NULL OR NEW.danh_muc_id = 0 THEN
    SELECT id INTO dm_id FROM danh_muc WHERE ten = NEW.ten_kho LIMIT 1;
    IF dm_id IS NULL THEN
      INSERT INTO danh_muc (ten) VALUES (NEW.ten_kho);
      SET dm_id = LAST_INSERT_ID();
    END IF;
    SET NEW.danh_muc_id = dm_id;
  END IF;
END$$
DELIMITER ;

-- 5) SẢN PHẨM & PHỤ TRỢ
CREATE TABLE sanpham (
  MaSanPham INT PRIMARY KEY AUTO_INCREMENT,
  MaDanhMuc INT NOT NULL,
  TenSanPham VARCHAR(200) NOT NULL,
  MoTa TEXT NULL,
  Gia DECIMAL(18,2) NOT NULL DEFAULT 0,
  GiaGoc DECIMAL(18,2) NULL,
  NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
  NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (MaDanhMuc) REFERENCES danh_muc(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- mở rộng soft-delete + người ẩn
ALTER TABLE sanpham
  ADD COLUMN is_an TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN thoi_gian_an DATETIME NULL,
  ADD COLUMN an_boi BIGINT NULL,
  ADD CONSTRAINT fk_sp_an_boi FOREIGN KEY (an_boi) REFERENCES nguoi_dung(id);

CREATE TABLE thuong_hieu (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ten VARCHAR(150) NOT NULL UNIQUE,
  mo_ta VARCHAR(500) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE sanpham
  ADD COLUMN MaThuongHieu INT NULL,
  ADD CONSTRAINT fk_sp_brand FOREIGN KEY (MaThuongHieu) REFERENCES thuong_hieu(id);

CREATE TABLE tag (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ten VARCHAR(100) NOT NULL,
  loai ENUM('Cong_dung','Loai_da','Chu_de') NOT NULL,
  mo_ta VARCHAR(300) NULL,
  UNIQUE KEY uq_tag (ten, loai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE san_pham_tag (
  san_pham_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (san_pham_id, tag_id),
  FOREIGN KEY (san_pham_id) REFERENCES sanpham(MaSanPham),
  FOREIGN KEY (tag_id) REFERENCES tag(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE thanh_phan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ten VARCHAR(150) NOT NULL UNIQUE,
  mo_ta VARCHAR(500) NULL,
  canh_bao VARCHAR(300) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE san_pham_thanh_phan (
  san_pham_id INT NOT NULL,
  thanh_phan_id INT NOT NULL,
  ti_le DECIMAL(6,2) NULL,
  PRIMARY KEY (san_pham_id, thanh_phan_id),
  FOREIGN KEY (san_pham_id) REFERENCES sanpham(MaSanPham),
  FOREIGN KEY (thanh_phan_id) REFERENCES thanh_phan(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE san_pham_anh (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  san_pham_id INT NOT NULL,
  url VARCHAR(500) NOT NULL,
  thu_tu INT NOT NULL DEFAULT 0,
  la_anh_dai_dien TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (san_pham_id) REFERENCES sanpham(MaSanPham),
  INDEX ix_sp_anh (san_pham_id, la_anh_dai_dien, thu_tu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE san_pham_gia_lich_su (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  san_pham_id INT NOT NULL,
  gia DECIMAL(18,2) NOT NULL,
  hieu_luc_tu DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  hieu_luc_den DATETIME NULL,
  cap_nhat_boi BIGINT NULL,
  FOREIGN KEY (san_pham_id) REFERENCES sanpham(MaSanPham),
  FOREIGN KEY (cap_nhat_boi) REFERENCES nguoi_dung(id),
  INDEX ix_gia_sp (san_pham_id, hieu_luc_tu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Trigger ghi lịch sử giá
DROP TRIGGER IF EXISTS trg_sp_price_history;
DELIMITER $$
CREATE TRIGGER trg_sp_price_history
BEFORE UPDATE ON sanpham
FOR EACH ROW
BEGIN
  IF NEW.Gia <> OLD.Gia THEN
    UPDATE san_pham_gia_lich_su 
      SET hieu_luc_den = NOW()
    WHERE san_pham_id = OLD.MaSanPham AND hieu_luc_den IS NULL;
    INSERT INTO san_pham_gia_lich_su (san_pham_id, gia, hieu_luc_tu)
    VALUES (OLD.MaSanPham, NEW.Gia, NOW());
  END IF;
END$$
DELIMITER ;

-- 6) REVIEW
CREATE TABLE danh_gia (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7) ĐƠN HÀNG & CHI TIẾT
CREATE TABLE don_hang (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nguoi_dung_id BIGINT NOT NULL,
  trang_thai ENUM('PENDING','SHIPPING','DELIVERED','FAILED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  phuong_thuc_tt ENUM('COD') NOT NULL DEFAULT 'COD',
  trang_thai_tt ENUM('UNPAID','PAID') NOT NULL DEFAULT 'UNPAID',
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
  tong_hang DECIMAL(18,2) NOT NULL DEFAULT 0,
  phi_van_chuyen DECIMAL(18,2) NOT NULL DEFAULT 0,
  tong_giam_gia DECIMAL(18,2) NOT NULL DEFAULT 0,
  tong_thanh_toan DECIMAL(18,2) NOT NULL DEFAULT 0,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE don_hang_chi_tiet (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Trigger tổng tiền
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
      tong_thanh_toan = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=NEW.don_hang_id)
                         + phi_van_chuyen - tong_giam_gia
  WHERE id = NEW.don_hang_id;
END$$

CREATE TRIGGER trg_dhct_after_upd
AFTER UPDATE ON don_hang_chi_tiet
FOR EACH ROW
BEGIN
  UPDATE don_hang
  SET tong_hang = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=NEW.don_hang_id),
      tong_thanh_toan = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=NEW.don_hang_id)
                         + phi_van_chuyen - tong_giam_gia
  WHERE id = NEW.don_hang_id;
END$$

CREATE TRIGGER trg_dhct_after_del
AFTER DELETE ON don_hang_chi_tiet
FOR EACH ROW
BEGIN
  UPDATE don_hang
  SET tong_hang = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=OLD.don_hang_id),
      tong_thanh_toan = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=OLD.don_hang_id)
                         + phi_van_chuyen - tong_giam_gia
  WHERE id = OLD.don_hang_id;
END$$
DELIMITER ;

-- 8) TỒN KHO & GIỮ CHỖ
CREATE TABLE ton_kho (
  kho_id INT NOT NULL,
  san_pham_id INT NOT NULL,
  so_luong_ton INT NOT NULL DEFAULT 0 CHECK (so_luong_ton >= 0),
  so_luong_giu_cho INT NOT NULL DEFAULT 0 CHECK (so_luong_giu_cho >= 0),
  PRIMARY KEY (kho_id, san_pham_id),
  FOREIGN KEY (kho_id) REFERENCES kho_moi(id),
  FOREIGN KEY (san_pham_id) REFERENCES sanpham(MaSanPham)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE giu_cho (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  don_hang_ct_id BIGINT NOT NULL,
  kho_id INT NOT NULL,
  so_luong INT NOT NULL CHECK (so_luong > 0),
  thoi_gian_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_gc (don_hang_ct_id, kho_id),
  FOREIGN KEY (don_hang_ct_id) REFERENCES don_hang_chi_tiet(id),
  FOREIGN KEY (kho_id) REFERENCES kho_moi(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Trigger: chặn lệch danh mục kho–sản phẩm
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
  DECLARE dm_kho INT; DECLARE dm_sp INT; DECLARE sp_id INT;
  SELECT san_pham_id INTO sp_id FROM don_hang_chi_tiet WHERE id = NEW.don_hang_ct_id;
  SELECT danh_muc_id INTO dm_kho FROM kho_moi WHERE id = NEW.kho_id;
  SELECT MaDanhMuc INTO dm_sp FROM sanpham WHERE MaSanPham = sp_id;
  IF dm_kho IS NULL OR dm_sp IS NULL OR dm_kho <> dm_sp THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Danh muc cua kho va san pham khong khop (giu_cho)';
  END IF;
END$$
DELIMITER ;

-- Trigger: giữ chỗ ngay khi thêm chi tiết đơn
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
    INSERT IGNORE INTO giu_cho (don_hang_ct_id, kho_id, so_luong)
    VALUES (NEW.id, khoid, NEW.so_luong);
    INSERT INTO ton_kho (kho_id, san_pham_id, so_luong_ton, so_luong_giu_cho)
      VALUES (khoid, NEW.san_pham_id, 0, NEW.so_luong)
      ON DUPLICATE KEY UPDATE so_luong_giu_cho = so_luong_giu_cho + NEW.so_luong;
  END IF;
END$$
DELIMITER ;

-- 9) HỦY ĐƠN & AUDIT
CREATE TABLE yeu_cau_huy_don (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE nhat_ky_hoat_dong (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10) SEARCH
ALTER TABLE sanpham ADD FULLTEXT KEY ftx_sp_ten_mota (TenSanPham, MoTa);

SET FOREIGN_KEY_CHECKS = 1;

-- 11) SEED TỐI THIỂU CHO DEV/TEST
-- User admin tạm (mật khẩu hash giả định, thay BE)
INSERT INTO nguoi_dung (email, ten_hien_thi, vai_tro) VALUES
('admin@example.local', 'Admin Seed', 'Admin');

-- Danh mục mẫu
INSERT INTO danh_muc (ten, mo_ta) VALUES
('Dưỡng da','Sản phẩm dưỡng da');

-- Kho: dùng trigger tự nối danh_muc nếu để NULL (ở đây chỉ minh họa cách dùng trigger)
INSERT INTO kho_moi (ma_kho, ten_kho, danh_muc_id) VALUES
('DM001', 'Dưỡng da', 1); -- đã có danh_muc id=1 ở trên (không dùng trigger)
-- hoặc: INSERT INTO kho_moi (ma_kho, ten_kho, danh_muc_id) VALUES ('DM_AUTO','Dưỡng da', NULL);

-- Thương hiệu + Sản phẩm mẫu
INSERT INTO thuong_hieu (ten) VALUES ('BeaNice');
INSERT INTO sanpham (MaDanhMuc, TenSanPham, MoTa, Gia, GiaGoc, MaThuongHieu)
VALUES (1, 'Kem dưỡng ẩm ban đêm', 'Phù hợp da khô', 159000, 199000, 1);

-- Tag mẫu & gắn tag
INSERT INTO tag (ten, loai) VALUES ('dưỡng da','Cong_dung'), ('da khô','Loai_da');
INSERT INTO san_pham_tag VALUES (1, 1), (1, 2);


