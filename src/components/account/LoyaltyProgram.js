import { useState, useEffect } from 'react';
import styles from '../../styles/login.module.css';

const LoyaltyProgram = ({ user, updateUser, showNotification }) => {
  const [loyaltyData, setLoyaltyData] = useState({
    currentPoints: user?.loyaltyPoints || 0,
    totalEarned: 0,
    totalSpent: 0,
    tier: 'Bronze',
    nextTier: 'Silver',
    pointsToNextTier: 0,
    benefits: []
  });
  const [pointsHistory, setPointsHistory] = useState([]);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [rewardCatalog, setRewardCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, history, coupons, rewards

  useEffect(() => {
    // Giả lập tải dữ liệu chương trình thành viên
    const loadLoyaltyData = async () => {
      setIsLoading(true);
      try {
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dữ liệu giả lập - thông tin thành viên
        const mockLoyaltyData = {
          currentPoints: user?.loyaltyPoints || 1250,
          totalEarned: 3500,
          totalSpent: 2250,
          tier: 'Silver',
          nextTier: 'Gold',
          pointsToNextTier: 750,
          benefits: [
            'Giảm giá 5% cho tất cả đơn hàng',
            'Miễn phí vận chuyển cho đơn > 500k',
            'Quà tặng sinh nhật đặc biệt',
            'ƪu tiên mua sản phẩm mới'
          ]
        };

        // Dữ liệu giả lập - lịch sử điểm
        const mockPointsHistory = [
          {
            id: 'points_1',
            type: 'earned',
            points: 150,
            description: 'Mua hàng đơn #ORD003',
            date: '2024-01-25T14:30:00Z',
            orderId: 'ORD003'
          },
          {
            id: 'points_2',
            type: 'spent',
            points: -100,
            description: 'Đổi quà - Mặt nạ mini',
            date: '2024-01-20T10:15:00Z',
            reward: 'Mask Mini Set'
          },
          {
            id: 'points_3',
            type: 'earned',
            points: 200,
            description: 'Mua hàng đơn #ORD002',
            date: '2024-01-18T16:45:00Z',
            orderId: 'ORD002'
          },
          {
            id: 'points_4',
            type: 'earned',
            points: 50,
            description: 'Đánh giá sản phẩm',
            date: '2024-01-15T09:20:00Z',
            action: 'review'
          },
          {
            id: 'points_5',
            type: 'bonus',
            points: 500,
            description: 'Thưởng thành viên Silver',
            date: '2024-01-10T08:00:00Z'
          }
        ];

        // Dữ liệu giả lập - coupon có sẵn
        const mockCoupons = [
          {
            id: 'coupon_1',
            code: 'KAKA15',
            title: 'Giảm 15% toàn bộ đơn hàng',
            description: 'Áp dụng cho đơn hàng từ 300k',
            discount: 15,
            discountType: 'percentage',
            minOrder: 300000,
            maxDiscount: 100000,
            expiryDate: '2024-02-29T23:59:59Z',
            isUsed: false,
            earnedDate: '2024-01-20T10:00:00Z'
          },
          {
            id: 'coupon_2',
            code: 'FREESHIP50',
            title: 'Miễn phí vận chuyển',
            description: 'Áp dụng cho đơn hàng từ 200k',
            discount: 50000,
            discountType: 'fixed',
            minOrder: 200000,
            maxDiscount: 50000,
            expiryDate: '2024-01-31T23:59:59Z',
            isUsed: false,
            earnedDate: '2024-01-15T08:00:00Z'
          },
          {
            id: 'coupon_3',
            code: 'BIRTHDAY20',
            title: 'Quà sinh nhật - Giảm 20%',
            description: 'Quà sinh nhật đặc biệt',
            discount: 20,
            discountType: 'percentage',
            minOrder: 0,
            maxDiscount: 200000,
            expiryDate: '2024-03-15T23:59:59Z',
            isUsed: true,
            earnedDate: '2024-01-01T00:00:00Z',
            usedDate: '2024-01-10T14:30:00Z'
          }
        ];

        // Dữ liệu giả lập - danh mục quà tặng
        const mockRewards = [
          {
            id: 'reward_1',
            name: 'Mặt nạ giấy Collagen Mini (5 miếng)',
            image: '/placeholder-reward.jpg',
            pointsCost: 200,
            originalPrice: 150000,
            category: 'skincare',
            inStock: true,
            description: 'Set 5 miếng mặt nạ giấy collagen cao cấp'
          },
          {
            id: 'reward_2',
            name: 'Son dưỡng môi KaKa Honey',
            image: '/placeholder-reward.jpg',
            pointsCost: 300,
            originalPrice: 250000,
            category: 'makeup',
            inStock: true,
            description: 'Son dưỡng môi với tinh chất mật ong tự nhiên'
          },
          {
            id: 'reward_3',
            name: 'Voucher 100k',
            image: '/placeholder-voucher.jpg',
            pointsCost: 500,
            originalPrice: 100000,
            category: 'voucher',
            inStock: true,
            description: 'Phiếu mua hàng trị giá 100,000đ'
          },
          {
            id: 'reward_4',
            name: 'Bộ sản phẩm dưỡng da Travel Size',
            image: '/placeholder-reward.jpg',
            pointsCost: 800,
            originalPrice: 500000,
            category: 'skincare',
            inStock: false,
            description: 'Bộ sản phẩm dưỡng da kích thước du lịch'
          },
          {
            id: 'reward_5',
            name: 'Voucher 500k',
            image: '/placeholder-voucher.jpg',
            pointsCost: 2000,
            originalPrice: 500000,
            category: 'voucher',
            inStock: true,
            description: 'Phiếu mua hàng trị giá 500,000đ'
          }
        ];

        setLoyaltyData(mockLoyaltyData);
        setPointsHistory(mockPointsHistory);
        setAvailableCoupons(mockCoupons);
        setRewardCatalog(mockRewards);
      } catch (error) {
        showNotification('Không thể tải thông tin chương trình thành viên', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadLoyaltyData();
  }, [user]);

  const getTierInfo = (tier) => {
    const tiers = {
      Bronze: { color: '#CD7F32', icon: '🥉', minPoints: 0 },
      Silver: { color: '#C0C0C0', icon: '🥈', minPoints: 1000 },
      Gold: { color: '#FFD700', icon: '🥇', minPoints: 2000 },
      Platinum: { color: '#E5E4E2', icon: '💎', minPoints: 5000 }
    };
    return tiers[tier] || tiers.Bronze;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  const handleRedeemReward = async (reward) => {
    if (loyaltyData.currentPoints < reward.pointsCost) {
      showNotification('Bạn không đủ điểm để đổi quà này', 'warning');
      return;
    }

    if (!reward.inStock) {
      showNotification('Quà tặng đang hết hàng', 'warning');
      return;
    }

    if (window.confirm(`Bạn có chắc muốn đổi "${reward.name}" với ${reward.pointsCost} điểm?`)) {
      try {
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newPoints = loyaltyData.currentPoints - reward.pointsCost;
        
        // Cập nhật điểm
        setLoyaltyData(prev => ({
          ...prev,
          currentPoints: newPoints,
          totalSpent: prev.totalSpent + reward.pointsCost
        }));
        
        // Thêm vào lịch sử
        setPointsHistory(prev => [{
          id: `points_${Date.now()}`,
          type: 'spent',
          points: -reward.pointsCost,
          description: `Đổi quà - ${reward.name}`,
          date: new Date().toISOString(),
          reward: reward.name
        }, ...prev]);
        
        // Cập nhật user data
        await updateUser({ loyaltyPoints: newPoints });
        
        showNotification(`Đã đổi thành công "${reward.name}"! Quà sẽ được gửi trong 3-5 ngày`, 'success');
      } catch (error) {
        showNotification('Có lỗi xảy ra khi đổi quà', 'error');
      }
    }
  };

  const handleCopyCoupon = (couponCode) => {
    navigator.clipboard.writeText(couponCode);
    showNotification(`Đã sao chép mã "${couponCode}"`, 'success');
  };

  if (isLoading) {
    return (
      <div>
        <div className={styles.contentHeader}>
          <h1 className={styles.contentTitle}>Chương trình thành viên</h1>
          <p className={styles.contentSubtitle}>Đang tải...</p>
        </div>
        <div className={styles.contentSection} style={{ textAlign: 'center', padding: '3rem' }}>
          <div className={styles.loadingSpinner} style={{ margin: '0 auto', width: '40px', height: '40px' }}></div>
        </div>
      </div>
    );
  }

  const tierInfo = getTierInfo(loyaltyData.tier);
  const nextTierInfo = getTierInfo(loyaltyData.nextTier);
  const progressPercent = loyaltyData.nextTier ? 
    ((loyaltyData.currentPoints - tierInfo.minPoints) / (nextTierInfo.minPoints - tierInfo.minPoints)) * 100 : 100;

  return (
    <div>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Chương trình thành viên</h1>
        <p className={styles.contentSubtitle}>Thiết tớ điểm thưởng và nhận ưu đãi hấp dẫn</p>
      </div>

      {/* Tổng quan thành viên */}
      <div className={styles.contentSection}>
        <div style={{
          background: `linear-gradient(135deg, ${tierInfo.color}20 0%, ${tierInfo.color}10 100%)`,
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {tierInfo.icon} Hạng {loyaltyData.tier}
              </h2>
              <p style={{ margin: '0', color: '#666', fontSize: '1.1rem' }}>
                Chào mừng {user?.name || 'thành viên'} - {loyaltyData.currentPoints} điểm hiện có
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: tierInfo.color }}>
                {loyaltyData.currentPoints}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>điểm thưởng</div>
            </div>
          </div>

          {/* Tiến trình lên hạng */}
          {loyaltyData.nextTier && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Tiến trình lên hạng {loyaltyData.nextTier}</span>
                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                  Còn {loyaltyData.pointsToNextTier} điểm
                </span>
              </div>
              <div style={{
                background: '#f0f0f0',
                borderRadius: '25px',
                height: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: `linear-gradient(90deg, ${tierInfo.color}, ${nextTierInfo.color})`,
                  height: '100%',
                  width: `${Math.min(progressPercent, 100)}%`,
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Thống kê nhanh */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4caf50' }}>{loyaltyData.totalEarned}</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Tổng điểm kiếm được</div>
          </div>
          <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ff6b9d' }}>{loyaltyData.totalSpent}</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Tổng điểm đã dùng</div>
          </div>
          <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2196f3' }}>{availableCoupons.filter(c => !c.isUsed).length}</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Coupon khả dụng</div>
          </div>
        </div>

        {/* Quyền lợi hạng thành viên */}
        <div>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600' }}>Quyền lợi hạng {loyaltyData.tier}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
            {loyaltyData.benefits.map((benefit, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '8px' }}>
                <span style={{ color: '#4caf50', fontSize: '1.1rem' }}>✓</span>
                <span style={{ fontSize: '0.9rem' }}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className={styles.contentSection}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #e0e0e0' }}>
          {[
            { id: 'overview', label: 'Tổng quan', icon: '📊' },
            { id: 'history', label: 'Lịch sử điểm', icon: '📅' },
            { id: 'coupons', label: 'Coupon của tôi', icon: '🎫' },
            { id: 'rewards', label: 'Đổi quà', icon: '🎁' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: activeTab === tab.id ? '#ff6b9d' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#666',
                borderRadius: '8px 8px 0 0',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Nội dung tab */}
        {activeTab === 'overview' && (
          <div>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>Cách kiếm điểm thưởng</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { action: 'Mua hàng', points: '1 điểm / 1,000đ', icon: '🛒' },
                { action: 'Đánh giá sản phẩm', points: '50 điểm', icon: '⭐' },
                { action: 'Chia sẻ MXH', points: '25 điểm', icon: '📱' },
                { action: 'Giới thiệu bạn bè', points: '200 điểm', icon: '👥' },
                { action: 'Sinh nhật', points: '500 điểm', icon: '🎂' }
              ].map((item, index) => (
                <div key={index} style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.action}</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>{item.points}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>Lịch sử điểm thưởng</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {pointsHistory.map((entry) => (
                <div key={entry.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: '#f9f9f9',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${entry.type === 'earned' || entry.type === 'bonus' ? '#4caf50' : '#ff6b9d'}`
                }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{entry.description}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      {new Date(entry.date).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: entry.points > 0 ? '#4caf50' : '#ff6b9d'
                  }}>
                    {entry.points > 0 ? '+' : ''}{entry.points} điểm
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>Coupon của tôi ({availableCoupons.filter(c => !c.isUsed).length} khả dụng)</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {availableCoupons.map((coupon) => (
                <div key={coupon.id} style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  background: coupon.isUsed ? '#f5f5f5' : 'white',
                  opacity: coupon.isUsed ? 0.7 : 1,
                  position: 'relative'
                }}>
                  {coupon.isUsed && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: '#999',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '25px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      Đã sử dụng
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                        {coupon.title}
                      </h4>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                        {coupon.description}
                      </p>
                      <p style={{ margin: '0', color: '#999', fontSize: '0.85rem' }}>
                        Hết hạn: {new Date(coupon.expiryDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        background: '#ff6b9d', 
                        color: 'white', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '8px', 
                        fontWeight: '600',
                        marginBottom: '0.5rem'
                      }}>
                        {coupon.code}
                      </div>
                      {!coupon.isUsed && (
                        <button
                          onClick={() => handleCopyCoupon(coupon.code)}
                          className={`${styles.btn} ${styles['btn-secondary']}`}
                          style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                        >
                          📋 Sao chép
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>Đổi quà với điểm thưởng</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {rewardCatalog.map((reward) => (
                <div key={reward.id} style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '1rem',
                  background: 'white',
                  opacity: !reward.inStock ? 0.7 : 1
                }}>
                  {/* Hình ảnh quà */}
                  <div style={{
                    width: '100%',
                    height: '150px',
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    position: 'relative'
                  }}>
                    {reward.category === 'voucher' ? '🎫' : '🎁'}
                    
                    {!reward.inStock && (
                      <div style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        background: '#f44336',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '25px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        Hết hàng
                      </div>
                    )}
                  </div>

                  {/* Thông tin quà */}
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ 
                      margin: '0 0 0.5rem 0', 
                      fontSize: '1rem', 
                      fontWeight: '600',
                      lineHeight: '1.3'
                    }}>
                      {reward.name}
                    </h4>
                    <p style={{ 
                      margin: '0 0 0.75rem 0', 
                      color: '#666', 
                      fontSize: '0.85rem',
                      lineHeight: '1.4'
                    }}>
                      {reward.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: '#ff6b9d', fontWeight: '600' }}>
                        {reward.pointsCost} điểm
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#999' }}>
                        Giá gốc: {formatPrice(reward.originalPrice)}
                      </div>
                    </div>
                  </div>

                  {/* Nút đổi quà */}
                  <button
                    onClick={() => handleRedeemReward(reward)}
                    disabled={!reward.inStock || loyaltyData.currentPoints < reward.pointsCost}
                    className={`${styles.btn} ${reward.inStock && loyaltyData.currentPoints >= reward.pointsCost ? styles['btn-primary'] : styles['btn-secondary']}`}
                    style={{ 
                      width: '100%', 
                      fontSize: '0.9rem',
                      opacity: (!reward.inStock || loyaltyData.currentPoints < reward.pointsCost) ? 0.6 : 1
                    }}
                  >
                    {!reward.inStock 
                      ? 'Hết hàng' 
                      : loyaltyData.currentPoints < reward.pointsCost 
                        ? 'Không đủ điểm'
                        : '🎁 Đổi quà'
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyProgram;