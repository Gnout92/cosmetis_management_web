// src/pages/giohang.js
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ShoppingCart,
  Trash2,
  ShoppingBag,
  Sparkles,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import styles from '../styles/giohang.module.css';

// IMPORT COMPONENTS
import CartItemsSection from '../components/cart/CartItemsSection';
import OrderSummarySection from '../components/cart/OrderSummarySection';
import { getAuthToken } from '../lib/authToken';

const GioHang = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const router = useRouter();

  // Modal xác nhận đơn
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Địa chỉ giao hàng mặc định
  const [shippingAddress, setShippingAddress] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  // Trạng thái đặt hàng
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

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

  // Utility functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `${styles.notification} ${
      type === 'error' ? styles.notificationError : ''
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  // Add to cart function
  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      // Increase quantity if product already in cart
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      // Add new product to cart
      const newItem = {
        ...product,
        quantity: 1,
      };
      const updatedCart = [...cartItems, newItem];
      setCartItems(updatedCart);
      saveCartToStorage(updatedCart);
      showNotification(`Đã thêm "${product.name}" vào giỏ hàng!`);
    }
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    saveCartToStorage(updatedCart);
    showNotification('Đã cập nhật số lượng');
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
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

  // Calculate functions
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    const subtotal = calculateSubtotal();
    if (appliedCoupon.type === 'shipping') {
      return 0; // Shipping discount handled separately
    }

    return Math.floor(subtotal * appliedCoupon.discount);
  };

  // Tạm thời: phí ship cố định 20.000đ cho mọi đơn (nếu không có sản phẩm thì 0)
  const calculateShipping = () => {
    if (!cartItems.length) return 0;
    return 20000;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const shipping = calculateShipping();
    return subtotal - discount + shipping;
  };

  // Available coupons
  const availableCoupons = {
    SALE10: {
      discount: 0.1,
      minOrder: 500000,
      description: 'Giảm 10% cho đơn từ 500k',
    },
    NEWCUSTOMER: {
      discount: 0.15,
      minOrder: 300000,
      description: 'Giảm 15% cho khách mới',
    },
    FREESHIP: {
      discount: 50000,
      minOrder: 200000,
      description: 'Miễn phí ship cho đơn từ 200k',
      type: 'shipping',
    },
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
      showNotification(
        `Đơn hàng tối thiểu ${formatPrice(
          coupon.minOrder
        )} để sử dụng mã này`,
        'error'
      );
      return;
    }

    setAppliedCoupon({
      code: couponCode.toUpperCase(),
      ...coupon,
    });
    const code = couponCode.toUpperCase();
    setCouponCode('');
    showNotification(`Áp dụng mã "${code}" thành công!`);
  };

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    showNotification('Đã hủy mã giảm giá');
  };

  // ====== API: Lấy địa chỉ giao hàng mặc định ======
  const loadDefaultShippingAddress = async () => {
    try {
      setIsLoadingAddress(true);
      setOrderError(null);

      const token = getAuthToken();
      if (!token) {
        setOrderError('Bạn cần đăng nhập trước khi đặt hàng.');
        router.push('/login');
        return null;
      }

      const res = await fetch('/api/user/addresses', {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errRes = await res.json().catch(() => null);
        throw new Error(errRes?.error || 'Không thể tải sổ địa chỉ');
      }

      const data = await res.json();
      const list = data.addresses || [];

      if (!list.length) {
        setShippingAddress(null);
        return null;
      }

      // Ưu tiên: Shipping + mặc định
      const shippingDefault =
        list.find((a) => a.type === 'Shipping' && a.isDefault) ||
        list.find((a) => a.type === 'Shipping') ||
        list[0];

      setShippingAddress(shippingDefault || null);
      return shippingDefault || null;
    } catch (err) {
      console.error('loadDefaultShippingAddress error:', err);
      setOrderError(err.message || 'Lỗi khi tải địa chỉ mặc định');
      setShippingAddress(null);
      return null;
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Mở modal xác nhận đặt hàng
  const handleOpenOrderModal = async () => {
    if (!cartItems || cartItems.length === 0) {
      showNotification('Giỏ hàng trống, vui lòng thêm sản phẩm!', 'error');
      return;
    }

    setOrderError(null);
    setOrderSuccess(null);

    await loadDefaultShippingAddress();
    setShowOrderModal(true);
  };

  // Xác nhận đặt hàng (chuẩn bị cho bước 2 nối backend)
  const handleConfirmOrder = async () => {
    try {
      setOrderError(null);
      setOrderSuccess(null);

      if (!cartItems || cartItems.length === 0) {
        setOrderError('Giỏ hàng của bạn đang trống.');
        return;
      }

      if (!shippingAddress) {
        setOrderError(
          'Bạn chưa có địa chỉ giao hàng mặc định. Hãy vào Sổ địa chỉ để thêm/chọn địa chỉ.'
        );
        return;
      }

      const token = getAuthToken();
      if (!token) {
        setOrderError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        router.push('/login');
        return;
      }

      setOrderSubmitting(true);

      const itemsPayload = cartItems.map((item) => ({
        productId: item.productId || item.id,
        quantity: item.quantity || 1,
      }));

      const payload = {
        addressId: shippingAddress.id,
        items: itemsPayload,
        shippingFee: calculateShipping(), // tạm thời 20.000
        paymentMethod,
      };

      // Bước 2 sẽ tạo API /api/orders đúng schema don_hang + don_hang_chi_tiet
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errRes = await res.json().catch(() => null);
        throw new Error(errRes?.error || 'Không thể tạo đơn hàng');
      }

      const data = await res.json();

      setOrderSuccess(
        `Đặt hàng thành công! Mã đơn: ${data.orderId || ''}`.trim()
      );

      // Clear giỏ hàng FE
      localStorage.removeItem('cosmetic_cart');
      setCartItems([]);
      setAppliedCoupon(null);

      // Đóng modal sau 1.5s
      setTimeout(() => {
        setShowOrderModal(false);
        setOrderSuccess(null);
      }, 1500);
    } catch (err) {
      console.error('handleConfirmOrder error:', err);
      setOrderError(err.message || 'Lỗi khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setOrderSubmitting(false);
    }
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
            <ShoppingCart size={32} className="title-icon" />
            Giỏ hàng của bạn
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
                <Trash2 size={18} />
                Xóa tất cả
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
              <button className={styles.confirmBtn} onClick={clearCart}>
                Xóa tất cả
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận đặt hàng mới */}
      {showOrderModal && (
        <div className={styles.orderModalBackdrop}>
          <div className={styles.orderModal}>
            {/* Header */}
            <div className={styles.orderModalHeader}>
              <h2>Xác nhận đặt hàng</h2>
              <button
                className={styles.orderModalClose}
                onClick={() => {
                  setShowOrderModal(false);
                  setOrderError(null);
                  setOrderSuccess(null);
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Thông báo lỗi / thành công */}
            {orderError && (
              <div className={styles.orderErrorBox}>
                <AlertCircle size={16} />
                <span>{orderError}</span>
              </div>
            )}
            {orderSuccess && (
              <div className={styles.orderSuccessBox}>
                <CheckCircle2 size={16} />
                <span>{orderSuccess}</span>
              </div>
            )}

            {/* Nội dung modal */}
            <div className={styles.orderModalBody}>
              {/* Thông tin giao hàng */}
              <section className={styles.orderSection}>
                <h3>Thông tin giao hàng</h3>

                {isLoadingAddress ? (
                  <p>Đang tải địa chỉ mặc định...</p>
                ) : !shippingAddress ? (
                  <div className={styles.orderWarningBox}>
                    <p>
                      Bạn chưa có địa chỉ giao hàng mặc định. Hãy thêm hoặc
                      chọn địa chỉ trong Sổ địa chỉ.
                    </p>
                    <button
                      className={styles.addressButton}
                      onClick={() =>
                        router.push('/taikhoan/addresses?from=cart')
                      }
                    >
                      Đi tới Sổ địa chỉ
                    </button>
                  </div>
                ) : (
                  <div className={styles.addressBox}>
                    <p>
                      <strong>{shippingAddress.name}</strong> –{' '}
                      {shippingAddress.phone}
                    </p>
                    <p>
                      {shippingAddress.addressLine ||
                        shippingAddress.detailAddress}
                      {shippingAddress.street
                        ? `, ${shippingAddress.street}`
                        : ''}
                    </p>
                    <p>
                      {shippingAddress.wardName
                        ? `${shippingAddress.wardName}, `
                        : ''}
                      {shippingAddress.districtName
                        ? `${shippingAddress.districtName}, `
                        : ''}
                      {shippingAddress.provinceName || ''}
                    </p>

                    <button
                      className={styles.addressChangeButton}
                      onClick={() =>
                        router.push('/taikhoan/addresses?from=cart')
                      }
                    >
                      ĐỔI ĐỊA CHỈ
                    </button>
                  </div>
                )}
              </section>

              {/* Sản phẩm trong đơn */}
              <section className={styles.orderSection}>
                <h3>Sản phẩm trong đơn hàng</h3>
                {!cartItems || !cartItems.length ? (
                  <p>Giỏ hàng trống.</p>
                ) : (
                  <div className={styles.orderItemsList}>
                    {cartItems.map((item) => (
                      <div
                        key={item.id || item.productId}
                        className={styles.orderItemRow}
                      >
                        <div>
                          <p className={styles.orderItemName}>{item.name}</p>
                          <p className={styles.orderItemQty}>
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        <div className={styles.orderItemPrice}>
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Tổng thanh toán */}
              <section className={styles.orderSection}>
                <h3>Tổng thanh toán</h3>
                <div className={styles.orderSummaryRow}>
                  <span>Tạm tính</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>

                {appliedCoupon && appliedCoupon.type !== 'shipping' && (
                  <div className={styles.orderSummaryRow}>
                    <span>Giảm giá ({appliedCoupon.code})</span>
                    <span className={styles.discount}>
                      -{formatPrice(calculateDiscount())}
                    </span>
                  </div>
                )}

                <div className={styles.orderSummaryRow}>
                  <span>Phí vận chuyển</span>
                  <span>{formatPrice(calculateShipping())}</span>
                </div>

                <div
                  className={`${styles.orderSummaryRow} ${styles.orderSummaryTotal}`}
                >
                  <span>Tổng thanh toán</span>
                  <span className={styles.totalAmount}>
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
              </section>
            </div>

            {/* Footer button */}
            <div className={styles.orderModalFooter}>
              <button
                className={styles.orderCancelButton}
                onClick={() => {
                  setShowOrderModal(false);
                  setOrderError(null);
                  setOrderSuccess(null);
                }}
                disabled={orderSubmitting}
              >
                Hủy
              </button>
              <button
                className={styles.orderConfirmButton}
                onClick={handleConfirmOrder}
                disabled={
                  orderSubmitting || !cartItems?.length || !shippingAddress
                }
              >
                {orderSubmitting ? 'Đang đặt hàng...' : 'Xác nhận đặt hàng'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>
   
        {cartItems.length === 0 ? (
          // Empty cart state
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <ShoppingBag size={64} />
            </div>
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>
              Hãy tiếp tục mua sắm và khám phá những sản phẩm tuyệt vời!
            </p>
            <Link href="/danhmucSP" className={styles.exploreBtn}>
              <Sparkles size={18} /> Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          // Cart content
          <div className={styles.cartLayout}>
            <CartItemsSection
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              applyCoupon={applyCoupon}
              appliedCoupon={appliedCoupon}
              removeCoupon={removeCoupon}
              formatPrice={formatPrice}
              showNotification={showNotification}
            />

            <OrderSummarySection
              calculateSubtotal={calculateSubtotal}
              calculateDiscount={calculateDiscount}
              calculateShipping={calculateShipping}
              calculateTotal={calculateTotal}
              shippingMethod={shippingMethod}
              setShippingMethod={setShippingMethod}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              appliedCoupon={appliedCoupon}
              onOpenOrderModal={handleOpenOrderModal}   
              formatPrice={formatPrice}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GioHang;
