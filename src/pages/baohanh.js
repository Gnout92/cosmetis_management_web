'use client';
import React, { useState, useEffect } from 'react';
import styles from '../styles/baohanh.module.css';

const BaoHanh = () => {
  // States for different sections
  const [activeTab, setActiveTab] = useState('activate');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Activate warranty states
  const [activateForm, setActivateForm] = useState({
    productCode: '',
    customerInfo: '',
    purchaseDate: '',
    receiptImage: null
  });
  
  // Search warranty states
  const [searchForm, setSearchForm] = useState({
    searchQuery: '',
    searchType: 'productCode'
  });
  const [searchResults, setSearchResults] = useState([]);
  
  // Warranty request states
  const [requestForm, setRequestForm] = useState({
    customerName: '',
    contactInfo: '',
    productCode: '',
    issueDescription: '',
    evidenceImages: []
  });
  
  // Sample warranty data for demo
  const [warrantyDatabase, setWarrantyDatabase] = useState([
    {
      id: 1,
      productCode: 'SER001',
      productName: 'Serum Dưỡng Da Vitamin C',
      customerInfo: '0912345678',
      activationDate: '2024-05-10',
      expiryDate: '2025-05-10',
      status: 'active',
      warrantyPeriod: 12
    },
    {
      id: 2,
      productCode: 'CRM002',
      productName: 'Kem Dưỡng Ẩm Hyaluronic Acid',
      customerInfo: 'user@example.com',
      activationDate: '2023-08-15',
      expiryDate: '2024-08-15',
      status: 'expired',
      warrantyPeriod: 12
    },
    {
      id: 3,
      productCode: 'SUN003',
      productName: 'Kem Chống Nắng SPF 50+',
      customerInfo: '0987654321',
      activationDate: '2024-09-01',
      expiryDate: '2025-09-01',
      status: 'active',
      warrantyPeriod: 12
    }
  ]);
  
  // Sample warranty requests
  const [warrantyRequests, setWarrantyRequests] = useState([]);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const savedDatabase = localStorage.getItem('warranty_database');
    const savedRequests = localStorage.getItem('warranty_requests');
    
    if (savedDatabase) {
      setWarrantyDatabase(JSON.parse(savedDatabase));
    }
    if (savedRequests) {
      setWarrantyRequests(JSON.parse(savedRequests));
    }
  }, []);
  
  // Save to localStorage
  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  
  // Notification system
  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    const newNotification = { id, message, type };
    setNotifications(prev => [...prev, newNotification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };
  
  // Handle file upload
  const handleFileUpload = (file, section) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (section === 'activate') {
        setActivateForm(prev => ({ ...prev, receiptImage: e.target.result }));
      } else if (section === 'request') {
        setRequestForm(prev => ({
          ...prev,
          evidenceImages: [...prev.evidenceImages, e.target.result]
        }));
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Generate warranty code
  const generateWarrantyCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    return letters.charAt(Math.floor(Math.random() * letters.length)) +
           letters.charAt(Math.floor(Math.random() * letters.length)) +
           letters.charAt(Math.floor(Math.random() * letters.length)) +
           String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  };
  
  // Handle warranty activation
  const handleActivateWarranty = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate form
      if (!activateForm.productCode || !activateForm.customerInfo || !activateForm.purchaseDate) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }
      
      // Check if product code already exists
      const existing = warrantyDatabase.find(w => w.productCode === activateForm.productCode);
      if (existing) {
        throw new Error('Mã sản phẩm đã được kích hoạt bảo hành');
      }
      
      // Calculate expiry date (12 months from purchase)
      const purchaseDate = new Date(activateForm.purchaseDate);
      const expiryDate = new Date(purchaseDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      
      // Create new warranty record
      const newWarranty = {
        id: Date.now(),
        productCode: activateForm.productCode.toUpperCase(),
        productName: getProductNameByCode(activateForm.productCode),
        customerInfo: activateForm.customerInfo,
        activationDate: activateForm.purchaseDate,
        expiryDate: expiryDate.toISOString().split('T')[0],
        status: 'active',
        warrantyPeriod: 12,
        receiptImage: activateForm.receiptImage
      };
      
      const updatedDatabase = [...warrantyDatabase, newWarranty];
      setWarrantyDatabase(updatedDatabase);
      saveToStorage('warranty_database', updatedDatabase);
      
      // Reset form
      setActivateForm({
        productCode: '',
        customerInfo: '',
        purchaseDate: '',
        receiptImage: null
      });
      
      showNotification(
        `✅ Kích hoạt bảo hành thành công! Mã bảo hành: ${newWarranty.productCode}`,
        'success'
      );
      
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle warranty search
  const handleSearchWarranty = (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!searchForm.searchQuery.trim()) {
        throw new Error('Vui lòng nhập thông tin tìm kiếm');
      }
      
      const query = searchForm.searchQuery.toLowerCase();
      const results = warrantyDatabase.filter(warranty => {
        if (searchForm.searchType === 'productCode') {
          return warranty.productCode.toLowerCase().includes(query);
        } else {
          return warranty.customerInfo.toLowerCase().includes(query);
        }
      });
      
      setSearchResults(results);
      
      if (results.length === 0) {
        showNotification('Không tìm thấy thông tin bảo hành', 'error');
      } else {
        showNotification(`Tìm thấy ${results.length} kết quả`, 'success');
      }
      
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle warranty request submission
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate form
      if (!requestForm.customerName || !requestForm.contactInfo || 
          !requestForm.productCode || !requestForm.issueDescription) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }
      
      // Check if product exists in warranty database
      const warranty = warrantyDatabase.find(w => 
        w.productCode.toLowerCase() === requestForm.productCode.toLowerCase()
      );
      
      if (!warranty) {
        throw new Error('Mã sản phẩm không tồn tại trong hệ thống bảo hành');
      }
      
      if (warranty.status === 'expired') {
        throw new Error('Sản phẩm đã hết hạn bảo hành');
      }
      
      // Create new warranty request
      const newRequest = {
        id: Date.now(),
        requestCode: `REQ${generateWarrantyCode()}`,
        ...requestForm,
        submissionDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        productName: warranty.productName
      };
      
      const updatedRequests = [...warrantyRequests, newRequest];
      setWarrantyRequests(updatedRequests);
      saveToStorage('warranty_requests', updatedRequests);
      
      // Reset form
      setRequestForm({
        customerName: '',
        contactInfo: '',
        productCode: '',
        issueDescription: '',
        evidenceImages: []
      });
      
      showNotification(
        `✅ Yêu cầu bảo hành đã được gửi! Mã yêu cầu: ${newRequest.requestCode}`,
        'success'
      );
      
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Get product name by code (demo function)
  const getProductNameByCode = (code) => {
    const productMap = {
      'SER001': 'Serum Dưỡng Da Vitamin C',
      'SER002': 'Serum Retinol Anti-Aging',
      'SER003': 'Serum Niacinamide 10%',
      'CRM001': 'Kem Dưỡng Ẩm Hyaluronic Acid',
      'CRM002': 'Kem Dưỡng Da Ban Đêm',
      'CRM003': 'Kem Mắt Chống Lão Hóa',
      'SUN001': 'Kem Chống Nắng SPF 50+',
      'SUN002': 'Kem Chống Nắng Vật Lý',
      'SUN003': 'Xịt Chống Nắng Toàn Thân',
      'MSK001': 'Mặt Nạ Collagen',
      'MSK002': 'Mặt Nạ Detox Than Tre',
      'MSK003': 'Mặt Nạ Dưỡng Ẩm Overnight'
    };
    return productMap[code.toUpperCase()] || 'Sản phẩm không xác định';
  };
  
  // Check warranty status
  const getWarrantyStatus = (warranty) => {
    const today = new Date();
    const expiryDate = new Date(warranty.expiryDate);
    
    if (today > expiryDate) {
      return { status: 'expired', text: 'Hết hạn', class: 'expired' };
    } else {
      const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 30) {
        return { status: 'expiring', text: `Còn ${daysLeft} ngày`, class: 'expiring' };
      }
      return { status: 'active', text: 'Còn hạn', class: 'active' };
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };
  
  // Remove image from request form
  const removeRequestImage = (index) => {
    setRequestForm(prev => ({
      ...prev,
      evidenceImages: prev.evidenceImages.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>💎 Bảo hành sản phẩm</h1>
          <p className={styles.subtitle}>
            Kích hoạt, tra cứu và yêu cầu bảo hành dễ dàng
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabNavigation}>
        <div className={styles.tabContent}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'activate' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('activate')}
          >
            🔧 Kích hoạt bảo hành
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'search' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('search')}
          >
            🔍 Tra cứu bảo hành
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'request' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('request')}
          >
            📝 Yêu cầu bảo hành
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'policy' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('policy')}
          >
            📋 Chính sách
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Activate Warranty Section */}
        {activeTab === 'activate' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>🔧 Kích hoạt bảo hành</h2>
              <p className={styles.sectionDesc}>
                Kích hoạt bảo hành cho sản phẩm vừa mua để được hỗ trợ tốt nhất
              </p>
            </div>
            
            <div className={styles.formContainer}>
              <form className={styles.warrantyForm} onSubmit={handleActivateWarranty}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mã sản phẩm *</label>
                    <input 
                      type="text" 
                      className={styles.formInput}
                      placeholder="Nhập mã sản phẩm (VD: SER001)"
                      value={activateForm.productCode}
                      onChange={(e) => setActivateForm(prev => ({ 
                        ...prev, 
                        productCode: e.target.value.toUpperCase() 
                      }))}
                      required 
                    />
                    <small className={styles.formHint}>
                      Mã sản phẩm được in trên tem bảo hành
                    </small>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Số điện thoại / Email *</label>
                    <input 
                      type="text" 
                      className={styles.formInput}
                      placeholder="Nhập SĐT hoặc email"
                      value={activateForm.customerInfo}
                      onChange={(e) => setActivateForm(prev => ({ 
                        ...prev, 
                        customerInfo: e.target.value 
                      }))}
                      required 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Ngày mua hàng *</label>
                    <input 
                      type="date" 
                      className={styles.formInput}
                      value={activateForm.purchaseDate}
                      onChange={(e) => setActivateForm(prev => ({ 
                        ...prev, 
                        purchaseDate: e.target.value 
                      }))}
                      max={new Date().toISOString().split('T')[0]}
                      required 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Ảnh hóa đơn (tùy chọn)</label>
                    <div className={styles.fileUpload}>
                      <input 
                        type="file" 
                        id="receipt-upload"
                        className={styles.fileInput}
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'activate')}
                      />
                      <label htmlFor="receipt-upload" className={styles.fileLabel}>
                        {activateForm.receiptImage ? '✅ Đã tải ảnh' : '📷 Chọn ảnh hóa đơn'}
                      </label>
                    </div>
                    {activateForm.receiptImage && (
                      <div className={styles.imagePreview}>
                        <img src={activateForm.receiptImage} alt="Receipt preview" />
                        <button 
                          type="button"
                          className={styles.removeImageBtn}
                          onClick={() => setActivateForm(prev => ({ ...prev, receiptImage: null }))}
                        >
                          ❌
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? '⏳ Đang xử lý...' : '🔧 Kích hoạt ngay'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Search Warranty Section */}
        {activeTab === 'search' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>🔍 Tra cứu bảo hành</h2>
              <p className={styles.sectionDesc}>
                Kiểm tra thông tin và tình trạng bảo hành sản phẩm
              </p>
            </div>
            
            <div className={styles.formContainer}>
              <form className={styles.searchForm} onSubmit={handleSearchWarranty}>
                <div className={styles.searchInputGroup}>
                  <select 
                    className={styles.searchSelect}
                    value={searchForm.searchType}
                    onChange={(e) => setSearchForm(prev => ({ 
                      ...prev, 
                      searchType: e.target.value 
                    }))}
                  >
                    <option value="productCode">Mã sản phẩm</option>
                    <option value="customerInfo">SĐT / Email</option>
                  </select>
                  
                  <input 
                    type="text" 
                    className={styles.searchInput}
                    placeholder={searchForm.searchType === 'productCode' ? 
                      'Nhập mã sản phẩm...' : 
                      'Nhập SĐT hoặc email...'
                    }
                    value={searchForm.searchQuery}
                    onChange={(e) => setSearchForm(prev => ({ 
                      ...prev, 
                      searchQuery: e.target.value 
                    }))}
                    required
                  />
                  
                  <button 
                    type="submit" 
                    className={styles.searchBtn}
                    disabled={loading}
                  >
                    {loading ? '⏳' : '🔍 Tìm kiếm'}
                  </button>
                </div>
              </form>
              
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className={styles.searchResults}>
                  <h3 className={styles.resultsTitle}>Kết quả tìm kiếm ({searchResults.length})</h3>
                  <div className={styles.resultsGrid}>
                    {searchResults.map((warranty) => {
                      const status = getWarrantyStatus(warranty);
                      return (
                        <div key={warranty.id} className={styles.warrantyCard}>
                          <div className={styles.warrantyHeader}>
                            <h4 className={styles.warrantyProduct}>{warranty.productName}</h4>
                            <span className={`${styles.warrantyStatus} ${styles[status.class]}`}>
                              {status.text}
                            </span>
                          </div>
                          
                          <div className={styles.warrantyDetails}>
                            <div className={styles.warrantyInfo}>
                              <span className={styles.infoLabel}>Mã sản phẩm:</span>
                              <span className={styles.infoValue}>{warranty.productCode}</span>
                            </div>
                            <div className={styles.warrantyInfo}>
                              <span className={styles.infoLabel}>Ngày kích hoạt:</span>
                              <span className={styles.infoValue}>{formatDate(warranty.activationDate)}</span>
                            </div>
                            <div className={styles.warrantyInfo}>
                              <span className={styles.infoLabel}>Hạn bảo hành:</span>
                              <span className={styles.infoValue}>{formatDate(warranty.expiryDate)}</span>
                            </div>
                            <div className={styles.warrantyInfo}>
                              <span className={styles.infoLabel}>Thời gian bảo hành:</span>
                              <span className={styles.infoValue}>{warranty.warrantyPeriod} tháng</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Warranty Request Section */}
        {activeTab === 'request' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>📝 Yêu cầu bảo hành</h2>
              <p className={styles.sectionDesc}>
                Gửi yêu cầu bảo hành khi sản phẩm gặp sự cố
              </p>
            </div>
            
            <div className={styles.formContainer}>
              <form className={styles.requestForm} onSubmit={handleSubmitRequest}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Tên khách hàng *</label>
                    <input 
                      type="text" 
                      className={styles.formInput}
                      placeholder="Nhập họ và tên"
                      value={requestForm.customerName}
                      onChange={(e) => setRequestForm(prev => ({ 
                        ...prev, 
                        customerName: e.target.value 
                      }))}
                      required 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Số điện thoại / Email *</label>
                    <input 
                      type="text" 
                      className={styles.formInput}
                      placeholder="Nhập SĐT hoặc email liên hệ"
                      value={requestForm.contactInfo}
                      onChange={(e) => setRequestForm(prev => ({ 
                        ...prev, 
                        contactInfo: e.target.value 
                      }))}
                      required 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mã sản phẩm *</label>
                    <input 
                      type="text" 
                      className={styles.formInput}
                      placeholder="Nhập mã sản phẩm cần bảo hành"
                      value={requestForm.productCode}
                      onChange={(e) => setRequestForm(prev => ({ 
                        ...prev, 
                        productCode: e.target.value.toUpperCase() 
                      }))}
                      required 
                    />
                  </div>
                  
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.formLabel}>Mô tả lỗi / sự cố *</label>
                    <textarea 
                      className={styles.formTextarea}
                      placeholder="Mô tả chi tiết tình trạng sản phẩm, lỗi gặp phải..."
                      value={requestForm.issueDescription}
                      onChange={(e) => setRequestForm(prev => ({ 
                        ...prev, 
                        issueDescription: e.target.value 
                      }))}
                      rows={4}
                      required 
                    />
                  </div>
                  
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.formLabel}>Hình ảnh minh chứng</label>
                    <div className={styles.fileUpload}>
                      <input 
                        type="file" 
                        id="evidence-upload"
                        className={styles.fileInput}
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          Array.from(e.target.files).forEach(file => {
                            handleFileUpload(file, 'request');
                          });
                        }}
                      />
                      <label htmlFor="evidence-upload" className={styles.fileLabel}>
                        📷 Chọn ảnh minh chứng
                      </label>
                    </div>
                    
                    {requestForm.evidenceImages.length > 0 && (
                      <div className={styles.imageGallery}>
                        {requestForm.evidenceImages.map((image, index) => (
                          <div key={index} className={styles.imagePreview}>
                            <img src={image} alt={`Evidence ${index + 1}`} />
                            <button 
                              type="button"
                              className={styles.removeImageBtn}
                              onClick={() => removeRequestImage(index)}
                            >
                              ❌
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? '⏳ Đang gửi...' : '📝 Gửi yêu cầu'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Policy Section */}
        {activeTab === 'policy' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>📋 Chính sách bảo hành</h2>
              <p className={styles.sectionDesc}>
                Thông tin chi tiết về chính sách và điều kiện bảo hành
              </p>
            </div>
            
            <div className={styles.policyContainer}>
              <div className={styles.policyCard}>
                <h3 className={styles.policyTitle}>🧴 Chính sách bảo hành sản phẩm</h3>
                <div className={styles.policyContent}>
                  <div className={styles.policySection}>
                    <h4>⏰ Thời gian bảo hành</h4>
                    <ul>
                      <li>Tất cả sản phẩm chính hãng: <strong>12 tháng</strong> kể từ ngày mua</li>
                      <li>Sản phẩm cao cấp (serum, kem đặc trị): <strong>18 tháng</strong></li>
                      <li>Phụ kiện và dụng cụ: <strong>6 tháng</strong></li>
                    </ul>
                  </div>
                  
                  <div className={styles.policySection}>
                    <h4>✅ Điều kiện áp dụng</h4>
                    <ul>
                      <li>Sản phẩm còn tem bảo hành và niêm phong nguyên vẹn</li>
                      <li>Có hóa đơn mua hàng hoặc phiếu giao hàng</li>
                      <li>Sản phẩm chưa hết hạn sử dụng</li>
                      <li>Bảo hành đã được kích hoạt trong hệ thống</li>
                      <li>Lỗi kỹ thuật từ nhà sản xuất</li>
                    </ul>
                  </div>
                  
                  <div className={styles.policySection}>
                    <h4>❌ Không áp dụng cho</h4>
                    <ul>
                      <li>Sản phẩm hư hỏng do sử dụng sai cách</li>
                      <li>Tác động vật lý: rơi vỡ, va đập</li>
                      <li>Sản phẩm đã qua sửa chữa bởi bên thứ 3</li>
                      <li>Hết hạn sử dụng hoặc bảo quản không đúng cách</li>
                      <li>Thay đổi thành phần, pha trộn với sản phẩm khác</li>
                    </ul>
                  </div>
                  
                  <div className={styles.policySection}>
                    <h4>🔄 Quy trình bảo hành</h4>
                    <ol>
                      <li>Khách hàng gửi yêu cầu bảo hành qua website</li>
                      <li>Bộ phận kỹ thuật kiểm tra và phản hồi trong 24h</li>
                      <li>Nếu đủ điều kiện: đổi sản phẩm mới hoặc hoàn tiền</li>
                      <li>Thời gian xử lý: 3-7 ngày làm việc</li>
                      <li>Miễn phí vận chuyển 2 chiều</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className={styles.contactCard}>
                <h3 className={styles.contactTitle}>📞 Hỗ trợ khách hàng</h3>
                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>📞</span>
                    <div>
                      <strong>Hotline bảo hành</strong>
                      <p>1900 1234 (8:00 - 22:00 hàng ngày)</p>
                    </div>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>📧</span>
                    <div>
                      <strong>Email hỗ trợ</strong>
                      <p>baohanh@kaka.vn</p>
                    </div>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>💬</span>
                    <div>
                      <strong>Zalo CSKH</strong>
                      <p>0909 123 456</p>
                    </div>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>🏪</span>
                    <div>
                      <strong>Showroom</strong>
                      <p>123 Nguyễn Văn A, Q1, TP.HCM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className={styles.notifications}>
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`${styles.notification} ${styles[notification.type]}`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaoHanh;