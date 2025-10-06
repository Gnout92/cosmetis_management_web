// pages/login.js (Pages Router)
import { useState } from 'react';
import { useRouter } from 'next/router'; // Pages Router dùng next/router
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import styles from '../styles/login.module.css'; // Đổi đường dẫn nếu cần

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (res.ok) {
        const { token, user, isNewUser } = await res.json();
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect (Pages Router dùng push)
        router.push(isNewUser ? '/profile/setup' : '/account');
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    setError('Lỗi khi xác thực với Google. Vui lòng thử lại.');
  };

  if (!GOOGLE_CLIENT_ID) {
    return <div>Lỗi: Chưa cấu hình Google Client ID. Kiểm tra .env.local</div>; // Fallback để debug
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className={styles.loginContainer}>
        {/* Giữ nguyên phần còn lại như code trước */}
        <div className={styles.logoSection}>
          {/* Tạm bỏ img để tránh 404 */}
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
    </GoogleOAuthProvider>
  );
}