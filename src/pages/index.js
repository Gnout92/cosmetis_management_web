// src/pages/index.js
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from '../styles/Home.module.css';
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

export default function HomePage() {
  // const [authUser, setAuthUser] = useState(null);
  const { authUser, isAuthenticated, logout } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [wishlistItems, setWishlistItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();


  useEffect(() => {
    setIsLoaded(true);
    // Simulate loading cart items from localStorage
    setCartItems(Math.floor(Math.random() * 5));
    setWishlistItems(Math.floor(Math.random() * 8));
  }, []);
  
  
   // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page with query parameter
      router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle Enter key press in search input
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const addToCart = (productId) => {
    setCartItems(prev => prev + 1);
    // Add animation effect
    const button = document.querySelector(`[data-product-id="${productId}"]`);
    if (button) {
      button.style.transform = 'scale(1.1)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 200);
    }
  };

  const addToWishlist = (productId) => {
    setWishlistItems(prev => prev + 1);
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
    videoThumbnail: "/images/video1.jpg",
    videoUrl: "https://www.youtube.com/watch?v=EBc1QZ1mW4g", // video thật
    duration: "5:32",
    views: 12500,
    uploadDate: "01/10/2025"
  },
  {
    id: 2,
    title: "Trang điểm dự tiệc sang trọng",
    description: "Video hướng dẫn make-up tone Tây sang trọng, dễ áp dụng.",
    videoThumbnail: "/images/video2.jpg",
    videoUrl: "https://www.youtube.com/watch?v=bPZrJ9tX2nI", // video thật
    duration: "8:15",
    views: 9800,
    uploadDate: "28/09/2025"
  },
  {
    id: 3,
    title: "Chăm sóc da ban đêm đúng cách",
    description: "Cách chọn sản phẩm dưỡng da phù hợp cho buổi tối.",
    videoThumbnail: "/images/video3.jpg",
    videoUrl: "https://www.youtube.com/watch?v=Gg1QUsSPBhc", // video thật
    duration: "6:45",
    views: 8700,
    uploadDate: "25/09/2025"
  },
  {
    id: 4,
    title: "Top 5 sản phẩm dưỡng ẩm tốt nhất 2025",
    description: "Review chi tiết các sản phẩm dưỡng ẩm được yêu thích nhất.",
    videoThumbnail: "/images/products/video1.mp4",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // video thật
    duration: "7:58",
    views: 15200,
    uploadDate: "20/09/2025"
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
      products: 25
    },
    {
      id: 2,
      name: "Nivea Men",
      logo: "/images/banners/e.jpg", 
      description: "Chăm sóc da toàn diện cho phái mạnh",
      products: 18
    },
    {
      id: 3,
      name: "Vichy Homme",
      logo: "/images/banners/w.jpg",
      description: "Giải pháp da nhạy cảm chuyên nghiệp",
      products: 15
    },
    {
      id: 4,
      name: "Kiehl's",
      logo: "/images/banners/v.jpg",
      description: "Sản phẩm thiên nhiên cao cấp từ New York",
      products: 22
    },
    {
      id: 5,
      name: "Clinique For Men",
      logo: "/images/banners/n.jpg",
      description: "Chăm sóc da không gây dị ứng",
      products: 12
    },
    {
      id: 6,
      name: "The Body Shop",
      logo: "/images/banners/x.jpg",
      description: "Sản phẩm organic thân thiện môi trường",
      products: 30
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
      {/* Beautiful Navigation - Căn giữa và làm đẹp */}
      <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.navLink}>🏠 Trang chính</Link>
        <Link href="/gioithieu" className={styles.navLink}>ℹ️ Giới thiệu</Link>
        <Link href="/danhmucSP" className={styles.navLink}>📦 Danh mục sản phẩm</Link>
        <Link href="/cuahang" className={styles.navLink}>🏪 Cửa hàng</Link>
        <Link href="/giohang" className={styles.navLink}>🛒 Giỏ hàng</Link>
        <Link href="/baohanh" className={styles.navLink}>🛡️ Bảo hành</Link>
        <Link href="/hotroKH" className={styles.navLink}>💬 Hỗ trợ KH</Link>

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
            <Link href="/login" className={styles.navLink}>
              👤 Tài khoản
            </Link>
          )}
        </div>
      </div>
    </nav>

      {/* Simple Banner Section - Đã bỏ layout phức tạp */}
      <div className={styles.bannerSection}>
        <Image
          src="/images/banners/banner1.jpg"
          alt="Main Beauty Banner"
          width={2000}
          height={900}
          className={styles.bannerImage}
          priority
        />
        
      </div>

      {/* Mã khuyến mại Section */}
      <div className={styles.promoSection}>
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
      <div className={styles.saleSection}>
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
                      onClick={() => addToWishlist(product.id)}
                    >
                      ❤️
                    </button>
                    <button className={styles.quickViewBtn}>
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
                    ⏰ Kết thúc trong: <strong>{product.saleEndTime}</strong>
                  </div>
                  <button 
                    className={styles.addToCartBtn}
                    data-product-id={product.id}
                    onClick={() => addToCart(product.id)}
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
      <div className={styles.productsSection}>
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
                      onClick={() => addToWishlist(product.id)}
                    >
                      ❤️
                    </button>
                    <button className={styles.quickViewBtn}>
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
                    onClick={() => addToCart(product.id)}
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
      <div className={styles.brandsSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>🏆 THƯƠNG HIỆU NỔI TIẾNG</h2>
          <p className={styles.sectionSubtitle}>Những thương hiệu uy tín hàng đầu thế giới về chăm sóc da nam</p>
          <div className={styles.brandsGrid}>
            {featuredBrands.map((brand) => (
              <div key={brand.id} className={styles.brandCard}>
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
                    <span className={styles.productCount}>{brand.products} sản phẩm</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
       
      {/* News and Events Section */}
<div className={styles.newsSection}>
  <div className={styles.sectionContainer}>
    <h2 className={styles.sectionTitle}>📰 TIN TỨC & SỰ KIỆN</h2>
    <p className={styles.sectionSubtitle}>
      Cập nhật những thông tin mới nhất về làm đẹp và chăm sóc da
    </p>

    <div className={styles.newsGrid}>
      {newsEvents.map((news) => (
        <div key={news.id} className={styles.newsCard}>
          {/* Ảnh/video có thể click mở link */}
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
            
          {/* Thông tin video */}
          <div className={styles.newsInfo}>
            <h3 className={styles.newsTitle}>{news.title}</h3>
            <p className={styles.newsDescription}>{news.description}</p>
            <div className={styles.newsStats}>
              <span className={styles.newsViews}>👁️ {news.views} lượt xem</span>
              <span className={styles.newsDate}>📅 {news.uploadDate}</span>
            </div>

            {/* Nút xem ngay */}
            <a href={news.videoUrl} target="_blank" rel="noopener noreferrer">
              <button className={styles.watchBtn}>
                <span>🎥</span>
                <span>XEM NGAY</span>
              </button>
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>


      {/* Newsletter Section */}
      <div className={styles.newsletterSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.newsletterTitle}>📧 ĐĂNG KÝ NHẬN TIN</h2>
          <p className={styles.newsletterSubtitle}>Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt</p>
          <div className={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder="Nhập email của bạn..."
              className={styles.newsletterInput}
            />
            <button className={styles.newsletterBtn}>ĐĂNG KÝ NGAY</button>
          </div>
        </div>
      </div>

      {/* 🎆 FOOTER 4 CỘT CỰC ĐẸP */}
      <div className={styles.footerContent}>

  <div className={styles.footerSection}>
    <h3>🏢 VỀ CHÚNG TÔI</h3>
    <p>
      Chúng tôi là cửa hàng hàng đầu chuyên cung cấp sản phẩm chăm sóc da nam chất lượng cao.
    </p>
    <nav>
      <a href="#">📊 Lịch sử hình thành</a>
      <a href="#">📋 Tầm nhìn & Sứ mệnh</a>
      <a href="#">🏆 Giải thưởng & Chứng nhận</a>
      <a href="#">💰 Thông tin tài chính</a>
      <a href="#">📰 Tin tức & Sự kiện</a>
    </nav>
  </div>

  <div className={styles.footerSection}>
    <h3>👤 CHĂM SÓC KHÁCH HÀNG</h3>
    <nav>
      <a href="#">📞 Hỗ trợ trực tuyến 24/7</a>
      <a href="#">❓ Câu hỏi thường gặp (FAQ)</a>
      <a href="#">📝 Hướng dẫn mua hàng</a>
      <a href="#">🚚 Hướng dẫn giao hàng</a>
      <a href="#">🔄 Hướng dẫn đổi trả</a>
      <a href="#">💳 Hướng dẫn thanh toán</a>
      <a href="#">🎯 Kích hoạt bảo hành</a>
    </nav>
  </div>

  <div className={styles.footerSection}>
    <h3>📜 CHÍNH SÁCH</h3>
    <nav>
      <a href="#">🔒 Chính sách bảo mật</a>
      <a href="#">📋 Điều khoản sử dụng</a>
      <a href="#">🚚 Chính sách giao hàng</a>
      <a href="#">🔄 Chính sách đổi trả</a>
      <a href="#">💰 Chính sách hoàn tiền</a>
      <a href="#">🎁 Chính sách khuyến mại</a>
      <a href="#">🔐 Bảo mật thông tin</a>
    </nav>
  </div>

  <div className={styles.footerSection}>
    <h3>📞 LIÊN HỆ & MẠNG XÃ HỘI</h3>

    <div className={styles.contactInfo}>
      <div className={styles.contactItem}>
        <span className={styles.contactIcon}>📞</span>
        <span>Hotline: 1900 1234</span>
      </div>
      <div className={styles.contactItem}>
        <span className={styles.contactIcon}>📧</span>
        <span>support@menbeauty.vn</span>
      </div>
      <div className={styles.contactItem}>
        <span className={styles.contactIcon}>📍</span>
        <span>123 Đường ABC, Quận 1, TP.HCM</span>
      </div>
      <div className={styles.contactItem}>
        <span className={styles.contactIcon}>⏰</span>
        <span>8:00 - 22:00 (T2 - CN)</span>
      </div>
    </div>

    <div className={styles.socialLinks}>
      <a href="#" title="Facebook">🕵️</a>
      <a href="#" title="Instagram">📷</a>
      <a href="#" title="YouTube">🎥</a>
      <a href="#" title="TikTok">🎵</a>
      <a href="#" title="Zalo">💬</a>
      <a href="#" title="Telegram">✈️</a>
    </div>
  </div>

</div>

<div className={styles.footerBottom}>
  <p>&copy; 2025 Men Beauty Store - Chuyên gia chăm sóc da nam hàng đầu Việt Nam. Tất cả quyền được bảo lưu.</p>
</div>

    </div>
  );
}