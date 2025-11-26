import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/taikhoan.module.css';
import {
  User,
  Package,
  LogOut,
  Edit2,
  Save,
  X,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { getAuthToken } from '../../lib/authToken';

const AccountProfilePage = () => {
  const router = useRouter();

  // Thông tin user dùng cho avatar + form
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    avatar: '',
    firstName: '',
    lastName: '',
    role: 'Customer',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ===== LOAD USER DATA =====
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
        setFormData({
          username: data.user.username || '',
          displayName: data.user.displayName || '',
          email: data.user.email || '',
          avatar: data.user.avatar || '/images/default-avatar.png',
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          role: data.user.role || 'Customer',
        });
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError(err.message || 'Lỗi khi tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  // ===== PROFILE HANDLERS =====
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

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
        lastName: formData.lastName,
      };

      const response = await fetch('/api/user/updateProfile', {
        method: 'PUT',
        headers: {
          Authorization: token,
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

  const handleCancel = () => {
    setIsEditing(false);
    loadUserData();
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

  // ===== SIDEBAR MENU =====
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

  // Trang hiện tại = profile
  const currentMenu = 'profile';

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
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.avatarSection}>
              <img
                src={formData.avatar || '/images/default-avatar.png'}
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
                  onChange={(e) =>
                    handleInputChange('displayName', e.target.value)
                  }
                  readOnly={!isEditing}
                  className={
                    isEditing ? styles.inputEditable : styles.inputReadonly
                  }
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
                    onChange={(e) =>
                      handleInputChange('firstName', e.target.value)
                    }
                    readOnly={!isEditing}
                    className={
                      isEditing ? styles.inputEditable : styles.inputReadonly
                    }
                    placeholder="Nhập họ"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Tên</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange('lastName', e.target.value)
                    }
                    readOnly={!isEditing}
                    className={
                      isEditing ? styles.inputEditable : styles.inputReadonly
                    }
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
        </main>
      </div>
    </div>
  );
};

export default AccountProfilePage;
