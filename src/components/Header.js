// src/components/Header.js
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  Users, 
  ShoppingCart, 
  Settings, 
  BarChart3, 
  LogOut,
  User,
  Home
} from "lucide-react";

const Header = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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

  // Get navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return [];
    
    const role = user.vai_tro || user.role || user.primaryRole || 'Customer';
    const normalizedRole = String(role).toLowerCase().replace(/[\s_]+/g, '');
    
    console.log('🔍 Header - User role:', role, 'Normalized:', normalizedRole);

    const commonItems = [
      { 
        icon: Home, 
        label: 'Trang Chủ', 
        path: '/',
        show: true 
      }
    ];

    // Navigation for Admin
    if (normalizedRole === 'admin') {
      return [
        ...commonItems,
        { 
          icon: LayoutDashboard, 
          label: 'Quản Trị', 
          path: '/NoiBo/Admin',
          show: true 
        },
        { 
          icon: BarChart3, 
          label: 'Thống Kê', 
          path: '/NoiBo/Admin?tab=stats',
          show: true 
        }
      ];
    }

    // Navigation for Product Manager (QL_SanPham)
    if (['ql_sanpham', 'product', 'sales'].includes(normalizedRole)) {
      return [
        ...commonItems,
        { 
          icon: Package, 
          label: 'Quản Lý Sản Phẩm', 
          path: '/NoiBo/QLSP',
          show: true 
        }
      ];
    }

    // Navigation for Warehouse Manager (QL_Kho)
    if (['ql_kho', 'warehouse', 'warehous'].includes(normalizedRole)) {
      return [
        ...commonItems,
        { 
          icon: Warehouse, 
          label: 'Quản Lý Kho', 
          path: '/NoiBo/QLKho',
          show: true 
        }
      ];
    }

    // Navigation for Customer Manager (QL_KhachHang)
    if (['ql_khachhang', 'customer', 'staff'].includes(normalizedRole)) {
      return [
        ...commonItems,
        { 
          icon: Users, 
          label: 'Quản Lý Khách Hàng', 
          path: '/NoiBo/QLKH',
          show: true 
        }
      ];
    }

    // Default navigation for Customer
    return [
      ...commonItems,
      { 
        icon: ShoppingCart, 
        label: 'Sản Phẩm', 
        path: '/products',
        show: true 
      },
      { 
        icon: User, 
        label: 'Tài Khoản', 
        path: '/taikhoan',
        show: true 
      }
    ];
  };

  const navigationItems = getNavigationItems();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">B</span>
          </div>
          <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-400">Beauty Shop</h1>
        </div>

        {/* Navigation - Desktop */}
        {isAuthenticated && (
          <nav className="hidden lg:flex space-x-6 text-gray-700 dark:text-gray-300 font-medium">
            {navigationItems.filter(item => item.show).map((item, index) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => router.push(item.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    router.pathname === item.path 
                      ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Mobile menu button */}
        {isAuthenticated && (
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

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
                onClick={() => setShowUserMenu(!showUserMenu)}
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
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {getUserDisplayName()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.vai_tro || user.role || user.primaryRole || 'Customer'}
                  </div>
                </div>
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

                    {/* Quick Navigation based on role */}
                    {navigationItems.filter(item => item.show && item.path !== '/').map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => handleMenuClick(item.path)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                        >
                          <IconComponent size={16} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}

                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                    <button
                      onClick={() => handleMenuClick('/taikhoan')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                    >
                      <User size={16} />
                      <span>Quản lý tài khoản</span>
                    </button>

                    <button
                      onClick={toggleTheme}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                    >
                      {isDarkMode ? <Home size={16} /> : <Settings size={16} />}
                      <span>{isDarkMode ? "Chế độ sáng" : "Chế độ tối"}</span>
                    </button>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                    >
                      <LogOut size={16} />
                      <span>Đăng xuất</span>
                    </button>
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

      {/* Mobile Navigation Menu */}
      {isAuthenticated && showMobileMenu && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <nav className="space-y-2">
              {navigationItems.filter(item => item.show).map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      router.push(item.path);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      router.pathname === item.path 
                        ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <IconComponent size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
