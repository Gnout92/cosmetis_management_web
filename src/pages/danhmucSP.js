import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/danhmucSP.module.css';

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

// Category mapping exactly matching the database
const categories = {
  1: 'Sữa rửa mặt',
  2: 'Kem chống nắng', 
  3: 'Dầu gội',
  4: 'Mặt nạ',
  5: 'Sữa tắm',
  6: 'Kem dưỡng ẩm',
  7: 'Xịt khoáng',
  8: 'Toner'
};

export default function DanhMucSP() {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentView, setCurrentView] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.categoryName.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.categoryId.toString() === selectedCategory
      );
    }

    // Price filter
    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number);
      filtered = filtered.filter(product => 
        product.price >= min && product.price <= max
      );
    }

    // Stock filter
    if (stockFilter) {
      switch (stockFilter) {
        case 'in-stock':
          filtered = filtered.filter(product => product.stock > 10);
          break;
        case 'low-stock':
          filtered = filtered.filter(product => product.stock > 0 && product.stock <= 10);
          break;
        case 'out-of-stock':
          filtered = filtered.filter(product => product.stock === 0);
          break;
      }
    }

    // Sort
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'stock-desc':
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, priceFilter, stockFilter, sortBy]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getDiscountPercent = (original, current) => {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return <span className={styles.outOfStock}>❌ Hết hàng</span>;
    }
    if (stock < 10) {
      return <span className={styles.lowStock}>⚠️ Còn {stock} sản phẩm</span>;
    }
    return <span className={styles.inStock}>🚛 2-4 ngày | <i className={`fas fa-map-marker-alt ${styles.locationIcon}`}></i> TP.Hồ Chí Minh</span>;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className={styles.star}>⭐</span>);
      } else {
        stars.push(<span key={i} className={styles.starEmpty}>☆</span>);
      }
    }
    
    return stars;
  };

  const getVipLabel = (productId) => {
    // Tạo các label khác nhau dựa trên ID sản phẩm
    const labels = [
      '❤ Rs Vip Dịch',
      '💎 Premium Quality', 
      '🔥 Hot Deal',
      '⚡ Fast Ship',
      '🎁 Gift Box',
      '💝 Limited Edition'
    ];
    return labels[productId % labels.length];
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'auto';
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceFilter('');
    setStockFilter('');
    setSortBy('name-asc');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Đang tải sản phẩm...</h1>
        </div>
        <div className={styles.loadingProducts}>
          {[...Array(12)].map((_, index) => (
            <div key={index} className={styles.loadingCard}>
              <div className={styles.loadingImage}></div>
              <div className={styles.loadingContent}>
                <div className={`${styles.loadingLine} ${styles.short}`}></div>
                <div className={`${styles.loadingLine} ${styles.medium}`}></div>
                <div className={styles.loadingLine}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}> 🛍️ Danh Mục Sản Phẩm</h1>
          <Link href="/" className={styles.backLink}>
            <i className="fas fa-arrow-left"></i>
            Trang chủ
          </Link>
        </div>
        
        <div className={styles.stats}>
          
        </div>
      </div>

      <div className={styles.content}>
        {/* Filters - Horizontal Layout */}
        <div className={styles.filtersHorizontal}>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>
              <i className="fas fa-search"></i>
              Tìm kiếm
            </h3>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={styles.clearSearch}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>
              <i className="fas fa-list"></i>
              Danh mục
            </h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Tất cả danh mục</option>
              {Object.entries(categories).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>
              <i className="fas fa-money-bill"></i>
              Giá
            </h3>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Tất cả mức giá</option>
              <option value="0-100000">Dưới 100,000đ</option>
              <option value="100000-500000">100,000đ - 500,000đ</option>
              <option value="500000-1000000">500,000đ - 1,000,000đ</option>
              <option value="1000000-999999999">Trên 1,000,000đ</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>
              <i className="fas fa-boxes"></i>
              Tồn kho
            </h3>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Tất cả</option>
              <option value="in-stock">Còn hàng (&gt;10)</option>

              <option value="low-stock">Sắp hết (1-10)</option>
              <option value="out-of-stock">Hết hàng</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <button
              onClick={resetFilters}
              className={styles.resetButton}
            >
              <i className="fas fa-undo"></i>
              Đặt lại bộ lọc
            </button>
          </div>
        </div>

        {/* Products */}
        <div className={styles.main}>
          <div className={styles.toolbar}>
            <div className={styles.resultsInfo}>
              {/* <span>Hiển thị {filteredProducts.length} sản phẩm</span> */}
            </div>

            <div className={styles.toolbarRight}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
                <option value="price-asc">Giá thấp - cao</option>
                <option value="price-desc">Giá cao - thấp</option>
                <option value="stock-desc">Tồn kho nhiều</option>
              </select>

              <div className={styles.viewToggle}>
                <button
                  onClick={() => setCurrentView('grid')}
                  className={`${styles.viewBtn} ${currentView === 'grid' ? styles.active : ''}`}
                >
                  <i className="fas fa-th"></i>
                </button>
                <button
                  onClick={() => setCurrentView('list')}
                  className={`${styles.viewBtn} ${currentView === 'list' ? styles.active : ''}`}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className={styles.noResults}>
              <i className="fas fa-search"></i>
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            <div className={`${styles.productsGrid} ${currentView === 'list' ? styles.listView : ''}`}>
              {filteredProducts.map((product) => {
                const discount = getDiscountPercent(product.originalPrice, product.price);

                return (
                  <div
                    key={product.id}
                    className={`${styles.productCard} ${currentView === 'list' ? styles.listView : ''}`}
                    onClick={() => openProductModal(product)}
                  >
                    <div className={styles.productImageContainer}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={styles.productImage}
                      />
                      {discount > 0 && (
                        <div className={`${styles.productBadge} ${styles.sale}`}>
                          -{discount}%
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className={`${styles.productBadge} ${styles.outOfStock}`}>
                          Hết hàng
                        </div>
                      )}
                    </div>

                    <div className={styles.productContent}>
                      <div className={styles.productCategory}>{product.categoryName}</div>
                      <h3 className={styles.productName}>{product.name}</h3>
                      
                      <div className={styles.productRating}>
                        <div className={styles.ratingStars}>
                          {renderStars(product.rating)}
                          <span className={styles.ratingValue}>{product.rating}</span>
                        </div>
                      </div>

                      <div className={styles.productVipLabel}>
                        ({getVipLabel(product.id)})
                      </div>

                      <p className={styles.productDescription}>{product.description}</p>

                      <div className={styles.productPricing}>
                        <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
                        {discount > 0 && (
                          <span className={styles.discountPercent}>-{discount}%</span>
                        )}
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className={styles.soldCount}>đã bán 5k+</span>
                        )}
                      </div>

                      <div className={styles.productFooter}>
                        <div className={styles.stockInfo}>
                          {getStockStatus(product.stock)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showModal && selectedProduct && (
        <div className={styles.modal} onClick={closeProductModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Chi tiết sản phẩm</h2>
              <button onClick={closeProductModal} className={styles.closeBtn}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.productDetails}>
                <div className={styles.productImageModal}>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                  />
                </div>

                <div className={styles.productInfoModal}>
                  <div className={styles.productCategoryModal}>
                    {selectedProduct.categoryName}
                  </div>
                  <h1 className={styles.productTitleModal}>
                    {selectedProduct.name}
                  </h1>
                  <p className={styles.productDescriptionModal}>
                    {selectedProduct.description}
                  </p>

                  <div className={styles.productPricingModal}>
                    <span className={styles.currentPriceModal}>
                      {formatPrice(selectedProduct.price)}
                    </span>
                    {getDiscountPercent(selectedProduct.originalPrice, selectedProduct.price) > 0 && (
                      <span className={styles.discountPercent}>-{getDiscountPercent(selectedProduct.originalPrice, selectedProduct.price)}%</span>
                    )}
                    {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                      <span className={styles.originalPriceModal}>
                        đã bán 5k+
                      </span>
                    )}
                  </div>

                  <div className={styles.stockInfoModal}>
                    <i className="fas fa-box"></i>
                    <span>Tồn kho: {selectedProduct.stock} sản phẩm</span>
                  </div>

                  <div className={styles.ratingInfo}>
                    <div className={styles.stars}>
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`fas fa-star ${index < Math.floor(selectedProduct.rating) ? styles.active : ''}`}
                        ></i>
                      ))}
                      <span className={styles.ratingText}>
                        {selectedProduct.rating} ({selectedProduct.reviews} đánh giá)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={`${styles.modalActionBtn} ${styles.addToCartModalBtn}`}
                disabled={selectedProduct.stock === 0}
                onClick={() => {
                  alert(`Đã thêm "${selectedProduct.name}" vào giỏ hàng!`);
                  closeProductModal();
                }}
              >
                <i className="fas fa-map-marker-alt"></i>
                Thêm vào giỏ hàng
              </button>
              <button
                className={`${styles.modalActionBtn} ${styles.buyNowBtn}`}
                disabled={selectedProduct.stock === 0}
                onClick={() => {
                  alert(`Dặt Hàng Thành Công !"${selectedProduct.name}"!`);
                  closeProductModal();
                }}
              >
                <i className="fas fa-credit-card"></i>
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}