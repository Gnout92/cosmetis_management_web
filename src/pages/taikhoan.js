
import React, { useState, useEffect } from 'react';
import styles from '../styles/taikhoan.module.css';

const TaikhoanPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ✅ FIXED: Enhanced token handling với multiple fallback strategies
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      let token = localStorage.getItem('authToken');
      
      if (!token) {
        console.warn('⚠️ No token found in localStorage');
        return null;
      }
      
      // Auto-fix: Add Bearer prefix nếu thiếu
      if (!token.startsWith('Bearer ')) {
        console.log('🔧 Auto-adding Bearer prefix to token');
        token = `Bearer ${token}`;
        localStorage.setItem('authToken', token); // Save fixed format
      }
      
      return token;
    }
    return null;
  };

  // ✅ FIXED: Load user data với enhanced error handling
  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      
      // Validate token trước khi gọi API
      if (!token) {
        setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
        setLoading(false);
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }, 2000);
        return;
      }

      console.log('🔍 Token for API call:', token.substring(0, 20) + '...');
      
      const response = await fetch('/api/user/getProfile', {
        method: 'GET',
        headers: {
          'Authorization': token, // ✅ ĐÚNG: Bearer prefix được tự động thêm vào
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 API Response Status:', response.status);
      console.log('📡 API Response OK:', response.ok);

      // Handle non-200 responses
      if (!response.ok) {
        let errorMessage = 'Failed to load user data';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `HTTP ${response.status}`;
          console.log('📡 API Error Data:', errorData);
          
          // Enhanced error handling for 401
          if (response.status === 401) {
            console.error('❌ Authentication failed!');
            console.error('Token format:', token);
            console.error('💡 Try this fix:', 'localStorage.setItem("authToken", "Bearer 1"); location.reload();');
            errorMessage = 'Token không hợp lệ. Mở Console (F12) và chạy: localStorage.setItem("authToken", "Bearer 1"); location.reload();';
          }
        } catch (parseError) {
          console.warn('Could not parse error response:', parseError);
          if (response.status === 401) {
            errorMessage = 'Token xác thực không hợp lệ. Mở Console và chạy: localStorage.setItem("authToken", "Bearer 1"); location.reload();';
          } else if (response.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            errorMessage = `Request failed with status ${response.status}`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data) {
        throw new Error('Invalid response format');
      }
      
      if (data.success && data.data) {
        setFormData({
          username: data.data.ten_dang_nhap || '',
          displayName: data.data.ten_hien_thi || '',
          email: data.data.email || ''
        });
        console.log('✅ User data loaded successfully:', data.data);
      } else if (data.message) {
        throw new Error(data.message);
      } else {
        throw new Error('Invalid response format from server');
      }

    } catch (err) {
      console.error('Error loading user data:', err);
      
      let userFriendlyError = 'Failed to load user data';
      if (err.message) {
        if (err.message.includes('Authentication') || err.message.includes('401') || err.message.includes('Token')) {
          userFriendlyError = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại hoặc chạy: localStorage.setItem("authToken", "Bearer 1"); location.reload();';
        } else if (err.message.includes('database') || err.message.includes('500')) {
          userFriendlyError = 'Máy chủ tạm thời không khả dụng. Vui lòng thử lại sau.';
        } else {
          userFriendlyError = err.message;
        }
      }
      
      setError(userFriendlyError);
    } finally {
      setLoading(false);
    }
  };

  // Load user data from API
  useEffect(() => {
    loadUserData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  // ✅ FIXED: Save function với enhanced token handling
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const token = getAuthToken();
      
      if (!token) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setLoading(false);
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }, 2000);
        return;
      }
      
      const updateData = {
        ten_hien_thi: formData.displayName
      };

      const response = await fetch('/api/user/updateProfile', {
        method: 'PUT',
        headers: {
          'Authorization': token, // ✅ ĐÚNG: Bearer prefix được tự động thêm vào
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Failed to save changes'
        }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
        
        if (data.data) {
          setFormData(prev => ({
            ...prev,
            displayName: data.data.ten_hien_thi || prev.displayName
          }));
        }

        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(data.message || 'Update failed');
      }

    } catch (err) {
      console.error('Error saving changes:', err);
      setError(`Failed to save changes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleClear = (field) => {
    handleInputChange(field, '');
  };



  if (loading && !formData.username) {
    return (
      <div className={styles.loadingContainer}>
        <div>Loading...</div>
        <p>Loading your account information</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.accountContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Thông Tin Tài Khoản</h1>
          
        </div>

        <div className={styles.content}>
          {/* Error Message */}
          {error && (
            <div className={styles.errorMessage}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L12 12M12 12L16 16M12 12L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="19" r="1" fill="currentColor"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className={styles.successMessage}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {success}
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.sectionIcon}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2>Profile Information</h2>
            </div>
            
            <div className={styles.profileCard}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Username
                  <span className={styles.fieldNote}>(Cannot be changed)</span>
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    value={formData.username}
                    readOnly
                    className={`${styles.inputField} ${styles.readOnlyInput}`}
                    placeholder="Your username"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Display Name
                  <span className={styles.fieldNote}>(This name will be visible to others)</span>
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    readOnly={!isEditing}
                    className={`${styles.inputField} ${isEditing ? styles.editableInput : styles.readOnlyInput}`}
                    placeholder="Enter your display name"
                  />
                  {isEditing && (
                    <button
                      className={styles.clearButton}
                      onClick={() => handleClear('displayName')}
                      type="button"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Email Address
                  <span className={styles.fieldNote}>(We'll use this for important notifications)</span>
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className={`${styles.inputField} ${styles.readOnlyInput}`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>



              <div className={styles.buttonGroup}>
                {!isEditing ? (
                  <button
                    className={styles.editButton}
                    onClick={handleEdit}
                    disabled={loading}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      className={styles.saveButton}
                      onClick={handleSave}
                      disabled={loading}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>



          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.sectionIcon}>
                <path d="M3 21v-2a4 4 0 0 1 4-4h13.8a1 1 0 0 1 .8 1.6L14.25 21l2.55 3.4A1 1 0 0 0 18.5 22h-13a2 2 0 0 1-2-2v-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="15,3 21,3 21,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2>Account Actions</h2>
            </div>
            
            <div className={styles.logoutSection}>
              <button 
                className={styles.logoutButton}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                  }
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 21v-2a4 4 0 0 1 4-4h13.8a1 1 0 0 1 .8 1.6L14.25 21l2.55 3.4A1 1 0 0 0 18.5 22h-13a2 2 0 0 1-2-2v-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="15,3 21,3 21,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Log Out
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaikhoanPage;
