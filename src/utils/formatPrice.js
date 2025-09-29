// src/utils/formatPrice.js

/**
 * Chuyển đổi số sang định dạng tiền Việt Nam.
 * @param {number|string} price - Giá cần định dạng
 * @returns {string} - Giá đã được định dạng, ví dụ: 150000 -> "150.000đ"
 */
export function formatPrice(price) {
  if (!price && price !== 0) return "";

  const number = typeof price === "string" ? parseFloat(price.replace(/\D/g, "")) : price;

  if (isNaN(number)) return "";

  return number.toLocaleString("vi-VN") + "đ";
}

// Ví dụ sử dụng:
// console.log(formatPrice(150000)); // "150.000đ"
// console.log(formatPrice("450000")); // "450.000đ"
