// src/pages/taikhoan.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/taikhoan.module.css";
import { 
  User, 
  Mail, 
  Phone, 
  Edit2, 
  Save, 
  X, 
  LogOut,
  Settings,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function TaiKhoan() {
  const router = useRouter();
  const { authUser, isAuthenticated, logout, token } = useAuth();
  
  // State quản lý thông tin tài khoản
  const [userInfo, setUserInfo] = useState({
    id: authUser?.id || "",
    ten_dang_nhap: authUser?.ten_dang_nhap || authUser?.name || "",
    ten_hien_thi: authUser?.ten_hien_thi || authUser?.name || "",
    email: authUser?.email || "",
    so_dien_thoai: authUser?.so_dien_thoai || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editForm, setEditForm] = useState(userInfo);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // Kiểm tra đăng nhập và token
  useEffect(() => {
    console.log("🔍 Auth Check:", { authUser, isAuthenticated, token });
    
    // Check localStorage token
    const localToken = localStorage.getItem("authToken") || localStorage.getItem("token");
    console.log("💾 Local token check:", localToken ? "EXISTS" : "MISSING");
    
    // Check if we have user info
    if (!authUser && !localToken) {
      console.log("❌ No authUser and no token - redirect to login");
      router.push("/login");
      return;
    }
    
    if (!authUser && localToken) {
      console.log("⚠️ No authUser but have token - attempting to restore session");
      // Try to restore user from localStorage
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("🔄 Restored user from localStorage:", parsedUser);
          setUserInfo({
            id: parsedUser?.id || "",
            ten_dang_nhap: parsedUser?.ten_dang_nhap || parsedUser?.name || "",
            ten_hien_thi: parsedUser?.ten_hien_thi || parsedUser?.name || "",
            email: parsedUser?.email || "",
            so_dien_thoai: parsedUser?.so_dien_thoai || "",
          });
          setEditForm({
            id: parsedUser?.id || "",
            ten_dang_nhap: parsedUser?.ten_dang_nhap || parsedUser?.name || "",
            ten_hien_thi: parsedUser?.ten_hien_thi || parsedUser?.name || "",
            email: parsedUser?.email || "",
            so_dien_thoai: parsedUser?.so_dien_thoai || "",
          });
        }
      } catch (e) {
        console.error("❌ Error parsing stored user:", e);
      }
    }
    
    if (authUser) {
      console.log("✅ authUser found, fetching profile");
      fetchUserProfile();
    }
    
    setAuthCheckComplete(true);
  }, [authUser, router, token]);

  // Lấy thông tin profile từ database
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError("");
      
      const authToken = localStorage.getItem("authToken") || localStorage.getItem("token");
      console.log("🔑 Using token for API call:", authToken ? "TOKEN EXISTS" : "NO TOKEN");
      
      if (!authToken) {
        console.log("❌ No auth token available");
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      const res = await fetch("/api/auth/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json"
        }
      });

      console.log("📡 Profile API response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("✅ Profile fetched successfully:", data);
        setUserInfo(data);
        setEditForm(data);
      } else if (res.status === 401) {
        console.log("🔄 Token invalid - redirecting to login");
        setError("Phiên đăng nhập đã hết hạn. Đang chuyển đến trang đăng nhập...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const errData = await res.json().catch(() => ({}));
        console.log("❌ Profile fetch error:", errData);
        setError(errData.message || "Không thể tải thông tin tài khoản");
      }
    } catch (err) {
      console.error("💥 Network error:", err);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi form chỉnh sửa
  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Lưu thông tin tài khoản
  const handleSaveProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const authToken = localStorage.getItem("authToken") || localStorage.getItem("token");
      
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
          ten_dang_nhap: editForm.ten_dang_nhap,
          ten_hien_thi: editForm.ten_hien_thi,
          so_dien_thoai: editForm.so_dien_thoai
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Cập nhật thất bại");
      }

      // Cập nhật thông tin local
      setUserInfo(editForm);
      setSuccess("Cập nhật thông tin thành công!");
      setIsEditing(false);
      
      // Cập nhật context nếu cần
      if (authUser && typeof authUser === 'object') {
        authUser.ten_hien_thi = editForm.ten_hien_thi;
      }
      
    } catch (err) {
      console.error("❌ Update profile error:", err);
      setError(err.message || "Có lỗi xảy ra khi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditForm(userInfo);
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  // Đăng xuất
  const handleLogout = async () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
      try {
        logout();
        router.push("/login");
      } catch (err) {
        console.error("Logout error:", err);
        router.push("/login");
      }
    }
  };

  // Thử lại tải profile
  const handleRetryLoad = () => {
    fetchUserProfile();
  };

  // Hiển thị khi đang kiểm tra xác thực
  if (!authCheckComplete) {
    return (
      <div className={styles.loadingContainer}>
        <RefreshCw className="animate-spin" size={32} />
        <p>Đang kiểm tra thông tin đăng nhập...</p>
      </div>
    );
  }

  // Hiển thị khi không có user và không có token
  if (!authUser && !localStorage.getItem("authToken") && !localStorage.getItem("token")) {
    return (
      <div className={styles.loadingContainer}>
        <AlertCircle size={32} color="orange" />
        <p>Chưa đăng nhập. Đang chuyển đến trang đăng nhập...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.accountContainer}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Tài khoản của tôi</h1>
          <p className={styles.subtitle}>
            Quản lý thông tin tài khoản và cài đặt bảo mật
          </p>
        </div>

        <div className={styles.content}>
          {/* Thông báo lỗi */}
          {error && (
            <div className={styles.errorMessage}>
              <AlertCircle size={16} />
              <span>{error}</span>
              {error.includes("hết hạn") && (
                <button 
                  onClick={handleRetryLoad} 
                  className={styles.retryButton}
                  disabled={loading}
                >
                  <RefreshCw size={14} />
                  Thử lại
                </button>
              )}
            </div>
          )}

          {/* Thông báo thành công */}
          {success && (
            <div className={styles.successMessage}>
              <span>{success}</span>
            </div>
          )}

          {/* Thông tin cá nhân */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <User className={styles.sectionIcon} size={20} />
              <h2>Thông tin cá nhân</h2>
            </div>

            <div className={styles.profileCard}>
              {/* Tên đăng nhập */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <User size={16} className={styles.inputIcon} />
                  Tên đăng nhập
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    value={isEditing ? editForm.ten_dang_nhap : userInfo.ten_dang_nhap}
                    onChange={(e) => handleInputChange("ten_dang_nhap", e.target.value)}
                    disabled={!isEditing}
                    className={isEditing ? styles.editableInput : styles.readOnlyInput}
                    placeholder="Nhập tên đăng nhập của bạn"
                  />
                  {isEditing && (
                    <button
                      onClick={() => handleInputChange("ten_dang_nhap", "")}
                      className={styles.clearButton}
                      type="button"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <span className={styles.usernameNote}>
                  Tên đăng nhập dùng để truy cập tài khoản
                </span>
              </div>

              {/* Tên hiển thị */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <User size={16} className={styles.inputIcon} />
                  Tên hiển thị
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    value={isEditing ? editForm.ten_hien_thi : userInfo.ten_hien_thi}
                    onChange={(e) => handleInputChange("ten_hien_thi", e.target.value)}
                    disabled={!isEditing}
                    className={isEditing ? styles.editableInput : styles.readOnlyInput}
                    placeholder="Nhập tên hiển thị của bạn"
                  />
                  {isEditing && (
                    <button
                      onClick={() => handleInputChange("ten_hien_thi", "")}
                      className={styles.clearButton}
                      type="button"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <span className={styles.displayNameNote}>
                  Tên hiển thị sẽ xuất hiện khi bạn đặt hàng hoặc đánh giá
                </span>
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Mail size={16} className={styles.inputIcon} />
                  Email
                </label>
                <input
                  type="email"
                  value={userInfo.email}
                  disabled={true}
                  className={styles.readOnlyInput}
                  placeholder="Email không thể thay đổi"
                />
                <span className={styles.fieldNote}>
                  Email không thể thay đổi sau khi đăng ký
                </span>
              </div>

              {/* Số điện thoại */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Phone size={16} className={styles.inputIcon} />
                  Số điện thoại
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="tel"
                    value={isEditing ? editForm.so_dien_thoai : userInfo.so_dien_thoai}
                    onChange={(e) => handleInputChange("so_dien_thoai", e.target.value)}
                    disabled={!isEditing}
                    className={isEditing ? styles.editableInput : styles.readOnlyInput}
                    placeholder="Nhập số điện thoại của bạn"
                  />
                  {isEditing && (
                    <button
                      onClick={() => handleInputChange("so_dien_thoai", "")}
                      className={styles.clearButton}
                      type="button"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Nút hành động */}
              <div className={styles.buttonGroup}>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={styles.editButton}
                    disabled={loading}
                  >
                    <Edit2 size={16} />
                    Chỉnh sửa thông tin
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className={styles.saveButton}
                      disabled={loading}
                    >
                      <Save size={16} />
                      {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className={styles.cancelButton}
                      disabled={loading}
                    >
                      <X size={16} />
                      Hủy
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Cài đặt bảo mật */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Settings className={styles.sectionIcon} size={20} />
              <h2>Cài đặt tài khoản</h2>
            </div>

            <div className={styles.securityCard}>
              <div className={styles.securityInfo}>
                <h3>Bảo mật tài khoản</h3>
                <p>Tài khoản của bạn được bảo vệ bởi xác thực Gmail</p>
              </div>
              
              <div className={styles.logoutSection}>
                <button
                  onClick={handleLogout}
                  className={styles.logoutButton}
                  disabled={loading}
                >
                  <LogOut size={16} />
                  Đăng xuất tài khoản
                </button>
                <p className={styles.logoutDescription}>
                  Đăng xuất khỏi tài khoản và quay lại trang đăng nhập
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}