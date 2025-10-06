import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PersonalInfo from './account/PersonalInfo';
import AddressManagement from './account/AddressManagement';
import OrderHistory from './account/OrderHistory';
import PaymentMethods from './account/PaymentMethods';
import Wishlist from './account/Wishlist';
import Notifications from './account/Notifications';
import SecuritySettings from './account/SecuritySettings';
import LoyaltyProgram from './account/LoyaltyProgram';
import styles from '../styles/login.module.css';

const AccountDashboard = ({ user, onLogout, showNotification }) => {
  const [activeSection, setActiveSection] = useState('personal-info');
  const { updateUser } = useContext(AuthContext);
  
  // Menu navigation
  const menuItems = [
    {
      section: 'account',
      title: 'Tài khoản',
      items: [
        { id: 'personal-info', label: 'Thông tin cá nhân', icon: '👤', badge: null },
        { id: 'address', label: 'Địa chỉ giao hàng', icon: '📍', badge: user?.profile?.addresses?.length || 0 },
        { id: 'security', label: 'Bảo mật', icon: '🔒', badge: null }
      ]
    },
    {
      section: 'shopping',
      title: 'Mua sắm',
      items: [
        { id: 'orders', label: 'Đơn hàng', icon: '📦', badge: user?.orders?.filter(o => o.status === 'pending')?.length || 0 },
        { id: 'wishlist', label: 'Yêu thích', icon: '❤️', badge: user?.wishlist?.length || 0 },
        { id: 'payment', label: 'Thanh toán', icon: '💳', badge: user?.paymentMethods?.length || 0 }
      ]
    },
    {
      section: 'rewards',
      title: 'Ưu đãi',
      items: [
        { id: 'loyalty', label: 'Điểm thưởng', icon: '⭐', badge: user?.loyaltyPoints || 0 },
        { id: 'notifications', label: 'Thông báo', icon: '🔔', badge: 3 }
      ]
    }
  ];

  // Render nội dung chính
  const renderMainContent = () => {
    switch (activeSection) {
      case 'personal-info':
        return <PersonalInfo user={user} updateUser={updateUser} showNotification={showNotification} />;
      case 'address':
        return <AddressManagement user={user} updateUser={updateUser} showNotification={showNotification} />;
      case 'orders':
        return <OrderHistory user={user} showNotification={showNotification} />;
      case 'payment':
        return <PaymentMethods user={user} updateUser={updateUser} showNotification={showNotification} />;
      case 'wishlist':
        return <Wishlist user={user} updateUser={updateUser} showNotification={showNotification} />;
      case 'notifications':
        return <Notifications user={user} updateUser={updateUser} showNotification={showNotification} />;
      case 'security':
        return <SecuritySettings user={user} showNotification={showNotification} />;
      case 'loyalty':
        return <LoyaltyProgram user={user} updateUser={updateUser} showNotification={showNotification} />;
      default:
        return <PersonalInfo user={user} updateUser={updateUser} showNotification={showNotification} />;
    }
  };

  return (
    <div className={styles.accountContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        {/* Header với thông tin user */}
        <div className={styles.sidebarHeader}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || 'U'
              )}
            </div>
            <h3 className={styles.userName}>{user?.name || 'Người dùng'}</h3>
            <p className={styles.userEmail}>{user?.email}</p>
            <div className={styles.pointsBadge}>
              ⭐ {user?.loyaltyPoints || 0} điểm
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navMenu}>
          {menuItems.map((section) => (
            <div key={section.section} className={styles.navSection}>
              <div className={styles.navSectionTitle}>{section.title}</div>
              {section.items.map((item) => (
                <a
                  key={item.id}
                  className={`${styles.navItem} ${activeSection === item.id ? styles.active : ''}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.text}>{item.label}</span>
                  {item.badge !== null && item.badge > 0 && (
                    <span className={styles.badge}>{item.badge}</span>
                  )}
                </a>
              ))}
            </div>
          ))}
        </nav>

        {/* Nút trở về trang chủ và đăng xuất */}
        <div className={styles.backToHomeSidebar}>
          <a href="/" className={styles.link}>
            🏠 Trang chủ
          </a>
          <button 
            onClick={onLogout} 
            className={`${styles.link} ${styles['btn-danger']}`}
            style={{ marginTop: '0.5rem', border: 'none', width: '100%' }}
          >
            🚪 Đăng xuất
          </button>
        </div>
      </div>

      {/* Nội dung chính */}
      <main className={styles.mainContent}>
        {renderMainContent()}
      </main>
    </div>
  );
};

export default AccountDashboard;