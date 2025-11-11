'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingCart, Trash2, ShoppingBag, Sparkles, FileText, Ticket,
  CheckCircle, DollarSign, Truck, CreditCard, Banknote, Building2,
  Smartphone, Flame, ArrowLeft, User, Package, Lock, Clock, Check,
  PartyPopper, Star, RotateCcw, Plus, Minus, X, Mail, Phone, MapPin,
  Award, Settings, AlertCircle, CheckCircle2, Activity, Shield,
  Package2, Box, Navigation, MapPin as MapPinIcon, Search, MapPin as MapIcon, Target
} from 'lucide-react';
import styles from '../styles/giohang.module.css';

const GioHang = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // Customer information states
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    isGuest: true,
    hasAccount: false
  });
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  
  // Payment processing states
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  // Order info panel states
  const [showOrderInfo, setShowOrderInfo] = useState(false);
  
  // Load order data from localStorage on component mount
  useEffect(() => {
    const savedOrder = localStorage.getItem('confirmedOrder');
    const savedStatus = localStorage.getItem('orderStatus');
    
    if (savedOrder) {
      setOrderConfirmed(JSON.parse(savedOrder));
    }
    if (savedStatus) {
      setOrderStatus(JSON.parse(savedStatus));
    }
  }, []);

  // Save order data to localStorage whenever it changes
  useEffect(() => {
    if (orderConfirmed) {
      localStorage.setItem('confirmedOrder', JSON.stringify(orderConfirmed));
    }
  }, [orderConfirmed]);

  useEffect(() => {
    if (orderStatus) {
      localStorage.setItem('orderStatus', JSON.stringify(orderStatus));
    }
  }, [orderStatus]);
  
  // Map tracking states
  const [showMapTracking, setShowMapTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Available coupons
  const availableCoupons = {
    'SALE10': { discount: 0.1, minOrder: 500000, description: 'Giảm 10% cho đơn từ 500k' },
    'NEWCUSTOMER': { discount: 0.15, minOrder: 300000, description: 'Giảm 15% cho khách mới' },
    'FREESHIP': { discount: 50000, minOrder: 200000, description: 'Miễn phí ship cho đơn từ 200k', type: 'shipping' }
  };

  // Demo products for testing
  const demoProducts = [
    {
      id: 1,
      name: 'Son Môi BB Perfect',
      variant: 'Màu đỏ hồng',
      category: 'Son môi',
      price: 350000,
      originalPrice: 450000,
      image: "/images/banners/56.jpg"
    },
    {
      id: 2,
      name: 'Kem Dưỡng Ẩm Daily',
      variant: 'Loại 50ml',
      category: 'Chăm sóc da',
      price: 280000,
      originalPrice: 320000,
      image: "/images/banners/57.jpg"
    },
    {
      id: 3,
      name: 'Nước Hoa Nam Elegant',
      variant: 'Mùi Woody',
      category: 'Nước hoa',
      price: 650000,
      image: "/images/banners/58.jpg"
    },
    {
      id: 4,
      name: 'Sữa Tắm Herbal',
      variant: 'Hương oải hương',
      category: 'Chăm sóc cơ thể',
      price: 150000,
      originalPrice: 200000,
      image: "/images/banners/59.jpg"
    },
    {
      id: 5,
      name: 'Kẻ Mắt Waterproof',
      variant: 'Màu đen',
      category: 'Trang điểm mắt',
      price: 180000,
      image: "/images/banners/60.jpg"
    },
    {
      id: 6,
      name: 'Dầu Gội Tự Nhiên',
      variant: 'Cho tóc dầu',
      category: 'Chăm sóc tóc',
      price: 220000,
      originalPrice: 280000,
      image: "/images/banners/61.jpg"
    }
  ];

  // Add to cart function
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      // Increase quantity if product already in cart
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      // Add new product to cart
      const newItem = {
        ...product,
        quantity: 1
      };
      const updatedCart = [...cartItems, newItem];
      setCartItems(updatedCart);
      saveCartToStorage(updatedCart);
      showNotification(`Đã thêm "${product.name}" vào giỏ hàng!`);
    }
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
    showNotification(<><CheckCircle className="notification-icon" size={16} /> Áp dụng mã "{couponCode.toUpperCase()}" thành công!</>);
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

  // Customer information handlers
  const updateCustomerInfo = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateCustomerInfo = () => {
    const { name, email, phone, address, city } = customerInfo;
    if (!name || !email || !phone || !address || !city) {
      showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
      return false;
    }
    return true;
  };

  // Checkout handler - hiển thị form checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showNotification('Giỏ hàng trống, vui lòng thêm sản phẩm!', 'error');
      return;
    }
    setShowCheckoutForm(true);
    showNotification('Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng!');
  };

  // Process order
  const processOrder = async () => {
    if (!validateCustomerInfo()) return;
    
    setPaymentProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      const newOrderId = 'ORD' + Date.now();
      setOrderId(newOrderId);
      setOrderConfirmed({
        orderId: newOrderId,
        items: cartItems,
        customer: customerInfo,
        payment: { method: paymentMethod, shipping: shippingMethod },
        totals: {
          subtotal: calculateSubtotal(),
          discount: calculateDiscount(),
          shipping: calculateShipping(),
          total: calculateTotal()
        },
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setShowCheckoutForm(false);
      setPaymentProcessing(false);
      showNotification(<><PartyPopper className="notification-icon" size={16} /> Đặt hàng thành công! Cảm ơn bạn đã mua hàng.</>);
      
      // Automatically switch to order info panel after successful order placement
      setTimeout(() => {
        setShowOrderInfo(true);
        showNotification('Đã chuyển đến thông tin đơn hàng của bạn!');
      }, 1000);
      
      // Clear cart after order confirmation
      setTimeout(() => {
        clearCart();
      }, 2000);
    }, 2000);
  };

  // Simulate payment processing
  const processPayment = () => {
    if (paymentMethod === 'cod') {
      processOrder();
    } else {
      // Show payment gateway for online payments
      setShowPaymentGateway(true);
    }
  };

  // Complete online payment
  const completePayment = (paymentResult) => {
    if (paymentResult.success) {
      processOrder();
      setShowPaymentGateway(false);
    } else {
      showNotification('Thanh toán thất bại. Vui lòng thử lại!', 'error');
    }
  };

  // Track order
  const trackOrder = () => {
    setShowOrderInfo(true);
  };

  // Get estimated delivery time
  const getEstimatedDeliveryTime = () => {
    const now = new Date();
    const deliveryHours = shippingMethod === 'express' ? 36 : 96; // 1.5 days or 4 days in hours
    const deliveryDate = new Date(now.getTime() + (deliveryHours * 60 * 60 * 1000));
    return deliveryDate;
  };

  // Format delivery time
  const formatDeliveryTime = () => {
    const deliveryDate = getEstimatedDeliveryTime();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return deliveryDate.toLocaleDateString('vi-VN', options);
  };

  // Simulate order location tracking on map
  const simulateOrderLocation = () => {
    if (!orderConfirmed) return null;
    
    const locations = [
      { lat: 10.7769, lng: 106.7009, name: "Kho hàng - Quận Tân Bình", status: "Chuẩn bị đơn hàng" },
      { lat: 10.7869, lng: 106.7109, name: "Trung tâm phân loại", status: "Đang phân loại" },
      { lat: 10.7969, lng: 106.7209, name: "Điểm trung chuyển", status: "Đã giao vận chuyển" },
      { lat: 10.8069, lng: 106.7309, name: "Điểm giao hàng - Quận 1", status: "Đang giao hàng" },
      { lat: 10.8169, lng: 106.7409, name: "Đã đến điểm nhận hàng", status: "Sẵn sàng giao" }
    ];
    
    const currentStatus = orderStatus?.status || 'pending';
    let currentIndex = 0;
    
    switch(currentStatus) {
      case 'pending': currentIndex = 0; break;
      case 'confirmed': currentIndex = 1; break;
      case 'preparing': currentIndex = 1; break;
      case 'shipping': currentIndex = 2; break;
      case 'delivering': currentIndex = 3; break;
      case 'delivered': currentIndex = 4; break;
      default: currentIndex = 0;
    }
    
    return {
      current: locations[currentIndex],
      next: currentIndex < locations.length - 1 ? locations[currentIndex + 1] : null,
      progress: (currentIndex / (locations.length - 1)) * 100
    };
  };

  // Open map tracking
  const openMapTracking = () => {
    setShowMapTracking(true);
    setShowOrderInfo(false);
    if (orderConfirmed) {
      setCurrentLocation(simulateOrderLocation());
    }
  };

  // Render map tracking
  const renderMapTracking = () => {
    if (!showMapTracking) return null;
    
    const locationData = simulateOrderLocation();
    
    return (
      <div className={styles.mapTrackingModal}>
        <div className={styles.mapTrackingContent}>
          <div className={styles.mapTrackingHeader}>
            <h3><MapIcon size={24} /> Theo dõi đơn hàng trên bản đồ</h3>
            <button 
              className={styles.closeMapTracking}
              onClick={() => setShowMapTracking(false)}
            >
              <X size={18} />
            </button>
          </div>
          
          <div className={styles.mapContainer}>
            <div className={styles.mapArea}>
              {/* Simulated Map Area */}
              <div className={styles.mapBackground}>
                {/* Map grid lines */}
                {[...Array(8)].map((_, i) => (
                  <div key={`h${i}`} className={styles.mapLine} style={{ top: `${i * 12.5}%` }}></div>
                ))}
                {[...Array(8)].map((_, i) => (
                  <div key={`v${i}`} className={styles.mapLine} style={{ left: `${i * 12.5}%` }}></div>
                ))}
                
                {/* Current location marker */}
                {locationData?.current && (
                  <div 
                    className={styles.locationMarker}
                    style={{
                      left: `${(locationData.current.lng - 106.7) * 10 * 10}%`,
                      top: `${(10.9 - locationData.current.lat) * 10 * 10}%`
                    }}
                    title={locationData.current.name}
                  >
                    <div className={styles.markerPulse}></div>
                    <Target size={16} className={styles.markerIcon} />
                    <div className={styles.markerLabel}>
                      {locationData.current.name}
                    </div>
                  </div>
                )}
                
                {/* Next location marker */}
                {locationData?.next && (
                  <div 
                    className={styles.nextLocationMarker}
                    style={{
                      left: `${(locationData.next.lng - 106.7) * 10 * 10}%`,
                      top: `${(10.9 - locationData.next.lat) * 10 * 10}%`
                    }}
                    title={locationData.next.name}
                  >
                    <MapPinIcon size={14} />
                    <div className={styles.markerLabel}>
                      {locationData.next.name}
                    </div>
                  </div>
                )}
                
                {/* Progress path */}
                {locationData && (
                  <div className={styles.progressPath}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${locationData.progress}%` }}
                    ></div>
                  </div>
                )}
                
                {/* Route markers */}
                {locationData && (
                  <div className={styles.routePath}>
                    {/* Previous completed markers */}
                    {Array.from({ length: Math.floor(locationData.progress / 20) }, (_, i) => (
                      <div 
                        key={`completed-${i}`}
                        className={styles.routeMarker + ' ' + styles.completed}
                        style={{
                          left: `${20 + (i * 15)}%`,
                          top: `${50 + (i * 5)}%`
                        }}
                      />
                    ))}
                    
                    {/* Current location marker */}
                    {locationData.current && (
                      <div 
                        className={styles.routeMarker + ' ' + styles.current}
                        style={{
                          left: `${(locationData.current.lng - 106.7) * 10 * 10}%`,
                          top: `${(10.9 - locationData.current.lat) * 10 * 10}%`
                        }}
                        title={locationData.current.name}
                      />
                    )}
                    
                    {/* Next destination marker */}
                    {locationData.next && (
                      <div 
                        className={styles.routeMarker}
                        style={{
                          left: `${(locationData.next.lng - 106.7) * 10 * 10}%`,
                          top: `${(10.9 - locationData.next.lat) * 10 * 10}%`
                        }}
                        title={locationData.next.name}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.locationInfo}>
              <h4>Trạng thái vận chuyển</h4>
              {orderStatus && (
                <div className={styles.currentLocationStatus}>
                  <div className={styles.statusDot}></div>
                  <span>{orderStatus.message}</span>
                </div>
              )}
              
              {locationData && (
                <div className={styles.locationDetails}>
                  <div className={styles.locationItem}>
                    <strong>Vị trí hiện tại:</strong>
                    <span>{locationData.current.name}</span>
                  </div>
                  
                  {locationData.next && (
                    <div className={styles.locationItem}>
                      <strong>Điểm tiếp theo:</strong>
                      <span>{locationData.next.name}</span>
                    </div>
                  )}
                  
                  <div className={styles.progressBar}>
                    <div className={styles.progressText}>Tiến độ giao hàng</div>
                    <div className={styles.progressTrack}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${locationData.progress}%` }}
                      ></div>
                    </div>
                    <div className={styles.progressPercent}>{Math.round(locationData.progress)}%</div>
                  </div>
                  
                  <div className={styles.estimatedTime}>
                    <Clock size={16} />
                    <span>Cập nhật: {new Date().toLocaleTimeString('vi-VN')}</span>
                  </div>
                </div>
              )}
              
              <div className={styles.trackingSwitchButtons}>
                <button 
                  className={styles.switchToOrderTracking}
                  onClick={() => {
                    setShowMapTracking(false);
                    trackOrder();
                  }}
                >
                  <Activity size={16} /> Xem chi tiết trạng thái
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render order info panel
  const renderOrderInfo = () => {
    if (!showOrderInfo) return null;
    
    return (
      <div className={styles.orderInfoPanel}>
        <div className={styles.orderInfoHeader}>
          <h3><Package size={20} className="order-info-icon" /> Đơn hàng của bạn</h3>
          <button 
            className={styles.closeOrderInfo}
            onClick={() => setShowOrderInfo(false)}
          >
            <X size={18} />
          </button>
        </div>
        
        <div className={styles.orderInfoContent}>
          <div className={styles.deliveryInfo}>
            <h4><Truck size={16} className="delivery-icon" /> Thông tin giao hàng</h4>
            <div className={styles.deliveryMethod}>
              <span className={styles.methodLabel}>Phương thức:</span>
              <span className={styles.methodValue}>
                {shippingMethod === 'express' ? 'Giao nhanh (1-2 ngày)' : 'Giao tiêu chuẩn (3-5 ngày)'}
              </span>
            </div>
            <div className={styles.deliveryTime}>
              <span className={styles.timeLabel}>Thời gian dự kiến:</span>
              <span className={styles.timeValue}>{formatDeliveryTime()}</span>
            </div>
            <div className={styles.deliveryCost}>
              <span className={styles.costLabel}>Phí ship:</span>
              <span className={styles.costValue}>
                {calculateShipping() === 0 ? 'Miễn phí' : formatPrice(calculateShipping())}
              </span>
            </div>
          </div>
          
          {cartItems.length > 0 && (
            <div className={styles.orderSummary}>
              <h4><ShoppingBag size={16} className="summary-icon" /> Tóm tắt đơn hàng</h4>
              <div className={styles.summaryItems}>
                <div className={styles.summaryLine}>
                  <span>Số lượng sản phẩm:</span>
                  <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
                </div>
                <div className={styles.summaryLine}>
                  <span>Tổng tiền hàng:</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                {appliedCoupon && appliedCoupon.type !== 'shipping' && (
                  <div className={styles.summaryLine}>
                    <span>Giảm giá:</span>
                    <span className={styles.discount}>-{formatPrice(calculateDiscount())}</span>
                  </div>
                )}
                <div className={styles.summaryLine}>
                  <span>Phí vận chuyển:</span>
                  <span>{calculateShipping() === 0 ? 'Miễn phí' : formatPrice(calculateShipping())}</span>
                </div>
                <div className={styles.summaryDivider}></div>
                <div className={styles.summaryTotal}>
                  <span>Tổng cộng:</span>
                  <span className={styles.totalAmount}>{formatPrice(calculateTotal())}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className={styles.orderActions}>
            {orderConfirmed ? (
              <button 
                className={styles.mapTrackingBtn}
                onClick={openMapTracking}
              >
                <MapIcon size={16} /> Theo dõi trên bản đồ
              </button>
            ) : (
              <button 
                className={styles.viewOrderBtn}
                onClick={() => setShowOrderInfo(true)}
              >
                <Package size={16} /> Đơn hàng của bạn
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Order status simulation với 6 giai đoạn chi tiết
  useEffect(() => {
    if (orderConfirmed) {
      const statuses = [
        { status: 'pending', message: 'Đơn hàng của bạn đã được tiếp nhận, đang chờ xử lý', time: 0 },
        { status: 'confirmed', message: 'Đã xác nhận hợp lệ và đang chuẩn bị đơn hàng', time: 2000 },
        { status: 'preparing', message: 'Đang lấy hàng từ kho, đóng gói và dán nhãn', time: 4000 },
        { status: 'shipping', message: 'Đã giao cho đơn vị vận chuyển, đang trên đường', time: 6000 },
        { status: 'delivering', message: 'Shipper đang giao hàng đến bạn. Vui lòng chuẩn bị nhận', time: 8000 },
        { status: 'delivered', message: 'Đã giao hàng thành công. Cảm ơn bạn đã mua hàng!', time: 10000 }
      ];
      
      let currentIndex = 0;
      const updateStatus = () => {
        if (currentIndex < statuses.length) {
          setOrderStatus(statuses[currentIndex]);
          // Cập nhật vị trí địa lý
          if (showMapTracking) {
            setTimeout(() => {
              setCurrentLocation(simulateOrderLocation());
            }, 500);
          }
          currentIndex++;
          setTimeout(updateStatus, statuses[currentIndex - 1].time);
        }
      };
      updateStatus();
    }
  }, [orderConfirmed, showMapTracking]);

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
      {/* Order Info Panel */}
      {showOrderInfo && renderOrderInfo()}

      {/* Map Tracking Panel */}
      {renderMapTracking()}

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
                className={styles.yourOrdersBtn}
                onClick={() => setShowOrderInfo(!showOrderInfo)}
                title="Xem thông tin đơn hàng"
              >
                <Package size={18} />
                Đơn hàng của bạn
              </button>
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

      {/* Customer Information Modal */}
      {showCheckoutForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent} style={{ maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
            <h3><User size={24} className="modal-icon" /> Thông tin khách hàng</h3>
            
            <div className={styles.customerForm}>
              <div className={styles.formRow}>
                <label>Họ và tên *</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => updateCustomerInfo('name', e.target.value)}
                  placeholder="Nhập họ và tên"
                  className={styles.formInput}
                  required
                />
              </div>
              
              <div className={styles.formRow}>
                <label>Email *</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => updateCustomerInfo('email', e.target.value)}
                  placeholder="example@email.com"
                  className={styles.formInput}
                  required
                />
              </div>
              
              <div className={styles.formRow}>
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => updateCustomerInfo('phone', e.target.value)}
                  placeholder="0901234567"
                  className={styles.formInput}
                  required
                />
              </div>
              
              <div className={styles.formRow}>
                <label>Tỉnh/Thành phố *</label>
                <select
                  value={customerInfo.city}
                  onChange={(e) => updateCustomerInfo('city', e.target.value)}
                  className={styles.formSelect}
                  required
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  <option value="HCM">TP. Hồ Chí Minh</option>
                  <option value="HN">Hà Nội</option>
                  <option value="DN">Đà Nẵng</option>
                  <option value="CT">Cần Thơ</option>
                  <option value="HP">Hải Phòng</option>
                </select>
              </div>
              
              <div className={styles.formRow}>
                <label>Quận/Huyện</label>
                <input
                  type="text"
                  value={customerInfo.district}
                  onChange={(e) => updateCustomerInfo('district', e.target.value)}
                  placeholder="Quận 1, Quận 2..."
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formRow}>
                <label>Địa chỉ chi tiết *</label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => updateCustomerInfo('address', e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã..."
                  className={styles.formTextarea}
                  rows="3"
                  required
                />
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setShowCheckoutForm(false)}
                disabled={paymentProcessing}
              >
                Hủy
              </button>
              <button 
                className={styles.checkoutBtn}
                onClick={processPayment}
                disabled={paymentProcessing}
              >
                {paymentProcessing ? (
                  <><Clock size={18} className="loading-icon" /> Đang xử lý...</>
                ) : (
                  <><Package size={18} /> Đặt hàng</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      {showPaymentGateway && (
        <div className={styles.modal}>
          <div className={styles.modalContent} style={{ maxWidth: '500px' }}>
            <h3><Lock size={24} className="modal-icon" /> Cổng thanh toán</h3>
            <p>Đang chuyển hướng đến {paymentMethod === 'momo' ? 'MoMo' : paymentMethod === 'zalopay' ? 'ZaloPay' : 'ngân hàng'}...</p>
            
            <div className={styles.paymentGateway}>
              <div className={styles.gatewayInfo}>
                <p><strong>Phương thức:</strong> {paymentMethod.toUpperCase()}</p>
                <p><strong>Số tiền:</strong> {formatPrice(calculateTotal())}</p>
              </div>
              
              <div className={styles.gatewayActions}>
                <button 
                  className={styles.cancelBtn}
                  onClick={() => setShowPaymentGateway(false)}
                >
                  Hủy
                </button>
                <button 
                  className={styles.checkoutBtn}
                  onClick={() => completePayment({ success: true })}
                >
                  <><CheckCircle size={18} /> Thanh toán thành công</>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation */}
      {orderConfirmed && (
        <div className={styles.modal}>
          <div className={styles.modalContent} style={{ maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}>
            <h3><CheckCircle size={24} className="modal-icon" /> Xác nhận đơn hàng</h3>
            
            <div className={styles.orderConfirmation}>
              <div className={styles.orderHeader}>
                <h4>Mã đơn hàng: <span className={styles.orderId}>{orderConfirmed.orderId}</span></h4>
                <p>Thời gian: {new Date(orderConfirmed.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              
              <div className={styles.orderDetails}>
                <h5><Package size={20} className="section-icon" /> Chi tiết đơn hàng:</h5>
                <div className={styles.orderItems}>
                  {orderConfirmed.items.map((item, index) => (
                    <div key={index} className={styles.confirmationItem}>
                      <img src={item.image} alt={item.name} className={styles.confirmationImage} />
                      <div className={styles.confirmationInfo}>
                        <h6>{item.name}</h6>
                        <p>{item.variant} | Số lượng: {item.quantity}</p>
                      </div>
                      <div className={styles.confirmationPrice}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={styles.orderTotals}>
                  <div className={styles.totalLine}>
                    <span>Tổng tạm tính:</span>
                    <span>{formatPrice(orderConfirmed.totals.subtotal)}</span>
                  </div>
                  {orderConfirmed.totals.discount > 0 && (
                    <div className={styles.totalLine}>
                      <span>Giảm giá:</span>
                      <span className={styles.discount}>-{formatPrice(orderConfirmed.totals.discount)}</span>
                    </div>
                  )}
                  <div className={styles.totalLine}>
                    <span>Phí vận chuyển:</span>
                    <span>{orderConfirmed.totals.shipping === 0 ? 'Miễn phí' : formatPrice(orderConfirmed.totals.shipping)}</span>
                  </div>
                  <div className={styles.totalLineFinal}>
                    <span>Tổng cộng:</span>
                    <span className={styles.finalTotal}>{formatPrice(orderConfirmed.totals.total)}</span>
                  </div>
                </div>
                
                <div className={styles.deliveryInfo}>
                  <h5><Truck size={20} className="section-icon" /> Thông tin giao hàng:</h5>
                  <p><strong>Tên:</strong> {orderConfirmed.customer.name}</p>
                  <p><strong>Điện thoại:</strong> {orderConfirmed.customer.phone}</p>
                  <p><strong>Email:</strong> {orderConfirmed.customer.email}</p>
                  <p><strong>Địa chỉ:</strong> {orderConfirmed.customer.address}, {orderConfirmed.customer.city}</p>
                </div>
                
                <div className={styles.paymentInfo}>
                  <h5><CreditCard size={20} className="section-icon" /> Thông tin thanh toán:</h5>
                  <p><strong>Phương thức:</strong> {
                    orderConfirmed.payment.method === 'cod' ? 'Thanh toán khi nhận hàng' :
                    orderConfirmed.payment.method === 'momo' ? 'Ví MoMo' :
                    orderConfirmed.payment.method === 'zalopay' ? 'ZaloPay' :
                    'Chuyển khoản ngân hàng'
                  }</p>
                  <p><strong>Giao hàng:</strong> {
                    orderConfirmed.payment.shipping === 'express' ? 'Giao nhanh (1-2 ngày)' : 'Giao tiêu chuẩn (3-5 ngày)'
                  }</p>
                </div>
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn}
                onClick={() => {
                  setShowCheckoutForm(false);
                  setOrderConfirmed(null);
                }}
              >
                Về trang giỏ hàng
              </button>
              <button 
                className={styles.checkoutBtn} 
                onClick={() => {
                  setShowCheckoutForm(false);
                  setShowOrderInfo(true);
                }}
              >
                <Package size={18} /> Đơn hàng của bạn
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>
        {/* Demo Add to Cart Section */}
        {cartItems.length === 0 && (
          <div className={styles.demoSection}>
            <h2><Sparkles size={28} className="demo-title-icon" /> Sản Phẩm Nổi Bật</h2>
            <div className={styles.demoProducts}>
              {demoProducts.map((product) => (
                <div key={product.id} className={styles.demoProduct}>
                  <img src={product.image} alt={product.name} className={styles.demoImage} />
                  <div className={styles.demoInfo}>
                    <h3>{product.name}</h3>
                    <p className={styles.demoVariant}>{product.variant}</p>
                    <p className={styles.demoCategory}>{product.category}</p>
                    <div className={styles.demoPrice}>
                      <span className={styles.demoCurrentPrice}>{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className={styles.demoOriginalPrice}>{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                    <button 
                      className={styles.addToCartBtn}
                      onClick={() => addToCart(product)}
                    >
                      <Plus size={18} /> Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          // Empty cart state
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><ShoppingBag size={64} /></div>
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy tiếp tục mua sắm và khám phá những sản phẩm tuyệt vời!</p>
            <Link href="/danhmucSP" className={styles.exploreBtn}>
              <Sparkles size={18} /> Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          // Cart content
          <div className={styles.cartLayout}>
            {/* Cart Items Section */}
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

            {/* Order Summary Section */}
            <div className={styles.orderSummarySection}>
              <div className={styles.orderSummary}>
                <h2 className={styles.summaryTitle}><DollarSign size={24} className="summary-icon" /> Tóm tắt đơn hàng</h2>
                
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
                  <h3 className={styles.optionTitle}><Truck size={20} className="option-icon" /> Hình thức giao hàng</h3>
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
                  <h3 className={styles.optionTitle}><CreditCard size={20} className="option-icon" /> Phương thức thanh toán</h3>
                  <label className={styles.radioOption}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span><Banknote size={16} className="payment-icon" /> Thanh toán khi nhận hàng (COD)</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span><Building2 size={16} className="payment-icon" /> Chuyển khoản ngân hàng</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="momo"
                      checked={paymentMethod === 'momo'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span><Smartphone size={16} className="payment-icon" /> Ví MoMo</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="zalopay"
                      checked={paymentMethod === 'zalopay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span><Flame size={16} className="payment-icon" /> ZaloPay</span>
                  </label>
                </div>
                
                <button className={styles.checkoutBtn} onClick={handleCheckout}>
                  <Flame size={18} /> Tiến hành thanh toán
                </button>
                
                <Link href="/danhmucSP" className={styles.continueShopping}>
                  <ArrowLeft size={18} /> Tiếp tục mua sắm
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
