// src/pages/index.js
import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";

// fetcher đơn giản; có thể chuyển sang SWR sau
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// fallback image nếu chưa có ảnh trong DB
const FALLBACK_IMG = "/images/banners/placeholder.jpg";

// helpers nhỏ
const fmt = (v) =>
  typeof v === "number"
    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v)
    : v;

export default function HomePage() {
  const { authUser, isAuthenticated, logout } = useAuth();
  const [cartItems, setCartItems] = useState(0);
  const [wishlistItems, setWishlistItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [products, setProducts] = useState([]); // lấy từ API
  const router = useRouter();

  // load products từ API thật
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        // lấy 15 sp nổi bật đầu tiên (tuỳ DB của bạn)
        const data = await fetchJson(`/api/products?page=1&pageSize=15`);
        if (!mounted) return;
        setProducts(Array.isArray(data?.data) ? data.data : []);
      } catch (e) {
        if (!mounted) return;
        setErr("Không tải được danh sách sản phẩm. Vui lòng thử lại.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    // giả lập cart/wishlist (tạm)
    setCartItems(Math.floor(Math.random() * 5));
    setWishlistItems(Math.floor(Math.random() * 8));

    return () => {
      mounted = false;
    };
  }, []);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        // NOTE: nếu trang của bạn là /timkiem.js thì đổi thành '/timkiem'
        router.push(`/timkiem?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    },
    [router, searchQuery]
  );

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(e);
  };

  // tránh dùng document.querySelector, animate dựa trên state
  const [pulseIds, setPulseIds] = useState(new Set());
  const pulseClass = (id) => (pulseIds.has(id) ? styles.pulse : "");
  const addToCart = (productId) => {
    setCartItems((prev) => prev + 1);
    setPulseIds((s) => new Set([...s, productId]));
    setTimeout(() => {
      setPulseIds((s) => {
        const n = new Set(s);
        n.delete(productId);
        return n;
      });
    }, 250);
  };

  const addToWishlist = (productId) => {
    setWishlistItems((prev) => prev + 1);
  };

  const copyPromoCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => alert(`Đã copy mã ${code} vào clipboard!`))
      .catch((err) => console.error("Lỗi khi copy: ", err));
  };

  const handleAccountClick = () => {
    router.push("/account"); // hoặc mở dropdown; tuỳ bạn
  };

  // tách 6 sản phẩm đầu cho “flash sale” minh hoạ
  const saleProducts = useMemo(() => products.slice(0, 6), [products]);
  const featuredProducts = useMemo(() => products.slice(0, 15), [products]);

  // mock các section khác (giữ nguyên của bạn)
  const featuredBrands = [
    { id: 1, name: "L'Oréal Men Expert", logo: "/images/banners/f.jpg", description: "Thương hiệu số 1 thế giới về chăm sóc da nam", products: 25 },
    { id: 2, name: "Nivea Men", logo: "/images/banners/e.jpg", description: "Chăm sóc da toàn diện cho phái mạnh", products: 18 },
    { id: 3, name: "Vichy Homme", logo: "/images/banners/w.jpg", description: "Giải pháp da nhạy cảm chuyên nghiệp", products: 15 },
    { id: 4, name: "Kiehl's", logo: "/images/banners/v.jpg", description: "Sản phẩm thiên nhiên cao cấp từ New York", products: 22 },
    { id: 5, name: "Clinique For Men", logo: "/images/banners/n.jpg", description: "Chăm sóc da không gây dị ứng", products: 12 },
    { id: 6, name: "The Body Shop", logo: "/images/banners/x.jpg", description: "Sản phẩm organic thân thiện môi trường", products: 30 },
  ];

  const newsEvents = [
    { id: 1, title: "Xu hướng chăm sóc da mùa hè 2025", description: "Khám phá những bí quyết chăm sóc da mới nhất cho mùa hè năm nay", videoThumbnail: "/images/banners/1.jpg", duration: "5:30", views: "12K", likes: "1.2K", uploadDate: "2 ngày trước", videoUrl: "https://www.youtube.com/watch?v=EBc1QZ1mW4g" },
    { id: 2, title: "Review sản phẩm mỹ phẩm hot nhất", description: "Đánh giá chi tiết những sản phẩm được yêu thích nhất hiện tại", videoThumbnail: "/images/banners/2.jpg", duration: "8:15", views: "25K", likes: "2.1K", uploadDate: "1 tuần trước", videoUrl: "https://www.youtube.com/watch?v=bPZrJ9tX2nI" },
    { id: 3, title: "Makeup tutorial cho da nhạy cảm", description: "Hướng dẫn trang điểm an toàn và hiệu quả cho làn da nhạy cảm", videoThumbnail: "/images/banners/3.jpg", duration: "12:45", views: "35K", likes: "3.5K", uploadDate: "3 ngày trước", videoUrl: "https://www.youtube.com/watch?v=Gg1QUsSPBhc" },
    { id: 4, title: "Skincare routine 10 bước", description: "Quy trình chăm sóc da 10 bước từ các chuyên gia hàng đầu", videoThumbnail: "/images/banners/4.jpg", duration: "15:20", views: "48K", likes: "4.8K", uploadDate: "5 ngày trước", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  ];

  return (
    <div className={styles.container}>
      {/* NAV */}
      <nav className={styles.navigation}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.navLink}>🏠 Trang chính</Link>
          <Link href="/gioithieu" className={styles.navLink}>ℹ️ Giới thiệu</Link>
          <Link href="/danhmucSP" className={styles.navLink}>📦 Danh mục sản phẩm</Link>
          <Link href="/cuahang" className={styles.navLink}>🏪 Cửa hàng</Link>
          <Link href="/giohang" className={styles.navLink}>🛒 Giỏ hàng ({cartItems})</Link>
          <Link href="/baohanh" className={styles.navLink}>🛡️ Bảo hành</Link>
          <Link href="/hotroKH" className={styles.navLink}>💬 Hỗ trợ</Link>

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
                <button onClick={logout} className={styles.logoutButton} title="Đăng xuất">🚪</button>
              </div>
            ) : (
              <Link href="/login" className={styles.navLink}>👤 Tài khoản</Link>
            )}
          </div>
        </div>
      </nav>

      {/* BANNER */}
      <div className={styles.bannerSection}>
        <Image
          src="/images/banners/banner1.jpg"
          alt="Main Beauty Banner"
          width={2000}
          height={900}
          className={styles.bannerImage}
          priority
        />
        {/* Form tìm kiếm */}
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Tìm sản phẩm..."
          />
          <button type="submit">🔎 Tìm</button>
        </form>
      </div>

      {/* PROMO */}
      <div className={styles.promoSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.promoTitle}>🎟️ MÃ KHUYẾN MÃI HOT</h2>
          <p className={styles.promoSubtitle}>Sử dụng ngay để nhận ưu đãi tốt nhất!</p>
          <div className={styles.promoGrid}>
            {[
              { code: "WELCOME50", desc: "Giảm 50% cho đơn hàng đầu tiên", cond: "Đơn hàng từ 500.000đ", icon: "💎" },
              { code: "FREESHIP99", desc: "Miễn phí vận chuyển toàn quốc", cond: "Không giới hạn đơn hàng", icon: "🔥" },
              { code: "VIP30", desc: "Giảm 30% cho thành viên VIP", cond: "Đơn hàng từ 1.000.000đ", icon: "⭐" },
              { code: "COMBO25", desc: "Giảm 25% khi mua combo 3 món", cond: "Áp dụng cho combo sản phẩm", icon: "🎁" },
            ].map((p) => (
              <div className={styles.promoCard} key={p.code}>
                <div className={styles.promoIcon}>{p.icon}</div>
                <div className={styles.promoInfo}>
                  <h3 className={styles.promoCode}>{p.code}</h3>
                  <p className={styles.promoDesc}>{p.desc}</p>
                  <p className={styles.promoCondition}>{p.cond}</p>
                </div>
                <button className={styles.copyBtn} onClick={() => copyPromoCode(p.code)}>📋 Copy</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FLASH SALE */}
      <div className={styles.saleSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>⚡ FLASH SALE - SĂN SALE NGAY!</h2>
          <p className={styles.sectionSubtitle}>⏰ Thời gian có hạn - Giảm đến 50% cho các sản phẩm chọn lọc</p>

          {loading && <div className={styles.gridSkeleton}>Đang tải sản phẩm…</div>}
          {err && !loading && <div className={styles.error}>{err}</div>}

          <div className={styles.saleGrid}>
            {!loading &&
              !err &&
              saleProducts.map((p) => (
                <div key={p.id} className={styles.saleCard}>
                  <div className={styles.saleBadge}>-{p.discount ?? "SALE"}</div>
                  <div className={styles.productImageWrapper}>
                    <Image
                      src={p.image || FALLBACK_IMG}
                      alt={p.name}
                      width={280}
                      height={280}
                      className={styles.productImage}
                    />
                    <div className={styles.productActions}>
                      <button className={styles.wishlistBtn} onClick={() => addToWishlist(p.id)}>❤️</button>
                      <Link className={styles.quickViewBtn} href={`/product/${p.id}`}>👁️</Link>
                    </div>
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{p.name}</h3>
                    <div className={styles.productPricing}>
                      <span className={styles.currentPrice}>{fmt(p.price)}</span>
                      {p.originalPrice ? (
                        <span className={styles.originalPrice}>{fmt(p.originalPrice)}</span>
                      ) : null}
                    </div>
                    <div className={styles.saleTimer}>⏰ Kết thúc trong: <strong>02:45:30</strong></div>
                    <button
                      className={`${styles.addToCartBtn} ${pulseClass(p.id)}`}
                      onClick={() => addToCart(p.id)}
                    >
                      <span>🛒</span><span>MUA NGAY</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div className={styles.productsSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>🌟 SẢN PHẨM NỔI BẬT</h2>
          <p className={styles.sectionSubtitle}>Khám phá những sản phẩm được yêu thích nhất</p>

          {loading && <div className={styles.gridSkeleton}>Đang tải sản phẩm…</div>}
          {err && !loading && <div className={styles.error}>{err}</div>}

          <div className={styles.productsGrid}>
            {!loading &&
              !err &&
              featuredProducts.map((p) => (
                <div key={p.id} className={styles.productCard}>
                  <div className={styles.discountBadge}>-{p.discount ?? "HOT"}</div>
                  <div className={styles.productImageWrapper}>
                    <Image
                      src={p.image || FALLBACK_IMG}
                      alt={p.name}
                      width={250}
                      height={250}
                      className={styles.productImage}
                    />
                    <div className={styles.productActions}>
                      <button className={styles.wishlistBtn} onClick={() => addToWishlist(p.id)}>❤️</button>
                      <Link className={styles.quickViewBtn} href={`/product/${p.id}`}>👁️</Link>
                    </div>
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{p.name}</h3>
                    <div className={styles.productPricing}>
                      <span className={styles.currentPrice}>{fmt(p.price)}</span>
                      {p.originalPrice ? (
                        <span className={styles.originalPrice}>{fmt(p.originalPrice)}</span>
                      ) : null}
                    </div>
                    <button
                      className={`${styles.addToCartBtn} ${pulseClass(p.id)}`}
                      onClick={() => addToCart(p.id)}
                    >
                      <span>🛒</span><span>THÊM VÀO GIỎ</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* BRANDS */}
      <div className={styles.brandsSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>🏆 THƯƠNG HIỆU NỔI TIẾNG</h2>
          <p className={styles.sectionSubtitle}>Những thương hiệu uy tín hàng đầu thế giới về chăm sóc da nam</p>
          <div className={styles.brandsGrid}>
            {featuredBrands.map((b) => (
              <div key={b.id} className={styles.brandCard}>
                <div className={styles.brandImageWrapper}>
                  <Image src={b.logo} alt={b.name} width={120} height={120} className={styles.brandLogo} />
                </div>
                <div className={styles.brandInfo}>
                  <h3 className={styles.brandName}>{b.name}</h3>
                  <p className={styles.brandDescription}>{b.description}</p>
                  <div className={styles.brandStats}><span className={styles.productCount}>{b.products} sản phẩm</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEWS */}
      <div className={styles.newsSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>📰 TIN TỨC & SỰ KIỆN</h2>
          <p className={styles.sectionSubtitle}>Cập nhật những thông tin mới nhất về làm đẹp và chăm sóc da</p>
          <div className={styles.newsGrid}>
            {newsEvents.map((n) => (
              <div key={n.id} className={styles.newsCard}>
                <a href={n.videoUrl} target="_blank" rel="noopener noreferrer">
                  <div className={styles.videoContainer}>
                    <Image src={n.videoThumbnail} alt={n.title} width={320} height={180} className={styles.videoThumbnail} />
                    <div className={styles.playButton}><span>▶️</span></div>
                    <div className={styles.videoDuration}>{n.duration}</div>
                  </div>
                </a>
                <div className={styles.newsInfo}>
                  <h3 className={styles.newsTitle}>{n.title}</h3>
                  <p className={styles.newsDescription}>{n.description}</p>
                  <div className={styles.newsStats}>
                    <span className={styles.newsViews}>👁️ {n.views} lượt xem</span>
                    <span className={styles.newsDate}>📅 {n.uploadDate}</span>
                  </div>
                  <a href={n.videoUrl} target="_blank" rel="noopener noreferrer">
                    <button className={styles.watchBtn}><span>🎥</span><span>XEM NGAY</span></button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEWSLETTER & FOOTER giữ nguyên của bạn */}
      {/* ... (các block còn lại không đổi) ... */}
    </div>
  );
}
