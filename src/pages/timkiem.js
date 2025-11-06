// src/pages/timkiem.js
import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import styles from "../styles/tim-kiem.module.css";

// helper format price
const formatPrice = (price) => {
  if (price == null) return "";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// render stars
const renderStars = (rating) => {
  const fullStars = Math.floor(rating || 0);
  const hasHalfStar = (rating || 0) % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <>
      {"★".repeat(fullStars)}
      {hasHalfStar && "☆"}
      {"☆".repeat(emptyStars)}
    </>
  );
};

// gọi API /api/products?page=..&pageSize=..&q=...
async function fetchProducts({ q, page, pageSize }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page) params.set("page", page);
  if (pageSize) params.set("pageSize", pageSize);

  const res = await fetch(`/api/products?${params.toString()}`);
  if (!res.ok) throw new Error("Không lấy được sản phẩm");
  return res.json(); // dự kiến: { data, page, pageSize, total }
}

export default function SearchPage() {
  const router = useRouter();

  // ---- UI state / filter state ----
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  // ---- server data state ----
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [products, setProducts] = useState([]); // kết quả trả về từ API
  const [total, setTotal] = useState(0);

  // pagination render state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Lấy q từ URL (vd /timkiem?q=serum&page=2)
  useEffect(() => {
    if (!router.isReady) return;
    const { q, page } = router.query;
    if (q) setSearchQuery(q.toString());
    if (page && !Number.isNaN(Number(page))) {
      setCurrentPage(Number(page));
    }
  }, [router.isReady, router.query]);

  // Hàm load products từ backend mỗi khi searchQuery / currentPage / itemsPerPage thay đổi
  // (chỉ cho các filter backend đã hỗ trợ lúc này: q, page, pageSize)
  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      setLoadError("");
      try {
        const data = await fetchProducts({
          q: searchQuery,
          page: currentPage,
          pageSize: itemsPerPage,
        });
        if (!mounted) return;
        setProducts(Array.isArray(data?.data) ? data.data : []);
        setTotal(Number(data?.total || 0));
      } catch (err) {
        if (!mounted) return;
        setLoadError("Không thể tải sản phẩm từ máy chủ.");
        setProducts([]);
        setTotal(0);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [searchQuery, currentPage, itemsPerPage]);

  // Bộ lọc phía client: danh mục, brand, price, sort
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // category filter (client-side tạm thời)
    if (selectedCategory !== "all") {
        list = list.filter((p) => {
          // TODO: map p.categoryId -> category slug nếu DB có
          // tạm thời giả sử p.categoryId === selectedCategory
          return String(p.categoryId) === String(selectedCategory);
        });
    }

    // brand filter (hiện DB chưa có brand => TODO sau này)
    if (selectedBrand !== "all") {
        list = list.filter((p) => {
          // nếu DB có brand field (vd p.brand)
          return (p.brand || "").toLowerCase() === selectedBrand.toLowerCase();
        });
    }

    // price range
    list = list.filter((p) => {
      const price = Number(p.price || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // add some mock fields for rating/reviews/discount to keep UI working
    // vì DB hiện chưa có rating, discount, reviews:
    list = list.map((p, idx) => ({
      ...p,
      rating: p.rating ?? 4.5 + ((idx % 5) * 0.1), // fake rating 4.5 - 4.9
      reviews: p.reviews ?? 100 + idx * 13,        // fake reviews
      discount: p.discount ?? 20,                  // fake %
      isNew: idx < 3,                              // giả bộ "mới"
      isBestSeller: idx % 2 === 0,                 // giả bộ "bán chạy"
      inStock: (p.quantity ?? 0) > 0,
      // image fallback
      image: p.image || "/images/banners/placeholder.jpg",
      description:
        p.description ||
        "Sản phẩm chăm sóc da / mô tả đang cập nhật...",
    }));

    // sort
    list.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number(a.price || 0) - Number(b.price || 0);
        case "price-high":
          return Number(b.price || 0) - Number(a.price || 0);
        case "rating":
          return Number(b.rating || 0) - Number(a.rating || 0);
        case "reviews":
          return Number(b.reviews || 0) - Number(a.reviews || 0);
        case "discount":
          return Number(b.discount || 0) - Number(a.discount || 0);
        case "oldest":
          return Number(a.id || 0) - Number(b.id || 0);
        case "newest":
        default:
          return Number(b.id || 0) - Number(a.id || 0);
      }
    });

    return list;
  }, [
    products,
    selectedCategory,
    selectedBrand,
    priceRange,
    sortBy,
  ]);

  // totalPages dựa trên total từ server hay dựa trên filteredProducts?
  // Lúc này: backend mới phân trang theo page/pageSize và filter theo q,
  // còn các filter khác vẫn chạy client-side.
  // => safest: phân trang UI theo filteredProducts.
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Khi user đổi filter/sort/... -> quay về page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, priceRange, sortBy]);

  // Handlers
  const addToCart = useCallback((productId) => {
    console.log(`Added product ${productId} to cart`);
  }, []);

  const addToWishlist = useCallback((productId) => {
    console.log(`Added product ${productId} to wishlist`);
  }, []);

  // FILTER OPTION STATIC LIST
  const categories = [
    { value: "all", label: "🌟 Tất cả danh mục" },
    { value: "sua-rua-mat", label: "🧼 Sữa rửa mặt" },
    { value: "serum", label: "💧 Serum" },
    { value: "kem-duong", label: "🧴 Kem dưỡng" },
    { value: "toner", label: "🌿 Toner" },
    { value: "chong-nang", label: "☀️ Kem chống nắng" },
    { value: "mat-na", label: "🎭 Mặt nạ" },
    { value: "kem-mat", label: "👁️ Kem mắt" },
    { value: "tay-te-bao-chet", label: "✨ Tẩy tế bào chết" },
    { value: "essence", label: "💎 Essence" },
  ];

  const brands = [
    { value: "all", label: "🏷️ Tất cả thương hiệu" },
    { value: "neutrogena", label: "Neutrogena" },
    { value: "loreal", label: "L'Oreal" },
    { value: "clinique", label: "Clinique" },
    { value: "kiehls", label: "Kiehl's" },
    { value: "laroche", label: "La Roche Posay" },
    { value: "ordinary", label: "The Ordinary" },
    { value: "cerave", label: "CeraVe" },
    { value: "olay", label: "Olay" },
    { value: "paulas", label: "Paula's Choice" },
    { value: "estee", label: "Estee Lauder" },
    { value: "somebymi", label: "Some By Mi" },
    { value: "skii", label: "SK-II" },
  ];

  const sortOptions = [
    { value: "newest", label: "🆕 Mới nhất" },
    { value: "oldest", label: "⏰ Cũ nhất" },
    { value: "price-low", label: "💰 Giá thấp đến cao" },
    { value: "price-high", label: "💎 Giá cao đến thấp" },
    { value: "rating", label: "⭐ Đánh giá cao nhất" },
    { value: "reviews", label: "💬 Nhiều đánh giá nhất" },
    { value: "discount", label: "🔥 Giảm giá nhiều nhất" },
  ];

  return (
    <div className={styles.container}>
      {/* HEADER SEARCH */}
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
                // cập nhật URL q=? cho đồng bộ
                router.replace(
                  {
                    pathname: "/timkiem",
                    query: { ...router.query, q: e.target.value || undefined, page: 1 },
                  },
                  undefined,
                  { shallow: true }
                );
              }}
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>
              🔍 TÌM KIẾM
            </button>
          </motion.div>

          {loading && (
            <div className={styles.loadingNote}>Đang tải sản phẩm...</div>
          )}
          {loadError && !loading && (
            <div className={styles.errorNote}>{loadError}</div>
          )}
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* SIDEBAR FILTERS */}
        <div
          className={`${styles.filtersSidebar} ${
            showFilters ? styles.showFilters : ""
          }`}
        >
          <div className={styles.filtersHeader}>
            <h3>🎯 BỘ LỌC TÌM KIẾM</h3>
            <button
              className={styles.closeFilters}
              onClick={() => setShowFilters(false)}
            >
              ✕
            </button>
          </div>

          {/* Category */}
          <div className={styles.filterGroup}>
            <h4>📂 Danh mục</h4>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.filterSelect}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div className={styles.filterGroup}>
            <h4>🏷️ Thương hiệu</h4>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className={styles.filterSelect}
            >
              {brands.map((brand) => (
                <option key={brand.value} value={brand.value}>
                  {brand.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className={styles.filterGroup}>
            <h4>💰 Khoảng giá</h4>
            <div className={styles.priceRange}>
              <input
                type="range"
                min="0"
                max="2000000"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value), priceRange[1]])
                }
                className={styles.priceSlider}
              />
              <input
                type="range"
                min="0"
                max="2000000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className={styles.priceSlider}
              />
              <div className={styles.priceDisplay}>
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div className={styles.resultsArea}>
          {/* Toolbar */}
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
              {/* sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                {[
                  { value: "newest", label: "🆕 Mới nhất" },
                  { value: "oldest", label: "⏰ Cũ nhất" },
                  { value: "price-low", label: "💰 Giá thấp đến cao" },
                  { value: "price-high", label: "💎 Giá cao đến thấp" },
                  { value: "rating", label: "⭐ Đánh giá cao nhất" },
                  { value: "reviews", label: "💬 Nhiều đánh giá nhất" },
                  { value: "discount", label: "🔥 Giảm giá nhiều nhất" },
                ].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* view mode */}
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewBtn} ${
                    viewMode === "grid" ? styles.active : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  ⊞ Grid
                </button>
                <button
                  className={`${styles.viewBtn} ${
                    viewMode === "list" ? styles.active : ""
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  ☰ List
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCT LIST */}
          <AnimatePresence mode="wait">
            {currentProducts.length > 0 ? (
              <motion.div
                className={`${styles.productsContainer} ${
                  viewMode === "list" ? styles.listView : styles.gridView
                }`}
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
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    {/* IMAGE + BADGES + QUICK ACTIONS */}
                    <div className={styles.productImageWrapper}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={280}
                        height={280}
                        className={styles.productImage}
                      />

                      <div className={styles.productBadges}>
                        {product.discount > 0 && (
                          <span className={styles.discountBadge}>
                            -{product.discount}%
                          </span>
                        )}
                        {product.isNew && (
                          <span className={styles.newBadge}>NEW</span>
                        )}
                        {product.isBestSeller && (
                          <span className={styles.bestSellerBadge}>BEST</span>
                        )}
                        {!product.inStock && (
                          <span className={styles.outOfStockBadge}>
                            HẾT HÀNG
                          </span>
                        )}
                      </div>

                      <div className={styles.quickActions}>
                        <button
                          className={styles.quickBtn}
                          onClick={() => addToWishlist(product.id)}
                          title="Thêm vào yêu thích"
                        >
                          ❤️
                        </button>
                        <Link
                          className={styles.quickBtn}
                          title="Xem nhanh"
                          href={`/product/${product.id}`}
                        >
                          👁️
                        </Link>
                        <button className={styles.quickBtn} title="So sánh">
                          ⚖️
                        </button>
                      </div>
                    </div>

                    {/* INFO */}
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productDescription}>
                        {product.description}
                      </p>

                      <div className={styles.productRating}>
                        <span className={styles.stars}>
                          {renderStars(product.rating)}
                        </span>
                        <span className={styles.ratingScore}>
                          ({product.rating?.toFixed?.(1) ?? product.rating})
                        </span>
                        <span className={styles.reviewCount}>
                          {product.reviews} đánh giá
                        </span>
                      </div>

                      <div className={styles.productPricing}>
                        <span className={styles.currentPrice}>
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <span className={styles.originalPrice}>
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                      </div>

                      <button
                        className={`${styles.addToCartBtn} ${
                          !product.inStock ? styles.disabled : ""
                        }`}
                        onClick={() => addToCart(product.id)}
                        disabled={!product.inStock}
                      >
                        {product.inStock
                          ? "🛒 THÊM VÀO GIỎ"
                          : "❌ HẾT HÀNG"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              !loading && (
                <motion.div
                  className={styles.noResults}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={styles.noResultsIcon}>🔍</div>
                  <h3>Không tìm thấy sản phẩm</h3>
                  <p>
                    Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm được sản
                    phẩm phù hợp
                  </p>
                </motion.div>
              )
            )}
          </AnimatePresence>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={`${styles.pageBtn} ${
                  currentPage === 1 ? styles.disabled : ""
                }`}
                onClick={() =>
                  setCurrentPage((prev) => Math.max(1, prev - 1))
                }
                disabled={currentPage === 1}
              >
                ← Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`${styles.pageBtn} ${
                      currentPage === page ? styles.active : ""
                    }`}
                    onClick={() => {
                      setCurrentPage(page);
                      // cập nhật URL page=? cho đồng bộ
                      router.replace(
                        {
                          pathname: "/timkiem",
                          query: {
                            ...router.query,
                            q: searchQuery || undefined,
                            page,
                          },
                        },
                        undefined,
                        { shallow: true }
                      );
                    }}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                className={`${styles.pageBtn} ${
                  currentPage === totalPages ? styles.disabled : ""
                }`}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(totalPages, prev + 1)
                  )
                }
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
