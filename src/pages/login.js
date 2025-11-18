// src/pages/login.js
import { useState } from "react";
import { useRouter } from "next/router"; 
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import styles from "../styles/login.module.css";
import { useAuth } from "../context/AuthContext";
// Import icons (cần cài đặt: npm install lucide-react)
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  UserPlus,
  HelpCircle
} from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // State cho đăng nhập bằng email/password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Xử lý đăng nhập bằng Google (Phương thức ưu tiên)
  async function handleGoogleSuccess(credentialResponse) {
  setLoading(true);
  setError(null);
  try {
    const idToken = credentialResponse?.credential;
    if (!idToken) throw new Error("Không nhận được mã xác thực từ Google");

    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken }),
    });

    if (!res.ok) {
      const raw = await res.text(); // có thể là text hoặc json
      try {
        const json = JSON.parse(raw);
        throw new Error(json.message || "Đăng nhập thất bại");
      } catch {
        throw new Error(raw?.slice(0, 200) || "Đăng nhập thất bại");
      }
    }

    const data = await res.json(); // { token, user, isNewUser }
    login(data.user, data.token);
    if (data.isNewUser) router.push("/taikhoan");
    else router.push("/");
  } catch (err) {
    console.error("Login error:", err);
    setError(err.message || "Lỗi đăng nhập với Google");
  } finally {
    setLoading(false);
  }
}


  function handleGoogleError() {
    setError("Lỗi khi xác thực với Google. Vui lòng thử lại.");
  }

  // Xử lý đăng nhập bằng Email/Password
  async function handleEmailLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Email hoặc mật khẩu không đúng");
      }

      const { token, user } = await res.json();
      login(user, token);
      router.push("/");
    } catch (err) {
      console.error("Email login error:", err);
      setError(err.message || "Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginFormWrapper}>
        {/* PHẦN 1: Tiêu đề */}
        <div className={styles.headerSection}>
          <h1 className={styles.mainTitle}>Chào mừng đến Beauty Shop</h1>
        </div>

        <div className={styles.loginFormContainer}>
          <div className={styles.loginForm}>
            
            {/* PHẦN 4: Form Đăng nhập Truyền thống */}
            <div className={styles.traditionalLoginSection}>
              <form onSubmit={handleEmailLogin}>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    <Mail size={16} className={styles.inputIcon} />
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    id="email"
                    className={styles.input}
                    placeholder="Nhập tên đăng nhập của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                {/* PHẦN 5: Hỗ trợ và Hành động */}
                <div className={styles.forgotPasswordWrapper}>
                  <Link href="/forgot-password" className={styles.forgotPasswordLink}>
                    <HelpCircle size={16} />
                    Quên mật khẩu?
                  </Link>
                </div>

                <button 
                  type="submit" 
                  className={styles.loginButton}
                  disabled={loading}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>
            </div>

            {/* PHẦN 3: Dấu ngăn cách */}
            <div className={styles.divider}>
              <div className={styles.dividerLine}></div>
              <span className={styles.dividerText}>HOẶC</span>
              <div className={styles.dividerLine}></div>
            </div>

            {/* PHẦN 2: Đăng nhập Nhanh (Social login) - Ở dưới */}
            <div className={styles.quickLoginSection}>
              <div className={styles.googleButtonWrapper}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="100%"
                  locale="vi"
                />
              </div>
            </div>

          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.errorMessage}>
              <p>❌ {error}</p>
            </div>
          )}
               
          {/* Loading */}
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