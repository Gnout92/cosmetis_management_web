import { useState, useEffect } from 'react';
import styles from '../../styles/login.module.css';

const SecuritySettings = ({ user, showNotification }) => {
  const [activeDevices, setActiveDevices] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    deviceRemember: true,
    passwordExpiry: 90
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Giả lập tải dữ liệu bảo mật
    const loadSecurityData = async () => {
      setIsLoading(true);
      try {
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dữ liệu giả lập - thiết bị đăng nhập
        const mockDevices = [
          {
            id: 'device_1',
            deviceName: 'Chrome on Windows',
            deviceType: 'desktop',
            location: 'Ho Chi Minh City, Vietnam',
            ipAddress: '192.168.1.100',
            lastActive: '2024-01-25T14:30:00Z',
            isCurrent: true
          },
          {
            id: 'device_2',
            deviceName: 'Safari on iPhone',
            deviceType: 'mobile',
            location: 'Ho Chi Minh City, Vietnam',
            ipAddress: '192.168.1.101',
            lastActive: '2024-01-24T09:15:00Z',
            isCurrent: false
          },
          {
            id: 'device_3',
            deviceName: 'Chrome on Android',
            deviceType: 'mobile',
            location: 'Hanoi, Vietnam',
            ipAddress: '10.0.0.50',
            lastActive: '2024-01-20T18:20:00Z',
            isCurrent: false
          }
        ];

        // Dữ liệu giả lập - lịch sử đăng nhập
        const mockLoginHistory = [
          {
            id: 'login_1',
            timestamp: '2024-01-25T14:30:00Z',
            device: 'Chrome on Windows',
            location: 'Ho Chi Minh City, Vietnam',
            ipAddress: '192.168.1.100',
            status: 'success',
            method: 'google'
          },
          {
            id: 'login_2',
            timestamp: '2024-01-24T09:15:00Z',
            device: 'Safari on iPhone',
            location: 'Ho Chi Minh City, Vietnam',
            ipAddress: '192.168.1.101',
            status: 'success',
            method: 'google'
          },
          {
            id: 'login_3',
            timestamp: '2024-01-20T18:20:00Z',
            device: 'Chrome on Android',
            location: 'Hanoi, Vietnam',
            ipAddress: '10.0.0.50',
            status: 'success',
            method: 'google'
          },
          {
            id: 'login_4',
            timestamp: '2024-01-18T22:45:00Z',
            device: 'Unknown Device',
            location: 'Unknown Location',
            ipAddress: '203.162.4.100',
            status: 'failed',
            method: 'google'
          }
        ];

        setActiveDevices(mockDevices);
        setLoginHistory(mockLoginHistory);
      } catch (error) {
        showNotification('Không thể tải thông tin bảo mật', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadSecurityData();
  }, []);

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'desktop': return '💻';
      case 'mobile': return '📱';
      case 'tablet': return '📱';
      default: return '💻';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  const handleLogoutDevice = async (deviceId) => {
    if (window.confirm('Bạn có chắc muốn đăng xuất thiết bị này?')) {
      try {
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setActiveDevices(activeDevices.filter(device => device.id !== deviceId));
        showNotification('Đã đăng xuất thiết bị thành công', 'success');
      } catch (error) {
        showNotification('Có lỗi xảy ra', 'error');
      }
    }
  };

  const handleLogoutAllDevices = async () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất tất cả thiết bị khác (trừ thiết bị hiện tại)?')) {
      try {
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setActiveDevices(activeDevices.filter(device => device.isCurrent));
        showNotification('Đã đăng xuất tất cả thiết bị khác', 'success');
      } catch (error) {
        showNotification('Có lỗi xảy ra', 'error');
      }
    }
  };

  const handleSecuritySettingChange = async (setting, value) => {
    try {
      setSecuritySettings(prev => ({ ...prev, [setting]: value }));
      showNotification('Cập nhật cài đặt bảo mật thành công', 'success');
    } catch (error) {
      showNotification('Có lỗi xảy ra', 'error');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification('Mật khẩu xác nhận không khớp', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showNotification('Mật khẩu mới phải có ít nhất 8 ký tự', 'error');
      return;
    }

    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
      showNotification('Đổi mật khẩu thành công', 'success');
    } catch (error) {
      showNotification('Có lỗi xảy ra khi đổi mật khẩu', 'error');
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className={styles.contentHeader}>
          <h1 className={styles.contentTitle}>Bảo mật</h1>
          <p className={styles.contentSubtitle}>Đang tải...</p>
        </div>
        <div className={styles.contentSection} style={{ textAlign: 'center', padding: '3rem' }}>
          <div className={styles.loadingSpinner} style={{ margin: '0 auto', width: '40px', height: '40px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Bảo mật tài khoản</h1>
        <p className={styles.contentSubtitle}>Quản lý bảo mật và quyền truy cập tài khoản của bạn</p>
      </div>

      {/* Thông tin tài khoản */}
      <div className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🔒 Thông tin đăng nhập</h2>
          <p className={styles.sectionDescription}>Quản lý thông tin đăng nhập và mật khẩu</p>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email đăng nhập</label>
            <input
              type="email"
              value={user?.email || ''}
              className={styles.formInput}
              disabled
              style={{ background: '#f5f5f5' }}
            />
            <small style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
              Đăng nhập bằng Google OAuth - không thể thay đổi
            </small>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phương thức đăng nhập</label>
            <input
              type="text"
              value="Google OAuth 2.0"
              className={styles.formInput}
              disabled
              style={{ background: '#f5f5f5' }}
            />
            <small style={{ color: '#4caf50', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
              ✓ Bảo mật cao với chuẩn OAuth 2.0
            </small>
          </div>
        </div>

        {!showChangePassword ? (
          <div style={{ marginTop: '1.5rem' }}>
            <button
              onClick={() => setShowChangePassword(true)}
              className={`${styles.btn} ${styles['btn-primary']}`}
            >
              🔑 Đổi mật khẩu
            </button>
            <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Lời khuyên: Bằng việc sử dụng Google OAuth, mật khẩu của bạn được Google quản lý an toàn
            </p>
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} style={{ marginTop: '1.5rem' }}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className={styles.formInput}
                  required
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className={styles.formInput}
                  required
                  placeholder="Nhập mật khẩu mới"
                  minLength="8"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={styles.formInput}
                  required
                  placeholder="Nhập lại mật khẩu mới"
                  minLength="8"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className={`${styles.btn} ${styles['btn-secondary']}`}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={`${styles.btn} ${styles['btn-success']}`}
              >
                💾 Đổi mật khẩu
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Cài đặt bảo mật */}
      <div className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>⚙️ Cài đặt bảo mật</h2>
          <p className={styles.sectionDescription}>Tùy chỉnh các cài đặt bảo mật cho tài khoản</p>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={securitySettings.twoFactorEnabled}
                onChange={(e) => handleSecuritySettingChange('twoFactorEnabled', e.target.checked)}
              />
              🔒 Xác thực hai yếu tố (2FA)
            </label>
            <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
              Thêm lớp bảo vệ bằng mã xác thực SMS hoặc app
            </small>
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={securitySettings.loginAlerts}
                onChange={(e) => handleSecuritySettingChange('loginAlerts', e.target.checked)}
              />
              📧 Cảnh báo đăng nhập
            </label>
            <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
              Nhận email khi có đăng nhập từ thiết bị mới
            </small>
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={securitySettings.deviceRemember}
                onChange={(e) => handleSecuritySettingChange('deviceRemember', e.target.checked)}
              />
              📱 Ghi nhớ thiết bị
            </label>
            <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
              Giữ đăng nhập trên các thiết bị đáng tin cậy
            </small>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tự động đăng xuất sau (ngày)</label>
            <select
              value={securitySettings.passwordExpiry}
              onChange={(e) => handleSecuritySettingChange('passwordExpiry', parseInt(e.target.value))}
              className={styles.formInput}
            >
              <option value={30}>30 ngày</option>
              <option value={60}>60 ngày</option>
              <option value={90}>90 ngày</option>
              <option value={180}>180 ngày</option>
              <option value={-1}>Không bao giờ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Thiết bị đăng nhập */}
      <div className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>📱 Thiết bị đăng nhập ({activeDevices.length})</h2>
          <p className={styles.sectionDescription}>Các thiết bị đang đăng nhập vào tài khoản của bạn</p>
        </div>

        {activeDevices.length > 1 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={handleLogoutAllDevices}
              className={`${styles.btn} ${styles['btn-danger']}`}
              style={{ fontSize: '0.9rem' }}
            >
              🚪 Đăng xuất tất cả thiết bị khác
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gap: '1rem' }}>
          {activeDevices.map((device) => (
            <div key={device.id} style={{
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              padding: '1.5rem',
              background: device.isCurrent ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.05) 100%)' : 'white',
              position: 'relative'
            }}>
              {device.isCurrent && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#4caf50',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '25px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  • Hiện tại
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ fontSize: '2rem' }}>
                  {getDeviceIcon(device.deviceType)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                    {device.deviceName}
                  </h3>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                    📍 {device.location}
                  </p>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                    🌐 IP: {device.ipAddress}
                  </p>
                  <p style={{ margin: '0', color: '#999', fontSize: '0.85rem' }}>
                    Hoạt động cuối: {new Date(device.lastActive).toLocaleString('vi-VN')}
                  </p>
                </div>
                {!device.isCurrent && (
                  <button
                    onClick={() => handleLogoutDevice(device.id)}
                    className={`${styles.btn} ${styles['btn-danger']}`}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    🚪 Đăng xuất
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lịch sử đăng nhập */}
      <div className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>📅 Lịch sử đăng nhập</h2>
          <p className={styles.sectionDescription}>Các lần đăng nhập gần đây (10 lần cuối)</p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Trạng thái</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Thời gian</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Thiết bị</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Vị trí</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>IP</th>
              </tr>
            </thead>
            <tbody>
              {loginHistory.map((login) => (
                <tr key={login.id}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getStatusIcon(login.status)}
                      <span style={{ color: login.status === 'success' ? '#4caf50' : '#f44336' }}>
                        {login.status === 'success' ? 'Thành công' : 'Thất bại'}
                      </span>
                    </span>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem' }}>
                    {new Date(login.timestamp).toLocaleString('vi-VN')}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem' }}>
                    {login.device}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem' }}>
                    {login.location}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                    {login.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lời khuyên bảo mật */}
      <div className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🛁 Lời khuyên bảo mật</h2>
        </div>
        <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
          <ul style={{ margin: '0', paddingLeft: '1.5rem', color: '#666' }}>
            <li style={{ marginBottom: '0.5rem' }}>Sử dụng mật khẩu mạnh và duy nhất cho mỗi tài khoản</li>
            <li style={{ marginBottom: '0.5rem' }}>Bật thông báo đăng nhập để phát hiện truy cập bất thường</li>
            <li style={{ marginBottom: '0.5rem' }}>Thường xuyên kiểm tra danh sách thiết bị đăng nhập</li>
            <li style={{ marginBottom: '0.5rem' }}>Đăng xuất khỏi các thiết bị công cộng sau khi sử dụng</li>
            <li>Không chia sẻ thông tin đăng nhập với bất kỳ ai</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;