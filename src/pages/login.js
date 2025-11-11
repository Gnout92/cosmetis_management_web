// src/pages/login.js
import { useState } from "react";
import { useRouter } from "next/router"; 
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import styles from "../styles/login.module.css";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // State cho đăng nhập nội bộ (Admin/User)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Xử lý đăng nhập bằng Google (Khách hàng)
  async function handleGoogleSuccess(credentialResponse) {
    setLoading(true);
    setError(null);
    try {
      // Gửi token Google ID lên API backend để xác thực và/hoặc tạo user
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

      // Sử dụng hàm login() từ context
      login(user, token);

      // Điều hướng: Khách hàng đến trang chủ
      router.push(isNewUser ? "/" : "/");
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

  // Xử lý đăng nhập nội bộ (Admin/User)
  async function handleInternalLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Gửi yêu cầu đăng nhập nội bộ
      const res = await fetch("/api/auth/internal-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Tên đăng nhập hoặc mật khẩu không đúng");
      }

      const { token, user } = await res.json();

      // Sử dụng hàm login() từ context
      login(user, token);

      // Điều hướng theo quyền
      if (user.role === "Admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "User") {
        router.push("/staff/orders");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Internal login error:", err);
      setError(err.message || "Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoSection}>
        <h1 className={styles.title}>Chào mừng bạn đã đến Shop Kaka</h1>
        <p className={styles.subtitle}>Thương hiệu số 1 Việt Nam</p>
      </div>

      <div className={styles.loginBox}>
        {/* Khu vực đăng nhập nội bộ (Admin/User) */}
        <div className={styles.internalLoginSection}>
          <h2 className={styles.sectionTitle}>Đăng nhập Shop KaKa</h2>
          <form onSubmit={handleInternalLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                className={styles.input}
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Mật khẩu</label>
              <input
                type="password"
                id="password"
                className={styles.input}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <div className={styles.forgotPassword}>
              <Link href="/forgot-password" className={styles.link}>
                Quên mật khẩu?
              </Link>
            </div>
          </form>
        </div>

        {/* Phân cách */}
        <div className={styles.divider}>
          <span className={styles.dividerText}>hoặc</span>
        </div>

        {/* Khu vực đăng nhập bằng Google (Khách hàng) */}
        <div className={styles.googleLoginSection}>
          
          <div className={styles.googleButtonWrapper}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              width="300"
              locale="vi"
            />
          </div>
        </div>

        {/* Thông báo lỗi */}
        {error && <p className={styles.error}>❌ {error}</p>}
        {loading && <p className={styles.loading}>Đang xác thực... Vui lòng chờ</p>}

        {/* Link đăng ký */}
        <div className={styles.registerLink}>
          <p>
            Chưa có tài khoản? <Link href="/dangky" className={styles.link}>Đăng ký ngay</Link>
          </p>
        </div>
      </div>

      <div className={styles.backLink}>
        <Link href="/" className={styles.navLink}>← Quay về trang chủ</Link>
      </div>
    </div>
  );
}
