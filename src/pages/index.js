// src/pages/index.js
import { useEffect, useState } from "react";
import React from 'react';
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
  
  MdLocalShipping,
  MdSecurity,
  MdCall
} from 'react-icons/md';

const handleAccountClick = () => {
  router.push("/account");
};


export default function HomePage() {
  // const [authUser, setAuthUser] = useState(null);
  const { authUser, isAuthenticated, logout } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [wishlistItems, setWishlistItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  // const [isCategoryOpen, setIsCategoryOpen] = useState(false); // Không cần thiết nữa - dropdown đã bị bỏ
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
    router.push('/taikhoan');
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
      {/* Banner nhỏ phía trên thanh chức năng - Nội dung phong phú */}
      <div 
        className={styles.newFlashSaleBanner} 
        onClick={() => window.location.href = '/khuyen-mai'} 
        style={{ cursor: 'pointer' }}
      >
        {/* Phần trái - Badge 100% CHÍNH HÃNG */}
        <div className={styles.bannerLeftSection}>
          <div className={styles.brandBadge}>
            <span className={styles.brandText}>100%</span>
            <span className={styles.authenticText}>CHÍNH HÃNG</span>
          </div>
        </div>
        
        {/* Phần giữa - Nội dung chính */}
        <div className={styles.bannerCenterSection}>
          <div className={styles.mainFlashSale}>
            <span className={styles.fireIcon}></span>
            <span className={styles.textMain}>FLASH SALE 0Đ – GIỜ VÀNG 0H–12H</span>
            <span className={styles.fireIcon}></span>
          </div>
          <div className={styles.subPromoText}>
            <span className={styles.explosionIcon}></span>
            <span className={styles.textSub}>SIÊU SALE 7.11 – DEAL HOT TRONG NGÀY</span>
            <span className={styles.explosionIcon}></span>
          </div>
        </div>
        
        {/* Phần phải - Sự kiện & Voucher */}
        <div className={styles.bannerRightSection}>
          <div className={styles.eventSection}>
            <div className={styles.eventBadge}>
              {/* <span className={styles.calendarIcon}></span> */}
              <span>DUY NHẤT HÔM NAY - 7.11</span>
            </div>
            <div className={styles.voucherMini}>
              {/* <span className={styles.ticketIcon}></span> */}
              <span>THÊM MÃ GIẢM ĐẾN 30K</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Beautiful Navigation - Căn giữa và làm đẹp */}
      <nav className={`${styles.navigation} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        {/* Logo KAKA SHOP riêng biệt */}
        <div className={styles.logoSection}>
          <div className={styles.logoContainer}>
            <span className={styles.logoTextBackground}>
              <span className={styles.logoText}>KAKA SHOP</span>
            </span>
          </div>
        </div>
        
        <Link href="/" className={`${styles.navLink} pro-nav-item`}>
          <span className="nav-icon" style={{
            color: '#FFFFFF',
            background: '#FFFFFF',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3rem',
            height: '3rem',
            fontSize: '2rem'
          }}><MdHome /></span>
          <span className="nav-text">Trang chính</span>
        </Link>
   
        <Link href="/danhmucSP" className={`${styles.navLink} pro-nav-item`}>
          <span className="nav-icon" style={{
            color: '#FFFFFF',
            background: '#FFFFFF',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3rem',
            height: '3rem',
            fontSize: '2rem'
          }}><MdCategory /></span>
          <span className="nav-text">Danh mục sản phẩm</span>
        </Link>
        
        {/* Khung tìm kiếm sản phẩm */}
        <div className={styles.searchBox}>
          <div className={styles.searchInputContainer}>
            <MdSearch 
              style={{
                color: '#FFFFFF'
              }}
              className={styles.searchIcon} 
            />
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
          <span className="nav-icon" style={{
            color: '#FFFFFF',
            background: '#FFFFFF',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3rem',
            height: '3rem',
            fontSize: '2rem'
          }}><MdStore /></span>
          <span className="nav-text"> Hệ Thống Cửa hàng</span>
        </Link>
        <Link href="/giohang" className={`${styles.navLink} pro-nav-item`}>
          <span className="nav-icon" style={{
            color: '#FFFFFF',
            background: '#FFFFFF',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3rem',
            height: '3rem',
            fontSize: '2rem'
          }}><MdShoppingCart /></span>
          <span className="nav-text">Giỏ hàng</span>
        </Link>
        
        <Link href="/hotroKH" className={`${styles.navLink} pro-nav-item`}>
          <span className="nav-icon" style={{
            color: '#FFFFFF',
            background: '#FFFFFF',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3rem',
            height: '3rem',
            fontSize: '2rem'
          }}><MdSupport /></span>
          <span className="nav-text">Hỗ Trợ Khách Hàng</span>
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
              <span className="nav-icon" style={{
                color: '#FFFFFF',
                background: '#FFFFFF',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '3rem',
                height: '3rem',
                fontSize: '2rem'
              }}><MdAccountCircle /></span>
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
            <Image 
              src="/images/banners/banner1.jpg" 
              alt="Banner 1" 
              fill 
              className={styles.bannerImage1} 
              style={{objectFit: 'cover'}} 
              priority 
            />
           
          </div>
          
          {/* Banner 2 */}
          <div className={`${styles.bannerSlide} ${currentBannerIndex === 1 ? styles.active : ''}`}>
            <Image 
              src="/images/banners/banner2.jpg" 
              alt="Banner 2" 
              fill 
              className={styles.bannerImage2} 
              style={{objectFit: 'cover'}} 
            />
            
          </div>
          
          {/* Banner 3 */}
          <div className={`${styles.bannerSlide} ${currentBannerIndex === 2 ? styles.active : ''}`}>
            <Image 
              src="/images/banners/banner3.jpg" 
              alt="Banner 3" 
              fill 
              className={styles.bannerImage3} 
              style={{objectFit: 'cover'}} 
            />
            
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