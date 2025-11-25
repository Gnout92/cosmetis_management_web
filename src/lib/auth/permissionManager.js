// src/lib/auth/permissionManager.js
// Hệ thống quản lý phân quyền RBAC hoàn chỉnh

import jwt from 'jsonwebtoken';
import styles from '../../styles/NoiBo/QLSP.module.css';
// Mapping quyền cho từng vai trò dựa trên database
const ROLE_PERMISSIONS = {
  'Admin': [
    // Quyền sản phẩm (7)
    'product.view', 'product.create', 'product.update', 'product.delete_soft',
    'product.price_update', 'product.media_update', 'product.tag_manage',
    
    // Quyền khách hàng (4) 
    'customer.view', 'customer.update', 'customer.purchase_history.view', 'review.moderate',
    
    // Quyền kho (2)
    'stock.view', 'stock.adjust', 
    
    // Quyền đơn hàng (3)
    'order.create', 'order.view_all', 'order.set_status',
    
    // Quyền khuyến mãi (2)
    'promo.view', 'promo.manage',
    
    // Quyền hệ thống (5)
    'auth.login_google', 'profile.update_self', 'search.use_public',
    'cart.manage_self', 'review.create_self'
  ],

  'QL_SanPham': [
    // Quyền sản phẩm (7)
    'product.view', 'product.create', 'product.update', 'product.delete_soft',
    'product.price_update', 'product.media_update', 'product.tag_manage',
    
    // Quyền khuyến mãi (1)
    'promo.manage',
    
    // Quyền đánh giá (1)
    'review.moderate',
    
    // Quyền hệ thống cơ bản (6)
    'search.use_public', 'profile.update_self', 'auth.login_google',
    'cart.manage_self', 'review.create_self', 'product.view'
  ],

  'QL_KhachHang': [
    // Quyền khách hàng (4)
    'customer.view', 'customer.update', 'customer.purchase_history.view', 'review.moderate',
    
    // Quyền sản phẩm (1)
    'product.view',
    
    // Quyền hệ thống cơ bản (6)
    'search.use_public', 'profile.update_self', 'auth.login_google',
    'cart.manage_self', 'review.create_self', 'order.create'
  ],

  'QL_Kho': [
    // Quyền kho (2)
    'stock.view', 'stock.adjust',
    
    // Quyền sản phẩm (1)
    'product.view',
    
    // Quyền hệ thống cơ bản (5)
    'search.use_public', 'profile.update_self', 'auth.login_google',
    'cart.manage_self', 'review.create_self'
  ],

  'Customer': [
    // Quyền khách hàng (3)
    'customer.update', 'customer.purchase_history.view', 'cart.manage_self',
    
    // Quyền sản phẩm (1)
    'product.view',
    
    // Quyền đơn hàng (1)
    'order.create',
    
    // Quyền đánh giá (2)
    'review.create_self',
    
    // Quyền hệ thống cơ bản (4)
    'search.use_public', 'profile.update_self', 'auth.login_google', 'promo.view'
  ]
};

// 23 chức năng chi tiết với phân nhóm
export const ALL_FUNCTIONS = {
  // NHÓM SẢN PHẨM (8 chức năng)
  'Xem SP': {
    permission: 'product.view',
    group: 'Sản Phẩm',
    icon: 'Eye',
    description: 'Xem danh sách sản phẩm'
  },
  'Tạo SP': {
    permission: 'product.create',
    group: 'Sản Phẩm', 
    icon: 'Plus',
    description: 'Tạo sản phẩm mới'
  },
  'Cập nhật SP': {
    permission: 'product.update',
    group: 'Sản Phẩm',
    icon: 'Edit',
    description: 'Cập nhật thông tin sản phẩm'
  },
  'Đổi giá': {
    permission: 'product.price_update',
    group: 'Sản Phẩm',
    icon: 'DollarSign',
    description: 'Thay đổi giá sản phẩm'
  },
  'Ẩn sản phẩm': {
    permission: 'product.delete_soft',
    group: 'Sản Phẩm',
    icon: 'EyeOff',
    description: 'Ẩn sản phẩm khỏi giao diện'
  },
  'Cập nhật hình ảnh': {
    permission: 'product.media_update',
    group: 'Sản Phẩm',
    icon: 'Image',
    description: 'Quản lý hình ảnh sản phẩm'
  },
  'Tag/thuộc tính': {
    permission: 'product.tag_manage',
    group: 'Sản Phẩm',
    icon: 'Tag',
    description: 'Quản lý tag và thuộc tính'
  },
  'Quản lý danh mục': {
    permission: 'product.tag_manage',
    group: 'Sản Phẩm',
    icon: 'Folder',
    description: 'Quản lý danh mục sản phẩm'
  },

  // NHÓM KHÁCH HÀNG (7 chức năng)
  'Xem KH': {
    permission: 'customer.view',
    group: 'Khách Hàng',
    icon: 'Users',
    description: 'Xem danh sách khách hàng'
  },
  'Cập nhật KH': {
    permission: 'customer.update',
    group: 'Khách Hàng',
    icon: 'User',
    description: 'Cập nhật thông tin khách hàng'
  },
  'Lịch sử mua': {
    permission: 'customer.purchase_history.view',
    group: 'Khách Hàng',
    icon: 'History',
    description: 'Xem lịch sử mua hàng'
  },
  'Giỏ hàng cá nhân': {
    permission: 'cart.manage_self',
    group: 'Khách Hàng',
    icon: 'ShoppingCart',
    description: 'Quản lý giỏ hàng'
  },
  'Đánh giá': {
    permission: 'review.create_self',
    group: 'Khách Hàng',
    icon: 'Star',
    description: 'Tạo đánh giá sản phẩm'
  },
  'Duyệt đánh giá': {
    permission: 'review.moderate',
    group: 'Khách Hàng',
    icon: 'CheckCircle',
    description: 'Duyệt và quản lý đánh giá'
  },
  'Hồ sơ cá nhân': {
    permission: 'profile.update_self',
    group: 'Khách Hàng',
    icon: 'User',
    description: 'Cập nhật hồ sơ cá nhân'
  },

  // NHÓM KHO (5 chức năng)
  'Xem tồn kho': {
    permission: 'stock.view',
    group: 'Kho',
    icon: 'Package',
    description: 'Xem số lượng tồn kho'
  },
  'Điều chỉnh nhập/xuất': {
    permission: 'stock.adjust',
    group: 'Kho',
    icon: 'TrendingUp',
    description: 'Điều chỉnh nhập xuất kho'
  },
  'Lịch sử kho': {
    permission: 'stock.view',
    group: 'Kho',
    icon: 'Clock',
    description: 'Xem lịch sử nhập xuất'
  },
  'Quản lý kho': {
    permission: 'stock.view',
    group: 'Kho',
    icon: 'Warehouse',
    description: 'Quản lý thông tin kho'
  },
  'Báo cáo tồn': {
    permission: 'stock.view',
    group: 'Kho',
    icon: 'BarChart',
    description: 'Báo cáo tồn kho'
  },

  // NHÓM ĐƠN HÀNG (3 chức năng)
  'Tạo đơn hàng': {
    permission: 'order.create',
    group: 'Đơn Hàng',
    icon: 'FileText',
    description: 'Tạo đơn hàng mới'
  },
  'Xem tất cả đơn': {
    permission: 'order.view_all',
    group: 'Đơn Hàng',
    icon: 'List',
    description: 'Xem tất cả đơn hàng'
  },
  'Đặt trạng thái đơn': {
    permission: 'order.set_status',
    group: 'Đơn Hàng',
    icon: 'Settings',
    description: 'Thay đổi trạng thái đơn hàng'
  }
};

/**
 * Kiểm tra người dùng có quyền thực hiện hành động này không
 * @param {Object} user - Thông tin người dùng từ database
 * @param {string} permission - Quyền cần kiểm tra
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.vai_tro) return false;
  
  const role = user.vai_tro;
  const permissions = ROLE_PERMISSIONS[role] || [];
  
  return permissions.includes(permission);
};

/**
 * Lấy danh sách chức năng theo vai trò
 * @param {string} role - Vai trò người dùng
 * @returns {Array} Danh sách chức năng
 */
export const getFunctionsByRole = (role) => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  
  return Object.entries(ALL_FUNCTIONS)
    .filter(([_, config]) => permissions.includes(config.permission))
    .map(([name, config]) => ({
      id: name.toLowerCase().replace(/\s+/g, '_'),
      name,
      ...config
    }));
};

/**
 * Lấy menu items cho sidebar dựa trên vai trò
 * @param {string} role - Vai trò người dùng
 * @returns {Array} Menu items đã phân nhóm
 */
export const getMenuItemsByRole = (role) => {
  const functions = getFunctionsByRole(role);
  
  // Nhóm chức năng theo group
  const grouped = functions.reduce((acc, func) => {
    if (!acc[func.group]) {
      acc[func.group] = [];
    }
    acc[func.group].push(func);
    return acc;
  }, {});

  // Chuyển thành menu structure
  return Object.entries(grouped).map(([groupName, items]) => ({
    id: groupName.toLowerCase().replace(/\s+/g, '_'),
    name: groupName,
    icon: getGroupIcon(groupName),
    items: items,
    collapsed: false
  }));
};

/**
 * Lấy icon cho nhóm chức năng
 */
const getGroupIcon = (groupName) => {
  const iconMap = {
    'Sản Phẩm': 'Package',
    'Khách Hàng': 'Users',
    'Kho': 'Warehouse',
    'Đơn Hàng': 'FileText',
    'Hệ Thống': 'Settings'
  };
  return iconMap[groupName] || 'Settings';
};

/**
 * Lấy tất cả 23 chức năng (Admin có thể thấy tất cả)
 * @returns {Array} Tất cả chức năng
 */
export const getAllFunctions = () => {
  return Object.entries(ALL_FUNCTIONS).map(([name, config]) => ({
    id: name.toLowerCase().replace(/\s+/g, '_'),
    name,
    ...config
  }));
};

/**
 * Kiểm tra token JWT có hợp lệ không
 * @param {string} token - JWT token
 * @returns {boolean}
 */
export const validateToken = (token) => {
  try {
    if (!token) return false;
    
    // Kiểm tra basic JWT structure
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode payload để kiểm tra expiration
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    // Kiểm tra expired
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  hasPermission,
  getFunctionsByRole,
  getMenuItemsByRole,
  getAllFunctions,
  validateToken,
  ROLE_PERMISSIONS,
  ALL_FUNCTIONS
};