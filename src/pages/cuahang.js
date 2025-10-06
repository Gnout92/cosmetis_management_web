import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/cuahang.module.css';


const CuaHang = () => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  // Dữ liệu chi nhánh cửa hàng
  const branches = [
    {
      id: 1,
      name: "KaKa Mỹ Phẩm – Cần Thơ",
      address: "123 Nguyễn Trãi, Quận Ninh Kiều, TP. Cần Thơ",
      phone: "0901 234 567",
      email: "cantho@kakacosmetica.com",
      hours: "8:00 – 21:00 (T2–CN)",
      region: "Miền Nam",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.8414722047205!2d105.78011!3d10.029998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0895a51d60719%3A0x9d76b0035f6d53d0!2zTmd1eeG7hW4gVHLDo2ksIE5pbmggS2nhu4F1LCBD4bqnbiBUaMah!5e0!3m2!1svi!2s!4v1709000000000!5m2!1svi!2s",
      image: "/images/store-cantho.jpg"
    },
    {
      id: 2,
      name: "KaKa Mỹ Phẩm – TP.HCM Quận 1",
      address: "456 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
      phone: "0902 345 678",
      email: "q1hcm@kakacosmetica.com",
      hours: "8:30 – 21:30 (T2–CN)",
      region: "Miền Nam",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4175153486596!2d106.69779!3d10.772675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1c06f4e1dd%3A0x43900f1d4539a3d!2zTMOqIEzhu6NpLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2s!4v1709000000000!5m2!1svi!2s",
      image: "/images/store-hcm-q1.jpg"
    },
    {
      id: 3,
      name: "KaKa Mỹ Phẩm – TP.HCM Quận 7",
      address: "789 Nguyễn Thị Thập, Quận 7, TP. Hồ Chí Minh",
      phone: "0903 456 789",
      email: "q7hcm@kakacosmetica.com",
      hours: "9:00 – 21:00 (T2–CN)",
      region: "Miền Nam",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0256345678!2d106.71234!3d10.75432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b0a29b8b45%3A0x123456789abcdef!2zTmd1eeG7hW4gVGjhu4sgVGjhuq1wLCBRdeG6rW4gNw!5e0!3m2!1svi!2s!4v1709000000000!5m2!1svi!2s",
      image: "/images/store-hcm-q7.jpg"
    },
    {
      id: 4,
      name: "KaKa Mỹ Phẩm – Đà Nẵng",
      address: "321 Lê Duẩn, Quận Hải Châu, TP. Đà Nẵng",
      phone: "0904 567 890",
      email: "danang@kakacosmetica.com",
      hours: "8:00 – 21:00 (T2–CN)",
      region: "Miền Trung",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.0123456789!2d108.2123!3d16.0678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c792252a63%3A0x1d0123456789abc!2zTMOqIER1w6JuLCBIYWkgQ2jDonUsIMSQw6AgTuG6tW5n!5e0!3m2!1svi!2s!4v1709000000000!5m2!1svi!2s",
      image: "/images/store-danang.jpg"
    },
    {
      id: 5,
      name: "KaKa Mỹ Phẩm – Hà Nội Ba Đình",
      address: "654 Đường Láng, Quận Ba Đình, TP. Hà Nội",
      phone: "0905 678 901",
      email: "badinh@kakacosmetica.com",
      hours: "8:30 – 21:00 (T2–CN)",
      region: "Miền Bắc",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.1234567890!2d105.8019!3d21.0285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0x1234567890abcdef!2zxJDGsOG7nW5nIEzDoW5nLCBCYSDEkMOsbmgsIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1709000000000!5m2!1svi!2s",
      image: "/images/store-hanoi-badinh.jpg"
    },
    {
      id: 6,
      name: "KaKa Mỹ Phẩm – Hà Nội Cầu Giấy",
      address: "987 Xuân Thủy, Quận Cầu Giấy, TP. Hà Nội",
      phone: "0906 789 012",
      email: "caugiay@kakacosmetica.com",
      hours: "9:00 – 21:30 (T2–CN)",
      region: "Miền Bắc",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.9876543210!2d105.7894!3d21.0456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454b91f916a05%3A0x9876543210fedcba!2zWHXDom4gVGjhu6d5LCBD4bqndSBHaeG6pXksIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1709000000000!5m2!1svi!2s",
      image: "/images/store-hanoi-caugiay.jpg"
    }
  ];

  // Dữ liệu hình ảnh cửa hàng
  const storeImages = [
    {
      id: 1,
      title: "Kệ trưng bày mỹ phẩm cao cấp",
      image: "/images/banners/banner1.jpg",
      description: "Không gian trưng bày hiện đại với đầy đủ các sản phẩm mỹ phẩm chất lượng cao"
    },
    {
      id: 2,
      title: "Khu tư vấn làm đẹp chuyên nghiệp",
      image: "/images/banners/banner2.jpg",
      description: "Khu vực tư vấn riêng tư với đội ngũ chuyên viên giàu kinh nghiệm"
    },
    {
      id: 3,
      title: "Nhân viên chăm sóc khách hàng",
      image: "/images/banners/banner3.jpg",
      description: "Đội ngũ nhân viên tận tâm, chuyên nghiệp phục vụ khách hàng 24/7"
    },
    {
      id: 4,
      title: "Không gian mua sắm thoải mái",
      image: "/images/banners/banner1.jpg",
      description: "Thiết kế nội thất sang trọng, tạo cảm giác thư giãn khi mua sắm"
    }
  ];

  // Nhóm chi nhánh theo khu vực
  const branchesByRegion = branches.reduce((acc, branch) => {
    if (!acc[branch.region]) {
      acc[branch.region] = [];
    }
    acc[branch.region].push(branch);
    return acc;
  }, {});

  // Xử lý form liên hệ
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitContact = (e) => {
    e.preventDefault();
    // Xử lý gửi form ở đây
    console.log('Form data:', formData);
    alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
    setShowContactForm(false);
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  const handleCallBranch = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleGetDirections = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleViewMap = (branch) => {
    setSelectedBranch(branch);
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.mainTitle}>
            🏪 Hệ Thống Cửa Hàng KaKa Mỹ Phẩm
          </h1>
          <p className={styles.heroDescription}>
            Hệ thống cửa hàng mỹ phẩm KaKa hiện có mặt tại nhiều tỉnh thành trên toàn quốc, 
            mang đến cho bạn trải nghiệm mua sắm tiện lợi và chuyên nghiệp nhất.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>6+</span>
              <span className={styles.statLabel}>Chi nhánh</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>Miền</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>1000+</span>
              <span className={styles.statLabel}>Sản phẩm</span>
            </div>
          </div>
        </div>
        <div className={styles.heroImage}>
          <Image 
            src="/images/banners/banner3.jpg"
            alt="KaKa Store Hero" 
            width={600} 
            height={400}
            className={styles.heroImg}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <button 
          className={styles.actionBtn}
          onClick={() => handleCallBranch('1900-234-567')}
        >
          <span className={styles.actionIcon}>📞</span>
          Gọi ngay
        </button>
        <button 
          className={styles.actionBtn}
          onClick={() => window.open('https://www.facebook.com/kakacosmetica', '_blank')}
        >
          <span className={styles.actionIcon}>📱</span>
          Fanpage
        </button>
        <button 
          className={styles.actionBtn}
          onClick={() => window.open('https://zalo.me/kakacosmetica', '_blank')}
        >
          <span className={styles.actionIcon}>💬</span>
          Zalo
        </button>
        <button 
          className={styles.actionBtn}
          onClick={() => setShowContactForm(true)}
        >
          <span className={styles.actionIcon}>✉️</span>
          Liên hệ
        </button>
      </div>

      {/* Branches Section */}
      <div className={styles.branchesSection}>
        <h2 className={styles.sectionTitle}>
          🗺️ Danh Sách Chi Nhánh
        </h2>
        
        {Object.entries(branchesByRegion).map(([region, regionBranches]) => (
          <div key={region} className={styles.regionContainer}>
            <h3 className={styles.regionTitle}>{region}</h3>
            <div className={styles.branchGrid}>
              {regionBranches.map(branch => (
                <div key={branch.id} className={styles.branchCard}>
                  <div className={styles.branchHeader}>
                    <h4 className={styles.branchName}>{branch.name}</h4>
                    <div className={styles.branchBadge}>{branch.region}</div>
                  </div>
                  
                  <div className={styles.branchInfo}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoIcon}>📍</span>
                      <span className={styles.infoText}>{branch.address}</span>
                    </div>
                    
                    <div className={styles.infoItem}>
                      <span className={styles.infoIcon}>☎️</span>
                      <span className={styles.infoText}>{branch.phone}</span>
                    </div>
                    
                    <div className={styles.infoItem}>
                      <span className={styles.infoIcon}>🕒</span>
                      <span className={styles.infoText}>{branch.hours}</span>
                    </div>
                    
                    <div className={styles.infoItem}>
                      <span className={styles.infoIcon}>📧</span>
                      <span className={styles.infoText}>{branch.email}</span>
                    </div>
                  </div>
                  
                  <div className={styles.branchActions}>
                    <button 
                      className={styles.mapBtn}
                      onClick={() => handleViewMap(branch)}
                    >
                      🗺️ Xem bản đồ
                    </button>
                    <button 
                      className={styles.contactBtn}
                      onClick={() => handleCallBranch(branch.phone)}
                    >
                      💬 Liên hệ ngay
                    </button>
                    <button 
                      className={styles.directionBtn}
                      onClick={() => handleGetDirections(branch.address)}
                    >
                      📍 Chỉ đường
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Map Section */}
      <div className={styles.mapSection}>
        <h2 className={styles.sectionTitle}>
          🗺️ Bản Đồ Tương Tác
        </h2>
        
        {selectedBranch ? (
          <div className={styles.mapContainer}>
            <div className={styles.mapHeader}>
              <h3>{selectedBranch.name}</h3>
              <button 
                className={styles.closeMapBtn}
                onClick={() => setSelectedBranch(null)}
              >
                ✕
              </button>
            </div>
            <iframe
              src={selectedBranch.mapUrl}
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : (
          <div className={styles.mapPlaceholder}>
            <div className={styles.placeholderContent}>
              <span className={styles.placeholderIcon}>🗺️</span>
              <h3>Chọn chi nhánh để xem bản đồ</h3>
              <p>Nhấn vào nút "Xem bản đồ" ở bất kỳ chi nhánh nào để hiển thị vị trí chính xác</p>
            </div>
          </div>
        )}
      </div>

      {/* Store Images Gallery */}
      <div className={styles.gallerySection}>
        <h2 className={styles.sectionTitle}>
          🖼️ Hình Ảnh Cửa Hàng
        </h2>
        <div className={styles.imageGrid}>
          {storeImages.map(item => (
            <div key={item.id} className={styles.imageCard}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={item.image} 
                  alt={item.title}
                  width={300}
                  height={200}
                  className={styles.storeImage}
                />
              </div>
              <div className={styles.imageContent}>
                <h4 className={styles.imageTitle}>{item.title}</h4>
                <p className={styles.imageDescription}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>📧 Đăng Ký Nhận Thông Tin</h3>
              <button 
                className={styles.closeModalBtn}
                onClick={() => setShowContactForm(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitContact} className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Họ và tên *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Nhập họ và tên của bạn"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Số điện thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Nhập địa chỉ email"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tin nhắn</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  placeholder="Nhập tin nhắn của bạn (tùy chọn)"
                  rows={4}
                />
              </div>
              
              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => setShowContactForm(false)}
                >
                  Hủy
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Gửi thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <div className={styles.footerSection}>
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <h3>🌟 KaKa Mỹ Phẩm</h3>
            <p>Chuyên cung cấp mỹ phẩm chất lượng cao, uy tín hàng đầu Việt Nam</p>
          </div>
          
          <div className={styles.footerContact}>
            <h4>Liên hệ tổng đài</h4>
            <p>📞 Hotline: 1900-234-567</p>
            <p>📧 Email: info@kakacosmetica.com</p>
            <p>🌐 Website: www.kakacosmetica.com</p>
          </div>
          
          <div className={styles.footerSocial}>
            <h4>Theo dõi chúng tôi</h4>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com/kakacosmetica" target="_blank" rel="noopener noreferrer">
                📘 Facebook
              </a>
              <a href="https://instagram.com/kakacosmetica" target="_blank" rel="noopener noreferrer">
                📷 Instagram
              </a>
              <a href="https://zalo.me/kakacosmetica" target="_blank" rel="noopener noreferrer">
                💬 Zalo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuaHang;