import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/taikhoan.module.css';
import {
  User,
  Package,
  LogOut,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
} from 'lucide-react';
import { getAuthToken } from '../../lib/authToken';

const AccountOrdersPage = () => {
  const router = useRouter();

  // User info for sidebar
  const [userInfo, setUserInfo] = useState({
    username: '',
    displayName: '',
    email: '',
    avatar: '',
  });

  const [loadingUser, setLoadingUser] = useState(true);

  // Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ===== LOAD USER =====
  const loadUserData = async () => {
    try {
      setLoadingUser(true);
      const token = getAuthToken();
      if (!token) {
        setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
        setLoadingUser(false);
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: token,
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
        setUserInfo({
          username: data.user.username || '',
          displayName: data.user.displayName || '',
          email: data.user.email || '',
          avatar: data.user.avatar || '/images/default-avatar.png',
        });
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError(err.message || 'Lỗi khi tải thông tin người dùng');
    } finally {
      setLoadingUser(false);
    }
  };

  // ===== LOAD ORDERS =====
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
          Authorization: token,
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

  useEffect(() => {
    loadUserData();
    loadOrdersData();
  }, []);

  // ===== LOGOUT =====
  const handleLogout = async () => {
    try {
      const token = getAuthToken();

      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  // ===== SIDEBAR =====
  const menuItems = [
    {
      id: 'profile',
      label: 'Thông Tin Cá Nhân',
      icon: <User size={20} />,
    },
    {
      id: 'tracking',
      label: 'Đơn Hàng Của Tôi',
      icon: <Package size={20} />,
    },
    {
      id: 'addresses',
      label: 'Sổ Địa Chỉ',
      icon: <MapPin size={20} />,
    },
    {
      id: 'logout',
      label: 'Đăng Xuất',
      icon: <LogOut size={20} />,
      action: 'logout',
      isDanger: true,
    },
  ];

  const currentMenu = 'tracking';

  if (loadingUser && !userInfo.username) {
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
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.avatarSection}>
              <img
                src={userInfo.avatar || '/images/default-avatar.png'}
                alt="Avatar"
                className={styles.avatar}
              />
              <div className={styles.userInfo}>
                <h3>{userInfo.displayName || userInfo.username}</h3>
                <p>{userInfo.email}</p>
              </div>
            </div>
          </div>

          <nav className={styles.sidebarNav}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`${styles.menuItem} ${
                  currentMenu === item.id ? styles.active : ''
                } ${item.isDanger ? styles.danger : ''}`}
                onClick={() => {
                  if (item.action === 'logout') {
                    handleLogout();
                  } else {
                    if (item.id === 'profile') router.push('/taikhoan');
                    if (item.id === 'tracking') router.push('/taikhoan/orders');
                    if (item.id === 'addresses')
                      router.push('/taikhoan/addresses');
                  }
                }}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <span className={styles.menuLabel}>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.mainContent}>
          {error && (
            <div className={styles.errorMessage}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}

          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h1>Đơn Hàng Của Tôi</h1>
              <span className={styles.orderCount}>{orders.length} đơn hàng</span>
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
                  <div key={order.id} className={styles.orderCard}
                      onClick={() => router.push(`/taikhoan/orders/${order.id}`)}
                      style={{ cursor: 'pointer' }} 
                      >
                    {/* Header */}
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
                            minute: '2-digit',
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

                    {/* Body */}
                    <div className={styles.orderBody}>
                      <div className={styles.orderSummary}>
                        <div className={styles.summaryItem}>
                          <span className={styles.label}>Số sản phẩm:</span>
                          <span className={styles.value}>
                            {order.productCount} sản phẩm
                          </span>
                        </div>
                        <div className={styles.summaryItem}>
                          <span className={styles.label}>Tổng tiền hàng:</span>
                          <span className={styles.value}>
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(order.subtotal)}
                          </span>
                        </div>
                        {order.shippingFee > 0 && (
                          <div className={styles.summaryItem}>
                            <span className={styles.label}>Phí vận chuyển:</span>
                            <span className={styles.value}>
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(order.shippingFee)}
                            </span>
                          </div>
                        )}
                        {order.discount > 0 && (
                          <div className={styles.summaryItem}>
                            <span className={styles.label}>Giảm giá:</span>
                            <span
                              className={`${styles.value} ${styles.discount}`}
                            >
                              -
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(order.discount)}
                            </span>
                          </div>
                        )}
                        <div
                          className={`${styles.summaryItem} ${styles.total}`}
                        >
                          <span className={styles.label}>Tổng thanh toán:</span>
                          <span className={styles.value}>
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* Shipping info */}
                      <div className={styles.shippingInfo}>
                        <h4>
                          <Clock size={16} />
                          Thông tin giao hàng
                        </h4>
                        <p>
                          <strong>{order.shippingInfo.name}</strong>
                        </p>
                        <p>{order.shippingInfo.phone}</p>
                        <p className={styles.address}>
                          {order.shippingInfo.fullAddress}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className={styles.orderFooter}>
                      <div className={styles.paymentMethod}>
                        <CreditCard size={14} />
                        {order.paymentMethod === 'COD'
                          }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountOrdersPage;
