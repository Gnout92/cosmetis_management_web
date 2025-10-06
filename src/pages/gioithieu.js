import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/gioithieu.module.css';

export default function GioiThieu() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    // Auto-slide for product showcase
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % showcaseImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Scroll to section handler
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Data
  const showcaseImages = [
    {
      src: "/images/banners/banner2.jpg",
      alt: 'Cửa hàng KaKa',
      title: 'Không gian cửa hàng sang trọng'
    },
    {
      src: "/images/banners/banner3.jpg",
      alt: 'Bộ sưu tập sản phẩm',
      title: 'Bộ sưu tập sản phẩm đa dạng'
    },
    {
      src: "/images/banners/banner1.jpg",
      alt: 'Đội ngũ tư vấn',
      title: 'Đội ngũ tư vấn chuyên nghiệp'
    },
    {
      src: "/images/banners/banner2.jpg",
      alt: 'Phòng lab nghiên cứu',
      title: 'Phòng lab nghiên cứu hiện đại'
    }
  ];

  const whyChooseUs = [
    {
      icon: '🏆',
      title: '100% Sản phẩm chính hãng',
      description: 'Tất cả sản phẩm đều có tem chứng nhận và được nhập khẩu trực tiếp từ các thương hiệu uy tín.'
    },
    {
      icon: '👩‍⚕️',
      title: 'Tư vấn miễn phí từ chuyên gia',
      description: 'Đội ngũ chuyên gia da liễu và beauty advisor tư vấn miễn phí, chọn sản phẩm phù hợp với từng loại da.'
    },
    {
      icon: '🚚',
      title: 'Giao hàng toàn quốc nhanh chóng',
      description: 'Giao hàng trong 24h tại TP.HCM và Hà Nội, toàn quốc trong 2-3 ngày với nhiều hình thức thanh toán.'
    },
    {
      icon: '🔄',
      title: 'Chính sách đổi trả linh hoạt',
      description: 'Đổi trả trong 30 ngày, hoàn tiền 100% nếu sản phẩm không phù hợp hoặc có vấn đề về chất lượng.'
    },
    {
      icon: '💎',
      title: 'Chương trình membership ưu đãi',
      description: 'Tích điểm, ưu đãi độc quyền, quà tặng sinh nhật và nhiều đặc quyền dành cho khách hàng thân thiết.'
    },
    {
      icon: '🛡️',
      title: 'Bảo hành và chăm sóc sau bán',
      description: 'Bảo hành sản phẩm, hỗ trợ 24/7 qua hotline và livechat, theo dõi kết quả sử dụng sản phẩm.'
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Nguyễn Thị Lan Anh',
      position: 'CEO & Founder',
      avatar: '👩‍💼',
      experience: '15 năm kinh nghiệm trong ngành làm đẹp',
      achievement: 'Giải thưởng "Doanh nhân nữ xuất sắc 2023"'
    },
    {
      id: 2,
      name: 'Dr. Trần Minh Khoa',
      position: 'Chuyên gia Da liễu',
      avatar: '👨‍⚕️',
      experience: 'Bác sĩ Da liễu hơn 12 năm kinh nghiệm',
      achievement: 'Chứng chỉ chuyên khoa Da liễu quốc tế'
    },
    {
      id: 3,
      name: 'Lê Thị Thu Hương',
      position: 'Head of Customer Experience',
      avatar: '👩‍💻',
      experience: '10 năm kinh nghiệm chăm sóc khách hàng',
      achievement: 'Giải thưởng "Best Customer Service 2024"'
    },
    {
      id: 4,
      name: 'Phạm Văn Đức',
      position: 'Product Development Manager',
      avatar: '👨‍🔬',
      experience: '8 năm nghiên cứu và phát triển sản phẩm',
      achievement: 'Sáng chế 15+ công thức độc quyền'
    }
  ];

  const socialLinks = [
    { icon: '📘', name: 'Facebook', url: 'https://facebook.com/myskinbeauty', followers: '250K+' },
    { icon: '📷', name: 'Instagram', url: 'https://instagram.com/myskinbeauty', followers: '180K+' },
    { icon: '🎵', name: 'TikTok', url: 'https://tiktok.com/@myskinbeauty', followers: '320K+' },
    { icon: '📺', name: 'YouTube', url: 'https://youtube.com/myskinbeauty', followers: '95K+' }
  ];

  const achievements = [
    { year: '2024', title: 'Top 5 Thương hiệu mỹ phẩm uy tín', org: 'Beauty Awards Vietnam' },
    { year: '2023', title: 'Chứng nhận ISO 22716', org: 'Tổ chức Tiêu chuẩn Quốc tế' },
    { year: '2023', title: '"Best Online Beauty Store"', org: 'E-commerce Excellence Awards' },
    { year: '2022', title: 'Thương hiệu được yêu thích nhất', org: 'Vietnam Beauty Choice Awards' }
  ];

  return (
    <div className={styles.container}>
      {/* Floating Navigation */}
      <nav className={styles.floatingNav}>
        <button 
          className={`${styles.navBtn} ${activeSection === 'intro' ? styles.active : ''}`}
          onClick={() => scrollToSection('intro')}
        >
          🏠
        </button>
        <button 
          className={`${styles.navBtn} ${activeSection === 'mission' ? styles.active : ''}`}
          onClick={() => scrollToSection('mission')}
        >
          🎯
        </button>
        <button 
          className={`${styles.navBtn} ${activeSection === 'showcase' ? styles.active : ''}`}
          onClick={() => scrollToSection('showcase')}
        >
          📸
        </button>
        <button 
          className={`${styles.navBtn} ${activeSection === 'why-us' ? styles.active : ''}`}
          onClick={() => scrollToSection('why-us')}
        >
          ⭐
        </button>
        <button 
          className={`${styles.navBtn} ${activeSection === 'contact' ? styles.active : ''}`}
          onClick={() => scrollToSection('contact')}
        >
          📞
        </button>
      </nav>

      {/* Header Section */}
      <header className={styles.header} id="intro">
        <div className={styles.headerBackground}>
          <div className={styles.headerParticles}></div>
        </div>
        <div className={styles.headerContent}>
          <nav className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Trang chủ</Link>
            <span className={styles.breadcrumbSeparator}>›</span>
            <span className={styles.breadcrumbCurrent}>Giới thiệu</span>
          </nav>
          
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroMainText}>GIỚI THIỆU VỀ</span>
              <span className={styles.heroSubText}>KaKa</span>
              <span className={styles.heroTagline}>✨ Nơi tỏa sáng vẻ đẹp tự nhiên của bạn ✨</span>
            </h1>
            <p className={styles.heroDescription}>
              Hành trình 6 năm kiến tạo thương hiệu mỹ phẩm hàng đầu Việt Nam với sứ mệnh 
              mang đến vẻ đẹp tự nhiên, an toàn và bền vững cho phụ nữ Việt.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.contentContainer}>
          
          {/* 📝 Đoạn mở đầu */}
          <section className={`${styles.introSection} ${isLoaded ? styles.fadeIn : ''}`}>
            <div className={styles.introGrid}>
              <div className={styles.introText}>
                <h2 className={styles.sectionTitle}>Câu chuyện của chúng tôi</h2>
                <p className={styles.introParagraph}>
                  <strong>MySkin Beauty</strong> là cửa hàng chuyên cung cấp các sản phẩm chăm sóc da và 
                  mỹ phẩm chính hãng đến từ <span className={styles.highlight}>Hàn Quốc, Nhật Bản và châu Âu</span>.
                </p>
                <p className={styles.introParagraph}>
                  Với sứ mệnh mang đến vẻ đẹp tự nhiên, an toàn và bền vững, chúng tôi luôn 
                  <span className={styles.highlight}>chọn lọc kỹ lưỡng từng sản phẩm</span> để phù hợp 
                  với làn da phụ nữ Việt Nam.
                </p>
                <p className={styles.introParagraph}>
                  Từ những ngày đầu khởi nghiệp với ước mơ nhỏ, đến nay MySkin Beauty đã trở thành 
                  <span className={styles.highlight}>thương hiệu được hơn 150.000 khách hàng tin tưởng</span> 
                  với hệ thống phân phối trên toàn quốc.
                </p>
              </div>
              
              <div className={styles.introStats}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👥</div>
                  <div className={styles.statNumber}>150,000+</div>
                  <div className={styles.statLabel}>Khách hàng tin tưởng</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>🏪</div>
                  <div className={styles.statNumber}>300+</div>
                  <div className={styles.statLabel}>Điểm bán hàng</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>🌍</div>
                  <div className={styles.statNumber}>15+</div>
                  <div className={styles.statLabel}>Thương hiệu quốc tế</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>⭐</div>
                  <div className={styles.statNumber}>4.9/5</div>
                  <div className={styles.statLabel}>Đánh giá khách hàng</div>
                </div>
              </div>
            </div>
          </section>

          {/* 🎯 Sứ mệnh - Tầm nhìn - Giá trị cốt lõi */}
          <section className={styles.missionSection} id="mission">
            <h2 className={styles.sectionTitle}>Sứ mệnh - Tầm nhìn - Giá trị cốt lõi</h2>
            
            <div className={styles.missionGrid}>
              <div className={styles.missionCard}>
                <div className={styles.missionIcon}>🎯</div>
                <h3 className={styles.missionTitle}>Sứ mệnh (Mission)</h3>
                <p className={styles.missionText}>
                  Giúp khách hàng tự tin hơn mỗi ngày bằng những sản phẩm làm đẹp 
                  <strong>chất lượng, an toàn và hiệu quả</strong>. Chúng tôi cam kết mang đến 
                  trải nghiệm mua sắm tuyệt vời và dịch vụ chăm sóc khách hàng tận tâm.
                </p>
              </div>
              
              <div className={styles.missionCard}>
                <div className={styles.missionIcon}>🌟</div>
                <h3 className={styles.missionTitle}>Tầm nhìn (Vision)</h3>
                <p className={styles.missionText}>
                  Trở thành <strong>thương hiệu mỹ phẩm uy tín hàng đầu Việt Nam</strong>, 
                  mang đến trải nghiệm mua sắm tiện lợi và đáng tin cậy. Mở rộng ra 
                  thị trường khu vực Đông Nam Á vào năm 2026.
                </p>
              </div>
            </div>

            <div className={styles.valuesSection}>
              <h3 className={styles.valuesTitle}>🌸 Giá trị cốt lõi (Core Values)</h3>
              <div className={styles.valuesGrid}>
                <div className={styles.valueItem}>
                  <span className={styles.valueIcon}>🌸</span>
                  <span className={styles.valueText}>Chất lượng thật – Giá trị thật</span>
                </div>
                <div className={styles.valueItem}>
                  <span className={styles.valueIcon}>🌿</span>
                  <span className={styles.valueText}>An toàn & thân thiện với làn da</span>
                </div>
                <div className={styles.valueItem}>
                  <span className={styles.valueIcon}>💬</span>
                  <span className={styles.valueText}>Tận tâm với khách hàng</span>
                </div>
                <div className={styles.valueItem}>
                  <span className={styles.valueIcon}>🌎</span>
                  <span className={styles.valueText}>Hướng tới vẻ đẹp bền vững</span>
                </div>
              </div>
            </div>
          </section>

          {/* 📸 Hình ảnh minh họa */}
          <section className={styles.showcaseSection} id="showcase">
            <h2 className={styles.sectionTitle}>Khám phá MySkin Beauty</h2>
            <p className={styles.sectionDescription}>
              Hình ảnh cửa hàng, sản phẩm nổi bật và đội ngũ tư vấn chuyên nghiệp
            </p>
            
            <div className={styles.showcaseContainer}>
              <div className={styles.mainShowcase}>
                <div className={styles.imageContainer}>
                  <div 
                    className={styles.showcaseImage}
                    style={{ backgroundImage: `url(${showcaseImages[currentImageIndex]?.src || '/images/placeholder.jpg'})` }}
                  >
                    <div className={styles.imageOverlay}>
                      <h3 className={styles.imageTitle}>{showcaseImages[currentImageIndex]?.title}</h3>
                    </div>
                  </div>
                </div>
                
                <div className={styles.imageControls}>
                  {showcaseImages.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.imageIndicator} ${index === currentImageIndex ? styles.active : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
              
              <div className={styles.showcaseInfo}>
                <div className={styles.teamPreview}>
                  <h3 className={styles.teamTitle}>🧑‍🤝‍🧑 Đội ngũ chuyên gia</h3>
                  <div className={styles.teamList}>
                    {teamMembers.map(member => (
                      <div key={member.id} className={styles.teamMember}>
                        <span className={styles.memberAvatar}>{member.avatar}</span>
                        <div className={styles.memberInfo}>
                          <div className={styles.memberName}>{member.name}</div>
                          <div className={styles.memberPosition}>{member.position}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={styles.achievementsList}>
                  <h3 className={styles.achievementsTitle}>🏆 Thành tựu nổi bật</h3>
                  {achievements.map((achievement, index) => (
                    <div key={index} className={styles.achievementItem}>
                      <span className={styles.achievementYear}>{achievement.year}</span>
                      <div className={styles.achievementContent}>
                        <div className={styles.achievementTitle}>{achievement.title}</div>
                        <div className={styles.achievementOrg}>{achievement.org}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ⭐ Lý do nên chọn shop */}
          <section className={styles.whyUsSection} id="why-us">
            <h2 className={styles.sectionTitle}>Tại sao nên chọn MySkin Beauty?</h2>
            <p className={styles.sectionDescription}>
              6 lý do khiến hơn 150,000 khách hàng tin tưởng và lựa chọn chúng tôi
            </p>
            
            <div className={styles.whyUsGrid}>
              {whyChooseUs.map((reason, index) => (
                <div key={index} className={styles.whyUsCard}>
                  <div className={styles.whyUsIcon}>{reason.icon}</div>
                  <h3 className={styles.whyUsTitle}>{reason.title}</h3>
                  <p className={styles.whyUsDescription}>{reason.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 💌 Lời cảm ơn & Call to Action */}
          <section className={styles.thanksSection}>
            <div className={styles.thanksContent}>
              <h2 className={styles.thanksTitle}>💖 Lời cảm ơn chân thành</h2>
              <p className={styles.thanksText}>
                <strong>MySkin Beauty</strong> xin chân thành cảm ơn hơn <span className={styles.highlight}>150.000 khách hàng</span> 
                đã tin tưởng và đồng hành cùng chúng tôi trong suốt thời gian qua.
              </p>
              <p className={styles.thanksText}>
                Hãy cùng chúng tôi tiếp tục hành trình lan tỏa vẻ đẹp tự nhiên – 
                <strong>bắt đầu ngay hôm nay!</strong>
              </p>
              
              <div className={styles.ctaButtons}>
                <Link href="/cua-hang" className={styles.ctaButton}>
                  <span>🛒</span>
                  Khám phá sản phẩm
                </Link>
                <Link href="/tu-van" className={styles.ctaButtonSecondary}>
                  <span>💬</span>
                  Tư vấn miễn phí
                </Link>
                <Link href="/khuyen-mai" className={styles.ctaButtonSpecial}>
                  <span>🎁</span>
                  Ưu đãi đặc biệt
                </Link>
              </div>
            </div>
          </section>

          {/* 📍 Thông tin liên hệ */}
          <section className={styles.contactSection} id="contact">
            <h2 className={styles.sectionTitle}>📍 Thông tin liên hệ</h2>
            
            <div className={styles.contactGrid}>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>🏪</div>
                  <div className={styles.contactText}>
                    <strong>Địa chỉ cửa hàng chính:</strong><br/>
                    123 Nguyễn Văn Linh, Quận 7, TP.HCM<br/>
                    <em>Mở cửa: 8:00 - 21:00 (Thứ 2 - Chủ nhật)</em>
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>📞</div>
                  <div className={styles.contactText}>
                    <strong>Hotline hỗ trợ:</strong><br/>
                    📱 <a href="tel:0901234567">0901 234 567</a> (Zalo/Viber)<br/>
                    ☎️ <a href="tel:02838901234">(028) 3890 1234</a> (Cố định)
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>✉️</div>
                  <div className={styles.contactText}>
                    <strong>Email hỗ trợ:</strong><br/>
                    📧 <a href="mailto:support@myskinbeauty.vn">support@myskinbeauty.vn</a><br/>
                    📧 <a href="mailto:sales@myskinbeauty.vn">sales@myskinbeauty.vn</a>
                  </div>
                </div>
              </div>
              
              <div className={styles.socialSection}>
                <h3 className={styles.socialTitle}>🌐 Kết nối với chúng tôi</h3>
                <div className={styles.socialGrid}>
                  {socialLinks.map((social, index) => (
                    <a key={index} href={social.url} className={styles.socialLink}>
                      <span className={styles.socialIcon}>{social.icon}</span>
                      <div className={styles.socialInfo}>
                        <div className={styles.socialName}>{social.name}</div>
                        <div className={styles.socialFollowers}>{social.followers} followers</div>
                      </div>
                    </a>
                  ))}
                </div>
                
                <div className={styles.businessHours}>
                  <h4 className={styles.hoursTitle}>⏰ Giờ làm việc</h4>
                  <div className={styles.hoursList}>
                    <div className={styles.hoursItem}>
                      <span>Thứ 2 - Thứ 6:</span>
                      <span>8:00 - 21:00</span>
                    </div>
                    <div className={styles.hoursItem}>
                      <span>Thứ 7 - Chủ nhật:</span>
                      <span>8:00 - 22:00</span>
                    </div>
                    <div className={styles.hoursItem}>
                      <span>Hotline 24/7:</span>
                      <span>Luôn sẵn sàng hỗ trợ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}