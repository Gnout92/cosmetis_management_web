'use client';
import React, { useState, useEffect } from 'react';
import styles from '../styles/hotroKH.module.css';

const HotroKH = () => {
  // States for different functionalities
  const [activeSection, setActiveSection] = useState('contact');
  const [supportForm, setSupportForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    supportType: '',
    orderNumber: '',
    message: '',
    attachments: []
  });
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchFAQ, setSearchFAQ] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [chatOnline, setChatOnline] = useState(true);
  
  // Support types data
  const supportTypes = [
    { value: '', label: 'Chọn loại hỗ trợ', disabled: true },
    { value: 'consultation', label: '💄 Tư vấn sản phẩm' },
    { value: 'order', label: '📦 Vấn đề đơn hàng' },
    { value: 'warranty', label: '🔧 Bảo hành' },
    { value: 'return', label: '↩️ Đổi trả' },
    { value: 'payment', label: '💳 Thanh toán' },
    { value: 'complaint', label: '⚠️ Khiếu nại' },
    { value: 'other', label: '❓ Khác' }
  ];
  
  // FAQ data
  const faqData = [
    {
      id: 1,
      category: 'Đơn hàng',
      question: 'Làm sao để theo dõi đơn hàng của tôi?',
      answer: 'Bạn có thể theo dõi đơn hàng bằng cách:\n\n1. Đăng nhập vào tài khoản và vào mục "Đơn hàng của tôi"\n2. Nhập mã đơn hàng tại trang "Tra cứu đơn hàng"\n3. Liên hệ hotline 1900 1234 để được hỗ trợ trực tiếp\n4. Nhận thông báo qua SMS/email khi đơn hàng thay đổi trạng thái',
      tags: ['đơn hàng', 'theo dõi', 'tra cứu']
    },
    {
      id: 2,
      category: 'Đổi trả',
      question: 'Chính sách đổi trả như thế nào?',
      answer: 'KaKa hỗ trợ đổi trả trong 15 ngày với điều kiện:\n\n• Sản phẩm còn nguyên tem, nhãn mác\n• Chưa sử dụng, còn nguyên vẹn\n• Có hóa đơn mua hàng\n• Không áp dụng với sản phẩm khuyến mãi dưới 50%\n• Miễn phí đổi trả tại cửa hàng hoặc ship hoàn',
      tags: ['đổi trả', 'chính sách', 'hoàn tiền']
    },
    {
      id: 3,
      category: 'Thanh toán',
      question: 'Cửa hàng có hỗ trợ thanh toán COD không?',
      answer: 'Có, KaKa hỗ trợ đa dạng phương thức thanh toán:\n\n• COD (Thanh toán khi nhận hàng)\n• Chuyển khoản ngân hàng\n• Ví điện tử (MoMo, ZaloPay, VNPay)\n• Thẻ tín dụng/ghi nợ\n• Trả góp qua thẻ tín dụng (0% lãi suất)',
      tags: ['thanh toán', 'cod', 'chuyển khoản', 'ví điện tử']
    },
    {
      id: 4,
      category: 'Bảo hành',
      question: 'Làm sao để kích hoạt bảo hành sản phẩm?',
      answer: 'Để kích hoạt bảo hành:\n\n1. Giữ hóa đơn mua hàng\n2. Đăng ký bảo hành online tại website\n3. Hoặc mang sản phẩm + hóa đơn đến cửa hàng\n4. Thời gian bảo hành: 6-18 tháng tùy sản phẩm\n5. Nhận thông báo nhắc hết hạn bảo hành',
      tags: ['bảo hành', 'kích hoạt', 'sản phẩm']
    },
    {
      id: 5,
      category: 'Đơn hàng',
      question: 'Có thể hủy đơn hàng không?',
      answer: 'Bạn có thể hủy đơn hàng trong các trường hợp:\n\n• Đơn hàng chưa được xác nhận (trong 2h)\n• Đơn hàng chưa được đóng gói\n• Liên hệ hotline ngay khi muốn hủy\n• Tiền sẽ được hoàn lại trong 1-3 ngày làm việc\n• Không mất phí hủy đơn',
      tags: ['hủy đơn', 'hoàn tiền', 'xác nhận']
    },
    {
      id: 6,
      category: 'Tài khoản',
      question: 'Làm sao để đăng ký tài khoản thành viên?',
      answer: 'Đăng ký tài khoản KaKa để nhận ưu đãi:\n\n1. Nhấn "Đăng ký" trên website\n2. Điền thông tin cá nhân\n3. Xác thực qua email/SMS\n4. Nhận ngay voucher 50K cho lần mua đầu tiên\n5. Tích điểm đổi quà mỗi lần mua sắm',
      tags: ['đăng ký', 'tài khoản', 'thành viên', 'ưu đãi']
    },
    {
      id: 7,
      category: 'Vận chuyển',
      question: 'Thời gian giao hàng là bao lâu?',
      answer: 'Thời gian giao hàng:\n\n• Nội thành: 1-2 ngày\n• Ngoại thành: 2-3 ngày\n• Tỉnh khác: 3-5 ngày\n• Miễn phí ship cho đơn từ 299K\n• Giao hàng nhanh trong 2h (phí 25K)\n• Giao hàng cuối tuần không tính phí thêm',
      tags: ['giao hàng', 'vận chuyển', 'thời gian', 'miễn phí ship']
    },
    {
      id: 8,
      category: 'Khuyến mãi',
      question: 'Làm sao để nhận thông tin khuyến mãi?',
      answer: 'Để không bỏ lỡ khuyến mãi:\n\n• Đăng ký nhận email/SMS\n• Follow Facebook/Instagram KaKa\n• Tham gia Zalo OA\n• Kiểm tra app thường xuyên\n• Sinh nhật sẽ có ưu đãi đặc biệt 20%\n• Member VIP được ưu tiên khuyến mãi độc quyền',
      tags: ['khuyến mãi', 'ưu đãi', 'thông báo', 'sinh nhật']
    }
  ];
  
  // Store branches data
  const branches = [
    {
      id: 1,
      name: 'KaKa Cosmetics - TP.HCM Quận 1',
      address: '123 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh',
      phone: '0902 345 678',
      email: 'q1hcm@kaka.vn',
      hours: '8:00 – 22:00 (T2–CN)',
      services: ['Tư vấn trực tiếp', 'Thử sản phẩm', 'Makeup miễn phí'],
      image: '/images/store-hcm.jpg'
    },
    {
      id: 2,
      name: 'KaKa Cosmetics - Cần Thơ',
      address: '45 Cách Mạng Tháng 8, Quận Ninh Kiều, TP. Cần Thơ',
      phone: '0901 234 567',
      email: 'cantho@kaka.vn',
      hours: '8:00 – 21:00 (T2–CN)',
      services: ['Tư vấn chuyên sâu', 'Spa mini', 'Giao hàng tận nhà'],
      image: '/images/store-cantho.jpg'
    },
    {
      id: 3,
      name: 'KaKa Cosmetics - Hà Nội',
      address: '12 Láng Hạ, Quận Ba Đình, TP. Hà Nội',
      phone: '0905 678 901',
      email: 'hanoi@kaka.vn',
      hours: '8:30 – 21:30 (T2–CN)',
      services: ['Workshop làm đẹp', 'Tư vấn trang điểm', 'Chăm sóc da miễn phí'],
      image: '/images/store-hanoi.jpg'
    }
  ];
  
  // Social media data
  const socialMedia = [
    {
      name: 'Facebook',
      icon: '📘',
      url: 'https://facebook.com/kaka',
      followers: '125K',
      description: 'Cập nhật thông tin mới nhất',
      active: true
    },
    {
      name: 'Instagram',
      icon: '📸',
      url: 'https://instagram.com/kaka',
      followers: '89K',
      description: 'Hình ảnh và video làm đẹp',
      active: true
    },
    {
      name: 'TikTok',
      icon: '🎵',
      url: 'https://tiktok.com/@kaka',
      followers: '156K',
      description: 'Video tutorial và tips',
      active: true
    },
    {
      name: 'Zalo OA',
      icon: '💬',
      url: 'https://zalo.me/kaka',
      followers: '67K',
      description: 'Chat trực tiếp với tư vấn viên',
      active: true
    },
    {
      name: 'YouTube',
      icon: '📺',
      url: 'https://youtube.com/kaka',
      followers: '45K',
      description: 'Review sản phẩm chi tiết',
      active: true
    }
  ];
  
  // Notification system
  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    const newNotification = { id, message, type };
    setNotifications(prev => [...prev, newNotification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupportForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSupportForm(prev => ({ ...prev, attachments: files }));
  };
  
  // Handle support form submission
  const handleSubmitSupport = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      if (!supportForm.fullName || !supportForm.email || !supportForm.phone || 
          !supportForm.supportType || !supportForm.message) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(supportForm.email)) {
        throw new Error('Email không hợp lệ');
      }
      
      // Validate phone format
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(supportForm.phone.replace(/[\s-]/g, ''))) {
        throw new Error('Số điện thoại không hợp lệ');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create support request
      const supportRequest = {
        id: Date.now(),
        ...supportForm,
        status: 'pending',
        createdAt: new Date().toISOString(),
        requestCode: `SUP${Date.now().toString().slice(-6)}`
      };
      
      // Save to localStorage for demo
      const existingRequests = JSON.parse(localStorage.getItem('support_requests') || '[]');
      localStorage.setItem('support_requests', JSON.stringify([...existingRequests, supportRequest]));
      
      // Show success message
      showNotification(
        `✅ Yêu cầu hỗ trợ đã được gửi thành công! Mã yêu cầu: ${supportRequest.requestCode}. Chúng tôi sẽ phản hồi trong vòng 24h.`,
        'success'
      );
      
      // Reset form
      setSupportForm({
        fullName: '',
        email: '',
        phone: '',
        supportType: '',
        orderNumber: '',
        message: '',
        attachments: []
      });
      
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Quick contact actions
  const handleQuickCall = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };
  
  const handleQuickEmail = (email) => {
    window.open(`mailto:${email}?subject=Yêu cầu hỗ trợ từ KaKa Cosmetics`, '_blank');
  };
  
  const handleQuickChat = (platform) => {
    const chatUrls = {
      zalo: 'https://zalo.me/kaka',
      messenger: 'https://m.me/kaka',
      whatsapp: 'https://wa.me/84901234567'
    };
    window.open(chatUrls[platform], '_blank');
  };
  
  // Filter FAQs based on search
  const filteredFAQs = faqData.filter(faq => 
    searchFAQ === '' || 
    faq.question.toLowerCase().includes(searchFAQ.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchFAQ.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchFAQ.toLowerCase()))
  );
  
  // Toggle FAQ expansion
  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };
  
  // Remove attachment
  const removeAttachment = (index) => {
    setSupportForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={styles.container}>
      {/* Header with back to home */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.navigationSection}>
            <button 
              className={styles.backToHomeBtn}
              onClick={() => window.location.href = '/'}
              title="Quay về trang chủ"
            >
              🏠 Về trang chủ
            </button>
            <button 
              className={styles.backBtn}
              onClick={() => window.history.back()}
              title="Quay lại trang trước"
            >
              ← Quay lại
            </button>
          </div>
          
          <div className={styles.titleSection}>
            <h1 className={styles.title}>💬 Hỗ trợ khách hàng</h1>
            <p className={styles.subtitle}>
              Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ với chúng tôi qua bất kỳ kênh nào thuận tiện nhất!
            </p>
          </div>
          
          {/* Online status indicator */}
          <div className={styles.onlineStatus}>
            <div className={`${styles.statusIndicator} ${chatOnline ? styles.online : styles.offline}`}></div>
            <span className={styles.statusText}>
              {chatOnline ? 'Đang trực tuyến' : 'Ngoại tuyến'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Contact Bar */}
      <div className={styles.quickContactBar}>
        <div className={styles.quickContactContent}>
          <button 
            className={styles.quickContactBtn}
            onClick={() => handleQuickCall('19001234')}
          >
            <span className={styles.contactIcon}>📞</span>
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Hotline</span>
              <span className={styles.contactValue}>1900 1234</span>
            </div>
          </button>
          
          <button 
            className={styles.quickContactBtn}
            onClick={() => handleQuickChat('zalo')}
          >
            <span className={styles.contactIcon}>💬</span>
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Zalo Chat</span>
              <span className={styles.contactValue}>Trực tuyến</span>
            </div>
          </button>
          
          <button 
            className={styles.quickContactBtn}
            onClick={() => handleQuickEmail('hotro@kaka.vn')}
          >
            <span className={styles.contactIcon}>📧</span>
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Email</span>
              <span className={styles.contactValue}>hotro@kaka.vn</span>
            </div>
          </button>
          
          <div className={styles.workingHours}>
            <span className={styles.contactIcon}>🕐</span>
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Giờ làm việc</span>
              <span className={styles.contactValue}>8:00 – 22:00 (T2 – CN)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className={styles.sectionNavigation}>
        <div className={styles.navContent}>
          <button 
            className={`${styles.navBtn} ${activeSection === 'contact' ? styles.navActive : ''}`}
            onClick={() => setActiveSection('contact')}
          >
            📞 Liên hệ nhanh
          </button>
          <button 
            className={`${styles.navBtn} ${activeSection === 'support' ? styles.navActive : ''}`}
            onClick={() => setActiveSection('support')}
          >
            📝 Gửi yêu cầu
          </button>
          <button 
            className={`${styles.navBtn} ${activeSection === 'faq' ? styles.navActive : ''}`}
            onClick={() => setActiveSection('faq')}
          >
            ❓ FAQ
          </button>
          <button 
            className={`${styles.navBtn} ${activeSection === 'branches' ? styles.navActive : ''}`}
            onClick={() => setActiveSection('branches')}
          >
            🏬 Chi nhánh
          </button>
          <button 
            className={`${styles.navBtn} ${activeSection === 'social' ? styles.navActive : ''}`}
            onClick={() => setActiveSection('social')}
          >
            🌐 Mạng xã hội
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Contact Info Section */}
        {activeSection === 'contact' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>📞 Liên hệ nhanh / Hỗ trợ trực tuyến</h2>
              <p className={styles.sectionDesc}>
                Các phương thức liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi
              </p>
            </div>
            
            <div className={styles.contactGrid}>
              {/* Primary Contact Card */}
              <div className={styles.contactCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>☎️ Liên hệ chính</h3>
                  <span className={styles.priorityTag}>Ưu tiên</span>
                </div>
                <div className={styles.contactDetails}>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>📞</span>
                    <div>
                      <strong>Hotline: 1900 1234</strong>
                      <p>Hỗ trợ 24/7 - Miễn phí cuộc gọi</p>
                    </div>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => handleQuickCall('19001234')}
                    >
                      Gọi ngay
                    </button>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>📧</span>
                    <div>
                      <strong>Email: hotro@kaka.vn</strong>
                      <p>Phản hồi trong vòng 2-4 giờ</p>
                    </div>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => handleQuickEmail('hotro@kaka.vn')}
                    >
                      Gửi email
                    </button>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>🕐</span>
                    <div>
                      <strong>Giờ làm việc</strong>
                      <p>8:00 – 22:00 (Thứ 2 – Chủ nhật)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chat Support Card */}
              <div className={styles.contactCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>💬 Chat trực tuyến</h3>
                  <span className={styles.onlineTag}>Đang hoạt động</span>
                </div>
                <div className={styles.contactDetails}>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>💬</span>
                    <div>
                      <strong>Zalo Chat</strong>
                      <p>Chat trực tiếp với tư vấn viên</p>
                    </div>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => handleQuickChat('zalo')}
                    >
                      Chat Zalo
                    </button>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>💭</span>
                    <div>
                      <strong>Messenger</strong>
                      <p>Nhắn tin qua Facebook</p>
                    </div>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => handleQuickChat('messenger')}
                    >
                      Chat Messenger
                    </button>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>📱</span>
                    <div>
                      <strong>WhatsApp</strong>
                      <p>Hỗ trợ khách hàng quốc tế</p>
                    </div>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => handleQuickChat('whatsapp')}
                    >
                      Chat WhatsApp
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Emergency Contact Card */}
              <div className={styles.contactCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>🚨 Hỗ trợ khẩn cấp</h3>
                  <span className={styles.emergencyTag}>24/7</span>
                </div>
                <div className={styles.contactDetails}>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>🆘</span>
                    <div>
                      <strong>Khiếu nại khẩn cấp</strong>
                      <p>Sự cố nghiêm trọng về sản phẩm</p>
                    </div>
                    <button 
                      className={styles.emergencyBtn}
                      onClick={() => handleQuickCall('19001234')}
                    >
                      Gọi khẩn cấp
                    </button>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>⚡</span>
                    <div>
                      <strong>Hỗ trợ kỹ thuật</strong>
                      <p>Sự cố website, app</p>
                    </div>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => handleQuickEmail('tech@kaka.vn')}
                    >
                      Báo lỗi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Support Form Section */}
        {activeSection === 'support' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>📝 Gửi yêu cầu hỗ trợ</h2>
              <p className={styles.sectionDesc}>
                Điền form dưới đây để gửi yêu cầu hỗ trợ chi tiết. Chúng tôi sẽ phản hồi trong vòng 24h.
              </p>
            </div>
            
            <div className={styles.formContainer}>
              <form className={styles.supportForm} onSubmit={handleSubmitSupport}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Họ và tên *</label>
                    <input 
                      type="text" 
                      name="fullName"
                      className={styles.formInput}
                      placeholder="Nhập họ và tên đầy đủ"
                      value={supportForm.fullName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      className={styles.formInput}
                      placeholder="Nhập địa chỉ email"
                      value={supportForm.email}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Số điện thoại *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      className={styles.formInput}
                      placeholder="Nhập số điện thoại"
                      value={supportForm.phone}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Loại hỗ trợ *</label>
                    <select 
                      name="supportType"
                      className={styles.formSelect}
                      value={supportForm.supportType}
                      onChange={handleInputChange}
                      required
                    >
                      {supportTypes.map(type => (
                        <option 
                          key={type.value} 
                          value={type.value} 
                          disabled={type.disabled}
                        >
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mã đơn hàng (nếu có)</label>
                    <input 
                      type="text" 
                      name="orderNumber"
                      className={styles.formInput}
                      placeholder="Nhập mã đơn hàng"
                      value={supportForm.orderNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.formLabel}>Nội dung cần hỗ trợ *</label>
                    <textarea 
                      name="message"
                      className={styles.formTextarea}
                      placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                      value={supportForm.message}
                      onChange={handleInputChange}
                      rows={6}
                      required
                    />
                  </div>
                  
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.formLabel}>Đính kèm hình ảnh (tùy chọn)</label>
                    <div className={styles.fileUpload}>
                      <input 
                        type="file" 
                        id="attachments"
                        className={styles.fileInput}
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="attachments" className={styles.fileLabel}>
                        📎 Chọn hình ảnh minh họa
                      </label>
                    </div>
                    
                    {supportForm.attachments.length > 0 && (
                      <div className={styles.attachmentPreview}>
                        {supportForm.attachments.map((file, index) => (
                          <div key={index} className={styles.attachmentItem}>
                            <span className={styles.fileName}>{file.name}</span>
                            <button 
                              type="button"
                              className={styles.removeAttachmentBtn}
                              onClick={() => removeAttachment(index)}
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
                  {loading ? '⏳ Đang gửi...' : '📩 Gửi yêu cầu'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {activeSection === 'faq' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>❓ Câu hỏi thường gặp</h2>
              <p className={styles.sectionDesc}>
                Tìm kiếm câu trả lời nhanh chóng cho những thắc mắc phổ biến
              </p>
            </div>
            
            <div className={styles.faqContainer}>
              {/* FAQ Search */}
              <div className={styles.faqSearch}>
                <input 
                  type="text" 
                  className={styles.searchInput}
                  placeholder="🔍 Tìm kiếm câu hỏi..."
                  value={searchFAQ}
                  onChange={(e) => setSearchFAQ(e.target.value)}
                />
              </div>
              
              {/* FAQ Categories */}
              <div className={styles.faqCategories}>
                {[...new Set(faqData.map(faq => faq.category))].map(category => (
                  <button 
                    key={category}
                    className={styles.categoryBtn}
                    onClick={() => setSearchFAQ(category)}
                  >
                    {category}
                  </button>
                ))}
                <button 
                  className={styles.categoryBtn}
                  onClick={() => setSearchFAQ('')}
                >
                  Tất cả
                </button>
              </div>
              
              {/* FAQ Items */}
              <div className={styles.faqList}>
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map(faq => (
                    <div key={faq.id} className={styles.faqItem}>
                      <button 
                        className={styles.faqQuestion}
                        onClick={() => toggleFAQ(faq.id)}
                      >
                        <span className={styles.questionText}>{faq.question}</span>
                        <span className={styles.questionIcon}>
                          {expandedFAQ === faq.id ? '−' : '+'}
                        </span>
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <div className={styles.faqAnswer}>
                          <div className={styles.answerContent}>
                            {faq.answer.split('\n').map((line, index) => (
                              <p key={index}>{line}</p>
                            ))}
                          </div>
                          <div className={styles.faqTags}>
                            {faq.tags.map(tag => (
                              <span key={tag} className={styles.faqTag}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className={styles.noResults}>
                    <p>Không tìm thấy câu hỏi nào phù hợp với từ khóa "{searchFAQ}"</p>
                    <button 
                      className={styles.clearSearchBtn}
                      onClick={() => setSearchFAQ('')}
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Branches Section */}
        {activeSection === 'branches' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>🏬 Hệ thống chi nhánh</h2>
              <p className={styles.sectionDesc}>
                Danh sách các cửa hàng KaKa Cosmetics trên toàn quốc
              </p>
            </div>
            
            <div className={styles.branchesContainer}>
              <div className={styles.branchesGrid}>
                {branches.map(branch => (
                  <div key={branch.id} className={styles.branchCard}>
                    <div className={styles.branchImage}>
                      <div className={styles.imagePlaceholder}>
                        🏪
                      </div>
                    </div>
                    
                    <div className={styles.branchInfo}>
                      <h3 className={styles.branchName}>{branch.name}</h3>
                      
                      <div className={styles.branchDetails}>
                        <div className={styles.branchItem}>
                          <span className={styles.branchIcon}>📍</span>
                          <span>{branch.address}</span>
                        </div>
                        
                        <div className={styles.branchItem}>
                          <span className={styles.branchIcon}>📞</span>
                          <span>{branch.phone}</span>
                          <button 
                            className={styles.quickCallBtn}
                            onClick={() => handleQuickCall(branch.phone)}
                          >
                            Gọi
                          </button>
                        </div>
                        
                        <div className={styles.branchItem}>
                          <span className={styles.branchIcon}>📧</span>
                          <span>{branch.email}</span>
                        </div>
                        
                        <div className={styles.branchItem}>
                          <span className={styles.branchIcon}>🕐</span>
                          <span>{branch.hours}</span>
                        </div>
                      </div>
                      
                      <div className={styles.branchServices}>
                        <h4>Dịch vụ:</h4>
                        <div className={styles.servicesList}>
                          {branch.services.map((service, index) => (
                            <span key={index} className={styles.serviceTag}>
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className={styles.branchActions}>
                        <button 
                          className={styles.directionsBtn}
                          onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`, '_blank')}
                        >
                          🗺️ Chỉ đường
                        </button>
                        <button 
                          className={styles.contactBtn}
                          onClick={() => handleQuickEmail(branch.email)}
                        >
                          📧 Liên hệ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Social Media Section */}
        {activeSection === 'social' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>🌐 Mạng xã hội & cộng đồng</h2>
              <p className={styles.sectionDesc}>
                Kết nối với chúng tôi trên các nền tảng xã hội để nhận tin tức và ưu đãi mới nhất
              </p>
            </div>
            
            <div className={styles.socialContainer}>
              <div className={styles.socialGrid}>
                {socialMedia.map(social => (
                  <div key={social.name} className={styles.socialCard}>
                    <div className={styles.socialHeader}>
                      <span className={styles.socialIcon}>{social.icon}</span>
                      <h3 className={styles.socialName}>{social.name}</h3>
                      <span className={styles.followersCount}>{social.followers} followers</span>
                    </div>
                    
                    <p className={styles.socialDescription}>{social.description}</p>
                    
                    <div className={styles.socialActions}>
                      <button 
                        className={styles.followBtn}
                        onClick={() => window.open(social.url, '_blank')}
                      >
                        🔗 Theo dõi
                      </button>
                      {social.active && (
                        <span className={styles.activeStatus}>🟢 Đang hoạt động</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Community Features */}
              <div className={styles.communitySection}>
                <h3 className={styles.communityTitle}>👥 Cộng đồng KaKa</h3>
                <div className={styles.communityFeatures}>
                  <div className={styles.featureCard}>
                    <h4>💬 Group hỏi đáp</h4>
                    <p>Tham gia nhóm Facebook để trao đổi kinh nghiệm làm đẹp</p>
                    <button className={styles.joinBtn}>Tham gia ngay</button>
                  </div>
                  
                  <div className={styles.featureCard}>
                    <h4>📚 Blog làm đẹp</h4>
                    <p>Đọc các bài viết hướng dẫn chăm sóc da chuyên sâu</p>
                    <button className={styles.readBtn}>Đọc blog</button>
                  </div>
                  
                  <div className={styles.featureCard}>
                    <h4>🎥 Video tutorials</h4>
                    <p>Xem video hướng dẫn trang điểm từ chuyên gia</p>
                    <button className={styles.watchBtn}>Xem video</button>
                  </div>
                  
                  <div className={styles.featureCard}>
                    <h4>📱 App mobile</h4>
                    <p>Tải app để nhận ưu đãi độc quyền và mua sắm tiện lợi</p>
                    <button className={styles.downloadBtn}>Tải app</button>
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
      
      {/* Floating Chat Button */}
      <button 
        className={styles.floatingChatBtn}
        onClick={() => handleQuickChat('zalo')}
        title="Chat với chúng tôi"
      >
        💬
      </button>
    </div>
  );
};

export default HotroKH;