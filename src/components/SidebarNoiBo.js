// src/components/SidebarNoiBo.js - Modern Ultra-Premium Enhanced
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Home,
  Shield,
  ChevronDown,
  ChevronRight,
  UserCheck,
  ShoppingCart,
  MessageCircle,
  Plus,
  List,
  Edit,
  Eye,
  Inbox,
  Package2,
  BarChart,
  Sparkles,
  Heart,
  Zap,
  Star,
  Crown,
  Gem,
  Moon,
  Sun,
  Bell,
  Search,
  Filter,
  TrendingUp,
  Award,
  Target,
  CheckCircle,
  Tag,
  Building2,
  Store,
  CreditCard,
  UserCog,
  Activity,
  Camera,
  Calendar,
  Download,
  Upload,
  FileText,
  Database,
  Layers,
  Boxes,
  UserPlus,
  UserMinus,
  UserX,
  User,
  MapPin,
  Phone,
  Mail,
  File,
  LineChart,
  PieChart,
  Network
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/NoiBo/SidebarNoiBo.module.css';
const SidebarNoiBo = ({ activeTab, setActiveTab }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  // Enhanced State management với animations và performance
  const [openDropdowns, setOpenDropdowns] = useState({
    qlkhachhang: false,
    qlsanpham: false,
    qlkho: false
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [hovered, setHovered] = useState(null);

  // Performance optimization với useEffect
  useEffect(() => {
    // Auto-collapse on mobile
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced dropdown toggle với smooth animations
  const toggleDropdown = (key) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Create ripple effect for better UX
  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple = {
      id: Math.random(),
      x,
      y,
      size
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  // Get user role với enhanced logic
  const getUserRole = () => {
    if (!user) return 'Khách hàng';
    return user.vai_tro || user.role || user.primaryRole || 'Khách hàng';
  };

  const userRole = getUserRole();
  const normalizedRole = userRole.toLowerCase().replace(/[\s_]+/g, '');

  // Enhanced navigation handler với ripple effect
  const handleNavigation = (item, event) => {
    if (event) createRipple(event);
    
    if (item.path.startsWith('/')) {
      router.push(item.path);
    } else if (setActiveTab) {
      setActiveTab(item.id);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Enhanced search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search logic here
    console.log('Searching for:', query);
  };

  // Ultra-Enhanced Menu Item với Premium Effects
  const renderMenuItem = (item, hasDropdown = false, groupClass = '') => {
    const isActive = activeTab === item.id || router.pathname === item.path;
    const isOpen = openDropdowns[item.id];
    
    return (
      <div key={item.id} className={`group ${styles.menuItemContainer} ${groupClass ? styles[groupClass] : ''}`}>
        <button
          onClick={(e) => {
            if (hasDropdown) {
              toggleDropdown(item.id);
            } else {
              handleNavigation(item, e);
            }
          }}
          className={`w-full relative overflow-hidden rounded-xl transition-all duration-500 ease-out text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-800 dark:hover:text-blue-200 shadow-md hover:shadow-lg ${
            isActive 
            ? 'bg-blue-50 text-blue-900 shadow-lg transform scale-[1.02] border border-blue-200/50 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-700/50' 
              : 'text-gray-700 dark:text-gray-200 border border-transparent hover:border-blue-200/30 dark:hover:border-blue-600/50'
          }`}
          style={{
            background: isActive ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.04) 100%)' : undefined,
            padding: '0.875rem 1.25rem',
            fontSize: '0.9375rem',
            lineHeight: '1.5'
          }}
        >
          {/* Enhanced Ripple Effects */}
          {ripples.map(ripple => (
            <span
              key={ripple.id}
              className={styles.ripple}
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
              }}
            />
          ))}
          
          {/* Multiple Layer Background Effects */}
          <div className="absolute inset-0">
            {/* Primary gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-500 ${
              isActive 
                ? 'from-white/10 via-transparent to-transparent opacity-100' 
                : 'from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100'
            }`} />
            
            {/* Animated shimmer */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out ${
              isActive ? 'opacity-30' : 'opacity-0'
            }`} style={{
              animation: isActive ? 'shimmerSweep 2s infinite' : 'none'
            }} />
            
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
              isActive 
                ? 'shadow-2xl shadow-slate-500/40' 
                : 'shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 group-hover:shadow-slate-500/25'
            }`} />
          </div>
          
          {/* Content */}
          <div className="relative flex items-center justify-between z-10">
            <div className="flex items-center space-x-3">
              {/* Enhanced Icon Container */}
              <div className={`relative p-2.5 rounded-xl transition-all duration-300 modernRadius ${
                isActive 
                  ? 'bg-blue-100/80 dark:bg-blue-800/50 shadow-lg backdrop-blur-sm' 
                  : 'bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/40 shadow-sm'
              }`}>
                <item.icon size={20} className={`transition-all duration-300 ${
                  isActive ? 'text-blue-700 drop-shadow-sm dark:text-blue-200' : 'text-blue-600 dark:text-blue-400'
                }`} />
                
                {/* Icon glow effect */}
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/10 opacity-100' 
                    : 'bg-gradient-to-br from-slate-400/20 to-slate-500/20 opacity-0 group-hover:opacity-100'
                }`} />
              </div>
              
              {/* Enhanced Text */}
              <div className="flex-1">
                <span 
                  className={`font-semibold transition-all duration-300 ${
                    isActive 
                      ? 'text-blue-900 drop-shadow-sm dark:text-blue-100' 
                      : 'text-gray-800 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300'
                  }`}
                  style={{
                    fontSize: '0.9375rem',
                    lineHeight: '1.5',
                    letterSpacing: '0.01em'
                  }}
                >
                  {item.label}
                </span>
                
                {/* Subtitle for better UX */}
                {!hasDropdown && isActive && (
                  <div className="flex items-center mt-1 space-x-1">
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-600/80 font-medium dark:text-slate-200/80">Đang hoạt động</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right side indicators */}
            <div className="flex items-center space-x-3">
              {/* Notification indicator for active items */}
              {isActive && (
                <div className="relative">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg" />
                  <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-75" />
                </div>
              )}
              
              {/* Dropdown arrow */}
              {hasDropdown && (
                <div className={`transition-all duration-300 ${
                  isOpen ? 'rotate-180 scale-110' : 'rotate-0'
                }`}>
                  <ChevronDown size={18} className={`${
                    isActive ? 'text-slate-600 dark:text-slate-200' : 'text-gray-500 group-hover:text-slate-600 dark:group-hover:text-slate-400'
                  }`} />
                </div>
              )}
              
              {/* Premium badge for important items */}
              {item.premium && (
                <div className="relative">
                  <Crown size={12} className="text-amber-400" />
                  <div className="absolute inset-0 text-amber-400 animate-pulse opacity-50">
                    <Crown size={12} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </button>
        
        {/* Ultra-Enhanced Submenu với Stagger Animation */}
        {hasDropdown && isOpen && (
          <div className={`mt-3 ml-4 space-y-2 ${styles.submenuContainer}`}>
            {item.submenu?.map((subItem, index) => {
              const subItemActive = activeTab === subItem.id || router.pathname === subItem.path;
              
              // Determine submenu group class based on parent item
              const getSubmenuGroupClass = () => {
                if (item.id === 'qlkhachhang') return 'customerSubmenu';
                if (item.id === 'qlsanpham') return 'productSubmenu';
                if (item.id === 'qlkho') return 'warehouseSubmenu';
                if (item.id === 'home') return 'homeSubmenu';
                if (item.id === 'analytics') return 'analyticsSubmenu';
                return '';
              };

              const submenuGroupClass = getSubmenuGroupClass();

              return (
                <button
                  key={subItem.id}
                  onClick={(e) => handleNavigation(subItem, e)}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-400 text-left group/sub relative overflow-hidden ${styles.submenuItem} ${submenuGroupClass ? styles[submenuGroupClass] : ''} ${
                    subItemActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 shadow-lg transform translate-x-1 border-l-4 border-blue-500' 
                      : 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10 hover:shadow-md hover:transform hover:translate-x-1 hover:border-l-4 hover:border-blue-400'
                  }`}
               
                >
                  {/* Enhanced submenu shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-500/5 to-transparent -translate-x-full group-hover/sub:translate-x-full transition-transform duration-700 ease-out" />
                  
                  {/* Icon */}
                  <div className={`p-1.5 rounded-md transition-all duration-300 ${
                    subItemActive 
                      ? 'bg-blue-100 dark:bg-blue-800/50 shadow-sm' 
                      : 'bg-blue-50 dark:bg-blue-900/30 group-hover/sub:bg-blue-100 dark:group-hover/sub:bg-blue-800/40'
                  }`}>
                    <subItem.icon size={14} className={`transition-colors duration-300 ${
                      subItemActive ? 'text-blue-700 dark:text-blue-200' : 'text-blue-600 dark:text-blue-400 group-hover/sub:text-blue-600 dark:group-hover/sub:text-blue-300'
                    }`} />
                  </div>
                  
                  {/* Text */}
                  <span 
                    className={`font-medium flex-1 transition-all duration-300 ${
                      subItemActive 
                        ? 'text-blue-800 dark:text-blue-200' 
                        : 'text-gray-700 dark:text-gray-200 group-hover/sub:text-blue-700 dark:group-hover/sub:text-blue-300'
                    }`}
                    style={{
                      fontSize: '0.8125rem',
                      lineHeight: '1.4',
                      letterSpacing: '0.005em'
                    }}
                  >
                    {subItem.label}
                  </span>
                  
                  {/* Active indicator */}
                  {subItemActive && (
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse shadow-sm" />
                      <CheckCircle size={12} className="text-slate-500 animate-fade-in" />
                    </div>
                  )}
                  
                  {/* Status indicators */}
                  {subItem.new && (
                    <span 
                      className="px-2 py-1 text-xs font-bold bg-teal-500 text-white rounded-md shadow-sm animate-pulse"
                      style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      MỚI
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`${styles.sidebarContainer} w-80 h-full flex flex-col transition-all duration-700 ease-out relative ${
        isCollapsed ? 'w-20' : 'w-80'
      } ${isHovered ? 'shadow-2xl shadow-slate-500/20' : 'shadow-xl shadow-gray-900/10'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Background with Multiple Layers */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient background */}
        <div className={`absolute inset-0 transition-all duration-700 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-slate-50/20 to-slate-50/20'
        }`} />
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className={styles.backgroundPattern} />
        </div>
        
        {/* Glass effect overlay */}
        <div className={`absolute inset-0 backdrop-blur-xl transition-opacity duration-500 ${
          isDarkMode ? 'bg-gray-900/70' : 'bg-white/70'
        }`} />
        
        {/* Border */}
        <div className={`absolute inset-0 border-r transition-all duration-500 ${
          isDarkMode 
            ? 'border-gray-700/50 bg-gradient-to-b from-transparent via-gray-700/20 to-transparent' 
            : 'border-gray-200/60 bg-gradient-to-b from-transparent via-gray-300/30 to-transparent'
        }`} />
      </div>

      {/* Ultra-Premium Header Section */}
      <div className={`relative z-10 transition-all duration-500 ${styles.headerSection} ${
        isCollapsed ? 'p-4' : ''
      }`}>
        {/* Logo and Title Container */}
        <div className="flex items-center space-x-4 mb-6">
          {/* Enhanced Logo with Glow Effect */}
         
          {/* Enhanced Title Section */}
          {!isCollapsed && (
            <div className="flex-1 animate-fade-in">
              <h2 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-1">
                Quản Trị Hệ Thống
              </h2>
              <div className="flex items-center space-x-2">
                
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-sm" />
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced Search Bar */}
        {!isCollapsed && (
          <div className="relative mb-6">
            <div className={`relative transition-all duration-300 ${
              isSearchFocused ? 'transform scale-105' : ''
            }`}>
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                isSearchFocused ? 'text-slate-600' : 'text-gray-400'
              }`} size={18} />
              
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Enhanced User Welcome Card */}
        {user && !isCollapsed && (
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-600/50 shadow-md group">
            {/* Background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="relative p-4">
              <div className="flex items-center space-x-3">
                {/* Enhanced Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 bg-slate-600 dark:bg-slate-700 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-lg text-white font-black">
                      {user.ten?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
                
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    Xin chào, {user.ten || 'Người dùng'}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Award size={14} className="text-amber-500" />
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold truncate">
                      {getUserRole()}
                    </p>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center space-x-1">
                  <button className="p-2 rounded-lg bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors duration-200">
                    <Bell size={14} />
                  </button>
                  <button className="p-2 rounded-lg bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors duration-200">
                    <Settings size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute top-4 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 ${
            isCollapsed ? 'left-4' : 'left-16'
          }`}
        >
          <ChevronRight size={16} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Ultra-Modern Navigation */}
      <nav className={`flex-1 relative z-10 overflow-y-auto modernScrollbar space-y-4 ${styles.navContainer} ${
        isCollapsed ? 'px-2' : ''
      }`}>
        {/* Home Navigation */}
        {renderMenuItem({
          id: 'home',
          icon: LayoutDashboard,
          label: 'Về Trang Chủ',
          path: '/',
          show: true,
          premium: true
        }, false, 'homeGroup')}

        {/* Enhanced Customer Management */}
        {renderMenuItem({
          id: 'qlkhachhang',
          icon: Building2,
          label: 'Quản lí khách hàng',
          path: '#',
          show: true,
          premium: true,
          submenu: [
            { id: 'customers-view', icon: Search, label: 'Xem thông tin khách hàng', path: '/NoiBo/QLKH' },
            { id: 'customers-update', icon: User, label: 'Cập nhật thông tin khách hàng', path: '/NoiBo/QLKH' },
            { id: 'customers-history', icon: File, label: 'Xem lịch sử mua hàng', path: '/NoiBo/QLKH' },
            { id: 'customers-orders', icon: ShoppingCart, label: 'Xem tất cả đơn hàng', path: '/NoiBo/QLKH' },
            { id: 'customers-status', icon: CheckCircle, label: 'Cập nhật trạng thái đơn hàng', path: '/NoiBo/QLKH' },
            { id: 'customers-reviews', icon: MessageCircle, label: 'Duyệt/ẩn đánh giá', path: '/NoiBo/QLKH', new: true },
            { id: 'customers-products', icon: Package, label: 'Xem thông tin sản phẩm', path: '/NoiBo/QLKH' },
            { id: 'customers-search', icon: Search, label: 'Tìm kiếm thông tin', path: '/NoiBo/QLKH' }
          ]
        }, true, 'customerGroup')}

        {/* Enhanced Product Management */}
        {renderMenuItem({
          id: 'qlsanpham',
          icon: Store,
          label: 'quản lí sản phẩm',
          path: '#',
          show: true,
          premium: true,
          submenu: [
            { id: 'products-view', icon: Eye, label: 'Xem sản phẩm', path: '/NoiBo/QLSP' },
            { id: 'products-create', icon: Plus, label: 'Tạo sản phẩm mới', path: '/NoiBo/QLSP', new: true },
            { id: 'products-update', icon: Edit, label: 'Cập nhật thông tin sản phẩm', path: '/NoiBo/QLSP' },
            { id: 'products-price', icon: TrendingUp, label: 'Thay đổi giá sản phẩm', path: '/NoiBo/QLSP' },
            { id: 'products-image', icon: Camera, label: 'Cập nhật hình ảnh', path: '/NoiBo/QLSP' },
            { id: 'products-tags', icon: Tag, label: 'Quản lý tag/thuộc tính', path: '/NoiBo/QLSP' },
            { id: 'products-promotion', icon: Sparkles, label: 'Quản lý khuyến mãi', path: '/NoiBo/QLSP' },
            { id: 'products-reviews', icon: MessageCircle, label: 'Duyệt đánh giá sản phẩm', path: '/NoiBo/QLSP' },
            { id: 'products-search', icon: Search, label: 'Tìm kiếm', path: '/NoiBo/QLSP' }
          ]
        }, true, 'productGroup')}

        {/* Enhanced Warehouse Management */}
        {renderMenuItem({
          id: 'qlkho',
          icon: Database,
          label: 'quản lí kho',
          path: '#',
          show: true,
          premium: true,
          submenu: [
            { id: 'warehouse-view', icon: Boxes, label: 'Xem tồn kho', path: '/NoiBo/QLKho' },
            { id: 'warehouse-adjust', icon: Activity, label: 'Điều chỉnh nhập/xuất kho', path: '/NoiBo/QLKho', new: true },
            { id: 'warehouse-products', icon: Package, label: 'Xem thông tin sản phẩm', path: '/NoiBo/QLKho' },
            { id: 'warehouse-hide', icon: Eye, label: 'Ẩn sản phẩm khỏi giao diện (khi hết hàng)', path: '/NoiBo/QLKho' },
            { id: 'warehouse-orders', icon: ShoppingCart, label: 'Xem tất cả đơn hàng', path: '/NoiBo/QLKho' },
            { id: 'warehouse-status', icon: CheckCircle, label: 'Cập nhật trạng thái đơn hàng', path: '/NoiBo/QLKho' },
            { id: 'warehouse-history', icon: File, label: 'Xem lịch sử mua hàng của khách', path: '/NoiBo/QLKho' }
          ]
        }, true, 'warehouseGroup')}
        
        {/* Analytics Section */}
        {renderMenuItem({
          id: 'analytics',
          icon: Network,
          label: 'Báo cáo & Phân tích',
          path: '/analytics',
          show: true,
          premium: true
        }, false, 'analyticsGroup')}
      </nav>

      {/* Ultra-Premium Footer Section */}
      <div className={`relative z-10 p-4 mt-auto transition-all duration-500 ${
        isCollapsed ? 'p-2' : 'p-4'
      }`}>
        {/* Enhanced Logout Card */}
        <div className="relative overflow-hidden rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/30 shadow-sm">
          {/* Background shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
          
          <button
            onClick={handleLogout}
            className="relative w-full flex items-center space-x-3 px-4 py-3.5 text-left transition-all duration-300 text-red-600 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-900/30 rounded-lg group overflow-hidden"
            onMouseEnter={() => setHovered('logout')}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Enhanced Logout Icon */}
            <div className="relative p-2 rounded-lg bg-red-100 dark:bg-red-900/30 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-110">
              <LogOut size={18} className="transition-transform duration-300 group-hover:rotate-12" />
              
              {/* Icon glow effect */}
              <div className="absolute inset-0 bg-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
            </div>
            
            {!isCollapsed && (
              <div className="flex-1">
                <span className="font-bold text-sm">Đăng Xuất </span>
               
              </div>
            )}
            
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-red-400 rounded-full group-hover:bg-red-500 transition-colors duration-300 shadow-sm" />
                <div className="w-1.5 h-1.5 bg-red-300 rounded-full animate-pulse" />
              </div>
            )}
            
            {/* Click ripple effect */}
            <div className="absolute inset-0 bg-red-500/10 rounded-xl opacity-0 group-active:opacity-100 transition-opacity duration-200" />
          </button>
        </div>
        
        {/* System Status Footer */}
        {!isCollapsed && (
          <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-600/50">
            <div className="flex items-center justify-between text-xs">
             
              
            </div>
          </div>
        )}
      </div>
      
      {/* Notification Panel (Hidden by default) */}
      
    </div>
  );
};

export default SidebarNoiBo;