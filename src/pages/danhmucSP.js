// src/pages/index.js
import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";

<<<<<<< HEAD
// Synchronized product data from the SQL database
// Synchronized product data from the SQL database
// Synchronized product data from the SQL database
const products = [
  // 48 products exactly matching the SQL INSERT statements with proper category mapping
  { id: 1, name: 'Son môi đỏ Ruby', description: 'Son đỏ Ruby lâu trôi', categoryId: 1, categoryName: 'Son môi', price: 200000, originalPrice: 250000, stock: 50, image: "/images/banners/son.jpg", rating: 4.5, reviews: 120 },
  { id: 2, name: 'mặt nạ dưỡng ẩm ', description: 'mặt nạ chống lão hóa ', categoryId: 1, categoryName: 'mặt nạ', price: 180000, originalPrice: 220000, stock: 40, image: "/images/banners/matna.jpg", rating: 4.3, reviews: 89 },
  { id: 3, name: 'Son môi cam Sunset', description: 'Son cam tươi sáng', categoryId: 1, categoryName: 'Son môi', price: 190000, originalPrice: 230000, stock: 35, image: "/images/banners/son2.jpg", rating: 4.4, reviews: 76 },
  { id: 4, name: 'Kem dưỡng ẩm ban ngày', description: 'Dưỡng ẩm và chống nắng', categoryId: 2, categoryName: 'Kem chống nắng', price: 150000, originalPrice: 180000, stock: 30, image: "/images/banners/chongmat.jpg", rating: 4.6, reviews: 145 },
  { id: 5, name: 'Kem dưỡng ẩm ban đêm', description: 'Dưỡng ẩm sâu cho da', categoryId: 2, categoryName: 'Kem chống nắng', price: 160000, originalPrice: 200000, stock: 25, image: "/images/banners/kemduong1.jpg", rating: 4.7, reviews: 198 },
  { id: 6, name: 'Serum vitamin C', description: 'Serum sáng da và mờ thâm', categoryId: 2, categoryName: 'Kem chống nắng', price: 220000, originalPrice: 260000, stock: 20, image: "/images/banners/vtmc.jpg", rating: 4.8, reviews: 234 },
  { id: 7, name: 'Sữa rửa mặt làm sạch sâu', description: 'Loại bỏ bụi bẩn và bã nhờn', categoryId: 1, categoryName: 'Sữa rửa mặt', price: 120000, originalPrice: 150000, stock: 0, image: "/images/banners/simple.jpg", rating: 4.2, reviews: 167 },
  { id: 8, name: 'Sữa rửa mặt dịu nhẹ', description: 'Phù hợp da nhạy cảm', categoryId: 1, categoryName: 'Sữa rửa mặt', price: 110000, originalPrice: 140000, stock: 8, image: "/images/banners/diunhe.jpg", rating: 4.4, reviews: 123 },
  { id: 9, name: 'Toner cân bằng da', description: 'Cân bằng độ pH cho da', categoryId: 8, categoryName: 'Toner', price: 90000, originalPrice: 120000, stock: 60, image: "/images/banners/tonner1.jpg", rating: 4.3, reviews: 89 },
  { id: 10, name: 'Xịt khoáng dưỡng ẩm', description: 'Giữ ẩm tức thì cho da', categoryId: 7, categoryName: 'Xịt khoáng', price: 95000, originalPrice: 130000, stock: 40, image: "/images/banners/xitkhoang1.jpg", rating: 4.1, reviews: 156 },
  { id: 11, name: 'Mặt nạ giấy dưỡng da', description: 'Dưỡng ẩm và làm sáng da', categoryId: 4, categoryName: 'Mặt nạ', price: 70000, originalPrice: 100000, stock: 3, image: "/images/banners/matne2.jpg", rating: 4.0, reviews: 234 },
  { id: 12, name: 'Mặt nạ đất sét', description: 'Làm sạch lỗ chân lông', categoryId: 4, categoryName: 'Mặt nạ', price: 75000, originalPrice: 105000, stock: 60, image: "/images/banners/dátet1.jpg", rating: 4.2, reviews: 187 },
  { id: 13, name: 'Nước hoa Chanel No.5', description: 'Hương thơm nữ tính', categoryId: 3, categoryName: 'Dầu gội', price: 1200000, originalPrice: 1500000, stock: 20, image: "/images/banners/chanel1.jpg", rating: 4.9, reviews: 345 },
  { id: 14, name: 'Nước hoa Dior Sauvage', description: 'Hương thơm nam tính', categoryId: 3, categoryName: 'Dầu gội', price: 1300000, originalPrice: 1600000, stock: 5, image: "/images/banners/dior1.jpg", rating: 4.8, reviews: 278 },
  { id: 15, name: 'Kem chống nắng SPF50+', description: 'Bảo vệ da khỏi tia UV', categoryId: 2, categoryName: 'Kem chống nắng', price: 180000, originalPrice: 220000, stock: 50, image: "/images/banners/21.jpg", rating: 4.5, reviews: 198 },
  { id: 16, name: 'Kem chống nắng SPF30', description: 'Bảo vệ da hàng ngày', categoryId: 2, categoryName: 'Kem chống nắng', price: 150000, originalPrice: 190000, stock: 45, image: "/images/banners/22.jpg", rating: 4.3, reviews: 167 },
  { id: 17, name: 'Dầu gội dưỡng tóc mềm', description: 'Dưỡng tóc suôn mượt', categoryId: 3, categoryName: 'Dầu gội', price: 120000, originalPrice: 150000, stock: 40, image: "/images/banners/23.jpg", rating: 4.4, reviews: 134 },
  { id: 18, name: 'Dầu gội trị gàu', description: 'Ngăn ngừa gàu hiệu quả', categoryId: 3, categoryName: 'Dầu gội', price: 130000, originalPrice: 160000, stock: 2, image: "/images/banners/24.jpg", rating: 4.2, reviews: 89 },
  { id: 19, name: 'Dầu xả dưỡng tóc', description: 'Giữ tóc mềm mượt', categoryId: 3, categoryName: 'Dầu gội', price: 100000, originalPrice: 130000, stock: 40, image: "/images/banners/25.jpg", rating: 4.3, reviews: 156 },
  { id: 20, name: 'Son dưỡng có màu', description: 'Dưỡng và tạo màu nhẹ', categoryId: 1, categoryName: 'Son môi', price: 90000, originalPrice: 120000, stock: 55, image: "/images/banners/26.jpg", rating: 4.1, reviews: 234 },
  { id: 21, name: 'Son bóng dưỡng ẩm', description: 'Tạo độ bóng và mềm môi', categoryId: 1, categoryName: 'Son môi', price: 85000, originalPrice: 110000, stock: 50, image: "/images/banners/27.jpg", rating: 4.0, reviews: 187 },
  { id: 22, name: 'Kem dưỡng mắt chống nhăn', description: 'Giảm quầng thâm mắt', categoryId: 6, categoryName: 'Kem dưỡng ẩm', price: 200000, originalPrice: 250000, stock: 30, image: "/images/banners/28.jpg", rating: 4.6, reviews: 198 },
  { id: 23, name: 'Serum chống lão hóa', description: 'Giữ da trẻ trung', categoryId: 6, categoryName: 'Kem dưỡng ẩm', price: 250000, originalPrice: 300000, stock: 25, image: "/images/banners/29.jpg", rating: 4.7, reviews: 234 },
  { id: 24, name: 'Sữa rửa mặt tạo bọt', description: 'Loại bỏ bụi bẩn hiệu quả', categoryId: 1, categoryName: 'Sữa rửa mặt', price: 100000, originalPrice: 130000, stock: 6, image: "/images/banners/30.jpg", rating: 4.2, reviews: 167 },
  { id: 25, name: 'Sữa rửa mặt không tạo bọt', description: 'Dịu nhẹ cho da nhạy cảm', categoryId: 1, categoryName: 'Sữa rửa mặt', price: 105000, originalPrice: 135000, stock: 45, image: "/images/banners/31.jpg", rating: 4.3, reviews: 123 },
  { id: 26, name: 'Toner làm sáng da', description: 'Làm sáng và đều màu da', categoryId: 8, categoryName: 'Toner', price: 95000, originalPrice: 125000, stock: 60, image: "/images/banners/32.jpg", rating: 4.4, reviews: 89 },
  { id: 27, name: 'Xịt khoáng khoáng chất', description: 'Dưỡng ẩm và làm dịu da', categoryId: 7, categoryName: 'Xịt khoáng', price: 98000, originalPrice: 128000, stock: 9, image: "/images/banners/33.jpg", rating: 4.2, reviews: 156 },
  { id: 28, name: 'Mặt nạ ngủ', description: 'Dưỡng ẩm sâu qua đêm', categoryId: 4, categoryName: 'Mặt nạ', price: 80000, originalPrice: 110000, stock: 65, image: "/images/banners/35.jpg", rating: 4.1, reviews: 234 },
  { id: 29, name: 'Mặt nạ giấy cấp ẩm', description: 'Cấp nước tức thì', categoryId: 4, categoryName: 'Mặt nạ', price: 75000, originalPrice: 105000, stock: 60, image: "/images/banners/36.jpg", rating: 4.0, reviews: 187 },
  { id: 30, name: 'Nước hoa Versace Eros', description: 'Hương nam mạnh mẽ', categoryId: 3, categoryName: 'Dầu gội', price: 1250000, originalPrice: 1550000, stock: 20, image: "/images/banners/37.jpg", rating: 4.8, reviews: 278 },
  { id: 31, name: 'Nước hoa Gucci Bloom', description: 'Hương nữ tính nhẹ nhàng', categoryId: 3, categoryName: 'Dầu gội', price: 1150000, originalPrice: 1450000, stock: 18, image: "/images/banners/38.jpg", rating: 4.9, reviews: 345 },
  { id: 32, name: 'Kem chống nắng dạng gel', description: 'Dạng gel thấm nhanh', categoryId: 2, categoryName: 'Kem chống nắng', price: 170000, originalPrice: 210000, stock: 50, image: "/images/banners/39.jpg", rating: 4.4, reviews: 198 },
  { id: 33, name: 'Kem chống nắng dạng sữa', description: 'Dạng sữa dễ thoa', categoryId: 2, categoryName: 'Kem chống nắng', price: 160000, originalPrice: 200000, stock: 45, image: "/images/banners/40.jpg", rating: 4.3, reviews: 167 },
  { id: 34, name: 'Dầu gội thảo mộc', description: 'Ngăn rụng tóc', categoryId: 3, categoryName: 'Dầu gội', price: 140000, originalPrice: 170000, stock: 35, image: "/images/banners/41.jpg", rating: 4.5, reviews: 134 },
  { id: 35, name: 'Dầu gội nam', description: 'Giữ tóc khỏe mạnh', categoryId: 3, categoryName: 'Dầu gội', price: 130000, originalPrice: 160000, stock: 1, image: "/images/banners/42.jpg", rating: 4.1, reviews: 89 },
  { id: 36, name: 'Dầu xả phục hồi tóc', description: 'Hồi phục tóc hư tổn', categoryId: 3, categoryName: 'Dầu gội', price: 120000, originalPrice: 150000, stock: 40, image: "/images/banners/43.jpg", rating: 4.2, reviews: 156 },
  { id: 37, name: 'Son môi nude', description: 'Tông nude tự nhiên', categoryId: 1, categoryName: 'Son môi', price: 180000, originalPrice: 220000, stock: 50, image: "/images/banners/44.jpg", rating: 4.3, reviews: 234 },
  { id: 38, name: 'Son môi đỏ cherry', description: 'Đỏ cherry tươi sáng', categoryId: 1, categoryName: 'Son môi', price: 190000, originalPrice: 230000, stock: 40, image: "/images/banners/45.jpg", rating: 4.4, reviews: 187 },
  { id: 39, name: 'Kem dưỡng tay', description: 'Dưỡng ẩm và mềm da tay', categoryId: 6, categoryName: 'Kem dưỡng ẩm', price: 100000, originalPrice: 130000, stock: 50, image: "/images/banners/46.jpg", rating: 4.1, reviews: 198 },
  { id: 40, name: 'Kem dưỡng chân', description: 'Dưỡng ẩm và mềm da chân', categoryId: 6, categoryName: 'Kem dưỡng ẩm', price: 90000, originalPrice: 120000, stock: 45, image: "/images/banners/47.jpg", rating: 4.0, reviews: 234 },
  { id: 41, name: 'Serum trị mụn', description: 'Giảm mụn và thâm', categoryId: 6, categoryName: 'Kem dưỡng ẩm', price: 230000, originalPrice: 270000, stock: 7, image: "/images/banners/48.jpg", rating: 4.6, reviews: 234 },
  { id: 42, name: 'Sữa rửa mặt than hoạt tính', description: 'Loại bỏ bụi bẩn và dầu thừa', categoryId: 1, categoryName: 'Sữa rửa mặt', price: 110000, originalPrice: 140000, stock: 50, image: "/images/banners/49.jpg", rating: 4.3, reviews: 167 },
  { id: 43, name: 'Sữa rửa mặt trà xanh', description: 'Làm dịu da nhạy cảm', categoryId: 1, categoryName: 'Sữa rửa mặt', price: 105000, originalPrice: 135000, stock: 50, image: "/images/banners/50.jpg", rating: 4.2, reviews: 123 },
  { id: 44, name: 'Toner dịu nhẹ', description: 'Dịu nhẹ cho da nhạy cảm', categoryId: 8, categoryName: 'Toner', price: 90000, originalPrice: 120000, stock: 60, image: "/images/banners/51.jpg", rating: 4.3, reviews: 89 },
  { id: 45, name: 'Xịt khoáng se khít lỗ chân lông', description: 'Se khít lỗ chân lông', categoryId: 7, categoryName: 'Xịt khoáng', price: 95000, originalPrice: 125000, stock: 50, image: "/images/banners/52.jpg", rating: 4.1, reviews: 156 },
  { id: 46, name: 'Mặt nạ ngủ dưỡng trắng', description: 'Dưỡng trắng da qua đêm', categoryId: 4, categoryName: 'Mặt nạ', price: 85000, originalPrice: 110000, stock: 65, image: "/images/banners/53.jpg", rating: 4.2, reviews: 234 },
  { id: 47, name: 'Mặt nạ than hoạt tính', description: 'Làm sạch sâu', categoryId: 4, categoryName: 'Mặt nạ', price: 80000, originalPrice: 105000, stock: 60, image: "/images/banners/54.jpg", rating: 4.0, reviews: 187 },
  { id: 48, name: 'Nước hoa Lancome La Vie Est Belle', description: 'Hương nữ tính', categoryId: 3, categoryName: 'Dầu gội', price: 1200000, originalPrice: 1500000, stock: 20, image: "/images/banners/55.jpg", rating: 4.9, reviews: 278 }
];
=======
// fetcher đơn giản; có thể chuyển sang SWR sau
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
>>>>>>> 0335645dc3fce2063f89103c4bf6c1c3d096139a

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
