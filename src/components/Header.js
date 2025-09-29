// src/components/Header.js
import React from "react";

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-3xl">🛍️</span>
          <h1 className="text-2xl font-bold text-pink-600">Beauty Shop</h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <a href="/" className="hover:text-pink-600 transition-colors">Trang Chủ</a>
          <a href="/products" className="hover:text-pink-600 transition-colors">Sản Phẩm</a>
          <a href="/categories" className="hover:text-pink-600 transition-colors">Danh Mục</a>
          <a href="/contact" className="hover:text-pink-600 transition-colors">Liên Hệ</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4 text-xl">
          <button className="hover:text-pink-600 transition-colors">🔍</button>
          <button className="hover:text-pink-600 transition-colors">🛒</button>
          <button className="hover:text-pink-600 transition-colors">👤</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
