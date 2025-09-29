import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/gioithieu.module.css';

export default function GioiThieu()  {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('story');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: 'Nguyễn Văn Minh',
      position: 'CEO & Founder',
      avatar: '👨‍💼',
      description: 'Hơn 15 năm kinh nghiệm trong ngành mỹ phẩm',
      speciality: 'Chiến lược phát triển thương hiệu'
    },
    {
      id: 2,
      name: 'Trần Thị Lan',
      position: 'Chief Marketing Officer',
      avatar: '👩‍💼',
      description: 'Chuyên gia marketing với nhiều chiến dịch thành công',
      speciality: 'Digital Marketing & Brand Development'
    },
    {
      id: 3,
      name: 'Dr. Lê Văn Khánh',
      position: 'Head of R&D',
      avatar: '👨‍🔬',
      description: 'Tiến sĩ Hóa học, chuyên gia nghiên cứu công thức',
      speciality: 'Product Research & Development'
    },
    {
      id: 4,
      name: 'Phạm Thị Hương',
      position: 'Customer Experience Manager',
      avatar: '👩‍💻',
      description: 'Đảm bảo trải nghiệm khách hàng tốt nhất',
      speciality: 'Customer Service & Quality Control'
    }
  ];

  const achievements = [
    {
      icon: '🏆',
      title: 'Thương hiệu uy tín',
      description: 'Top 10 thương hiệu mỹ phẩm nam được yêu thích nhất Việt Nam',
      year: '2024'
    },
    {
      icon: '🌟',
      title: 'Chất lượng quốc tế',
      description: 'Chứng nhận ISO 22716 về tiêu chuẩn sản xuất mỹ phẩm',
      year: '2023'
    },
    {
      icon: '💚',
      title: 'Thân thiện môi trường',
      description: 'Cam kết sử dụng 100% bao bì tái chế và thành phần tự nhiên',
      year: '2023'
    },
    {
      icon: '🔬',
      title: 'Đột phá công nghệ',
      description: 'Ra mắt công nghệ Nano-Peptide độc quyền cho sản phẩm nam',
      year: '2024'
    }
  ];

  const timeline = [
    {
      year: '2018',
      title: 'Khởi đầu hành trình',
      description: 'Thành lập công ty với tầm nhìn cung cấp sản phẩm chăm sóc da chất lượng cao cho nam giới Việt Nam'
    },
    {
      year: '2019',
      title: 'Sản phẩm đầu tiên',
      description: 'Ra mắt dòng sản phẩm chăm sóc da cơ bản với 5 sản phẩm core'
    },
    {
      year: '2020',
      title: 'Mở rộng thị trường',
      description: 'Phát triển hệ thống phân phối trên toàn quốc với hơn 100 đại lý'
    },
    {
      year: '2021',
      title: 'Chuyển đổi số',
      description: 'Xây dựng nền tảng thương mại điện tử và ứng dụng mobile'
    },
    {
      year: '2022',
      title: 'Nghiên cứu phát triển',
      description: 'Thành lập phòng lab R&D với đội ngũ chuyên gia quốc tế'
    },
    {
      year: '2023',
      title: 'Mở rộng quốc tế',
      description: 'Xuất khẩu sản phẩm ra thị trường Đông Nam Á'
    },
    {
      year: '2024',
      title: 'MỸPHẨM NAM V2',
      description: 'Ra mắt thương hiệu mới với công nghệ tiên tiến và trải nghiệm khách hàng vượt trội'
    }
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Chất lượng',
      description: 'Cam kết mang đến sản phẩm chất lượng cao nhất với tiêu chuẩn quốc tế'
    },
    {
      icon: '🤝',
      title: 'Tin cậy',
      description: 'Xây dựng niềm tin qua từng sản phẩm và dịch vụ chăm sóc khách hàng'
    },
    {
      icon: '🚀',
      title: 'Đổi mới',
      description: 'Không ngừng nghiên cứu và phát triển để đem đến giải pháp tối ưu'
    },
    {
      icon: '🌱',
      title: 'Bền vững',
      description: 'Bảo vệ môi trường với quy trình sản xuất xanh và bao bì tái chế'
    }
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
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
              <span className={styles.heroMainText}>GIỚI THIỆU</span>
              <span className={styles.heroSubText}>MỸPHẨM NAM V2</span>
            </h1>
            <p className={styles.heroDescription}>
              Hành trình 6 năm kiến tạo thương hiệu mỹ phẩm nam hàng đầu Việt Nam
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.contentContainer}>
          
          {/* Tab Navigation */}
          <div className={styles.tabNavigation}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'story' ? styles.active : ''}`}
              onClick={() => setActiveTab('story')}
            >
              <span>📖</span>
              Câu chuyện của chúng tôi
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'team' ? styles.active : ''}`}
              onClick={() => setActiveTab('team')}
            >
              <span>👥</span>
              Đội ngũ
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'timeline' ? styles.active : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              <span>📅</span>
              Lịch sử phát triển
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'achievements' ? styles.active : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              <span>🏆</span>
              Thành tựu
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            
            {/* Story Tab */}
            {activeTab === 'story' && (
              <div className={`${styles.storySection} ${isLoaded ? styles.fadeIn : ''}`}>
                <div className={styles.storyGrid}>
                  <div className={styles.storyText}>
                    <h2 className={styles.sectionTitle}>Câu chuyện khởi nguồn</h2>
                    <p className={styles.storyParagraph}>
                      MỸPHẨM NAM V2 ra đời từ một câu hỏi đơn giản: "Tại sao nam giới Việt Nam 
                      lại phải chấp nhận những sản phẩm chăm sóc da không phù hợp với làn da 
                      và khí hậu nhiệt đới của mình?"
                    </p>
                    <p className={styles.storyParagraph}>
                      Xuất phát từ niềm đam mê nghiên cứu về da và mong muốn mang đến giải pháp 
                      chăm sóc da chuyên biệt cho nam giới, đội ngũ sáng lập đã dành 6 năm để 
                      nghiên cứu, thử nghiệm và hoàn thiện từng công thức.
                    </p>
                    <p className={styles.storyParagraph}>
                      Hôm nay, chúng tôi tự hào là thương hiệu được hơn 50.000 khách hàng tin tưởng, 
                      với hệ thống phân phối trên toàn quốc và đang mở rộng ra thị trường quốc tế.
                    </p>
                  </div>
                  
                  <div className={styles.storyStats}>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>🎯</div>
                      <div className={styles.statNumber}>50,000+</div>
                      <div className={styles.statLabel}>Khách hàng tin tưởng</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>🏪</div>
                      <div className={styles.statNumber}>200+</div>
                      <div className={styles.statLabel}>Điểm bán hàng</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>📦</div>
                      <div className={styles.statNumber}>150+</div>
                      <div className={styles.statLabel}>Sản phẩm</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>⭐</div>
                      <div className={styles.statNumber}>4.9/5</div>
                      <div className={styles.statLabel}>Đánh giá khách hàng</div>
                    </div>
                  </div>
                </div>

                {/* Values Section */}
                <div className={styles.valuesSection}>
                  <h2 className={styles.sectionTitle}>Giá trị cốt lõi</h2>
                  <div className={styles.valuesGrid}>
                    {values.map((value, index) => (
                      <div key={index} className={styles.valueCard}>
                        <div className={styles.valueIcon}>{value.icon}</div>
                        <h3 className={styles.valueTitle}>{value.title}</h3>
                        <p className={styles.valueDescription}>{value.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div className={`${styles.teamSection} ${isLoaded ? styles.slideUp : ''}`}>
                <h2 className={styles.sectionTitle}>Đội ngũ lãnh đạo</h2>
                <p className={styles.sectionDescription}>
                  Những con người tài năng và đam mê đang kiến tạo tương lai của MỸPHẨM NAM V2
                </p>
                
                <div className={styles.teamGrid}>
                  {teamMembers.map(member => (
                    <div key={member.id} className={styles.teamCard}>
                      <div className={styles.teamAvatar}>
                        <span className={styles.avatarIcon}>{member.avatar}</span>
                      </div>
                      <div className={styles.teamInfo}>
                        <h3 className={styles.teamName}>{member.name}</h3>
                        <p className={styles.teamPosition}>{member.position}</p>
                        <p className={styles.teamDescription}>{member.description}</p>
                        <div className={styles.teamSpeciality}>
                          <span className={styles.specialityLabel}>Chuyên môn:</span>
                          <span className={styles.specialityText}>{member.speciality}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className={`${styles.timelineSection} ${isLoaded ? styles.fadeIn : ''}`}>
                <h2 className={styles.sectionTitle}>Hành trình phát triển</h2>
                <p className={styles.sectionDescription}>
                  Từ những bước đầu tiên đến thành công hôm nay
                </p>
                
                <div className={styles.timeline}>
                  {timeline.map((event, index) => (
                    <div key={index} className={styles.timelineItem}>
                      <div className={styles.timelineYear}>{event.year}</div>
                      <div className={styles.timelineContent}>
                        <h3 className={styles.timelineTitle}>{event.title}</h3>
                        <p className={styles.timelineDescription}>{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className={`${styles.achievementsSection} ${isLoaded ? styles.slideUp : ''}`}>
                <h2 className={styles.sectionTitle}>Thành tựu và giải thưởng</h2>
                <p className={styles.sectionDescription}>
                  Những dấu mốc quan trọng khẳng định vị thế của MỸPHẨM NAM V2
                </p>
                
                <div className={styles.achievementsGrid}>
                  {achievements.map((achievement, index) => (
                    <div key={index} className={styles.achievementCard}>
                      <div className={styles.achievementIcon}>{achievement.icon}</div>
                      <div className={styles.achievementYear}>{achievement.year}</div>
                      <h3 className={styles.achievementTitle}>{achievement.title}</h3>
                      <p className={styles.achievementDescription}>{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className={styles.ctaSection}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Hãy là một phần của hành trình này</h2>
              <p className={styles.ctaDescription}>
                Khám phá bộ sưu tập sản phẩm chăm sóc da nam cao cấp và trải nghiệm 
                sự khác biệt mà MỸPHẨM NAM V2 mang lại.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/cua-hang" className={styles.ctaButton}>
                  <span>🛒</span>
                  Khám phá sản phẩm
                </Link>
                <Link href="/ho-tro-khach-hang" className={styles.ctaButtonSecondary}>
                  <span>💬</span>
                  Tư vấn miễn phí
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}