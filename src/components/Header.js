// src/components/Header.js
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef(null);

  // Handle click outside to close menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
   router.push('/login');
  };

  const handleMenuClick = (path) => {
    router.push(path);
    setShowUserMenu(false);
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return "Người dùng";
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <span className="text-3xl">🛍️</span>
          <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-400">Beauty Shop</h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 text-gray-700 dark:text-gray-300 font-medium">
          <a href="/" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Trang Chủ</a>
          <a href="/products" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Sản Phẩm</a>
          <a href="/categories" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Danh Mục</a>
          <a href="/contact" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Liên Hệ</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <button className="text-xl hover:text-pink-600 dark:hover:text-pink-400 transition-colors" title="Tìm kiếm">
            🔍
          </button>
          
          {/* Cart */}
          <button className="text-xl hover:text-pink-600 dark:hover:text-pink-400 transition-colors relative" title="Giỏ hàng">
            🛒
            {/* Cart badge */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="text-xl hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
            title={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          {/* User Menu */}
          {isAuthenticated && user ? (
            <div className="relative" ref={menuRef}>
              {/* User Avatar and Name Button */}
              <button
              onClick={() => {
  // Click vào user button sẽ chuyển đến trang tài khoản
  router.push('/taikhoan');
  setShowUserMenu(false);
}}
                className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors"
              >
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border-2 border-pink-200 dark:border-pink-700"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                  {getUserDisplayName()}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {showUserMenu ? "▲" : "▼"}
                </span>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar || "/default-avatar.png"}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                   onClick={() => handleMenuClick('/taikhoan')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                    >
                      <span>👤</span>
                      <span>Quản lý tài khoản</span>
                    </button>

                    <button
                      onClick={() => handleMenuClick('/account/orders')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                    >
                      <span>📦</span>
                      <span>Đơn hàng của tôi</span>
                    </button>

                    <button
                      onClick={() => handleMenuClick('/account/addresses')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                    >
                      <span>📍</span>
                      <span>Sổ địa chỉ</span>
                    </button>

                    <button
                      onClick={() => handleMenuClick('/account/wishlist')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                    >
                      <span>❤️</span>
                      <span>Sản phẩm yêu thích</span>
                    </button>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                    <button
                      onClick={toggleTheme}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                    >
                      <span>{isDarkMode ? "☀️" : "🌙"}</span>
                      <span>{isDarkMode ? "Chế độ sáng" : "Chế độ tối"}</span>
                    </button>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                    {/* <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                    >
                      <span>🚪</span>
                      <span>Đăng xuất</span>
                    </button> */}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Login/Register Button when not authenticated */
            <button
              onClick={() => router.push('/login')}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Đăng nhập / Đăng ký
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
