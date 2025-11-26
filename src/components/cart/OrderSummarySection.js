// src/components/cart/OrderSummarySection.jsx
import React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Truck,
  CreditCard,
  Banknote,
  Building2,
  Smartphone,
  Flame,
  ArrowLeft,
} from 'lucide-react';
import styles from '../../styles/giohang.module.css';

// Component con: Tóm tắt đơn hàng, Shipping, Payment, Checkout
const OrderSummarySection = ({
  calculateSubtotal,
  calculateDiscount,
  calculateShipping,
  calculateTotal,
  shippingMethod,
  setShippingMethod,
  paymentMethod,
  setPaymentMethod,
  appliedCoupon,
  formatPrice,
  onOpenOrderModal, // Hàm này là prop được truyền từ cha

  
}) => {
  // LƯU Ý: KHÔNG CẦN HÀM handleCheckoutClick (wrapper) VÌ TA GỌI TRỰC TIẾP onOpenOrderModal
  console.log('[OrderSummarySection] onOpenOrderModal =', typeof onOpenOrderModal);

  return (
    <div className={styles.orderSummarySection}>
      <div className={styles.orderSummary}>
        <h2 className={styles.summaryTitle}>
          <DollarSign size={24} className="summary-icon" /> Tóm tắt đơn hàng
        </h2>

        <div className={styles.summaryLine}>
          <span>Tổng tạm tính:</span>
          <span>{formatPrice(calculateSubtotal())}</span>
        </div>

        {appliedCoupon && appliedCoupon.type !== 'shipping' && (
          <div className={styles.summaryLine}>
            <span>Giảm giá ({appliedCoupon.code}):</span>
            <span className={styles.discount}>
              -{formatPrice(calculateDiscount())}
            </span>
          </div>
        )}

        <div className={styles.summaryLine}>
          <span>Phí vận chuyển:</span>
          <span
            className={calculateShipping() === 0 ? styles.freeShipping : ''}
          >
            {calculateShipping() === 0
              ? 'Miễn phí'
              : formatPrice(calculateShipping())}
          </span>
        </div>

        <div className={styles.summaryDivider}></div>

        <div className={styles.summaryTotal}>
          <span>Tổng cộng:</span>
          <span className={styles.totalAmount}>
            {formatPrice(calculateTotal())}
          </span>
        </div>

        {/* Shipping Options */}
        <div className={styles.shippingOptions}>
          <h3 className={styles.optionTitle}>
            <Truck size={20} className="option-icon" /> Hình thức giao hàng
          </h3>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="shipping"
              value="standard"
              checked={shippingMethod === 'standard'}
              onChange={(e) => setShippingMethod(e.target.value)}
            />
            <span>Giao tiêu chuẩn (3-5 ngày)</span>
          </label>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="shipping"
              value="express"
              checked={shippingMethod === 'express'}
              onChange={(e) => setShippingMethod(e.target.value)}
            />
            <span>Giao nhanh (1-2 ngày)</span>
          </label>
          <p className={styles.shippingNote}>
            Phí vận chuyển hiện tạm thời cố định: {formatPrice(20000)} cho mọi
            đơn hàng.
          </p>
        </div>

        {/* Payment Options */}
        <div className={styles.paymentOptions}>
          <h3 className={styles.optionTitle}>
            <CreditCard size={20} className="option-icon" /> Phương thức thanh
            toán
          </h3>
          <label className={styles.radioOption}>
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>
              <Banknote size={16} className="payment-icon" /> Thanh toán khi
              nhận hàng (COD)
            </span>
          </label>
        </div>
        <button
          type="button"
          className={styles.checkoutBtn}
          onClick={() => {
            console.log('[OrderSummarySection] Click "Tiến hành đặt hàng"');
            if (onOpenOrderModal) {
              onOpenOrderModal();
            } else {
              console.warn('onOpenOrderModal is NOT defined!');
            }
          }}
        >
          Tiến hành đặt hàng
        </button>



        <Link href="/danhmucSP" className={styles.continueShopping}>
          <ArrowLeft size={18} /> Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default OrderSummarySection;