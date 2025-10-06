// context/AuthContext.js
import { createContext, useState, useContext } from "react";
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);

  const login = (user) => setAuthUser(user);
  const logout = () => {
    googleLogout(); // Nếu dùng Google OAuth
    setAuthUser(null);
  };

  const isAuthenticated = !!authUser;

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={{ authUser, isAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}
