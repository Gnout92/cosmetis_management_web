import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';


export default function LoginPage({ onLogin }) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  // Mock user data for demo
  const mockUsers = [
    {
      email: 'admin@mencare.com',
      password: 'admin123',
      name: 'Quản trị viên',
      role: 'admin',
      avatar: '/images/avatar-admin.jpg'
    },
    {
      email: 'manager@mencare.com',
      password: 'manager123',
      name: 'Trưởng phòng',
      role: 'manager',
      avatar: '/images/avatar-manager.jpg'
    },
    {
      email: 'staff@mencare.com',
      password: 'staff123',
      name: 'Nhân viên',
      role: 'staff',
      avatar: '/images/avatar-staff.jpg'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Registration specific validation
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Họ tên không được để trống';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu không khớp';
      }

      if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (isLogin) {
        // Login logic
        const user = mockUsers.find(u => 
          u.email === formData.email && u.password === formData.password
        );

        if (user) {
          // Save to localStorage if remember me is checked
          if (rememberMe && typeof window !== 'undefined') {
            localStorage.setItem('rememberMe', 'true');
          }

          // Call login function from _app.js
          onLogin(user);

          // Redirect to dashboard
          router.push('/');
        } else {
          setErrors({ 
            general: 'Email hoặc mật khẩu không chính xác' 
          });
        }
      } else {
        // Registration logic
        const newUser = {
          id: Date.now(),
          email: formData.email,
          name: formData.name,
          role: 'staff',
          avatar: '/images/avatar-default.jpg'
        };

        onLogin(newUser);
        router.push('/');
      }
    } catch (error) {
      setErrors({ 
        general: 'Có lỗi xảy ra. Vui lòng thử lại.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (userType) => {
    const user = mockUsers.find(u => u.role === userType);
    if (user) {
      setFormData({
        ...formData,
        email: user.email,
        password: user.password
      });
    }
  };

  return (
    <>
      <Head>
        <title>{isLogin ? 'Đăng nhập' : 'Đăng ký'} - MenCare Dashboard</title>
      </Head>

      <div className="loginContainer">
        {/* Background particles */}
        <div className="particlesBg">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="loginWrapper">
          {/* Left side - Login Form */}
          <div className="loginForm">
            <div className="formContainer">
              {/* Logo Section */}
              <div className="logoSection">
                <div className="logo">
                  <div className="logoIcon">
                    <i className="fas fa-spa"></i>
                  </div>
                  <div className="logoText">
                    <h1>haha</h1>
                    <span>luxugi</span>
                  </div>
                </div>
              </div>

              {/* Form Header */}
              <div className="formHeader">
                <h2>{isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}</h2>
                <p>
                  {isLogin 
                    ? 'Đăng nhập để truy cập bảng điều khiển quản lý' 
                    : 'Điền thông tin để tạo tài khoản quản lý mới'
                  }
                </p>
              </div>

              

              {/* Error Message */}
              {errors.general && (
                <div className="errorMessage">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>{errors.general}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="form">
                {/* Name field (only for registration) */}
                {!isLogin && (
                  <div className="formGroup">
                    <label htmlFor="name">Họ và tên</label>
                    <div className="inputWrapper">
                      <i className="fas fa-user"></i>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Nhập họ và tên đầy đủ"
                        className={errors.name ? 'error' : ''}
                      />
                    </div>
                    {errors.name && <span className="errorText">{errors.name}</span>}
                  </div>
                )}

                {/* Email field */}
                <div className="formGroup">
                  <label htmlFor="email">Địa chỉ Email</label>
                  <div className="inputWrapper">
                    <i className="fas fa-envelope"></i>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@mencare.com"
                      className={errors.email ? 'error' : ''}
                    />
                  </div>
                  {errors.email && <span className="errorText">{errors.email}</span>}
                </div>

                {/* Phone field (only for registration) */}
                {!isLogin && (
                  <div className="formGroup">
                    <label htmlFor="phone">Số điện thoại (tùy chọn)</label>
                    <div className="inputWrapper">
                      <i className="fas fa-phone"></i>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0987654321"
                        className={errors.phone ? 'error' : ''}
                      />
                    </div>
                    {errors.phone && <span className="errorText">{errors.phone}</span>}
                  </div>
                )}

                {/* Password field */}
                <div className="formGroup">
                  <label htmlFor="password">Mật khẩu</label>
                  <div className="inputWrapper">
                    <i className="fas fa-lock"></i>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className={errors.password ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="togglePassword"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                    </button>
                  </div>
                  {errors.password && <span className="errorText">{errors.password}</span>}
                </div>

                {/* Confirm Password field (only for registration) */}
                {!isLogin && (
                  <div className="formGroup">
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                    <div className="inputWrapper">
                      <i className="fas fa-lock"></i>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={errors.confirmPassword ? 'error' : ''}
                      />
                    </div>
                    {errors.confirmPassword && <span className="errorText">{errors.confirmPassword}</span>}
                  </div>
                )}

                {/* Form Options (only for login) */}
                {isLogin && (
                  <div className="formOptions">
                    <label className="checkboxLabel">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      Ghi nhớ đăng nhập
                    </label>
                    <a href="#" className="forgotPassword">
                      <i className="fas fa-question-circle"></i>
                      Quên mật khẩu?
                    </a>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className={`submitButton ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <i className={isLogin ? 'fas fa-sign-in-alt' : 'fas fa-user-plus'}></i>
                      <span>{isLogin ? 'Đăng nhập ngay' : 'Tạo tài khoản'}</span>
                    </>
                  )}
                </button>

                {/* Toggle Form */}
                <div className="toggleForm">
                  <p>
                    {isLogin ? 'Chưa có tài khoản quản lý?' : 'Đã có tài khoản?'}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setFormData({
                          email: '',
                          password: '',
                          confirmPassword: '',
                          name: '',
                          phone: ''
                        });
                        setErrors({});
                      }}
                      className="toggleButton"
                    >
                      {isLogin ? 'Đăng ký tại đây' : 'Đăng nhập tại đây'}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>

          
        </div>

        {/* Styles với màu sắc hài hòa */}
        <style jsx>{`
          .loginContainer {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            padding: 20px;
            position: relative;
            overflow: hidden;
          }

          .particlesBg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
          }

          .particle {
            position: absolute;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
          }

          .particle:nth-child(1) {
            width: 80px;
            height: 80px;
            top: 10%;
            left: 10%;
            animation-delay: 0s;
          }

          .particle:nth-child(2) {
            width: 60px;
            height: 60px;
            top: 70%;
            left: 80%;
            animation-delay: -2s;
          }

          .particle:nth-child(3) {
            width: 100px;
            height: 100px;
            top: 30%;
            left: 70%;
            animation-delay: -4s;
          }

          .particle:nth-child(4) {
            width: 40px;
            height: 40px;
            top: 80%;
            left: 20%;
            animation-delay: -1s;
          }

          .particle:nth-child(5) {
            width: 120px;
            height: 120px;
            top: 50%;
            left: 5%;
            animation-delay: -3s;
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
              opacity: 0.1;
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
              opacity: 0.3;
            }
          }

          .loginWrapper {
            display: flex;
            width: 100%;
            max-width: 1000px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            box-shadow: 
              0 20px 40px rgba(0, 0, 0, 0.1),
              0 0 0 1px rgba(255, 255, 255, 0.2);
            overflow: hidden;
            min-height: 650px;
            position: relative;
            z-index: 1;
          }

          .loginForm {
            flex: 1;
            padding: 50px 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
          }

          .formContainer {
            width: 100%;
            max-width: 400px;
            animation: slideInLeft 0.8s ease-out;
          }

          .logoSection {
            text-align: center;
            margin-bottom: 40px;
          }

          .logo {
            display: inline-flex;
            align-items: center;
            gap: 16px;
          }

          .logoIcon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%);
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            color: white;
            box-shadow: 
              0 10px 25px rgba(79, 70, 229, 0.3),
              0 0 0 1px rgba(255, 255, 255, 0.1);
          }

          .logoText h1 {
            color: #1e293b;
            font-size: 32px;
            font-weight: 800;
            margin: 0;
            background: linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .logoText span {
            color: #64748b;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
          }

          .formHeader {
            text-align: center;
            margin-bottom: 32px;
          }

          .formHeader h2 {
            color: #1e293b;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 12px;
            line-height: 1.2;
          }

          .formHeader p {
            color: #64748b;
            font-size: 15px;
            line-height: 1.5;
            max-width: 320px;
            margin: 0 auto;
          }

          .demoAccounts {
            margin-bottom: 28px;
            padding: 24px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            position: relative;
            overflow: hidden;
          }

          .demoAccounts::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #4f46e5, #7c3aed, #ec4899, #f59e0b);
          }

          .demoAccounts p {
            color: #374151;
            font-size: 14px;
            margin-bottom: 18px;
            text-align: center;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .demoAccounts p i {
            color: #7c3aed;
          }

          .demoButtons {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
          }

          .demoBtn {
            padding: 12px 18px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .demoBtn.admin {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
          }

          .demoBtn.manager {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
          }

          .demoBtn.staff {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
          }

          .demoBtn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }

          .errorMessage {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            color: #dc2626;
            padding: 16px 20px;
            border-radius: 12px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            border: 1px solid #fecaca;
            font-weight: 500;
          }

          .form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .formGroup {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .formGroup label {
            color: #374151;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .inputWrapper {
            position: relative;
            display: flex;
            align-items: center;
          }

          .inputWrapper i {
            position: absolute;
            left: 18px;
            color: #9ca3af;
            font-size: 16px;
            z-index: 1;
          }

          .inputWrapper input {
            width: 100%;
            padding: 16px 16px 16px 50px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.8);
            font-size: 15px;
            transition: all 0.3s ease;
            font-weight: 500;
            backdrop-filter: blur(10px);
          }

          .inputWrapper input:focus {
            border-color: #7c3aed;
            box-shadow: 
              0 0 0 4px rgba(124, 58, 237, 0.1),
              0 4px 20px rgba(0, 0, 0, 0.05);
            outline: none;
            background: rgba(255, 255, 255, 0.95);
          }

          .inputWrapper input.error {
            border-color: #ef4444;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
          }

          .togglePassword {
            position: absolute;
            right: 18px;
            color: #9ca3af;
            font-size: 16px;
            background: none;
            border: none;
            cursor: pointer;
            z-index: 1;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.3s ease;
          }

          .togglePassword:hover {
            color: #7c3aed;
            background: rgba(124, 58, 237, 0.1);
          }

          .errorText {
            color: #ef4444;
            font-size: 13px;
            font-weight: 500;
            margin-top: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .errorText::before {
            content: '⚠️';
            font-size: 12px;
          }

          .formOptions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
            margin-top: 8px;
          }

          .checkboxLabel {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            font-size: 14px;
            color: #374151;
            font-weight: 500;
            position: relative;
          }

          .checkboxLabel input[type="checkbox"] {
            opacity: 0;
            position: absolute;
          }

          .checkmark {
            width: 20px;
            height: 20px;
            background: #ffffff;
            border: 2px solid #d1d5db;
            border-radius: 6px;
            position: relative;
            transition: all 0.3s ease;
          }

          .checkboxLabel input[type="checkbox"]:checked + .checkmark {
            background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
            border-color: #7c3aed;
          }

          .checkboxLabel input[type="checkbox"]:checked + .checkmark::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 12px;
            font-weight: bold;
          }

          .forgotPassword {
            color: #7c3aed;
            font-size: 14px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .forgotPassword:hover {
            color: #5b21b6;
            text-decoration: underline;
          }

          .submitButton {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
            color: #ffffff;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3);
            position: relative;
            overflow: hidden;
            margin-top: 8px;
          }

          .submitButton::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.6s ease;
          }

          .submitButton:hover::before {
            left: 100%;
          }

          .submitButton:hover {
            background: linear-gradient(135deg, #6d28d9 0%, #db2777 100%);
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(124, 58, 237, 0.4);
          }

          .submitButton:disabled {
            background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
            cursor: not-allowed;
            transform: none;
            box-shadow: 0 4px 15px rgba(156, 163, 175, 0.3);
          }

          .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid #ffffff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .toggleForm {
            text-align: center;
            margin-top: 24px;
          }

          .toggleForm p {
            color: #64748b;
            font-size: 14px;
            margin: 0;
            line-height: 1.5;
          }

          .toggleButton {
            color: #7c3aed;
            font-weight: 700;
            background: none;
            border: none;
            cursor: pointer;
            margin-left: 6px;
            transition: all 0.3s ease;
            text-decoration: underline;
            text-decoration-color: transparent;
          }

          .toggleButton:hover {
            color: #5b21b6;
            text-decoration-color: #5b21b6;
          }

          .loginHero {
            flex: 1;
            position: relative;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }

          .heroOverlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(1px);
          }

          .heroContent {
            padding: 50px 40px;
            color: white;
            text-align: center;
            position: relative;
            z-index: 2;
            animation: slideInRight 0.8s ease-out;
            max-width: 400px;
          }

          .heroIcon {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            margin: 0 auto 32px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .heroText h2 {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 16px;
            line-height: 1.2;
          }

          .heroText p {
            font-size: 16px;
            line-height: 1.6;
            opacity: 0.9;
            margin-bottom: 40px;
          }

          .heroFeatures {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 40px;
          }

          .featureItem {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            text-align: left;
          }

          .featureIcon {
            width: 48px;
            height: 48px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
          }

          .featureText h4 {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 4px;
          }

          .featureText p {
            font-size: 13px;
            opacity: 0.8;
            margin: 0;
          }

          .heroStats {
            display: flex;
            justify-content: center;
            gap: 32px;
            flex-wrap: wrap;
          }

          .statItem {
            text-align: center;
          }

          .statNumber {
            font-size: 28px;
            font-weight: 800;
            margin-bottom: 4px;
            background: linear-gradient(135deg, #ffffff 0%, #fbbf24 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .statLabel {
            font-size: 12px;
            opacity: 0.8;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-40px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(40px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @media (max-width: 768px) {
            .loginContainer {
              padding: 15px;
            }

            .loginWrapper {
              flex-direction: column;
              max-width: 450px;
            }

            .loginForm {
              padding: 40px 30px;
            }

            .loginHero {
              min-height: 250px;
            }

            .heroContent {
              padding: 30px 20px;
            }

            .heroText h2 {
              font-size: 24px;
            }

            .heroText p {
              font-size: 14px;
            }

            .heroFeatures {
              gap: 16px;
            }

            .featureItem {
              padding: 12px;
            }

            .heroStats {
              gap: 20px;
            }

            .demoButtons {
              justify-content: center;
            }

            .demoBtn {
              flex: 1;
              min-width: 100px;
            }

            .formOptions {
              flex-direction: column;
              align-items: stretch;
              gap: 12px;
            }

            .checkboxLabel {
              justify-content: center;
            }

            .forgotPassword {
              text-align: center;
            }
          }
        `}</style>
      </div>
    </>
  );
}