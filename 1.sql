-- --------------------------------------------------------
-- Máy chủ:                      127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Phiên bản:           12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for myphamshop
CREATE DATABASE IF NOT EXISTS `myphamshop` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `myphamshop`;

-- Dumping structure for table myphamshop.danh_gia
CREATE TABLE IF NOT EXISTS `danh_gia` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `san_pham_id` int NOT NULL,
  `nguoi_dung_id` bigint NOT NULL,
  `sao` tinyint NOT NULL,
  `noi_dung` text,
  `trang_thai` enum('CHO_DUYET','HIEN','AN') NOT NULL DEFAULT 'CHO_DUYET',
  `thoi_gian_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `thoi_gian_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `nguoi_dung_id` (`nguoi_dung_id`),
  KEY `ix_review_sp` (`san_pham_id`,`trang_thai`),
  CONSTRAINT `danh_gia_ibfk_1` FOREIGN KEY (`san_pham_id`) REFERENCES `sanpham` (`MaSanPham`),
  CONSTRAINT `danh_gia_ibfk_2` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`),
  CONSTRAINT `danh_gia_chk_1` CHECK ((`sao` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.danh_gia: ~0 rows (approximately)

-- Dumping structure for table myphamshop.danh_muc
CREATE TABLE IF NOT EXISTS `danh_muc` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(100) NOT NULL,
  `mo_ta` varchar(500) DEFAULT NULL,
  `thoi_gian_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `thoi_gian_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ten` (`ten`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.danh_muc: ~6 rows (approximately)
INSERT INTO `danh_muc` (`id`, `ten`, `mo_ta`, `thoi_gian_tao`, `thoi_gian_cap_nhat`) VALUES
	(1, 'Dưỡng da tay', 'Sản phẩm dưỡng da', '2025-11-14 23:04:45', '2025-11-19 00:34:43'),
	(4, 'Dầu gội', NULL, '2025-11-19 00:33:33', '2025-11-19 00:33:33'),
	(9, 'Chăm sóc da', NULL, '2025-11-20 20:16:15', '2025-11-20 20:16:15'),
	(10, 'Sáp/Gel Tóc', NULL, '2025-11-20 20:16:15', '2025-11-20 20:16:15'),
	(11, 'Nước Hoa', NULL, '2025-11-20 20:16:15', '2025-11-20 20:16:15'),
	(12, 'Dưỡng da', 'Sản phẩm dưỡng da', '2025-11-20 23:19:22', '2025-11-20 23:19:22');

-- Dumping structure for table myphamshop.dia_chi
CREATE TABLE IF NOT EXISTS `dia_chi` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nguoi_dung_id` bigint NOT NULL,
  `loai` enum('Shipping','Billing') NOT NULL DEFAULT 'Shipping',
  `mac_dinh` tinyint(1) NOT NULL DEFAULT '0',
  `ten_nguoi_nhan` varchar(200) NOT NULL,
  `so_dien_thoai` varchar(20) NOT NULL,
  `dia_chi_chi_tiet` varchar(255) NOT NULL,
  `duong` varchar(150) NOT NULL,
  `phuong_xa_id` int DEFAULT NULL,
  `quan_huyen_id` int DEFAULT NULL,
  `tinh_thanh_id` int DEFAULT NULL,
  `thoi_gian_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `thoi_gian_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `phuong_xa_id` (`phuong_xa_id`),
  KEY `quan_huyen_id` (`quan_huyen_id`),
  KEY `tinh_thanh_id` (`tinh_thanh_id`),
  KEY `ix_dc_user` (`nguoi_dung_id`,`loai`,`mac_dinh`),
  CONSTRAINT `dia_chi_ibfk_1` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`),
  CONSTRAINT `dia_chi_ibfk_2` FOREIGN KEY (`phuong_xa_id`) REFERENCES `phuong_xa` (`id`),
  CONSTRAINT `dia_chi_ibfk_3` FOREIGN KEY (`quan_huyen_id`) REFERENCES `quan_huyen` (`id`),
  CONSTRAINT `dia_chi_ibfk_4` FOREIGN KEY (`tinh_thanh_id`) REFERENCES `tinh_thanh` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.dia_chi: ~0 rows (approximately)

-- Dumping structure for table myphamshop.don_hang
CREATE TABLE IF NOT EXISTS `don_hang` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nguoi_dung_id` bigint NOT NULL,
  `trang_thai` enum('PENDING','SHIPPING','DELIVERED','FAILED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `phuong_thuc_tt` enum('COD') NOT NULL DEFAULT 'COD',
  `trang_thai_tt` enum('UNPAID','PAID') NOT NULL DEFAULT 'UNPAID',
  `ship_phuong_xa_id` int DEFAULT NULL,
  `ship_quan_huyen_id` int DEFAULT NULL,
  `ship_tinh_thanh_id` int DEFAULT NULL,
  `ship_ten_phuong_xa` varchar(100) DEFAULT NULL,
  `ship_ten_quan_huyen` varchar(100) DEFAULT NULL,
  `ship_ten_tinh_thanh` varchar(100) DEFAULT NULL,
  `ship_ten_nguoi_nhan` varchar(200) NOT NULL,
  `ship_so_dien_thoai` varchar(20) NOT NULL,
  `ship_dia_chi_chi_tiet` varchar(255) NOT NULL,
  `ship_duong` varchar(150) NOT NULL,
  `tong_hang` decimal(18,2) NOT NULL DEFAULT '0.00',
  `phi_van_chuyen` decimal(18,2) NOT NULL DEFAULT '0.00',
  `tong_giam_gia` decimal(18,2) NOT NULL DEFAULT '0.00',
  `tong_thanh_toan` decimal(18,2) NOT NULL DEFAULT '0.00',
  `xac_nhan_boi` bigint DEFAULT NULL,
  `giao_hang_boi` bigint DEFAULT NULL,
  `ly_do_huy` varchar(300) DEFAULT NULL,
  `ly_do_that_bai` varchar(300) DEFAULT NULL,
  `thoi_gian_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `thoi_gian_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ship_phuong_xa_id` (`ship_phuong_xa_id`),
  KEY `ship_quan_huyen_id` (`ship_quan_huyen_id`),
  KEY `ship_tinh_thanh_id` (`ship_tinh_thanh_id`),
  KEY `xac_nhan_boi` (`xac_nhan_boi`),
  KEY `giao_hang_boi` (`giao_hang_boi`),
  KEY `ix_don_user_status` (`nguoi_dung_id`,`trang_thai`),
  KEY `ix_don_created` (`thoi_gian_tao`),
  CONSTRAINT `don_hang_ibfk_1` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`),
  CONSTRAINT `don_hang_ibfk_2` FOREIGN KEY (`ship_phuong_xa_id`) REFERENCES `phuong_xa` (`id`),
  CONSTRAINT `don_hang_ibfk_3` FOREIGN KEY (`ship_quan_huyen_id`) REFERENCES `quan_huyen` (`id`),
  CONSTRAINT `don_hang_ibfk_4` FOREIGN KEY (`ship_tinh_thanh_id`) REFERENCES `tinh_thanh` (`id`),
  CONSTRAINT `don_hang_ibfk_5` FOREIGN KEY (`xac_nhan_boi`) REFERENCES `nguoi_dung` (`id`),
  CONSTRAINT `don_hang_ibfk_6` FOREIGN KEY (`giao_hang_boi`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.don_hang: ~0 rows (approximately)

-- Dumping structure for table myphamshop.don_hang_chi_tiet
CREATE TABLE IF NOT EXISTS `don_hang_chi_tiet` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `don_hang_id` bigint NOT NULL,
  `san_pham_id` int NOT NULL,
  `gia_niem_yet` decimal(18,2) NOT NULL,
  `don_gia` decimal(18,2) NOT NULL,
  `pt_giam` decimal(5,2) DEFAULT NULL,
  `tien_giam` decimal(18,2) DEFAULT '0.00',
  `so_luong` int NOT NULL,
  `thanh_tien` decimal(18,2) GENERATED ALWAYS AS (greatest(((`so_luong` * `don_gia`) - coalesce(`tien_giam`,0)),0)) STORED,
  PRIMARY KEY (`id`),
  KEY `san_pham_id` (`san_pham_id`),
  KEY `ix_dhct_don` (`don_hang_id`),
  CONSTRAINT `don_hang_chi_tiet_ibfk_1` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`),
  CONSTRAINT `don_hang_chi_tiet_ibfk_2` FOREIGN KEY (`san_pham_id`) REFERENCES `sanpham` (`MaSanPham`),
  CONSTRAINT `don_hang_chi_tiet_chk_1` CHECK ((`so_luong` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.don_hang_chi_tiet: ~0 rows (approximately)

-- Dumping structure for table myphamshop.giu_cho
CREATE TABLE IF NOT EXISTS `giu_cho` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `don_hang_ct_id` bigint NOT NULL,
  `kho_id` int NOT NULL,
  `so_luong` int NOT NULL,
  `thoi_gian_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_gc` (`don_hang_ct_id`,`kho_id`),
  KEY `kho_id` (`kho_id`),
  CONSTRAINT `giu_cho_ibfk_1` FOREIGN KEY (`don_hang_ct_id`) REFERENCES `don_hang_chi_tiet` (`id`),
  CONSTRAINT `giu_cho_ibfk_2` FOREIGN KEY (`kho_id`) REFERENCES `kho_moi` (`id`),
  CONSTRAINT `giu_cho_chk_1` CHECK ((`so_luong` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.giu_cho: ~0 rows (approximately)

-- Dumping structure for table myphamshop.kho_moi
CREATE TABLE IF NOT EXISTS `kho_moi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_kho` varchar(30) NOT NULL,
  `ten_kho` varchar(150) NOT NULL,
  `danh_muc_id` int NOT NULL,
  `vi_tri` varchar(255) DEFAULT NULL,
  `nguoi_quan_ly_id` bigint DEFAULT NULL,
  `trang_thai` enum('Hoat_dong','Tam_dung') NOT NULL DEFAULT 'Hoat_dong',
  `thoi_gian_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `thoi_gian_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_kho` (`ma_kho`),
  KEY `fk_kho_dm` (`danh_muc_id`),
  KEY `fk_kho_mgr` (`nguoi_quan_ly_id`),
  CONSTRAINT `fk_kho_dm` FOREIGN KEY (`danh_muc_id`) REFERENCES `danh_muc` (`id`),
  CONSTRAINT `fk_kho_mgr` FOREIGN KEY (`nguoi_quan_ly_id`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.kho_moi: ~5 rows (approximately)
INSERT INTO `kho_moi` (`id`, `ma_kho`, `ten_kho`, `danh_muc_id`, `vi_tri`, `nguoi_quan_ly_id`, `trang_thai`, `thoi_gian_tao`, `thoi_gian_cap_nhat`) VALUES
	(1, 'DM001', 'Dưỡng da', 1, NULL, NULL, 'Hoat_dong', '2025-11-14 23:04:45', '2025-11-14 23:04:45'),
	(4, 'DG001', 'Dầu Gội', 4, NULL, NULL, 'Hoat_dong', '2025-11-20 23:19:22', '2025-11-20 23:19:22'),
	(5, 'CS001', 'Chăm sóc da', 9, NULL, NULL, 'Hoat_dong', '2025-11-20 23:19:22', '2025-11-20 23:19:22'),
	(6, 'SG001', 'Sáp/Gel Tóc', 10, NULL, NULL, 'Hoat_dong', '2025-11-20 23:19:22', '2025-11-20 23:19:22'),
	(7, 'NH001', 'Nước Hoa', 11, NULL, NULL, 'Hoat_dong', '2025-11-20 23:19:22', '2025-11-20 23:19:22');

-- Dumping structure for table myphamshop.lien_ket_dang_nhap
CREATE TABLE IF NOT EXISTS `lien_ket_dang_nhap` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nguoi_dung_id` bigint NOT NULL,
  `nha_cung_cap` enum('google') NOT NULL,
  `ma_nguoi_dung_ncc` varchar(255) NOT NULL,
  `email_tai_ncc` varchar(255) DEFAULT NULL,
  `anh_tai_ncc` varchar(500) DEFAULT NULL,
  `thoi_gian_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_provider_user` (`nha_cung_cap`,`ma_nguoi_dung_ncc`),
  KEY `fk_lkdn_user` (`nguoi_dung_id`),
  CONSTRAINT `fk_lkdn_user` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.lien_ket_dang_nhap: ~2 rows (approximately)
INSERT INTO `lien_ket_dang_nhap` (`id`, `nguoi_dung_id`, `nha_cung_cap`, `ma_nguoi_dung_ncc`, `email_tai_ncc`, `anh_tai_ncc`, `thoi_gian_tao`) VALUES
	(1, 2, 'google', '109631991942153363886', 'nguyentuongtp95@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocIGF3Pjy-40_KcpcRDB3B4ZhthMiOv8r1RzXFLnbU3-myGxHmBi=s96-c', '2025-11-18 23:46:26'),
	(2, 4, 'google', '109808473087786939840', 'tuongtrantp@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocI4GIV9zhAbmrCKTzjoypadzZpRZOEYEpxu4pKQALGAckGMBk4=s96-c', '2025-11-19 00:26:18');

-- Dumping structure for table myphamshop.nguoi_dung
CREATE TABLE IF NOT EXISTS `nguoi_dung` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `email_thuong` varchar(255) GENERATED ALWAYS AS (lower(`email`)) STORED,
  `ten_dang_nhap` varchar(100) DEFAULT NULL,
  `mat_khau_hash` varchar(255) DEFAULT NULL,
  `ten_hien_thi` varchar(200) DEFAULT NULL,
  `ho` varchar(100) DEFAULT NULL,
  `ten` varchar(100) DEFAULT NULL,
  `anh_dai_dien` varchar(500) DEFAULT NULL,
  `ngay_sinh` date DEFAULT NULL,
  `gioi_tinh` enum('Male','Female','Other') DEFAULT NULL,
  `vai_tro` enum('Admin','Staff','WareHouse','Customer') NOT NULL DEFAULT 'Customer',
  `dang_hoat_dong` tinyint(1) NOT NULL DEFAULT '1',
  `thoi_gian_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `thoi_gian_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ten_dang_nhap` (`ten_dang_nhap`),
  UNIQUE KEY `uq_nguoidung_email_lc` (`email_thuong`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.nguoi_dung: ~5 rows (approximately)
INSERT INTO `nguoi_dung` (`id`, `email`, `ten_dang_nhap`, `mat_khau_hash`, `ten_hien_thi`, `ho`, `ten`, `anh_dai_dien`, `ngay_sinh`, `gioi_tinh`, `vai_tro`, `dang_hoat_dong`, `thoi_gian_tao`, `thoi_gian_cap_nhat`) VALUES
	(1, 'admin@example.local', NULL, NULL, 'test đổi tên', NULL, NULL, NULL, NULL, NULL, 'Admin', 1, '2025-11-14 23:04:45', '2025-11-20 23:32:48'),
	(2, 'nguyentuongtp95@gmail.com', NULL, NULL, 'Tường Nguyễn', 'Nguyễn', 'Tường', 'https://lh3.googleusercontent.com/a/ACg8ocIGF3Pjy-40_KcpcRDB3B4ZhthMiOv8r1RzXFLnbU3-myGxHmBi=s96-c', NULL, NULL, 'Customer', 1, '2025-11-18 23:46:26', '2025-11-18 23:46:26'),
	(3, 'admin@test', 'admintest', '$2b$10$Q9hYwYQ7eKfZkG7h7ZkY0uZkY0uZkY0uZkY0uZkY0uZkY0u', 'admin test', 'test', 'test', NULL, '2020-11-19', 'Male', 'Admin', 1, '2025-11-19 00:03:40', '2025-11-20 23:56:10'),
	(4, 'tuongtrantp@gmail.com', NULL, NULL, 'Tường Trần', 'Trần', 'Tường', 'https://lh3.googleusercontent.com/a/ACg8ocI4GIV9zhAbmrCKTzjoypadzZpRZOEYEpxu4pKQALGAckGMBk4=s96-c', NULL, NULL, 'Customer', 1, '2025-11-19 00:26:18', '2025-11-19 00:26:18'),
	(7, 'admin2@example.com', 'admin02', '$2a$12$Ge3yUdesUOKnyrjnO5d.ruOYZ15yHUrNtF/HoiXdHqMfzcZl1N9Jm', 'Quản trị viên', 'Nguyen', 'Admin', NULL, NULL, NULL, 'Admin', 1, '2025-11-21 00:09:08', '2025-11-21 01:02:33');

-- Dumping structure for table myphamshop.nguoi_dung_vai_tro
CREATE TABLE IF NOT EXISTS `nguoi_dung_vai_tro` (
  `nguoi_dung_id` bigint NOT NULL,
  `vai_tro_id` bigint NOT NULL,
  PRIMARY KEY (`nguoi_dung_id`,`vai_tro_id`),
  KEY `fk_ndvt_role` (`vai_tro_id`),
  CONSTRAINT `fk_ndvt_role` FOREIGN KEY (`vai_tro_id`) REFERENCES `vai_tro` (`id`),
  CONSTRAINT `fk_ndvt_user` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.nguoi_dung_vai_tro: ~0 rows (approximately)

-- Dumping structure for table myphamshop.nhat_ky_hoat_dong
CREATE TABLE IF NOT EXISTS `nhat_ky_hoat_dong` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bang` varchar(100) NOT NULL,
  `ban_ghi_id` bigint NOT NULL,
  `hanh_dong` enum('CREATE','UPDATE','DELETE_SOFT','RESTORE','PRICE_UPDATE','MEDIA_UPDATE','TAG_UPDATE','REVIEW_MODERATE') NOT NULL,
  `du_lieu_cu` json DEFAULT NULL,
  `du_lieu_moi` json DEFAULT NULL,
  `thuc_hien_boi` bigint DEFAULT NULL,
  `thoi_gian_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `thuc_hien_boi` (`thuc_hien_boi`),
  KEY `ix_nk` (`bang`,`ban_ghi_id`,`hanh_dong`,`thoi_gian_tao`),
  CONSTRAINT `nhat_ky_hoat_dong_ibfk_1` FOREIGN KEY (`thuc_hien_boi`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.nhat_ky_hoat_dong: ~0 rows (approximately)
INSERT INTO `nhat_ky_hoat_dong` (`id`, `bang`, `ban_ghi_id`, `hanh_dong`, `du_lieu_cu`, `du_lieu_moi`, `thuc_hien_boi`, `thoi_gian_tao`) VALUES
	(1, 'nguoi_dung', 7, 'CREATE', NULL, '{"roles": ["Customer"], "action": "LOGIN", "method": "password"}', 7, '2025-11-21 00:09:40'),
	(2, 'nguoi_dung', 7, 'CREATE', NULL, '{"roles": ["Customer"], "action": "LOGIN", "method": "password"}', 7, '2025-11-21 00:18:58'),
	(3, 'nguoi_dung', 7, 'CREATE', NULL, '{"roles": ["Customer"], "action": "LOGIN", "method": "password"}', 7, '2025-11-21 00:27:42'),
	(4, 'nguoi_dung', 7, 'CREATE', NULL, '{"roles": ["Customer"], "action": "LOGIN", "method": "password"}', 7, '2025-11-21 00:28:25'),
	(5, 'nguoi_dung', 7, 'CREATE', NULL, '{"roles": ["Customer"], "action": "LOGIN", "method": "password"}', 7, '2025-11-21 00:28:48'),
	(6, 'nguoi_dung', 7, 'CREATE', NULL, '{"roles": ["Customer"], "action": "LOGIN", "method": "password"}', 7, '2025-11-21 00:31:26'),
	(7, 'nguoi_dung', 7, 'CREATE', NULL, '{"roles": ["Customer"], "action": "LOGIN", "method": "password"}', 7, '2025-11-21 00:32:12'),
	(8, 'nguoi_dung', 7, 'CREATE', NULL, '{"roles": ["Customer"], "action": "LOGIN", "method": "password"}', 7, '2025-11-21 00:39:23'),
	(9, 'nguoi_dung', 7, 'CREATE', NULL, '{"roles": ["Customer"], "action": "LOGIN", "method": "password"}', 7, '2025-11-21 00:49:55'),
	(10, 'nguoi_dung', 7, 'CREATE', NULL, '{"roles": ["Customer"], "action": "LOGIN", "method": "password"}', 7, '2025-11-21 00:56:58'),
	(11, 'nguoi_dung', 7, 'CREATE', NULL, '{"roles": ["Customer"], "action": "LOGIN", "method": "password"}', 7, '2025-11-21 00:57:59');

-- Dumping structure for table myphamshop.phuong_xa
CREATE TABLE IF NOT EXISTS `phuong_xa` (
  `id` int NOT NULL,
  `quan_huyen_id` int NOT NULL,
  `ten` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_px_qh` (`quan_huyen_id`),
  CONSTRAINT `fk_px_qh` FOREIGN KEY (`quan_huyen_id`) REFERENCES `quan_huyen` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.phuong_xa: ~68 rows (approximately)
INSERT INTO `phuong_xa` (`id`, `quan_huyen_id`, `ten`) VALUES
	(4, 1, 'Phường Phúc Xá'),
	(7, 1, 'Phường Trúc Bạch'),
	(865, 30, 'Phường Sông Bằng'),
	(868, 30, 'Phường Tam Trung'),
	(2119, 40, 'Phường Phan Thiết'),
	(2122, 40, 'Phường Minh Xuân'),
	(3700, 47, 'Phường Thanh Trường'),
	(3703, 47, 'Phường Him Lam'),
	(4201, 57, 'Phường Đoàn Kết'),
	(4204, 57, 'Phường Tân Phong'),
	(5020, 65, 'Phường Chiềng Sinh'),
	(5023, 65, 'Phường Chiềng An'),
	(5353, 77, 'Phường Kim Tân'),
	(5356, 77, 'Phường Bắc Lệnh'),
	(6649, 86, 'Phường Quang Trung'),
	(6652, 86, 'Phường Tân Lập'),
	(7201, 95, 'Phường Vĩnh Trại'),
	(7204, 95, 'Phường Đông Kinh'),
	(7903, 106, 'Phường Hà Tu'),
	(7906, 106, 'Phường Hà Phong'),
	(8830, 119, 'Phường Đại Phúc'),
	(8833, 119, 'Phường Võ Cường'),
	(9460, 127, 'Phường Dữu Lâu'),
	(9463, 127, 'Phường Vân Cơ'),
	(10168, 140, 'Phường Quán Toan'),
	(10171, 140, 'Phường Hùng Vương'),
	(10900, 155, 'Phường Hiến Nam'),
	(10903, 155, 'Phường Lam Sơn'),
	(13012, 165, 'Phường Đông Thành'),
	(13015, 165, 'Phường Tân Thành'),
	(13501, 173, 'Phường Hàm Rồng'),
	(13504, 173, 'Phường Đông Thọ'),
	(14983, 200, 'Phường Đông Vĩnh'),
	(14986, 200, 'Phường Hà Huy Tập'),
	(16120, 221, 'Phường Đại Nài'),
	(16123, 221, 'Phường Hà Huy Tập'),
	(17233, 234, 'Phường 1'),
	(17236, 234, 'Phường 2'),
	(18013, 244, 'Phường Thuận Hoà'),
	(18016, 244, 'Phường Tây Lộc'),
	(18970, 253, 'Phường Hải Châu I'),
	(18973, 253, 'Phường Hải Châu II'),
	(20188, 261, 'Phường Lê Hồng Phong'),
	(20191, 261, 'Phường Trần Phú'),
	(21571, 274, 'Phường Hoa Lư'),
	(21574, 274, 'Phường Chi Lăng'),
	(23329, 289, 'Phường Vĩnh Hải'),
	(23332, 289, 'Phường Vĩnh Phước'),
	(24736, 298, 'Phường Tân Lập'),
	(24739, 298, 'Phường Tân Thành'),
	(25774, 313, 'Phường 1'),
	(25777, 313, 'Phường 2'),
	(26785, 325, 'Phường Bến Nghé'),
	(26788, 325, 'Phường Bến Thành'),
	(27976, 336, 'Phường Bến Nghé'),
	(27979, 336, 'Phường Bến Thành'),
	(28723, 358, 'Phường 1'),
	(28726, 358, 'Phường 2'),
	(29707, 367, 'Phường 1'),
	(29710, 367, 'Phường 2'),
	(30676, 378, 'Phường 1'),
	(30679, 378, 'Phường 2'),
	(31549, 386, 'Phường Mỹ Xuyên'),
	(31552, 386, 'Phường Mỹ Bình'),
	(33730, 397, 'Phường Cái Khế'),
	(33733, 397, 'Phường An Hòa'),
	(35002, 406, 'Phường 1'),
	(35005, 406, 'Phường 2');

-- Dumping structure for table myphamshop.quan_huyen
CREATE TABLE IF NOT EXISTS `quan_huyen` (
  `id` int NOT NULL,
  `tinh_thanh_id` int NOT NULL,
  `ten` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_qh_tt` (`tinh_thanh_id`),
  CONSTRAINT `fk_qh_tt` FOREIGN KEY (`tinh_thanh_id`) REFERENCES `tinh_thanh` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.quan_huyen: ~170 rows (approximately)
INSERT INTO `quan_huyen` (`id`, `tinh_thanh_id`, `ten`) VALUES
	(1, 1, 'Quận Ba Đình'),
	(2, 1, 'Quận Hoàn Kiếm'),
	(3, 1, 'Quận Tây Hồ'),
	(4, 1, 'Quận Long Biên'),
	(5, 1, 'Quận Cầu Giấy'),
	(30, 4, 'Thành phố Cao Bằng'),
	(31, 4, 'Huyện Bảo Lâm'),
	(32, 4, 'Huyện Bảo Lạc'),
	(33, 4, 'Huyện Hà Quảng'),
	(34, 4, 'Huyện Trùng Khánh'),
	(40, 8, 'Thành phố Tuyên Quang'),
	(41, 8, 'Huyện Lâm Bình'),
	(42, 8, 'Huyện Na Hang'),
	(43, 8, 'Huyện Chiêm Hóa'),
	(44, 8, 'Huyện Hàm Yên'),
	(47, 11, 'Thành phố Điện Biên Phủ'),
	(48, 11, 'Thị xã Mường Lay'),
	(49, 11, 'Huyện Mường Nhé'),
	(50, 11, 'Huyện Mường Chà'),
	(51, 11, 'Huyện Tủa Chùa'),
	(57, 12, 'Thành phố Lai Châu'),
	(58, 12, 'Huyện Tam Đường'),
	(59, 12, 'Huyện Phong Thổ'),
	(60, 12, 'Huyện Sìn Hồ'),
	(61, 12, 'Huyện Mường Tè'),
	(65, 14, 'Thành phố Sơn La'),
	(66, 14, 'Huyện Quỳnh Nhai'),
	(67, 14, 'Huyện Mường La'),
	(68, 14, 'Huyện Thuận Châu'),
	(69, 14, 'Huyện Phù Yên'),
	(77, 15, 'Thành phố Lào Cai'),
	(78, 15, 'Huyện Bát Xát'),
	(79, 15, 'Huyện Si Ma Cai'),
	(80, 15, 'Huyện Mường Khương'),
	(81, 15, 'Huyện Bắc Hà'),
	(86, 19, 'Thành phố Thái Nguyên'),
	(87, 19, 'Thành phố Sông Công'),
	(88, 19, 'Thành phố Phổ Yên'),
	(89, 19, 'Huyện Định Hóa'),
	(90, 19, 'Huyện Phú Lương'),
	(95, 20, 'Thành phố Lạng Sơn'),
	(96, 20, 'Huyện Tràng Định'),
	(97, 20, 'Huyện Bình Gia'),
	(98, 20, 'Huyện Văn Lãng'),
	(99, 20, 'Huyện Cao Lộc'),
	(106, 22, 'Thành phố Hạ Long'),
	(107, 22, 'Thành phố Cẩm Phả'),
	(108, 22, 'Thành phố Uông Bí'),
	(109, 22, 'Thành phố Móng Cái'),
	(110, 22, 'Thị xã Quảng Yên'),
	(119, 24, 'Thành phố Bắc Ninh'),
	(120, 24, 'Thị xã Từ Sơn'),
	(121, 24, 'Huyện Yên Phong'),
	(122, 24, 'Huyện Tiên Du'),
	(123, 24, 'Huyện Quế Võ'),
	(127, 25, 'Thành phố Việt Trì'),
	(128, 25, 'Thị xã Phú Thọ'),
	(129, 25, 'Huyện Đoan Hùng'),
	(130, 25, 'Huyện Hạ Hòa'),
	(131, 25, 'Huyện Thanh Ba'),
	(140, 31, 'Quận Hồng Bàng'),
	(141, 31, 'Quận Ngô Quyền'),
	(142, 31, 'Quận Lê Chân'),
	(143, 31, 'Quận Hải An'),
	(144, 31, 'Quận Kiến An'),
	(155, 33, 'Thành phố Hưng Yên'),
	(156, 33, 'Huyện Văn Lâm'),
	(157, 33, 'Huyện Văn Giang'),
	(158, 33, 'Huyện Yên Mỹ'),
	(159, 33, 'Huyện Khoái Châu'),
	(165, 37, 'Thành phố Ninh Bình'),
	(166, 37, 'Thành phố Tam Điệp'),
	(167, 37, 'Huyện Nho Quan'),
	(168, 37, 'Huyện Gia Viễn'),
	(169, 37, 'Huyện Hoa Lư'),
	(173, 38, 'Thành phố Thanh Hóa'),
	(174, 38, 'Thành phố Sầm Sơn'),
	(175, 38, 'Thị xã Bỉm Sơn'),
	(176, 38, 'Huyện Mường Lát'),
	(177, 38, 'Huyện Quan Hóa'),
	(200, 40, 'Thành phố Vinh'),
	(201, 40, 'Thị xã Cửa Lò'),
	(202, 40, 'Thị xã Thái Hòa'),
	(203, 40, 'Thị xã Hoàng Mai'),
	(204, 40, 'Huyện Quế Phong'),
	(221, 42, 'Thành phố Hà Tĩnh'),
	(222, 42, 'Thị xã Hồng Lĩnh'),
	(223, 42, 'Huyện Hương Sơn'),
	(224, 42, 'Huyện Đức Thọ'),
	(225, 42, 'Huyện Nghi Xuân'),
	(234, 44, 'Thành phố Đông Hà'),
	(235, 44, 'Thị xã Quảng Trị'),
	(236, 44, 'Huyện Vĩnh Linh'),
	(237, 44, 'Huyện Gio Linh'),
	(238, 44, 'Huyện Cam Lộ'),
	(244, 46, 'Thành phố Huế'),
	(245, 46, 'Huyện Phong Điền'),
	(246, 46, 'Huyện Quảng Điền'),
	(247, 46, 'Huyện Phú Vang'),
	(248, 46, 'Thị xã Hương Thủy'),
	(253, 48, 'Quận Hải Châu'),
	(254, 48, 'Quận Thanh Khê'),
	(255, 48, 'Quận Sơn Trà'),
	(256, 48, 'Quận Ngũ Hành Sơn'),
	(257, 48, 'Quận Liên Chiểu'),
	(261, 51, 'Thành phố Quảng Ngãi'),
	(262, 51, 'Huyện Bình Sơn'),
	(263, 51, 'Huyện Trà Bồng'),
	(264, 51, 'Huyện Sơn Tịnh'),
	(265, 51, 'Huyện Tư Nghĩa'),
	(274, 52, 'Thành phố Pleiku'),
	(275, 52, 'Thị xã An Khê'),
	(276, 52, 'Thị xã Ayun Pa'),
	(277, 52, 'Huyện Chư Păh'),
	(278, 52, 'Huyện Mang Yang'),
	(289, 56, 'Thành phố Nha Trang'),
	(290, 56, 'Thành phố Cam Ranh'),
	(291, 56, 'Thị xã Ninh Hòa'),
	(292, 56, 'Huyện Vạn Ninh'),
	(293, 56, 'Huyện Diên Khánh'),
	(298, 66, 'Thành phố Buôn Ma Thuột'),
	(299, 66, 'Thị xã Buôn Hồ'),
	(300, 66, 'Huyện Ea H’leo'),
	(301, 66, 'Huyện Krông Búk'),
	(302, 66, 'Huyện Krông Năng'),
	(313, 68, 'Thành phố Đà Lạt'),
	(314, 68, 'Thành phố Bảo Lộc'),
	(315, 68, 'Huyện Đức Trọng'),
	(316, 68, 'Huyện Di Linh'),
	(317, 68, 'Huyện Đơn Dương'),
	(325, 75, 'Thành phố Biên Hòa'),
	(326, 75, 'Thành phố Long Khánh'),
	(327, 75, 'Huyện Vĩnh Cửu'),
	(328, 75, 'Huyện Tân Phú'),
	(329, 75, 'Huyện Định Quán'),
	(336, 79, 'Quận 1'),
	(337, 79, 'Quận 3'),
	(338, 79, 'Quận 4'),
	(339, 79, 'Quận 5'),
	(340, 79, 'Quận 6'),
	(358, 80, 'Thành phố Tây Ninh'),
	(359, 80, 'Huyện Tân Biên'),
	(360, 80, 'Huyện Tân Châu'),
	(361, 80, 'Huyện Dương Minh Châu'),
	(362, 80, 'Huyện Châu Thành'),
	(367, 82, 'Thành phố Cao Lãnh'),
	(368, 82, 'Thành phố Sa Đéc'),
	(369, 82, 'Huyện Tân Hồng'),
	(370, 82, 'Huyện Hồng Ngự'),
	(371, 82, 'Huyện Tam Nông'),
	(378, 86, 'Thành phố Vĩnh Long'),
	(379, 86, 'Huyện Long Hồ'),
	(380, 86, 'Huyện Mang Thít'),
	(381, 86, 'Huyện Vũng Liêm'),
	(382, 86, 'Huyện Tam Bình'),
	(386, 91, 'Thành phố Long Xuyên'),
	(387, 91, 'Thành phố Châu Đốc'),
	(388, 91, 'Huyện An Phú'),
	(389, 91, 'Thị xã Tân Châu'),
	(390, 91, 'Huyện Phú Tân'),
	(397, 92, 'Quận Ninh Kiều'),
	(398, 92, 'Quận Bình Thủy'),
	(399, 92, 'Quận Cái Răng'),
	(400, 92, 'Quận Ô Môn'),
	(401, 92, 'Quận Thốt Nốt'),
	(406, 96, 'Thành phố Cà Mau'),
	(407, 96, 'Huyện U Minh'),
	(408, 96, 'Huyện Thới Bình'),
	(409, 96, 'Huyện Trần Văn Thời'),
	(410, 96, 'Huyện Cái Nước');

-- Dumping structure for table myphamshop.quyen
CREATE TABLE IF NOT EXISTS `quyen` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ma_quyen` varchar(100) NOT NULL,
  `mo_ta` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_quyen` (`ma_quyen`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.quyen: ~23 rows (approximately)
INSERT INTO `quyen` (`id`, `ma_quyen`, `mo_ta`) VALUES
	(1, 'product.view', 'Xem san pham'),
	(2, 'product.create', 'Tao san pham'),
	(3, 'product.update', 'Cap nhat san pham'),
	(4, 'product.delete_soft', 'An san pham khoi FE'),
	(5, 'product.price_update', 'Doi gia san pham'),
	(6, 'product.media_update', 'Cap nhat hinh anh'),
	(7, 'product.tag_manage', 'Quan ly tag/thuoc tinh san pham'),
	(8, 'customer.view', 'Xem KH'),
	(9, 'customer.update', 'Cap nhat KH'),
	(10, 'customer.purchase_history.view', 'Xem lich su mua KH'),
	(11, 'cart.manage_self', 'Quan ly gio hang cua minh'),
	(12, 'order.create', 'Tao don hang'),
	(13, 'review.create_self', 'Tao danh gia'),
	(14, 'review.moderate', 'Duyet/an review'),
	(15, 'auth.login_google', 'Dang nhap Google'),
	(16, 'profile.update_self', 'Cap nhat ho so ca nhan'),
	(17, 'search.use_public', 'Tim kiem cong khai'),
	(18, 'promo.view', 'Xem khuyen mai'),
	(19, 'promo.manage', 'Quan ly khuyen mai'),
	(20, 'order.view_all', 'Xem tat ca don'),
	(21, 'order.set_status', 'Dat trang thai don'),
	(22, 'stock.view', 'Xem ton kho'),
	(23, 'stock.adjust', 'Dieu chinh nhap/xuat ton');

-- Dumping structure for table myphamshop.sanpham
CREATE TABLE IF NOT EXISTS `sanpham` (
  `MaSanPham` int NOT NULL AUTO_INCREMENT,
  `MaDanhMuc` int NOT NULL,
  `TenSanPham` varchar(200) NOT NULL,
  `MoTa` text,
  `Gia` decimal(18,2) NOT NULL DEFAULT '0.00',
  `GiaGoc` decimal(18,2) DEFAULT NULL,
  `NgayTao` datetime DEFAULT CURRENT_TIMESTAMP,
  `NgayCapNhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_an` tinyint(1) NOT NULL DEFAULT '0',
  `thoi_gian_an` datetime DEFAULT NULL,
  `an_boi` bigint DEFAULT NULL,
  `MaThuongHieu` int DEFAULT NULL,
  PRIMARY KEY (`MaSanPham`),
  KEY `MaDanhMuc` (`MaDanhMuc`),
  KEY `fk_sp_an_boi` (`an_boi`),
  KEY `fk_sp_brand` (`MaThuongHieu`),
  FULLTEXT KEY `ftx_sp_ten_mota` (`TenSanPham`,`MoTa`),
  CONSTRAINT `fk_sp_an_boi` FOREIGN KEY (`an_boi`) REFERENCES `nguoi_dung` (`id`),
  CONSTRAINT `fk_sp_brand` FOREIGN KEY (`MaThuongHieu`) REFERENCES `thuong_hieu` (`id`),
  CONSTRAINT `sanpham_ibfk_1` FOREIGN KEY (`MaDanhMuc`) REFERENCES `danh_muc` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.sanpham: ~13 rows (approximately)
INSERT INTO `sanpham` (`MaSanPham`, `MaDanhMuc`, `TenSanPham`, `MoTa`, `Gia`, `GiaGoc`, `NgayTao`, `NgayCapNhat`, `is_an`, `thoi_gian_an`, `an_boi`, `MaThuongHieu`) VALUES
	(1, 1, 'Kem dưỡng ẩm ban đêm', 'Phù hợp da khô', 159000.00, 199000.00, '2025-11-14 23:04:45', '2025-11-14 23:04:45', 0, NULL, NULL, 1),
	(2, 4, 'Dầu gội Romano Classic', 'Công thức cải tiến, lưu hương nước hoa lâu dài, dành cho tóc thường.', 95000.00, 109000.00, '2025-11-20 20:02:14', '2025-11-20 20:02:14', 0, NULL, NULL, 7),
	(3, 4, 'Dầu gội Romano Force', 'Chứa Pro-Vitamin B5, giúp tóc chắc khỏe, giảm gãy rụng và tạo kiểu dễ hơn.', 99000.00, 115000.00, '2025-11-20 20:02:14', '2025-11-20 20:02:14', 0, NULL, NULL, 7),
	(4, 4, 'Dầu gội Romano Attitude', 'Hương thơm nam tính, sang trọng từ gỗ đàn hương và hổ phách, sạch gàu.', 98000.00, 110000.00, '2025-11-20 20:02:14', '2025-11-20 20:02:14', 0, NULL, NULL, 7),
	(5, 4, 'Dầu gội Romano Cleansing', 'Làm sạch sâu da đầu, loại bỏ bã nhờn và bụi bẩn, mang lại cảm giác sảng khoái.', 92000.00, 105000.00, '2025-11-20 20:02:14', '2025-11-20 20:02:14', 0, NULL, NULL, 7),
	(6, 4, 'Dầu gội Romano Premium', 'Dòng cao cấp với hương nước hoa Ý tinh tế, giúp tóc mềm mượt và đầy sức sống.', 125000.00, 149000.00, '2025-11-20 20:02:14', '2025-11-20 20:02:14', 0, NULL, NULL, 7),
	(7, 4, 'Dầu gội Romano Anti-Dandruff', 'Công thức ZPTO hiệu quả loại bỏ gàu, ngứa da đầu, kết hợp hương gỗ mạnh mẽ.', 105000.00, 120000.00, '2025-11-20 20:02:14', '2025-11-20 20:02:14', 0, NULL, NULL, 7),
	(8, 4, 'Dầu gội 3-in-1 Romano Sport', 'Dùng được cho tóc, mặt và toàn thân, tiện lợi cho người chơi thể thao.', 110000.00, 129000.00, '2025-11-20 20:02:14', '2025-11-20 20:02:14', 0, NULL, NULL, 7),
	(9, 4, 'Dầu gội Romano Elegance', 'Hương thơm lịch lãm, giúp tóc giữ nếp và bóng mượt, chống khô xơ.', 97000.00, 112000.00, '2025-11-20 20:02:14', '2025-11-20 20:02:14', 0, NULL, NULL, 7),
	(10, 4, 'Dầu gội Romano Strong Hold', 'Bổ sung dưỡng chất giúp tóc bám dính, giữ nếp lâu hơn sau khi gội và sấy.', 102000.00, 118000.00, '2025-11-20 20:02:14', '2025-11-20 20:02:14', 0, NULL, NULL, 7),
	(11, 4, 'Dầu gội Romano Detox', 'Sử dụng than hoạt tính để hút sạch độc tố và tạp chất trên da đầu.', 108000.00, 125000.00, '2025-11-20 20:02:14', '2025-11-20 20:02:14', 0, NULL, NULL, 7),
	(12, 1, 'Kem dưỡng ẩm ban đêm', 'Phù hợp da khô', 159000.00, 199000.00, '2025-11-20 23:19:22', '2025-11-20 23:19:22', 0, NULL, NULL, 1),
	(13, 1, 'Kem dưỡng ẩm ban đêm', 'Phù hợp da khô', 159000.00, 199000.00, '2025-11-21 00:08:23', '2025-11-21 00:08:23', 0, NULL, NULL, 1);

-- Dumping structure for table myphamshop.san_pham_anh
CREATE TABLE IF NOT EXISTS `san_pham_anh` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `san_pham_id` int NOT NULL,
  `url` varchar(500) NOT NULL,
  `thu_tu` int NOT NULL DEFAULT '0',
  `la_anh_dai_dien` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ix_sp_anh` (`san_pham_id`,`la_anh_dai_dien`,`thu_tu`),
  CONSTRAINT `san_pham_anh_ibfk_1` FOREIGN KEY (`san_pham_id`) REFERENCES `sanpham` (`MaSanPham`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.san_pham_anh: ~0 rows (approximately)

-- Dumping structure for table myphamshop.san_pham_gia_lich_su
CREATE TABLE IF NOT EXISTS `san_pham_gia_lich_su` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `san_pham_id` int NOT NULL,
  `gia` decimal(18,2) NOT NULL,
  `hieu_luc_tu` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hieu_luc_den` datetime DEFAULT NULL,
  `cap_nhat_boi` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cap_nhat_boi` (`cap_nhat_boi`),
  KEY `ix_gia_sp` (`san_pham_id`,`hieu_luc_tu`),
  CONSTRAINT `san_pham_gia_lich_su_ibfk_1` FOREIGN KEY (`san_pham_id`) REFERENCES `sanpham` (`MaSanPham`),
  CONSTRAINT `san_pham_gia_lich_su_ibfk_2` FOREIGN KEY (`cap_nhat_boi`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.san_pham_gia_lich_su: ~0 rows (approximately)

-- Dumping structure for table myphamshop.san_pham_tag
CREATE TABLE IF NOT EXISTS `san_pham_tag` (
  `san_pham_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`san_pham_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `san_pham_tag_ibfk_1` FOREIGN KEY (`san_pham_id`) REFERENCES `sanpham` (`MaSanPham`),
  CONSTRAINT `san_pham_tag_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.san_pham_tag: ~0 rows (approximately)

-- Dumping structure for table myphamshop.san_pham_thanh_phan
CREATE TABLE IF NOT EXISTS `san_pham_thanh_phan` (
  `san_pham_id` int NOT NULL,
  `thanh_phan_id` int NOT NULL,
  `ti_le` decimal(6,2) DEFAULT NULL,
  PRIMARY KEY (`san_pham_id`,`thanh_phan_id`),
  KEY `thanh_phan_id` (`thanh_phan_id`),
  CONSTRAINT `san_pham_thanh_phan_ibfk_1` FOREIGN KEY (`san_pham_id`) REFERENCES `sanpham` (`MaSanPham`),
  CONSTRAINT `san_pham_thanh_phan_ibfk_2` FOREIGN KEY (`thanh_phan_id`) REFERENCES `thanh_phan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.san_pham_thanh_phan: ~0 rows (approximately)

-- Dumping structure for table myphamshop.tag
CREATE TABLE IF NOT EXISTS `tag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(100) NOT NULL,
  `loai` enum('Cong_dung','Loai_da','Chu_de') NOT NULL,
  `mo_ta` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tag` (`ten`,`loai`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.tag: ~2 rows (approximately)
INSERT INTO `tag` (`id`, `ten`, `loai`, `mo_ta`) VALUES
	(1, 'dưỡng da', 'Cong_dung', NULL),
	(2, 'da khô', 'Loai_da', NULL);

-- Dumping structure for table myphamshop.thanh_phan
CREATE TABLE IF NOT EXISTS `thanh_phan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(150) NOT NULL,
  `mo_ta` varchar(500) DEFAULT NULL,
  `canh_bao` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ten` (`ten`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.thanh_phan: ~0 rows (approximately)

-- Dumping structure for table myphamshop.thuong_hieu
CREATE TABLE IF NOT EXISTS `thuong_hieu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(150) NOT NULL,
  `mo_ta` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ten` (`ten`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.thuong_hieu: ~21 rows (approximately)
INSERT INTO `thuong_hieu` (`id`, `ten`, `mo_ta`) VALUES
	(1, 'BeaNice', NULL),
	(7, 'Romano', 'Dầu Gội'),
	(8, 'X-Men', 'Dầu Gội'),
	(9, 'Clear Men', 'Dầu Gội'),
	(10, 'Gillette', 'Dầu Gội'),
	(11, 'Nivea Men', 'Dầu Gội'),
	(17, 'Innisfree Men', 'Chăm Sóc Da'),
	(18, 'Laneige Homme', 'Chăm Sóc Da'),
	(19, 'Biore Men', 'Chăm Sóc Da'),
	(20, 'Hada Labo Men', 'Chăm Sóc Da'),
	(21, 'The Face Shop For Men', 'Chăm Sóc Da'),
	(22, 'Morris Motley', 'Sáp/Gel Tóc'),
	(23, 'By Vilain', 'Sáp/Gel Tóc'),
	(24, 'Reuzel', 'Sáp/Gel Tóc'),
	(25, 'Hanz de Fuko', 'Sáp/Gel Tóc'),
	(26, 'Gatsby', 'Sáp/Gel Tóc'),
	(27, 'L’Oréal Men Expert', 'Nước Hoa'),
	(28, 'Lab Series', 'Nước Hoa'),
	(29, 'Old Spice', 'Nước Hoa'),
	(30, '3W Clinic Men', 'Nước Hoa'),
	(31, 'Neutrogena Men', 'Nước Hoa');

-- Dumping structure for table myphamshop.tinh_thanh
CREATE TABLE IF NOT EXISTS `tinh_thanh` (
  `id` int NOT NULL,
  `ten` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.tinh_thanh: ~34 rows (approximately)
INSERT INTO `tinh_thanh` (`id`, `ten`) VALUES
	(1, 'Thành phố Hà Nội'),
	(4, 'Tỉnh Cao Bằng'),
	(8, 'Tỉnh Tuyên Quang'),
	(11, 'Tỉnh Điện Biên'),
	(12, 'Tỉnh Lai Châu'),
	(14, 'Tỉnh Sơn La'),
	(15, 'Tỉnh Lào Cai'),
	(19, 'Tỉnh Thái Nguyên'),
	(20, 'Tỉnh Lạng Sơn'),
	(22, 'Tỉnh Quảng Ninh'),
	(24, 'Tỉnh Bắc Ninh'),
	(25, 'Tỉnh Phú Thọ'),
	(31, 'Thành phố Hải Phòng'),
	(33, 'Tỉnh Hưng Yên'),
	(37, 'Tỉnh Ninh Bình'),
	(38, 'Tỉnh Thanh Hóa'),
	(40, 'Tỉnh Nghệ An'),
	(42, 'Tỉnh Hà Tĩnh'),
	(44, 'Tỉnh Quảng Trị'),
	(46, 'Thành phố Huế'),
	(48, 'Thành phố Đà Nẵng'),
	(51, 'Tỉnh Quảng Ngãi'),
	(52, 'Tỉnh Gia Lai'),
	(56, 'Tỉnh Khánh Hòa'),
	(66, 'Tỉnh Đắk Lắk'),
	(68, 'Tỉnh Lâm Đồng'),
	(75, 'Tỉnh Đồng Nai'),
	(79, 'Thành phố Hồ Chí Minh'),
	(80, 'Tỉnh Tây Ninh'),
	(82, 'Tỉnh Đồng Tháp'),
	(86, 'Tỉnh Vĩnh Long'),
	(91, 'Tỉnh An Giang'),
	(92, 'Thành phố Cần Thơ'),
	(96, 'Tỉnh Cà Mau');

-- Dumping structure for table myphamshop.ton_kho
CREATE TABLE IF NOT EXISTS `ton_kho` (
  `kho_id` int NOT NULL,
  `san_pham_id` int NOT NULL,
  `so_luong_ton` int NOT NULL DEFAULT '0',
  `so_luong_giu_cho` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`kho_id`,`san_pham_id`),
  KEY `san_pham_id` (`san_pham_id`),
  CONSTRAINT `ton_kho_ibfk_1` FOREIGN KEY (`kho_id`) REFERENCES `kho_moi` (`id`),
  CONSTRAINT `ton_kho_ibfk_2` FOREIGN KEY (`san_pham_id`) REFERENCES `sanpham` (`MaSanPham`),
  CONSTRAINT `ton_kho_chk_1` CHECK ((`so_luong_ton` >= 0)),
  CONSTRAINT `ton_kho_chk_2` CHECK ((`so_luong_giu_cho` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.ton_kho: ~1 rows (approximately)
INSERT INTO `ton_kho` (`kho_id`, `san_pham_id`, `so_luong_ton`, `so_luong_giu_cho`) VALUES
	(1, 1, 10, 0);

-- Dumping structure for table myphamshop.vai_tro
CREATE TABLE IF NOT EXISTS `vai_tro` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ten` varchar(50) NOT NULL,
  `mo_ta` varchar(255) DEFAULT NULL,
  `thoi_gian_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `thoi_gian_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ten` (`ten`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.vai_tro: ~5 rows (approximately)
INSERT INTO `vai_tro` (`id`, `ten`, `mo_ta`, `thoi_gian_tao`, `thoi_gian_cap_nhat`) VALUES
	(1, 'Admin', 'Toan quyen he thong', '2025-11-14 23:04:43', '2025-11-14 23:04:43'),
	(2, 'QL_SanPham', 'Quan ly san pham', '2025-11-14 23:04:43', '2025-11-14 23:04:43'),
	(3, 'QL_KhachHang', 'Quan ly khach hang', '2025-11-14 23:04:43', '2025-11-14 23:04:43'),
	(4, 'QL_Kho', 'Quan ly kho', '2025-11-14 23:04:43', '2025-11-14 23:04:43'),
	(5, 'Customer', 'Khach hang', '2025-11-14 23:04:43', '2025-11-14 23:04:43');

-- Dumping structure for table myphamshop.vai_tro_quyen
CREATE TABLE IF NOT EXISTS `vai_tro_quyen` (
  `vai_tro_id` bigint NOT NULL,
  `quyen_id` bigint NOT NULL,
  PRIMARY KEY (`vai_tro_id`,`quyen_id`),
  KEY `fk_vtq_perm` (`quyen_id`),
  CONSTRAINT `fk_vtq_perm` FOREIGN KEY (`quyen_id`) REFERENCES `quyen` (`id`),
  CONSTRAINT `fk_vtq_role` FOREIGN KEY (`vai_tro_id`) REFERENCES `vai_tro` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.vai_tro_quyen: ~50 rows (approximately)
INSERT INTO `vai_tro_quyen` (`vai_tro_id`, `quyen_id`) VALUES
	(1, 1),
	(2, 1),
	(3, 1),
	(4, 1),
	(5, 1),
	(1, 2),
	(2, 2),
	(1, 3),
	(2, 3),
	(2, 4),
	(4, 4),
	(1, 5),
	(2, 5),
	(1, 6),
	(2, 6),
	(1, 7),
	(2, 7),
	(1, 8),
	(3, 8),
	(1, 9),
	(3, 9),
	(5, 9),
	(1, 10),
	(3, 10),
	(5, 10),
	(1, 11),
	(5, 11),
	(1, 12),
	(5, 12),
	(1, 13),
	(5, 13),
	(1, 14),
	(2, 14),
	(3, 14),
	(1, 15),
	(5, 15),
	(1, 16),
	(5, 16),
	(1, 17),
	(5, 17),
	(1, 18),
	(5, 18),
	(1, 19),
	(2, 19),
	(1, 20),
	(1, 21),
	(1, 22),
	(4, 22),
	(1, 23),
	(4, 23);

-- Dumping structure for table myphamshop.yeu_cau_huy_don
CREATE TABLE IF NOT EXISTS `yeu_cau_huy_don` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `don_hang_id` bigint NOT NULL,
  `nguoi_dung_id` bigint NOT NULL,
  `ly_do_huy_cua_khach` varchar(500) NOT NULL,
  `trang_thai_xu_ly` enum('CHO_DUYET','DA_CHAP_NHAN','DA_TU_CHOI') NOT NULL DEFAULT 'CHO_DUYET',
  `xu_ly_boi` bigint DEFAULT NULL,
  `thoi_gian_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `thoi_gian_xu_ly` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `nguoi_dung_id` (`nguoi_dung_id`),
  KEY `xu_ly_boi` (`xu_ly_boi`),
  KEY `ix_huy_don` (`don_hang_id`,`trang_thai_xu_ly`),
  CONSTRAINT `yeu_cau_huy_don_ibfk_1` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`),
  CONSTRAINT `yeu_cau_huy_don_ibfk_2` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`),
  CONSTRAINT `yeu_cau_huy_don_ibfk_3` FOREIGN KEY (`xu_ly_boi`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table myphamshop.yeu_cau_huy_don: ~0 rows (approximately)

-- Dumping structure for trigger myphamshop.trg_dhct_after_del
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_dhct_after_del` AFTER DELETE ON `don_hang_chi_tiet` FOR EACH ROW BEGIN
  UPDATE don_hang
  SET tong_hang = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=OLD.don_hang_id),
      tong_thanh_toan = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=OLD.don_hang_id)
                         + phi_van_chuyen - tong_giam_gia
  WHERE id = OLD.don_hang_id;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger myphamshop.trg_dhct_after_ins
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_dhct_after_ins` AFTER INSERT ON `don_hang_chi_tiet` FOR EACH ROW BEGIN
  UPDATE don_hang
  SET tong_hang = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=NEW.don_hang_id),
      tong_thanh_toan = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=NEW.don_hang_id)
                         + phi_van_chuyen - tong_giam_gia
  WHERE id = NEW.don_hang_id;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger myphamshop.trg_dhct_after_reserve
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_dhct_after_reserve` AFTER INSERT ON `don_hang_chi_tiet` FOR EACH ROW BEGIN
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
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger myphamshop.trg_dhct_after_upd
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_dhct_after_upd` AFTER UPDATE ON `don_hang_chi_tiet` FOR EACH ROW BEGIN
  UPDATE don_hang
  SET tong_hang = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=NEW.don_hang_id),
      tong_thanh_toan = (SELECT COALESCE(SUM(thanh_tien),0) FROM don_hang_chi_tiet WHERE don_hang_id=NEW.don_hang_id)
                         + phi_van_chuyen - tong_giam_gia
  WHERE id = NEW.don_hang_id;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger myphamshop.trg_giucho_check_dm
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_giucho_check_dm` BEFORE INSERT ON `giu_cho` FOR EACH ROW BEGIN
  DECLARE dm_kho INT; DECLARE dm_sp INT; DECLARE sp_id INT;
  SELECT san_pham_id INTO sp_id FROM don_hang_chi_tiet WHERE id = NEW.don_hang_ct_id;
  SELECT danh_muc_id INTO dm_kho FROM kho_moi WHERE id = NEW.kho_id;
  SELECT MaDanhMuc INTO dm_sp FROM sanpham WHERE MaSanPham = sp_id;
  IF dm_kho IS NULL OR dm_sp IS NULL OR dm_kho <> dm_sp THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Danh muc cua kho va san pham khong khop (giu_cho)';
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger myphamshop.trg_kho_moi_before_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_kho_moi_before_insert` BEFORE INSERT ON `kho_moi` FOR EACH ROW BEGIN
  DECLARE dm_id INT DEFAULT NULL;
  IF NEW.danh_muc_id IS NULL OR NEW.danh_muc_id = 0 THEN
    SELECT id INTO dm_id FROM danh_muc WHERE ten = NEW.ten_kho LIMIT 1;
    IF dm_id IS NULL THEN
      INSERT INTO danh_muc (ten) VALUES (NEW.ten_kho);
      SET dm_id = LAST_INSERT_ID();
    END IF;
    SET NEW.danh_muc_id = dm_id;
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger myphamshop.trg_sp_price_history
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_sp_price_history` BEFORE UPDATE ON `sanpham` FOR EACH ROW BEGIN
  IF NEW.Gia <> OLD.Gia THEN
    UPDATE san_pham_gia_lich_su 
      SET hieu_luc_den = NOW()
    WHERE san_pham_id = OLD.MaSanPham AND hieu_luc_den IS NULL;
    INSERT INTO san_pham_gia_lich_su (san_pham_id, gia, hieu_luc_tu)
    VALUES (OLD.MaSanPham, NEW.Gia, NOW());
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger myphamshop.trg_tonkho_check_dm
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_tonkho_check_dm` BEFORE INSERT ON `ton_kho` FOR EACH ROW BEGIN
  DECLARE dm_kho INT; DECLARE dm_sp INT;
  SELECT danh_muc_id INTO dm_kho FROM kho_moi WHERE id = NEW.kho_id;
  SELECT MaDanhMuc INTO dm_sp FROM sanpham WHERE MaSanPham = NEW.san_pham_id;
  IF dm_kho IS NULL OR dm_sp IS NULL OR dm_kho <> dm_sp THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Danh muc cua kho va san pham khong khop';
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
