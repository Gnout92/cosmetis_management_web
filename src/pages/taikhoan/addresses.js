import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/taikhoan.module.css';
import {
  User,
  Package,
  LogOut,
  MapPin,
  Plus,
  Edit2,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { getAuthToken } from '../../lib/authToken';

const AccountAddressesPage = () => {
  const router = useRouter();

  // User info for sidebar
  const [userInfo, setUserInfo] = useState({
    username: '',
    displayName: '',
    email: '',
    avatar: '',
  });
  const [loadingUser, setLoadingUser] = useState(true);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Address states
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressesError, setAddressesError] = useState(null);

  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [addressForm, setAddressForm] = useState({
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

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

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

  // ===== LOAD ADDRESSES =====
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
          Authorization: token,
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

  // ===== LOAD LOCATION DATA =====
  const loadProvinces = async () => {
    try {
      const response = await fetch('/api/locations/provinces');
      if (!response.ok)
        throw new Error('Không thể tải danh sách Tỉnh/Thành phố');
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
      const response = await fetch(
        `/api/locations/districts?provinceId=${provinceId}`
      );
      if (!response.ok)
        throw new Error('Không thể tải danh sách Quận/Huyện');
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
      const response = await fetch(
        `/api/locations/wards?districtId=${districtId}`
      );
      if (!response.ok) throw new Error('Không thể tải danh sách Phường/Xã');
      const data = await response.json();
      setWards(data.wards || []);
    } catch (err) {
      console.error('Error loading wards:', err);
      setWards([]);
    }
  };

  // ===== ADDRESS HELPERS =====
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
        districtId: addressForm.districtId
          ? Number(addressForm.districtId)
          : null,
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
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        const errRes = await response.json().catch(() => null);
        throw new Error(errRes?.error || 'Không thể lưu địa chỉ');
      }

      setSuccess(
        isEdit ? 'Cập nhật địa chỉ thành công!' : 'Thêm địa chỉ mới thành công!'
      );
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

      const response = await fetch(
        `/api/user/addresses?addressId=${address.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );

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
          Authorization: token,
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

  // ===== EFFECT =====
  useEffect(() => {
    loadUserData();
    loadAddresses();
  }, []);

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

  const currentMenu = 'addresses';

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
                        <p className={styles.orderDate}>{address.phone}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <span className={styles.orderStatus}>
                          {address.type === 'Billing'
                            ? 'Địa chỉ thanh toán'
                            : 'Địa chỉ giao hàng'}
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
                              textAlign: 'center',
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
                            {address.districtName
                              ? `${address.districtName}, `
                              : ''}
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
                        onChange={(e) =>
                          handleAddressFieldChange('type', e.target.value)
                        }
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
                          onChange={(e) =>
                            handleAddressFieldChange(
                              'isDefault',
                              e.target.checked
                            )
                          }
                          style={{ marginRight: 8 }}
                        />
                        Đặt làm địa chỉ mặc định
                      </label>
                      <small>
                        Mỗi loại chỉ có tối đa 1 địa chỉ mặc định. Nếu chọn, địa
                        chỉ mặc định cũ sẽ được thay thế.
                      </small>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Tên người nhận</label>
                      <input
                        type="text"
                        value={addressForm.name}
                        onChange={(e) =>
                          handleAddressFieldChange('name', e.target.value)
                        }
                        className={styles.inputEditable}
                        placeholder="VD: Nguyễn Văn A"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Số điện thoại</label>
                      <input
                        type="text"
                        value={addressForm.phone}
                        onChange={(e) =>
                          handleAddressFieldChange('phone', e.target.value)
                        }
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
                        <option value="">
                          -- Chọn Tỉnh / Thành phố --
                        </option>
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
                      onChange={(e) =>
                        handleAddressFieldChange('wardId', e.target.value)
                      }
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
                        onChange={(e) =>
                          handleAddressFieldChange('street', e.target.value)
                        }
                        className={styles.inputEditable}
                        placeholder="VD: Đường Lý Thái Tổ"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Địa chỉ chi tiết</label>
                      <input
                        type="text"
                        value={addressForm.addressLine}
                        onChange={(e) =>
                          handleAddressFieldChange('addressLine', e.target.value)
                        }
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
        </main>
      </div>
    </div>
  );
};

export default AccountAddressesPage;
