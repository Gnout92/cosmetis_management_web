import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import styles from '../styles/tim-kiem.module.css';

// 🔍 SEARCH PAGE - TRANG TÌM KIẾM CỰC MẠNH
export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 12;

  // Initialize search query from URL parameter
  useEffect(() => {
    if (router.isReady) {
      const { q } = router.query;
      if (q) {
        setSearchQuery(q);
      }
    }
  }, [router.isReady, router.query]);

  // 🎯 SAMPLE PRODUCTS DATA - Dữ liệu sản phẩm mẫu
  const allProducts = [
    {
      id: 1,
      name: "Sữa rửa mặt làm sạch sâu Neutrogena",
      price: 299000,
      originalPrice: 399000,
      image: "/images/banners/1.jpg",
      rating: 4.8,
      reviews: 1250,
      discount: 25,
      category: "sua-rua-mat",
      brand: "neutrogena",
      description: "Làm sạch sâu, loại bỏ bụi bẩn và dầu thừa",
      inStock: true,
      isBestSeller: true,
      isNew: false
    },
    {
      id: 2,
      name: "Serum vitamin C chống lão hóa L'Oreal",
      price: 899000,
      originalPrice: 1199000,
      image: "/images/banners/2.jpg",
      rating: 4.9,
      reviews: 856,
      discount: 25,
      category: "serum",
      brand: "loreal",
      description: "Chống lão hóa, làm sáng da, cải thiện nếp nhăn",
      inStock: true,
      isBestSeller: false,
      isNew: true
    },
    {
      id: 3,
      name: "Kem dưỡng ẩm ban ngày Clinique",
      price: 599000,
      originalPrice: 799000,
      image: "/images/banners/3.jpg",
      rating: 4.7,
      reviews: 623,
      discount: 25,
      category: "kem-duong",
      brand: "clinique",
      description: "Cung cấp độ ẩm suốt 24h, phù hợp mọi loại da",
      inStock: true,
      isBestSeller: true,
      isNew: false
    },
    {
      id: 4,
      name: "Toner cân bằng pH Kiehl's",
      price: 399000,
      originalPrice: 499000,
      image: "/images/banners/4.jpg",
      rating: 4.6,
      reviews: 442,
      discount: 20,
      category: "toner",
      brand: "kiehls",
      description: "Cân bằng độ pH, thu nhỏ lỗ chân lông",
      inStock: true,
      isBestSeller: false,
      isNew: false
    },
    {
      id: 5,
      name: "Kem chống nắng SPF50+ La Roche Posay",
      price: 499000,
      originalPrice: 699000,
      image: "/images/banners/5.jpg",
      rating: 4.8,
      reviews: 1156,
      discount: 29,
      category: "chong-nang",
      brand: "laroche",
      description: "Bảo vệ da khỏi tia UV, không gây nhờn dính",
      inStock: true,
      isBestSeller: true,
      isNew: false
    },
    {
      id: 6,
      name: "Mặt nạ hydrogel phục hồi The Ordinary",
      price: 199000,
      originalPrice: 299000,
      image: "/images/banners/6.jpg",
      rating: 4.5,
      reviews: 334,
      discount: 33,
      category: "mat-na",
      brand: "ordinary",
      description: "Phục hồi da tổn thương, cấp ẩm sâu",
      inStock: false,
      isBestSeller: false,
      isNew: true
    },
    {
      id: 7,
      name: "Gel rửa mặt cho da nhờn CeraVe",
      price: 349000,
      originalPrice: 449000,
      image: "/images/banners/7.jpg",
      rating: 4.7,
      reviews: 775,
      discount: 22,
      category: "sua-rua-mat",
      brand: "cerave",
      description: "Kiểm soát dầu thừa, làm sạch sâu",
      inStock: true,
      isBestSeller: false,
      isNew: false
    },
    {
      id: 8,
      name: "Kem mắt chống thâm quầng Olay",
      price: 699000,
      originalPrice: 899000,
      image: "/images/banners/8.jpg",
      rating: 4.6,
      reviews: 288,
      discount: 22,
      category: "kem-mat",
      brand: "olay",
      description: "Giảm thâm quầng, nếp nhăn vùng mắt",
      inStock: true,
      isBestSeller: false,
      isNew: false
    },
    {
      id: 9,
      name: "Serum niacinamide 10% Paula's Choice",
      price: 799000,
      originalPrice: 999000,
      image: "/images/banners/9.jpg",
      rating: 4.9,
      reviews: 1445,
      discount: 20,
      category: "serum",
      brand: "paulas",
      description: "Thu nhỏ lỗ chân lông, kiểm soát dầu",
      inStock: true,
      isBestSeller: true,
      isNew: false
    },
    {
      id: 10,
      name: "Kem dưỡng ban đêm Estee Lauder",
      price: 749000,
      originalPrice: 999000,
      image: "/images/banners/10.jpg",
      rating: 4.8,
      reviews: 567,
      discount: 25,
      category: "kem-duong",
      brand: "estee",
      description: "Phục hồi da ban đêm, chống lão hóa",
      inStock: true,
      isBestSeller: false,
      isNew: true
    },
    {
      id: 11,
      name: "Tẩy tế bào chết AHA/BHA Some By Mi",
      price: 549000,
      originalPrice: 699000,
      image: "/images/banners/11.jpg",
      rating: 4.7,
      reviews: 891,
      discount: 21,
      category: "tay-te-bao-chet",
      brand: "somebymi",
      description: "Loại bỏ tế bào chết, làm mịn da",
      inStock: true,
      isBestSeller: false,
      isNew: false
    },
    {
      id: 12,
      name: "Essence dưỡng ẩm SK-II",
      price: 649000,
      originalPrice: 849000,
      image: "/images/banners/12.jpg",
      rating: 4.6,
      reviews: 234,
      discount: 24,
      category: "essence",
      brand: "skii",
      description: "Cung cấp độ ẩm, làm sáng da",
      inStock: true,
      isBestSeller: false,
      isNew: false
    }
  ];

  // 📋 FILTER OPTIONS
  const categories = [
    { value: 'all', label: '🌟 Tất cả danh mục' },
    { value: 'sua-rua-mat', label: '🧼 Sữa rửa mặt' },
    { value: 'serum', label: '💧 Serum' },
    { value: 'kem-duong', label: '🧴 Kem dưỡng' },
    { value: 'toner', label: '🌿 Toner' },
    { value: 'chong-nang', label: '☀️ Kem chống nắng' },
    { value: 'mat-na', label: '🎭 Mặt nạ' },
    { value: 'kem-mat', label: '👁️ Kem mắt' },
    { value: 'tay-te-bao-chet', label: '✨ Tẩy tế bào chết' },
    { value: 'essence', label: '💎 Essence' }
  ];

  const brands = [
    { value: 'all', label: '🏷️ Tất cả thương hiệu' },
    { value: 'neutrogena', label: 'Neutrogena' },
    { value: 'loreal', label: "L'Oreal" },
    { value: 'clinique', label: 'Clinique' },
    { value: 'kiehls', label: "Kiehl's" },
    { value: 'laroche', label: 'La Roche Posay' },
    { value: 'ordinary', label: 'The Ordinary' },
    { value: 'cerave', label: 'CeraVe' },
    { value: 'olay', label: 'Olay' },
    { value: 'paulas', label: "Paula's Choice" },
    { value: 'estee', label: 'Estee Lauder' },
    { value: 'somebymi', label: 'Some By Mi' },
    { value: 'skii', label: 'SK-II' }
  ];

  const sortOptions = [
    { value: 'newest', label: '🆕 Mới nhất' },
    { value: 'oldest', label: '⏰ Cũ nhất' },
    { value: 'price-low', label: '💰 Giá thấp đến cao' },
    { value: 'price-high', label: '💎 Giá cao đến thấp' },
    { value: 'rating', label: '⭐ Đánh giá cao nhất' },
    { value: 'reviews', label: '💬 Nhiều đánh giá nhất' },
    { value: 'discount', label: '🔥 Giảm giá nhiều nhất' }
  ];

  // 🔍 FILTER & SEARCH LOGIC
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Search by name and description
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by brand
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'discount':
          return b.discount - a.discount;
        case 'oldest':
          return a.id - b.id;
        case 'newest':
        default:
          return b.id - a.id;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedBrand, priceRange, sortBy]);

  // 📄 PAGINATION
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBrand, priceRange, sortBy]);

  // 🛒 ADD TO CART
  const addToCart = (productId) => {
    // Add to cart logic here
    console.log(`Added product ${productId} to cart`);
  };

  // 💝 ADD TO WISHLIST
  const addToWishlist = (productId) => {
    // Add to wishlist logic here
    console.log(`Added product ${productId} to wishlist`);
  };

  // 💰 FORMAT PRICE
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  // 🌟 RENDER STARS
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

  return (
    <div className={styles.container}>
      {/* 🔍 SEARCH HEADER */}
      <div className={styles.searchHeader}>
        <div className={styles.headerContainer}>
          <motion.h1 
            className={styles.pageTitle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🔍 TÌM KIẾM SẢN PHẨM
          </motion.h1>
          
          <motion.div 
            className={styles.searchContainer}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm chăm sóc da nam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>
              🔍 TÌM KIẾM
            </button>
          </motion.div>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* 🎛️ FILTERS SIDEBAR */}
        <div className={`${styles.filtersSidebar} ${showFilters ? styles.showFilters : ''}`}>
          <div className={styles.filtersHeader}>
            <h3>🎯 BỘ LỌC TÌM KIẾM</h3>
            <button 
              className={styles.closeFilters}
              onClick={() => setShowFilters(false)}
            >
              ✕
            </button>
          </div>

          {/* Category Filter */}
          <div className={styles.filterGroup}>
            <h4>📂 Danh mục</h4>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.filterSelect}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className={styles.filterGroup}>
            <h4>🏷️ Thương hiệu</h4>
            <select 
              value={selectedBrand} 
              onChange={(e) => setSelectedBrand(e.target.value)}
              className={styles.filterSelect}
            >
              {brands.map(brand => (
                <option key={brand.value} value={brand.value}>{brand.label}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className={styles.filterGroup}>
            <h4>💰 Khoảng giá</h4>
            <div className={styles.priceRange}>
              <input
                type="range"
                min="0"
                max="2000000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className={styles.priceSlider}
              />
              <input
                type="range"
                min="0"
                max="2000000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className={styles.priceSlider}
              />
              <div className={styles.priceDisplay}>
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </div>
            </div>
          </div>
        </div>

        {/* 📱 MAIN RESULTS AREA */}
        <div className={styles.resultsArea}>
          {/* 🔧 TOOLBAR */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <button 
                className={styles.showFiltersBtn}
                onClick={() => setShowFilters(!showFilters)}
              >
                🎛️ Bộ lọc
              </button>
              
              <div className={styles.resultsCount}>
                Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm
              </div>
            </div>

            <div className={styles.toolbarRight}>
              {/* Sort Options */}
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className={styles.viewToggle}>
                <button 
                  className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  ⊞ Grid
                </button>
                <button 
                  className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  ☰ List
                </button>
              </div>
            </div>
          </div>

          {/* 🛍️ PRODUCTS GRID/LIST */}
          <AnimatePresence mode="wait">
            {currentProducts.length > 0 ? (
              <motion.div 
                className={`${styles.productsContainer} ${viewMode === 'list' ? styles.listView : styles.gridView}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {currentProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className={styles.productCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    {/* Product Image */}
                    <div className={styles.productImageWrapper}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={280}
                        height={280}
                        className={styles.productImage}
                      />
                      
                      {/* Badges */}
                      <div className={styles.productBadges}>
                        {product.discount > 0 && (
                          <span className={styles.discountBadge}>-{product.discount}%</span>
                        )}
                        {product.isNew && (
                          <span className={styles.newBadge}>NEW</span>
                        )}
                        {product.isBestSeller && (
                          <span className={styles.bestSellerBadge}>BEST</span>
                        )}
                        {!product.inStock && (
                          <span className={styles.outOfStockBadge}>HẾT HÀNG</span>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className={styles.quickActions}>
                        <button 
                          className={styles.quickBtn}
                          onClick={() => addToWishlist(product.id)}
                          title="Thêm vào yêu thích"
                        >
                          ❤️
                        </button>
                        <button 
                          className={styles.quickBtn}
                          title="Xem nhanh"
                        >
                          👁️
                        </button>
                        <button 
                          className={styles.quickBtn}
                          title="So sánh"
                        >
                          ⚖️
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productDescription}>{product.description}</p>
                      
                      {/* Rating */}
                      <div className={styles.productRating}>
                        <span className={styles.stars}>{renderStars(product.rating)}</span>
                        <span className={styles.ratingScore}>({product.rating})</span>
                        <span className={styles.reviewCount}>{product.reviews} đánh giá</span>
                      </div>

                      {/* Price */}
                      <div className={styles.productPricing}>
                        <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button 
                        className={`${styles.addToCartBtn} ${!product.inStock ? styles.disabled : ''}`}
                        onClick={() => addToCart(product.id)}
                        disabled={!product.inStock}
                      >
                        {product.inStock ? '🛒 THÊM VÀO GIỎ' : '❌ HẾT HÀNG'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className={styles.noResults}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <div className={styles.noResultsIcon}>🔍</div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm được sản phẩm phù hợp</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 📄 PAGINATION */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button 
                className={`${styles.pageBtn} ${currentPage === 1 ? styles.disabled : ''}`}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                ← Trước
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              
              <button 
                className={`${styles.pageBtn} ${currentPage === totalPages ? styles.disabled : ''}`}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Sau →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}