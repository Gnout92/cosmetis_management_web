// src/components/SidebarColapsible.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Package, 
  Warehouse, 
  Users, 
  LogOut,
  Home,
  ChevronDown,
  UserCheck,
  ShoppingCart,
  Plus,
  List,
  Edit,
  Truck,
  Inbox,
  Package2,
  BarChart,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/NoiBo/SidebarColapsible.module.css';

const SidebarColapsible = ({ activeTab, setActiveTab }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  // State để quản lý dropdown menus
  const [openDropdowns, setOpenDropdowns] = useState({
    qlkhachhang: false,
    qlsanpham: false,
    qlkho: false
  });

  const toggleDropdown = (key) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Get user role
  const getUserRole = () => {
    if (!user) return 'Khách hàng';
    return user.vai_tro || user.role || user.primaryRole || 'Khách hàng';
  };

  const userRole = getUserRole();

  const handleNavigation = (item) => {
    if (item.path && item.path.startsWith('/')) {
      router.push(item.path);
    } else if (setActiveTab && item.id) {
      setActiveTab(item.id);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Render menu item với dropdown
  const renderMenuItem = (item, hasDropdown = false) => {
    const isActive = activeTab === item.id || router.pathname === item.path;
    const isOpen = openDropdowns[item.id];
    
    return (
      <div key={item.id} className={styles.menuItem}>
        <button
          onClick={() => {
            if (hasDropdown) {
              toggleDropdown(item.id);
            } else {
              handleNavigation(item);
            }
          }}
          className={`${styles.menuButton} ${isActive ? styles.active : ''}`}
        >
          <div className={styles.menuLabel}>
            <item.icon className={styles.menuIcon} />
            <span>{item.label}</span>
          </div>
          {hasDropdown && (
            <ChevronDown 
              className={`${styles.dropdownIcon} ${isOpen ? styles.rotated : ''}`} 
              size={16} 
            />
          )}
        </button>
        
        {/* Submenu */}
        {hasDropdown && isOpen && (
          <div className={styles.submenu}>
            {item.submenu?.map((subItem) => (
              <button
                key={subItem.id}
                onClick={() => handleNavigation(subItem)}
                className={styles.submenuItem}
              >
                <subItem.icon className={styles.submenuIcon} />
                <span>{subItem.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.sidebar}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <BarChart size={24} />
          <span>Quản Lý Nội Bộ</span>
        </div>
      </div>

      {/* User Welcome Section */}
      {user && (
        <div className={styles.headerSection}>
          <div className={styles.userWelcome}>
            <User className={styles.menuIcon} style={{ margin: '0 auto 0.5rem' }} />
            <div className={styles.userName}>
              {user.ho_ten || user.name || 'Người dùng'}
            </div>
            <div className={styles.userRole}>
              {userRole}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className={styles.sidebarContent}>
        <nav className={styles.menuSection}>
          {/* Về Trang Chủ */}
          {renderMenuItem({
            id: 'home',
            icon: Home,
            label: 'Về Trang Chủ',
            path: '/',
            show: true
          })}

          {/* Quản lí khách hàng */}
          {renderMenuItem({
            id: 'qlkhachhang',
            icon: Users,
            label: 'Quản lí khách hàng',
            path: '#',
            show: true,
            submenu: [
              { id: 'customers-list', icon: List, label: 'Danh sách khách hàng', path: '/NoiBo/QLKH' },
              { id: 'customers-add', icon: UserCheck, label: 'Thêm khách hàng', path: '/NoiBo/QLKH' },
              { id: 'customers-edit', icon: Edit, label: 'Chỉnh sửa thông tin', path: '/NoiBo/QLKH' },
              { id: 'customers-orders', icon: ShoppingCart, label: 'Đơn hàng của khách', path: '/NoiBo/QLKH' }
            ]
          }, true)}

          {/* quản lí sản phẩm */}
          {renderMenuItem({
            id: 'qlsanpham',
            icon: Package,
            label: 'quản lí sản phẩm',
            path: '#',
            show: true,
            submenu: [
              { id: 'products-list', icon: List, label: 'Danh sách sản phẩm', path: '/NoiBo/QLSP' },
              { id: 'products-add', icon: Plus, label: 'Thêm sản phẩm', path: '/NoiBo/QLSP' },
              { id: 'products-categories', icon: BarChart, label: 'Danh mục', path: '/NoiBo/QLSP' },
              { id: 'products-inventory', icon: Package2, label: 'Tồn kho', path: '/NoiBo/QLSP' }
            ]
          }, true)}

          {/* quản lí kho */}
          {renderMenuItem({
            id: 'qlkho',
            icon: Warehouse,
            label: 'quản lí kho',
            path: '#',
            show: true,
            submenu: [
              { id: 'warehouse-stocks', icon: Package2, label: 'Tồn kho', path: '/NoiBo/QLKho' },
              { id: 'warehouse-import', icon: Inbox, label: 'Nhập kho', path: '/NoiBo/QLKho' },
              { id: 'warehouse-export', icon: Truck, label: 'Xuất kho', path: '/NoiBo/QLKho' },
              { id: 'warehouse-history', icon: BarChart, label: 'Lịch sử', path: '/NoiBo/QLKho' }
            ]
          }, true)}
        </nav>
      </div>

      {/* Logout */}
      <div className={styles.logoutSection}>
        <button
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          <LogOut className={styles.logoutIcon} />
          <span>Đăng Xuất</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarColapsible;