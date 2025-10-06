// Database Schema (Sử dụng với MongoDB/Mongoose hoặc SQL)

// User Schema
const UserSchema = {
  id: 'String', // Primary key
  email: 'String', // Email từ Google OAuth
  name: 'String', // Tên hiển thị
  avatar: 'String', // URL ảnh đại diện
  provider: 'String', // 'google'
  createdAt: 'DateTime',
  updatedAt: 'DateTime',
  
  // Thông tin cá nhân
  profile: {
    firstName: 'String',
    lastName: 'String',
    phone: 'String',
    gender: 'String', // 'male', 'female', 'other'
    birthDate: 'Date',
    
    // Địa chỉ giao hàng
    addresses: [{
      id: 'String',
      name: 'String', // Tên người nhận
      phone: 'String',
      address: 'String', // Địa chỉ cụ thể
      ward: 'String', // Phường/Xã
      district: 'String', // Quận/Huyện
      city: 'String', // Tỉnh/Thành phố
      isDefault: 'Boolean',
      createdAt: 'DateTime',
      updatedAt: 'DateTime'
    }],
    
    // Cài đặt thông báo
    preferences: {
      emailNotifications: 'Boolean',
      smsNotifications: 'Boolean',
      promotionalEmails: 'Boolean',
      orderUpdates: 'Boolean',
      newProductAlerts: 'Boolean',
      priceDropAlerts: 'Boolean'
    }
  },
  
  // Đơn hàng
  orders: [{
    id: 'String',
    orderDate: 'DateTime',
    status: 'String', // 'pending', 'shipped', 'delivered', 'cancelled'
    total: 'Number',
    items: [{
      id: 'String',
      name: 'String',
      price: 'Number',
      quantity: 'Number',
      image: 'String'
    }],
    shippingAddress: {
      name: 'String',
      address: 'String',
      phone: 'String'
    },
    tracking: 'String',
    estimatedDelivery: 'Date'
  }],
  
  // Danh sách yêu thích
  wishlist: ['String'], // Mảng các product ID
  
  // Điểm thưởng
  loyaltyPoints: 'Number',
  
  // Coupon/Voucher
  coupons: [{
    id: 'String',
    code: 'String',
    title: 'String',
    description: 'String',
    discount: 'Number',
    discountType: 'String', // 'percentage', 'fixed'
    minOrder: 'Number',
    maxDiscount: 'Number',
    expiryDate: 'DateTime',
    isUsed: 'Boolean',
    earnedDate: 'DateTime',
    usedDate: 'DateTime'
  }],
  
  // Phương thức thanh toán
  paymentMethods: [{
    id: 'String',
    type: 'String', // 'card', 'bank', 'ewallet'
    
    // Thông tin thẻ tín dụng
    cardNumber: 'String', // Mã hóa
    maskedCardNumber: 'String', // **** **** **** 1234
    cardHolder: 'String',
    expiryDate: 'String',
    
    // Thông tin ngân hàng
    bankName: 'String',
    accountNumber: 'String', // Mã hóa
    accountHolder: 'String',
    
    // Thông tin ví điện tử
    ewalletType: 'String', // 'momo', 'zalopay', 'vnpay'
    ewalletPhone: 'String',
    
    isDefault: 'Boolean',
    createdAt: 'DateTime',
    updatedAt: 'DateTime'
  }]
};

// Product Schema (cho reference)
const ProductSchema = {
  id: 'String',
  name: 'String',
  description: 'String',
  price: 'Number',
  originalPrice: 'Number',
  discount: 'Number',
  images: ['String'],
  brand: 'String',
  category: 'String',
  rating: 'Number',
  reviewCount: 'Number',
  inStock: 'Boolean',
  createdAt: 'DateTime',
  updatedAt: 'DateTime'
};

// Order Schema (chi tiết)
const OrderSchema = {
  id: 'String',
  userId: 'String',
  orderDate: 'DateTime',
  status: 'String',
  total: 'Number',
  subtotal: 'Number',
  shippingFee: 'Number',
  discount: 'Number',
  
  items: [{
    productId: 'String',
    name: 'String',
    price: 'Number',
    quantity: 'Number',
    image: 'String'
  }],
  
  shippingAddress: {
    name: 'String',
    phone: 'String',
    address: 'String',
    ward: 'String',
    district: 'String',
    city: 'String'
  },
  
  paymentMethod: {
    type: 'String',
    details: 'Object'
  },
  
  tracking: 'String',
  estimatedDelivery: 'Date',
  actualDelivery: 'Date',
  
  createdAt: 'DateTime',
  updatedAt: 'DateTime'
};

// Notification Schema
const NotificationSchema = {
  id: 'String',
  userId: 'String',
  type: 'String', // 'order', 'promotion', 'system'
  title: 'String',
  message: 'String',
  isRead: 'Boolean',
  action: {
    type: 'String', // 'link', 'rate'
    label: 'String',
    url: 'String',
    orderId: 'String'
  },
  createdAt: 'DateTime'
};

export {
  UserSchema,
  ProductSchema,
  OrderSchema,
  NotificationSchema
};