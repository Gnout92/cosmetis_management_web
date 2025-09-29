// src/components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + mô tả */}
        <div>
          <h3 className="text-2xl font-bold text-pink-500 mb-4">🛍️ Beauty Shop</h3>
          <p>
            Cửa hàng mỹ phẩm uy tín với hàng nghìn sản phẩm chính hãng từ các thương hiệu nổi tiếng.
          </p>
        </div>

        {/* Liên kết */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Liên Kết</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-pink-400">Về Chúng Tôi</a></li>
            <li><a href="#" className="hover:text-pink-400">Sản Phẩm</a></li>
            <li><a href="#" className="hover:text-pink-400">Tin Tức</a></li>
            <li><a href="#" className="hover:text-pink-400">Liên Hệ</a></li>
          </ul>
        </div>

        {/* Hỗ trợ */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Hỗ Trợ</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-pink-400">Chính Sách Đổi Trả</a></li>
            <li><a href="#" className="hover:text-pink-400">Vận Chuyển</a></li>
            <li><a href="#" className="hover:text-pink-400">Thanh Toán</a></li>
            <li><a href="#" className="hover:text-pink-400">FAQ</a></li>
          </ul>
        </div>

        {/* Mạng xã hội */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Theo Dõi</h4>
          <div className="flex space-x-4 text-2xl">
            <a href="#" className="hover:text-pink-400">📱</a>
            <a href="#" className="hover:text-pink-400">📘</a>
            <a href="#" className="hover:text-pink-400">📷</a>
            <a href="#" className="hover:text-pink-400">🐦</a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
        <p>&copy; 2025 Beauty Shop. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  );
};

export default Footer;
