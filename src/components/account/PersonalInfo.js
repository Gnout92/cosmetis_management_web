import { useState } from 'react';
import styles from '../../styles/login.module.css';

const PersonalInfo = ({ user, updateUser, showNotification }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    phone: user?.profile?.phone || '',
    gender: user?.profile?.gender || '',
    birthDate: user?.profile?.birthDate || '',
    avatar: user?.avatar || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await updateUser({
        name: `${formData.firstName} ${formData.lastName}`,
        profile: {
          ...user?.profile,
          ...formData
        }
      });
      
      setIsEditing(false);
      showNotification('Cập nhật thông tin thành công!', 'success');
    } catch (error) {
      showNotification('Có lỗi xảy ra khi cập nhật thông tin', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      phone: user?.profile?.phone || '',
      gender: user?.profile?.gender || '',
      birthDate: user?.profile?.birthDate || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
  };

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Thông tin cá nhân</h1>
        <p className={styles.contentSubtitle}>Quản lý thông tin cá nhân của bạn</p>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Thông tin cơ bản</h2>
          <p className={styles.sectionDescription}>
            Thông tin này sẽ được sử dụng cho việc giao hàng và liên hệ
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            {/* Avatar */}
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1', textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-block', position: 'relative' }}>
                <div className={styles.avatar} style={{ width: '100px', height: '100px', fontSize: '2rem' }}>
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Avatar" />
                  ) : (
                    (formData.firstName || 'U').charAt(0).toUpperCase()
                  )}
                </div>
                {isEditing && (
                  <button 
                    type="button" 
                    className={`${styles.btn} ${styles['btn-secondary']}`}
                    style={{ marginTop: '1rem', fontSize: '0.9rem' }}
                    onClick={() => {
                      // Mở dialog chọn ảnh (giả lập)
                      showNotification('Tính năng upload ảnh sẽ được phát triển', 'warning');
                    }}
                  >
                    📷 Đổi ảnh
                  </button>
                )}
              </div>
            </div>

            {/* Họ */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Họ</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={styles.formInput}
                disabled={!isEditing}
                placeholder="Nhập họ của bạn"
              />
            </div>

            {/* Tên */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tên</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={styles.formInput}
                disabled={!isEditing}
                placeholder="Nhập tên của bạn"
              />
            </div>

            {/* Email (không thể chỉnh sửa) */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input
                type="email"
                value={user?.email || ''}
                className={styles.formInput}
                disabled
                style={{ background: '#f5f5f5', color: '#999' }}
              />
              <small style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                Email không thể thay đổi vì đã liên kết với Google
              </small>
            </div>

            {/* Số điện thoại */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={styles.formInput}
                disabled={!isEditing}
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Giới tính */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Giới tính</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={styles.formInput}
                disabled={!isEditing}
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Ngày sinh */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Ngày sinh</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className={styles.formInput}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Nút hành động */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={`${styles.btn} ${styles['btn-primary']}`}
              >
                ✏️ Chỉnh sửa
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`${styles.btn} ${styles['btn-secondary']}`}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`${styles.btn} ${styles['btn-success']}`}
                >
                  {isLoading ? 'Đang lưu...' : '💾 Lưu thay đổi'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* Thông tin tài khoản */}
      <div className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Thông tin tài khoản</h2>
          <p className={styles.sectionDescription}>
            Thông tin về tài khoản và lịch sử hoạt động
          </p>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Loại tài khoản</label>
            <input
              type="text"
              value="Google Account"
              className={styles.formInput}
              disabled
              style={{ background: '#f5f5f5' }}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Ngày tham gia</label>
            <input
              type="text"
              value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}
              className={styles.formInput}
              disabled
              style={{ background: '#f5f5f5' }}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Điểm thưởng hiện tại</label>
            <input
              type="text"
              value={`${user?.loyaltyPoints || 0} điểm`}
              className={styles.formInput}
              disabled
              style={{ background: '#f5f5f5' }}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tổng đơn hàng</label>
            <input
              type="text"
              value={`${user?.orders?.length || 0} đơn hàng`}
              className={styles.formInput}
              disabled
              style={{ background: '#f5f5f5' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;