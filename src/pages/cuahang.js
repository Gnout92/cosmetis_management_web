import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/cuahang.module.css';
import { 
  Store, 
  MapPin, 
  MessageCircle, 
  Phone, 
  Mail, 
  Building, 
  Clock, 
  Users, 
  Star, 
  X, 
  CheckCircle, 
  Gift, 
  Zap, 
  Target 
} from 'lucide-react';

// Icons đã được import từ lucide-react

const CuaHang = () => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  // Dữ liệu chi nhánh cửa hàng với dịch vụ nổi bật
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
      image: "/images/store-cantho.jpg",
      staffCount: "8 chuyên viên tư vấn chuyên nghiệp",
      services: ["Trang điểm tự nhiên", "Test da miễn phí", "Tặng mẫu thử", "Tư vấn skincare"],
      features: ["Spa mini 2 giường", "Phòng tư vấn riêng", "Khu vực makeup cá nhân"]
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
      image: "/images/store-hcm-q1.jpg",
      staffCount: "12 chuyên gia làm đẹp",
      services: ["Makeup event & gala", "Workshop makeup miễn phí", "Đặt lịch online", "Giao hàng nhanh 1h"],
      features: ["Spa cao cấp 4 giường", "Phòng makeup chuyên nghiệp", "Khu vực group booking"]
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
      image: "/images/store-hcm-q7.jpg",
      staffCount: "10 beauty consultant",
      services: ["Trang điểm cô dâu", "Makeup photoshoot", "Event makeup", "Combo tiết kiệm"],
      features: ["Phòng tư vấn VIP", "Khu vực trang điểm cô dâu", "Khu vực retail rộng"]
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
      image: "/images/store-danang.jpg",
      staffCount: "6 beauty specialist",
      services: ["Chống nắng biển miễn phí", "Kem mát cho sân bay", "Combo du lịch", "Giao hàng miễn phí"],
      features: ["Khu vực chống nắng chuyên biệt", "Phòng tư vấn du lịch", "Showroom cỡ lớn"]
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
      image: "/images/store-hanoi-badinh.jpg",
      staffCount: "9 makeup artist chuyên nghiệp",
      services: ["Office makeup", "Makeup dự tiệc tối", "Tư vấn trang điểm công sở", "Đặt lịch ngoài giờ"],
      features: ["Spa nâng cao với 3 giường", "Phòng makeup công sở", "Khu vực tư vấn VIP"]
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
      image: "/images/store-hanoi-caugiay.jpg",
      staffCount: "7 beauty expert",
      services: ["Học việc makeup free", "Team booking ưu đãi", "App đặt lịch tối ưu", "Shopping helper 24/7"],
      features: ["Phòng training makeup", "Khu vực group learning", "Showroom công nghệ cao"]
    }
  ];

  // Dữ liệu hình ảnh cửa hàng
  const storeImages = [
    {
      id: 1,
      title: "Kệ trưng bày mỹ phẩm cao cấp",
      image: "/images/banners/banner1.jpg",
      description: "Không gian trưng bày hiện đại với đầy đủ các sản phẩm mỹ phẩm chất lượng cao từ các thương hiệu uy tín trên thế giới"
    },
    {
      id: 2,
      title: "Khu tư vấn làm đẹp chuyên nghiệp",
      image: "/images/banners/banner2.jpg",
      description: "Khu vực tư vấn riêng tư với đội ngũ chuyên viên giàu kinh nghiệm, được đào tạo bài bản về skincare và makeup"
    },
    {
      id: 3,
      title: "Nhân viên chăm sóc khách hàng",
      image: "/images/banners/banner3.jpg",
      description: "Đội ngũ nhân viên tận tâm, chuyên nghiệp phục vụ khách hàng 24/7 với thái độ nhiệt tình, tư vấn chính xác"
    },
    {
      id: 4,
      title: "Không gian mua sắm thoải mái",
      image: "/images/banners/banner1.jpg",
      description: "Thiết kế nội thất sang trọng, tạo cảm giác thư giãn khi mua sắm với ghế ngồi, nước uống miễn phí và wifi free"
    }
  ];

  // Dữ liệu sản phẩm và dịch vụ
  const productCategories = [
    {
      id: 1,
      name: "Chăm Sóc Da",
      products: ["Serum & Essence", "Kem dưỡng ẩm", "Sữa rửa mặt", "Tẩy trang", "Mặt nạ"],
      testAvailable: true,
      description: "Test da miễn phí, tư vấn skin care cá nhân",
      features: ["Gợi ý sản phẩm phù hợp với từng loại da (da khô, da dầu, da hỗn hợp, da nhạy cảm)"],
      tags: ["Test trực tiếp", "Tư vấn miễn phí"]
    },
    {
      id: 2,
      name: "Trang Điểm",
      products: ["Son môi", "Phấn mắt", "Mascara", "Phấn nước", "Phấn má"],
      testAvailable: true,
      description: "Thử màu trực tiếp, tư vấn màu sắc phù hợp",
      features: ["Combo trang điểm", "Makeup dự tiệc", "Trang điểm cô dâu"],
      tags: ["Test màu", "Tư vấn phong cách"]
    },
    {
      id: 3,
      name: "Chăm Sóc Cơ Thể",
      products: ["Sữa dưỡng thể", "Tẩy tế bào chết", "Dầu massage", "Kem chống nắng"],
      testAvailable: false,
      description: "Gợi ý sản phẩm phù hợp với từng loại da",
      features: ["Dưỡng da", "Làm sạch", "Bảo vệ"],
      tags: ["Chăm sóc toàn thân"]
    },
    {
      id: 4,
      name: "Dịch Vụ Làm Đẹp",
      products: ["Trang điểm cô dâu", "Makeup event", "Tư vấn skincare", "Workshop"],
      testAvailable: true,
      description: "Đặt lịch online, tư vấn trực tiếp miễn phí",
      features: ["Dịch vụ tại nhà", "Makeup party"],
      tags: ["Đặt lịch online", "Dịch vụ cao cấp"]
    }
  ];

  // Quy trình trải nghiệm khách hàng (5 bước hoàn chỉnh)
  const customerJourney = [
    {
      step: 1,
      title: "Nhận tư vấn",
      description: "Phân tích loại da & nhu cầu cá nhân",
      duration: "10-15 phút",
      features: ["Test da miễn phí", "Tư vấn skincare", "Lên routine chăm sóc"]
    },
    {
      step: 2,
      title: "Chọn sản phẩm",
      description: "Trải nghiệm sản phẩm & thử màu",
      duration: "20-30 phút",
      features: ["Thử son trực tiếp", "Test serum", "So sánh sản phẩm"]
    },
    {
      step: 3,
      title: "Thanh toán",
      description: "Nhiều phương thức thanh toán tiện lợi",
      duration: "5 phút",
      features: ["Cash/Card/MoMo/QR Pay", "Tích điểm VIP", "Áp dụng khuyến mãi"]
    },
    {
      step: 4,
      title: "Nhận hàng",
      description: "Đóng gói cẩn thận & giao tận nơi",
      duration: "3-5 phút (tại cửa hàng) / 1-3 ngày (giao hàng)",
      features: ["Đóng gói chuyên nghiệp", "Tặng quà", "Hướng dẫn sử dụng"],
      additional: ["Tại cửa hàng: Đóng gói chuyên nghiệp, Tặng quà, Hướng dẫn sử dụng", "Giao hàng: Đóng gói cẩn thận, Giao tận nơi, Theo dõi đơn hàng"]
    },
    {
      step: 5,
      title: "Hậu mãi",
      description: "Follow-up & hỗ trợ 24/7",
      duration: "Dài hạn (3 ngày, 1 tuần, 1 tháng)",
      features: ["Call sau 3 ngày", "Zalo hỗ trợ", "Chương trình VIP"],
      additional: ["Hướng dẫn sử dụng", "Tái mua", "Review sản phẩm"]
    }
  ];

  // Chương trình khách hàng thân thiết
  const loyaltyProgram = [
    {
      level: "Bronze",
      minPurchase: "Chưa có mua hàng",
      benefits: ["Tích điểm 1%", "Sinh nhật tặng 50k", "Newsletter khuyến mãi"],
      color: "#CD7F32",
      icon: <Star className="text-2xl" />
    },
    {
      level: "Silver",
      minPurchase: "Từ 2,000,000đ",
      benefits: ["Tích điểm 2%", "Giảm 5% đơn hàng", "Free sample", "Ưu tiên tư vấn"],
      color: "#C0C0C0",
      icon: <Star className="text-2xl" />
    },
    {
      level: "Gold",
      minPurchase: "Từ 5,000,000đ",
      benefits: ["Tích điểm 3%", "Giảm 10% đơn hàng", "Makeup demo miễn phí", "Đặt lịch ưu tiên"],
      color: "#FFD700",
      icon: <Star className="text-2xl" />
    },
    {
      level: "Diamond",
      minPurchase: "Từ 10,000,000đ",
      benefits: ["Tích điểm 5%", "Giảm 15% đơn hàng", "Personal consultant", "Miễn phí giao hàng"],
      color: "#B9F2FF",
      icon: <Star className="text-2xl" />
    }
  ];

  // Kênh bán hàng đa chiều (Omnichannel)
  const salesChannels = [
    {
      channel: "Tại cửa hàng",
      features: ["Trải nghiệm trực tiếp", "Tư vấn face-to-face", "Test sản phẩm", "Dịch vụ tại chỗ"],
      contact: "Lấy số thứ tự hoặc đặt lịch online qua app KaKa Beauty",
      benefits: "Test trực tiếp, tư vấn chuyên sâu, dịch vụ tại chỗ"
    },
    {
      channel: "Mua sắm online",
      features: ["Website: www.kakacosmetica.com", "App mobile KaKa Beauty", "Giao hàng nhanh 1h", "Đổi trả trong 30 ngày"],
      contact: "Hotline: 1900-KAKA (1900-5252)",
      benefits: "Mua sắm 24/7, giao hàng toàn quốc, deal online"
    },
    {
      channel: "Marketplace",
      features: ["Shopee, Lazada, Tiki", "Review 4.8+ sao", "Flash sale hàng tuần", "Voucher độc quyền"],
      contact: "@kakacosmetica trên các platform",
      benefits: "Bán hàng qua nền tảng uy tín, review cao"
    },
    {
      channel: "Mạng xã hội",
      features: ["Facebook, Instagram, Zalo", "Live shopping hàng tuần", "Influencer collaboration", "Customer support 24/7"],
      contact: "Tin nhắn trực tiếp hoặc hotline 1900-KAKA",
      benefits: "Kết nối cộng đồng, tương tác trực tiếp"
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
    if (e && e.target && e.target.name !== undefined) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value || ''
      });
    }
  };

  const handleSubmitContact = (e) => {
    e.preventDefault();
    if (e) {
      // Xử lý gửi form ở đây
      console.log('Form data:', formData);
      alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
      setShowContactForm(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
    }
  };

  const handleCallBranch = (phone) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  const handleGetDirections = (address) => {
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  const handleViewMap = (branch) => {
    if (branch) {
      setSelectedBranch(branch);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.mainTitle}>
            <Store className="inline-block mr-3 text-4xl" /> Hệ Thống Cửa Hàng KaKa Mỹ Phẩm
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
              <span className={styles.statLabel}>Sản phẩm chính hãng</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>Hỗ trợ khách hàng</span>
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
          onClick={() => handleCallBranch('1900-5252')}
        >
          <Phone className={styles.actionIcon} />
          Gọi ngay
        </button>
        <button 
          className={styles.actionBtn}
          onClick={() => window.open('https://www.facebook.com/kakacosmetica', '_blank')}
        >
          <Phone className={styles.actionIcon} />
          Fanpage
        </button>
        <button 
          className={styles.actionBtn}
          onClick={() => window.open('https://zalo.me/kakacosmetica', '_blank')}
        >
          <MessageCircle className={styles.actionIcon} />
          Zalo
        </button>
        <button 
          className={styles.actionBtn}
          onClick={() => setShowContactForm(true)}
        >
          <Mail className={styles.actionIcon} />
          Liên hệ
        </button>
      </div>

      {/* Branches Section */}
      <div className={styles.branchesSection}>
        <h2 className={styles.sectionTitle}>
          <MapPin className="inline-block mr-3 text-2xl" /> Danh Sách Chi Nhánh
        </h2>
        
        {Object.entries(branchesByRegion || {}).map(([region, regionBranches]) => (
          <div key={region} className={styles.regionContainer}>
            <h3 className={styles.regionTitle}>{region}</h3>
            <div className={styles.branchGrid}>
              {(regionBranches || []).filter(branch => branch).map((branch, index) => (
                <div key={branch?.id || index} className={styles.branchCard}>
                  <div className={styles.branchHeader}>
                    <h4 className={styles.branchName}>{branch?.name || ''}</h4>
                    <div className={styles.branchBadge}>{branch?.region || ''}</div>
                  </div>
                  
                  <div className={styles.branchInfo}>
                    <div className={styles.infoItem}>
                      <MapPin className={styles.infoIcon} />
                      <span className={styles.infoText}>{branch?.address || ''}</span>
                    </div>
                    
                    <div className={styles.infoItem}>
                      <Phone className={styles.infoIcon} />
                      <span className={styles.infoText}>{branch?.phone || ''}</span>
                    </div>
                    
                    <div className={styles.infoItem}>
                      <Clock className={styles.infoIcon} />
                      <span className={styles.infoText}>{branch?.hours || ''}</span>
                    </div>
                    
                    <div className={styles.infoItem}>
                      <Mail className={styles.infoIcon} />
                      <span className={styles.infoText}>{branch?.email || ''}</span>
                    </div>
                  </div>
                  
                  <div className={styles.branchStaffInfo}>
                    <Users className={styles.staffIcon} />
                    <span className={styles.staffText}>{branch?.staffCount || ''}</span>
                  </div>
                  
                  <div className={styles.branchServices}>
                    <h5 className={styles.servicesTitle}><Star className="inline-block mr-2 text-lg" /> Dịch vụ nổi bật:</h5>
                    <div className={styles.servicesList}>
                      {(branch.services || []).map((service, index) => (
                        <div key={index} className={styles.serviceItem}>
                          <CheckCircle className="inline-block mr-2 text-sm" />
                          <span>{service || ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={styles.branchFeatures}>
                    <h6 className={styles.featuresTitle}><Building className="inline-block mr-2 text-lg" /> Tiện ích:</h6>
                    <ul className={styles.featuresList}>
                      {(branch.features || []).map((feature, index) => (
                        <li key={index} className={styles.featureItem}>
                          <Building className="inline-block mr-2 text-sm" />
                          {feature || ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={styles.branchActions}>
                    <button 
                      className={styles.mapBtn}
                      onClick={() => handleViewMap(branch || {})}
                    >
                      <MapPin className="inline-block mr-2" /> Xem bản đồ
                    </button>
                    <button 
                      className={styles.contactBtn}
                      onClick={() => handleCallBranch(branch?.phone || '')}
                    >
                      <MessageCircle className="inline-block mr-2" /> Liên hệ ngay
                    </button>
                    <button 
                      className={styles.directionBtn}
                      onClick={() => handleGetDirections(branch?.address || '')}
                    >
                      <Target className="inline-block mr-2" /> Chỉ đường
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Customer Journey Section */}
      <div className={styles.journeySection}>
        <h2 className={styles.sectionTitle}>
          <Zap className="inline-block mr-3 text-2xl" /> Quy Trình Trải Nghiệm Khách Hàng (5 Bước Hoàn Chỉnh)
        </h2>
        <div className={styles.journeyFlow}>
          {(customerJourney || []).filter(step => step).map((step, journeyIndex) => (
            <div key={step.step} className={styles.journeyStep}>
              <div className={styles.stepNumber}>
                {step.step}
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step?.title || ''}</h3>
                <p className={styles.stepDescription}>{step?.description || ''}</p>
                <div className={styles.stepDuration}>
                  <Clock className={styles.durationIcon} />
                  <span>{step?.duration || ''}</span>
                </div>
                <div className={styles.stepFeatures}>
                  {(step.features || []).map((feature, idx) => (
                    <span key={idx} className={styles.stepFeature}>{feature || ''}</span>
                  ))}
                </div>
                {(step.additional || []).length > 0 && (
                  <div className={styles.additionalFeatures}>
                    {(step.additional || []).map((additional, addIdx) => (
                      <p key={addIdx} className={styles.additionalText}>
                        {additional || ''}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              {journeyIndex < customerJourney.length - 1 && (
                <div className={styles.stepConnector}>
                  <div className={styles.connectorLine}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Store Images Gallery */}
      <div className={styles.gallerySection}>
        <h2 className={styles.sectionTitle}>
          <Mail className="inline-block mr-3 text-2xl" /> Hình Ảnh Cửa Hàng
        </h2>
        <div className={styles.imageGrid}>
          {(storeImages || []).filter(item => item).map((item, index) => (
            <div key={item?.id || index} className={styles.imageCard}>
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
                <h4 className={styles.imageTitle}>{item?.title || ''}</h4>
                <p className={styles.imageDescription}>{item?.description || ''}</p>
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
              <h3><Mail className="inline-block mr-2 text-xl" /> Đăng Ký Nhận Thông Tin</h3>
              <button 
                className={styles.closeModalBtn}
                onClick={() => setShowContactForm(false)}
              >
                <X className="w-6 h-6" />
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
            <h3><Star className="inline-block mr-2 text-xl" /> KaKa Mỹ Phẩm</h3>
            <p>Chuyên cung cấp mỹ phẩm chất lượng cao, uy tín hàng đầu Việt Nam</p>
          </div>
          
          <div className={styles.footerContact}>
            <h4>Liên hệ tổng đài</h4>
            <p><Phone className="inline-block mr-2" /> Hotline: 1900-KAKA (1900-5252)</p>
            <p><Mail className="inline-block mr-2" /> Email: info@kakacosmetica.com</p>
            <p><Building className="inline-block mr-2" /> Website: www.kakacosmetica.com</p>
            <p><Building className="inline-block mr-2" /> Trụ sở: Tầng 15, Tòa nhà KaKa Tower, 123 Nguyễn Văn Cừ, Quận 1, TP.HCM</p>
          </div>
          
          <div className={styles.footerSocial}>
            <h4>Theo dõi chúng tôi</h4>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com/kakacosmetica" target="_blank" rel="noopener noreferrer">
                <Phone className="inline-block mr-2" /> Facebook
              </a>
              <a href="https://instagram.com/kakacosmetica" target="_blank" rel="noopener noreferrer">
                <Mail className="inline-block mr-2" /> Instagram
              </a>
              <a href="https://zalo.me/kakacosmetica" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="inline-block mr-2" /> Zalo
              </a>
              <a href="https://tiktok.com/@kaka.cosmetics" target="_blank" rel="noopener noreferrer">
                <Star className="inline-block mr-2" /> TikTok
              </a>
              <a href="https://youtube.com/kakacosmetica" target="_blank" rel="noopener noreferrer">
                <Mail className="inline-block mr-2" /> YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuaHang;