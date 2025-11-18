// src/pages/account/profile.js - Thông tin cá nhân
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/login.module.css";

export default function PersonalInfo() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    ten_hien_thi: "",
    email: "",
    ngay_sinh: "",
    gioi_tinh: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    // Điền dữ liệu hiện tại từ database
    if (user) {
      setFormData({
        ten_hien_thi: user.ten_hien_thi || user.name || user.HoVaTen || "",
        email: user.email || "",
        ngay_sinh: user.ngay_sinh || user.birthDate || "",
        gioi_tinh: user.gioi_tinh || user.gender || ""
      });
    }
  }, [isAuthenticated, user, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          ten_hien_thi: formData.ten_hien_thi,
          ngay_sinh: formData.ngay_sinh,
          gioi_tinh: formData.gioi_tinh
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Cập nhật thông tin trong context
        updateUser(data.data);
        setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
      } else {
        setMessage({ type: "error", text: data.message || "Cập nhật thất bại" });
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage({ type: "error", text: "Lỗi kết nối. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    const formData_upload = new FormData();
    formData_upload.append("avatar", file);

    setLoading(true);
    try {
      const res = await fetch("/api/account/avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData_upload
      });

      if (res.ok) {
        const data = await res.json();
        updateUser({ ...user, avatar: data.avatarUrl });
        setMessage({ type: "success", text: "Cập nhật ảnh đại diện thành công!" });
      } else {
        setMessage({ type: "error", text: "Cập nhật ảnh thất bại" });
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      setMessage({ type: "error", text: "Lỗi tải ảnh. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra đăng nhập bằng Google
  const isGoogleLogin = user?.provider === 'google' || user?.loginMethod === 'google';

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thông tin cá nhân</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Quản lý thông tin tài khoản của bạn</p>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Avatar Section */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <img 
                    src={user?.anh_dai_dien || user?.avatar || "/default-avatar.png"} 
                    alt="Avatar" 
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-pink-200 dark:border-pink-700"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  <div className="mt-4">
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded-lg transition-colors">
                      📷 Thay đổi ảnh
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarUpload}
                        style={{ display: 'none' }}
                        disabled={loading}
                      />
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {isGoogleLogin ? "Ảnh từ Gmail sẽ được tự động cập nhật" : "JPG, PNG hoặc GIF. Tối đa 2MB."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="ten_hien_thi" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tên hiển thị *
                      </label>
                      <input
                        type="text"
                        id="ten_hien_thi"
                        name="ten_hien_thi"
                        value={formData.ten_hien_thi}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label htmlFor="gioi_tinh" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Giới tính
                      </label>
                      <select
                        id="gioi_tinh"
                        name="gioi_tinh"
                        value={formData.gioi_tinh}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        disabled={loading}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                        <option value="Other">Khác</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                      disabled={loading || isGoogleLogin}
                    />
                    {isGoogleLogin && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        ✓ Email từ Google - không thể thay đổi
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="ngay_sinh" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        id="ngay_sinh"
                        name="ngay_sinh"
                        value={formData.ngay_sinh}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ảnh đại diện
                      </label>
                      <img 
                        src={user?.anh_dai_dien || user?.avatar || "/default-avatar.png"} 
                        alt="Avatar" 
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {isGoogleLogin ? "✓ Ảnh từ Gmail sẽ tự động cập nhật" : "Ảnh đại diện từ Gmail"}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  {message.text && (
                    <div className={`p-4 rounded-lg ${
                      message.type === 'success' 
                        ? 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700' 
                        : 'bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}