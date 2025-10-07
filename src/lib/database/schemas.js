// src/lib/database/schemas.js

// 🔹 (NEW) Freeze để tránh sửa nhầm runtime, export TABLES để tái sử dụng.
export const TABLES = Object.freeze({
  USERS: "users",
  ORDERS: "orders",
  PRODUCTS: "products",
  NOTIFICATIONS: "notifications",
});

export const UserSchema = Object.freeze({
  id: "String",
  email: "String",
  name: "String",
  avatar: "String",
  provider: "String",
  createdAt: "DateTime",
  updatedAt: "DateTime",

  profile: {
    firstName: "String",
    lastName: "String",
    phone: "String",
    gender: "String",
    birthDate: "Date",
    addresses: [
      {
        id: "String",
        name: "String",
        phone: "String",
        address: "String",
        ward: "String",
        district: "String",
        city: "String",
        isDefault: "Boolean",
        createdAt: "DateTime",
        updatedAt: "DateTime",
      },
    ],
    preferences: {
      emailNotifications: "Boolean",
      smsNotifications: "Boolean",
      promotionalEmails: "Boolean",
      orderUpdates: "Boolean",
      newProductAlerts: "Boolean",
      priceDropAlerts: "Boolean",
    },
  },

  orders: [
    {
      id: "String",
      orderDate: "DateTime",
      status: "String",
      total: "Number",
      items: [
        {
          id: "String",
          name: "String",
          price: "Number",
          quantity: "Number",
          image: "String",
        },
      ],
      shippingAddress: {
        name: "String",
        address: "String",
        phone: "String",
      },
      tracking: "String",
      estimatedDelivery: "Date",
    },
  ],

  wishlist: ["String"],
  loyaltyPoints: "Number",
  coupons: [
    {
      id: "String",
      code: "String",
      title: "String",
      description: "String",
      discount: "Number",
      discountType: "String",
      minOrder: "Number",
      maxDiscount: "Number",
      expiryDate: "DateTime",
      isUsed: "Boolean",
      earnedDate: "DateTime",
      usedDate: "DateTime",
    },
  ],
  paymentMethods: [
    {
      id: "String",
      type: "String",
      cardNumber: "String",
      maskedCardNumber: "String",
      cardHolder: "String",
      expiryDate: "String",
      bankName: "String",
      accountNumber: "String",
      accountHolder: "String",
      ewalletType: "String",
      ewalletPhone: "String",
      isDefault: "Boolean",
      createdAt: "DateTime",
      updatedAt: "DateTime",
    },
  ],
});

export const ProductSchema = Object.freeze({
  id: "String",
  name: "String",
  description: "String",
  price: "Number",
  originalPrice: "Number",
  discount: "Number",
  images: ["String"],
  brand: "String",
  category: "String",
  rating: "Number",
  reviewCount: "Number",
  inStock: "Boolean",
  createdAt: "DateTime",
  updatedAt: "DateTime",
});

export const OrderSchema = Object.freeze({
  id: "String",
  userId: "String",
  orderDate: "DateTime",
  status: "String",
  total: "Number",
  subtotal: "Number",
  shippingFee: "Number",
  discount: "Number",
  items: [
    { productId: "String", name: "String", price: "Number", quantity: "Number", image: "String" },
  ],
  shippingAddress: {
    name: "String",
    phone: "String",
    address: "String",
    ward: "String",
    district: "String",
    city: "String",
  },
  paymentMethod: { type: "String", details: "Object" },
  tracking: "String",
  estimatedDelivery: "Date",
  actualDelivery: "Date",
  createdAt: "DateTime",
  updatedAt: "DateTime",
});

export const NotificationSchema = Object.freeze({
  id: "String",
  userId: "String",
  type: "String", // 'order', 'promotion', 'system'
  title: "String",
  message: "String",
  isRead: "Boolean",
  action: {
    type: "String", // 'link', 'rate'
    label: "String",
    url: "String",
    orderId: "String",
  },
  createdAt: "DateTime",
});
