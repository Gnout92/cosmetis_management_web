// Frontend API Service Layer for Admin System
// Tất cả 23 functions được implement ở đây

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function để get auth token
const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token?.startsWith('Bearer ') ? token : `Bearer ${token}`;
};

// Helper function để handle API calls với error handling
const apiCall = async (endpoint, options = {}) => {
    try {
        const token = getAuthToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers.Authorization = token;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API call failed for ${endpoint}:`, error);
        throw error;
    }
};

// AUTHENTICATION FUNCTIONS

// Đăng nhập
export const loginUser = async (username, password) => {
    return apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
};

// Đăng ký
export const registerUser = async (userData) => {
    return apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
};

// Đăng xuất
export const logoutUser = async () => {
    try {
        await apiCall('/auth/logout', {
            method: 'POST'
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
};

// 1. PRODUCT FUNCTIONS

// 1.1 product.view - Xem sản phẩm
export const getProducts = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/products?${queryString}`);
};

// 1.2 product.create - Tạo sản phẩm
export const createProduct = async (productData) => {
    return apiCall('/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData)
    });
};

// 1.3 product.update - Cập nhật sản phẩm
export const updateProduct = async (productId, productData) => {
    return apiCall(`/admin/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
    });
};

// 1.4 product.delete_soft - Ẩn sản phẩm khỏi FE
export const hideProduct = async (productId) => {
    return apiCall(`/admin/products/${productId}/hide`, {
        method: 'PUT'
    });
};

// 1.5 product.price_update - Đổi giá sản phẩm
export const updateProductPrice = async (productId, price) => {
    return apiCall(`/admin/products/${productId}/price`, {
        method: 'PUT',
        body: JSON.stringify({ price })
    });
};

// 1.6 product.media_update - Cập nhật hình ảnh
export const addProductImage = async (productId, imageData) => {
    return apiCall(`/admin/products/${productId}/images`, {
        method: 'POST',
        body: JSON.stringify(imageData)
    });
};

// 1.7 product.tag_manage - Quản lý tag/thuộc tính SP
export const updateProductTags = async (productId, tags) => {
    return apiCall(`/admin/products/${productId}/tags`, {
        method: 'POST',
        body: JSON.stringify({ tags })
    });
};

// 2. CUSTOMER FUNCTIONS

// 2.1 customer.view - Xem KH
export const getCustomers = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/customers?${queryString}`);
};

// 2.2 customer.update - Cập nhật KH
export const updateCustomer = async (customerId, customerData) => {
    return apiCall(`/admin/customers/${customerId}`, {
        method: 'PUT',
        body: JSON.stringify(customerData)
    });
};

// 2.3 customer.purchase_history.view - Xem lịch sử mua
export const getCustomerOrders = async (customerId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/customers/${customerId}/orders?${queryString}`);
};

// 2.4 cart.manage_self - Giỏ hàng cá nhân
export const getCartItems = async () => {
    return apiCall('/admin/cart');
};

// 3. ORDER FUNCTIONS

// 3.1 order.create - Tạo đơn hàng
export const createOrder = async (orderData) => {
    return apiCall('/admin/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
    });
};

// 3.2 order.view_all - Xem tất cả đơn
export const getOrders = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/orders?${queryString}`);
};

// 3.3 order.set_status - Đặt trạng thái đơn
export const updateOrderStatus = async (orderId, status) => {
    return apiCall(`/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    });
};

// 4. STOCK FUNCTIONS

// 4.1 stock.view - Xem tồn kho
export const getStockItems = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/stock?${queryString}`);
};

// 4.2 stock.adjust - Điều chỉnh nhập/xuất
export const adjustStock = async (adjustmentData) => {
    return apiCall('/admin/stock/adjust', {
        method: 'POST',
        body: JSON.stringify(adjustmentData)
    });
};

// 5. REVIEW FUNCTIONS

// 5.1 review.create_self - Tạo đánh giá
export const createReview = async (reviewData) => {
    return apiCall('/admin/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData)
    });
};

// 5.2 review.moderate - Duyệt/ẩn review
export const moderateReview = async (reviewId, isApproved) => {
    return apiCall(`/admin/reviews/${reviewId}/moderate`, {
        method: 'PUT',
        body: JSON.stringify({ is_approved: isApproved })
    });
};

// 6. PROMOTION FUNCTIONS

// 6.1 promo.view - Xem khuyến mãi
export const getPromotions = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/promotions?${queryString}`);
};

// 6.2 promo.manage - Quản lý khuyến mãi
export const createPromotion = async (promotionData) => {
    return apiCall('/admin/promotions', {
        method: 'POST',
        body: JSON.stringify(promotionData)
    });
};

// 7. SYSTEM FUNCTIONS

// 7.2 profile.update_self - Cập nhật hồ sơ
export const updateProfile = async (profileData) => {
    return apiCall('/admin/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
    });
};

// Google Login authentication
export const googleLogin = async (googleToken) => {
    try {
        const response = await apiCall('/api/auth/google', {
            method: 'POST',
            body: JSON.stringify({ token: googleToken })
        });

        if (response.success) {
            // Store token
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        }
        throw new Error(response.message || 'Google login failed');
    } catch (error) {
        console.error('Google login failed:', error);
        throw error;
    }
};

// Public search functionality
export const publicSearch = async (query, filters = {}) => {
    try {
        const params = new URLSearchParams({
            q: query,
            ...filters
        });

        const response = await apiCall(`/api/search?${params}`, {
            method: 'GET'
        });

        if (response.success) {
            return response.data;
        }
        throw new Error(response.message || 'Search failed');
    } catch (error) {
        console.error('Public search failed:', error);
        throw error;
    }
};

// Update promotion
export const updatePromotion = async (promotionId, promotionData) => {
    try {
        const response = await apiCall(`/api/promotions/${promotionId}`, {
            method: 'PUT',
            body: JSON.stringify(promotionData)
        });

        if (response.success) {
            return response.data;
        }
        throw new Error(response.message || 'Failed to update promotion');
    } catch (error) {
        console.error('Update promotion failed:', error);
        throw error;
    }
};

// Delete promotion
export const deletePromotion = async (promotionId) => {
    try {
        const response = await apiCall(`/api/promotions/${promotionId}`, {
            method: 'DELETE'
        });

        if (response.success) {
            return response.data;
        }
        throw new Error(response.message || 'Failed to delete promotion');
    } catch (error) {
        console.error('Delete promotion failed:', error);
        throw error;
    }
};

// 7.3 search.use_public - Tìm kiếm công khai (Client-side)
// Sẽ implement trong components

// 8. ADMIN FUNCTIONS

// Get users
export const getUsers = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/users?${queryString}`);
};

// Get statistics
export const getStats = async () => {
    return apiCall('/admin/stats');
};

// Create user
export const createUser = async (userData) => {
    return apiCall('/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
};

// Update user role
export const updateUserRole = async (userId, role) => {
    return apiCall(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role })
    });
};

// Reset user password
export const resetUserPassword = async (userId, newPassword) => {
    return apiCall(`/admin/users/${userId}/reset-password`, {
        method: 'PUT',
        body: JSON.stringify({ newPassword })
    });
};

// Toggle user status
export const toggleUserStatus = async (userId, isActive) => {
    return apiCall(`/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        body: JSON.stringify({ isActive })
    });
};

// Utility functions

// Format price
export const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
};

// Format date
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Check permission
export const hasPermission = async (permissionKey) => {
    try {
        // Trong thực tế, sẽ có endpoint để kiểm tra quyền
        // Hiện tại return true để demo
        return true;
    } catch (error) {
        console.error('Permission check failed:', error);
        return false;
    }
};

// Get user permissions
export const getUserPermissions = async () => {
    try {
        // Sẽ implement endpoint này trong backend
        // Hiện tại return default permissions
        return [
            'product.view', 'product.create', 'product.update', 'product.delete_soft',
            'product.price_update', 'product.media_update', 'product.tag_manage',
            'customer.view', 'customer.update', 'customer.purchase_history.view',
            'cart.manage_self', 'order.create', 'order.view_all', 'order.set_status',
            'stock.view', 'stock.adjust', 'review.create_self', 'review.moderate',
            'promo.view', 'promo.manage', 'auth.login_google', 'profile.update_self',
            'search.use_public'
        ];
    } catch (error) {
        console.error('Get permissions failed:', error);
        return [];
    }
};

// Error handling helper
export const handleApiError = (error) => {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
    }
    
    if (error.message.includes('401')) {
        return 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.';
    }
    
    if (error.message.includes('403')) {
        return 'Bạn không có quyền thực hiện hành động này.';
    }
    
    if (error.message.includes('404')) {
        return 'Không tìm thấy dữ liệu yêu cầu.';
    }
    
    return error.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
};

export default {
    // Authentication
    loginUser,
    registerUser,
    logoutUser,
    
    // Product functions
    getProducts,
    createProduct,
    updateProduct,
    hideProduct,
    updateProductPrice,
    addProductImage,
    updateProductTags,
    
    // Customer functions
    getCustomers,
    updateCustomer,
    getCustomerOrders,
    getCartItems,
    
    // Order functions
    createOrder,
    getOrders,
    updateOrderStatus,
    
    // Stock functions
    getStockItems,
    adjustStock,
    
    // Review functions
    createReview,
    moderateReview,
    
    // Promotion functions
    getPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
    
    // System functions
    updateProfile,
    googleLogin,
    publicSearch,
    
    // Admin functions
    getUsers,
    getStats,
    createUser,
    updateUserRole,
    resetUserPassword,
    toggleUserStatus,
    
    // Utilities
    formatPrice,
    formatDate,
    hasPermission,
    getUserPermissions,
    handleApiError
};