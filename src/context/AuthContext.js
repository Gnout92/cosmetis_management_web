// src/context/AuthContext.js
import { createContext, useState, useEffect, useContext } from "react";

// Tạo context
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // lưu thông tin user
  const [loading, setLoading] = useState(true);

  // Giả lập lấy user từ localStorage hoặc API khi load app
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tiện lợi để dùng context
export const useAuth = () => useContext(AuthContext);
