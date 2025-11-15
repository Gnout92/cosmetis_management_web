// src/pages/dangky.js
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/dangky.module.css";
// Import icons
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  ArrowLeft,
  UserPlus
} from 'lucide-react';

export default function DangKy() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
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

    // Kiểm tra số điện thoại
    if (!formData.phone) {
      setError("Vui lòng nhập số điện thoại.");
      return;
    }

    // Kiểm tra định dạng số điện thoại (bắt đầu bằng 0 và có 10 chữ số)
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số (ví dụ: 0981234567).");
      return;
    }

    setLoading(true);

    try {
      // Gọi API để đăng ký tài khoản
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      // Thông báo thành công
      alert(`🎉 Đăng ký thành công!\n\nMã khách hàng: ${data.data.customerId}\n- Họ tên: ${data.data.fullName}\n- SĐT: ${data.data.phone}\n- Email: ${data.data.email}\n\nVui lòng đăng nhập để tiếp tục.`);

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

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
        <h1 className={styles.title}>Tạo tài khoản mới</h1>
        <p className={styles.subtitle}>Tham gia cộng đồng Beauty Shop</p>

        <form onSubmit={handleSubmit} className={styles.registerForm}>
          {/* Họ và Tên */}
          <div className={styles.formGroup}>
            <label htmlFor="fullName" className={styles.label}>
              <User size={16} className={styles.inputIcon} />
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

          {/* Số điện thoại */}
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              <Phone size={16} className={styles.inputIcon} />
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={styles.input}
              placeholder="Nhập số điện thoại (ví dụ: 0981234567)"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={loading}
              pattern="0[0-9]{9}"
              title="Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số"
            />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              <Mail size={16} className={styles.inputIcon} />
              Tên đăng ký
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              placeholder="Nhập tên đăng ký của bạn"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Mật khẩu */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              <Lock size={16} className={styles.inputIcon} />
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
              <Lock size={16} className={styles.inputIcon} />
              Xác nhận mật khẩu
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
            Đã có tài khoản? <Link href="/login" className={styles.link}><UserPlus size={16} />Đăng nhập</Link>
          </p>
        </div>
      </div>

      <div className={styles.backLink}>
        <Link href="/" className={styles.navLink}>← Quay về trang chủ</Link>
      </div>
    </div>
  );
}
