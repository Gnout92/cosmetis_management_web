'use client';
import React, { useState, useEffect } from 'react';
import styles from '../styles/hotroKH.module.css';

// Modern SVG Icons Component
const Icon = ({ name, size = 20, className = '' }) => {
  const icons = {
    phone: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="currentColor"/>
      </svg>
    ),
    chat: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor"/>
      </svg>
    ),
    email: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    ),
    clock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    home: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor"/>
        <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    document: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
        <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    help: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    map: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="currentColor"/>
        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    globe: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    barChart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <line x1="12" y1="20" x2="12" y2="10" stroke="currentColor" strokeWidth="2"/>
        <line x1="18" y1="20" x2="18" y2="4" stroke="currentColor" strokeWidth="2"/>
        <line x1="6" y1="20" x2="6" y2="16" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    back: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    location: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="currentColor"/>
        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    timer: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
        <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    package: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="currentColor"/>
        <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="currentColor" strokeWidth="2"/>
        <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    truck: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M1 3h15v13H1z" fill="currentColor"/>
        <path d="M16 8h4l3 3v5h-7z" fill="currentColor"/>
        <circle cx="5.5" cy="18.5" r="2.5" fill="currentColor"/>
        <circle cx="18.5" cy="18.5" r="2.5" fill="currentColor"/>
      </svg>
    ),
    store: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    ),
    link: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    dot: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
      </svg>
    ),
    users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    messageCircle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor"/>
      </svg>
    ),
    book: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    facebook: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="currentColor"/>
      </svg>
    ),
    instagram: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="2"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    youtube: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="m22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="currentColor"/>
      </svg>
    ),
    tiktok: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.74l-.002.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-1-.8A6.87 6.87 0 0 0 4.882 2H2v3.445a4.793 4.793 0 0 1 3.77-4.245v9.746a2.896 2.896 0 0 1-5.201-1.74l.002.001.002-.001A2.895 2.895 0 0 1 7.76 3.52a6.329 6.329 0 0 0 1 .8V2.5a6.87 6.87 0 0 0-1.117 4.4V19.589a4.793 4.793 0 0 1 3.77 4.245V22h3.445v-13.672a2.896 2.896 0 0 1 5.201-1.74l.002-.001.002.001A2.895 2.895 0 0 1 20.24 9.5v3.5a6.329 6.329 0 0 0 1 .8V22h3.382a4.793 4.793 0 0 0 1.207-3.033V6.686z" fill="currentColor"/>
      </svg>
    ),
  };
  
  return icons[name] || icons.chat;
};

const HotroKH = () => {
  // States for different functionalities
  const [activeSection, setActiveSection] = useState('contact');
  const [supportForm, setSupportForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    supportType: '',
    orderNumber: '',
    message: '',
    attachments: []
  });
  
  // Thêm states cho quy trình e-commerce
  const [orderTracking, setOrderTracking] = useState({
    orderNumber: '',
    loading: false,
    orderData: null,
    trackingError: null
  });
  
  const [orderHistory, setOrderHistory] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchFAQ, setSearchFAQ] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [chatOnline, setChatOnline] = useState(true);
  
  // Support types data
  const supportTypes = [
    { value: '', label: 'Chọn loại hỗ trợ', disabled: true },
    { value: 'consultation', label: <><Icon name="document" size={16} /> Tư vấn sản phẩm</> },
    { value: 'order', label: <><Icon name="package" size={16} /> Vấn đề đơn hàng</> },
    { value: 'tracking', label: <><Icon name="map" size={16} /> Theo dõi đơn hàng</> },
    { value: 'warranty', label: <><Icon name="document" size={16} /> Bảo hành</> },
    { value: 'return', label: <><Icon name="document" size={16} /> Đổi trả</> },
    { value: 'payment', label: <><Icon name="phone" size={16} /> Thanh toán</> },
    { value: 'review', label: <><Icon name="document" size={16} /> Đánh giá sản phẩm</> },
    { value: 'complaint', label: <><Icon name="help" size={16} /> Khiếu nại</> },
    { value: 'technical', label: <><Icon name="document" size={16} /> Hỗ trợ kỹ thuật</> },
    { value: 'other', label: <><Icon name="help" size={16} /> Khác</> }
  ];
  
  // FAQ data
  const faqData = [
    {
      id: 1,
      category: 'Đơn hàng',
      question: 'Làm sao để theo dõi đơn hàng của tôi?',
      answer: 'Bạn có thể theo dõi đơn hàng bằng cách:\n\n1. Đăng nhập vào tài khoản và vào mục "Đơn hàng của tôi"\n2. Nhập mã đơn hàng tại trang "Tra cứu đơn hàng"\n3. Liên hệ hotline 1900 1234 để được hỗ trợ trực tiếp\n4. Nhận thông báo qua SMS/email khi đơn hàng thay đổi trạng thái',
      tags: ['đơn hàng', 'theo dõi', 'tra cứu']
    },
    {
      id: 2,
      category: 'Đổi trả',
      question: 'Chính sách đổi trả như thế nào?',
      answer: 'KaKa hỗ trợ đổi trả trong 15 ngày với điều kiện:\n\n• Sản phẩm còn nguyên tem, nhãn mác\n• Chưa sử dụng, còn nguyên vẹn\n• Có hóa đơn mua hàng\n• Không áp dụng với sản phẩm khuyến mãi dưới 50%\n• Miễn phí đổi trả tại cửa hàng hoặc ship hoàn',
      tags: ['đổi trả', 'chính sách', 'hoàn tiền']
    },
    {
      id: 3,
      category: 'Thanh toán',
      question: 'Cửa hàng có hỗ trợ thanh toán COD không?',
      answer: 'Có, KaKa hỗ trợ đa dạng phương thức thanh toán:\n\n• COD (Thanh toán khi nhận hàng)\n• Chuyển khoản ngân hàng\n• Ví điện tử (MoMo, ZaloPay, VNPay)\n• Thẻ tín dụng/ghi nợ\n• Trả góp qua thẻ tín dụng (0% lãi suất)',
      tags: ['thanh toán', 'cod', 'chuyển khoản', 'ví điện tử']
    },
    {
      id: 4,
      category: 'Bảo hành',
      question: 'Làm sao để kích hoạt bảo hành sản phẩm?',
      answer: 'Để kích hoạt bảo hành:\n\n1. Giữ hóa đơn mua hàng\n2. Đăng ký bảo hành online tại website\n3. Hoặc mang sản phẩm + hóa đơn đến cửa hàng\n4. Thời gian bảo hành: 6-18 tháng tùy sản phẩm\n5. Nhận thông báo nhắc hết hạn bảo hành',
      tags: ['bảo hành', 'kích hoạt', 'sản phẩm']
    },
    {
      id: 5,
      category: 'Đơn hàng',
      question: 'Có thể hủy đơn hàng không?',
      answer: 'Bạn có thể hủy đơn hàng trong các trường hợp:\n\n• Đơn hàng chưa được xác nhận (trong 2h)\n• Đơn hàng chưa được đóng gói\n• Liên hệ hotline ngay khi muốn hủy\n• Tiền sẽ được hoàn lại trong 1-3 ngày làm việc\n• Không mất phí hủy đơn',
      tags: ['hủy đơn', 'hoàn tiền', 'xác nhận']
    },
    {
      id: 6,
      category: 'Tài khoản',
      question: 'Làm sao để đăng ký tài khoản thành viên?',
      answer: 'Đăng ký tài khoản KaKa để nhận ưu đãi:\n\n1. Nhấn "Đăng ký" trên website\n2. Điền thông tin cá nhân\n3. Xác thực qua email/SMS\n4. Nhận ngay voucher 50K cho lần mua đầu tiên\n5. Tích điểm đổi quà mỗi lần mua sắm',
      tags: ['đăng ký', 'tài khoản', 'thành viên', 'ưu đãi']
    },
    {
      id: 7,
      category: 'Vận chuyển',
      question: 'Thời gian giao hàng là bao lâu?',
      answer: 'Thời gian giao hàng:\n\n• Nội thành: 1-2 ngày\n• Ngoại thành: 2-3 ngày\n• Tỉnh khác: 3-5 ngày\n• Miễn phí ship cho đơn từ 299K\n• Giao hàng nhanh trong 2h (phí 25K)\n• Giao hàng cuối tuần không tính phí thêm',
      tags: ['giao hàng', 'vận chuyển', 'thời gian', 'miễn phí ship']
    },
    {
      id: 8,
      category: 'Khuyến mãi',
      question: 'Làm sao để nhận thông tin khuyến mãi?',
      answer: 'Để không bỏ lỡ khuyến mãi:\n\n• Đăng ký nhận email/SMS\n• Follow Facebook/Instagram KaKa\n• Tham gia Zalo OA\n• Kiểm tra app thường xuyên\n• Sinh nhật sẽ có ưu đãi đặc biệt 20%\n• Member VIP được ưu tiên khuyến mãi độc quyền',
      tags: ['khuyến mãi', 'ưu đãi', 'thông báo', 'sinh nhật']
    },
    {
      id: 9,
      category: 'Theo dõi đơn hàng',
      question: 'Làm sao để theo dõi tình trạng đơn hàng?',
      answer: 'Bạn có thể theo dõi đơn hàng bằng nhiều cách:\n\n• Đăng nhập tài khoản → Đơn mua → Xem chi tiết\n• Nhập mã đơn hàng tại mục "Tra cứu"\n• Nhận thông báo SMS/email tự động\n• Hotline 1900 1234 (miễn phí)\n• Các trạng thái: Xác nhận → Đóng gói → Vận chuyển → Giao hàng',
      tags: ['theo dõi', 'đơn hàng', 'trạng thái', 'tra cứu']
    },
    {
      id: 10,
      category: 'Thanh toán',
      question: 'Các phương thức thanh toán được chấp nhận?',
      answer: 'KaKa hỗ trợ đa dạng phương thức thanh toán:\n\n• COD (Thanh toán khi nhận hàng)\n• Chuyển khoản ngân hàng\n• Ví điện tử (MoMo, ZaloPay, VNPay)\n• Thẻ tín dụng/ghi nợ\n• Trả góp 0% lãi suất qua thẻ\n• Thanh toán an toàn với mã hóa SSL',
      tags: ['thanh toán', 'cod', 'ví điện tử', 'thẻ tín dụng']
    },
    {
      id: 11,
      category: 'Đánh giá',
      question: 'Làm sao để đánh giá sản phẩm sau khi mua?',
      answer: 'Sau khi nhận hàng thành công:\n\n• Vào "Đơn mua" → Chọn "Đánh giá sản phẩm"\n• Chấm điểm từ 1-5 sao\n• Viết review và up hình ảnh thực tế\n• Đánh giá shop và dịch vụ vận chuyển\n• Nhận điểm thưởng và voucher cho lần sau\n• Review hữu ích nhận thêm ưu đãi đặc biệt',
      tags: ['đánh giá', 'review', 'sản phẩm', 'điểm thưởng']
    }
  ];
  
  // Store branches data
  const branches = [
    {
      id: 1,
      name: 'KaKa Cosmetics - TP.HCM Quận 1',
      address: '123 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh',
      phone: '0902 345 678',
      email: 'q1hcm@kaka.vn',
      hours: '8:00 – 22:00 (T2–CN)',
      services: ['Tư vấn trực tiếp', 'Thử sản phẩm', 'Makeup miễn phí'],
      image: '/images/store-hcm.jpg'
    },
    {
      id: 2,
      name: 'KaKa Cosmetics - Cần Thơ',
      address: '45 Cách Mạng Tháng 8, Quận Ninh Kiều, TP. Cần Thơ',
      phone: '0901 234 567',
      email: 'cantho@kaka.vn',
      hours: '8:00 – 21:00 (T2–CN)',
      services: ['Tư vấn chuyên sâu', 'Spa mini', 'Giao hàng tận nhà'],
      image: '/images/store-cantho.jpg'
    },
    {
      id: 3,
      name: 'KaKa Cosmetics - Hà Nội',
      address: '12 Láng Hạ, Quận Ba Đình, TP. Hà Nội',
      phone: '0905 678 901',
      email: 'hanoi@kaka.vn',
      hours: '8:30 – 21:30 (T2–CN)',
      services: ['Workshop làm đẹp', 'Tư vấn trang điểm', 'Chăm sóc da miễn phí'],
      image: '/images/store-hanoi.jpg'
    }
  ];
  
  // Social media data
  const socialMedia = [
    {
      name: 'Facebook',
      icon: <Icon name="facebook" size={24} />,
      url: 'https://facebook.com/kaka',
      followers: '125K',
      description: 'Cập nhật thông tin mới nhất',
      active: true
    },
    {
      name: 'Instagram',
      icon: <Icon name="instagram" size={24} />,
      url: 'https://instagram.com/kaka',
      followers: '89K',
      description: 'Hình ảnh và video làm đẹp',
      active: true
    },
    {
      name: 'TikTok',
      icon: <Icon name="tiktok" size={24} />,
      url: 'https://tiktok.com/@kaka',
      followers: '156K',
      description: 'Video tutorial và tips',
      active: true
    },
    {
      name: 'Zalo OA',
      icon: <Icon name="messageCircle" size={24} />,
      url: 'https://zalo.me/kaka',
      followers: '67K',
      description: 'Chat trực tiếp với tư vấn viên',
      active: true
    },
    {
      name: 'YouTube',
      icon: <Icon name="youtube" size={24} />,
      url: 'https://youtube.com/kaka',
      followers: '45K',
      description: 'Review sản phẩm chi tiết',
      active: true
    }
  ];
  
  // Notification system
  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    const newNotification = { id, message, type };
    setNotifications(prev => [...prev, newNotification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupportForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSupportForm(prev => ({ ...prev, attachments: files }));
  };
  
  // Handle support form submission
  const handleSubmitSupport = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      if (!supportForm.fullName || !supportForm.email || !supportForm.phone || 
          !supportForm.supportType || !supportForm.message) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(supportForm.email)) {
        throw new Error('Email không hợp lệ');
      }
      
      // Validate phone format
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(supportForm.phone.replace(/[\s-]/g, ''))) {
        throw new Error('Số điện thoại không hợp lệ');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create support request
      const supportRequest = {
        id: Date.now(),
        ...supportForm,
        status: 'pending',
        createdAt: new Date().toISOString(),
        requestCode: `SUP${Date.now().toString().slice(-6)}`
      };
      
      // Save to localStorage for demo
      const existingRequests = JSON.parse(localStorage.getItem('support_requests') || '[]');
      localStorage.setItem('support_requests', JSON.stringify([...existingRequests, supportRequest]));
      
      // Show success message
      showNotification(
        `✅ Yêu cầu hỗ trợ đã được gửi thành công! Mã yêu cầu: ${supportRequest.requestCode}. Chúng tôi sẽ phản hồi trong vòng 24h.`,
        'success'
      );
      
      // Reset form
      setSupportForm({
        fullName: '',
        email: '',
        phone: '',
        supportType: '',
        orderNumber: '',
        message: '',
        attachments: []
      });
      
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Quick contact actions
  const handleQuickCall = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };
  
  const handleQuickEmail = (email) => {
    window.open(`mailto:${email}?subject=Yêu cầu hỗ trợ từ KaKa Cosmetics`, '_blank');
  };
  
  const handleQuickChat = (platform) => {
    const chatUrls = {
      zalo: 'https://zalo.me/kaka',
      messenger: 'https://m.me/kaka',
      whatsapp: 'https://wa.me/84901234567'
    };
    window.open(chatUrls[platform], '_blank');
  };
  
  // Filter FAQs based on search
  const filteredFAQs = faqData.filter(faq => 
    searchFAQ === '' || 
    faq.question.toLowerCase().includes(searchFAQ.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchFAQ.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchFAQ.toLowerCase()))
  );
  
  // Toggle FAQ expansion
  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };
  
  // Remove attachment
  const removeAttachment = (index) => {
    setSupportForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // 🌐 GIAI ĐOẠN 7 & 8: Theo dõi và quản lý đơn hàng
  const handleOrderTracking = async () => {
    if (!orderTracking.orderNumber.trim()) {
      setOrderTracking(prev => ({ ...prev, trackingError: 'Vui lòng nhập mã đơn hàng' }));
      return;
    }

    setOrderTracking(prev => ({ ...prev, loading: true, trackingError: null }));

    try {
      // Gọi API theo dõi đơn hàng (giả lập)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data cho đơn hàng
      const mockOrderData = {
        orderNumber: orderTracking.orderNumber,
        status: 'shipping',
        statusText: 'Đang vận chuyển',
        createdAt: '2024-11-10T08:30:00',
        estimatedDelivery: '2024-11-12T16:00:00',
        total: 450000,
        items: [
          { name: 'Kem dưỡng da KaKa Gold 50ml', price: 250000, quantity: 1, image: '🧴' },
          { name: 'Son môi KaKa Ruby Red', price: 200000, quantity: 1, image: '💄' }
        ],
        shippingInfo: {
          address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
          phone: '0902 345 678',
          method: 'Giao hàng nhanh'
        },
        timeline: [
          { time: '2024-11-10T08:30:00', status: 'confirmed', text: 'Đơn hàng đã được xác nhận' },
          { time: '2024-11-10T10:15:00', status: 'packed', text: 'Đơn hàng đang được đóng gói' },
          { time: '2024-11-10T14:20:00', status: 'shipping', text: 'Đang vận chuyển đến địa chỉ của bạn' }
        ]
      };

      setOrderTracking(prev => ({ ...prev, orderData: mockOrderData }));
      showNotification('Tìm thấy thông tin đơn hàng!', 'success');
    } catch (error) {
      setOrderTracking(prev => ({ 
        ...prev, 
        orderData: null,
        trackingError: 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn hàng.' 
      }));
    } finally {
      setOrderTracking(prev => ({ ...prev, loading: false }));
    }
  };

  // 🌐 GIAI ĐOẠN 8: Xử lý yêu cầu hỗ trợ
  const handleSupportRequest = async (type) => {
    if (type === 'return') {
      // Chuyển đến trang đổi trả
      window.open('/return-policy', '_blank');
    } else if (type === 'review') {
      // Chuyển đến trang đánh giá
      window.open('/my-orders', '_blank');
    } else if (type === 'warranty') {
      // Chuyển đến trang bảo hành
      window.open('/warranty-registration', '_blank');
    }
  };

  // 🌐 GIAI ĐOẠN 9: Thống kê và báo cáo khách hàng
  const getUserStatistics = async () => {
    try {
      // Mock thống kê người dùng
      const stats = {
        totalOrders: 12,
        totalSpent: 2850000,
        memberLevel: 'VIP Gold',
        points: 1250,
        nextLevel: 'Platinum',
        pointsToNext: 250,
        recentOrders: [
          { id: 'ORD001', date: '2024-11-08', status: 'delivered', total: 450000 },
          { id: 'ORD002', date: '2024-11-05', status: 'delivered', total: 320000 }
        ],
        favoriteCategories: ['Son môi', 'Kem dưỡng da', 'Phấn mắt'],
        monthlyTrend: [
          { month: '10', orders: 3, amount: 1200000 },
          { month: '11', orders: 2, amount: 850000 }
        ]
      };
      setUserStats(stats);
    } catch (error) {
      console.error('Lỗi lấy thống kê:', error);
    }
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    if (activeSection === 'statistics') {
      getUserStatistics();
    }
  }, [activeSection]);

  return (
    <div className={styles.container}>
      {/* Header with back to home */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.navigationSection}>
            <button 
              className={styles.backToHomeBtn}
              onClick={() => window.location.href = '/'}
              title="Quay về trang chủ"
            >
              <Icon name="home" size={16} /> Về trang chủ
            </button>
            <button 
              className={styles.backBtn}
              onClick={() => window.history.back()}
              title="Quay lại trang trước"
            >
              <Icon name="back" size={16} /> Quay lại
            </button>
          </div>
          
          <div className={styles.titleSection}>
            <h1 className={styles.title}><Icon name="chat" size={36} /> Hỗ trợ khách hàng</h1>
            <p className={styles.subtitle}>
              Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ với chúng tôi qua bất kỳ kênh nào thuận tiện nhất!
            </p>
          </div>
          
          {/* Online status indicator */}
          <div className={styles.onlineStatus}>
            <div className={`${styles.statusIndicator} ${chatOnline ? styles.online : styles.offline}`}></div>
            <span className={styles.statusText}>
              {chatOnline ? 'Đang trực tuyến' : 'Ngoại tuyến'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Contact Bar */}
      <div className={styles.quickContactBar}>
        <div className={styles.quickContactContent}>
          <button 
            className={styles.quickContactBtn}
            onClick={() => handleQuickCall('19001234')}
          >
            <span className={styles.contactIcon}><Icon name="phone" size={24} /></span>
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Hotline</span>
              <span className={styles.contactValue}>1900 1234</span>
            </div>
          </button>
          
          <button 
            className={styles.quickContactBtn}
            onClick={() => handleQuickChat('zalo')}
          >
            <span className={styles.contactIcon}><Icon name="chat" size={24} /></span>
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Zalo Chat</span>
              <span className={styles.contactValue}>Trực tuyến</span>
            </div>
          </button>
          
          <button 
            className={styles.quickContactBtn}
            onClick={() => handleQuickEmail('hotro@kaka.vn')}
          >
            <span className={styles.contactIcon}><Icon name="email" size={24} /></span>
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Email</span>
              <span className={styles.contactValue}>hotro@kaka.vn</span>
            </div>
          </button>
          
          <div className={styles.workingHours}>
            <span className={styles.contactIcon}><Icon name="clock" size={24} /></span>
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Giờ làm việc</span>
              <span className={styles.contactValue}>8:00 – 22:00 (T2 – CN)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className={styles.sectionNavigation}>
        <div className={styles.navContent}>
          <button 
            className={`${styles.navBtn} ${activeSection === 'contact' ? styles.navActive : ''}`}
            onClick={() => setActiveSection('contact')}
          >
            <Icon name="phone" size={18} /> Liên hệ nhanh
          </button>
          <button 
            className={`${styles.navBtn} ${activeSection === 'support' ? styles.navActive : ''}`}
            onClick={() => setActiveSection('support')}
          >
            <Icon name="document" size={18} /> Gửi yêu cầu
          </button>
          <button 
            className={`${styles.navBtn} ${activeSection === 'faq' ? styles.navActive : ''}`}
            onClick={() => setActiveSection('faq')}
          >
            <Icon name="help" size={18} /> FAQ
          </button>
          <button 
            className={`${styles.navBtn} ${activeSection === 'branches' ? styles.navActive : ''}`}
            onClick={() => setActiveSection('branches')}
          >
            <Icon name="map" size={18} /> Chi nhánh
          </button>
          <button 
            className={`${styles.navBtn} ${activeSection === 'social' ? styles.navActive : ''}`}
            onClick={() => setActiveSection('social')}
          >
            <Icon name="globe" size={18} /> Mạng xã hội
          </button>
          <button 
            className={`${styles.navBtn} ${activeSection === 'tracking' ? styles.navActive : ''}`}
            onClick={() => setActiveSection('tracking')}
          >
            <Icon name="map" size={18} /> Theo dõi đơn hàng
          </button>
          <button 
            className={`${styles.navBtn} ${activeSection === 'statistics' ? styles.navActive : ''}`}
            onClick={() => setActiveSection('statistics')}
          >
            <Icon name="barChart" size={18} /> Thống kê
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Contact Info Section */}
        {activeSection === 'contact' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}><Icon name="phone" size={24} /> Liên hệ nhanh / Hỗ trợ trực tuyến</h2>
              <p className={styles.sectionDesc}>
                Các phương thức liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi
              </p>
            </div>
            
            <div className={styles.contactGrid}>
              {/* Primary Contact Card */}
              <div className={styles.contactCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}><Icon name="phone" size={20} /> Liên hệ chính</h3>
                  <span className={styles.priorityTag}>Ưu tiên</span>
                </div>
                <div className={styles.contactDetails}>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}><Icon name="phone" size={20} /></span>
                    <div>
                      <strong>Hotline: 1900 1234</strong>
                      <p>Hỗ trợ 24/7 - Miễn phí cuộc gọi</p>
                    </div>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => handleQuickCall('19001234')}
                    >
                      Gọi ngay
                    </button>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}><Icon name="email" size={20} /></span>
                    <div>
                      <strong>Email: hotro@kaka.vn</strong>
                      <p>Phản hồi trong vòng 2-4 giờ</p>
                    </div>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => handleQuickEmail('hotro@kaka.vn')}
                    >
                      Gửi email
                    </button>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}><Icon name="clock" size={20} /></span>
                    <div>
                      <strong>Giờ làm việc</strong>
                      <p>8:00 – 22:00 (Thứ 2 – Chủ nhật)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chat Support Card */}
              <div className={styles.contactCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}><Icon name="chat" size={20} /> Chat trực tuyến</h3>
                  <span className={styles.onlineTag}>Đang hoạt động</span>
                </div>
                <div className={styles.contactDetails}>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}><Icon name="chat" size={20} /></span>
                    <div>
                      <strong>Zalo Chat</strong>
                      <p>Chat trực tiếp với tư vấn viên</p>
                    </div>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => handleQuickChat('zalo')}
                    >
                      Chat Zalo
                    </button>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}><Icon name="chat" size={20} /></span>
                    <div>
                      <strong>Messenger</strong>
                      <p>Nhắn tin qua Facebook</p>
                    </div>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => handleQuickChat('messenger')}
                    >
                      Chat Messenger
                    </button>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}><Icon name="phone" size={20} /></span>
                    <div>
                      <strong>WhatsApp</strong>
                      <p>Hỗ trợ khách hàng quốc tế</p>
                    </div>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => handleQuickChat('whatsapp')}
                    >
                      Chat WhatsApp
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Emergency Contact Card */}
              <div className={styles.contactCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}><Icon name="help" size={20} /> Hỗ trợ khẩn cấp</h3>
                  <span className={styles.emergencyTag}>24/7</span>
                </div>
                <div className={styles.contactDetails}>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}><Icon name="help" size={20} /></span>
                    <div>
                      <strong>Khiếu nại khẩn cấp</strong>
                      <p>Sự cố nghiêm trọng về sản phẩm</p>
                    </div>
                    <button 
                      className={styles.emergencyBtn}
                      onClick={() => handleQuickCall('19001234')}
                    >
                      Gọi khẩn cấp
                    </button>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}><Icon name="document" size={20} /></span>
                    <div>
                      <strong>Hỗ trợ kỹ thuật</strong>
                      <p>Sự cố website, app</p>
                    </div>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => handleQuickEmail('tech@kaka.vn')}
                    >
                      Báo lỗi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Support Form Section */}
        {activeSection === 'support' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}><Icon name="document" size={24} /> Gửi yêu cầu hỗ trợ</h2>
              <p className={styles.sectionDesc}>
                Điền form dưới đây để gửi yêu cầu hỗ trợ chi tiết. Chúng tôi sẽ phản hồi trong vòng 24h.
              </p>
            </div>
            
            <div className={styles.formContainer}>
              <form className={styles.supportForm} onSubmit={handleSubmitSupport}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Họ và tên *</label>
                    <input 
                      type="text" 
                      name="fullName"
                      className={styles.formInput}
                      placeholder="Nhập họ và tên đầy đủ"
                      value={supportForm.fullName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      className={styles.formInput}
                      placeholder="Nhập địa chỉ email"
                      value={supportForm.email}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Số điện thoại *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      className={styles.formInput}
                      placeholder="Nhập số điện thoại"
                      value={supportForm.phone}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Loại hỗ trợ *</label>
                    <select 
                      name="supportType"
                      className={styles.formSelect}
                      value={supportForm.supportType}
                      onChange={handleInputChange}
                      required
                    >
                      {supportTypes.map(type => (
                        <option 
                          key={type.value} 
                          value={type.value} 
                          disabled={type.disabled}
                        >
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mã đơn hàng (nếu có)</label>
                    <input 
                      type="text" 
                      name="orderNumber"
                      className={styles.formInput}
                      placeholder="Nhập mã đơn hàng"
                      value={supportForm.orderNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.formLabel}>Nội dung cần hỗ trợ *</label>
                    <textarea 
                      name="message"
                      className={styles.formTextarea}
                      placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                      value={supportForm.message}
                      onChange={handleInputChange}
                      rows={6}
                      required
                    />
                  </div>
                  
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.formLabel}>Đính kèm hình ảnh (tùy chọn)</label>
                    <div className={styles.fileUpload}>
                      <input 
                        type="file" 
                        id="attachments"
                        className={styles.fileInput}
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="attachments" className={styles.fileLabel}>
                        <Icon name="document" size={18} /> Chọn hình ảnh minh họa
                      </label>
                    </div>
                    
                    {supportForm.attachments.length > 0 && (
                      <div className={styles.attachmentPreview}>
                        {supportForm.attachments.map((file, index) => (
                          <div key={index} className={styles.attachmentItem}>
                            <span className={styles.fileName}>{file.name}</span>
                            <button 
                              type="button"
                              className={styles.removeAttachmentBtn}
                              onClick={() => removeAttachment(index)}
                            >
                              ❌
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? '⏳ Đang gửi...' : <>📩 Gửi yêu cầu</>}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {activeSection === 'faq' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}><Icon name="help" size={24} /> Câu hỏi thường gặp</h2>
              <p className={styles.sectionDesc}>
                Tìm kiếm câu trả lời nhanh chóng cho những thắc mắc phổ biến
              </p>
            </div>
            
            <div className={styles.faqContainer}>
              {/* FAQ Search */}
              <div className={styles.faqSearch}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Icon name="search" size={20} style={{ position: 'absolute', left: '1rem', color: '#6b7280', zIndex: 1 }} />
                  <input 
                    type="text" 
                    className={styles.searchInput}
                    placeholder="Tìm kiếm câu hỏi..."
                    value={searchFAQ}
                    onChange={(e) => setSearchFAQ(e.target.value)}
                    style={{ paddingLeft: '3rem' }}
                  />
                </div>
              </div>
              
              {/* FAQ Categories */}
              <div className={styles.faqCategories}>
                {[...new Set(faqData.map(faq => faq.category))].map(category => (
                  <button 
                    key={category}
                    className={styles.categoryBtn}
                    onClick={() => setSearchFAQ(category)}
                  >
                    {category}
                  </button>
                ))}
                <button 
                  className={styles.categoryBtn}
                  onClick={() => setSearchFAQ('')}
                >
                  Tất cả
                </button>
              </div>
              
              {/* FAQ Items */}
              <div className={styles.faqList}>
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map(faq => (
                    <div key={faq.id} className={styles.faqItem}>
                      <button 
                        className={styles.faqQuestion}
                        onClick={() => toggleFAQ(faq.id)}
                      >
                        <span className={styles.questionText}>{faq.question}</span>
                        <span className={styles.questionIcon}>
                          {expandedFAQ === faq.id ? '−' : '+'}
                        </span>
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <div className={styles.faqAnswer}>
                          <div className={styles.answerContent}>
                            {faq.answer.split('\n').map((line, index) => (
                              <p key={index}>{line}</p>
                            ))}
                          </div>
                          <div className={styles.faqTags}>
                            {faq.tags.map(tag => (
                              <span key={tag} className={styles.faqTag}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className={styles.noResults}>
                    <p>Không tìm thấy câu hỏi nào phù hợp với từ khóa "{searchFAQ}"</p>
                    <button 
                      className={styles.clearSearchBtn}
                      onClick={() => setSearchFAQ('')}
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Branches Section */}
        {activeSection === 'branches' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}><Icon name="map" size={24} /> Hệ thống chi nhánh</h2>
              <p className={styles.sectionDesc}>
                Danh sách các cửa hàng KaKa Cosmetics trên toàn quốc
              </p>
            </div>
            
            <div className={styles.branchesContainer}>
              <div className={styles.branchesGrid}>
                {branches.map(branch => (
                  <div key={branch.id} className={styles.branchCard}>
                    <div className={styles.branchImage}>
                      <div className={styles.imagePlaceholder}>
                        <Icon name="store" size={32} />
                      </div>
                    </div>
                    
                    <div className={styles.branchInfo}>
                      <h3 className={styles.branchName}>{branch.name}</h3>
                      
                      <div className={styles.branchDetails}>
                        <div className={styles.branchItem}>
                          <span className={styles.branchIcon}><Icon name="map" size={16} /></span>
                          <span>{branch.address}</span>
                        </div>
                        
                        <div className={styles.branchItem}>
                          <span className={styles.branchIcon}><Icon name="phone" size={16} /></span>
                          <span>{branch.phone}</span>
                          <button 
                            className={styles.quickCallBtn}
                            onClick={() => handleQuickCall(branch.phone)}
                          >
                            Gọi
                          </button>
                        </div>
                        
                        <div className={styles.branchItem}>
                          <span className={styles.branchIcon}><Icon name="email" size={16} /></span>
                          <span>{branch.email}</span>
                        </div>
                        
                        <div className={styles.branchItem}>
                          <span className={styles.branchIcon}><Icon name="clock" size={16} /></span>
                          <span>{branch.hours}</span>
                        </div>
                      </div>
                      
                      <div className={styles.branchServices}>
                        <h4>Dịch vụ:</h4>
                        <div className={styles.servicesList}>
                          {branch.services.map((service, index) => (
                            <span key={index} className={styles.serviceTag}>
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className={styles.branchActions}>
                        <button 
                          className={styles.directionsBtn}
                          onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`, '_blank')}
                        >
                          <Icon name="map" size={16} /> Chỉ đường
                        </button>
                        <button 
                          className={styles.contactBtn}
                          onClick={() => handleQuickEmail(branch.email)}
                        >
                          <Icon name="email" size={16} /> Liên hệ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Social Media Section */}
        {activeSection === 'social' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}><Icon name="globe" size={24} /> Mạng xã hội & cộng đồng</h2>
              <p className={styles.sectionDesc}>
                Kết nối với chúng tôi trên các nền tảng xã hội để nhận tin tức và ưu đãi mới nhất
              </p>
            </div>
            
            <div className={styles.socialContainer}>
              <div className={styles.socialGrid}>
                {socialMedia.map(social => (
                  <div key={social.name} className={styles.socialCard}>
                    <div className={styles.socialHeader}>
                      <span className={styles.socialIcon}>{social.icon}</span>
                      <h3 className={styles.socialName}>{social.name}</h3>
                      <span className={styles.followersCount}>{social.followers} followers</span>
                    </div>
                    
                    <p className={styles.socialDescription}>{social.description}</p>
                    
                    <div className={styles.socialActions}>
                      <button 
                        className={styles.followBtn}
                        onClick={() => window.open(social.url, '_blank')}
                      >
                        <Icon name="link" size={16} /> Theo dõi
                      </button>
                      {social.active && (
                        <span className={styles.activeStatus}><Icon name="dot" size={12} style={{color: '#16a34a'}} /> Đang hoạt động</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Community Features */}
              <div className={styles.communitySection}>
                <h3 className={styles.communityTitle}><Icon name="users" size={24} /> Cộng đồng KaKa</h3>
                <div className={styles.communityFeatures}>
                  <div className={styles.featureCard}>
                    <h4><Icon name="messageCircle" size={18} /> Group hỏi đáp</h4>
                    <p>Tham gia nhóm Facebook để trao đổi kinh nghiệm làm đẹp</p>
                    <button className={styles.joinBtn}>Tham gia ngay</button>
                  </div>
                  
                  <div className={styles.featureCard}>
                    <h4><Icon name="book" size={18} /> Blog làm đẹp</h4>
                    <p>Đọc các bài viết hướng dẫn chăm sóc da chuyên sâu</p>
                    <button className={styles.readBtn}>Đọc blog</button>
                  </div>
                  
                  <div className={styles.featureCard}>
                    <h4>🎥 Video tutorials</h4>
                    <p>Xem video hướng dẫn trang điểm từ chuyên gia</p>
                    <button className={styles.watchBtn}>Xem video</button>
                  </div>
                  
                  <div className={styles.featureCard}>
                    <h4>📱 App mobile</h4>
                    <p>Tải app để nhận ưu đãi độc quyền và mua sắm tiện lợi</p>
                    <button className={styles.downloadBtn}>Tải app</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Tracking Section - GIAI ĐOẠN 7 & 8 */}
        {activeSection === 'tracking' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}><Icon name="map" size={24} /> Theo dõi đơn hàng</h2>
              <p className={styles.sectionDesc}>
                Kiểm tra tình trạng và vị trí đơn hàng của bạn trong quá trình giao hàng
              </p>
            </div>
            
            <div className={styles.trackingContainer}>
              {/* Search Order */}
              <div className={styles.trackingSearch}>
                <div className={styles.searchBox}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Icon name="search" size={20} style={{ position: 'absolute', left: '1rem', color: '#6b7280', zIndex: 1 }} />
                    <input
                      type="text"
                      className={styles.trackingInput}
                      placeholder="Nhập mã đơn hàng (VD: ORD123456)"
                      value={orderTracking.orderNumber}
                      onChange={(e) => setOrderTracking(prev => ({ ...prev, orderNumber: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleOrderTracking()}
                      style={{ paddingLeft: '3rem' }}
                    />
                  </div>
                  <button
                    className={styles.trackingButton}
                    onClick={handleOrderTracking}
                    disabled={orderTracking.loading}
                  >
                    {orderTracking.loading ? '⏳' : <Icon name="search" size={18} />} Tìm kiếm
                  </button>
                </div>
                {orderTracking.trackingError && (
                  <p className={styles.errorText}>{orderTracking.trackingError}</p>
                )}
              </div>

              {/* Order Details */}
              {orderTracking.orderData && (
                <div className={styles.orderDetails}>
                  <div className={styles.orderHeader}>
                    <h3><Icon name="package" size={20} /> Đơn hàng #{orderTracking.orderData.orderNumber}</h3>
                    <div className={styles.statusBadge}>
                      {getStatusIcon(orderTracking.orderData.status)} {orderTracking.orderData.statusText}
                    </div>
                  </div>

                  <div className={styles.orderContent}>
                    <div className={styles.orderTimeline}>
                      <h4><Icon name="timer" size={18} /> Lộ trình đơn hàng</h4>
                      <div className={styles.timeline}>
                        {orderTracking.orderData.timeline.map((item, index) => (
                          <div key={index} className={styles.timelineItem}>
                            <div className={styles.timelineDot}></div>
                            <div className={styles.timelineContent}>
                              <div className={styles.timelineTime}>
                                {new Date(item.time).toLocaleString('vi-VN')}
                              </div>
                              <div className={styles.timelineText}>{item.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.orderInfo}>
                      <h4>📋 Thông tin đơn hàng</h4>
                      <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Tổng tiền:</span>
                          <span className={styles.infoValue}>{orderTracking.orderData.total.toLocaleString('vnđ')}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Ngày đặt:</span>
                          <span className={styles.infoValue}>
                            {new Date(orderTracking.orderData.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Dự kiến giao:</span>
                          <span className={styles.infoValue}>
                            {new Date(orderTracking.orderData.estimatedDelivery).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Phương thức giao:</span>
                          <span className={styles.infoValue}>{orderTracking.orderData.shippingInfo.method}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.shippingAddress}>
                      <h4><Icon name="map" size={18} /> Địa chỉ giao hàng</h4>
                      <p>{orderTracking.orderData.shippingInfo.address}</p>
                      <p><Icon name="phone" size={16} /> {orderTracking.orderData.shippingInfo.phone}</p>
                    </div>

                    <div className={styles.orderItems}>
                      <h4>🛍️ Sản phẩm trong đơn</h4>
                      {orderTracking.orderData.items.map((item, index) => (
                        <div key={index} className={styles.itemRow}>
                          <span className={styles.itemIcon}>{item.image}</span>
                          <div className={styles.itemInfo}>
                            <div className={styles.itemName}>{item.name}</div>
                            <div className={styles.itemPrice}>
                              {item.price.toLocaleString('vnđ')} x {item.quantity}
                            </div>
                          </div>
                          <div className={styles.itemTotal}>
                            {(item.price * item.quantity).toLocaleString('vnđ')}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.trackingActions}>
                      <button 
                        className={styles.actionButton}
                        onClick={() => handleSupportRequest('review')}
                      >
                        <Icon name="document" size={16} /> Đánh giá sản phẩm
                      </button>
                      <button 
                        className={styles.actionButton}
                        onClick={() => window.open(`tel:19001234`, '_self')}
                      >
                        <Icon name="phone" size={16} /> Liên hệ hỗ trợ
                      </button>
                      {orderTracking.orderData.status === 'delivered' && (
                        <button 
                          className={styles.actionButton}
                          onClick={() => handleSupportRequest('return')}
                        >
                          <Icon name="document" size={16} /> Đổi trả hàng
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistics Section - GIAI ĐOẠN 9 */}
        {activeSection === 'statistics' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}><Icon name="barChart" size={24} /> Thống kê & Báo cáo</h2>
              <p className={styles.sectionDesc}>
                Xem thống kê mua sắm và hoạt động tài khoản của bạn
              </p>
            </div>
            
            <div className={styles.statisticsContainer}>
              {userStats ? (
                <div className={styles.statsGrid}>
                  {/* Tổng quan */}
                  <div className={styles.statsCard}>
                    <h3><Icon name="barChart" size={20} /> Tổng quan tài khoản</h3>
                    <div className={styles.statsRow}>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Tổng đơn hàng:</span>
                        <span className={styles.statValue}>{userStats.totalOrders}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Tổng chi tiêu:</span>
                        <span className={styles.statValue}>{userStats.totalSpent.toLocaleString('vnđ')}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Cấp độ thành viên:</span>
                        <span className={styles.statValue}>{userStats.memberLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Điểm tích lũy */}
                  <div className={styles.statsCard}>
                    <h3><Icon name="document" size={20} /> Điểm tích lũy</h3>
                    <div className={styles.pointsDisplay}>
                      <div className={styles.currentPoints}>
                        {userStats.points.toLocaleString()} điểm
                      </div>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ width: `${(userStats.points % 1000) / 10}%` }}
                        ></div>
                      </div>
                      <div className={styles.nextLevelInfo}>
                        Còn {userStats.pointsToNext} điểm để lên {userStats.nextLevel}
                      </div>
                    </div>
                  </div>

                  {/* Đơn hàng gần đây */}
                  <div className={styles.statsCard}>
                    <h3><Icon name="package" size={20} /> Đơn hàng gần đây</h3>
                    <div className={styles.recentOrders}>
                      {userStats.recentOrders.map((order, index) => (
                        <div key={index} className={styles.orderSummary}>
                          <div className={styles.orderId}>#{order.id}</div>
                          <div className={styles.orderDate}>{order.date}</div>
                          <div className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                            {getStatusText(order.status)}
                          </div>
                          <div className={styles.orderAmount}>{order.total.toLocaleString('vnđ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Danh mục yêu thích */}
                  <div className={styles.statsCard}>
                    <h3><Icon name="document" size={20} /> Danh mục yêu thích</h3>
                    <div className={styles.favoriteCategories}>
                      {userStats.favoriteCategories.map((category, index) => (
                        <span key={index} className={styles.categoryTag}>
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Xu hướng hàng tháng */}
                  <div className={styles.statsCard}>
                    <h3><Icon name="barChart" size={20} /> Xu hướng mua sắm</h3>
                    <div className={styles.trendChart}>
                      {userStats.monthlyTrend.map((data, index) => (
                        <div key={index} className={styles.trendItem}>
                          <div className={styles.trendMonth}>Tháng {data.month}</div>
                          <div className={styles.trendValue}>
                            {data.orders} đơn hàng - {data.amount.toLocaleString('vnđ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.loadingState}>
                  <p>🔄 Đang tải thống kê...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className={styles.notifications}>
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`${styles.notification} ${styles[notification.type]}`}
          >
            {notification.message}
          </div>
        ))}
      </div>
      
      {/* Floating Chat Button */}
      <button 
        className={styles.floatingChatBtn}
        onClick={() => handleQuickChat('zalo')}
        title="Chat với chúng tôi"
      >
        <Icon name="chat" size={24} />
      </button>
    </div>
  );
};

// Helper functions cho quy trình e-commerce
function getStatusIcon(status) {
  const statusIcons = {
    'confirmed': '✅',
    'packed': '📦',
    'shipping': '🚚',
    'delivered': '🏠',
    'cancelled': '❌'
  };
  return statusIcons[status] || '📄';
}

function getStatusText(status) {
  const statusTexts = {
    'confirmed': 'Đã xác nhận',
    'packed': 'Đã đóng gói', 
    'shipping': 'Đang vận chuyển',
    'delivered': 'Đã giao hàng',
    'cancelled': 'Đã hủy'
  };
  return statusTexts[status] || 'Chờ xử lý';
}

function getStatusClass(status) {
  const statusClasses = {
    'confirmed': 'status-confirmed',
    'packed': 'status-packed',
    'shipping': 'status-shipping',
    'delivered': 'status-delivered',
    'cancelled': 'status-cancelled'
  };
  return statusClasses[status] || 'status-pending';
}

export default HotroKH;