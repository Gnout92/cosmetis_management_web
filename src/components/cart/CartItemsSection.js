// src/components/cart/CartItemsSection.jsx
import React from 'react';
import Link from 'next/link';
import { Minus, Plus, X, FileText, Ticket, CheckCircle } from 'lucide-react';
import styles from '../../styles/giohang.module.css';

// Component con: Danh sách sản phẩm, Coupon
const CartItemsSection = ({ 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    couponCode, 
    setCouponCode, 
    applyCoupon, 
    appliedCoupon, 
    removeCoupon,
    formatPrice,
    showNotification
}) => {
    return (
        <div className={styles.cartItemsSection}>
            <h2 className={styles.sectionTitle}><FileText size={24} className="section-title-icon" /> Danh sách sản phẩm</h2>
            
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
                                <Minus size={16} />
                            </button>
                            <span className={styles.quantityDisplay}>{item.quantity}</span>
                            <button 
                                className={styles.quantityBtn}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                                <Plus size={16} />
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
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
            
            {/* Coupon Section */}
            <div className={styles.couponSection}>
                <h3 className={styles.couponTitle}><Ticket size={20} className="coupon-icon" /> Mã giảm giá</h3>
                {appliedCoupon ? (
                    <div className={styles.appliedCoupon}>
                        <span className={styles.couponInfo}>
                            <CheckCircle size={16} className="coupon-check" /> Mã "{appliedCoupon.code}" - {appliedCoupon.description}
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
    );
};

export default CartItemsSection;