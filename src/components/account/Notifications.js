import { useState, useEffect } from 'react';
import styles from '../../styles/login.module.css';

const Notifications = ({ user, updateUser, showNotification }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read, promotion, order, system
  const [settings, setSettings] = useState({
    emailNotifications: user?.profile?.preferences?.emailNotifications || true,
    smsNotifications: user?.profile?.preferences?.smsNotifications || false,
    promotionalEmails: user?.profile?.preferences?.promotionalEmails || true,
    orderUpdates: user?.profile?.preferences?.orderUpdates || true,
    newProductAlerts: user?.profile?.preferences?.newProductAlerts || false,
    priceDropAlerts: user?.profile?.preferences?.priceDropAlerts || true
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập tải danh sách thông báo
    const loadNotifications = async () => {
      setIsLoading(true);
      try {
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dữ liệu giả lập
        const mockNotifications = [
          {
            id: 'notif_1',
            type: 'order',
            title: 'Đơn hàng #ORD003 đã được xác nhận',
            message: 'Đơn hàng của bạn đang được chuẩn bị và sẽ được giao trong 2-3 ngày tới.',
            timestamp: '2024-01-25T14:30:00Z',
            isRead: false,
            action: {
              type: 'link',
              label: 'Xem đơn hàng',
              url: '/account/orders'
            }
          },
          {
            id: 'notif_2',
            type: 'promotion',
            title: '🎉 Giảm giá 20% toàn bộ son môi!',
            message: 'Nhanh tay sở hữu các cây son yêu thích với giá ưu đãi. Áp dụng đến hết ngày 31/01.',
            timestamp: '2024-01-24T09:15:00Z',
            isRead: false,
            action: {
              type: 'link',
              label: 'Mua ngay',
              url: '/products/lipstick'
            }
          },
          {
            id: 'notif_3',
            type: 'order',
            title: 'Đơn hàng #ORD002 đã được giao thành công',
            message: 'Đơn hàng của bạn đã được giao thành công. Cảm ơn bạn đã tin tưởng mua sắm tại KaKa Cosmetics!',
            timestamp: '2024-01-20T16:45:00Z',
            isRead: true,
            action: {
              type: 'rate',
              label: 'Đánh giá sản phẩm',
              orderId: 'ORD002'
            }
          },
          {
            id: 'notif_4',
            type: 'system',
            title: 'Cập nhật chính sách bảo mật',
            message: 'Chúng tôi đã cập nhật chính sách bảo mật để bảo vệ quyền riêng tư của bạn tốt hơn.',
            timestamp: '2024-01-18T11:20:00Z',
            isRead: true,
            action: {
              type: 'link',
              label: 'Xem chi tiết',
              url: '/privacy-policy'
            }
          },
          {
            id: 'notif_5',
            type: 'promotion',
            title: 'Sản phẩm yêu thích giảm giá!',
            message: '"Tinh chất Retinol Chống lão hóa" trong danh sách yêu thích của bạn đang giảm giá 15%.',
            timestamp: '2024-01-15T08:30:00Z',
            isRead: true,
            action: {
              type: 'link',
              label: 'Mua ngay',
              url: '/products/retinol-serum'
            }
          }
        ];

        setNotifications(mockNotifications);
      } catch (error) {
        showNotification('Không thể tải thông báo', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return '📦';
      case 'promotion': return '🎉';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'order': return 'Đơn hàng';
      case 'promotion': return 'Khuyến mãi';
      case 'system': return 'Hệ thống';
      default: return 'Thông báo';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread': return !notif.isRead;
      case 'read': return notif.isRead;
      case 'promotion': return notif.type === 'promotion';
      case 'order': return notif.type === 'order';
      case 'system': return notif.type === 'system';
      default: return true;
    }
  });

  const handleMarkAsRead = async (notificationId) => {
    try {
      setNotifications(notifications.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      ));
      showNotification('Đã đánh dấu là đã đọc', 'success');
    } catch (error) {
      showNotification('Có lỗi xảy ra', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
      showNotification('Đã đánh dấu tất cả là đã đọc', 'success');
    } catch (error) {
      showNotification('Có lỗi xảy ra', 'error');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
      showNotification('Đã xóa thông báo', 'success');
    } catch (error) {
      showNotification('Có lỗi xảy ra', 'error');
    }
  };

  const handleSettingChange = async (setting, value) => {
    try {
      const newSettings = { ...settings, [setting]: value };
      setSettings(newSettings);
      
      await updateUser({
        profile: {
          ...user?.profile,
          preferences: {
            ...user?.profile?.preferences,
            ...newSettings
          }
        }
      });
      
      showNotification('Cập nhật cài đặt thành công', 'success');
    } catch (error) {
      showNotification('Có lỗi xảy ra', 'error');
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className={styles.contentHeader}>
          <h1 className={styles.contentTitle}>Thông báo</h1>
          <p className={styles.contentSubtitle}>Đang tải...</p>
        </div>
        <div className={styles.contentSection} style={{ textAlign: 'center', padding: '3rem' }}>
          <div className={styles.loadingSpinner} style={{ margin: '0 auto', width: '40px', height: '40px' }}></div>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Thông báo ({unreadCount} chưa đọc)</h1>
        <p className={styles.contentSubtitle}>Theo dõi các thông báo mới nhất từ KaKa Cosmetics</p>
      </div>

      {/* Cài đặt thông báo */}
      <div className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>⚙️ Cài đặt thông báo</h2>
          <p className={styles.sectionDescription}>Tùy chỉnh cách thức nhận thông báo</p>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              />
              📧 Thông báo qua Email
            </label>
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
              />
              📱 Thông báo qua SMS
            </label>
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.promotionalEmails}
                onChange={(e) => handleSettingChange('promotionalEmails', e.target.checked)}
              />
              🎉 Email khuyến mãi
            </label>
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.orderUpdates}
                onChange={(e) => handleSettingChange('orderUpdates', e.target.checked)}
              />
              📦 Cập nhật đơn hàng
            </label>
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.newProductAlerts}
                onChange={(e) => handleSettingChange('newProductAlerts', e.target.checked)}
              />
              🆕 Thông báo sản phẩm mới
            </label>
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.priceDropAlerts}
                onChange={(e) => handleSettingChange('priceDropAlerts', e.target.checked)}
              />
              📉 Cảnh báo giảm giá
            </label>
          </div>
        </div>
      </div>

      {/* Bộ lọc và điều khiển */}
      <div className={styles.contentSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilter('all')}
              className={`${styles.btn} ${filter === 'all' ? styles['btn-primary'] : styles['btn-secondary']}`}
              style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`${styles.btn} ${filter === 'unread' ? styles['btn-primary'] : styles['btn-secondary']}`}
              style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
            >
              Chưa đọc ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('order')}
              className={`${styles.btn} ${filter === 'order' ? styles['btn-primary'] : styles['btn-secondary']}`}
              style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
            >
              📦 Đơn hàng
            </button>
            <button
              onClick={() => setFilter('promotion')}
              className={`${styles.btn} ${filter === 'promotion' ? styles['btn-primary'] : styles['btn-secondary']}`}
              style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
            >
              🎉 Khuyến mãi
            </button>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className={`${styles.btn} ${styles['btn-success']}`}
              style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
            >
              ✓ Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>
      </div>

      {/* Danh sách thông báo */}
      {filteredNotifications.length > 0 ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredNotifications.map((notification) => (
            <div key={notification.id} style={{
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              padding: '1.5rem',
              background: notification.isRead ? 'white' : 'linear-gradient(135deg, rgba(255, 107, 157, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)',
              position: 'relative'
            }}>
              {/* Badge chưa đọc */}
              {!notification.isRead && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '8px',
                  height: '8px',
                  background: '#ff6b9d',
                  borderRadius: '50%'
                }}></div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: '0', fontSize: '1rem', fontWeight: '600' }}>
                      {notification.title}
                    </h3>
                    <span style={{
                      background: '#f0f0f0',
                      color: '#666',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '25px',
                      fontSize: '0.7rem',
                      fontWeight: '500'
                    }}>
                      {getTypeLabel(notification.type)}
                    </span>
                  </div>
                  
                  <p style={{ margin: '0 0 0.75rem 0', color: '#666', lineHeight: '1.5' }}>
                    {notification.message}
                  </p>
                  
                  <p style={{ margin: '0', color: '#999', fontSize: '0.85rem' }}>
                    {new Date(notification.timestamp).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* Hành động */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
                {notification.action && (
                  <button
                    onClick={() => {
                      if (notification.action.type === 'link') {
                        window.location.href = notification.action.url;
                      } else if (notification.action.type === 'rate') {
                        showNotification('Tính năng đánh giá sẽ được phát triển', 'warning');
                      }
                    }}
                    className={`${styles.btn} ${styles['btn-primary']}`}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    {notification.action.label}
                  </button>
                )}
                
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className={`${styles.btn} ${styles['btn-secondary']}`}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    ✓ Đánh dấu đã đọc
                  </button>
                )}
                
                <button
                  onClick={() => handleDeleteNotification(notification.id)}
                  className={`${styles.btn} ${styles['btn-danger']}`}
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.contentSection} style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔔</div>
          <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>
            {filter === 'all' ? 'Chưa có thông báo nào' : `Không có thông báo ${getTypeLabel(filter).toLowerCase()}`}
          </h3>
          <p style={{ color: '#999' }}>
            {filter === 'all' 
              ? 'Các thông báo mới sẽ xuất hiện ở đây' 
              : `Chưa có thông báo nào với bộ lọc hiện tại`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;