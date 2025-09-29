// src/context/CartContext.js
import { createContext, useState, useContext, useEffect } from "react";

// Tạo context
const CartContext = createContext();

// Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Lấy giỏ hàng từ localStorage khi load app
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Cập nhật localStorage khi cart thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Thêm sản phẩm vào giỏ
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (productId, quantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Tính tổng số lượng
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Tính tổng giá tiền
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.salePrice.replace(/[^\d.]/g, "")),
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook tiện lợi để dùng context
export const useCart = () => useContext(CartContext);
