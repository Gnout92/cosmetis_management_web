import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, Eye, Edit2, Shield, Calendar, ShoppingCart } from 'lucide-react';
import styles from '../../styles/NoiBo/QLKH.module.css';

const QLKH = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDetail, setShowDetail] = useState(false);

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token?.startsWith('Bearer ') ? token : `Bearer ${token}`;
  };

  useEffect(() => {
    loadCustomers();
  }, [currentPage, searchTerm]);

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        search: searchTerm,
      });

      const response = await fetch(`/api/qlkh/customers?${params}`, {
        headers: { Authorization: token },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi tải khách hàng');
      }

      setCustomers(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerDetail = async (customerId) => {
    try {
      const token = getAuthToken();
      
      // Load customer info
      const infoResponse = await fetch(`/api/qlkh/customers/${customerId}`, {
        headers: { Authorization: token },
      });
      const infoData = await infoResponse.json();
      
      if (infoData.success) {
        setSelectedCustomer(infoData.data);
      }

      // Load customer orders
      const ordersResponse = await fetch(`/api/qlkh/customers/${customerId}/orders`, {
        headers: { Authorization: token },
      });
      const ordersData = await ordersResponse.json();
      
      if (ordersData.success) {
        setCustomerOrders(ordersData.data || []);
      }

      setShowDetail(true);
    } catch (err) {
      alert('Lỗi tải thông tin khách hàng: ' + err.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getTierColor = (tier) => {
    const colors = {
      bronze: '#cd7f32',
      silver: '#c0c0c0',
      gold: '#ffd700',
      diamond: '#b9f2ff',
    };
    return colors[tier] || colors.bronze;
  };

  const getTierName = (tier) => {
    const names = {
      bronze: 'Đồng',
      silver: 'Bạc',
      gold: 'Vàng',
      diamond: 'Kim cương',
    };
    return names[tier] || 'Đồng';
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Quản Lý Khách Hàng</h1>
        <p className={styles.subtitle}>Quản lý thông tin và lịch sử mua hàng</p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{customers.length}</div>
          <div className={styles.statLabel}>Khách hàng</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            {customers.filter((c) => c.tier === 'gold' || c.tier === 'diamond').length}
          </div>
          <div className={styles.statLabel}>Khách hàng VIP</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            {formatPrice(
              customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0)
            )}
          </div>
          <div className={styles.statLabel}>Tổng doanh thu</div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabContent}>
          {/* Search */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Tìm kiếm khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: '15px',
                background: '#fee',
                color: '#c00',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            >
              {error}
            </div>
          )}

          {/* Customer Detail Modal */}
          {showDetail && selectedCustomer && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h2 className={styles.modalTitle}>Chi tiết khách hàng</h2>
                  <button
                    onClick={() => setShowDetail(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                    }}
                  >
                    ×
                  </button>
                </div>
                <div className={styles.modalBody}>
                  {/* Customer Info */}
                  <div style={{ marginBottom: '24px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                      {selectedCustomer.avatar ? (
                        <img
                          src={selectedCustomer.avatar}
                          alt={selectedCustomer.displayName}
                          style={{ width: '80px', height: '80px', borderRadius: '50%' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: '#667eea',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            fontWeight: '700',
                          }}
                        >
                          {selectedCustomer.displayName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>
                          {selectedCustomer.displayName}
                        </h3>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                          {selectedCustomer.email}
                        </div>
                        <div
                          style={{
                            display: 'inline-block',
                            marginTop: '8px',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            background: `${getTierColor(selectedCustomer.tier)}33`,
                            color: getTierColor(selectedCustomer.tier),
                          }}
                        >
                          Hạng {getTierName(selectedCustomer.tier)}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>
                          Tổng đơn hàng
                        </div>
                        <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>
                          {selectedCustomer.totalOrders}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>
                          Tổng chi tiêu
                        </div>
                        <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#10b981' }}>
                          {formatPrice(selectedCustomer.totalSpent)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>
                          Ngày tham gia
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                          {formatDate(selectedCustomer.createdAt)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>
                          Đơn hàng gần nhất
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                          {formatDate(selectedCustomer.lastOrderDate)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Orders History */}
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>
                    Lịch sử đơn hàng
                  </h3>
                  {customerOrders.length > 0 ? (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {customerOrders.map((order) => (
                        <div
                          key={order.id}
                          style={{
                            padding: '16px',
                            background: '#f8fafc',
                            borderRadius: '12px',
                            marginBottom: '12px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ fontWeight: '700' }}>#{order.orderId}</div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                {order.itemCount} sản phẩm
                              </div>
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#10b981' }}>
                              {formatPrice(order.grandTotal)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      Chưa có đơn hàng
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Customers List */}
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              Đang tải...
            </div>
          ) : customers.length > 0 ? (
            <div className={styles.customersList}>
              {customers.map((customer) => (
                <div key={customer.id} className={styles.customerCard}>
                  <div className={styles.customerHeader}>
                    {customer.avatar ? (
                      <img
                        src={customer.avatar}
                        alt={customer.displayName}
                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                      />
                    ) : (
                      <div className={styles.customerAvatar}>
                        {customer.displayName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className={styles.customerName}>{customer.displayName}</div>
                      <div className={styles.customerEmail}>{customer.email}</div>
                    </div>
                  </div>
                  <div
                    className={`${styles.customerTier}`}
                    style={{
                      background: `${getTierColor(customer.tier)}33`,
                      color: getTierColor(customer.tier),
                    }}
                  >
                    Hạng {getTierName(customer.tier)}
                  </div>
                  <div className={styles.customerStats}>
                    <div className={styles.statItem}>
                      <div className={styles.statValue}>{customer.totalOrders}</div>
                      <div className={styles.statLabel}>Đơn hàng</div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statValue}>{formatPrice(customer.totalSpent)}</div>
                      <div className={styles.statLabel}>Tổng chi tiêu</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Calendar size={14} /> Tham gia: {formatDate(customer.createdAt)}
                    </div>
                    {customer.lastOrderDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShoppingCart size={14} /> Mua hàng: {formatDate(customer.lastOrderDate)}
                      </div>
                    )}
                  </div>
                  <div className={styles.productActions}>
                    <button
                      className={`${styles.actionButton} ${styles.editButton}`}
                      onClick={() => loadCustomerDetail(customer.id)}
                    >
                      <Eye size={16} /> Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Users size={64} />
              </div>
              <div className={styles.emptyTitle}>Chưa có khách hàng</div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '30px',
              }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#667eea',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Trước
              </button>
              <span
                style={{
                  padding: '8px 16px',
                  background: '#f1f5f9',
                  borderRadius: '8px',
                }}
              >
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#667eea',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QLKH;
