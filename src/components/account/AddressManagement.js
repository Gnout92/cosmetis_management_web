import { useState } from 'react';
import styles from '../../styles/login.module.css';

const AddressManagement = ({ user, updateUser, showNotification }) => {
  const [addresses, setAddresses] = useState(user?.profile?.addresses || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      ward: '',
      district: '',
      city: '',
      isDefault: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let newAddresses = [...addresses];
      
      // Nếu đây là địa chỉ mặc định, bỏ mặc định của các địa chỉ khác
      if (formData.isDefault) {
        newAddresses = newAddresses.map(addr => ({ ...addr, isDefault: false }));
      }

      if (editingIndex >= 0) {
        // Chỉnh sửa địa chỉ
        newAddresses[editingIndex] = {
          id: newAddresses[editingIndex].id,
          ...formData,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Thêm địa chỉ mới
        const newAddress = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        newAddresses.push(newAddress);
      }

      // Nếu đây là địa chỉ đầu tiên, tự động đặt làm mặc định
      if (newAddresses.length === 1) {
        newAddresses[0].isDefault = true;
      }

      await updateUser({
        profile: {
          ...user?.profile,
          addresses: newAddresses
        }
      });

      setAddresses(newAddresses);
      setShowAddForm(false);
      setEditingIndex(-1);
      resetForm();
      
      showNotification(
        editingIndex >= 0 ? 'Cập nhật địa chỉ thành công!' : 'Thêm địa chỉ thành công!', 
        'success'
      );
    } catch (error) {
      showNotification('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (index) => {
    const address = addresses[index];
    setFormData(address);
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleDelete = async (index) => {
    if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      try {
        const newAddresses = addresses.filter((_, i) => i !== index);
        
        // Nếu xóa địa chỉ mặc định và còn địa chỉ khác, đặt địa chỉ đầu tiên làm mặc định
        if (addresses[index].isDefault && newAddresses.length > 0) {
          newAddresses[0].isDefault = true;
        }

        await updateUser({
          profile: {
            ...user?.profile,
            addresses: newAddresses
          }
        });

        setAddresses(newAddresses);
        showNotification('Xóa địa chỉ thành công!', 'success');
      } catch (error) {
        showNotification('Có lỗi xảy ra khi xóa địa chỉ', 'error');
      }
    }
  };

  const handleSetDefault = async (index) => {
    try {
      const newAddresses = addresses.map((addr, i) => ({
        ...addr,
        isDefault: i === index
      }));

      await updateUser({
        profile: {
          ...user?.profile,
          addresses: newAddresses
        }
      });

      setAddresses(newAddresses);
      showNotification('Đã đặt làm địa chỉ mặc định!', 'success');
    } catch (error) {
      showNotification('Có lỗi xảy ra', 'error');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingIndex(-1);
    resetForm();
  };

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Địa chỉ giao hàng</h1>
        <p className={styles.contentSubtitle}>Quản lý địa chỉ giao hàng của bạn</p>
      </div>

      {/* Nút thêm địa chỉ */}
      {!showAddForm && (
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => setShowAddForm(true)}
            className={`${styles.btn} ${styles['btn-primary']}`}
          >
            ➕ Thêm địa chỉ mới
          </button>
        </div>
      )}

      {/* Form thêm/sửa địa chỉ */}
      {showAddForm && (
        <div className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {editingIndex >= 0 ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Họ tên người nhận</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                  placeholder="Nhập họ tên"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Địa chỉ cụ thể</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={styles.formInput}
                required
                placeholder="Số nhà, tên đường"
              />
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phường/Xã</label>
                <input
                  type="text"
                  name="ward"
                  value={formData.ward}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                  placeholder="Nhập phường/xã"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Quận/Huyện</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                  placeholder="Nhập quận/huyện"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tỉnh/Thành phố</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                  placeholder="Nhập tỉnh/thành phố"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                />
                Đặt làm địa chỉ mặc định
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
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
                {isLoading ? 'Đang lưu...' : (
                  editingIndex >= 0 ? '💾 Cập nhật' : '💾 Lưu địa chỉ'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Danh sách địa chỉ */}
      {addresses.length > 0 ? (
        <div className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Danh sách địa chỉ ({addresses.length})</h2>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {addresses.map((address, index) => (
              <div key={address.id} style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '1.5rem',
                background: address.isDefault ? 'linear-gradient(135deg, rgba(255, 107, 157, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)' : 'white',
                position: 'relative'
              }}>
                {address.isDefault && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #ff6b9d 0%, #9c27b0 100%)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '25px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    ⭐ Mặc định
                  </div>
                )}

                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                    {address.name}
                  </h3>
                  <p style={{ margin: '0', color: '#666', fontSize: '0.95rem' }}>
                    📞 {address.phone}
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem', color: '#333', lineHeight: '1.5' }}>
                  <p style={{ margin: '0' }}>{address.address}</p>
                  <p style={{ margin: '0' }}>
                    {address.ward}, {address.district}, {address.city}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleEdit(index)}
                    className={`${styles.btn} ${styles['btn-secondary']}`}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    ✏️ Chỉnh sửa
                  </button>
                  
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(index)}
                      className={`${styles.btn} ${styles['btn-primary']}`}
                      style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    >
                      ⭐ Đặt làm mặc định
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(index)}
                    className={`${styles.btn} ${styles['btn-danger']}`}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !showAddForm && (
          <div className={styles.contentSection} style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📍</div>
            <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>Chưa có địa chỉ nào</h3>
            <p style={{ color: '#999', marginBottom: '2rem' }}>Thêm địa chỉ giao hàng để mua sắm dễ dàng hơn</p>
            <button
              onClick={() => setShowAddForm(true)}
              className={`${styles.btn} ${styles['btn-primary']}`}
            >
              ➕ Thêm địa chỉ đầu tiên
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default AddressManagement;