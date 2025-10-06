// Utility functions cho ứng dụng

// Format giá tiền VNĐ
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(price);
};

// Format ngày tháng
export const formatDate = (date, options = {}) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  });
};

// Format ngày giờ
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('vi-VN');
};

// Tạo ID duy nhất
export const generateId = (prefix = '') => {
  return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone number Việt Nam
export const validatePhoneVN = (phone) => {
  const re = /^(\+84|84|0)?[35789]\d{8}$/;
  return re.test(phone.replace(/\s/g, ''));
};

// Mã hóa thông tin nhạy cảm
export const maskCreditCard = (cardNumber) => {
  if (!cardNumber) return '';
  const cleaned = cardNumber.replace(/\s/g, '');
  return '**** **** **** ' + cleaned.slice(-4);
};

export const maskPhone = (phone) => {
  if (!phone) return '';
  return phone.slice(0, 3) + '****' + phone.slice(-3);
};

// Tính toán điểm thưởng
export const calculateLoyaltyPoints = (orderTotal) => {
  // 1 điểm cho mỗi 1,000 VNĐ
  return Math.floor(orderTotal / 1000);
};

// Xác định hạng thành viên
export const getLoyaltyTier = (totalPoints) => {
  if (totalPoints >= 5000) return 'Platinum';
  if (totalPoints >= 2000) return 'Gold';
  if (totalPoints >= 1000) return 'Silver';
  return 'Bronze';
};

// Tính giá sau khi giảm
export const calculateDiscountedPrice = (originalPrice, discountPercent) => {
  return originalPrice - (originalPrice * discountPercent / 100);
};

// Kiểm tra coupon còn hạn
export const isCouponValid = (coupon) => {
  const now = new Date();
  const expiryDate = new Date(coupon.expiryDate);
  return !coupon.isUsed && now < expiryDate;
};

// Tính toán tổng giá trị đơn hàng
export const calculateOrderTotal = (items, shippingFee = 0, discountAmount = 0) => {
  const subtotal = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  return {
    subtotal,
    shippingFee,
    discountAmount,
    total: subtotal + shippingFee - discountAmount
  };
};

// Tạo URL slug từ tiếng Việt
export const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/á|à|ả|ã|ạ|ă|ắp|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, 'a')
    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, 'e')
    .replace(/í|ì|ỉ|ĩ|ị/g, 'i')
    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, 'o')
    .replace(/ú|ù|ủ|ũ|ụ|ư|ừ|ử|ữ|ự|ứ/g, 'u')
    .replace(/ỳ|ý|ỷ|ỹ|ỵ/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Debounce function cho search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Lưu trữ localStorage an toàn
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Generate random color cho avatar
export const generateAvatarColor = (text) => {
  const colors = [
    '#FF6B9D', '#9C27B0', '#3F51B5', '#2196F3', 
    '#009688', '#4CAF50', '#FF9800', '#FF5722'
  ];
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};