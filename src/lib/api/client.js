// Frontend API Client cho Admin Dashboard
// Đơn giản hóa để tránh lỗi import

// Mock API structure - sẽ được thay thế bằng API thật sau
const api = {
  auth: {
    getCurrentUser: async () => {
      // Mock implementation
      return {
        success: true,
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@mypham.com',
          vai_tro: 'Admin'
        }
      };
    },
    login: async (credentials) => {
      return { success: true, token: 'mock-token' };
    },
    logout: async () => {
      return { success: true };
    }
  },
  admin: {
    getStats: async (period = '30d') => {
      // Mock data cho dashboard stats
      return {
        success: true,
        stats: {
          totalUsers: 1250,
          totalProducts: 340,
          totalOrders: 892,
          totalRevenue: 15680000
        }
      };
    },
    getUsers: async (params = {}) => ({
      success: true,
      users: [],
      total: 0,
      page: 1,
      limit: 50
    }),
    updateUser: async (id, data) => ({ success: true }),
    deleteUser: async (id) => ({ success: true })
  },
  products: {
    getProducts: async (params = {}) => {
      return {
        success: true,
        products: [],
        total: 0,
        page: 1,
        limit: 50
      };
    },
    getProduct: async (id) => ({
      success: true,
      product: null
    }),
    createProduct: async (data) => ({ success: true }),
    updateProduct: async (id, data) => ({ success: true }),
    deleteProduct: async (id) => ({ success: true }),
    uploadImage: async (file) => ({ success: true, url: 'mock-url' })
  },
  customers: {
    getCustomers: async (params = {}) => {
      return {
        success: true,
        customers: [],
        total: 0,
        page: 1,
        limit: 50
      };
    },
    getCustomer: async (id) => ({
      success: true,
      customer: null
    }),
    updateCustomer: async (id, data) => ({ success: true })
  },
  orders: {
    getAllOrders: async (params = {}) => {
      return {
        success: true,
        orders: [],
        total: 0,
        page: 1,
        limit: 50
      };
    },
    getMyOrders: async (params = {}) => {
      return {
        success: true,
        orders: [],
        total: 0,
        page: 1,
        limit: 50
      };
    },
    getOrder: async (id) => ({
      success: true,
      order: null
    }),
    updateOrderStatus: async (id, status) => ({ success: true })
  },
  stock: {
    getStocks: async (params = {}) => {
      return {
        success: true,
        stocks: [],
        total: 0,
        page: 1,
        limit: 50
      };
    },
    getLowStock: async () => ({ success: true, stocks: [] }),
    updateStock: async (id, data) => ({ success: true })
  },
  reviews: {
    getReviews: async (params = {}) => ({
      success: true,
      reviews: [],
      total: 0
    }),
    deleteReview: async (id) => ({ success: true })
  },
  promotions: {
    getPromotions: async () => ({
      success: true,
      promotions: []
    }),
    createPromotion: async (data) => ({ success: true }),
    updatePromotion: async (id, data) => ({ success: true }),
    deletePromotion: async (id) => ({ success: true })
  },
  search: {
    search: async (query, filters = {}) => ({
      success: true,
      results: [],
      total: 0
    }),
    searchProducts: async (query, filters = {}) => ({
      success: true,
      products: [],
      total: 0
    })
  },
  cart: {
    getCart: async () => ({ success: true, items: [] }),
    updateCartItem: async (itemId, quantity) => ({ success: true }),
    removeCartItem: async (itemId) => ({ success: true }),
    clearCart: async () => ({ success: true })
  },
  categories: {
    getCategories: async () => ({
      success: true,
      categories: []
    }),
    createCategory: async (data) => ({ success: true }),
    updateCategory: async (id, data) => ({ success: true }),
    deleteCategory: async (id) => ({ success: true })
  },
  utils: {
    exportData: async (type, format) => ({ success: true, url: 'mock-url' }),
    uploadFile: async (file) => ({ success: true, url: 'mock-url' })
  }
};

// Export default
export default api;