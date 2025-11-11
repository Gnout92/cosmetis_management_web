'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/giohang.module.css';

const GioHang = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Available coupons
  const availableCoupons = {
    'SALE10': { discount: 0.1, minOrder: 500000, description: 'Giảm 10% cho đơn từ 500k' },
    'NEWCUSTOMER': { discount: 0.15, minOrder: 300000, description: 'Giảm 15% cho khách mới' },
    'FREESHIP': { discount: 50000, minOrder: 200000, description: 'Miễn phí ship cho đơn từ 200k', type: 'shipping' }
  };

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cosmetic_cart');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      setCartItems(cartData);
    }
    setLoading(false);
  }, []);

  // Save cart to localStorage
  const saveCartToStorage = (items) => {
    localStorage.setItem('cosmetic_cart', JSON.stringify(items));
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    saveCartToStorage(updatedCart);
    showNotification('Đã cập nhật số lượng');
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    saveCartToStorage(updatedCart);
    showNotification('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cosmetic_cart');
    setAppliedCoupon(null);
    setShowClearConfirm(false);
    showNotification('Đã xóa tất cả sản phẩm');
  };

  // Apply coupon
  const applyCoupon = () => {
    const coupon = availableCoupons[couponCode.toUpperCase()];
    if (!coupon) {
      showNotification('Mã giảm giá không hợp lệ', 'error');
      return;
    }
    
    const subtotal = calculateSubtotal();
    if (subtotal < coupon.minOrder) {
      showNotification(`Đơn hàng tối thiểu ${formatPrice(coupon.minOrder)} để sử dụng mã này`, 'error');
      return;
    }
    
    setAppliedCoupon({
      code: couponCode.toUpperCase(),
      ...coupon
    });
    setCouponCode('');
    showNotification(`✅ Áp dụng mã "${couponCode.toUpperCase()}" thành công!`);
  };

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    showNotification('Đã hủy mã giảm giá');
  };

  // Calculate functions
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    const subtotal = calculateSubtotal();
    if (appliedCoupon.type === 'shipping') {
      return 0; // Shipping discount handled separately
    }
    
    return Math.floor(subtotal * appliedCoupon.discount);
  };

  const calculateShipping = () => {
    if (appliedCoupon && appliedCoupon.type === 'shipping') {
      return 0; // Free shipping
    }
    
    const subtotal = calculateSubtotal();
    if (subtotal >= 500000) return 0; // Free shipping for orders over 500k
    
    return shippingMethod === 'express' ? 50000 : 30000;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const shipping = calculateShipping();
    return subtotal - discount + shipping;
  };

  // Utility functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `${styles.notification} ${type === 'error' ? styles.notificationError : ''}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  // Checkout handler
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showNotification('Giỏ hàng trống, vui lòng thêm sản phẩm!', 'error');
      return;
    }

    // Show success notification
    showNotification('🎉 Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
    
    // Clear cart after 2 seconds
    setTimeout(() => {
      clearCart();
    }, 2000);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            🛒 Giỏ hàng của bạn
          </h1>
          {cartItems.length > 0 && (
            <div className={styles.headerActions}>
              <span className={styles.itemCount}>
                {cartItems.length} sản phẩm
              </span>
              <button 
                className={styles.clearAllBtn}
                onClick={() => setShowClearConfirm(true)}
              >
                🗑️ Xóa tất cả
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Clear confirmation modal */}
      {showClearConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Xác nhận xóa giỏ hàng</h3>
            <p>Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setShowClearConfirm(false)}
              >
                Hủy
              </button>
              <button 
                className={styles.confirmBtn}
                onClick={clearCart}
              >
                Xóa tất cả
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>
        {cartItems.length === 0 ? (
          // Empty cart state
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🛍️</div>
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy tiếp tục mua sắm và khám phá những sản phẩm tuyệt vời!</p>
            <Link href="/danhmucSP" className={styles.exploreBtn}>
              ✨ Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          // Cart content
          <div className={styles.cartLayout}>
            {/* Cart Items Section */}
            <div className={styles.cartItemsSection}>
              <h2 className={styles.sectionTitle}>🧾 Danh sách sản phẩm</h2>
              
              {/* Cart Table Header */}
              <div className={styles.cartTableHeader}>
                <div className={styles.productColumn}>Sản phẩm</div>
                <div className={styles.priceColumn}>Đơn giá</div>
                <div className={styles.quantityColumn}>Số lượng</div>
                <div className={styles.totalColumn}>Thành tiền</div>
                <div className={styles.actionColumn}>Xóa</div>
              </div>
              
              {/* Cart Items */}
              <div className={styles.cartItems}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.productInfo}>
                      <img src={item.image} alt={item.name} className={styles.productImage} />
                      <div className={styles.productDetails}>
                        <h3 className={styles.productName}>{item.name}</h3>
                        <p className={styles.productVariant}>{item.variant}</p>
                        <span className={styles.productCategory}>{item.category}</span>
                      </div>
                    </div>
                    
                    <div className={styles.priceInfo}>
                      <span className={styles.currentPrice}>{formatPrice(item.price)}</span>
                      {item.originalPrice && (
                        <span className={styles.originalPrice}>{formatPrice(item.originalPrice)}</span>
                      )}
                    </div>
                    
                    <div className={styles.quantityControls}>
                      <button 
                        className={styles.quantityBtn}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className={styles.quantityDisplay}>{item.quantity}</span>
                      <button 
                        className={styles.quantityBtn}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className={styles.itemTotal}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    
                    <button 
                      className={styles.removeItemBtn}
                      onClick={() => removeFromCart(item.id)}
                      title="Xóa sản phẩm"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Coupon Section */}
              <div className={styles.couponSection}>
                <h3 className={styles.couponTitle}>🎟️ Mã giảm giá</h3>
                {appliedCoupon ? (
                  <div className={styles.appliedCoupon}>
                    <span className={styles.couponInfo}>
                      ✅ Mã "{appliedCoupon.code}" - {appliedCoupon.description}
                    </span>
                    <button className={styles.removeCouponBtn} onClick={removeCoupon}>
                      Hủy
                    </button>
                  </div>
                ) : (
                  <div className={styles.couponInput}>
                    <input 
                      type="text" 
                      placeholder="Nhập mã giảm giá (VD: SALE10)..."
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className={styles.couponField}
                    />
                    <button 
                      className={styles.applyCouponBtn}
                      onClick={applyCoupon}
                      disabled={!couponCode.trim()}
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
                <div className={styles.availableCoupons}>
                  <p><strong>Mã khả dụng:</strong> SALE10, NEWCUSTOMER, FREESHIP</p>
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className={styles.orderSummarySection}>
              <div className={styles.orderSummary}>
                <h2 className={styles.summaryTitle}>💰 Tóm tắt đơn hàng</h2>
                
                <div className={styles.summaryLine}>
                  <span>Tổng tạm tính:</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                
                {appliedCoupon && appliedCoupon.type !== 'shipping' && (
                  <div className={styles.summaryLine}>
                    <span>Giảm giá ({appliedCoupon.code}):</span>
                    <span className={styles.discount}>-{formatPrice(calculateDiscount())}</span>
                  </div>
                )}
                
                <div className={styles.summaryLine}>
                  <span>Phí vận chuyển:</span>
                  <span className={calculateShipping() === 0 ? styles.freeShipping : ''}>
                    {calculateShipping() === 0 ? 'Miễn phí' : formatPrice(calculateShipping())}
                  </span>
                </div>
                
                <div className={styles.summaryDivider}></div>
                
                <div className={styles.summaryTotal}>
                  <span>Tổng cộng:</span>
                  <span className={styles.totalAmount}>{formatPrice(calculateTotal())}</span>
                </div>
                
                {/* Shipping Options */}
                <div className={styles.shippingOptions}>
                  <h3 className={styles.optionTitle}>🚚 Hình thức giao hàng</h3>
                  <label className={styles.radioOption}>
                    <input 
                      type="radio" 
                      name="shipping" 
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                    />
                    <span>Giao tiêu chuẩn (3-5 ngày) - {formatPrice(30000)}</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input 
                      type="radio" 
                      name="shipping" 
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                    />
                    <span>Giao nhanh (1-2 ngày) - {formatPrice(50000)}</span>
                  </label>
                </div>
                
                {/* Payment Options */}
                <div className={styles.paymentOptions}>
                  <h3 className={styles.optionTitle}>💳 Phương thức thanh toán</h3>
                  <label className={styles.radioOption}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💵 Thanh toán khi nhận hàng (COD)</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>🏦 Chuyển khoản ngân hàng</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="momo"
                      checked={paymentMethod === 'momo'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>📱 Ví MoMo</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="zalopay"
                      checked={paymentMethod === 'zalopay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>🔥 ZaloPay</span>
                  </label>
                </div>
                
                <button className={styles.checkoutBtn} onClick={handleCheckout}>
                  🔥 Tiến hành thanh toán
                </button>
                
                <Link href="/danhmucSP" className={styles.continueShopping}>
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GioHang;
