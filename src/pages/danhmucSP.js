// src/pages/danhmucSP.js
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import styles from "../styles/danhmucSP.module.css";

const DEFAULT_PAGE_SIZE = 20;

export default function DanhMucSP() {
  // dữ liệu từ API
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // phân trang & lọc
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceFilter, setPriceFilter] = useState(""); // "min-max"
  const [stockFilter, setStockFilter] = useState(""); // in-stock | low-stock | out-of-stock
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentView, setCurrentView] = useState("grid");

  // UI khác
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState({}); // id -> name

  // map sort FE -> API
  const mapSortToApi = (sort) => {
    switch (sort) {
      case "name-asc":
        return { sortBy: "name", sortDir: "asc" };
      case "name-desc":
        return { sortBy: "name", sortDir: "desc" };
      case "price-asc":
        return { sortBy: "price", sortDir: "asc" };
      case "price-desc":
        return { sortBy: "price", sortDir: "desc" };
      case "stock-desc":
        return { sortBy: "stock", sortDir: "desc" };
      default:
        return { sortBy: "name", sortDir: "asc" };
    }
  };

  // Tải danh mục (nếu bạn chưa có API /api/categories, tạm hardcode)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          // hỗ trợ cả dạng [{id, name}] hoặc object
          const map =
            Array.isArray(data)
              ? data.reduce((acc, c) => {
                  acc[c.id] = c.name || c.ten || c.title || `${c.id}`;
                  return acc;
                }, {})
              : data || {};
          setCategories(map);
        } else {
          // fallback cứng nếu API chưa có
          setCategories({
            1: "Sữa rửa mặt",
            2: "Kem chống nắng",
            3: "Dầu gội",
            4: "Mặt nạ",
            5: "Sữa tắm",
            6: "Kem dưỡng ẩm",
            7: "Xịt khoáng",
            8: "Toner",
          });
        }
      } catch {
        setCategories({
          1: "Sữa rửa mặt",
          2: "Kem chống nắng",
          3: "Dầu gội",
          4: "Mặt nạ",
          5: "Sữa tắm",
          6: "Kem dưỡng ẩm",
          7: "Xịt khoáng",
          8: "Toner",
        });
      }
    })();
  }, []);

  // Cart badge
  useEffect(() => {
    const savedCart = typeof window !== "undefined" && localStorage.getItem("cosmetic_cart");
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      const totalItems = cartData.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(totalItems);
    } else {
      setCartCount(0);
    }
  }, []);

  // build query string từ state
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));

    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedCategory) params.set("categoryId", String(selectedCategory));
    if (priceFilter) params.set("price", priceFilter);
    if (stockFilter) params.set("stock", stockFilter);

    const { sortBy: apiSortBy, sortDir } = mapSortToApi(sortBy);
    params.set("sortBy", apiSortBy);
    params.set("sortDir", sortDir);

    return params.toString();
  }, [page, pageSize, searchQuery, selectedCategory, priceFilter, stockFilter, sortBy]);

  // fetch sản phẩm từ API mỗi khi query thay đổi
  useEffect(() => {
    let abort = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?${queryString}`);
        const data = await res.json();

        // Hỗ trợ cả format {items,total} hoặc mảng thẳng
        const list = Array.isArray(data) ? data : (data.items || data.rows || []);
        const totalCount = Array.isArray(data) ? list.length : (data.total ?? list.length);

        if (!abort) {
          setItems(list || []);
          setTotal(totalCount || 0);
        }
      } catch (e) {
        if (!abort) {
          setItems([]);
          setTotal(0);
        }
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => {
      abort = true;
    };
  }, [queryString]);

  // Helpers UI
  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.className = `${styles.notification} ${type === "error" ? styles.notificationError : ""}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) document.body.removeChild(notification);
    }, 3000);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price ?? 0);

  const getDiscountPercent = (original, current) => {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  const getStockStatus = (stock) => {
    const s = Number(stock || 0);
    if (s === 0) return <span className={styles.outOfStock}>❌ Hết hàng</span>;
    if (s < 10) return <span className={styles.lowStock}>⚠️ Còn {s} sản phẩm</span>;
    return (
      <span className={styles.inStock}>
        🚛 2-4 ngày | <i className={`fas fa-map-marker-alt ${styles.locationIcon}`}></i> TP.Hồ Chí Minh
      </span>
    );
  };

  const renderStars = (rating) => {
    const full = Math.floor(Number(rating || 0));
    return Array.from({ length: 5 }).map((_, i) =>
      i < full ? <span key={i} className={styles.star}>⭐</span> : <span key={i} className={styles.starEmpty}>☆</span>
    );
  };

  const getVipLabel = (id) => {
    const labels = ["❤ Rs Vip Dịch", "💎 Premium Quality", "🔥 Hot Deal", "⚡ Fast Ship", "🎁 Gift Box", "💝 Limited Edition"];
    return labels[(Number(id) || 0) % labels.length];
  };

  const getMainImage = (p) => p?.image || (Array.isArray(p?.images) ? p.images[0] : "") || "/images/banners/placeholder.jpg";
  const getCategoryName = (p) => p?.categoryName || categories[p?.categoryId] || "Khác";

  // Cart
  const addToCart = (product, event) => {
    event?.stopPropagation?.();
    const stock = Number(product.stock ?? product.quantityOnHand ?? 0);
    if (stock === 0) {
      showNotification("Sản phẩm đã hết hàng!", "error");
      return;
    }
    const saved = localStorage.getItem("cosmetic_cart");
    const cart = saved ? JSON.parse(saved) : [];
    const idx = cart.findIndex((x) => x.id === product.id);
    if (idx > -1) cart[idx].quantity += 1;
    else
      cart.push({
        id: product.id,
        name: product.name,
        image: getMainImage(product),
        price: product.price,
        originalPrice: product.originalPrice,
        category: getCategoryName(product),
        variant: product.variant || "Mặc định",
        inStock: stock > 0,
        quantity: 1,
      });
    localStorage.setItem("cosmetic_cart", JSON.stringify(cart));
    const totalItems = cart.reduce((s, it) => s + (it.quantity || 0), 0);
    setCartCount(totalItems);
    showNotification(`✅ Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const openProductModal = (p) => {
    setSelectedProduct(p);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };
  const closeProductModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    document.body.style.overflow = "auto";
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceFilter("");
    setStockFilter("");
    setSortBy("name-asc");
    setPage(1);
  };

  // loading
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Đang tải sản phẩm...</h1>
        </div>
        <div className={styles.loadingProducts}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={styles.loadingCard}>
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

  // tổng số trang
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>🛍️ Danh Mục Sản Phẩm</h1>
          <div className={styles.headerActions}>
            <Link href="/" className={styles.backLink}>
              <i className="fas fa-arrow-left"></i>
              Trang chủ
            </Link>
            <Link href="/giohang" className={styles.cartLink}>
              <i className="fas fa-shopping-cart"></i>
              <span>Giỏ hàng</span>
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </Link>
          </div>
        </div>
        <div className={styles.stats}></div>
      </div>

      <div className={styles.content}>
        {/* Filters */}
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className={styles.clearSearch}>
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
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className={styles.filterSelect}
            >
              <option value="">Tất cả danh mục</option>
              {Object.entries(categories).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
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
              onChange={(e) => {
                setPriceFilter(e.target.value);
                setPage(1);
              }}
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
              onChange={(e) => {
                setStockFilter(e.target.value);
                setPage(1);
              }}
              className={styles.filterSelect}
            >
              <option value="">Tất cả</option>
              <option value="in-stock">Còn hàng (&gt;10)</option>
              <option value="low-stock">Sắp hết (1-10)</option>
              <option value="out-of-stock">Hết hàng</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <button onClick={resetFilters} className={styles.resetButton}>
              <i className="fas fa-undo"></i>
              Đặt lại bộ lọc
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className={styles.main}>
          <div className={styles.toolbar}>
            <div className={styles.resultsInfo}>
              <span>Hiển thị {items.length} / {total}</span>
            </div>

            <div className={styles.toolbarRight}>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
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
                  onClick={() => setCurrentView("grid")}
                  className={`${styles.viewBtn} ${currentView === "grid" ? styles.active : ""}`}
                >
                  <i className="fas fa-th"></i>
                </button>
                <button
                  onClick={() => setCurrentView("list")}
                  className={`${styles.viewBtn} ${currentView === "list" ? styles.active : ""}`}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Grid / List */}
          {items.length === 0 ? (
            <div className={styles.noResults}>
              <i className="fas fa-search"></i>
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            <div className={`${styles.productsGrid} ${currentView === "list" ? styles.listView : ""}`}>
              {items.map((p) => {
                const img = getMainImage(p);
                const discount = getDiscountPercent(p.originalPrice, p.price);
                const stock = p.stock ?? p.quantityOnHand ?? 0;
                return (
                  <div
                    key={p.id}
                    className={`${styles.productCard} ${currentView === "list" ? styles.listView : ""}`}
                    onClick={() => openProductModal(p)}
                  >
                    <div className={styles.productImageContainer}>
                      <img src={img} alt={p.name} className={styles.productImage} />
                      {discount > 0 && <div className={`${styles.productBadge} ${styles.sale}`}>-{discount}%</div>}
                      {Number(stock) === 0 && <div className={`${styles.productBadge} ${styles.outOfStock}`}>Hết hàng</div>}
                    </div>

                    <div className={styles.productContent}>
                      <div className={styles.productCategory}>{getCategoryName(p)}</div>
                      <h3 className={styles.productName}>{p.name}</h3>

                      <div className={styles.productRating}>
                        <div className={styles.ratingStars}>
                          {renderStars(p.rating)}
                          <span className={styles.ratingValue}>{p.rating ?? 0}</span>
                        </div>
                      </div>

                      <div className={styles.productVipLabel}>({getVipLabel(p.id)})</div>
                      <p className={styles.productDescription}>{p.description}</p>

                      <div className={styles.productPricing}>
                        <span className={styles.currentPrice}>{formatPrice(p.price)}</span>
                        {discount > 0 && <span className={styles.discountPercent}>-{discount}%</span>}
                        {p.originalPrice > p.price && <span className={styles.soldCount}>đã bán 5k+</span>}
                      </div>

                      <div className={styles.productFooter}>
                        <div className={styles.stockInfo}>{getStockStatus(stock)}</div>
                        <button
                          className={styles.addToCartBtn}
                          disabled={Number(stock) === 0}
                          onClick={(e) => addToCart(p, e)}
                        >
                          <i className="fas fa-shopping-cart"></i>
                          Thêm
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <div className={styles.pagination}>
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              ‹ Trước
            </button>
            <span>
              Trang {page}/{totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Sau ›
            </button>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className={styles.pageSize}
            >
              {[12, 20, 28, 40].map((n) => (
                <option key={n} value={n}>
                  {n}/trang
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Modal */}
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
                  <img src={getMainImage(selectedProduct)} alt={selectedProduct.name} />
                </div>

                <div className={styles.productInfoModal}>
                  <div className={styles.productCategoryModal}>{getCategoryName(selectedProduct)}</div>
                  <h1 className={styles.productTitleModal}>{selectedProduct.name}</h1>
                  <p className={styles.productDescriptionModal}>{selectedProduct.description}</p>

                  <div className={styles.productPricingModal}>
                    <span className={styles.currentPriceModal}>{formatPrice(selectedProduct.price)}</span>
                    {getDiscountPercent(selectedProduct.originalPrice, selectedProduct.price) > 0 && (
                      <span className={styles.discountPercent}>
                        -{getDiscountPercent(selectedProduct.originalPrice, selectedProduct.price)}%
                      </span>
                    )}
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <span className={styles.originalPriceModal}>đã bán 5k+</span>
                    )}
                  </div>

                  <div className={styles.stockInfoModal}>
                    <i className="fas fa-box"></i>
                    <span>
                      Tồn kho: {selectedProduct.stock ?? selectedProduct.quantityOnHand ?? 0} sản phẩm
                    </span>
                  </div>

                  <div className={styles.ratingInfo}>
                    <div className={styles.stars}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${
                            i < Math.floor(selectedProduct.rating || 0) ? styles.active : ""
                          }`}
                        ></i>
                      ))}
                      <span className={styles.ratingText}>
                        {selectedProduct.rating ?? 0} ({selectedProduct.reviews ?? 0} đánh giá)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={`${styles.modalActionBtn} ${styles.addToCartModalBtn}`}
                disabled={(selectedProduct.stock ?? selectedProduct.quantityOnHand ?? 0) === 0}
                onClick={(e) => {
                  addToCart(selectedProduct, e);
                  closeProductModal();
                }}
              >
                <i className="fas fa-shopping-cart"></i>
                Thêm vào giỏ hàng
              </button>
              <button
                className={`${styles.modalActionBtn} ${styles.buyNowBtn}`}
                disabled={(selectedProduct.stock ?? selectedProduct.quantityOnHand ?? 0) === 0}
                onClick={(e) => {
                  addToCart(selectedProduct, e);
                  closeProductModal();
                  window.location.href = "/giohang";
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
