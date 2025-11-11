// src/pages/dangky.js
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/dangky.module.css";

export default function DangKy() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Kiểm tra mật khẩu khớp
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp. Vui lòng nhập lại.");
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);

    try {
      // Gửi yêu cầu đăng ký đến API backend
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Đăng ký thất bại");
      }

      const data = await res.json();

      // Thông báo thành công
      alert("Đăng ký thành công! Vui lòng đăng nhập.");

      // Chuyển hướng về trang đăng nhập
      router.push("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Lỗi khi đăng ký. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBox}>
        <h1 className={styles.title}>Tạo tài khoản</h1>
        <p className={styles.subtitle}>Điền thông tin để tạo tài khoản mới</p>

        <form onSubmit={handleSubmit} className={styles.registerForm}>
          {/* Họ và Tên */}
          <div className={styles.formGroup}>
            <label htmlFor="fullName" className={styles.label}>
              Họ và Tên
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className={styles.input}
              placeholder="Nhập họ và tên"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Mật khẩu */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Nhập lại mật khẩu */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={styles.input}
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Thông báo lỗi */}
          {error && <p className={styles.error}>❌ {error}</p>}

          {/* Nút đăng ký */}
          <button
            type="submit"
            className={styles.registerButton}
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        {/* Link đăng nhập */}
        <div className={styles.loginLink}>
          <p>
            Đã có tài khoản? <Link href="/login" className={styles.link}>Đăng nhập</Link>
          </p>
        </div>
      </div>

      <div className={styles.backLink}>
        <Link href="/" className={styles.navLink}>← Quay về trang chủ</Link>
      </div>
    </div>
  );
}
