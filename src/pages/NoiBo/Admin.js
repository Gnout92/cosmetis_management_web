// src/pages/NoiBo/Admin.js
import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Package, TrendingUp, UserPlus, Edit2, Lock, Key, Ban, CheckCircle, 
  BarChart3, Home, ShoppingCart, Warehouse, Settings, Star, Eye, EyeOff, Trash2,
  RefreshCw, Search, Filter, Download, Upload, Plus, Check, X, AlertTriangle
} from 'lucide-react';
import styles from '../../styles/NoiBo/Admin.module.css';
import withAuth from '@/utils/withAuth';
import SidebarNoiBo from '../../components/SidebarNoiBo';
import { useRouter } from 'next/router';

const Admin = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // User management
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    displayName: '',
    roles: [],
  });
  
  // Product management
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Order management
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  // Filters
  const [filterRole, setFilterRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRating, setFilterRating] = useState('');

  // Handle tab changes from URL params
  React.useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab);
    }
  }, [router.query.tab]);

  // Update URL when tab changes
  React.useEffect(() => {
    const newUrl = router.pathname + (activeTab !== 'dashboard' ? `?tab=${activeTab}` : '');
    window.history.replaceState(null, '', newUrl);
  }, [activeTab, router.pathname]);

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token?.startsWith('Bearer ') ? token : `Bearer ${token}`;
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadStats();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'products') {
      loadProducts();
    } else if (activeTab === 'reviews') {
      loadReviews();
    } else if (activeTab === 'orders') {
      loadOrders();
    } else if (activeTab === 'warehouse') {
      loadWarehouse();
    }
  }, [activeTab, filterRole, searchTerm, filterStatus, filterRating]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch('/api/admin/stats', {
        headers: { Authorization: token },
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Lỗi tải thống kê:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const params = new URLSearchParams({
        role: filterRole,
        search: searchTerm,
      });

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: token },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi tải danh sách users');
      }

      setUsers(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const params = new URLSearchParams({
        search: searchTerm,
        status: filterStatus,
      });

      const response = await fetch(`/api/admin/products?${params}`, {
        headers: { Authorization: token },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi tải danh sách sản phẩm');
      }

      setProducts(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const params = new URLSearchParams({
        status: filterStatus,
        rating: filterRating,
      });

      const response = await fetch(`/api/admin/reviews?${params}`, {
        headers: { Authorization: token },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi tải danh sách đánh giá');
      }

      setReviews(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const params = new URLSearchParams({
        status: filterStatus,
        search: searchTerm,
      });

      const response = await fetch(`/api/admin/orders?${params}`, {
        headers: { Authorization: token },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi tải danh sách đơn hàng');
      }

      setOrders(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadWarehouse = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const response = await fetch('/api/admin/warehouse', {
        headers: { Authorization: token },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi tải dữ liệu kho');
      }

      setWarehouse(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(userForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi tạo tài khoản');
      }

      alert(data.message || 'Tạo tài khoản thành công!');
      resetUserForm();
      loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(userForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi cập nhật tài khoản');
      }

      alert(data.message || 'Cập nhật thành công!');
      resetUserForm();
      loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi xóa người dùng');
      }

      alert(data.message || 'Xóa thành công');
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = prompt('Nhập mật khẩu mới (tối thiểu 6 ký tự):');
    if (!newPassword || newPassword.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi reset mật khẩu');
      }

      alert(data.message || 'Reset mật khẩu thành công');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    if (!confirm(newStatus ? 'Kích hoạt tài khoản?' : 'Khóa tài khoản?')) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ isActive: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi thay đổi trạng thái');
      }

      alert(data.message);
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleProductVisibility = async (productId, currentStatus) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`/api/admin/products/${productId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ isHidden: !currentStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi thay đổi trạng thái sản phẩm');
      }

      loadProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateReviewStatus = async (reviewId, newStatus) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`/api/admin/reviews/${reviewId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi cập nhật trạng thái đánh giá');
      }

      alert(data.message || 'Cập nhật thành công');
      loadReviews();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi cập nhật trạng thái đơn hàng');
      }

      alert(data.message || 'Cập nhật thành công');
      loadOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`/api/admin/warehouse/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ stock: newStock }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi cập nhật tồn kho');
      }

      alert(data.message || 'Cập nhật tồn kho thành công');
      loadWarehouse();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetUserForm = () => {
    setUserForm({
      username: '',
      email: '',
      password: '',
      displayName: '',
      roles: [],
    });
    setShowUserForm(false);
    setEditingUser(null);
  };

  const editUser = (user) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      email: user.email,
      password: '',
      displayName: user.displayName || '',
      roles: user.roles || [],
    });
    setShowUserForm(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'Chờ xử lý': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Đang xử lý': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Đang giao': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Hoàn thành': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Đã hủy': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Chờ duyệt': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Đã duyệt': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Từ chối': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < rating ? 'currentColor' : 'none'}
            className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <SidebarNoiBo activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className={styles.adminMainContainer}>
        <div className={styles.contentWrapper}>
          {/* Header */}
          <div className={styles.adminHeader}>
            <div>
              <h1 className={styles.adminTitle}>Quản Trị Hệ Thống</h1>
              <p className={styles.adminSubtitle}>
                {activeTab === 'dashboard' && 'Tổng quan và thống kê hệ thống'}
                {activeTab === 'users' && 'Quản lý người dùng và phân quyền'}
                {activeTab === 'products' && 'Quản lý danh mục sản phẩm'}
                {activeTab === 'reviews' && 'Quản lý đánh giá khách hàng'}
                {activeTab === 'orders' && 'Quản lý đơn hàng'}
                {activeTab === 'warehouse' && 'Quản lý tồn kho'}
                {activeTab === 'settings' && 'Cài đặt hệ thống'}
              </p>
            </div>
            <div className="flex gap-3">
              <button className={styles.iconButton} onClick={() => window.location.reload()} title="Làm mới">
                <RefreshCw size={20} />
              </button>
            </div>
          </div>

          {/* Stats Overview - Show on dashboard */}
          {activeTab === 'dashboard' && stats && (
            <div className={styles.statsGrid}>
              <div className={`${styles.statCard} ${styles.statCardPrimary}`}>
                <div className={styles.statIcon}>
                  <Users size={32} />
                </div>
                <div>
                  <div className={styles.statNumber}>{stats.overview?.totalUsers || 0}</div>
                  <div className={styles.statLabel}>Tổng người dùng</div>
                </div>
              </div>
              <div className={`${styles.statCard} ${styles.statCardSuccess}`}>
                <div className={styles.statIcon}>
                  <Package size={32} />
                </div>
                <div>
                  <div className={styles.statNumber}>{stats.overview?.totalProducts || 0}</div>
                  <div className={styles.statLabel}>Sản phẩm</div>
                </div>
              </div>
              <div className={`${styles.statCard} ${styles.statCardWarning}`}>
                <div className={styles.statIcon}>
                  <ShoppingCart size={32} />
                </div>
                <div>
                  <div className={styles.statNumber}>{stats.overview?.totalOrders || 0}</div>
                  <div className={styles.statLabel}>Đơn hàng</div>
                </div>
              </div>
              <div className={`${styles.statCard} ${styles.statCardInfo}`}>
                <div className={styles.statIcon}>
                  <TrendingUp size={32} />
                </div>
                <div>
                  <div className={styles.statNumber}>{formatPrice(stats.overview?.revenue?.total || 0)}</div>
                  <div className={styles.statLabel}>Doanh thu</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className={styles.contentSection}>
            <div className={styles.sectionContent}>
              {/* ==================== DASHBOARD TAB ==================== */}
              {activeTab === 'dashboard' && (
                <div>
                  {loading ? (
                    <div className={styles.loading}>
                      <div className={styles.spinner}></div>
                      Đang tải thống kê...
                    </div>
                  ) : stats ? (
                    <div className="space-y-6">
                      {/* Revenue Chart Section */}
                      <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>
                          <BarChart3 size={24} />
                          Doanh thu theo tháng
                        </h3>
                        <div className={styles.chartPlaceholder}>
                          <BarChart3 size={64} className="text-gray-300" />
                          <p className="text-gray-500 mt-4">Biểu đồ doanh thu (Tích hợp chart library)</p>
                        </div>
                      </div>

                      {/* Orders by Status */}
                      <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>
                          <ShoppingCart size={24} />
                          Đơn hàng theo trạng thái
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                          {stats.ordersByStatus && stats.ordersByStatus.map((item) => (
                            <div key={item.status} className={styles.miniStatCard}>
                              <div className={styles.miniStatNumber}>{item.count}</div>
                              <div className={styles.miniStatLabel}>{item.status}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top Products */}
                      <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>
                          <Package size={24} />
                          Top sản phẩm bán chạy
                        </h3>
                        <div className="space-y-3 mt-4">
                          {stats.topProducts && stats.topProducts.slice(0, 5).map((product, idx) => (
                            <div key={idx} className={styles.productRankCard}>
                              <div className={styles.productRank}>#{idx + 1}</div>
                              <div className="flex-1">
                                <div className={styles.productName}>{product.productName}</div>
                                <div className={styles.productSales}>Đã bán: {product.totalSold} sản phẩm</div>
                              </div>
                              <div className={styles.productRevenue}>
                                {formatPrice(product.totalRevenue)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Activities */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Orders */}
                        <div className={styles.activityCard}>
                          <h3 className={styles.activityTitle}>
                            <ShoppingCart size={20} />
                            Đơn hàng gần đây
                          </h3>
                          <div className="space-y-2 mt-4">
                            {stats.recentOrders && stats.recentOrders.slice(0, 5).map((order) => (
                              <div key={order.id} className={styles.activityItem}>
                                <div className="flex-1">
                                  <div className={styles.activityItemTitle}>Đơn #{order.id}</div>
                                  <div className={styles.activityItemDesc}>{order.customerName}</div>
                                </div>
                                <div className="text-right">
                                  <div className={styles.activityItemPrice}>{formatPrice(order.total)}</div>
                                  <div className={styles.activityItemDate}>{formatDate(order.createdAt)}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recent Reviews */}
                        <div className={styles.activityCard}>
                          <h3 className={styles.activityTitle}>
                            <Star size={20} />
                            Đánh giá mới nhất
                          </h3>
                          <div className="space-y-2 mt-4">
                            {stats.recentReviews && stats.recentReviews.slice(0, 5).map((review) => (
                              <div key={review.id} className={styles.activityItem}>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {renderStars(review.rating)}
                                    <span className={styles.activityItemDesc}>{review.customerName}</span>
                                  </div>
                                  <div className={styles.activityItemTitle}>{review.productName}</div>
                                </div>
                                <div className={styles.activityItemDate}>{formatDate(review.createdAt)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <Home size={64} className={styles.emptyIcon} />
                      <h3 className={styles.emptyTitle}>Chào mừng đến với trang quản trị</h3>
                      <p className={styles.emptyDescription}>Sử dụng sidebar để điều hướng các chức năng quản lý</p>
                    </div>
                  )}
                </div>
              )}

              {/* ==================== USERS TAB ==================== */}
              {activeTab === 'users' && (
                <>
                  {/* Search & Filter */}
                  <div className={styles.filterBar}>
                    <div className={styles.searchBox}>
                      <Search size={20} className={styles.searchIcon} />
                      <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Tìm kiếm theo tên, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      className={styles.filterSelect}
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                    >
                      <option value="">Tất cả vai trò</option>
                      <option value="Admin">Admin</option>
                      <option value="QL_SanPham">QL Sản Phẩm</option>
                      <option value="QL_Kho">QL Kho</option>
                      <option value="QL_KhachHang">QL Khách Hàng</option>
                      <option value="Customer">Customer</option>
                    </select>
                    <button 
                      className={styles.primaryButton}
                      onClick={() => setShowUserForm(true)}
                    >
                      <UserPlus size={18} /> 
                      Tạo tài khoản
                    </button>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className={styles.errorAlert}>
                      <AlertTriangle size={20} />
                      {error}
                    </div>
                  )}

                  {/* Create/Edit User Form */}
                  {showUserForm && (
                    <form className={styles.formCard} onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
                      <h3 className={styles.formTitle}>
                        {editingUser ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản mới'}
                      </h3>
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Tên đăng nhập *</label>
                          <input
                            type="text"
                            className={styles.formInput}
                            value={userForm.username}
                            onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                            required
                            disabled={!!editingUser}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Email *</label>
                          <input
                            type="email"
                            className={styles.formInput}
                            value={userForm.email}
                            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                            required
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>
                            Mật khẩu {editingUser ? '(để trống nếu không đổi)' : '*'}
                          </label>
                          <input
                            type="password"
                            className={styles.formInput}
                            value={userForm.password}
                            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                            required={!editingUser}
                            minLength={6}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Tên hiển thị</label>
                          <input
                            type="text"
                            className={styles.formInput}
                            value={userForm.displayName}
                            onChange={(e) => setUserForm({ ...userForm, displayName: e.target.value })}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Vai trò *</label>
                          <select
                            className={styles.formSelect}
                            value={userForm.roles[0] || 'Customer'}
                            onChange={(e) => setUserForm({ ...userForm, roles: [e.target.value] })}
                            required
                          >
                            <option value="Customer">Customer</option>
                            <option value="QL_SanPham">QL Sản Phẩm</option>
                            <option value="QL_Kho">QL Kho</option>
                            <option value="QL_KhachHang">QL Khách Hàng</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                      </div>
                      <div className={styles.formActions}>
                        <button type="submit" className={styles.primaryButton} disabled={loading}>
                          {loading ? 'Đang xử lý...' : (editingUser ? 'Cập nhật' : 'Tạo tài khoản')}
                        </button>
                        <button type="button" className={styles.secondaryButton} onClick={resetUserForm}>
                          Hủy
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Users Table */}
                  {loading ? (
                    <div className={styles.loading}>
                      <div className={styles.spinner}></div>
                      Đang tải danh sách người dùng...
                    </div>
                  ) : users.length > 0 ? (
                    <div className={styles.tableContainer}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Người dùng</th>
                            <th>Vai trò</th>
                            <th className="text-center">Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th className="text-center">Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td className={styles.tableId}>#{user.id}</td>
                              <td>
                                <div className={styles.userInfo}>
                                  <div className={styles.userName}>{user.displayName || user.username}</div>
                                  <div className={styles.userEmail}>{user.email}</div>
                                </div>
                              </td>
                              <td>
                                <span className={`${styles.badge} ${styles[`badge${user.roles[0]}`]}`}>
                                  {user.roles[0]}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className={`${styles.statusBadge} ${
                                  user.isActive ? styles.statusActive : styles.statusInactive
                                }`}>
                                  {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                                </span>
                              </td>
                              <td className={styles.tableDate}>{formatDate(user.createdAt)}</td>
                              <td>
                                <div className={styles.actionButtons}>
                                  <button
                                    onClick={() => editUser(user)}
                                    className={styles.actionButton}
                                    title="Chỉnh sửa"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleResetPassword(user.id)}
                                    className={styles.actionButton}
                                    title="Reset mật khẩu"
                                  >
                                    <Key size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleToggleStatus(user.id, user.isActive)}
                                    className={`${styles.actionButton} ${
                                      user.isActive ? styles.actionDanger : styles.actionSuccess
                                    }`}
                                    title={user.isActive ? 'Khóa tài khoản' : 'Kích hoạt'}
                                  >
                                    {user.isActive ? <Ban size={16} /> : <CheckCircle size={16} />}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className={`${styles.actionButton} ${styles.actionDanger}`}
                                    title="Xóa"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <Users size={64} className={styles.emptyIcon} />
                      <h3 className={styles.emptyTitle}>Chưa có người dùng</h3>
                      <p className={styles.emptyDescription}>Bắt đầu bằng cách tạo tài khoản đầu tiên</p>
                    </div>
                  )}
                </>
              )}

              {/* ==================== PRODUCTS TAB ==================== */}
              {activeTab === 'products' && (
                <>
                  <div className={styles.filterBar}>
                    <div className={styles.searchBox}>
                      <Search size={20} className={styles.searchIcon} />
                      <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      className={styles.filterSelect}
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">Tất cả trạng thái</option>
                      <option value="visible">Hiển thị</option>
                      <option value="hidden">Ẩn</option>
                    </select>
                  </div>

                  {loading ? (
                    <div className={styles.loading}>
                      <div className={styles.spinner}></div>
                      Đang tải danh sách sản phẩm...
                    </div>
                  ) : products.length > 0 ? (
                    <div className={styles.tableContainer}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>Mã SP</th>
                            <th>Tên sản phẩm</th>
                            <th className="text-right">Giá</th>
                            <th className="text-center">Tồn kho</th>
                            <th className="text-center">Đánh giá</th>
                            <th className="text-center">Trạng thái</th>
                            <th className="text-center">Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id}>
                              <td className={styles.tableId}>#{product.id}</td>
                              <td>
                                <div className={styles.productInfo}>
                                  <div className={styles.productName}>
                                    {product.name || product.productName}
                                  </div>
                                </div>
                              </td>
                              <td className="text-right font-semibold">{formatPrice(product.price)}</td>
                              <td className="text-center">
                                <span className={`${styles.stockBadge} ${
                                  product.stock > 10 ? styles.stockHigh :
                                  product.stock > 0 ? styles.stockMedium :
                                  styles.stockLow
                                }`}>
                                  {product.stock || 0}
                                </span>
                              </td>
                              <td className="text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <Star size={14} fill="currentColor" className="text-yellow-400" />
                                  <span>{product.avgRating || 0}</span>
                                  <span className="text-gray-400">({product.reviewCount || 0})</span>
                                </div>
                              </td>
                              <td className="text-center">
                                <span className={`${styles.statusBadge} ${
                                  !product.isHidden ? styles.statusActive : styles.statusInactive
                                }`}>
                                  {!product.isHidden ? 'Hiển thị' : 'Ẩn'}
                                </span>
                              </td>
                              <td>
                                <div className={styles.actionButtons}>
                                  <button
                                    onClick={() => handleToggleProductVisibility(product.id, product.isHidden)}
                                    className={styles.actionButton}
                                    title={product.isHidden ? 'Hiển thị' : 'Ẩn'}
                                  >
                                    {product.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <Package size={64} className={styles.emptyIcon} />
                      <h3 className={styles.emptyTitle}>Chưa có sản phẩm</h3>
                      <p className={styles.emptyDescription}>Danh sách sản phẩm trống</p>
                    </div>
                  )}
                </>
              )}

              {/* ==================== REVIEWS TAB ==================== */}
              {activeTab === 'reviews' && (
                <>
                  <div className={styles.filterBar}>
                    <select
                      className={styles.filterSelect}
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">Tất cả trạng thái</option>
                      <option value="Chờ duyệt">Chờ duyệt</option>
                      <option value="Đã duyệt">Đã duyệt</option>
                      <option value="Từ chối">Từ chối</option>
                    </select>
                    <select
                      className={styles.filterSelect}
                      value={filterRating}
                      onChange={(e) => setFilterRating(e.target.value)}
                    >
                      <option value="">Tất cả đánh giá</option>
                      <option value="5">5 sao</option>
                      <option value="4">4 sao</option>
                      <option value="3">3 sao</option>
                      <option value="2">2 sao</option>
                      <option value="1">1 sao</option>
                    </select>
                  </div>

                  {loading ? (
                    <div className={styles.loading}>
                      <div className={styles.spinner}></div>
                      Đang tải danh sách đánh giá...
                    </div>
                  ) : reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className={styles.reviewCard}>
                          <div className={styles.reviewHeader}>
                            <div className="flex-1">
                              <div className={styles.reviewUser}>{review.customerName || 'Khách hàng'}</div>
                              <div className={styles.reviewProduct}>{review.productName}</div>
                            </div>
                            <div className="text-right">
                              {renderStars(review.rating)}
                              <div className={styles.reviewDate}>{formatDate(review.createdAt)}</div>
                            </div>
                          </div>
                          <div className={styles.reviewContent}>{review.comment}</div>
                          <div className={styles.reviewFooter}>
                            <span className={`${styles.statusBadge} ${getStatusBadgeClass(review.status)}`}>
                              {review.status}
                            </span>
                            <div className={styles.reviewActions}>
                              {review.status !== 'Đã duyệt' && (
                                <button
                                  onClick={() => handleUpdateReviewStatus(review.id, 'Đã duyệt')}
                                  className={`${styles.actionButton} ${styles.actionSuccess}`}
                                  title="Duyệt"
                                >
                                  <Check size={16} /> Duyệt
                                </button>
                              )}
                              {review.status !== 'Từ chối' && (
                                <button
                                  onClick={() => handleUpdateReviewStatus(review.id, 'Từ chối')}
                                  className={`${styles.actionButton} ${styles.actionDanger}`}
                                  title="Từ chối"
                                >
                                  <X size={16} /> Từ chối
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <Star size={64} className={styles.emptyIcon} />
                      <h3 className={styles.emptyTitle}>Chưa có đánh giá</h3>
                      <p className={styles.emptyDescription}>Chưa có đánh giá nào từ khách hàng</p>
                    </div>
                  )}
                </>
              )}

              {/* ==================== ORDERS TAB ==================== */}
              {activeTab === 'orders' && (
                <>
                  <div className={styles.filterBar}>
                    <div className={styles.searchBox}>
                      <Search size={20} className={styles.searchIcon} />
                      <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Tìm kiếm đơn hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      className={styles.filterSelect}
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">Tất cả trạng thái</option>
                      <option value="Chờ xử lý">Chờ xử lý</option>
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đang giao">Đang giao</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </div>

                  {loading ? (
                    <div className={styles.loading}>
                      <div className={styles.spinner}></div>
                      Đang tải danh sách đơn hàng...
                    </div>
                  ) : orders.length > 0 ? (
                    <div className={styles.tableContainer}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>Mã ĐH</th>
                            <th>Khách hàng</th>
                            <th className="text-right">Tổng tiền</th>
                            <th className="text-center">Trạng thái</th>
                            <th>Ngày đặt</th>
                            <th className="text-center">Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id}>
                              <td className={styles.tableId}>#{order.id}</td>
                              <td>
                                <div className={styles.userInfo}>
                                  <div className={styles.userName}>{order.customerName}</div>
                                  <div className={styles.userEmail}>{order.customerEmail}</div>
                                </div>
                              </td>
                              <td className="text-right font-semibold">{formatPrice(order.total)}</td>
                              <td className="text-center">
                                <span className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className={styles.tableDate}>{formatDate(order.createdAt)}</td>
                              <td>
                                <div className={styles.actionButtons}>
                                  <select
                                    className={styles.actionSelect}
                                    value={order.status}
                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                  >
                                    <option value="Chờ xử lý">Chờ xử lý</option>
                                    <option value="Đang xử lý">Đang xử lý</option>
                                    <option value="Đang giao">Đang giao</option>
                                    <option value="Hoàn thành">Hoàn thành</option>
                                    <option value="Đã hủy">Đã hủy</option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <ShoppingCart size={64} className={styles.emptyIcon} />
                      <h3 className={styles.emptyTitle}>Chưa có đơn hàng</h3>
                      <p className={styles.emptyDescription}>Chưa có đơn hàng nào trong hệ thống</p>
                    </div>
                  )}
                </>
              )}

              {/* ==================== WAREHOUSE TAB ==================== */}
              {activeTab === 'warehouse' && (
                <>
                  <div className={styles.filterBar}>
                    <div className={styles.searchBox}>
                      <Search size={20} className={styles.searchIcon} />
                      <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {loading ? (
                    <div className={styles.loading}>
                      <div className={styles.spinner}></div>
                      Đang tải dữ liệu kho...
                    </div>
                  ) : warehouse.length > 0 ? (
                    <div className={styles.tableContainer}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>Mã SP</th>
                            <th>Tên sản phẩm</th>
                            <th className="text-center">Tồn kho</th>
                            <th className="text-center">Trạng thái</th>
                            <th className="text-center">Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {warehouse.map((item) => (
                            <tr key={item.productId}>
                              <td className={styles.tableId}>#{item.productId}</td>
                              <td>
                                <div className={styles.productName}>{item.productName}</div>
                              </td>
                              <td className="text-center">
                                <span className={`${styles.stockBadge} ${
                                  item.stock > 10 ? styles.stockHigh :
                                  item.stock > 0 ? styles.stockMedium :
                                  styles.stockLow
                                }`}>
                                  {item.stock}
                                </span>
                              </td>
                              <td className="text-center">
                                {item.stock === 0 ? (
                                  <span className={`${styles.statusBadge} ${styles.statusDanger}`}>
                                    <AlertTriangle size={14} /> Hết hàng
                                  </span>
                                ) : item.stock <= 5 ? (
                                  <span className={`${styles.statusBadge} ${styles.statusWarning}`}>
                                    <AlertTriangle size={14} /> Sắp hết
                                  </span>
                                ) : (
                                  <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                                    <CheckCircle size={14} /> Còn hàng
                                  </span>
                                )}
                              </td>
                              <td>
                                <div className={styles.actionButtons}>
                                  <button
                                    onClick={() => {
                                      const newStock = prompt('Nhập số lượng mới:', item.stock);
                                      if (newStock !== null) {
                                        handleUpdateStock(item.productId, parseInt(newStock));
                                      }
                                    }}
                                    className={styles.actionButton}
                                    title="Cập nhật tồn kho"
                                  >
                                    <Edit2 size={16} /> Cập nhật
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <Warehouse size={64} className={styles.emptyIcon} />
                      <h3 className={styles.emptyTitle}>Chưa có dữ liệu kho</h3>
                      <p className={styles.emptyDescription}>Không có thông tin tồn kho</p>
                    </div>
                  )}
                </>
              )}

              {/* ==================== SETTINGS TAB ==================== */}
              {activeTab === 'settings' && (
                <div className={styles.settingsContainer}>
                  <div className={styles.settingsCard}>
                    <h3 className={styles.settingsTitle}>
                      <Settings size={24} />
                      Cài đặt hệ thống
                    </h3>
                    <p className={styles.settingsDescription}>
                      Quản lý cấu hình và tùy chỉnh hệ thống
                    </p>
                    
                    <div className="space-y-6 mt-6">
                      <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                          <h4 className={styles.settingLabel}>Vai trò và quyền</h4>
                          <p className={styles.settingDesc}>Quản lý vai trò và phân quyền người dùng</p>
                        </div>
                        <button className={styles.settingButton}>
                          <Shield size={18} /> Quản lý
                        </button>
                      </div>

                      <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                          <h4 className={styles.settingLabel}>Logs hệ thống</h4>
                          <p className={styles.settingDesc}>Xem nhật ký hoạt động hệ thống</p>
                        </div>
                        <button className={styles.settingButton}>
                          <BarChart3 size={18} /> Xem logs
                        </button>
                      </div>

                      <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                          <h4 className={styles.settingLabel}>Sao lưu dữ liệu</h4>
                          <p className={styles.settingDesc}>Tạo bản sao lưu cơ sở dữ liệu</p>
                        </div>
                        <button className={styles.settingButton}>
                          <Download size={18} /> Backup
                        </button>
                      </div>

                      <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                          <h4 className={styles.settingLabel}>Khôi phục dữ liệu</h4>
                          <p className={styles.settingDesc}>Phục hồi từ bản sao lưu</p>
                        </div>
                        <button className={styles.settingButton}>
                          <Upload size={18} /> Restore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Admin, ['Admin']);
