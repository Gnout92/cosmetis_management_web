// src/context/AuthContext.js
import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google";
import { useRouter } from "next/router";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Khởi tạo auth state từ localStorage
  useEffect(() => {
    console.log("🔄 Initializing AuthContext...");
    
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("authToken") || localStorage.getItem("token");

        console.log("📦 Stored data:", {
          hasUser: !!storedUser,
          hasToken: !!storedToken,
          user: storedUser ? JSON.parse(storedUser) : null,
          token: storedToken ? "EXISTS" : "MISSING"
        });

        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser);
          
          // Fetch fresh user data từ database để đảm bảo role là mới nhất
          try {
            const response = await fetch('/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              if (userData.success && userData.user) {
                // Update user data với thông tin mới từ database
                const updatedUser = {
                  ...userData.user,
                  ...user, // Giữ lại data từ localStorage
                  id: user.id || userData.user.id
                };
                setAuthUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
                console.log("✅ User data refreshed from database:", updatedUser);
              } else {
                setAuthUser(user);
                console.log("✅ User loaded from localStorage:", user);
              }
            } else {
              setAuthUser(user);
              console.log("✅ User loaded from localStorage:", user);
            }
          } catch (error) {
            console.warn("⚠️ Failed to fetch fresh user data:", error);
            setAuthUser(user);
            console.log("✅ User loaded from localStorage:", user);
          }
        }
        
        if (storedToken) {
          setToken(storedToken);
          console.log("✅ Token loaded from localStorage");
        }
      } catch (err) {
        console.error("❌ AuthContext init error:", err);
        // Nếu có lỗi parsing, clear localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
        console.log("🏁 AuthContext initialization complete");
      }
    };

    initAuth();
  }, []);

  // Login function với RBAC integration
  const login = useCallback(async (userObj, jwtToken) => {
    console.log("🔑 Login called with:", { 
      user: userObj, 
      token: jwtToken ? "EXISTS" : "MISSING" 
    });

    try {
      // Nếu có token, fetch thông tin user từ database để lấy role thật
      let updatedUser = userObj;
      if (jwtToken && userObj?.id) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            // Merge user data từ database với data hiện tại
            updatedUser = {
              ...userData,
              ...userObj, // Giữ lại data từ login response
              id: userObj.id // Đảm bảo ID không bị overwrite
            };
            console.log("✅ User data updated from database:", updatedUser);
          }
        } catch (error) {
          console.warn("⚠️ Failed to fetch user data from database:", error);
          // Sử dụng userObj như fallback
        }
      }

      // Set state
      setAuthUser(updatedUser || null);
      setToken(jwtToken || null);

      // Store in localStorage
      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log("💾 User stored in localStorage:", updatedUser);
      } else {
        localStorage.removeItem("user");
        console.log("🗑️ User removed from localStorage");
      }

      if (jwtToken) {
        // Store token with both keys for compatibility
        localStorage.setItem("authToken", jwtToken);
        localStorage.setItem("token", jwtToken);
        console.log("💾 Token stored in localStorage");
      } else {
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
        console.log("🗑️ Token removed from localStorage");
      }

      console.log("✅ Login completed successfully");
    } catch (err) {
      console.error("❌ Login error:", err);
    }
  }, []);

  // Enhanced logout function
  const logout = useCallback(async () => {
    console.log("🚪 Logout called");
    
    try {
      // Call logout API if token exists
      if (token) {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log("✅ Logout API called successfully");
        } catch (apiError) {
          console.warn("⚠️ Logout API error (continuing anyway):", apiError);
        }
      }

      // Clear state
      setAuthUser(null);
      setToken(null);
      
      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
      console.log("🗑️ All auth data cleared from localStorage");
      
      // Google logout
      try {
        googleLogout();
        console.log("✅ Google logout completed");
      } catch (e) {
        console.warn("⚠️ Google logout error:", e);
      }

      console.log("✅ Logout completed successfully");
    } catch (err) {
      console.error("❌ Logout error:", err);
    }
  }, [token]);

  // Check token validity
  const isTokenValid = useCallback(() => {
    try {
      const storedToken = localStorage.getItem("authToken") || localStorage.getItem("token");
      
      if (!storedToken) {
        console.log("❌ No token found");
        return false;
      }

      // Basic JWT validation (if using JWT)
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp && payload.exp < currentTime) {
          console.log("❌ Token expired");
          return false;
        }
        
        console.log("✅ Token is valid");
        return true;
      } catch (e) {
        // If not JWT format, assume token is valid
        console.log("ℹ️ Token format not JWT, assuming valid");
        return true;
      }
    } catch (err) {
      console.error("❌ Token validation error:", err);
      return false;
    }
  }, []);

  // Auto-logout on token expiry
  useEffect(() => {
    if (token && !isTokenValid()) {
      console.log("⏰ Token expired, auto-logging out");
      logout();
      // Redirect to login after a short delay
      setTimeout(() => {
        if (router.pathname !== '/login') {
          router.push('/login');
        }
      }, 1000);
    }
  }, [token, isTokenValid, logout, router]);

  const isAuthenticated = !!authUser && !!token;

  // Update user function
  const updateUser = useCallback((userData) => {
    console.log("🔄 UpdateUser called with:", userData);
    
    if (userData && authUser) {
      const updatedUser = { ...authUser, ...userData };
      setAuthUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log("✅ User updated successfully:", updatedUser);
    }
  }, [authUser]);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AuthContext.Provider
        value={{
          authUser,
          token,
          isAuthenticated,
          login,
          logout,
          updateUser,
          loading,
          isTokenValid
        }}
      >
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}