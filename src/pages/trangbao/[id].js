import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../../styles/trangbao.module.css";
import Image from "next/image";

const articles = {
  1: {
    title: "Serum Vitamin C - Bí quyết làn da sáng mịn",
    author: "Beauty Expert",
    date: "2024-12-15",
    readTime: "5 phút đọc",
    image: "/images/banners/f.jpg",
    category: "Chăm sóc da",
    tags: ["serum", "vitamin-c", "làm-sáng-da"],
    content: [
      {
        type: "intro",
        text: "Vitamin C là một trong những thành phần quan trọng nhất trong skincare, giúp làm sáng da và chống lão hóa hiệu quả."
      },
      {
        type: "heading",
        text: "Lợi ích của Serum Vitamin C"
      },
      {
        type: "list",
        items: [
          "Làm sáng da và mờ thâm nám",
          "Kích thích sản sinh collagen",
          "Chống oxy hóa mạnh mẽ",
          "Cải thiện kết cấu da",
          "Bảo vệ da khỏi tác hại môi trường"
        ]
      },
      {
        type: "heading",
        text: "Cách sử dụng đúng cách"
      },
      {
        type: "paragraph",
        text: "Sử dụng serum vitamin C vào buổi sáng, sau bước làm sạch và trước kem chống nắng. Bắt đầu với nồng độ thấp để da thích nghi."
      }
    ],
    reviews: [
      {
        user: "Minh Anh",
        rating: 5,
        comment: "Dùng được 2 tuần thấy da sáng lên rõ rệt!",
        date: "2024-12-10"
      },
      {
        user: "Thu Hương", 
        rating: 4,
        comment: "Sản phẩm tốt, da mịn hơn nhiều",
        date: "2024-12-08"
      }
    ]
  }
};

export default function TrangBao() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundArticle = articles[id];
      setArticle(foundArticle);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  if (!article) {
    return <div className={styles.notFound}>Không tìm thấy bài viết</div>;
  }

  return (
    <div className={styles.fullscreenContainer}>
      {/* Top Navigation Bar */}
      <nav className={styles.topNavBar}>
        <div className={styles.navContainer}>
          <div className={styles.navLeft}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>💄</span>
              <span className={styles.logoText}>Beauty Zone</span>
            </div>
            <div className={styles.quickActions}>
              <button className={styles.quickBtn}>🏠 Trang chủ</button>
              <button className={styles.quickBtn}>🛍️ Shop</button>
              <button className={styles.quickBtn}>📱 App</button>
              <button className={styles.quickBtn}>📞 Hotline</button>
            </div>
          </div>
          <div className={styles.navCenter}>
            <div className={styles.searchContainer}>
              <input type="text" placeholder="Tìm kiếm sản phẩm, thương hiệu..." className={styles.searchInput} />
              <button className={styles.searchBtn}>🔍</button>
            </div>
          </div>
          <div className={styles.navRight}>
            <button className={styles.navAction}>🔔 <span className={styles.badge}>5</span></button>
            <button className={styles.navAction}>💬 <span className={styles.badge}>12</span></button>
            <button className={styles.navAction}>🛒 <span className={styles.badge}>3</span></button>
            <div className={styles.userProfile}>
              <img src="https://via.placeholder.com/40x40/FFB6C1/000000?text=U" alt="User" />
              <span>Xin chào!</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <div className={styles.secondaryNav}>
        <div className={styles.navContainer}>
          <div className={styles.categoryMenu}>
            <button className={styles.categoryBtn}>📋 Danh mục</button>
            <a href="#" className={styles.menuLink}>Serum</a>
            <a href="#" className={styles.menuLink}>Kem dưỡng</a>
            <a href="#" className={styles.menuLink}>Mặt nạ</a>
            <a href="#" className={styles.menuLink}>Tẩy trang</a>
            <a href="#" className={styles.menuLink}>Chống nắng</a>
            <a href="#" className={styles.menuLink}>Trang điểm</a>
          </div>
          <div className={styles.promoBar}>
            <span className={styles.promoText}>🎉 Flash Sale đang diễn ra! Giảm đến 50% 🎉</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        
        {/* Left Mega Sidebar */}
        <aside className={styles.leftMegaSidebar}>
          {/* Shop Profile */}
          <div className={styles.shopProfile}>
            <div className={styles.shopCover}>
              <img src="https://via.placeholder.com/300x120/FFB6C1/000000?text=Beauty+Zone+Cover" alt="Shop Cover" />
            </div>
            <div className={styles.shopInfo}>
              <div className={styles.shopAvatar}>
                <img src="https://via.placeholder.com/80x80/FFB6C1/000000?text=BZ" alt="Beauty Zone" />
                <div className={styles.verifiedBadge}>✓</div>
              </div>
              <h3 className={styles.shopName}>Beauty Zone Official Store</h3>
              <p className={styles.shopDescription}>Chuyên cung cấp mỹ phẩm chính hãng từ các thương hiệu nổi tiếng</p>
              <div className={styles.shopMetrics}>
                <div className={styles.metric}>
                  <span className={styles.metricNumber}>25.8K</span>
                  <span className={styles.metricLabel}>Người theo dõi</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricNumber}>4.9</span>
                  <span className={styles.metricLabel}>⭐ Đánh giá</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricNumber}>99%</span>
                  <span className={styles.metricLabel}>Phản hồi</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricNumber}>15K+</span>
                  <span className={styles.metricLabel}>Đơn hàng</span>
                </div>
              </div>
              <div className={styles.shopActions}>
                <button className={styles.followBtn}>+ Theo dõi</button>
                <button className={styles.chatBtn}>💬 Chat ngay</button>
              </div>
            </div>
          </div>

          {/* Live Support Panel */}
          <div className={styles.liveSupportPanel}>
            <h4 className={styles.panelTitle}>🎧 Hỗ trợ trực tuyến</h4>
            <div className={styles.supportAgents}>
              <div className={styles.agent}>
                <img src="https://via.placeholder.com/40x40/FFB6C1/000000?text=A1" alt="Agent" />
                <div className={styles.agentInfo}>
                  <span className={styles.agentName}>Tư vấn viên Linh</span>
                  <span className={styles.agentStatus}>🟢 Đang online</span>
                </div>
                <button className={styles.chatAgentBtn}>💬</button>
              </div>
              <div className={styles.agent}>
                <img src="https://via.placeholder.com/40x40/FFB6C1/000000?text=A2" alt="Agent" />
                <div className={styles.agentInfo}>
                  <span className={styles.agentName}>Chuyên gia skincare</span>
                  <span className={styles.agentStatus}>🟢 Đang online</span>
                </div>
                <button className={styles.chatAgentBtn}>💬</button>
              </div>
              <div className={styles.agent}>
                <img src="https://via.placeholder.com/40x40/FFB6C1/000000?text=A3" alt="Agent" />
                <div className={styles.agentInfo}>
                  <span className={styles.agentName}>Hỗ trợ đơn hàng</span>
                  <span className={styles.agentStatus}>🟡 Bận (5 phút)</span>
                </div>
                <button className={styles.chatAgentBtn}>💬</button>
              </div>
            </div>
            <button className={styles.callbackBtn}>📞 Yêu cầu gọi lại</button>
          </div>

          {/* Quick Categories */}
          <div className={styles.quickCategories}>
            <h4 className={styles.panelTitle}>🏷️ Danh mục nổi bật</h4>
            <div className={styles.categoryGrid}>
              <div className={styles.categoryItem}>
                <span className={styles.categoryIcon}>🧴</span>
                <span className={styles.categoryName}>Serum</span>
                <span className={styles.categoryCount}>(156)</span>
              </div>
              <div className={styles.categoryItem}>
                <span className={styles.categoryIcon}>🥛</span>
                <span className={styles.categoryName}>Kem dưỡng</span>
                <span className={styles.categoryCount}>(89)</span>
              </div>
              <div className={styles.categoryItem}>
                <span className={styles.categoryIcon}>🎭</span>
                <span className={styles.categoryName}>Mặt nạ</span>
                <span className={styles.categoryCount}>(234)</span>
              </div>
              <div className={styles.categoryItem}>
                <span className={styles.categoryIcon}>🧽</span>
                <span className={styles.categoryName}>Tẩy trang</span>
                <span className={styles.categoryCount}>(67)</span>
              </div>
              <div className={styles.categoryItem}>
                <span className={styles.categoryIcon}>☀️</span>
                <span className={styles.categoryName}>Chống nắng</span>
                <span className={styles.categoryCount}>(45)</span>
              </div>
              <div className={styles.categoryItem}>
                <span className={styles.categoryIcon}>💋</span>
                <span className={styles.categoryName}>Son môi</span>
                <span className={styles.categoryCount}>(123)</span>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className={styles.trendingTopics}>
            <h4 className={styles.panelTitle}>🔥 Trending</h4>
            <div className={styles.trendingList}>
              <div className={styles.trendingItem}>
                <span className={styles.trendNumber}>1</span>
                <span className={styles.trendText}>#ViminC_Challenge</span>
                <span className={styles.trendCount}>12.5K posts</span>
              </div>
              <div className={styles.trendingItem}>
                <span className={styles.trendNumber}>2</span>
                <span className={styles.trendText}>#GlowingSkin</span>
                <span className={styles.trendCount}>8.9K posts</span>
              </div>
              <div className={styles.trendingItem}>
                <span className={styles.trendNumber}>3</span>
                <span className={styles.trendText}>#KoreanSkincare</span>
                <span className={styles.trendCount}>6.7K posts</span>
              </div>
              <div className={styles.trendingItem}>
                <span className={styles.trendNumber}>4</span>
                <span className={styles.trendText}>#SerumReview</span>
                <span className={styles.trendCount}>5.2K posts</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={styles.mainContentArea}>
          {/* Post Container */}
          <article className={styles.postContainer}>
            {/* Post Header */}
            <header className={styles.postHeader}>
              <div className={styles.authorSection}>
                <img src="https://via.placeholder.com/60x60/FFB6C1/000000?text=BE" alt="Beauty Expert" className={styles.authorAvatar} />
                <div className={styles.authorDetails}>
                  <h3 className={styles.authorName}>{article.author}</h3>
                  <div className={styles.authorMeta}>
                    <span className={styles.postTime}>{article.date}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.readTime}>{article.readTime}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.visibility}>🌍 Công khai</span>
                  </div>
                </div>
              </div>
              <div className={styles.postActions}>
                <button className={styles.saveBtn}>🔖</button>
                <button className={styles.shareBtn}>📤</button>
                <button className={styles.moreBtn}>⋯</button>
              </div>
            </header>

            {/* Post Content */}
            <div className={styles.postMainContent}>
              <h1 className={styles.postTitle}>{article.title}</h1>
              
              <div className={styles.postMeta}>
                <span className={styles.categoryBadge}>{article.category}</span>
                <div className={styles.tagsList}>
                  {article.tags.map((tag, index) => (
                    <span key={index} className={styles.hashtag}>#{tag}</span>
                  ))}
                </div>
              </div>

              <div className={styles.featuredImage}>
                <img src={article.image} alt={article.title} />
                <div className={styles.imageOverlay}>
                  <button className={styles.expandBtn}>🔍 Xem chi tiết</button>
                </div>
              </div>

              <div className={styles.articleContent}>
                {article.content.map((item, index) => (
                  <div key={index} className={styles.contentBlock}>
                    {item.type === 'intro' && (
                      <p className={styles.introText}>{item.text}</p>
                    )}
                    {item.type === 'heading' && (
                      <h3 className={styles.sectionHeading}>{item.text}</h3>
                    )}
                    {item.type === 'paragraph' && (
                      <p className={styles.paragraphText}>{item.text}</p>
                    )}
                    {item.type === 'list' && (
                      <ul className={styles.benefitsList}>
                        {item.items.map((listItem, idx) => (
                          <li key={idx} className={styles.benefitItem}>
                            <span className={styles.checkmark}>✓</span>
                            {listItem}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Additional Content Sections */}
              <div className={styles.additionalSections}>
                <div className={styles.tipsSection}>
                  <h4 className={styles.sectionTitle}>💡 Tips chuyên gia</h4>
                  <div className={styles.tipCard}>
                    <p>Để tối ưu hiệu quả của serum Vitamin C, hãy bảo quản ở nơi thoáng mát, tránh ánh sáng trực tiếp.</p>
                  </div>
                </div>

                <div className={styles.warningSection}>
                  <h4 className={styles.sectionTitle}>⚠️ Lưu ý quan trọng</h4>
                  <div className={styles.warningCard}>
                    <p>Da nhạy cảm nên test patch trước khi sử dụng. Ngừng sử dụng nếu có dấu hiệu kích ứng.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Section */}
            <div className={styles.engagementSection}>
              <div className={styles.reactionStats}>
                <div className={styles.reactionCount}>
                  <span className={styles.reactionEmoji}>👍❤️😍</span>
                  <span className={styles.countText}>1.2K người đã thích</span>
                </div>
                <div className={styles.commentShareStats}>
                  <span>89 bình luận</span>
                  <span>45 chia sẻ</span>
                </div>
              </div>

              <div className={styles.actionBar}>
                <button className={styles.reactionBtn}>
                  <span className={styles.btnIcon}>👍</span>
                  <span className={styles.btnText}>Thích</span>
                </button>
                <button className={styles.reactionBtn}>
                  <span className={styles.btnIcon}>💬</span>
                  <span className={styles.btnText}>Bình luận</span>
                </button>
                <button className={styles.reactionBtn}>
                  <span className={styles.btnIcon}>📤</span>
                  <span className={styles.btnText}>Chia sẻ</span>
                </button>
                <button className={styles.reactionBtn}>
                  <span className={styles.btnIcon}>📧</span>
                  <span className={styles.btnText}>Gửi</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <section className={styles.commentsSection}>
              <div className={styles.commentHeader}>
                <h4 className={styles.commentTitle}>💬 Bình luận ({article.reviews.length + 12})</h4>
                <select className={styles.sortComments}>
                  <option>Mới nhất</option>
                  <option>Liên quan nhất</option>
                  <option>Cũ nhất</option>
                </select>
              </div>

              <div className={styles.commentComposer}>
                <img src="https://via.placeholder.com/40x40/FFB6C1/000000?text=U" alt="User" className={styles.composerAvatar} />
                <div className={styles.composerInput}>
                  <textarea placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..." rows="3"></textarea>
                  <div className={styles.composerActions}>
                    <button className={styles.emojiBtn}>😊</button>
                    <button className={styles.imageBtn}>🖼️</button>
                    <button className={styles.submitComment}>Bình luận</button>
                  </div>
                </div>
              </div>

              <div className={styles.commentsList}>
                {article.reviews.map((review, index) => (
                  <div key={index} className={styles.commentItem}>
                    <img src="https://via.placeholder.com/45x45/FFB6C1/000000?text=U" alt={review.user} className={styles.commentAvatar} />
                    <div className={styles.commentBody}>
                      <div className={styles.commentBubble}>
                        <div className={styles.commentAuthor}>
                          <span className={styles.commenterName}>{review.user}</span>
                          <span className={styles.commentTime}>{review.date}</span>
                        </div>
                        <div className={styles.ratingInComment}>
                          {'⭐'.repeat(review.rating)}
                        </div>
                        <p className={styles.commentText}>{review.comment}</p>
                      </div>
                      <div className={styles.commentInteractions}>
                        <button className={styles.likeBtn}>👍 Thích (12)</button>
                        <button className={styles.replyBtn}>💬 Trả lời</button>
                        <button className={styles.reportBtn}>⚠️ Báo cáo</button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Show more comments button */}
                <button className={styles.loadMoreComments}>Xem thêm bình luận (12 bình luận nữa)</button>
              </div>
            </section>
          </article>
        </main>

        {/* Right Mega Sidebar */}
        <aside className={styles.rightMegaSidebar}>
          {/* Flash Sale Widget */}
          <div className={styles.flashSaleWidget}>
            <div className={styles.flashSaleHeader}>
              <h4 className={styles.widgetTitle}>⚡ FLASH SALE ⚡</h4>
              <div className={styles.countdown}>
                <span className={styles.countdownLabel}>Kết thúc trong:</span>
                <div className={styles.countdownTimer}>
                  <span className={styles.timeUnit}>02</span>:
                  <span className={styles.timeUnit}>45</span>:
                  <span className={styles.timeUnit}>30</span>
                </div>
              </div>
            </div>
            <div className={styles.flashSaleItems}>
              <div className={styles.saleItem}>
                <img src="/images/banners/56.jpg" alt="Sale Product" />
                <div className={styles.saleInfo}>
                  <h5>Set 5 mặt nạ Premium</h5>
                  <div className={styles.salePrice}>
                    <span className={styles.currentPrice}>149K</span>
                    <span className={styles.originalPrice}>299K</span>
                    <span className={styles.discount}>-50%</span>
                  </div>
                  <div className={styles.saleProgress}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{width: '65%'}}></div>
                    </div>
                    <span className={styles.soldCount}>Đã bán 65/100</span>
                  </div>
                  <button className={styles.buyNowBtn}>Mua ngay</button>
                </div>
              </div>
            </div>
          </div>

          {/* Hot Products Grid */}
          <div className={styles.hotProductsGrid}>
            <h4 className={styles.widgetTitle}>🔥 Sản phẩm hot</h4>
            <div className={styles.productGrid}>
              <div className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src="https://via.placeholder.com/150x150/FFB6C1/000000?text=P1" alt="Product" />
                  <div className={styles.productBadge}>Best Seller</div>
                </div>
                <div className={styles.productDetails}>
                  <h5 className={styles.productName}>Serum Niacinamide 10%</h5>
                  <div className={styles.productRating}>
                    <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
                    <span className={styles.ratingText}>(4.8) • 1.2K reviews</span>
                  </div>
                  <div className={styles.productPrice}>
                    <span className={styles.currentPrice}>299K</span>
                    <span className={styles.oldPrice}>399K</span>
                  </div>
                  <div className={styles.productActions}>
                    <button className={styles.addToCartBtn}>🛒 Thêm vào giỏ</button>
                    <button className={styles.wishlistBtn}>💖</button>
                  </div>
                </div>
              </div>

              <div className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src="https://via.placeholder.com/150x150/FFB6C1/000000?text=P2" alt="Product" />
                  <div className={styles.productBadge}>New</div>
                </div>
                <div className={styles.productDetails}>
                  <h5 className={styles.productName}>Kem chống nắng SPF 50+</h5>
                  <div className={styles.productRating}>
                    <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
                    <span className={styles.ratingText}>(4.9) • 856 reviews</span>
                  </div>
                  <div className={styles.productPrice}>
                    <span className={styles.currentPrice}>199K</span>
                  </div>
                  <div className={styles.productActions}>
                    <button className={styles.addToCartBtn}>🛒 Thêm vào giỏ</button>
                    <button className={styles.wishlistBtn}>💖</button>
                  </div>
                </div>
              </div>

              <div className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src="https://via.placeholder.com/150x150/FFB6C1/000000?text=P3" alt="Product" />
                  <div className={styles.productBadge}>-25%</div>
                </div>
                <div className={styles.productDetails}>
                  <h5 className={styles.productName}>Mặt nạ Collagen</h5>
                  <div className={styles.productRating}>
                    <span className={styles.stars}>⭐⭐⭐⭐</span>
                    <span className={styles.ratingText}>(4.7) • 642 reviews</span>
                  </div>
                  <div className={styles.productPrice}>
                    <span className={styles.currentPrice}>89K</span>
                    <span className={styles.oldPrice}>119K</span>
                  </div>
                  <div className={styles.productActions}>
                    <button className={styles.addToCartBtn}>🛒 Thêm vào giỏ</button>
                    <button className={styles.wishlistBtn}>💖</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className={styles.relatedArticlesWidget}>
            <h4 className={styles.widgetTitle}>📖 Bài viết liên quan</h4>
            <div className={styles.articlesList}>
              <div className={styles.articleItem}>
                <img src="https://via.placeholder.com/80x80/FFB6C1/000000?text=A1" alt="Article" />
                <div className={styles.articleInfo}>
                  <h6>10 bước skincare cơ bản cho người mới</h6>
                  <div className={styles.articleMeta}>
                    <span>5 phút đọc</span>
                    <span>•</span>
                    <span>2.5K views</span>
                  </div>
                </div>
              </div>
              <div className={styles.articleItem}>
                <img src="https://via.placeholder.com/80x80/FFB6C1/000000?text=A2" alt="Article" />
                <div className={styles.articleInfo}>
                  <h6>Cách chọn kem chống nắng phù hợp</h6>
                  <div className={styles.articleMeta}>
                    <span>3 phút đọc</span>
                    <span>•</span>
                    <span>1.8K views</span>
                  </div>
                </div>
              </div>
              <div className={styles.articleItem}>
                <img src="https://via.placeholder.com/80x80/FFB6C1/000000?text=A3" alt="Article" />
                <div className={styles.articleInfo}>
                  <h6>Review top 5 serum hot nhất 2024</h6>
                  <div className={styles.articleMeta}>
                    <span>7 phút đọc</span>
                    <span>•</span>
                    <span>4.2K views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className={styles.newsletterWidget}>
            <div className={styles.newsletterHeader}>
              <h4 className={styles.widgetTitle}>📧 Đăng ký nhận tin</h4>
              <p>Nhận thông tin mới nhất về sản phẩm và khuyến mãi!</p>
            </div>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="Nhập email của bạn" className={styles.emailInput} />
              <button type="submit" className={styles.subscribeBtn}>Đăng ký ngay</button>
            </form>
            <div className={styles.newsletterBenefits}>
              <div className={styles.benefit}>✅ Tin tức sản phẩm mới</div>
              <div className={styles.benefit}>✅ Ưu đãi độc quyền</div>
              <div className={styles.benefit}>✅ Tips làm đẹp hữu ích</div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className={styles.socialWidget}>
            <h4 className={styles.widgetTitle}>🌟 Theo dõi chúng tôi</h4>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>
                <span className={styles.socialIcon}>📘</span>
                <span>Facebook (25K followers)</span>
              </a>
              <a href="#" className={styles.socialLink}>
                <span className={styles.socialIcon}>📷</span>
                <span>Instagram (18K followers)</span>
              </a>
              <a href="#" className={styles.socialLink}>
                <span className={styles.socialIcon}>📱</span>
                <span>TikTok (12K followers)</span>
              </a>
              <a href="#" className={styles.socialLink}>
                <span className={styles.socialIcon}>📺</span>
                <span>YouTube (8K subscribers)</span>
              </a>
            </div>
          </div>

          {/* Live Chat Widget */}
          <div className={styles.liveChatWidget}>
            <h4 className={styles.widgetTitle}>💬 Chat trực tuyến</h4>
            <div className={styles.chatPreview}>
              <div className={styles.chatMessage}>
                <span className={styles.supportAgent}>Tư vấn viên:</span>
                <span>Chào bạn! Cần hỗ trợ gì không?</span>
              </div>
            </div>
            <button className={styles.startChatBtn}>Bắt đầu chat ngay</button>
          </div>
        </aside>
      </div>

      {/* Floating Action Buttons */}
      <div className={styles.floatingActions}>
        <button className={styles.floatingBtn} title="Về đầu trang">⬆️</button>
        <button className={styles.floatingBtn} title="Chat hỗ trợ">💬</button>
        <button className={styles.floatingBtn} title="Gọi điện">📞</button>
      </div>
    </div>
  );
}
