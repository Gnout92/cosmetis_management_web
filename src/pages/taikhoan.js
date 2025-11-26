// src/pages/taikhoan.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/taikhoan.module.css';
import { 
  User, 
  Package, 
  LogOut,
  Edit2,
  Save,
  X,
  Mail,
  MapPin,
  Plus,
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
  
  // Form data (profile)
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
  
  // Orders states
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // ====== ADDRESS BOOK STATES ======
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressesError, setAddressesError] = useState(null);

  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [addressForm, setAddressForm] = useState({
    type: 'Shipping',        // Shipping / Billing
    isDefault: false,
    name: '',
    phone: '',
    provinceId: '',
    districtId: '',
    wardId: '',
    street: '',
    addressLine: '',
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

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

  // ====== LOAD ADDRESSES ======
  const loadAddresses = async () => {
    try {
      setAddressesLoading(true);
      setAddressesError(null);

      const token = getAuthToken();
      if (!token) {
        setAddressesError('Bạn chưa đăng nhập.');
        return;
      }

      const response = await fetch('/api/user/addresses', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách địa chỉ');
      }

      const data = await response.json();
      if (data.addresses) {
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.error('Error loading addresses:', err);
      setAddressesError(err.message || 'Lỗi khi tải danh sách địa chỉ');
    } finally {
      setAddressesLoading(false);
    }
  };

  // ====== LOAD LOCATION DATA (TỈNH / QUẬN / PHƯỜNG) ======
  const loadProvinces = async () => {
    try {
      const response = await fetch('/api/locations/provinces');
      if (!response.ok) throw new Error('Không thể tải danh sách Tỉnh/Thành phố');
      const data = await response.json();
      setProvinces(data.provinces || []);
    } catch (err) {
      console.error('Error loading provinces:', err);
    }
  };

  const loadDistricts = async (provinceId) => {
    if (!provinceId) {
      setDistricts([]);
      return;
    }
    try {
      const response = await fetch(`/api/locations/districts?provinceId=${provinceId}`);
      if (!response.ok) throw new Error('Không thể tải danh sách Quận/Huyện');
      const data = await response.json();
      setDistricts(data.districts || []);
    } catch (err) {
      console.error('Error loading districts:', err);
    }
  };

  const loadWards = async (districtId) => {
  if (!districtId) {
    setWards([]);
    return;
  }
  try {
    const response = await fetch(`/api/locations/wards?districtId=${districtId}`);
    if (!response.ok) throw new Error('Không thể tải danh sách Phường/Xã');
    const data = await response.json();
    console.log('WARDS API DATA', data); // thêm log để nhìn
    setWards(data.wards || []);
  } catch (err) {
    console.error('Error loading wards:', err);
    setWards([]);
  }
};

  // ====== ADDRESS FORM HELPERS ======
  const resetAddressForm = () => {
    setAddressForm({
      type: 'Shipping',
      isDefault: false,
      name: '',
      phone: '',
      provinceId: '',
      districtId: '',
      wardId: '',
      street: '',
      addressLine: '',
    });
    setProvinces([]);
    setDistricts([]);
    setWards([]);
    setEditingAddressId(null);
    setIsEditingAddress(false);
  };

  const openNewAddressForm = async () => {
    resetAddressForm();
    setIsAddressFormOpen(true);
    await loadProvinces();
  };

  const openEditAddressForm = async (address) => {
    setIsEditingAddress(true);
    setEditingAddressId(address.id);
    setAddressForm({
      type: address.type || 'Shipping',
      isDefault: !!address.isDefault,
      name: address.name || '',
      phone: address.phone || '',
      provinceId: address.provinceId || '',
      districtId: address.districtId || '',
      wardId: address.wardId || '',
      street: address.street || '',
      addressLine: address.addressLine || '',
    });
    setIsAddressFormOpen(true);

    // Load danh sách Tỉnh/Quận/Phường để chọn đúng
    await loadProvinces();
    if (address.provinceId) {
      await loadDistricts(address.provinceId);
    }
    if (address.districtId) {
      await loadWards(address.districtId);
    }
  };

  const handleAddressFieldChange = (field, value) => {
    setAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProvinceChange = async (value) => {
    handleAddressFieldChange('provinceId', value);
    handleAddressFieldChange('districtId', '');
    handleAddressFieldChange('wardId', '');
    setDistricts([]);
    setWards([]);
    if (value) {
      await loadDistricts(value);
    }
  };

  const handleDistrictChange = async (value) => {
    handleAddressFieldChange('districtId', value);
    handleAddressFieldChange('wardId', '');
    setWards([]);
    if (value) {
      await loadWards(value);
    }
  };

  const validateAddressForm = () => {
    if (!addressForm.name || !addressForm.phone) {
      setError('Vui lòng nhập Tên người nhận và Số điện thoại.');
      return false;
    }
    if (!addressForm.provinceId || !addressForm.districtId || !addressForm.wardId) {
      setError('Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện, Phường/Xã.');
      return false;
    }
    if (!addressForm.street || !addressForm.addressLine) {
      setError('Vui lòng nhập Tên đường và Địa chỉ chi tiết.');
      return false;
    }
    return true;
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateAddressForm()) return;

    try {
      const token = getAuthToken();
      if (!token) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      const payload = {
        type: addressForm.type,
        isDefault: addressForm.isDefault,
        name: addressForm.name,
        phone: addressForm.phone,
        addressLine: addressForm.addressLine,
        street: addressForm.street,
        wardId: addressForm.wardId || null, 
        districtId: addressForm.districtId ? Number(addressForm.districtId) : null,
        provinceId: addressForm.provinceId || null, 
      };

      const isEdit = isEditingAddress && editingAddressId;
      const url = '/api/user/addresses';
      const method = isEdit ? 'PUT' : 'POST';

      const body = isEdit
        ? JSON.stringify({ ...payload, addressId: editingAddressId })
        : JSON.stringify(payload);

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        const errRes = await response.json().catch(() => null);
        throw new Error(errRes?.error || 'Không thể lưu địa chỉ');
      }

      const resData = await response.json();

      setSuccess(isEdit ? 'Cập nhật địa chỉ thành công!' : 'Thêm địa chỉ mới thành công!');
      setTimeout(() => setSuccess(null), 3000);

      setIsAddressFormOpen(false);
      resetAddressForm();
      await loadAddresses();
    } catch (err) {
      console.error('Error saving address:', err);
      setError(err.message || 'Lỗi khi lưu địa chỉ');
    }
  };

  const handleDeleteAddress = async (address) => {
    const ok = window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?');
    if (!ok) return;

    try {
      const token = getAuthToken();
      if (!token) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      const response = await fetch(`/api/user/addresses?addressId=${address.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errRes = await response.json().catch(() => null);
        throw new Error(errRes?.error || 'Không thể xóa địa chỉ');
      }

      setSuccess('Xóa địa chỉ thành công!');
      setTimeout(() => setSuccess(null), 3000);
      await loadAddresses();
    } catch (err) {
      console.error('Error deleting address:', err);
      setError(err.message || 'Lỗi khi xóa địa chỉ');
    }
  };

  const handleSetDefaultAddress = async (address) => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      const payload = {
        addressId: address.id,
        type: address.type || 'Shipping',
        isDefault: true,
      };

      const response = await fetch('/api/user/addresses', {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errRes = await response.json().catch(() => null);
        throw new Error(errRes?.error || 'Không thể đặt mặc định');
      }

      setSuccess('Đã đặt địa chỉ mặc định!');
      setTimeout(() => setSuccess(null), 3000);
      await loadAddresses();
    } catch (err) {
      console.error('Error setting default address:', err);
      setError(err.message || 'Lỗi khi đặt địa chỉ mặc định');
    }
  };

  // Load data on mount
  useEffect(() => {
    loadUserData();
    loadOrdersData();
    loadAddresses();
  }, []);

  // Reload orders / addresses when activeMenu changes
  useEffect(() => {
    if (activeMenu === 'tracking') {
      loadOrdersData();
    }
    if (activeMenu === 'addresses') {
      loadAddresses();
    }
  }, [activeMenu]);

  // Handle input change (profile)
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle edit mode (profile)
  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  // Handle save changes (profile)
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
      id: 'addresses',
      label: 'Sổ Địa Chỉ',
      icon: <MapPin size={20} />,
      content: 'addresses'
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
          
          {/* Error/Success Messages (global) */}
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

          {/* ADDRESS BOOK VIEW */}
          {activeMenu === 'addresses' && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h1>Sổ Địa Chỉ</h1>
                <button 
                  className={styles.editButton} 
                  onClick={openNewAddressForm}
                >
                  <Plus size={16} />
                  Thêm địa chỉ mới
                </button>
              </div>

              {/* Danh sách địa chỉ */}
              {addressesLoading ? (
                <div className={styles.ordersLoading}>
                  <div className={styles.spinner}></div>
                  <p>Đang tải danh sách địa chỉ...</p>
                </div>
              ) : addressesError ? (
                <div className={styles.ordersError}>
                  <AlertCircle size={48} className={styles.errorIcon} />
                  <h3>Không thể tải danh sách địa chỉ</h3>
                  <p>{addressesError}</p>
                  <button onClick={loadAddresses} className={styles.retryButton}>
                    Thử lại
                  </button>
                </div>
              ) : addresses.length === 0 ? (
                <div className={styles.emptyOrders}>
                  <MapPin size={64} className={styles.emptyIcon} />
                  <h3>Chưa có địa chỉ nào</h3>
                  <p>Hãy thêm địa chỉ giao hàng đầu tiên của bạn.</p>
                  <button 
                    className={styles.shopNowButton} 
                    onClick={openNewAddressForm}
                  >
                    Thêm địa chỉ mới
                  </button>
                </div>
              ) : (
                <div className={styles.ordersList}>
                  {addresses.map((address) => (
                    <div key={address.id} className={styles.orderCard}>
                      <div className={styles.orderHeader}>
                        <div className={styles.orderInfo}>
                          <h3 className={styles.orderId}>
                            <MapPin size={18} />
                            {address.name}
                          </h3>
                          <p className={styles.orderDate}>
                            {address.phone}
                          </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <span className={styles.orderStatus}>
                            {address.type === 'Billing' ? 'Địa chỉ thanh toán' : 'Địa chỉ giao hàng'}
                          </span>
                          {address.isDefault ? (
                            <span 
                              style={{
                                backgroundColor: '#10b981',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                textAlign: 'center'
                              }}
                            >
                              Mặc định
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className={styles.orderBody}>
                        <div className={styles.orderSummary}>
                          <div className={styles.summaryItem}>
                            <span className={styles.label}>Địa chỉ:</span>
                            <span className={styles.value}>
                              {address.addressLine}
                              {address.street ? `, ${address.street}` : ''}
                            </span>
                          </div>
                          <div className={styles.summaryItem}>
                            <span className={styles.label}>Khu vực:</span>
                            <span className={styles.value}>
                              {address.wardName ? `${address.wardName}, ` : ''}
                              {address.districtName ? `${address.districtName}, ` : ''}
                              {address.provinceName || ''}
                            </span>
                          </div>
                        </div>

                        <div className={styles.shippingInfo}>
                          <h4>Thao tác</h4>
                          <p>
                            <button
                              className={styles.editButton}
                              style={{ padding: '6px 12px', marginRight: 8 }}
                              onClick={() => openEditAddressForm(address)}
                            >
                              <Edit2 size={14} />
                              Sửa
                            </button>
                            {!address.isDefault && (
                              <button
                                className={styles.saveButton}
                                style={{ padding: '6px 12px', marginRight: 8 }}
                                onClick={() => handleSetDefaultAddress(address)}
                              >
                                <CheckCircle2 size={14} />
                                Đặt mặc định
                              </button>
                            )}
                            <button
                              className={styles.cancelButton}
                              style={{ padding: '6px 12px' }}
                              onClick={() => handleDeleteAddress(address)}
                            >
                              <X size={14} />
                              Xóa
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* FORM THÊM / SỬA ĐỊA CHỈ */}
              {isAddressFormOpen && (
                <div className={styles.profileCard} style={{ marginTop: 30 }}>
                  <h2 style={{ marginTop: 0, marginBottom: 20 }}>
                    {isEditingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                  </h2>

                  <form onSubmit={handleSubmitAddress}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Loại địa chỉ</label>
                        <select
                          value={addressForm.type}
                          onChange={(e) => handleAddressFieldChange('type', e.target.value)}
                          className={styles.inputEditable}
                        >
                          <option value="Shipping">Địa chỉ giao hàng</option>
                          <option value="Billing">Địa chỉ thanh toán</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>
                          <input
                            type="checkbox"
                            checked={addressForm.isDefault}
                            onChange={(e) => handleAddressFieldChange('isDefault', e.target.checked)}
                            style={{ marginRight: 8 }}
                          />
                          Đặt làm địa chỉ mặc định
                        </label>
                        <small>Mỗi loại chỉ có tối đa 1 địa chỉ mặc định. Nếu chọn, địa chỉ mặc định cũ sẽ được thay thế.</small>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Tên người nhận</label>
                        <input
                          type="text"
                          value={addressForm.name}
                          onChange={(e) => handleAddressFieldChange('name', e.target.value)}
                          className={styles.inputEditable}
                          placeholder="VD: Nguyễn Văn A"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Số điện thoại</label>
                        <input
                          type="text"
                          value={addressForm.phone}
                          onChange={(e) => handleAddressFieldChange('phone', e.target.value)}
                          className={styles.inputEditable}
                          placeholder="VD: 0901234567"
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Tỉnh / Thành phố</label>
                        <select
                          value={addressForm.provinceId}
                          onChange={(e) => handleProvinceChange(e.target.value)}
                          className={styles.inputEditable}
                        >
                          <option value="">-- Chọn Tỉnh / Thành phố --</option>
                          {provinces.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.ten || p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Quận / Huyện</label>
                        <select
                          value={addressForm.districtId}
                          onChange={(e) => handleDistrictChange(e.target.value)}
                          className={styles.inputEditable}
                          disabled={!addressForm.provinceId}
                        >
                          <option value="">-- Chọn Quận / Huyện --</option>
                          {districts.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.ten || d.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Phường / Xã</label>
                      <select
                        value={addressForm.wardId}
                        onChange={(e) => handleAddressFieldChange('wardId', e.target.value)}
                        className={styles.inputEditable}
                        disabled={!addressForm.districtId}
                      >
                        <option value="">-- Chọn Phường / Xã --</option>
                        {wards.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.ten || w.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Tên đường</label>
                        <input
                          type="text"
                          value={addressForm.street}
                          onChange={(e) => handleAddressFieldChange('street', e.target.value)}
                          className={styles.inputEditable}
                          placeholder="VD: Đường Lý Thái Tổ"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Địa chỉ chi tiết</label>
                        <input
                          type="text"
                          value={addressForm.addressLine}
                          onChange={(e) => handleAddressFieldChange('addressLine', e.target.value)}
                          className={styles.inputEditable}
                          placeholder="VD: Số 6, hẻm 5, nhà A2..."
                        />
                      </div>
                    </div>

                    <div className={styles.buttonGroup}>
                      <button 
                        type="submit"
                        className={styles.saveButton}
                        disabled={addressesLoading}
                      >
                        <Save size={16} />
                        {isEditingAddress ? 'Lưu thay đổi' : 'Lưu địa chỉ'}
                      </button>
                      <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => {
                          setIsAddressFormOpen(false);
                          resetAddressForm();
                        }}
                      >
                        <X size={16} />
                        Hủy
                      </button>
                    </div>
                  </form>
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
