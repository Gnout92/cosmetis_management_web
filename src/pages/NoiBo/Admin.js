import React, { useState, useEffect } from 'react';
import { Shield, Users, Package, TrendingUp, UserPlus, Edit2, Lock, Key, Ban, CheckCircle, BarChart3 } from 'lucide-react';
import styles from '../../styles/NoiBo/Admin.module.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // User management
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    displayName: '',
    role: 'Customer',
  });
  
  // Filters
  const [filterRole, setFilterRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token?.startsWith('Bearer ') ? token : `Bearer ${token}`;
  };

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'stats') {
      loadStats();
    }
  }, [activeTab, filterRole, searchTerm]);

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

  const handleChangeRole = async (userId, newRole) => {
    if (!confirm(`Bạn có chắc muốn đổi vai trò thành ${newRole}?`)) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi đổi vai trò');
      }

      alert(data.message || 'Đã đổi vai trò thành công');
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

  const resetUserForm = () => {
    setUserForm({
      username: '',
      email: '',
      password: '',
      displayName: '',
      role: 'Customer',
    });
    setShowUserForm(false);
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

  const getRoleBadgeColor = (role) => {
    const colors = {
      Admin: '#dc2626',
      QL_SanPham: '#2563eb',
      QL_Kho: '#059669',
      QL_KhachHang: '#d97706',
      Customer: '#64748b',
    };
    return colors[role] || '#64748b';
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Quản Trị Hệ Thống</h1>
        <p className={styles.subtitle}>Quản lý tài khoản và thống kê tổng quan</p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.overview?.totalUsers || 0}</div>
            <div className={styles.statLabel}>Tổng người dùng</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.overview?.totalCustomers || 0}</div>
            <div className={styles.statLabel}>Khách hàng</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.overview?.totalProducts || 0}</div>
            <div className={styles.statLabel}>Sản phẩm</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {formatPrice(stats.overview?.revenue?.total || 0)}
            </div>
            <div className={styles.statLabel}>Doanh thu</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsNav}>
          <button
            className={`${styles.tabButton} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} /> Quản lý tài khoản
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'stats' ? styles.active : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 size={18} /> Thống kê
          </button>
        </div>

        <div className={styles.tabContent}>
          {/* Users Management Tab */}
          {activeTab === 'users' && (
            <>
              {/* Search & Filter */}
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className={styles.filterSelect}
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="">Tất cả vai trò</option>
                  <option value="Admin">Admin</option>
                  <option value="QL_SanPham">QL_SanPham</option>
                  <option value="QL_Kho">QL_Kho</option>
                  <option value="QL_KhachHang">QL_KhachHang</option>
                  <option value="Customer">Customer</option>
                </select>
                <button className={styles.addButton} onClick={() => setShowUserForm(true)}>
                  <UserPlus size={18} /> Tạo tài khoản
                </button>
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

              {/* Create User Form */}
              {showUserForm && (
                <form className={styles.formContainer} onSubmit={handleCreateUser}>
                  <h3 className={styles.formTitle}>Tạo tài khoản mới</h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Tên đăng nhập *</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={userForm.username}
                        onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                        required
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
                      <label className={styles.formLabel}>Mật khẩu *</label>
                      <input
                        type="password"
                        className={styles.formInput}
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        required
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
                        value={userForm.role}
                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                        required
                      >
                        <option value="Customer">Customer</option>
                        <option value="QL_SanPham">QL_SanPham</option>
                        <option value="QL_Kho">QL_Kho</option>
                        <option value="QL_KhachHang">QL_KhachHang</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.formActions}>
                    <button
                      type="submit"
                      className={`${styles.submitButton} ${styles.saveButton}`}
                      disabled={loading}
                    >
                      {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
                    </button>
                    <button
                      type="button"
                      className={`${styles.submitButton} ${styles.cancelButton}`}
                      onClick={resetUserForm}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}

              {/* Users Table */}
              {loading && !showUserForm ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  Đang tải...
                </div>
              ) : users.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      background: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                          Người dùng
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                          Vai trò
                        </th>
                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
                          Trạng thái
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                          Ngày tạo
                        </th>
                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: '600' }}>{user.displayName || user.username}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{user.email}</div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <select
                              value={user.role}
                              onChange={(e) => handleChangeRole(user.id, e.target.value)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                background: `${getRoleBadgeColor(user.role)}22`,
                                color: getRoleBadgeColor(user.role),
                                fontWeight: '600',
                                fontSize: '0.9rem',
                              }}
                            >
                              <option value="Customer">Customer</option>
                              <option value="QL_SanPham">QL_SanPham</option>
                              <option value="QL_Kho">QL_Kho</option>
                              <option value="QL_KhachHang">QL_KhachHang</option>
                              <option value="Admin">Admin</option>
                            </select>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            {user.isActive ? (
                              <span
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  background: '#dcfce722',
                                  color: '#16a34a',
                                }}
                              >
                                Hoạt động
                              </span>
                            ) : (
                              <span
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  background: '#fee2e222',
                                  color: '#dc2626',
                                }}
                              >
                                Đã khóa
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>{formatDate(user.createdAt)}</td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                onClick={() => handleResetPassword(user.id)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  background: '#3b82f6',
                                  color: 'white',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem',
                                }}
                                title="Reset mật khẩu"
                              >
                                <Key size={14} />
                              </button>
                              <button
                                onClick={() => handleToggleStatus(user.id, user.isActive)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  background: user.isActive ? '#ef4444' : '#10b981',
                                  color: 'white',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem',
                                }}
                                title={user.isActive ? 'Khóa tài khoản' : 'Kích hoạt'}
                              >
                                {user.isActive ? <Ban size={14} /> : <CheckCircle size={14} />}
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
                  <div className={styles.emptyIcon}>
                    <Users size={64} />
                  </div>
                  <div className={styles.emptyTitle}>Chưa có người dùng</div>
                </div>
              )}
            </>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && stats && (
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
                Thống kê tổng quan
              </h3>
              
              {/* Thống kê đơn hàng theo trạng thái */}
              <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px' }}>
                  Đơn hàng theo trạng thái
                </h4>
                {stats.ordersByStatus && stats.ordersByStatus.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {stats.ordersByStatus.map((item) => (
                      <div
                        key={item.status}
                        style={{
                          padding: '16px',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
                          {item.count}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{item.status}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                    Chưa có dữ liệu
                  </div>
                )}
              </div>

              {/* Sản phẩm bán chạy */}
              <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px' }}>
                  Sản phẩm bán chạy
                </h4>
                {stats.topProducts && stats.topProducts.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    {stats.topProducts.map((product, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '12px',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          marginBottom: '8px',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '600' }}>{product.productName}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                            Đã bán: {product.totalSold}
                          </div>
                        </div>
                        <div style={{ fontWeight: '700', color: '#10b981' }}>
                          {formatPrice(product.totalRevenue)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                    Chưa có dữ liệu
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
