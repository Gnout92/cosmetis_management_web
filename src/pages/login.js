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

  async function handleSuccess(credentialResponse) {
    setLoading(true);
    setError(null);
    try {
      // Gửi token Google ID lên API backend của bạn để xác thực và/hoặc tạo user
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

      // <-- thay vì tự set localStorage, dùng hàm login() từ context
      login(user, token);

      // Điều hướng sau login
      router.push(isNewUser ? "/profile/setup" : "/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  }

  function handleError() {
    setError("Lỗi khi xác thực với Google. Vui lòng thử lại.");
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoSection}>
        <h1 className={styles.title}>Chào mừng bạn đến với cửa hàng mỹ phẩm</h1>
        <p className={styles.subtitle}>Đăng nhập để mua sắm và nhận tư vấn cá nhân hóa</p>
      </div>

      <div className={styles.loginButtonSection}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          width="300"
          locale="vi"
        />

        {loading && <p className={styles.loading}>Đang xác thực... Vui lòng chờ</p>}
        {error && <p className={styles.error}>❌ {error}</p>}
      </div>

      <div className={styles.footerLinks}>
        <Link href="/privacy" className={styles.link}>Chính sách bảo mật</Link>
        <span className={styles.separator}> | </span>
        <Link href="/terms" className={styles.link}>Điều khoản sử dụng</Link>
      </div>

      <div className={styles.backLink}>
        <Link href="/" className={styles.navLink}>← Quay về trang chủ</Link>
      </div>
    </div>
  );
}
