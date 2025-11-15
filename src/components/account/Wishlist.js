import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/login.module.css';

const Wishlist = ({ user, updateUser, showNotification }) => {
  const router = useRouter();
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Danh sách yêu thích</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Các sản phẩm bạn đã lưu lại</p>
        </div>

        {wishlist.length > 0 ? (
          <>
            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Sắp xếp theo:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="price-low">Giá thấp đến cao</option>
                      <option value="price-high">Giá cao đến thấp</option>
                      <option value="name">Tên A-Z</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddAllToCart}
                      className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      🛒 Thêm tất cả vào giỏ
                    </button>
                    <button
                      onClick={handleClearWishlist}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      🗑️ Xóa tất cả
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedWishlist.map((product) => (
                <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Product Image */}
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center">
                      <span className="text-4xl">💄</span>
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3">
                      {product.discount > 0 && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    
                    {!product.inStock && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Hết hàng
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {product.brand}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-yellow-400 text-sm">★</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{product.rating}</span>
                      <span className="text-xs text-gray-400">({product.reviewCount})</span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-bold text-pink-600 dark:text-pink-400">
                        {formatPrice(product.price)}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                          product.inStock
                            ? 'bg-pink-600 hover:bg-pink-700 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {product.inStock ? '🛒 Thêm vào giỏ' : 'Hết hàng'}
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        className="px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                      >
                        ❤️
                      </button>
                    </div>
                    
                    {/* Added Date */}
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
                      Thêm {new Date(product.addedAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Danh sách yêu thích trống
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Hãy thêm các sản phẩm yêu thích để mua sắm dễ dàng hơn
              </p>
              <button
                onClick={() => router.push('/products')}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors"
              >
                🛒 Khám phá sản phẩm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;