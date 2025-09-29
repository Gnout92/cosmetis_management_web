import { useEffect, useState } from "react";
import Image from "next/image";
import styles from '../styles/Home.module.css';
// import { useEffect, useState } from "react";
// import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
// import { Search } from "lucide-react"; 


export default function Home({ user, onLogout }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [wishlistItems, setWishlistItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsLoaded(true);
    // Simulate loading cart items from localStorage
    setCartItems(Math.floor(Math.random() * 5));
    setWishlistItems(Math.floor(Math.random() * 8));
  }, []);

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


  return (
    <div className={styles.container}>
      {/* Simple Navigation with Background Color */}
      <nav className={styles.navigation}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.navLink}>
            <span className={styles.navIcon}></span>
            <span className={styles.navText}>Trang chính</span>
          </Link>
          <Link href="/gioithieu" className={styles.navLink}>
            <span className={styles.navIcon}></span>
            <span className={styles.navText}>Giới thiệu</span>
          </Link>
          <Link href="/danhmucSP" className={styles.navLink}>
            <span className={styles.navIcon}></span>
            <span className={styles.navText}>Danh mục sản phẩm</span>
          </Link>
          <div className={styles.searchWrapper} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  {/* Ô nhập dữ liệu */}
  <input
    type="text"
    name="q"
    placeholder="Nhập sản phẩm cần tìm..."
    className={styles.searchInput} 
    style={{ padding: '8px 12px', flex: 1, borderRadius: '6px', border: '1px solid #ccc' }}
  />

  {/* Nút Tìm kiếm */}
  <Link href="/tim-kiem" className={styles.navLink}>
    <span className={styles.navIcon}></span>
    <span className={styles.navText}> 
</span>
  </Link>
</div>

          <Link href="/cuahang" className={styles.navLink}>
            <span className={styles.navIcon}></span>
            <span className={styles.navText}> Hê Thống Cửa hàng</span>
          </Link>
          <Link href="/yeu-thich" className={styles.navLink}>
            <span className={styles.navIcon}></span>
            <span className={styles.navText}>Yêu thích</span>
          </Link>
          <Link href="/bao-hanh" className={styles.navLink}>
            <span className={styles.navIcon}></span>
            <span className={styles.navText}>Bảo hành</span>
          </Link>
          <Link href="/ho-tro-khach-hang" className={styles.navLink}>
            <span className={styles.navIcon}></span>
            <span className={styles.navText}>Hỗ trợ KH</span>
          </Link>
          <Link href="/tai-khoan" className={styles.navLink}>
            <span className={styles.navIcon}></span>
            <span className={styles.navText}>Tài khoản</span>
          </Link>
        </div>
      </nav>

     
      {/* Dual Banner Section - RỘNG TOÀN MÀN HÌNH */}
      <div className={styles.bannersContainer}>
        <div className={styles.mainBanner}>
          <Image
            src="/images/banners/banner1.jpg"
            alt="Main Beauty Banner"
            width={20020}
            height={6000}
            className={styles.bannerImage}
            priority
          />
          <div className={styles.bannerContent}>
            <h1 className={styles.bannerTitle}>CHĂM SÓC DA NAM CHUYÊN NGHIỆP</h1>
            <p className={styles.bannerSubtitle}>Khám phá bộ sưu tập sản phẩm làm đẹp hàng đầu</p>
            <button className={styles.bannerCTA}>
              <span>KHÁM PHÁ NGAY</span>
              <span>🚀</span>
            </button>
          </div>
        </div>

        <div className={styles.sideBanner}>
          <Image
            src="/images/banners/banner2.jpg"
            alt="Side Promotion"
            width={960}
            height={400}
          />
          <div className={styles.sideBannerContent}>
            <h3>GIẢM GIÁ 50%</h3>
            <p>Sản phẩm chọn lọc</p>
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
          <h2 className={styles.sectionTitle}>🌟 SAN PHẨM NỔI BẬT</h2>
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

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3>VỀ CHÚNG TÔI</h3>
              <p>Chuyên cung cấp sản phẩm chăm sóc da nam chất lượng cao từ các thương hiệu uy tín trên thế giới.</p>
            </div>
            <div className={styles.footerSection}>
              <h3>LIÊN HỆ</h3>
              <p>📞 Hotline: 1900 1234</p>
              <p>📧 Email: support@menbeauty.vn</p>
              <p>📍 Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
            </div>
            <div className={styles.footerSection}>
              <h3>THEO DÕI</h3>
              <div className={styles.socialLinks}>
                <a href="#">Facebook</a>
                <a href="#">Instagram</a>
                <a href="#">YouTube</a>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2025 Men Beauty Store. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}