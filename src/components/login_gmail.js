import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AccountDashboard from './AccountDashboard';
import styles from '../styles/login.module.css';


const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id';

export default function AccountPageWithGmail({ user, onLogin, onLogout }) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(user ? 'profile' : 'login');
  const [isLogin, setIsLogin] = useState(!user);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  
  // User Profile State
  const [userInfo, setUserInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || 'female',
    birthDate: user?.birthDate || '',
    address: user?.address || '',
    avatar: user?.avatar || '',
    loginMethod: user?.loginMethod || 'email',
    points: user?.points || 0,
    memberSince: user?.memberSince || new Date().toISOString()
  });
  
  // Auth Form Data
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Google OAuth initialization
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && isGoogleScriptLoaded) {
      initializeGoogleSignIn();
    }
  }, [isGoogleScriptLoaded]);

  // Update user info when user prop changes
  useEffect(() => {
    if (user) {
      setUserInfo(prev => ({
        ...prev,
        ...user
      }));
      setActiveSection('profile');
    }
  }, [user]);

  const initializeGoogleSignIn = () => {
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });
    } catch (error) {
      console.error('Google Sign-In initialization failed:', error);
    }
  };

  const handleGoogleResponse = (response) => {
    setGoogleLoading(true);
    try {
      // Decode JWT token (in real app, send to backend for verification)
      const userData = JSON.parse(atob(response.credential.split('.')[1]));
      
      const googleUser = {
        id: userData.sub,
        name: userData.name,
        email: userData.email,
        avatar: userData.picture,
        loginMethod: 'google',
        points: 100, // Welcome bonus
        memberSince: new Date().toISOString()
      };

      onLogin(googleUser);
      showNotification('Đăng nhập Google thành công! 🎉', 'success');
    } catch (error) {
      console.error('Google sign-in error:', error);
      showNotification('Lỗi đăng nhập Google. Vui lòng thử lại.', 'error');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (window.google) {
      setGoogleLoading(true);
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          setGoogleLoading(false);
          showNotification('Popup Google bị chặn. Vui lòng cho phép popup.', 'warning');
        }
      });
    } else {
      showNotification('Google Sign-In chưa được tải. Vui lòng thử lại.', 'error');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!authData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(authData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!authData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (authData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!isLogin) {
      if (!authData.name) {
        newErrors.name = 'Họ tên là bắt buộc';
      }
      if (!authData.confirmPassword) {
        newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
      } else if (authData.password !== authData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu không khớp';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isLogin) {
        // Login logic
        const loginUser = {
          id: Math.random().toString(36).substr(2, 9),
          name: 'Demo User',
          email: authData.email,
          avatar: '',
          loginMethod: 'email',
          points: 250,
          memberSince: new Date().toISOString()
        };
        
        onLogin(loginUser);
        showNotification('Đăng nhập thành công! 🌸', 'success');
      } else {
        // Register logic
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          name: authData.name,
          email: authData.email,
          phone: authData.phone,
          avatar: '',
          loginMethod: 'email',
          points: 100, // Welcome bonus
          memberSince: new Date().toISOString()
        };
        
        onLogin(newUser);
        showNotification('Đăng ký thành công! Chào mừng bạn đến với KaKa Cosmetics! 🎉', 'success');
      }
    } catch (error) {
      showNotification('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    setActiveSection('login');
    setIsLogin(true);
    setAuthData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: ''
    });
    showNotification('Đã đăng xuất thành công!', 'success');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(''), 3000);
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...userInfo, ...updatedData };
    setUserInfo(updatedUser);
    onLogin(updatedUser); // Update parent state
    showNotification('Cập nhật thông tin thành công!', 'success');
  };

  // Navigation items for user dashboard
  const navItems = [
    {
      id: 'profile',
      icon: '👤',
      text: 'Thông tin cá nhân',
      section: 'TÀI KHOẢN'
    },
    {
      id: 'orders',
      icon: '📦',
      text: 'Đơn hàng của tôi',
      badge: '3',
      section: 'MUA SẮM'
    },
    {
      id: 'wishlist',
      icon: '💖',
      text: 'Sản phẩm yêu thích',
      section: 'MUA SẮM'
    },
    {
      id: 'points',
      icon: '⭐',
      text: 'Điểm tích lũy',
      section: 'THƯỞNG'
    },
    {
      id: 'addresses',
      icon: '📍',
      text: 'Sổ địa chỉ',
      section: 'TÙNG CHỈNH'
    },
    {
      id: 'notifications',
      icon: '🔔',
      text: 'Thông báo',
      section: 'TÙNG CHỈNH'
    },
    {
      id: 'security',
      icon: '🔒',
      text: 'Bảo mật',
      section: 'TÙNG CHỈNH'
    }
  ];

  if (user) {
    return (
      <>
        <Head>
          <title>Tài khoản - KaKa Cosmetics</title>
          <meta name="description" content="Quản lý tài khoản KaKa Cosmetics" />
        </Head>

        <div className={styles.accountContainer}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <div className={styles.userCard}>
                <div className={styles.avatar}>
                  {userInfo.avatar ? (
                    <img src={userInfo.avatar} alt="Avatar" />
                  ) : (
                    userInfo.name.charAt(0).toUpperCase()
                  )}
                </div>
                <h3 className={styles.userName}>{userInfo.name}</h3>
                <p className={styles.userEmail}>{userInfo.email}</p>
                <div className={styles.pointsBadge}>
                  ⭐ {userInfo.points} điểm
                </div>
              </div>
            </div>

            <nav className={styles.navMenu}>
              {/* Group navigation items by section */}
              {['TÀI KHOẢN', 'MUA SẮM', 'THƯỞNG', 'TÙNG CHỈNH'].map(section => (
                <div key={section} className={styles.navSection}>
                  <div className={styles.navSectionTitle}>{section}</div>
                  {navItems
                    .filter(item => item.section === section)
                    .map(item => (
                      <div
                        key={item.id}
                        className={`${styles.navItem} ${activeSection === item.id ? styles.active : ''}`}
                        onClick={() => setActiveSection(item.id)}
                      >
                        <span className={styles.icon}>{item.icon}</span>
                        <span className={styles.text}>{item.text}</span>
                        {item.badge && <span className={styles.badge}>{item.badge}</span>}
                      </div>
                    ))}
                </div>
              ))}
            </nav>

            <div className={styles.backToHomeSidebar}>
              <Link href="/" className={styles.link}>
                🏠 Về trang chủ
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            <div className={styles.contentHeader}>
              <h1 className={styles.contentTitle}>
                {navItems.find(item => item.id === activeSection)?.text || 'Tài khoản'}
              </h1>
              <p className={styles.contentSubtitle}>
                Quản lý thông tin và cài đặt tài khoản của bạn
              </p>
            </div>

            {/* Profile Section */}
            {activeSection === 'profile' && (
              <ProfileSection userInfo={userInfo} onUpdate={updateProfile} />
            )}

            {/* Orders Section */}
            {activeSection === 'orders' && (
              <OrdersSection />
            )}

            {/* Other sections can be implemented similarly */}
            {activeSection === 'wishlist' && (
              <div className={styles.contentSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Sản phẩm yêu thích</h2>
                  <p className={styles.sectionDescription}>Danh sách các sản phẩm bạn đã lưu</p>
                </div>
                <p>Chức năng đang được phát triển...</p>
              </div>
            )}

            {activeSection === 'points' && (
              <PointsSection userInfo={userInfo} />
            )}

            {/* Logout Section */}
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Đăng xuất</h2>
                <p className={styles.sectionDescription}>Thoát khỏi tài khoản hiện tại</p>
              </div>
              <button 
                className={`${styles.btn} ${styles['btn-danger']}`}
                onClick={handleLogout}
              >
                🚪 Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`${styles.notification} ${styles.show} ${notification.type === 'error' ? styles.error : ''}`}>
            <span>{notification.type === 'success' ? '✅' : '❌'}</span>
            {notification.message}
          </div>
        )}
      </>
    );
  }

  // Login/Register Form
  return (
    <>
      <Head>
        <title>{isLogin ? 'Đăng nhập' : 'Đăng ký'} - KaKa Cosmetics</title>
        <meta name="description" content={`${isLogin ? 'Đăng nhập' : 'Đăng ký'} tài khoản KaKa Cosmetics`} />
      </Head>

      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setIsGoogleScriptLoaded(true)}
      />

      <div className={`${styles.authContainer} ${styles['with-bg-pattern']}`}>
        <Link href="/" className={styles.backToHomeBtn}>
          🏠 Về trang chủ
        </Link>

        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <div className={styles.authLogo}>
              🌸
            </div>
            <h1 className={styles.authTitle}>
              {isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
            </h1>
            <p className={styles.authSubtitle}>
              {isLogin ? 'Đăng nhập để tiếp tục mua sắm' : 'Đăng ký để nhận ưu đãi độc quyền'}
            </p>
          </div>

          <form className={styles.authForm} onSubmit={handleSubmit}>
            {!isLogin && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Họ và tên</label>
                <input
                  type="text"
                  className={`${styles.formInput} ${errors.name ? styles.error : ''}`}
                  value={authData.name}
                  onChange={(e) => setAuthData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập họ và tên"
                />
                {errors.name && <div className={styles['error-message']}>⚠️ {errors.name}</div>}
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input
                type="email"
                className={`${styles.formInput} ${errors.email ? styles.error : ''}`}
                value={authData.email}
                onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Nhập địa chỉ email"
              />
              {errors.email && <div className={styles['error-message']}>⚠️ {errors.email}</div>}
            </div>

            {!isLogin && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Số điện thoại</label>
                <input
                  type="tel"
                  className={styles.formInput}
                  value={authData.phone}
                  onChange={(e) => setAuthData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Mật khẩu</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.formInput} ${errors.password ? styles.error : ''}`}
                  value={authData.password}
                  onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <div className={styles['error-message']}>⚠️ {errors.password}</div>}
            </div>

            {!isLogin && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Xác nhận mật khẩu</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`${styles.formInput} ${errors.confirmPassword ? styles.error : ''}`}
                    value={authData.confirmPassword}
                    onChange={(e) => setAuthData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Nhập lại mật khẩu"
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.confirmPassword && <div className={styles['error-message']}>⚠️ {errors.confirmPassword}</div>}
              </div>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className={styles.loadingSpinner}></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  {isLogin ? '🔐 Đăng nhập' : '✨ Tạo tài khoản'}
                </>
              )}
            </button>
          </form>

          {/* Google OAuth */}
          <div className={styles.googleAuthSection}>
            <div className={styles.googleTitle}>
              Hoặc {isLogin ? 'đăng nhập' : 'đăng ký'} với
            </div>
            <button
              type="button"
              className={`${styles.googleBtn} ${googleLoading ? styles['oauth-loading'] : ''}`}
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <>
                  <div className={styles.loadingSpinner}></div>
                  <span className={styles.googleText}>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <div className={styles.googleIcon}></div>
                  <span className={styles.googleText}>Google</span>
                </>
              )}
            </button>
          </div>

          {/* Toggle between login/register */}
          <div className={styles.authToggle}>
            <p className={styles.text}>
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            </p>
            <button
              type="button"
              className={styles.button}
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setAuthData({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  name: '',
                  phone: ''
                });
              }}
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`${styles.notification} ${styles.show} ${notification.type === 'error' ? styles.error : notification.type === 'warning' ? styles.warning : ''}`}>
            <span>
              {notification.type === 'success' ? '✅' : notification.type === 'warning' ? '⚠️' : '❌'}
            </span>
            {notification.message}
          </div>
        )}
      </div>
    </>
  );
}

// Profile Management Component
function ProfileSection({ userInfo, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(userInfo);

  const handleSave = () => {
    onUpdate(formData);
    setEditMode(false);
  };

  return (
    <div className={styles.contentSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Thông tin cá nhân</h2>
        <p className={styles.sectionDescription}>Quản lý thông tin tài khoản và cài đặt</p>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Họ và tên</label>
          <input
            type="text"
            className={styles.formInput}
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            disabled={!editMode}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Email</label>
          <input
            type="email"
            className={styles.formInput}
            value={formData.email}
            disabled={true}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Số điện thoại</label>
          <input
            type="tel"
            className={styles.formInput}
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            disabled={!editMode}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Giới tính</label>
          <select
            className={styles.formInput}
            value={formData.gender}
            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
            disabled={!editMode}
          >
            <option value="female">Nữ</option>
            <option value="male">Nam</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Ngày sinh</label>
          <input
            type="date"
            className={styles.formInput}
            value={formData.birthDate}
            onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
            disabled={!editMode}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Địa chỉ</label>
          <input
            type="text"
            className={styles.formInput}
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            disabled={!editMode}
            placeholder="Nhập địa chỉ"
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        {editMode ? (
          <>
            <button 
              className={`${styles.btn} ${styles['btn-primary']}`}
              onClick={handleSave}
            >
              💾 Lưu thay đổi
            </button>
            <button 
              className={`${styles.btn} ${styles['btn-secondary']}`}
              onClick={() => {
                setEditMode(false);
                setFormData(userInfo);
              }}
            >
              ❌ Hủy
            </button>
          </>
        ) : (
          <button 
            className={`${styles.btn} ${styles['btn-primary']}`}
            onClick={() => setEditMode(true)}
          >
            ✏️ Chỉnh sửa
          </button>
        )}
      </div>
    </div>
  );
}

// Orders Section Component
function OrdersSection() {
  const orders = [
    {
      id: 'ORD001',
      date: '2025-10-01',
      total: '1.299.000₫',
      status: 'delivered',
      items: 3
    },
    {
      id: 'ORD002', 
      date: '2025-09-28',
      total: '899.000₫',
      status: 'shipping',
      items: 2
    },
    {
      id: 'ORD003',
      date: '2025-09-25', 
      total: '599.000₫',
      status: 'processing',
      items: 1
    }
  ];

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return '✅ Đã giao';
      case 'shipping': return '🚚 Đang giao';
      case 'processing': return '⏳ Đang xử lý';
      default: return status;
    }
  };

  return (
    <div className={styles.contentSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Đơn hàng của tôi</h2>
        <p className={styles.sectionDescription}>Theo dõi tình trạng đơn hàng</p>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {orders.map(order => (
          <div key={order.id} style={{
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>#{order.id}</h4>
              <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                📅 {new Date(order.date).toLocaleDateString('vi-VN')}
              </p>
              <p style={{ margin: '0', color: '#666' }}>
                📦 {order.items} sản phẩm
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', fontSize: '1.1rem' }}>
                {order.total}
              </p>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '500',
                background: order.status === 'delivered' ? '#e8f5e8' : 
                           order.status === 'shipping' ? '#e3f2fd' : '#fff3e0',
                color: order.status === 'delivered' ? '#2e7d32' :
                       order.status === 'shipping' ? '#1976d2' : '#f57c00'
              }}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Points Section Component
function PointsSection({ userInfo }) {
  const pointsHistory = [
    { date: '2025-10-01', action: 'Mua hàng', points: '+50', total: userInfo.points },
    { date: '2025-09-28', action: 'Đánh giá sản phẩm', points: '+10', total: userInfo.points - 50 },
    { date: '2025-09-25', action: 'Giới thiệu bạn bè', points: '+100', total: userInfo.points - 60 },
    { date: '2025-09-20', action: 'Đăng ký tài khoản', points: '+100', total: userInfo.points - 160 }
  ];

  return (
    <div className={styles.contentSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Điểm tích lũy</h2>
        <p className={styles.sectionDescription}>Theo dõi và sử dụng điểm thưởng</p>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #ff6b9d 0%, #9c27b0 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
          ⭐ {userInfo.points} điểm
        </h3>
        <p style={{ margin: '0', opacity: '0.9' }}>
          Điểm có thể sử dụng
        </p>
      </div>

      <div>
        <h4 style={{ marginBottom: '1rem' }}>Lịch sử điểm</h4>
        {pointsHistory.map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 0',
            borderBottom: index < pointsHistory.length - 1 ? '1px solid #e0e0e0' : 'none'
          }}>
            <div>
              <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>
                {item.action}
              </p>
              <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                {new Date(item.date).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{
                margin: '0',
                fontWeight: '600',
                color: item.points.startsWith('+') ? '#4caf50' : '#f44336'
              }}>
                {item.points}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}