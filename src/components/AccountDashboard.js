import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/login.module.css';

export default function AccountDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchUserStats();
  }, [isAuthenticated, router]);

  const fetchUserStats = async () => {
    try {
      const res = await fetch("/api/account/dashboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUserStats(data);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  const menuItems = [
    {
      title: "Thông tin cá nhân",
      description: "Họ tên, ảnh đại diện, email, số điện thoại",
      icon: "👤",
      link: "/account/profile",
      color: "blue"
    },
    {
      title: "Bảo mật & mật khẩu",
      description: "Đổi mật khẩu, 2FA, quản lý phiên",
      icon: "🔐",
      link: "/account/security",
      color: "red"
    },
    {
      title: "Địa chỉ giao hàng",
      description: "Quản lý địa chỉ, chọn địa chỉ mặc định",
      icon: "📍",
      link: "/account/addresses",
      color: "green"
    },
    {
      title: "Đơn hàng",
      description: "Lịch sử đơn hàng, theo dõi vận chuyển",
      icon: "📦",
      link: "/account/orders",
      color: "purple"
    },
    {
      title: "Danh sách yêu thích",
      description: "Sản phẩm đã lưu, chuyển vào giỏ hàng",
      icon: "❤️",
      link: "/account/wishlist",
      color: "pink"
    },
    {
      title: "Bảo hành",
      description: "Mã bảo hành, trạng thái, yêu cầu mới",
      icon: "🔧",
      link: "/account/warranty",
      color: "orange"
    },
    {
      title: "Điểm tích lũy & Voucher",
      description: "Điểm, cấp độ VIP, mã voucher",
      icon: "🎁",
      link: "/account/points",
      color: "yellow"
    },
    {
      title: "Thanh toán",
      description: "Phương thức thanh toán, lịch sử",
      icon: "💳",
      link: "/account/payment",
      color: "indigo"
    },
    {
      title: "Thông báo & Hỗ trợ",
      description: "Cài đặt thông báo, chat CSKH",
      icon: "🔔",
      link: "/account/notifications",
      color: "teal"
    }
  ];

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  return (
    <div className={styles.accountContainer}>
      <div className={styles.accountHeader}>
        <div className={styles.userInfo}>
          <img 
            src={user?.anh_dai_dien || user?.avatar || "/default-avatar.png"} 
            alt="Avatar" 
            className={styles.userAvatar}
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
          <div>
            <h1 className={styles.welcomeTitle}>
              Chào mừng, {user?.ten_hien_thi || user?.HoVaTen || user?.name || "Khách hàng"}!
            </h1>
            <p className={styles.userEmail}>{user?.email || user?.Email}</p>
            {userStats && (
              <div className={styles.userStats}>
                <span>💰 Điểm tích lũy: {userStats.totalPoints || 0}</span>
                <span>📦 Đơn hàng: {userStats.totalOrders || 0}</span>
                <span>🎯 Cấp độ: {userStats.vipLevel || "Thường"}</span>
              </div>
            )}
          </div>
          {/* <button 
            onClick={handleLogout}
            className={styles.logoutButton}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🚪 Đăng xuất
          </button> */}
        </div>
      </div>

      <div className={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <Link key={index} href={item.link} className={`${styles.menuCard} ${styles[item.color]}`}>
            <div className={styles.menuIcon}>{item.icon}</div>
            <h3 className={styles.menuTitle}>{item.title}</h3>
            <p className={styles.menuDescription}>{item.description}</p>
          </Link>
        ))}
      </div>

      <div className={styles.quickActions}>
        <h2>Hành động nhanh</h2>
        <div className={styles.actionButtons}>
          <Link href="/cuahang" className={styles.actionButton}>
            🛍️ Tiếp tục mua sắm
          </Link>
          <Link href="/giohang" className={styles.actionButton}>
            🛒 Xem giỏ hàng
          </Link>
          <Link href="/timkiem" className={styles.actionButton}>
            🔍 Tìm kiếm sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
}