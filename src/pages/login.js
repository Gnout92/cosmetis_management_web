// src/pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import styles from "../styles/login.module.css";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, HelpCircle } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // State cho đăng nhập bằng username/password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- Helper: chuẩn hoá role và xác định đường dẫn ---
  const getRedirectPath = (user) => {
    // Ưu tiên các field đã có:
    const raw =
      user?.primaryRole ??
      user?.role ??
      user?.vai_tro ??
      (Array.isArray(user?.roles) && user.roles.length ? user.roles[0] : "Customer");

    const norm = String(raw || "Customer").trim().toLowerCase().replace(/[\s_]+/g, "");
    console.log("[LOGIN] resolve role -> raw:", raw, "| normalized:", norm);

    // Admin
    if (norm === "admin") {
      console.log("[LOGIN] Redirecting to Admin dashboard");
      return "/NoiBo/Admin";
    }
    
    // Warehouse Manager
    if (["warehouse", "warehous", "qlkho", "ql_kho"].includes(norm)) {
      console.log("[LOGIN] Redirecting to QLKho dashboard");
      return "/NoiBo/QLKho";
    }
    
    // Product Manager
    if (["product", "qlsanpham", "ql_sanpham", "sales"].includes(norm)) {
      console.log("[LOGIN] Redirecting to QLSP dashboard");
      return "/NoiBo/QLSP";
    }
    
    // Customer Manager
    if (["staff", "qlbh", "qlkhachhang", "ql_khachhang", "customer"].includes(norm)) {
      console.log("[LOGIN] Redirecting to QLKH dashboard");
      return "/NoiBo/QLKH";
    }
    
    // Default to home for customers
    console.log("[LOGIN] Default redirect to home");
    return "/";
  };
  // --- Sau khi login thành công ---
  const handleLoginSuccess = async (user, token, isNewUser = false) => {
    try {
      login(user, token);

      let redirectPath = isNewUser ? "/taikhoan" : getRedirectPath(user);
      console.log("[LOGIN] will redirect to:", redirectPath, "| user.role:", user?.role, "| user.primaryRole:", user?.primaryRole, "| user.roles:", user?.roles);

      await router.push(redirectPath);
    } catch (err) {
      console.error("[LOGIN] redirect error:", err);
      setError("Lỗi khi chuyển hướng trang");
    }
  };

  // --- Google login ---
  async function handleGoogleSuccess(credentialResponse) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Đăng nhập thất bại");
      }

      const { token, user, isNewUser } = await res.json();

      console.log("[LOGIN][google] payload =", user);
      await handleLoginSuccess(user, token, isNewUser);
    } catch (err) {
      console.error("[LOGIN][google] error:", err);
      setError(err.message || "Lỗi đăng nhập với Google");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleError() {
    setError("Lỗi khi xác thực với Google. Vui lòng thử lại.");
  }

  // --- Username/Password login ---
  async function handleUsernameLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Tên đăng nhập hoặc mật khẩu không đúng");
      }

      const { token, user, redirect } = await res.json();

      console.group("[LOGIN] API success");
      console.log("api.redirect =", redirect);
      console.log("user.payload =", user);
      console.log("computed.redirect =", getRedirectPath(user));
      console.groupEnd();

      // Ưu tiên redirect từ API, nếu không có -> tự tính
      await handleLoginSuccess(user, token, false);
    } catch (err) {
      console.error("[LOGIN][password] error:", err);
      setError(err.message || "Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginFormWrapper}>
        <div className={styles.headerSection}>
          <h1 className={styles.mainTitle}>Chào mừng đến Beauty Shop</h1>
        </div>

        <div className={styles.loginFormContainer}>
          <div className={styles.loginForm}>
            {/* Đăng nhập truyền thống */}
            <div className={styles.traditionalLoginSection}>
              <form onSubmit={handleUsernameLogin}>
                <div className={styles.formGroup}>
                  <label htmlFor="username" className={styles.label}>
                    <Mail size={16} className={styles.inputIcon} />
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    id="username"
                    className={styles.input}
                    placeholder="Nhập tên đăng nhập của bạn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.label}>
                    <Lock size={16} className={styles.inputIcon} />
                    Mật khẩu
                  </label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className={styles.input}
                      placeholder="Nhập mật khẩu của bạn"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles.passwordToggle}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className={styles.forgotPasswordWrapper}>
                  <Link href="/forgot-password" className={styles.forgotPasswordLink}>
                    <HelpCircle size={16} />
                    Quên mật khẩu?
                  </Link>
                </div>

                <button type="submit" className={styles.loginButton} disabled={loading}>
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>
            </div>

            {/* Dấu ngăn cách */}
            <div className={styles.divider}>
              <div className={styles.dividerLine}></div>
              <span className={styles.dividerText}>HOẶC</span>
              <div className={styles.dividerLine}></div>
            </div>

            {/* Social login */}
            <div className={styles.quickLoginSection}>
              <div className={styles.googleButtonWrapper}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  locale="vi"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <p>❌ {error}</p>
            </div>
          )}

          {loading && (
            <div className={styles.loadingMessage}>
              <p>Đang xác thực... Vui lòng chờ</p>
            </div>
          )}
        </div>

        <div className={styles.backHomeLink}>
          <Link href="/" className={styles.backHomeButton}>
            <ArrowLeft size={16} />
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
