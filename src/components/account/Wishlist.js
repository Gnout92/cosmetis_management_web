import { useState, useEffect } from 'react';
import styles from '../../styles/login.module.css';

const Wishlist = ({ user, updateUser, showNotification }) => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, price-low, price-high, name

  useEffect(() => {
    // Giả lập tải danh sách yêu thích
    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dữ liệu giả lập
        const mockWishlist = [
          {
            id: 'product_1',
            name: 'Kem dưỡng ẩm Vitamin C Cao cấp',
            price: 450000,
            originalPrice: 550000,
            discount: 18,
            image: '/placeholder-product.jpg',
            brand: 'KaKa Beauty',
            rating: 4.8,
            reviewCount: 1234,
            inStock: true,
            description: 'Kem dưỡng ẩm chứa Vitamin C giúp làn da sáng mịn và cấp ẩm sâu',
            addedAt: '2024-01-20T10:30:00Z'
          },
          {
            id: 'product_2',
            name: 'Son môi Luxury Edition Siêu lí',
            price: 320000,
            originalPrice: 400000,
            discount: 20,
            image: '/placeholder-product.jpg',
            brand: 'Luxury Cosmetics',
            rating: 4.9,
            reviewCount: 856,
            inStock: true,
            description: 'Son môi cao cấp với công thức lâu trôi và màu sắc rực rỡ',
            addedAt: '2024-01-18T14:15:00Z'
          },
          {
            id: 'product_3',
            name: 'Tinh chất Retinol Chống lão hóa',
            price: 680000,
            originalPrice: 680000,
            discount: 0,
            image: '/placeholder-product.jpg',
            brand: 'Science Beauty',
            rating: 4.7,
            reviewCount: 567,
            inStock: false,
            description: 'Tinh chất retinol giúp giảm nếp nhăn và cải thiện kết cấu da',
            addedAt: '2024-01-15T09:20:00Z'
          },
          {
            id: 'product_4',
            name: 'Mặt nạ giấy Collagen Hydro',
            price: 25000,
            originalPrice: 30000,
            discount: 17,
            image: '/placeholder-product.jpg',
            brand: 'Natural Glow',
            rating: 4.6,
            reviewCount: 2341,
            inStock: true,
            description: 'Mặt nạ giấy chứa collagen giúp cấp ẩm và làm sáng da',
            addedAt: '2024-01-10T16:45:00Z'
          }
        ];

        setWishlist(mockWishlist);
      } catch (error) {
        showNotification('Không thể tải danh sách yêu thích', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const newWishlist = wishlist.filter(item => item.id !== productId);
      setWishlist(newWishlist);
      
      // Cập nhật user data
      await updateUser({
        wishlist: newWishlist.map(item => item.id)
      });
      
      showNotification('Đã xóa khỏi danh sách yêu thích', 'success');
    } catch (error) {
      showNotification('Có lỗi xảy ra', 'error');
    }
  };

  const handleAddToCart = (product) => {
    if (!product.inStock) {
      showNotification('Sản phẩm đang hết hàng', 'warning');
      return;
    }
    // Giả lập thêm vào giỏ hàng
    showNotification(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
  };

  const handleAddAllToCart = () => {
    const availableItems = wishlist.filter(item => item.inStock);
    if (availableItems.length === 0) {
      showNotification('Không có sản phẩm nào có sẵn', 'warning');
      return;
    }
    showNotification(`Đã thêm ${availableItems.length} sản phẩm vào giỏ hàng`, 'success');
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?')) {
      try {
        setWishlist([]);
        await updateUser({ wishlist: [] });
        showNotification('Đã xóa tất cả sản phẩm yêu thích', 'success');
      } catch (error) {
        showNotification('Có lỗi xảy ra', 'error');
      }
    }
  };

  const sortedWishlist = [...wishlist].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.addedAt) - new Date(a.addedAt);
      case 'oldest':
        return new Date(a.addedAt) - new Date(b.addedAt);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div>
        <div className={styles.contentHeader}>
          <h1 className={styles.contentTitle}>Danh sách yêu thích</h1>
          <p className={styles.contentSubtitle}>Đang tải...</p>
        </div>
        <div className={styles.contentSection} style={{ textAlign: 'center', padding: '3rem' }}>
          <div className={styles.loadingSpinner} style={{ margin: '0 auto', width: '40px', height: '40px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Danh sách yêu thích</h1>
        <p className={styles.contentSubtitle}>Các sản phẩm bạn đã lưu lại</p>
      </div>

      {wishlist.length > 0 ? (
        <>
          {/* Điều khiển */}
          <div className={styles.contentSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#666' }}>Sắp xếp theo:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.formInput}
                  style={{ width: 'auto', padding: '0.5rem' }}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="name">Tên A-Z</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={handleAddAllToCart}
                  className={`${styles.btn} ${styles['btn-primary']}`}
                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  🛒 Thêm tất cả vào giỏ
                </button>
                <button
                  onClick={handleClearWishlist}
                  className={`${styles.btn} ${styles['btn-danger']}`}
                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  🗑️ Xóa tất cả
                </button>
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {sortedWishlist.map((product) => (
              <div key={product.id} className={styles.contentSection} style={{ padding: '1.5rem' }}>
                {/* Hình ảnh sản phẩm */}
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <div style={{
                    width: '100%',
                    height: '200px',
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    💄
                    
                    {/* Badge giảm giá */}
                    {product.discount > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '0.5rem',
                        left: '0.5rem',
                        background: '#ff6b9d',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '25px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        -{product.discount}%
                      </div>
                    )}
                    
                    {/* Badge hết hàng */}
                    {!product.inStock && (
                      <div style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        background: '#f44336',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '25px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        Hết hàng
                      </div>
                    )}
                  </div>
                </div>

                {/* Thông tin sản phẩm */}
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0', 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    lineHeight: '1.3',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.name}
                  </h3>
                  
                  <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.85rem' }}>
                    {product.brand}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ color: '#ffd700', fontSize: '0.9rem' }}>
                      {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>({product.reviewCount})</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ff6b9d' }}>
                      {formatPrice(product.price)}
                    </span>
                    {product.discount > 0 && (
                      <span style={{ fontSize: '0.9rem', color: '#999', textDecoration: 'line-through' }}>
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Mô tả */}
                <p style={{ 
                  margin: '0 0 1.5rem 0', 
                  color: '#666', 
                  fontSize: '0.85rem', 
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {product.description}
                </p>

                {/* Hành động */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className={`${styles.btn} ${product.inStock ? styles['btn-primary'] : styles['btn-secondary']}`}
                    style={{ 
                      flex: 1, 
                      fontSize: '0.85rem', 
                      padding: '0.75rem',
                      opacity: product.inStock ? 1 : 0.6
                    }}
                  >
                    {product.inStock ? '🛒 Thêm vào giỏ' : 'Hết hàng'}
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className={`${styles.btn} ${styles['btn-danger']}`}
                    style={{ fontSize: '0.85rem', padding: '0.75rem' }}
                  >
                    ❤️
                  </button>
                </div>
                
                {/* Ngày thêm */}
                <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                  <small style={{ color: '#999', fontSize: '0.75rem' }}>
                    Đã thêm: {new Date(product.addedAt).toLocaleDateString('vi-VN')}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.contentSection} style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❤️</div>
          <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>Danh sách yêu thích trống</h3>
          <p style={{ color: '#999', marginBottom: '2rem' }}>
            Hãy thêm các sản phẩm yêu thích để mua sắm dễ dàng hơn
          </p>
          <a href="/products" className={`${styles.btn} ${styles['btn-primary']}`}>
            🛒 Khám phá sản phẩm
          </a>
        </div>
      )}
    </div>
  );
};

export default Wishlist;