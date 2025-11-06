import { useEffect, useState } from "react";
import styles from '../styles/Home.module.css';
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { 
  MdHome,
  MdInfo,
  MdCategory,
  MdStore,
  MdShoppingCart,
  MdVerified,
  MdSupport,
  MdAccountCircle,
  MdSearch,
  MdExpandMore,
  MdLocalShipping,
  MdSecurity,
  MdCall
} from 'react-icons/md';

export default function HomePage() {
  // const [authUser, setAuthUser] = useState(null);
  const { authUser, isAuthenticated, logout } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [wishlistItems, setWishlistItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [countdown, setCountdown] = useState({ hours: '23', minutes: '59', seconds: '59' });
  const router = useRouter();

  // Smooth scroll và scroll effects
  useEffect(() => {
    setIsLoaded(true);
    
    // Simulate loading cart items from localStorage
    const cartCount = localStorage.getItem('cartCount') || Math.floor(Math.random() * 5);
    const wishlistCount = localStorage.getItem('wishlistCount') || Math.floor(Math.random() * 8);
    setCartItems(parseInt(cartCount));
    setWishlistItems(parseInt(wishlistCount));

    // Scroll listener cho navigation effects
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Intersection Observer cho animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation classes for smooth reveal
            entry.target.classList.add('fade-in-up');
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    // Observe all animatable elements
    const animationElements = document.querySelectorAll('[data-animation-id]');
    animationElements.forEach((el) => observer.observe(el));

    // Countdown timer - đếm ngược đến nửa đêm
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown({
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    }, 1000);

    // Auto-slide banner carousel
    const bannerInterval = setInterval(nextBanner, 5000); // Chuyển banner mỗi 5 giây

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      clearInterval(timer);
      clearInterval(bannerInterval);
    };
  }, []);
  
  
   // Handle account click
  const handleAccountClick = () => {
    router.push('/tai-khoan');
  };

  // Enhanced search functionality
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      // Smooth scroll to top before navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
      }, 300);
    }
  };

  // Banner carousel functionality
  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % 3);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + 3) % 3);
  };

  const goToBanner = (index) => {
    setCurrentBannerIndex(index);
  };

  // Newsletter subscription handler
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput?.value?.trim();
    
    if (!email) {
      alert('Vui lòng nhập email hợp lệ!');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Vui lòng nhập email hợp lệ!');
      return;
    }
    
    // Simulate successful subscription
    emailInput.value = '';
    alert('Đăng ký thành công! Bạn sẽ nhận được thông tin mới nhất qua email.');
  };

  // Enhanced add to cart with better UX
  function handleAddToCart(productId) {
    const newCount = cartItems + 1;
    setCartItems(newCount);
    localStorage.setItem('cartCount', newCount.toString());
    
    // Enhanced animation effect
    const button = document.querySelector(`[data-product-id="${productId}"]`);
    if (button) {
      // Create ripple effect
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        width: 20px;
        height: 20px;
        left: 50%;
        top: 50%;
        margin-left: -10px;
        margin-top: -10px;
      `;
      
      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
      
      // Add bounce animation
      button.style.transform = 'scale(1.1)';
      button.style.transition = 'transform 0.2s ease';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 200);
    }
  }

  // Enhanced wishlist functionality
  function handleAddToWishlist(productId) {
    const newCount = wishlistItems + 1;
    setWishlistItems(newCount);
    localStorage.setItem('wishlistCount', newCount.toString());
    
    // Show heart animation
    const heartBtn = document.querySelector(`[data-wishlist-id="${productId}"]`);
    if (heartBtn) {
      heartBtn.style.transform = 'scale(1.3)';
      heartBtn.style.color = '#EF4444';
      setTimeout(() => {
        heartBtn.style.transform = 'scale(1)';
        heartBtn.style.color = '';
      }, 300);
    }
  }

  // Handle Enter key press in search input
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const copyPromoCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      alert(`Đã copy mã ${code} vào clipboard!`);
    }).catch(err => {
      console.error('Lỗi khi copy: ', err);
    });
  };


  // Featured Products Data (5x3 = 15 products)
  const featuredProducts = [
    {
      id: 1,
      name: "Sữa rửa mặt làm sạch sâu",
      price: "299.000₫",
      originalPrice: "399.000₫",
      image: "/images/banners/1.jpg",
      rating: 4.8,
      discount: "25%"
    },
    {
      id: 2,
      name: "Serum vitamin C chống lão hóa",
      price: "899.000₫",
      originalPrice: "1.199.000₫",
      image: "/images/banners/2.jpg",
      rating: 4.9,
      discount: "25%"
    },
    {
      id: 3,
      name: "Kem dưỡng ẩm ban ngày",
      price: "599.000₫",
      originalPrice: "799.000₫",
      image: "/images/banners/3.jpg",
      rating: 4.7,
      discount: "25%"
    },
    {
      id: 4,
      name: "Toner cân bằng pH",
      price: "399.000₫",
      originalPrice: "499.000₫",
      image: "/images/banners/4.jpg",
      rating: 4.6,
      discount: "20%"
    },
    {
      id: 5,
      name: "Kem chống nắng SPF50+",
      price: "499.000₫",
      originalPrice: "699.000₫",
      image: "/images/banners/5.jpg",
      rating: 4.8,
      discount: "29%"
    },
    {
      id: 6,
      name: "Mặt nạ hydrogel phục hồi",
      price: "199.000₫",
      originalPrice: "299.000₫",
      image: "/images/banners/6.jpg",
      rating: 4.5,
      discount: "33%"
    },
    {
      id: 7,
      name: "Gel rửa mặt cho da nhờn",
      price: "349.000₫",
      originalPrice: "449.000₫",
      image: "/images/banners/7.jpg",
      rating: 4.7,
      discount: "22%"
    },
    {
      id: 8,
      name: "Kem mắt chống thâm quầng",
      price: "699.000₫",
      originalPrice: "899.000₫",
      image: "/images/banners/8.jpg",
      rating: 4.6,
      discount: "22%"
    },
    {
      id: 9,
      name: "Serum niacinamide 10%",
      price: "799.000₫",
      originalPrice: "999.000₫",
      image: "/images/banners/9.jpg",
      rating: 4.9,
      discount: "20%"
    },
    {
      id: 10,
      name: "Kem dưỡng ban đêm",
      price: "749.000₫",
      originalPrice: "999.000₫",
      image: "/images/banners/10.jpg",
      rating: 4.8,
      discount: "25%"
    },
    {
      id: 11,
      name: "Tẩy tế bào chết AHA/BHA",
      price: "549.000₫",
      originalPrice: "699.000₫",
      image: "/images/banners/11.jpg",
      rating: 4.7,
      discount: "21%"
    },
    {
      id: 12,
      name: "Essence dưỡng ẩm",
      price: "649.000₫",
      originalPrice: "849.000₫",
      image: "/images/banners/12.jpg",
      rating: 4.6,
      discount: "24%"
    },
    {
      id: 13,
      name: "Gel dưỡng ẩm không dầu",
      price: "449.000₫",
      originalPrice: "599.000₫",
      image: "/images/banners/13.jpg",
      rating: 4.5,
      discount: "25%"
    },
    {
      id: 14,
      name: "Kem nền trang điểm BB",
      price: "399.000₫",
      originalPrice: "549.000₫",
      image: "/images/banners/14.jpg",
      rating: 4.4,
      discount: "27%"
    },
    {
      id: 15,
      name: "Set combo chăm sóc cơ bản",
      price: "1.299.000₫",
      originalPrice: "1.799.000₫",
      image: "/images/banners/15.jpg",
      rating: 4.9,
      discount: "28%"
    }
  ];
    
const moreNewsEvents= [
  {
    id: 1,
    title: "Bí quyết chăm sóc da mùa hè",
    description: "Hướng dẫn các bước dưỡng da giúp da luôn mịn màng trong mùa nóng.",
    videoThumbnail: "/images/banners/111.jpg",
    videoUrl: "https://www.youtube.com/watch?v=BtZJhZUWeuA&pp=ygUZcXXhuqNuZyBjw6FvIG3hu7kgcGjhuqltIA%3D%3D", // video thật
    duration: "5:32",
    views: 12500,
    uploadDate: "01/10/2025"
  },
  
  {
    id: 2,
    title: "Trang điểm dự tiệc sang trọng",
    description: "Video hướng dẫn make-up tone Tây sang trọng, dễ áp dụng.",
    videoThumbnail: "/images/banners/102.jpg",
    videoUrl: "https://www.youtube.com/watch?v=KnCVu-R4hCg&pp=ygUmVHJhbmcgxJFp4buDbSBk4buxIHRp4buHYyBzYW5nIHRy4buNbmc%3D", // video thật
    duration: "8:15",
    views: 9800,
    uploadDate: "28/09/2025"
  },
  {
    id: 3,
    title: "Chăm sóc da ban đêm đúng cách",
    description: "Cách chọn sản phẩm dưỡng da phù hợp cho buổi tối.",
    videoThumbnail: "/images/banners/101.jpg",
    videoUrl: "https://www.youtube.com/watch?v=ctq_Qj7oSVQ",
    views: 8700,
    uploadDate: "25/09/2025"
  },
  {
    id: 4,
    title: "Top 5 sản phẩm dưỡng ẩm tốt nhất 2025",
    description: "Review chi tiết các sản phẩm dưỡng ẩm được yêu thích nhất.",
    videoThumbnail: "/images/banners/100.jpg",
    videoUrl: "https://www.youtube.com/watch?v=WfUbudHyfWA&pp=ygUzVG9wIDUgc-G6o24gcGjhuqltIGTGsOG7oW5nIOG6qW0gdOG7kXQgbmjhuqV0IDIwMjUi",
    duration: "7:58",
    views: 15200,
    // uploadDate: "20/09/2025"
  }
];

  // Sale Products Data
  const saleProducts = [
    {
      id: 101,
      name: "Combo Sữa rửa mặt + Toner",
      price: "399.000₫",
      originalPrice: "599.000₫",
      image: "/images/banners/1.jpg",
      rating: 4.8,
      discount: "33%",
      saleEndTime: "02:45:30"
    },
    {
      id: 102,
      name: "Set 3 món chăm sóc da cơ bản",
      price: "899.000₫",
      originalPrice: "1.299.000₫",
      image: "/images/banners/2.jpg",
      rating: 4.9,
      discount: "31%",
      saleEndTime: "02:45:30"
    },
    {
      id: 103,
      name: "Serum Vitamin C + Kem chống nắng",
      price: "1.199.000₫",
      originalPrice: "1.699.000₫",
      image: "/images/banners/3.jpg",
      rating: 4.7,
      discount: "29%",
      saleEndTime: "02:45:30"
    },
    {
      id: 104,
      name: "Bộ đôi làm sạch da hoàn hảo",
      price: "549.000₫",
      originalPrice: "799.000₫",
      image: "/images/banners/4.jpg",
      rating: 4.6,
      discount: "31%",
      saleEndTime: "02:45:30"
    },
    {
      id: 105,
      name: "Combo chống lão hóa 5 bước",
      price: "1.899.000₫",
      originalPrice: "2.599.000₫",
      image: "/images/banners/5.jpg",
      rating: 4.8,
      discount: "27%",
      saleEndTime: "02:45:30"
    },
    {
      id: 106,
      name: "Set dưỡng ẩm dành cho da khô",
      price: "699.000₫",
      originalPrice: "999.000₫",
      image: "/images/banners/6.jpg",
      rating: 4.5,
      discount: "30%",
      saleEndTime: "02:45:30"
    }
  ];

  // Featured Brands Data  
  const featuredBrands = [
  {
    id: 1,
    name: "L'Oréal Men Expert",
    logo: "/images/banners/f.jpg",
    description: "Thương hiệu số 1 thế giới về chăm sóc da nam",
    products: 25,
    url: "/trangbao/1"
  },
  {
    id: 2,
    name: "Nivea Men",
    logo: "/images/banners/e.jpg", 
    description: "Chăm sóc da toàn diện cho phái mạnh",
    products: 18,
    url: "/trangbao/2"
  },
  {
    id: 3,
    name: "Vichy Homme",
    logo: "/images/banners/w.jpg",
    description: "Giải pháp da nhạy cảm chuyên nghiệp",
    products: 15,
    url: "/trangbao/3"
  },
  {
    id: 4,
    name: "Kiehl's",
    logo: "/images/banners/v.jpg",
    description: "Sản phẩm thiên nhiên cao cấp từ New York",
    products: 22,
    url: "/trangbao/4"
  },
  {
    id: 5,
    name: "Clinique For Men",
    logo: "/images/banners/n.jpg",
    description: "Chăm sóc da không gây dị ứng",
    products: 12,
    url: "/trangbao/5"
  },
  {
    id: 6,
    name: "The Body Shop",
    logo: "/images/banners/x.jpg",
    description: "Sản phẩm organic thân thiện môi trường",
    products: 30,
    url: "/trangbao/6"
  }
];

  // News Events Data
   const newsEvents = [
    {
      id: 1,
      title: "Xu hướng chăm sóc da mùa hè 2025",
      description: "Khám phá những bí quyết chăm sóc da mới nhất cho mùa hè năm nay",
      videoThumbnail: "/images/banners/1.jpg",
      duration: "5:30",
      views: "12K",
      likes: "1.2K",
      uploadDate: "2 ngày trước"
    },
    {
      id: 2,
      title: "Review sản phẩm mỹ phẩm hot nhất",
      description: "Đánh giá chi tiết những sản phẩm được yêu thích nhất hiện tại",
      videoThumbnail: "/images/banners/2.jpg",
      duration: "8:15",
      views: "25K",
      likes: "2.1K",
      uploadDate: "1 tuần trước"
    },
    {
      id: 3,
      title: "Makeup tutorial cho da nhạy cảm",
      description: "Hướng dẫn trang điểm an toàn và hiệu quả cho làn da nhạy cảm",
      videoThumbnail: "/images/banners/3.jpg",
      duration: "12:45",
      views: "35K",
      likes: "3.5K",
      uploadDate: "3 ngày trước"
    },
    {
      id: 4,
      title: "Skincare routine 10 bước",
      description: "Quy trình chăm sóc da 10 bước từ các chuyên gia hàng đầu",
      videoThumbnail: "/images/banners/4.jpg",
      duration: "15:20",
      views: "48K",
      likes: "4.8K",
      uploadDate: "5 ngày trước"
    }
  ];

  return (
    <div className={styles.container}>
      {/* Banner nhỏ phía trên thanh chức năng */}
      <div className={styles.smallBanner}>
        <div className={styles.smallBannerContent}>
          <span className={styles.bannerText}>🎉 Ưu đãi đặc biệt: Giảm 50% cho đơn hàng đầu tiên!</span>
          <Link href="/khuyen-mai" className={styles.bannerButton}>
            Xem ngay
          </Link>
        </div>
      </div>
      
      {/* Beautiful Navigation - Căn giữa và làm đẹp */}
      <nav className={`${styles.navigation} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        <Link href="/" className={`${styles.navLink} pro-nav-item`}>
          <span className="nav-icon"><MdHome /></span>
          <span className="nav-text">Trang chính</span>
        </Link>
        <Link href="/gioithieu" className={`${styles.navLink} pro-nav-item`}>
          <span className="nav-icon"><MdInfo /></span>
          <span className="nav-text">Giới thiệu</span>
        </Link>
        <div className={styles.navDropdown}>
          <button 
            className={`${styles.navLink} ${styles.dropdownToggle}`}
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <span className="nav-icon"><MdCategory /></span>
            <span className="nav-text">Danh mục sản phẩm</span>
            <MdExpandMore className={`${styles.dropdownIcon} ${isCategoryOpen ? styles.rotate : ''}`} />
          </button>
          {isCategoryOpen && (
            <div className={styles.dropdownMenu}>
              <Link href="/category/skincare" className={styles.dropdownItem}>Chăm sóc da</Link>
              <Link href="/category/makeup" className={styles.dropdownItem}>Trang điểm</Link>
              <Link href="/category/haircare" className={styles.dropdownItem}>Chăm sóc tóc</Link>
              <Link href="/category/bodycare" className={styles.dropdownItem}>Chăm sóc cơ thể</Link>
              <Link href="/category/fragrance" className={styles.dropdownItem}>Nước hoa</Link>
            </div>
          )}
        </div>
        
        {/* Khung tìm kiếm sản phẩm */}
        <div className={styles.searchBox}>
          <div className={styles.searchInputContainer}>
            <MdSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className={styles.searchButton}
              onClick={handleSearch}
            >
              Tìm
            </button>
          </div>
        </div>
        
        <Link href="/cuahang" className={`${styles.navLink} pro-nav-item`}>
          <span className="nav-icon"><MdStore /></span>
          <span className="nav-text">Cửa hàng</span>
        </Link>
        <Link href="/giohang" className={`${styles.navLink} pro-nav-item`}>
          <span className="nav-icon"><MdShoppingCart /></span>
          <span className="nav-text">Giỏ hàng</span>
        </Link>
        <Link href="/baohanh" className={`${styles.navLink} pro-nav-item`}>
          <span className="nav-icon"><MdVerified /></span>
          <span className="nav-text">Bảo hành</span>
        </Link>
        <Link href="/hotroKH" className={`${styles.navLink} pro-nav-item`}>
          <span className="nav-icon"><MdSupport /></span>
          <span className="nav-text">Hỗ trợ KH</span>
        </Link>

        {/* 🔑 Phần tài khoản */}
        <div className={styles.userSection}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <div className={styles.userInfo} onClick={handleAccountClick}>
                <img
                  src={authUser?.picture || "/default-avatar.png"}
                  alt={authUser?.name || "User"}
                  className={styles.userAvatar}
                />
                <span className={styles.userName}>{authUser?.name}</span>
              </div>
              <button
                onClick={logout}
                className={styles.logoutButton}
                title="Đăng xuất"
              >
                🚪
              </button>
            </div>
          ) : (
            <Link href="/login" className={`${styles.navLink} pro-nav-item`}>
              <span className="nav-icon"><MdAccountCircle /></span>
              <span className="nav-text">Tài khoản</span>
            </Link>
          )}
        </div>
      </div>
    </nav>

      {/* Carousel Banner Section - 3 banner tự động chuyển */}
      <div className={styles.bannerCarousel}>
        <div className={styles.bannerSlides}>
          {/* Banner 1 */}
          <div className={`${styles.bannerSlide} ${currentBannerIndex === 0 ? styles.active : ''}`}>
            <div className={styles.bannerImage1}></div>
            <div className={styles.bannerOverlay}>
              <h2 className={styles.bannerTitle}>Sản phẩm làm đẹp hàng đầu</h2>
              <p className={styles.bannerSubtitle}>Khám phá bộ sưu tập mới nhất với ưu đãi đặc biệt</p>
              <Link href="/san-pham-moi" className={styles.bannerCta}>
                Khám phá ngay
              </Link>
            </div>
          </div>
          
          {/* Banner 2 */}
          <div className={`${styles.bannerSlide} ${currentBannerIndex === 1 ? styles.active : ''}`}>
            <div className={styles.bannerImage2}></div>
            <div className={styles.bannerOverlay}>
              <h2 className={styles.bannerTitle}>Chăm sóc da chuyên nghiệp</h2>
              <p className={styles.bannerSubtitle}>Giải pháp hoàn hảo cho làn da khỏe mạnh và rạng rỡ</p>
              <Link href="/cham-soc-da" className={styles.bannerCta}>
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
          
          {/* Banner 3 */}
          <div className={`${styles.bannerSlide} ${currentBannerIndex === 2 ? styles.active : ''}`}>
            <div className={styles.bannerImage3}></div>
            <div className={styles.bannerOverlay}>
              <h2 className={styles.bannerTitle}>Ưu đãi đặc biệt tháng này</h2>
              <p className={styles.bannerSubtitle}>Giảm đến 70% cho các sản phẩm bán chạy nhất</p>
              <Link href="/khuyen-mai" className={styles.bannerCta}>
                Mua ngay
              </Link>
            </div>
          </div>
        </div>
        
        {/* Carousel Controls */}
        <button className={styles.bannerPrev} onClick={prevBanner}>
          ‹
        </button>
        <button className={styles.bannerNext} onClick={nextBanner}>
          ›
        </button>
        
        {/* Carousel Indicators */}
        <div className={styles.bannerIndicators}>
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              className={`${styles.indicator} ${currentBannerIndex === index ? styles.active : ''}`}
              onClick={() => goToBanner(index)}
            />
          ))}
        </div>
      </div>

      {/* Mã khuyến mại Section */}
      <div className={styles.promoSection} data-animation-id="promo-section">
        <div className={styles.sectionContainer}>
          <h2 className={styles.promoTitle}>🎟️ MÃ KHUYẾN MÃI HOT</h2>
          <p className={styles.promoSubtitle}>Sử dụng ngay để nhận ưu đãi tốt nhất!</p>
          <div className={styles.promoGrid}>
            <div className={styles.promoCard}>
              <div className={styles.promoIcon}>💎</div>
              <div className={styles.promoInfo}>
                <h3 className={styles.promoCode}>WELCOME50</h3>
                <p className={styles.promoDesc}>Giảm 50% cho đơn hàng đầu tiên</p>
                <p className={styles.promoCondition}>Đơn hàng từ 500.000đ</p>
              </div>
              <button 
                className={styles.copyBtn}
                onClick={() => copyPromoCode('WELCOME50')}
              >📋 Copy</button>
            </div>
            
            <div className={styles.promoCard}>
              <div className={styles.promoIcon}>🔥</div>
              <div className={styles.promoInfo}>
                <h3 className={styles.promoCode}>FREESHIP99</h3>
                <p className={styles.promoDesc}>Miễn phí vận chuyển toàn quốc</p>
                <p className={styles.promoCondition}>Không giới hạn đơn hàng</p>
              </div>
              <button 
                className={styles.copyBtn}
                onClick={() => copyPromoCode('FREESHIP99')}
              >📋 Copy</button>
            </div>
            
            <div className={styles.promoCard}>
              <div className={styles.promoIcon}>⭐</div>
              <div className={styles.promoInfo}>
                <h3 className={styles.promoCode}>VIP30</h3>
                <p className={styles.promoDesc}>Giảm 30% cho thành viên VIP</p>
                <p className={styles.promoCondition}>Đơn hàng từ 1.000.000đ</p>
              </div>
              <button 
                className={styles.copyBtn}
                onClick={() => copyPromoCode('VIP30')}
              >📋 Copy</button>
            </div>
            
            <div className={styles.promoCard}>
              <div className={styles.promoIcon}>🎁</div>
              <div className={styles.promoInfo}>
                <h3 className={styles.promoCode}>COMBO25</h3>
                <p className={styles.promoDesc}>Giảm 25% khi mua combo 3 món</p>
                <p className={styles.promoCondition}>Áp dụng cho combo sản phẩm</p>
              </div>
              <button 
                className={styles.copyBtn}
                onClick={() => copyPromoCode('COMBO25')}
              >📋 Copy</button>
            </div>
          </div>
        </div>
      </div>

      {/* Sale Section - Flash Sale */}
      <div className={styles.saleSection} data-animation-id="sale-section">
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>⚡ FLASH SALE - SĂN SALE NGAY!</h2>
          <p className={styles.sectionSubtitle}>⏰ Thời gian có hạn - Giảm đến 50% cho các sản phẩm chọn lọc</p>
          <div className={styles.saleGrid}>
            {saleProducts.map((product) => (
              <div key={product.id} className={styles.saleCard}>
                <div className={styles.saleBadge}>-{product.discount}</div>
                <div className={styles.productImageWrapper}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={280}
                    height={280}
                    className={styles.productImage}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli2kigjKMoqyAq3PzGtnZQEMlGINM1yBFxO"
                  />
                  <div className={styles.productActions}>
                    <button 
                      className={styles.wishlistBtn}
                      data-wishlist-id={product.id}
                      onClick={() => handleAddToWishlist(product.id)}
                      title="Thêm vào yêu thích"
                    >
                      ❤️
                    </button>
                    <button 
                      className={styles.quickViewBtn}
                      title="Xem nhanh"
                    >
                      👁️
                    </button>
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.productRating}>
                    <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
                    <span className={styles.ratingScore}>({product.rating})</span>
                  </div>
                  <div className={styles.productPricing}>
                    <span className={styles.currentPrice}>{product.price}</span>
                    <span className={styles.originalPrice}>{product.originalPrice}</span>
                  </div>
                  <div className={styles.saleTimer}>
                    ⏰ Kết thúc trong: <strong>{countdown.hours}:{countdown.minutes}:{countdown.seconds}</strong>
                  </div>
                  <button 
                    className={styles.addToCartBtn}
                    data-product-id={product.id}
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <span>🛒</span>
                    <span>MUA NGAY</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className={styles.productsSection} data-animation-id="products-section">
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>🌟 SẢN PHẨM NỔI BẬT</h2>
          <p className={styles.sectionSubtitle}>Khám phá những sản phẩm được yêu thích nhất</p>
          <div className={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.discountBadge}>-{product.discount}</div>
                <div className={styles.productImageWrapper}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={250}
                    height={250}
                    className={styles.productImage}
                  />
                  <div className={styles.productActions}>
                    <button 
                      className={styles.wishlistBtn}
                      data-wishlist-id={product.id}
                      onClick={() => handleAddToWishlist(product.id)}
                      title="Thêm vào yêu thích"
                    >
                      ❤️
                    </button>
                    <button 
                      className={styles.quickViewBtn}
                      title="Xem nhanh"
                    >
                      👁️
                    </button>
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.productRating}>
                    <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
                    <span className={styles.ratingScore}>({product.rating})</span>
                  </div>
                  <div className={styles.productPricing}>
                    <span className={styles.currentPrice}>{product.price}</span>
                    <span className={styles.originalPrice}>{product.originalPrice}</span>
                  </div>
                  <button 
                    className={styles.addToCartBtn}
                    data-product-id={product.id}
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <span>🛒</span>
                    <span>THÊM VÀO GIỎ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Brands Section */}
      <div className={styles.brandsSection} data-animation-id="brands-section">
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>🏆 THƯƠNG HIỆU NỔI TIẾNG</h2>
          <p className={styles.sectionSubtitle}>Những thương hiệu uy tín hàng đầu thế giới về chăm sóc da nam</p>
          <div className={styles.brandsGrid}>
      {featuredBrands.map((brand) => (
        <Link key={brand.id} href={brand.url} className={styles.brandCard}>
          <div className={styles.brandImageWrapper}>
            <Image
              src={brand.logo}
              alt={brand.name}
              width={120}
              height={120}
              className={styles.brandLogo}
            />
          </div>
          <div className={styles.brandInfo}>
            <h3 className={styles.brandName}>{brand.name}</h3>
            <p className={styles.brandDescription}>{brand.description}</p>
            <div className={styles.brandStats}>
              <span className={styles.productCount}>
                {brand.products} sản phẩm
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
        </div>
      </div>
       
      {/* News and Events Section */}
<div className={styles.newsSection} data-animation-id="news-section">
  <div className={styles.sectionContainer}>
    <h2 className={styles.sectionTitle}>📰 TIN TỨC & SỰ KIỆN</h2>
    <p className={styles.sectionSubtitle}>
      Cập nhật những thông tin mới nhất về làm đẹp và chăm sóc da
    </p>

    <div className={styles.newsGrid}>
  {moreNewsEvents.map((news) => (
    <div key={news.id} className={styles.newsCard}>
      {/* Khi click sẽ mở link YouTube */}
      <a href={news.videoUrl} target="_blank" rel="noopener noreferrer">
        <div className={styles.videoContainer}>
          <Image
            src={news.videoThumbnail}
            alt={news.title}
            width={320}
            height={180}
            className={styles.videoThumbnail}
          />
          <div className={styles.playButton}>
            <span>▶️</span>
          </div>
          <div className={styles.videoDuration}>{news.duration}</div>
        </div>
      </a>

      {/* Thông tin mô tả dưới thumbnail */}
      <div className={styles.videoInfo}>
        <h3 className={styles.videoTitle}>{news.title}</h3>
        <p className={styles.videoDesc}>{news.description}</p>
        <p className={styles.videoMeta}>
          {news.views.toLocaleString()} lượt xem • {news.uploadDate}
        </p>
      </div>
    </div>
  ))}
</div>

  </div>
</div>


      {/* Newsletter Section */}
      <div className={styles.newsletterSection} data-animation-id="newsletter-section">
        <div className={styles.sectionContainer}>
          <h2 className={styles.newsletterTitle}>📧 ĐĂNG KÝ NHẬN TIN</h2>
          <p className={styles.newsletterSubtitle}>Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt</p>
          <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
            <input 
              type="email" 
              placeholder="📧 Nhập email để nhận ưu đãi đặc biệt..."
              className={styles.newsletterInput}
              required
            />
            <button className={styles.newsletterBtn} type="submit">
              ✨ ĐĂNG KÝ NGAY
            </button>
          </form>
        </div>
      </div>

      {/* 🚀 FOOTER THÔNG MINH & HIỆN ĐẠI */}
      <div className={styles.footerModern}>
        <div className={styles.footerGrid}>
          
          {/* 🏢 VỀ CHÚNG TÔI - SMART VERSION */}
          <div className={styles.footerCard}>
            <div className={styles.footerHeader}>
              <div className={styles.footerIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <h3>VỀ CHÚNG TÔI</h3>
            </div>
            <p className={styles.footerDescription}>
              Chúng tôi là cửa hàng hàng đầu chuyên cung cấp sản phẩm chăm sóc da nam chất lượng cao với hơn 10 năm kinh nghiệm.
            </p>
            <div className={styles.footerStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>50K+</span>
                <span className={styles.statLabel}>Khách hàng</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>500+</span>
                <span className={styles.statLabel}>Sản phẩm</span>
              </div>
            </div>
            <nav className={styles.footerNav}>
              <a href="#" className={styles.navLink}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
                Lịch sử hình thành
              </a>
              <a href="#" className={styles.navLink}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                Tầm nhìn & Sứ mệnh
              </a>
              <a href="#" className={styles.navLink}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Giải thưởng & Chứng nhận
              </a>
              <a href="#" className={styles.navLink}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/></svg>
                Tin tức & Sự kiện
              </a>
            </nav>
          </div>

          {/* 👤 CHĂM SÓC KHÁCH HÀNG - SMART SUPPORT */}
          <div className={styles.footerCard}>
            <div className={styles.footerHeader}>
              <div className={styles.footerIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.9 8H16c-.8 0-1.54.37-2.01 1.01L12.5 10.5c-.47-.47-1.12-.75-1.83-.82L9.17 9.33c-.71-.18-1.46-.08-2.01.33l-2.5 1.87c-.83.62-1.16 1.71-.83 2.71l1.24 3.71c.33 1 1.47 1.49 2.36.98L10 16.5l2.5 2.5z"/>
                </svg>
              </div>
              <h3>CHĂM SÓC KHÁCH HÀNG</h3>
              <div className={styles.liveSupport}>
                <div className={styles.onlineIndicator}></div>
                <span>Hỗ trợ trực tuyến</span>
              </div>
            </div>
            <nav className={styles.footerNav}>
              <a href="#" className={styles.navLink}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                Hỗ trợ trực tuyến 24/7
              </a>
              <a href="#" className={styles.navLink}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
                Câu hỏi thường gặp (FAQ)
              </a>
              <a href="#" className={styles.navLink}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                Hướng dẫn mua hàng
              </a>
              <a href="#" className={styles.navLink}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                Theo dõi đơn hàng
              </a>
              <a href="#" className={styles.navLink}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Chính sách bảo hành
              </a>
            </nav>
          </div>

          {/* 📜 CHÍNH SÁCH - SMART POLICIES */}
          <div className={styles.footerCard}>
            <div className={styles.footerHeader}>
              <div className={styles.footerIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
              </div>
              <h3>CHÍNH SÁCH</h3>
            </div>
            <nav className={styles.footerNav}>
              <a href="#" className={styles.navLink}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                Chính sách bảo mật
              </a>
              <a href="#" className={styles.navLink}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
                Điều khoản sử dụng
              </a>
              <a href="#" className={styles.navLink}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                Chính sách giao hàng
              </a>
              <a href="#" className={styles.navLink}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>
                Chính sách đổi trả
              </a>
              <a href="#" className={styles.navLink}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/></svg>
                Chính sách hoàn tiền
              </a>
              <a href="#" className={styles.navLink}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                Bảo mật thông tin
              </a>
            </nav>
          </div>

          {/* 📞 LIÊN HỆ & MẠNG XÃ HỘI - SMART CONTACT */}
          <div className={styles.footerCard}>
            <div className={styles.footerHeader}>
              <div className={styles.footerIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
              <h3>LIÊN HỆ & MẠNG XÃ HỘI</h3>
              <div className={styles.quickContact}>
                <button className={styles.quickCallBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  Gọi ngay
                </button>
                <button className={styles.chatBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v4c0 .55.45 1 1 1s1-.45 1-1v-4h2l4 4V4c0-1.1-.9-2-2-2zm0 14H6v-2h14v2z"/></svg>
                  Chat trực tiếp
                </button>
              </div>
            </div>

            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                </div>
                <div className={styles.contactDetails}>
                  <strong>Hotline:</strong> 1900 1234
                  <span className={styles.available}>Tư vấn miễn phí</span>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </div>
                <div className={styles.contactDetails}>
                  <strong>Email:</strong> support@menbeauty.vn
                  <span className={styles.responseTime}>Phản hồi trong 1h</span>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                </div>
                <div className={styles.contactDetails}>
                  <strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM
                  <span className={styles.mapLink}>Xem bản đồ</span>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                </div>
                <div className={styles.contactDetails}>
                  <strong>Giờ làm việc:</strong> 8:00 - 22:00
                  <span className={styles.days}>(T2 - CN)</span>
                </div>
              </div>
            </div>

            <div className={styles.socialSection}>
              <h4>Kết nối với chúng tôi</h4>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink} data-platform="facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className={styles.followerCount}>15K</span>
                </a>
                <a href="#" className={styles.socialLink} data-platform="instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className={styles.followerCount}>28K</span>
                </a>
                <a href="#" className={styles.socialLink} data-platform="youtube">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span className={styles.followerCount}>52K</span>
                </a>
                <a href="#" className={styles.socialLink} data-platform="tiktok">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  <span className={styles.followerCount}>89K</span>
                </a>
                <a href="#" className={styles.socialLink} data-platform="zalo">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span className={styles.followerCount}>32K</span>
                </a>
                <a href="#" className={styles.socialLink} data-platform="telegram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span className={styles.followerCount}>12K</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 🚀 SMART FOOTER BOTTOM */}
        <div className={styles.footerBottom}>
          <div className={styles.footerBottomContent}>
            <div className={styles.copyright}>
              <p>&copy; 2025 Men Beauty Store - Chuyên gia chăm sóc da nam hàng đầu Việt Nam</p>
              <p>Được tin tưởng bởi hơn 50,000 khách hàng</p>
            </div>
            
            {/* 🎯 QUICK ACTION BUTTONS */}
            <div className={styles.quickActions}>
              <button className={styles.actionBtn} title="Chatbot AI">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                AI Assistant
              </button>
              <button className={styles.actionBtn} title="Gọi ngay">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                Call Now
              </button>
              <button className={styles.actionBtn} title="Theo dõi đơn hàng">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                Track Order
              </button>
            </div>
          </div>
        </div>
      </div>



    </div>
  );
}