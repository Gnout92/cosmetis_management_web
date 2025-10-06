import { useState } from 'react';
import styles from '../../styles/login.module.css';

const PaymentMethods = ({ user, updateUser, showNotification }) => {
  const [paymentMethods, setPaymentMethods] = useState(user?.paymentMethods || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [formData, setFormData] = useState({
    type: 'card', // card, bank, ewallet
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    ewalletType: '', // momo, zalopay, vnpay
    ewalletPhone: '',
    isDefault: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      type: 'card',
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      ewalletType: '',
      ewalletPhone: '',
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
      let newPaymentMethods = [...paymentMethods];
      
      // Nếu đây là phương thức mặc định, bỏ mặc định của các phương thức khác
      if (formData.isDefault) {
        newPaymentMethods = newPaymentMethods.map(method => ({ ...method, isDefault: false }));
      }

      const paymentData = {
        id: editingIndex >= 0 ? newPaymentMethods[editingIndex].id : Date.now().toString(),
        ...formData,
        createdAt: editingIndex >= 0 ? newPaymentMethods[editingIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Mặt nạ số thẻ (chỉ hiển thị 4 số cuối)
      if (paymentData.type === 'card' && paymentData.cardNumber) {
        paymentData.maskedCardNumber = '**** **** **** ' + paymentData.cardNumber.slice(-4);
      }

      if (editingIndex >= 0) {
        newPaymentMethods[editingIndex] = paymentData;
      } else {
        newPaymentMethods.push(paymentData);
      }

      // Nếu đây là phương thức đầu tiên, tự động đặt làm mặc định
      if (newPaymentMethods.length === 1) {
        newPaymentMethods[0].isDefault = true;
      }

      await updateUser({
        paymentMethods: newPaymentMethods
      });

      setPaymentMethods(newPaymentMethods);
      setShowAddForm(false);
      setEditingIndex(-1);
      resetForm();
      
      showNotification(
        editingIndex >= 0 ? 'Cập nhật phương thức thanh toán thành công!' : 'Thêm phương thức thanh toán thành công!', 
        'success'
      );
    } catch (error) {
      showNotification('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (index) => {
    const method = paymentMethods[index];
    setFormData(method);
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleDelete = async (index) => {
    if (window.confirm('Bạn có chắc muốn xóa phương thức thanh toán này?')) {
      try {
        const newPaymentMethods = paymentMethods.filter((_, i) => i !== index);
        
        // Nếu xóa phương thức mặc định và còn phương thức khác, đặt phương thức đầu tiên làm mặc định
        if (paymentMethods[index].isDefault && newPaymentMethods.length > 0) {
          newPaymentMethods[0].isDefault = true;
        }

        await updateUser({
          paymentMethods: newPaymentMethods
        });

        setPaymentMethods(newPaymentMethods);
        showNotification('Xóa phương thức thanh toán thành công!', 'success');
      } catch (error) {
        showNotification('Có lỗi xảy ra khi xóa phương thức thanh toán', 'error');
      }
    }
  };

  const handleSetDefault = async (index) => {
    try {
      const newPaymentMethods = paymentMethods.map((method, i) => ({
        ...method,
        isDefault: i === index
      }));

      await updateUser({
        paymentMethods: newPaymentMethods
      });

      setPaymentMethods(newPaymentMethods);
      showNotification('Đã đặt làm phương thức thanh toán mặc định!', 'success');
    } catch (error) {
      showNotification('Có lỗi xảy ra', 'error');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingIndex(-1);
    resetForm();
  };

  const getPaymentIcon = (type, subType) => {
    switch (type) {
      case 'card':
        return '💳';
      case 'bank':
        return '🏦';
      case 'ewallet':
        switch (subType) {
          case 'momo': return '🐵';
          case 'zalopay': return '🐙';
          case 'vnpay': return '💵';
          default: return '📱';
        }
      default:
        return '💳';
    }
  };

  const getPaymentLabel = (method) => {
    switch (method.type) {
      case 'card':
        return `Thẻ tín dụng ${method.maskedCardNumber || '**** **** **** ' + method.cardNumber?.slice(-4)}`;
      case 'bank':
        return `${method.bankName} - ${method.accountNumber?.slice(-4)}`;
      case 'ewallet':
        const walletNames = {
          momo: 'MoMo',
          zalopay: 'ZaloPay',
          vnpay: 'VNPay'
        };
        return `${walletNames[method.ewalletType]} - ${method.ewalletPhone?.slice(-4)}`;
      default:
        return 'Phương thức thanh toán';
    }
  };

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Phương thức thanh toán</h1>
        <p className={styles.contentSubtitle}>Quản lý các phương thức thanh toán của bạn</p>
      </div>

      {/* Nút thêm phương thức thanh toán */}
      {!showAddForm && (
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => setShowAddForm(true)}
            className={`${styles.btn} ${styles['btn-primary']}`}
          >
            ➕ Thêm phương thức thanh toán
          </button>
        </div>
      )}

      {/* Form thêm/sửa phương thức thanh toán */}
      {showAddForm && (
        <div className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {editingIndex >= 0 ? 'Chỉnh sửa phương thức thanh toán' : 'Thêm phương thức thanh toán'}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Loại phương thức */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Loại phương thức</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              >
                <option value="card">Thẻ tín dụng/Ghi nợ</option>
                <option value="bank">Tài khoản ngân hàng</option>
                <option value="ewallet">Ví điện tử</option>
              </select>
            </div>

            {/* Thông tin thẻ tín dụng */}
            {formData.type === 'card' && (
              <>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Số thẻ</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Ngày hết hạn</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tên chủ thẻ</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={formData.cardHolder}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Tên trên thẻ"
                    required
                  />
                </div>
              </>
            )}

            {/* Thông tin ngân hàng */}
            {formData.type === 'bank' && (
              <>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Tên ngân hàng</label>
                    <select
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      required
                    >
                      <option value="">Chọn ngân hàng</option>
                      <option value="Vietcombank">Vietcombank</option>
                      <option value="BIDV">BIDV</option>
                      <option value="Agribank">Agribank</option>
                      <option value="Techcombank">Techcombank</option>
                      <option value="MB Bank">MB Bank</option>
                      <option value="VPBank">VPBank</option>
                      <option value="ACB">ACB</option>
                      <option value="Sacombank">Sacombank</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Số tài khoản</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Số tài khoản"
                      required
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tên chủ tài khoản</label>
                  <input
                    type="text"
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Tên chủ tài khoản"
                    required
                  />
                </div>
              </>
            )}

            {/* Thông tin ví điện tử */}
            {formData.type === 'ewallet' && (
              <>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Loại ví</label>
                    <select
                      name="ewalletType"
                      value={formData.ewalletType}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      required
                    >
                      <option value="">Chọn ví điện tử</option>
                      <option value="momo">MoMo</option>
                      <option value="zalopay">ZaloPay</option>
                      <option value="vnpay">VNPay</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Số điện thoại</label>
                    <input
                      type="tel"
                      name="ewalletPhone"
                      value={formData.ewalletPhone}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Số điện thoại ví"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                />
                Đặt làm phương thức thanh toán mặc định
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
                  editingIndex >= 0 ? '💾 Cập nhật' : '💾 Lưu phương thức'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Danh sách phương thức thanh toán */}
      {paymentMethods.length > 0 ? (
        <div className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Phương thức thanh toán của bạn ({paymentMethods.length})</h2>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {paymentMethods.map((method, index) => (
              <div key={method.id} style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '1.5rem',
                background: method.isDefault ? 'linear-gradient(135deg, rgba(255, 107, 157, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)' : 'white',
                position: 'relative'
              }}>
                {method.isDefault && (
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>
                    {getPaymentIcon(method.type, method.ewalletType)}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                      {getPaymentLabel(method)}
                    </h3>
                    <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                      {method.type === 'card' && method.cardHolder}
                      {method.type === 'bank' && method.accountHolder}
                      {method.type === 'ewallet' && `Ví ${method.ewalletType?.toUpperCase()}`}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleEdit(index)}
                    className={`${styles.btn} ${styles['btn-secondary']}`}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    ✏️ Chỉnh sửa
                  </button>
                  
                  {!method.isDefault && (
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
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💳</div>
            <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>Chưa có phương thức thanh toán nào</h3>
            <p style={{ color: '#999', marginBottom: '2rem' }}>Thêm phương thức thanh toán để thanh toán nhanh chóng hơn</p>
            <button
              onClick={() => setShowAddForm(true)}
              className={`${styles.btn} ${styles['btn-primary']}`}
            >
              ➕ Thêm phương thức đầu tiên
            </button>
          </div>
        )
      )}

      {/* Lưu ý bảo mật */}
      <div className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🔒 Bảo mật thông tin</h2>
        </div>
        <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
          <ul style={{ margin: '0', paddingLeft: '1.5rem', color: '#666' }}>
            <li style={{ marginBottom: '0.5rem' }}>Thông tin thanh toán của bạn được mã hóa và bảo mật tuyệt đối</li>
            <li style={{ marginBottom: '0.5rem' }}>Chúng tôi không lưu trữ thông tin thẻ tín dụng trên hệ thống</li>
            <li style={{ marginBottom: '0.5rem' }}>Tất cả giao dịch được xử lý qua cổng thanh toán an toàn</li>
            <li>Bạn có thể xóa phương thức thanh toán bất kỳ lúc nào</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;