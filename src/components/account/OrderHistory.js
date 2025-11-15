import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/login.module.css';

const OrderHistory = ({ user, showNotification }) => {
  const router = useRouter();
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lịch sử đơn hàng</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Theo dõi và quản lý các đơn hàng của bạn</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Tất cả ({orders.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'pending' 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                ⏳ Đang xử lý ({orders.filter(o => o.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('shipped')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'shipped' 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                🚚 Đang giao ({orders.filter(o => o.status === 'shipped').length})
              </button>
              <button
                onClick={() => setFilter('delivered')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'delivered' 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                ✓ Đã giao ({orders.filter(o => o.status === 'delivered').length})
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'cancelled' 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                ✕ Đã hủy ({orders.filter(o => o.status === 'cancelled').length})
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Đơn hàng #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          📅 Đặt hàng: {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                        </p>
                        {order.tracking && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            📦 Mã vận đơn: {order.tracking}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span 
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: statusInfo.color }}
                          >
                            {statusInfo.icon} {statusInfo.label}
                          </span>
                          <p className="text-lg font-bold text-pink-600 dark:text-pink-400 mt-1">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Products */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Sản phẩm ({order.items.length})
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
                              <span className="text-2xl">💄</span>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Số lượng: {item.quantity} | {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Địa chỉ giao hàng
                      </h4>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="font-medium text-gray-900 dark:text-white">{order.shippingAddress.name}</p>
                        <p className="text-gray-600 dark:text-gray-400">{order.shippingAddress.address}</p>
                        <p className="text-gray-600 dark:text-gray-400">📞 {order.shippingAddress.phone}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 justify-end">
                      {order.status === 'delivered' && (
                        <button
                          onClick={() => handleReorder(order)}
                          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          🛒 Mua lại
                        </button>
                      )}
                      
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          ✕ Hủy đơn
                        </button>
                      )}
                      
                      <button
                        onClick={() => showNotification('Chi tiết đơn hàng sẽ được phát triển', 'warning')}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        👁️ Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Không có đơn hàng nào
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filter === 'all' 
                  ? 'Bạn chưa có đơn hàng nào' 
                  : `Không có đơn hàng nào với trạng thái "${getStatusInfo(filter).label}"`
                }
              </p>
              <button
                onClick={() => router.push('/products')}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors"
              >
                🛒 Bắt đầu mua sắm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;