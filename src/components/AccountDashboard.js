import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PersonalInfo from './account/PersonalInfo';
import AddressManagement from './account/AddressManagement';
import OrderHistory from './account/OrderHistory';
import PaymentMethods from './account/PaymentMethods';
import Wishlist from './account/Wishlist';
import Notifications from './account/Notifications';
import SecuritySettings from './account/SecuritySettings';
import LoyaltyProgram from './account/LoyaltyProgram';
import styles from '../styles/login.module.css';

export default function AccountDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
            src={user?.avatar || "/default-avatar.png"} 
            alt="Avatar" 
            className={styles.userAvatar}
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
          <div>
            <h1 className={styles.welcomeTitle}>
              Chào mừng, {user?.HoVaTen || "Khách hàng"}!
            </h1>
            <p className={styles.userEmail}>{user?.Email}</p>
            {userStats && (
              <div className={styles.userStats}>
                <span>💰 Điểm tích lũy: {userStats.totalPoints || 0}</span>
                <span>📦 Đơn hàng: {userStats.totalOrders || 0}</span>
                <span>🎯 Cấp độ: {userStats.vipLevel || "Thường"}</span>
              </div>
            )}
          </div>
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