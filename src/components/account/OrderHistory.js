import { useState, useEffect } from 'react';
import styles from '../../styles/login.module.css';

const OrderHistory = ({ user, showNotification }) => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, shipped, delivered, cancelled
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập tải danh sách đơn hàng
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dữ liệu giả lập
        const mockOrders = [
          {
            id: 'ORD001',
            orderDate: '2024-01-15',
            status: 'delivered',
            total: 350000,
            items: [
              { id: 1, name: 'Kem dưỡng ẩm Vitamin C', price: 150000, quantity: 1, image: '/placeholder-product.jpg' },
              { id: 2, name: 'Sữ a rửa mặt Làm sạch sâu', price: 200000, quantity: 1, image: '/placeholder-product.jpg' }
            ],
            shippingAddress: {
              name: 'Người dùng KaKa',
              address: '123 Đường ABC, Phường 1, Quận 1, TP.HCM',
              phone: '0901234567'
            },
            tracking: 'TRACK001',
            estimatedDelivery: '2024-01-18'
          },
          {
            id: 'ORD002',
            orderDate: '2024-01-20',
            status: 'shipped',
            total: 500000,
            items: [
              { id: 3, name: 'Son môi Luxury Edition', price: 300000, quantity: 1, image: '/placeholder-product.jpg' },
              { id: 4, name: 'Mặt nạ giấy Collagen', price: 200000, quantity: 1, image: '/placeholder-product.jpg' }
            ],
            shippingAddress: {
              name: 'Người dùng KaKa',
              address: '123 Đường ABC, Phường 1, Quận 1, TP.HCM',
              phone: '0901234567'
            },
            tracking: 'TRACK002',
            estimatedDelivery: '2024-01-25'
          },
          {
            id: 'ORD003',
            orderDate: '2024-01-25',
            status: 'pending',
            total: 280000,
            items: [
              { id: 5, name: 'Tinh chất Retinol Cao cấp', price: 280000, quantity: 1, image: '/placeholder-product.jpg' }
            ],
            shippingAddress: {
              name: 'Người dùng KaKa',
              address: '123 Đường ABC, Phường 1, Quận 1, TP.HCM',
              phone: '0901234567'
            },
            tracking: null,
            estimatedDelivery: '2024-01-30'
          }
        ];

        setOrders(mockOrders);
      } catch (error) {
        showNotification('Không thể tải danh sách đơn hàng', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'Đang xử lý', color: '#ff9800', icon: '⏳' },
      shipped: { label: 'Đang giao hàng', color: '#2196f3', icon: '🚚' },
      delivered: { label: 'Đã giao hàng', color: '#4caf50', icon: '✓' },
      cancelled: { label: 'Đã hủy', color: '#f44336', icon: '✕' }
    };
    return statusMap[status] || { label: 'Không rõ', color: '#999', icon: '?' };
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      try {
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled' }
            : order
        ));
        
        showNotification('Hủy đơn hàng thành công', 'success');
      } catch (error) {
        showNotification('Có lỗi xảy ra khi hủy đơn hàng', 'error');
      }
    }
  };

  const handleReorder = (order) => {
    // Giả lập thêm vào giỏ hàng
    showNotification(`Đã thêm ${order.items.length} sản phẩm vào giỏ hàng`, 'success');
  };

  if (isLoading) {
    return (
      <div>
        <div className={styles.contentHeader}>
          <h1 className={styles.contentTitle}>Lịch sử đơn hàng</h1>
          <p className={styles.contentSubtitle}>Đang tải...</p>
        </div>
        <div className={styles.contentSection} style={{ textAlign: 'center', padding: '3rem' }}>
          <div className={styles.loadingSpinner} style={{ margin: '0 auto', width: '40px', height: '40px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Lịch sử đơn hàng</h1>
        <p className={styles.contentSubtitle}>Theo dõi và quản lý các đơn hàng của bạn</p>
      </div>

      {/* Bộ lọc trạng thái */}
      <div className={styles.contentSection}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button
            onClick={() => setFilter('all')}
            className={`${styles.btn} ${filter === 'all' ? styles['btn-primary'] : styles['btn-secondary']}`}
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
          >
            Tất cả ({orders.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`${styles.btn} ${filter === 'pending' ? styles['btn-primary'] : styles['btn-secondary']}`}
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
          >
            ⏳ Đang xử lý ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('shipped')}
            className={`${styles.btn} ${filter === 'shipped' ? styles['btn-primary'] : styles['btn-secondary']}`}
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
          >
            🚚 Đang giao ({orders.filter(o => o.status === 'shipped').length})
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`${styles.btn} ${filter === 'delivered' ? styles['btn-primary'] : styles['btn-secondary']}`}
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
          >
            ✓ Đã giao ({orders.filter(o => o.status === 'delivered').length})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`${styles.btn} ${filter === 'cancelled' ? styles['btn-primary'] : styles['btn-secondary']}`}
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
          >
            ✕ Đã hủy ({orders.filter(o => o.status === 'cancelled').length})
          </button>
        </div>
      </div>

      {/* Danh sách đơn hàng */}
      {filteredOrders.length > 0 ? (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <div key={order.id} className={styles.contentSection}>
                {/* Header đơn hàng */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                      Đơn hàng #{order.id}
                    </h3>
                    <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                      📅 Đặt hàng: {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                    </p>
                    {order.tracking && (
                      <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                        📦 Mã vận đơn: {order.tracking}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      background: statusInfo.color,
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '25px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem'
                    }}>
                      {statusInfo.icon} {statusInfo.label}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ff6b9d' }}>
                      {formatPrice(order.total)}
                    </div>
                  </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600' }}>Sản phẩm ({order.items.length})</h4>
                  {order.items.map((item) => (
                    <div key={item.id} style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '1rem',
                      background: '#f9f9f9',
                      borderRadius: '8px',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: '#e0e0e0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}>
                        💄
                      </div>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: '600' }}>
                          {item.name}
                        </h5>
                        <p style={{ margin: '0', color: '#666', fontSize: '0.85rem' }}>
                          Số lượng: {item.quantity} | {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Địa chỉ giao hàng */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600' }}>Địa chỉ giao hàng</h4>
                  <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
                    <p style={{ margin: '0', fontWeight: '500' }}>{order.shippingAddress.name}</p>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                      {order.shippingAddress.address}
                    </p>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                      📞 {order.shippingAddress.phone}
                    </p>
                  </div>
                </div>

                {/* Hành động */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => handleReorder(order)}
                      className={`${styles.btn} ${styles['btn-primary']}`}
                      style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    >
                      🛒 Mua lại
                    </button>
                  )}
                  
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className={`${styles.btn} ${styles['btn-danger']}`}
                      style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    >
                      ✕ Hủy đơn
                    </button>
                  )}
                  
                  <button
                    onClick={() => showNotification('Chi tiết đơn hàng sẽ được phát triển', 'warning')}
                    className={`${styles.btn} ${styles['btn-secondary']}`}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    👁️ Xem chi tiết
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.contentSection} style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>Không có đơn hàng nào</h3>
          <p style={{ color: '#999', marginBottom: '2rem' }}>
            {filter === 'all' 
              ? 'Bạn chưa có đơn hàng nào' 
              : `Không có đơn hàng nào với trạng thái "${getStatusInfo(filter).label}"`
            }
          </p>
          <a href="/products" className={`${styles.btn} ${styles['btn-primary']}`}>
            🛒 Bắt đầu mua sắm
          </a>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;