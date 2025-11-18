// src/pages/taikhoan.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/taikhoan.module.css';
// Import modern SVG icons from lucide-react
import { 
  User, 
  Package, 
  ShoppingCart, 
  LogOut,
  Edit2,
  Save,
  X,
  Mail,
  Calendar,
  MapPin,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
  Clock,
  CreditCard,
  TruckIcon as Truck,
  CheckCircle2
} from 'lucide-react';

const TaikhoanPage = () => {
  const router = useRouter();
  
  // Active menu state
  const [activeMenu, setActiveMenu] = useState('profile');
  
  // Form data
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    avatar: '',
    firstName: '',
    lastName: '',
    role: 'Customer'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Cart states
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  
  // Orders states
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // Get auth token with Bearer prefix
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      let token = localStorage.getItem('authToken');
      
      if (!token) {
        console.warn('⚠️ No token found in localStorage');
        return null;
      }
      
      // Auto-fix: Add Bearer prefix if missing
      if (!token.startsWith('Bearer ')) {
        token = `Bearer ${token}`;
        localStorage.setItem('authToken', token);
      }
      
      return token;
    }
    return null;
  };

  // Load user data from API /api/auth/me
  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      
      if (!token) {
        setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
        setLoading(false);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        return;
      }

      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/login');
          return;
        }
        throw new Error('Không thể tải thông tin người dùng');
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        setFormData({
          username: data.user.username || '',
          displayName: data.user.displayName || '',
          email: data.user.email || '',
          avatar: data.user.avatar || '/images/default-avatar.png',
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          role: data.user.role || 'Customer'
        });
      }

    } catch (err) {
      console.error('Error loading user data:', err);
      setError(err.message || 'Lỗi khi tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Load orders data from API
  const loadOrdersData = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);

      const token = getAuthToken();
      
      if (!token) {
        setOrdersError('Bạn chưa đăng nhập.');
        return;
      }

      const response = await fetch('/api/orders/my-orders', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách đơn hàng');
      }

      const data = await response.json();
      
      if (data.success && data.orders) {
        setOrders(data.orders);
      }

    } catch (err) {
      console.error('Error loading orders:', err);
      setOrdersError(err.message || 'Lỗi khi tải danh sách đơn hàng');
    } finally {
      setOrdersLoading(false);
    }
  };

  // Load cart data from localStorage
  const loadCartData = () => {
    try {
      setCartLoading(true);
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('cosmetic_cart');
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          setCartItems(cartData);
        } else {
          setCartItems([]);
        }
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  };

  // Update cart quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cosmetic_cart', JSON.stringify(updatedCart));
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cosmetic_cart', JSON.stringify(updatedCart));
  };

  // Calculate cart total
  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Load data on mount
  useEffect(() => {
    loadUserData();
    loadCartData();
    loadOrdersData();
  }, []);

  // Reload cart when activeMenu changes to 'cart'
  useEffect(() => {
    if (activeMenu === 'cart') {
      loadCartData();
    }
  }, [activeMenu]);

  // Reload orders when activeMenu changes to 'tracking'
  useEffect(() => {
    if (activeMenu === 'tracking') {
      loadOrdersData();
    }
  }, [activeMenu]);

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle edit mode
  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  // Handle save changes
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const token = getAuthToken();
      
      if (!token) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }
      
      const updateData = {
        displayName: formData.displayName,
        firstName: formData.firstName,
        lastName: formData.lastName
      };

      const response = await fetch('/api/user/updateProfile', {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật thông tin');
      }

      const data = await response.json();
      
      if (data.success) {
        setIsEditing(false);
        setSuccess('Cập nhật thông tin thành công!');
        setTimeout(() => setSuccess(null), 3000);
      }

    } catch (err) {
      console.error('Error saving changes:', err);
      setError(err.message || 'Lỗi khi lưu thay đổi');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    loadUserData(); // Reload original data
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = getAuthToken();
      
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });
      
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Redirect to login
      router.push('/login');
      
    } catch (err) {
      console.error('Logout error:', err);
      // Still logout locally even if API fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  // Menu items with modern icons
  const menuItems = [
    {
      id: 'profile',
      label: 'Thông Tin Cá Nhân',
      icon: <User size={20} />,
      content: 'profile'
    },
    {
      id: 'tracking',
      label: 'Đơn Hàng Của Tôi',
      icon: <Package size={20} />,
      content: 'tracking'
    },
    {
      id: 'cart',
      label: 'Giỏ Hàng',
      icon: <ShoppingCart size={20} />,
      content: 'cart'
    },
    {
      id: 'logout',
      label: 'Đăng Xuất',
      icon: <LogOut size={20} />,
      action: 'logout',
      isDanger: true
    }
  ];

  if (loading && !formData.username) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.accountContainer}>
        
        {/* SIDEBAR MENU */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.avatarSection}>
              <img 
                src={formData.avatar} 
                alt="Avatar" 
                className={styles.avatar}
              />
              <div className={styles.userInfo}>
                <h3>{formData.displayName || formData.username}</h3>
                <p>{formData.email}</p>
              </div>
            </div>
          </div>

          <nav className={styles.sidebarNav}>
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`${styles.menuItem} ${activeMenu === item.id ? styles.active : ''} ${item.isDanger ? styles.danger : ''}`}
                onClick={() => {
                  if (item.action === 'logout') {
                    handleLogout();
                  } else {
                    setActiveMenu(item.id);
                  }
                }}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <span className={styles.menuLabel}>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className={styles.mainContent}>
          
          {/* Error/Success Messages */}
          {error && (
            <div className={styles.errorMessage}>
              <X size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              <Save size={16} />
              <span>{success}</span>
            </div>
          )}

          {/* PROFILE VIEW */}
          {activeMenu === 'profile' && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h1>Thông Tin Cá Nhân</h1>
                {!isEditing && (
                  <button className={styles.editButton} onClick={handleEdit}>
                    <Edit2 size={16} />
                    Chỉnh sửa
                  </button>
                )}
              </div>

              <div className={styles.profileCard}>
                <div className={styles.formGroup}>
                  <label>
                    <User size={16} />
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    readOnly
                    className={styles.inputReadonly}
                  />
                  <small>Không thể thay đổi</small>
                </div>

                <div className={styles.formGroup}>
                  <label>
                    <Mail size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className={styles.inputReadonly}
                  />
                  <small>Email từ Google / Đăng ký</small>
                </div>

                <div className={styles.formGroup}>
                  <label>
                    <User size={16} />
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    readOnly={!isEditing}
                    className={isEditing ? styles.inputEditable : styles.inputReadonly}
                    placeholder="Nhập tên hiển thị"
                  />
                  <small>Tên này sẽ hiển thị công khai</small>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Họ</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      readOnly={!isEditing}
                      className={isEditing ? styles.inputEditable : styles.inputReadonly}
                      placeholder="Nhập họ"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tên</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      readOnly={!isEditing}
                      className={isEditing ? styles.inputEditable : styles.inputReadonly}
                      placeholder="Nhập tên"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className={styles.buttonGroup}>
                    <button 
                      className={styles.saveButton} 
                      onClick={handleSave}
                      disabled={loading}
                    >
                      <Save size={16} />
                      {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button 
                      className={styles.cancelButton} 
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      <X size={16} />
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ORDER TRACKING VIEW */}
          {activeMenu === 'tracking' && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h1>Đơn Hàng Của Tôi</h1>
                <span className={styles.orderCount}>
                  {orders.length} đơn hàng
                </span>
              </div>

              {ordersLoading ? (
                <div className={styles.ordersLoading}>
                  <div className={styles.spinner}></div>
                  <p>Đang tải danh sách đơn hàng...</p>
                </div>
              ) : ordersError ? (
                <div className={styles.ordersError}>
                  <AlertCircle size={48} className={styles.errorIcon} />
                  <h3>Không thể tải danh sách đơn hàng</h3>
                  <p>{ordersError}</p>
                  <button onClick={loadOrdersData} className={styles.retryButton}>
                    Thử lại
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div className={styles.emptyOrders}>
                  <Package size={64} className={styles.emptyIcon} />
                  <h3>Chưa có đơn hàng nào</h3>
                  <p>Bạn chưa đặt đơn hàng nào. Hãy mua sắm ngay!</p>
                  <Link href="/" className={styles.shopNowButton}>
                    Mua sắm ngay
                  </Link>
                </div>
              ) : (
                <div className={styles.ordersList}>
                  {orders.map((order) => (
                    <div key={order.id} className={styles.orderCard}>
                      {/* Order Header */}
                      <div className={styles.orderHeader}>
                        <div className={styles.orderInfo}>
                          <h3 className={styles.orderId}>
                            <Package size={18} />
                            {order.orderId}
                          </h3>
                          <p className={styles.orderDate}>
                            <Clock size={14} />
                            {new Date(order.createdAt).toLocaleString('vi-VN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div 
                          className={styles.orderStatus}
                          style={{ backgroundColor: order.statusColor }}
                        >
                          {order.statusText}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className={styles.orderBody}>
                        <div className={styles.orderSummary}>
                          <div className={styles.summaryItem}>
                            <span className={styles.label}>Số sản phẩm:</span>
                            <span className={styles.value}>{order.productCount} sản phẩm</span>
                          </div>
                          <div className={styles.summaryItem}>
                            <span className={styles.label}>Tổng tiền hàng:</span>
                            <span className={styles.value}>
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                              }).format(order.subtotal)}
                            </span>
                          </div>
                          {order.shippingFee > 0 && (
                            <div className={styles.summaryItem}>
                              <span className={styles.label}>Phí vận chuyển:</span>
                              <span className={styles.value}>
                                {new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                                }).format(order.shippingFee)}
                              </span>
                            </div>
                          )}
                          {order.discount > 0 && (
                            <div className={styles.summaryItem}>
                              <span className={styles.label}>Giảm giá:</span>
                              <span className={`${styles.value} ${styles.discount}`}>
                                -{new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                                }).format(order.discount)}
                              </span>
                            </div>
                          )}
                          <div className={`${styles.summaryItem} ${styles.total}`}>
                            <span className={styles.label}>Tổng thanh toán:</span>
                            <span className={styles.value}>
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                              }).format(order.total)}
                            </span>
                          </div>
                        </div>

                        {/* Shipping Info */}
                        <div className={styles.shippingInfo}>
                          <h4>
                            <Truck size={16} />
                            Thông tin giao hàng
                          </h4>
                          <p><strong>{order.shippingInfo.name}</strong></p>
                          <p>{order.shippingInfo.phone}</p>
                          <p className={styles.address}>{order.shippingInfo.fullAddress}</p>
                        </div>
                      </div>

                      {/* Order Footer */}
                      <div className={styles.orderFooter}>
                        <div className={styles.paymentMethod}>
                          <CreditCard size={14} />
                          {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 
                           order.paymentMethod === 'banking' ? 'Chuyển khoản ngân hàng' :
                           order.paymentMethod === 'momo' ? 'Ví MoMo' : 'Khác'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CART VIEW */}
          {activeMenu === 'cart' && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h1>Giỏ Hàng Của Tôi</h1>
                <span className={styles.cartCount}>
                  {cartItems.length} sản phẩm
                </span>
              </div>

              {cartLoading ? (
                <div className={styles.cartLoading}>
                  <div className={styles.spinner}></div>
                  <p>Đang tải giỏ hàng...</p>
                </div>
              ) : cartItems.length === 0 ? (
                <div className={styles.emptyCart}>
                  <ShoppingCart size={64} className={styles.emptyIcon} />
                  <h3>Giỏ hàng trống</h3>
                  <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                  <Link href="/" className={styles.shopNowButton}>
                    Mua sắm ngay
                  </Link>
                </div>
              ) : (
                <div className={styles.cartContent}>
                  <div className={styles.cartItems}>
                    {cartItems.map((item) => (
                      <div key={item.id} className={styles.cartItem}>
                        <div className={styles.itemImage}>
                          <img 
                            src={item.image || '/images/default-product.png'} 
                            alt={item.name}
                            onError={(e) => { e.target.src = '/images/default-product.png'; }}
                          />
                        </div>
                        
                        <div className={styles.itemDetails}>
                          <h4>{item.name}</h4>
                          {item.variant && (
                            <p className={styles.itemVariant}>{item.variant}</p>
                          )}
                          <p className={styles.itemPrice}>
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(item.price)}
                          </p>
                        </div>

                        <div className={styles.itemQuantity}>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className={styles.qtyButton}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className={styles.qtyValue}>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className={styles.qtyButton}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className={styles.itemTotal}>
                          <p className={styles.itemTotalPrice}>
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(item.price * item.quantity)}
                          </p>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className={styles.removeButton}
                          >
                            <Trash2 size={16} />
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.cartSummary}>
                    <h3>Tổng Cộng</h3>
                    <div className={styles.summaryRow}>
                      <span>Tạm tính:</span>
                      <span className={styles.summaryValue}>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(calculateCartTotal())}
                      </span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Phí vận chuyển:</span>
                      <span className={styles.summaryValue}>Tính khi thanh toán</span>
                    </div>
                    <div className={styles.summaryTotal}>
                      <span>Tổng cộng:</span>
                      <span className={styles.totalValue}>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(calculateCartTotal())}
                      </span>
                    </div>
                    <Link href="/giohang" className={styles.checkoutButton}>
                      Tiến hành thanh toán
                    </Link>
                    <p className={styles.cartNote}>
                      <AlertCircle size={14} />
                      Giá cuối cùng sẽ được xác nhận khi thanh toán
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default TaikhoanPage;
