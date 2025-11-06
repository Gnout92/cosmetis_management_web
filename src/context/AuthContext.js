// src/context/AuthContext.js
import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 
  // loading = true lúc đầu để _app.js có thể show overlay trong khi hydrate từ localStorage

  // Khi app load, lấy thông tin đăng nhập từ localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("authToken");

      if (storedUser) {
        setAuthUser(JSON.parse(storedUser));
      }
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (err) {
      console.error("AuthContext hydrate error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Gọi khi đăng nhập thành công
  const login = useCallback((userObj, jwtToken) => {
    setAuthUser(userObj || null);
    setToken(jwtToken || null);

    if (userObj) {
      localStorage.setItem("user", JSON.stringify(userObj));
    } else {
      localStorage.removeItem("user");
    }

    if (jwtToken) {
      localStorage.setItem("authToken", jwtToken);
    } else {
      localStorage.removeItem("authToken");
    }
  }, []);

  // Gọi khi logout
  const logout = useCallback(() => {
    try {
      googleLogout(); // đăng xuất Google OAuth phía client
    } catch (e) {
      // không sao, phòng trường hợp googleLogout throw
    }

    setAuthUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  }, []);

  const isAuthenticated = !!authUser;

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AuthContext.Provider
        value={{
          authUser,
          token,
          isAuthenticated,
          login,
          logout,
          loading,
        }}
      >
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}
