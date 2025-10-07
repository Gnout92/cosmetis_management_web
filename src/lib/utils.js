// src/lib/utils.js

// Format giá tiền VNĐ
export const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    Number.isFinite(price) ? price : 0
  );

// Format ngày tháng
export const formatDate = (date, options = {}) =>
  new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });

// Format ngày giờ
export const formatDateTime = (date) => new Date(date).toLocaleString("vi-VN");

// 🔹 (CHANGE) ID an toàn: ưu tiên crypto.randomUUID, fallback tự sinh
export const generateId = (prefix = "") => {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return prefix + crypto.randomUUID();
    }
  } catch (_) {}
  const rand = Math.random().toString(36).slice(2);
  const time = Date.now().toString(36);
  return prefix + time + "-" + rand;
};

// Validate email
export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

// Validate phone number Việt Nam
export const validatePhoneVN = (phone) =>
  /^(\+84|84|0)?[35789]\d{8}$/.test(String(phone).replace(/\s/g, ""));

// Mã hóa thông tin nhạy cảm
export const maskCreditCard = (cardNumber) => {
  if (!cardNumber) return "";
  const cleaned = String(cardNumber).replace(/\s/g, "");
  return "**** **** **** " + cleaned.slice(-4);
};

export const maskPhone = (phone) => {
  if (!phone) return "";
  const s = String(phone);
  return s.length > 6 ? s.slice(0, 3) + "****" + s.slice(-3) : s;
};

// Tính toán điểm thưởng
export const calculateLoyaltyPoints = (orderTotal) =>
  Math.floor((Number(orderTotal) || 0) / 1000);

// Xác định hạng thành viên
export const getLoyaltyTier = (totalPoints) => {
  if (totalPoints >= 5000) return "Platinum";
  if (totalPoints >= 2000) return "Gold";
  if (totalPoints >= 1000) return "Silver";
  return "Bronze";
};

// Tính giá sau khi giảm
export const calculateDiscountedPrice = (originalPrice, discountPercent) => {
  const o = Number(originalPrice) || 0;
  const d = Math.max(0, Math.min(100, Number(discountPercent) || 0));
  return o - (o * d) / 100;
};

// Kiểm tra coupon còn hạn
export const isCouponValid = (coupon) => {
  if (!coupon) return false;
  const now = new Date();
  const expiryDate = new Date(coupon.expiryDate);
  return !coupon.isUsed && expiryDate.getTime() > now.getTime();
};

// Tính toán tổng giá trị đơn hàng
export const calculateOrderTotal = (items, shippingFee = 0, discountAmount = 0) => {
  const subtotal = (items || []).reduce(
    (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );
  return {
    subtotal,
    shippingFee,
    discountAmount,
    total: subtotal + (Number(shippingFee) || 0) - (Number(discountAmount) || 0),
  };
};

// 🔹 (FIX) Tạo slug tiếng Việt: dùng Unicode normalize thay vì regex dài & sai dấu
export const createSlug = (text) => {
  if (!text) return "";
  return text
    .normalize("NFD") // tách dấu
    .replace(/[\u0300-\u036f]/g, "") // xoá toàn bộ dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Debounce function cho search
export const debounce = (func, wait) => {
  let timeout;
  const wrapper = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  //   Cho phép huỷ debounce nếu cần
  wrapper.cancel = () => clearTimeout(timeout);
  return wrapper;
};

// Lưu trữ localStorage an toàn (SSR-safe)
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      if (typeof window === "undefined") return defaultValue;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  },
  remove: (key) => {
    try {
      if (typeof window === "undefined") return;
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },
};

// Generate random color cho avatar
export const generateAvatarColor = (text) => {
  const colors = ["#FF6B9D", "#9C27B0", "#3F51B5", "#2196F3", "#009688", "#4CAF50", "#FF9800", "#FF5722"];
  const s = String(text || "");
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};
