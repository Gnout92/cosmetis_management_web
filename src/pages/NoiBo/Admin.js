import React, { useState, useEffect } from 'react';
import styles from '../../styles/NoiBo/Admin.module.css';

// Helper function để lấy text trạng thái đơn hàng
const getOrderStatusText = (status) => {
  const statusMap = {
    'PENDING': 'Chờ xử lý',
    'SHIPPING': 'Đang giao',
    'DELIVERED': 'Đã giao',
    'FAILED': 'Thất bại',
    'CANCELLED': 'Đã hủy',
    'pending': 'Chờ xử lý',
    'shipping': 'Đang giao',
    'delivered': 'Đã giao',
    'failed': 'Thất bại',
    'cancelled': 'Đã hủy'
  };
  return statusMap[status] || status;
};

// Enhanced Icon Components với styling hiện đại
const Icon = ({ name, className = "", size = "20" }) => {
  const iconProps = {
    className: `${className} ${styles.icon}`,
    style: { width: size, height: size }
  };
  
  const icons = {
    // Product Management Icons
    eye: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>,
    plus: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>,
    pencil: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>,
    eyeSlash: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>,
    currency: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>,
    camera: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>,
    tag: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>,

    // Customer Management Icons
    user: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>,
    users: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>,
    clipboard: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>,
    shoppingCart: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5-5M7 13l-2.5 5m6.5-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
    </svg>,
    
    // Order Management Icons
    cube: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>,
    checkCircle: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>,
    
    // Review Management Icons
    star: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>,
    
    // System Icons
    magnifyingGlass: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>,
    gift: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>,
    crown: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>,
    
    // Stock Management Icons
    chartBar: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>,
    trendingUp: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>,
    
    // Authentication Icons
    lock: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>,
    
    // Category Icons
    home: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>,
    settings: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>,
    
    // Additional Icons for 38 Functions
    userCircle: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>,
    idCard: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
    </svg>,
    key: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.414-6.414A6 6 0 1121 9z" />
    </svg>,
    shield: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>,
    folder: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>,
    check: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>,
    document: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>,
    x: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>,
    archive: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8M9 12h6" />
    </svg>,
    refresh: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>,
    upload: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>,
    download: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
    </svg>,
    trash: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>,
    folderOpen: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
    </svg>,
    chartLine: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>,
    truck: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    </svg>,
    map: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 6-3 .553.894a1 1 0 01.447.894v10.764a1 1 0 01-.553.894L15 18l-6-3z" />
    </svg>,
    phone: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>,
    globe: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>,
    creditCard: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>,
    clock: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>,
    // Logout và các icon khác
    logout: <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  };

  return icons[name] || icons.user;
};

// Helper function để fetch dữ liệu từ API với authentication
const fetchData = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      }
    });
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
};

// Helper function để hiển thị trạng thái với color coding
const getStatusBadge = (status, type = 'default') => {
  const baseClasses = 'status-badge';
  let statusClasses = '';
  
  if (type === 'order') {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'chờ xử lý':
        statusClasses = 'status-pending';
        break;
      case 'shipping':
      case 'đang giao':
        statusClasses = 'status-shipping';
        break;
      case 'delivered':
      case 'đã giao':
        statusClasses = 'status-delivered';
        break;
      case 'failed':
      case 'thất bại':
        statusClasses = 'status-failed';
        break;
      case 'cancelled':
      case 'đã hủy':
        statusClasses = 'status-cancelled';
        break;
      default:
        statusClasses = 'status-default';
    }
  } else if (type === 'stock') {
    const available = parseInt(status) || 0;
    if (available === 0) {
      statusClasses = 'status-out-of-stock';
    } else if (available <= 10) {
      statusClasses = 'status-low-stock';
    } else {
      statusClasses = 'status-in-stock';
    }
  } else if (type === 'product') {
    statusClasses = status ? 'status-hidden' : 'status-active';
  }
  
  return `${baseClasses} ${statusClasses}`;
};

// Modern Loading Spinner Component
const LoadingSpinner = () => (
  <div className={styles.loading}>
    <div className={styles.spinner}></div>
    <p style={{ fontSize: '16px', fontWeight: '500', color: '#6b7280' }}>Đang tải dữ liệu...</p>
  </div>
);

// Modern Empty State Component
const EmptyState = ({ onRefresh }) => (
  <div className={styles.emptyState}>
    <Icon name="document" size="64" className={styles.emptyIcon} />
    <h3 className={styles.emptyTitle}>Chọn một chức năng</h3>
    <p className={styles.emptyDescription}>
      Vui lòng chọn một chức năng từ menu bên trái để bắt đầu quản lý.
    </p>
  </div>
);

// Render functions cho từng loại chức năng với dữ liệu từ database thực
const renderProductManagement = (functionKey, functionData, loadingData) => {
  const products = functionData.products || [];
  
  return (
    <div className={styles.managementSection}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{products.length}</div>
          <div className={styles.statLabel}>Tổng sản phẩm</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{products.filter(p => !p.is_an).length}</div>
          <div className={styles.statLabel}>Đang hiển thị</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{products.filter(p => p.is_an === 1 || p.is_an === true).length}</div>
          <div className={styles.statLabel}>Đã ẩn</div>
        </div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.sectionHeader}>
          <h3>Quản lý Sản phẩm</h3>
          {(functionKey === 'product.create' || functionKey === 'products.view') && hasPermission(functionKey) && (
            <button className={styles.primaryButton} onClick={() => {
              console.log('Add new product');
            }}>
              <Icon name="plus" size="18" />
              Thêm sản phẩm mới
            </button>
          )}
        </div>
        
        <div className={styles.dataTableContainer}>
          {loadingData ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Đang tải dữ liệu sản phẩm từ database...</p>
            </div>
          ) : (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.MaSanPham}>
                    <td>{product.MaSanPham}</td>
                    <td>{product.TenSanPham}</td>
                    <td>{product.categoryName || product.MaDanhMuc}</td>
                    <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.Gia)}</td>
                    <td>
                      <span className={getStatusBadge(product.is_an, 'product')}>
                        {(product.is_an === 1 || product.is_an === true) ? 'Đã ẩn' : 'Hiển thị'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionButton} title="Xem chi tiết">
                          <Icon name="eye" size="16" />
                        </button>
                        {(functionKey === 'product.update' || functionKey === 'product.delete') && hasPermission(functionKey) && (
                          <>
                            <button className={styles.actionButton} title="Chỉnh sửa">
                              <Icon name="pencil" size="16" />
                            </button>
                            {functionKey === 'product.delete' && (
                              <button className={styles.actionButton} title="Xóa sản phẩm">
                                <Icon name="trash" size="16" />
                              </button>
                            )}
                            <button className={styles.actionButton} title="Cập nhật hình ảnh">
                              <Icon name="camera" size="16" />
                            </button>
                            <button className={styles.actionButton} title="Quản lý tags">
                              <Icon name="tag" size="16" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                      Chưa có sản phẩm nào trong database
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const renderCustomerManagement = (functionKey, functionData, loadingData) => {
  const customers = functionData.customers || [];
  const isViewOnly = functionKey === 'customer.view';
  
  return (
    <div className={styles.managementSection}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{customers.length}</div>
          <div className={styles.statLabel}>Tổng khách hàng</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{customers.filter(c => c.vai_tro === 'Customer').length}</div>
          <div className={styles.statLabel}>Khách hàng</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{customers.filter(c => c.dang_hoat_dong === 1 || c.dang_hoat_dong === true).length}</div>
          <div className={styles.statLabel}>Đang hoạt động</div>
        </div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.sectionHeader}>
          <h3>Quản lý Khách hàng</h3>
        </div>
        
        <div className={styles.dataTableContainer}>
          {loadingData ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Đang tải dữ liệu khách hàng từ database...</p>
            </div>
          ) : (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.ten_hien_thi || customer.displayName || `${customer.ho || ''} ${customer.ten || ''}`}</td>
                    <td>{customer.email}</td>
                    <td>
                      <span className="role-badge">{customer.vai_tro || 'Customer'}</span>
                    </td>
                    <td>
                      <span className={getStatusBadge(customer.dang_hoat_dong)}>
                        {(customer.dang_hoat_dong === 1 || customer.dang_hoat_dong === true) ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td>{new Date(customer.thoi_gian_tao || customer.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionButton} title="Xem chi tiết">
                          <Icon name="eye" size="16" />
                        </button>
                        {!isViewOnly && hasPermission(functionKey) && (
                          <button className={styles.actionButton} title="Chỉnh sửa">
                            <Icon name="pencil" size="16" />
                          </button>
                        )}
                        {functionKey === 'customer.orders' && (
                          <button className={styles.actionButton} title="Lịch sử mua hàng">
                            <Icon name="clipboard" size="16" />
                          </button>
                        )}
                        {(functionKey === 'profile.update' || functionKey === 'profile.view') && (
                          <>
                            <button className={styles.actionButton} title="Cập nhật profile">
                              <Icon name="idCard" size="16" />
                            </button>
                            <button className={styles.actionButton} title="Quản lý địa chỉ">
                              <Icon name="map" size="16" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                      Chưa có khách hàng nào trong database
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const renderOrderManagement = (functionKey, functionData, loadingData) => {
  const orders = functionData.orders || [];
  
  return (
    <div className={styles.managementSection}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{orders.length}</div>
          <div className={styles.statLabel}>Tổng đơn hàng</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{orders.filter(o => o.trang_thai === 'PENDING' || o.status === 'pending').length}</div>
          <div className={styles.statLabel}>Chờ xử lý</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{orders.filter(o => o.trang_thai === 'DELIVERED' || o.status === 'delivered').length}</div>
          <div className={styles.statLabel}>Hoàn thành</div>
        </div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.sectionHeader}>
          <h3>Quản lý Đơn hàng</h3>
          {functionKey === 'order.create' && hasPermission(functionKey) && (
            <button className={styles.primaryButton} onClick={() => {
              console.log('Create new order');
            }}>
              <Icon name="plus" size="18" />
              Tạo đơn hàng mới
            </button>
          )}
        </div>
        
        <div className={styles.dataTableContainer}>
          {loadingData ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Đang tải dữ liệu đơn hàng từ database...</p>
            </div>
          ) : (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.ten_khach_hang || order.shippingInfo?.name || order.email || 'Khách hàng'}</td>
                    <td>{new Date(order.thoi_gian_tao || order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tong_thanh_toan || order.total)}</td>
                    <td>
                      <span className={getStatusBadge(order.trang_thai || order.status, 'order')}>
                        {getOrderStatusText(order.trang_thai || order.status)}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionButton} title="Xem chi tiết">
                          <Icon name="eye" size="16" />
                        </button>
                        {(functionKey === 'order.status' || functionKey === 'order.admin-all') && hasPermission(functionKey) && (
                          <button className={styles.actionButton} title="Cập nhật trạng thái">
                            <Icon name="checkCircle" size="16" />
                          </button>
                        )}
                        {functionKey === 'order.my-orders' && (
                          <button className={styles.actionButton} title="Theo dõi đơn hàng">
                            <Icon name="truck" size="16" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                      Chưa có đơn hàng nào trong database
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const renderStockManagement = (functionKey, functionData, loadingData) => {
  const stocks = functionData.stock || [];
  
  return (
    <div className={styles.managementSection}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stocks.reduce((sum, item) => sum + (item.quantityOnHand || 0), 0)}</div>
          <div className={styles.statLabel}>Tổng tồn kho</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stocks.filter(item => (item.availableQuantity || 0) <= 10).length}</div>
          <div className={styles.statLabel}>Sắp hết</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stocks.filter(item => (item.availableQuantity || 0) === 0).length}</div>
          <div className={styles.statLabel}>Hết hàng</div>
        </div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.sectionHeader}>
          <h3>Quản lý Kho</h3>
          {(functionKey === 'stock.import' || functionKey === 'stock.export') && hasPermission(functionKey) && (
            <button className={styles.primaryButton} onClick={() => {
              console.log('Adjust stock');
            }}>
              <Icon name={functionKey === 'stock.import' ? 'upload' : 'download'} size="18" />
              {functionKey === 'stock.import' ? 'Nhập kho' : 'Xuất kho'}
            </button>
          )}
        </div>
        
        <div className={styles.dataTableContainer}>
          {loadingData ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Đang tải dữ liệu tồn kho từ database...</p>
            </div>
          ) : (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Kho</th>
                  <th>Tồn hiện tại</th>
                  <th>Đã giữ</th>
                  <th>Còn lại</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map(stock => (
                  <tr key={`${stock.productId}-${stock.warehouseId}`}>
                    <td>{stock.productName}</td>
                    <td>{stock.warehouseName}</td>
                    <td>{stock.quantityOnHand || 0}</td>
                    <td>{stock.quantityReserved || 0}</td>
                    <td>{stock.availableQuantity || 0}</td>
                    <td>
                      <span className={getStatusBadge(stock.availableQuantity, 'stock')}>
                        {(stock.availableQuantity || 0) === 0 ? 'Hết hàng' :
                         (stock.availableQuantity || 0) <= 10 ? 'Sắp hết' : 'Còn hàng'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionButton} title="Xem chi tiết">
                          <Icon name="eye" size="16" />
                        </button>
                        {(functionKey === 'stock.import' || functionKey === 'stock.export') && hasPermission(functionKey) && (
                          <button className={styles.actionButton} title={functionKey === 'stock.import' ? 'Nhập kho' : 'Xuất kho'}>
                            <Icon name={functionKey === 'stock.import' ? 'upload' : 'download'} size="16" />
                          </button>
                        )}
                        {functionKey === 'stock.history' && (
                          <button className={styles.actionButton} title="Lịch sử">
                            <Icon name="clock" size="16" />
                          </button>
                        )}
                        {functionKey === 'stock.warehouse' && (
                          <button className={styles.actionButton} title="Quản lý kho">
                            <Icon name="folderOpen" size="16" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {stocks.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                      Chưa có dữ liệu tồn kho trong database
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const renderReviewManagement = (functionKey) => {
  return (
    <div className={styles.managementSection}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>0</div>
          <div className={styles.statLabel}>Tổng đánh giá</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>0</div>
          <div className={styles.statLabel}>Chờ duyệt</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>0</div>
          <div className={styles.statLabel}>Đã duyệt</div>
        </div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.sectionHeader}>
          <h3>Quản lý Đánh giá</h3>
        </div>
        
        <div className={styles.dataTableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Sản phẩm</th>
                <th>Khách hàng</th>
                <th>Đánh giá</th>
                <th>Nội dung</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  Dữ liệu sẽ được load từ API reviews
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const renderSearchManagement = (functionKey) => {
  return (
    <div className={styles.managementSection}>
      <div className={styles.formContainer}>
        <div className={styles.sectionHeader}>
          <h3>Tìm kiếm và Lọc</h3>
        </div>
        
        <div className={styles.searchForm}>
          <div className={styles.searchBox}>
            <input type="text" placeholder="Nhập từ khóa tìm kiếm..." className={styles.searchInput} />
            <button className={styles.searchButton}>
              <Icon name="magnifyingGlass" size="18" />
            </button>
          </div>
          
          <div className={styles.filterOptions}>
            <select className={styles.filterSelect}>
              <option value="">Tất cả danh mục</option>
              <option value="category1">Danh mục 1</option>
              <option value="category2">Danh mục 2</option>
            </select>
            
            <select className={styles.filterSelect}>
              <option value="">Tất cả thương hiệu</option>
              <option value="brand1">Thương hiệu 1</option>
              <option value="brand2">Thương hiệu 2</option>
            </select>
            
            <input type="number" placeholder="Giá từ..." className={styles.priceInput} />
            <input type="number" placeholder="Giá đến..." className={styles.priceInput} />
          </div>
        </div>
        
        <div className={styles.searchResults}>
          <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            Kết quả tìm kiếm sẽ hiển thị ở đây
          </p>
        </div>
      </div>

      {functionKey === 'cart.manage' && (
        <div className={styles.formContainer}>
          <div className={styles.sectionHeader}>
            <h3>Quản lý Giỏ hàng</h3>
          </div>
          
          <div className={styles.dataTableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    Dữ liệu giỏ hàng sẽ được load từ API cart
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const renderPromotionManagement = (functionKey) => {
  return (
    <div className={styles.managementSection}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>0</div>
          <div className={styles.statLabel}>Tổng khuyến mãi</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>0</div>
          <div className={styles.statLabel}>Đang hiệu lực</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>0</div>
          <div className={styles.statLabel}>Đã hết hạn</div>
        </div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.sectionHeader}>
          <h3>Quản lý Khuyến mãi</h3>
          <button className={styles.primaryButton}>
            <Icon name="plus" size="18" />
            Tạo khuyến mãi mới
          </button>
        </div>
        
        <div className={styles.dataTableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên khuyến mãi</th>
                <th>Loại</th>
                <th>Giá trị</th>
                <th>Hiệu lực</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  Dữ liệu sẽ được load từ API promotions
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const renderAuthManagement = (functionKey) => {
  return (
    <div className={styles.managementSection}>
      <div className={styles.formContainer}>
        <div className={styles.sectionHeader}>
          <h3>
            {functionKey === 'auth.me' && 'Thông tin User hiện tại'}
            {functionKey === 'auth.login' && 'Đăng nhập'}
            {functionKey === 'auth.google' && 'Đăng nhập Google OAuth'}
            {functionKey === 'auth.register' && 'Đăng ký tài khoản'}
            {functionKey === 'auth.logout' && 'Đăng xuất'}
            {functionKey === 'auth.profile' && 'Quản lý Profile'}
            {functionKey === 'auth.health' && 'Kiểm tra sức khỏe API'}
          </h3>
        </div>
        
        <div className={styles.authInfo}>
          <div className={styles.infoCard}>
            <Icon name="lock" size="24" />
            <h4>
              {functionKey === 'auth.google' ? 'Đăng nhập Google' : 
               functionKey === 'auth.profile' ? 'Quản lý Profile' : 
               'Hệ thống Xác thực'}
            </h4>
            <p>
              {functionKey === 'auth.google' ? 'Cho phép người dùng đăng nhập bằng tài khoản Google' :
               functionKey === 'auth.profile' ? 'Quản lý thông tin profile người dùng' :
               'Xử lý xác thực và bảo mật hệ thống'}
            </p>
            {functionKey === 'auth.google' && (
              <div className={styles.toggleSwitch}>
                <input type="checkbox" id="google-auth-toggle" checked />
                <label htmlFor="google-auth-toggle">Bật/Tắt</label>
              </div>
            )}
          </div>
          
          <div className={styles.statsSection}>
            <h4>Thống kê đăng nhập</h4>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>0</span>
                <span className={styles.statLabel}>Tổng lượt đăng nhập</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>0</span>
                <span className={styles.statLabel}>Hôm nay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderAdminManagement = (functionKey) => {
  // 🔥 Sử dụng dữ liệu từ stats state và functionData
  const totalCustomers = functionData.customers?.length || 0;
  const adminUsers = functionData.customers?.filter(c => c.vai_tro === 'Admin').length || 0;
  const staffUsers = functionData.customers?.filter(c => c.vai_tro !== 'Customer' && c.vai_tro !== 'Admin').length || 0;
  
  return (
    <div className={styles.managementSection}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{totalCustomers}</div>
          <div className={styles.statLabel}>Tổng người dùng</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{adminUsers}</div>
          <div className={styles.statLabel}>Admin</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{staffUsers}</div>
          <div className={styles.statLabel}>Nhân viên</div>
        </div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.sectionHeader}>
          <h3>
            {functionKey === 'admin.stats' && 'Thống kê Tổng quan'}
            {functionKey === 'admin.users' && 'Quản lý Users'}
            {functionKey === 'admin.role' && 'Quản lý Role'}
            {functionKey === 'admin.toggle-status' && 'Bật/Tắt User'}
            {functionKey === 'admin.reset-password' && 'Reset Password'}
          </h3>
          {functionKey !== 'admin.stats' && (
            <button className={styles.primaryButton}>
              <Icon name="plus" size="18" />
              Thêm mới
            </button>
          )}
        </div>
        
        <div className={styles.dataTableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  Dữ liệu sẽ được load từ API admin
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const renderOtherFunctions = (functionKey) => {
  return (
    <div className={styles.managementSection}>
      <div className={styles.formContainer}>
        <div className={styles.sectionHeader}>
          <h3>
            {functionKey === 'categories.list' && 'Danh mục Sản phẩm'}
            {functionKey === 'categories.map' && 'Mapping Danh mục'}
          </h3>
        </div>
        
        <div className={styles.dataTableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  Dữ liệu sẽ được load từ API categories
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userPermissions, setUserPermissions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Permission checking function
  const hasPermission = (functionKey) => {
    return userPermissions.includes(functionKey);
  };
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  // State cho dữ liệu chi tiết của từng chức năng
  const [functionData, setFunctionData] = useState({
    products: [],
    customers: [],
    orders: [],
    stock: [],
    reviews: [],
    promotions: []
  });

  const [loadingData, setLoadingData] = useState(false);

  // 🔥 MOCK DATA TẠM THỜI ĐỂ TEST - Sẽ replace bằng real data sau
  const [mockDataLoaded, setMockDataLoaded] = useState(false);

  // Load mock data ngay khi component mount
  useEffect(() => {
    if (!mockDataLoaded) {
      console.log('🚀 Loading mock data for testing...');
      
      // Mock stats data
      setStats({
        totalUsers: 1,
        totalProducts: 11,
        totalOrders: 0,
        totalRevenue: 0
      });

      // Mock function data
      setFunctionData({
        products: [
          { MaSanPham: 1, TenSanPham: 'Kem dưỡng ẩm ban đêm', MaDanhMuc: 1, Gia: 159000, is_an: 0, categoryName: 'Dưỡng da' },
          { MaSanPham: 2, TenSanPham: 'Dầu gội Romano Classic', MaDanhMuc: 2, Gia: 95000, is_an: 0, categoryName: 'Dầu Gội' },
          { MaSanPham: 3, TenSanPham: 'Dầu gội Romano Force', MaDanhMuc: 2, Gia: 99000, is_an: 0, categoryName: 'Dầu Gội' }
        ],
        customers: [
          { id: 1, ten_hien_thi: 'Quản trị viên', email: 'admin@example.local', vai_tro: 'Admin', dang_hoat_dong: 1, thoi_gian_tao: '2025-11-26' }
        ],
        orders: [],
        stock: [
          { productId: 1, productName: 'Kem dưỡng ẩm ban đêm', quantityOnHand: 50, availableQuantity: 50 },
          { productId: 2, productName: 'Dầu gội Romano Classic', quantityOnHand: 100, availableQuantity: 100 }
        ],
        reviews: [],
        promotions: []
      });

      // Mock permissions cho Admin
      setUserPermissions([
        'admin.stats', 'admin.users', 'admin.role', 'product.view', 'product.create', 'product.update',
        'customer.view', 'customer.update', 'order.view_all', 'stock.view', 'stock.adjust'
      ]);

      setMockDataLoaded(true);
      console.log('✅ Mock data loaded successfully');
    }
  }, [mockDataLoaded]);

  // 38 Functions từ Database - Mở rộng từ 23 lên 38
  const allFunctions = [
    // Authentication APIs (7 functions)
    { key: 'auth.me', name: 'Lấy thông tin user hiện tại', icon: 'userCircle', category: 'auth' },
    { key: 'auth.login', name: 'Đăng nhập', icon: 'lock', category: 'auth' },
    { key: 'auth.google', name: 'Đăng nhập Google', icon: 'globe', category: 'auth' },
    { key: 'auth.register', name: 'Đăng ký tài khoản', icon: 'user', category: 'auth' },
    { key: 'auth.logout', name: 'Đăng xuất', icon: 'logout', category: 'auth' },
    { key: 'auth.profile', name: 'Quản lý profile', icon: 'idCard', category: 'auth' },
    { key: 'auth.health', name: 'Kiểm tra sức khỏe API', icon: 'shield', category: 'auth' },

    // Admin Management APIs (5 functions)
    { key: 'admin.stats', name: 'Thống kê tổng quan', icon: 'chartLine', category: 'admin' },
    { key: 'admin.users', name: 'Quản lý users', icon: 'users', category: 'admin' },
    { key: 'admin.role', name: 'Quản lý role', icon: 'crown', category: 'admin' },
    { key: 'admin.toggle-status', name: 'Bật/tắt user', icon: 'shield', category: 'admin' },
    { key: 'admin.reset-password', name: 'Reset password', icon: 'key', category: 'admin' },

    // Product Management APIs (7 functions)
    { key: 'products.view', name: 'Xem danh sách sản phẩm', icon: 'eye', category: 'product' },
    { key: 'products.detail', name: 'Xem chi tiết sản phẩm', icon: 'eye', category: 'product' },
    { key: 'product.create', name: 'Tạo sản phẩm mới', icon: 'plus', category: 'product' },
    { key: 'product.update', name: 'Cập nhật sản phẩm', icon: 'pencil', category: 'product' },
    { key: 'product.delete', name: 'Xóa sản phẩm', icon: 'trash', category: 'product' },
    { key: 'product.media', name: 'Cập nhật hình ảnh', icon: 'camera', category: 'product' },
    { key: 'product.tags', name: 'Quản lý tags/thuộc tính', icon: 'tag', category: 'product' },

    // Customer Management APIs (6 functions)
    { key: 'customer.view', name: 'Quản lý khách hàng', icon: 'users', category: 'customer' },
    { key: 'customer.update', name: 'Cập nhật khách hàng', icon: 'pencil', category: 'customer' },
    { key: 'customer.orders', name: 'Lịch sử mua hàng', icon: 'clipboard', category: 'customer' },
    { key: 'profile.update', name: 'Cập nhật profile cá nhân', icon: 'user', category: 'customer' },
    { key: 'profile.view', name: 'Thông tin profile', icon: 'userCircle', category: 'customer' },
    { key: 'addresses.manage', name: 'Quản lý địa chỉ', icon: 'map', category: 'customer' },

    // Order Management APIs (4 functions)
    { key: 'order.my-orders', name: 'Đơn hàng của user', icon: 'cube', category: 'order' },
    { key: 'order.admin-all', name: 'Xem tất cả đơn hàng', icon: 'folder', category: 'order' },
    { key: 'order.status', name: 'Cập nhật trạng thái đơn hàng', icon: 'checkCircle', category: 'order' },
    { key: 'order.create', name: 'Tạo đơn hàng mới', icon: 'plus', category: 'order' },

    // Review Management APIs (3 functions)
    { key: 'review.list', name: 'Danh sách đánh giá', icon: 'star', category: 'review' },
    { key: 'review.moderate', name: 'Duyệt đánh giá', icon: 'check', category: 'review' },
    { key: 'review.create', name: 'Tạo đánh giá', icon: 'star', category: 'review' },

    // Stock Management APIs (5 functions)
    { key: 'stock.view', name: 'Xem tồn kho', icon: 'chartBar', category: 'stock' },
    { key: 'stock.import', name: 'Nhập kho', icon: 'upload', category: 'stock' },
    { key: 'stock.export', name: 'Xuất kho', icon: 'download', category: 'stock' },
    { key: 'stock.history', name: 'Lịch sử kho', icon: 'clock', category: 'stock' },
    { key: 'stock.warehouse', name: 'Quản lý kho', icon: 'folderOpen', category: 'stock' },

    // Search & Cart APIs (2 functions)
    { key: 'search.index', name: 'Tìm kiếm sản phẩm', icon: 'magnifyingGlass', category: 'search' },
    { key: 'cart.manage', name: 'Quản lý giỏ hàng', icon: 'shoppingCart', category: 'search' },

    // Other Support APIs (3 functions)
    { key: 'categories.list', name: 'Danh mục sản phẩm', icon: 'folder', category: 'other' },
    { key: 'categories.map', name: 'Mapping danh mục', icon: 'map', category: 'other' },
    { key: 'promotions.manage', name: 'Quản lý khuyến mãi', icon: 'gift', category: 'other' }
  ];

  // Phân nhóm functions
  const functionCategories = {
    auth: { title: 'Xác thực & Bảo mật', icon: 'lock', color: 'blue' },
    admin: { title: 'Quản trị hệ thống', icon: 'crown', color: 'purple' },
    product: { title: 'Quản lý Sản phẩm', icon: 'tag', color: 'green' },
    customer: { title: 'Quản lý Khách hàng', icon: 'users', color: 'pink' },
    order: { title: 'Quản lý Đơn hàng', icon: 'cube', color: 'orange' },
    review: { title: 'Quản lý Đánh giá', icon: 'star', color: 'yellow' },
    stock: { title: 'Quản lý Kho hàng', icon: 'chartBar', color: 'red' },
    search: { title: 'Tìm kiếm & Giỏ hàng', icon: 'magnifyingGlass', color: 'teal' },
    other: { title: 'Khác', icon: 'settings', color: 'gray' }
  };

  useEffect(() => {
    // Load dữ liệu thật từ database
    const loadRealData = async () => {
      setLoading(true);
      
      try {
        // Lấy thông tin user và permissions từ database thực
        const userResponse = await fetchData('/api/auth/me');
        if (userResponse && userResponse.success) {
          const userData = userResponse.user;
          const userRole = userData.vai_tro || userData.role || 'Customer';
          
          // Mapping role từ database sang functions dựa trên RBAC system
          const roleFunctions = {
            'Admin': allFunctions.map(f => f.key), // Admin có tất cả quyền
            'QL_SanPham': [
              'auth.me', 'auth.login', 'auth.logout', 'auth.profile',
              'products.view', 'products.detail', 'product.create', 'product.update', 
              'product.delete', 'product.media', 'product.tags',
              'review.moderate', 'review.list', 'review.create',
              'search.index', 'promotions.manage',
              'categories.list', 'categories.map'
            ],
            'QL_KhachHang': [
              'auth.me', 'auth.login', 'auth.logout', 'auth.profile',
              'customer.view', 'customer.update', 'customer.orders',
              'profile.update', 'profile.view', 'addresses.manage',
              'order.create', 'order.my-orders',
              'cart.manage', 'review.create',
              'products.view', 'products.detail', 'search.index'
            ],
            'QL_Kho': [
              'auth.me', 'auth.login', 'auth.logout', 'auth.profile',
              'stock.view', 'stock.import', 'stock.export', 
              'stock.history', 'stock.warehouse',
              'products.view', 'products.detail', 'search.index',
              'cart.manage', 'review.create'
            ],
            'Customer': [
              'auth.me', 'auth.login', 'auth.logout', 'auth.profile',
              'products.view', 'products.detail', 'search.index',
              'customer.orders', 'cart.manage',
              'profile.update', 'profile.view', 'addresses.manage',
              'order.create', 'order.my-orders',
              'review.create', 'review.list'
            ]
          };

          const userFunctions = roleFunctions[userRole] || roleFunctions['Customer'];
          setUserPermissions(userFunctions);
          
          // Lưu thông tin user vào state nếu cần
          setCurrentUser(userData);
        } else {
          // Fallback: Nếu không lấy được user data, gán quyền Customer
          const defaultFunctions = [
            'auth.me', 'auth.login', 'auth.logout', 'auth.profile',
            'products.view', 'products.detail', 'search.index',
            'customer.orders', 'cart.manage',
            'profile.update', 'profile.view', 'addresses.manage',
            'order.create', 'order.my-orders',
            'review.create', 'review.list'
          ];
          setUserPermissions(defaultFunctions);
        }

        // Lấy stats thật từ database admin API
        const statsResponse = await fetchData('/api/admin/stats');
        if (statsResponse && statsResponse.success) {
          const overview = statsResponse.data.overview || {};
          setStats({
            totalUsers: overview.totalUsers || 0,
            totalProducts: overview.totalProducts || 0,
            totalOrders: overview.totalOrders || 0,
            totalRevenue: overview.revenue?.total || 0
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading real data:', error);
        // Fallback về dữ liệu mock nếu lỗi
        const mockFunctions = allFunctions.map(f => f.key);
        setUserPermissions(mockFunctions);
        setStats({
          totalUsers: 0,
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0
        });
        setLoading(false);
      }
    };

    loadRealData();
  }, []);

  // Load dữ liệu chi tiết khi activeTab thay đổi từ database thực
  useEffect(() => {
    if (activeTab === 'overview') return;

    const loadFunctionData = async () => {
      setLoadingData(true);
      
      try {
        let endpoint = '';
        let dataKey = '';
        
        // Xác định endpoint và data key dựa trên activeTab
        if (activeTab.startsWith('product') || activeTab === 'products.view') {
          endpoint = '/api/qlsp/products';
          dataKey = 'products';
        } else if (activeTab.startsWith('customer') || activeTab === 'profile.update' || activeTab === 'profile.view' || activeTab === 'addresses.manage') {
          endpoint = '/api/qlkh/customers';
          dataKey = 'customers';
        } else if (activeTab.startsWith('order')) {
          if (hasPermission('order.admin-all')) {
            endpoint = '/api/orders/admin/all';
          } else {
            endpoint = '/api/orders/my-orders';
          }
          dataKey = 'orders';
        } else if (activeTab.startsWith('stock')) {
          endpoint = '/api/qlkho/stocks';
          dataKey = 'stock';
        } else if (activeTab.startsWith('review')) {
          endpoint = '/api/reviews';
          dataKey = 'reviews';
        } else if (activeTab === 'promotions.manage') {
          endpoint = '/api/promotions';
          dataKey = 'promotions';
        } else if (activeTab === 'search.index') {
          endpoint = '/api/search/index';
          dataKey = 'search';
        } else if (activeTab === 'cart.manage') {
          endpoint = '/api/cart/index';
          dataKey = 'cart';
        }

        if (endpoint) {
          console.log('Loading data for:', activeTab, 'from:', endpoint);
          let response = null;
          
          try {
            response = await fetchData(endpoint);
            console.log('API Response:', response);
          } catch (error) {
            console.log('⚠️ API call failed, using mock data:', error.message);
          }
          
          if (response && response.success) {
            let data = response.data || response.items || [];
            
            // Format data theo cấu trúc database
            if (dataKey === 'products') {
              data = data.map(item => ({
                MaSanPham: item.id,
                TenSanPham: item.name,
                MaDanhMuc: item.categoryId,
                Gia: item.price,
                is_an: item.isHidden,
                categoryName: item.categoryName,
                brandName: item.brandName,
                totalStock: item.totalStock,
                createdAt: item.createdAt
              }));
            } else if (dataKey === 'customers') {
              data = data.map(item => ({
                id: item.id,
                ten_hien_thi: item.displayName,
                email: item.email,
                vai_tro: 'Customer',
                dang_hoat_dong: item.isActive,
                thoi_gian_tao: item.createdAt,
                totalOrders: item.totalOrders,
                totalSpent: item.totalSpent,
                tier: item.tier,
                lastOrderDate: item.lastOrderDate
              }));
            } else if (dataKey === 'orders') {
              // API orders/admin/all trả về data.orders
              const ordersData = Array.isArray(data) ? data : (data.orders || []);
              
              data = ordersData.map(item => ({
                id: item.id,
                ma_don_hang: item.ma_don_hang,
                nguoi_dung_id: item.nguoi_dung_id,
                tong_tien: item.tong_tien,
                trang_thai: item.trang_thai,
                phuong_thuc_thanh_toan: item.phuong_thuc_thanh_toan,
                thoi_gian_tao: item.thoi_gian_tao,
                customer_name: item.customer_name,
                customer_email: item.customer_email,
                total_items: item.total_items,
                total_quantity: item.total_quantity
              }));
            } else if (dataKey === 'stock') {
              data = data.map(item => ({
                productId: item.productId,
                productName: item.productName,
                warehouseId: item.warehouseId,
                warehouseName: item.warehouseName,
                quantityOnHand: item.quantityOnHand,
                quantityReserved: item.quantityReserved,
                availableQuantity: item.availableQuantity
              }));
            }

            setFunctionData(prev => ({
              ...prev,
              [dataKey]: data
            }));
            console.log('✅ Data loaded successfully for:', dataKey, 'Count:', data.length);
          } else {
            // 🔥 FALLBACK: Sử dụng mock data khi API fails
            console.log('🔄 Using mock data fallback for:', dataKey);
            
            const mockDataMap = {
              products: functionData.products || [
                { MaSanPham: 1, TenSanPham: 'Kem dưỡng ẩm ban đêm', MaDanhMuc: 1, Gia: 159000, is_an: 0, categoryName: 'Dưỡng da' },
                { MaSanPham: 2, TenSanPham: 'Dầu gội Romano Classic', MaDanhMuc: 2, Gia: 95000, is_an: 0, categoryName: 'Dầu Gội' },
                { MaSanPham: 3, TenSanPham: 'Dầu gội Romano Force', MaDanhMuc: 2, Gia: 99000, is_an: 0, categoryName: 'Dầu Gội' }
              ],
              customers: functionData.customers || [
                { id: 1, ten_hien_thi: 'Quản trị viên', email: 'admin@example.local', vai_tro: 'Admin', dang_hoat_dong: 1, thoi_gian_tao: '2025-11-26' }
              ],
              orders: [],
              stock: functionData.stock || [
                { productId: 1, productName: 'Kem dưỡng ẩm ban đêm', quantityOnHand: 50, availableQuantity: 50 },
                { productId: 2, productName: 'Dầu gội Romano Classic', quantityOnHand: 100, availableQuantity: 100 }
              ],
              reviews: [],
              promotions: []
            };
            
            const fallbackData = mockDataMap[dataKey] || [];
            setFunctionData(prev => ({
              ...prev,
              [dataKey]: fallbackData
            }));
            console.log('✅ Mock data loaded for:', dataKey, 'Count:', fallbackData.length);
          }
        }
      } catch (error) {
        console.error('Error loading function data:', error);
        // Fallback về mock data khi có lỗi
        const mockDataMap = {
          products: functionData.products || [],
          customers: functionData.customers || [],
          orders: [],
          stock: functionData.stock || [],
          reviews: [],
          promotions: []
        };
        
        setFunctionData(prev => ({
          ...prev,
          [dataKey]: mockDataMap[dataKey] || []
        }));
        console.log('🔄 Used mock data due to error for:', dataKey);
      } finally {
        setLoadingData(false);
      }
    };

    loadFunctionData();
  }, [activeTab, currentUser]);

  const handleLogout = () => {
    alert('Đăng xuất thành công!');
  };

  const renderSidebar = () => (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>
          <Icon name="crown" size="20" style={{ marginRight: '8px' }} />
          Quản Trị Hệ Thống
        </h2>
        <div className={styles.sidebarSubtitle}>38 Functions API Management</div>
      </div>
      
      <div className={styles.sidebarContent}>
        {/* Home Navigation */}
        <div className={styles.menuSection}>
          <a 
            href="#" 
            className={`${styles.menuItem} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={(e) => { 
              e.preventDefault(); 
              setActiveTab('overview'); 
            }}
          >
            <Icon name="home" size="22" className={styles.menuItemIcon} />
            <span className={styles.menuItemText}>Dashboard Tổng quan</span>
          </a>
        </div>

        {/* Function Categories */}
        {Object.entries(functionCategories).map(([categoryKey, category]) => {
          const categoryFunctions = allFunctions.filter(f => f.category === categoryKey);
          const visibleFunctions = categoryFunctions.filter(f => hasPermission(f.key));
          
          if (visibleFunctions.length === 0) return null;

          return (
            <div key={categoryKey} className={`${styles.menuSection} ${styles.functionCategory}`}>
              <h3 className={styles.functionCategoryTitle}>
                <Icon name={category.icon} size="18" />
                {category.title}
                <span className={styles.functionCount}>{visibleFunctions.length}</span>
              </h3>
              
              {visibleFunctions.map(fn => (
                <a
                  key={fn.key}
                  href="#"
                  className={`${styles.menuItem} ${
                    activeTab === fn.key ? styles.active : ''
                  }`}
                  onClick={(e) => { 
                    e.preventDefault(); 
                    setActiveTab(fn.key); 
                  }}
                >
                  <Icon name={fn.icon} size="18" className={styles.menuItemIcon} />
                  <span className={styles.menuItemText}>{fn.name}</span>
                </a>
              ))}
            </div>
          );
        })}

        {/* Logout */}
        <div className={styles.menuSection}>
          <a 
            href="#" 
            className={styles.menuItem}
            onClick={(e) => { 
              e.preventDefault(); 
              handleLogout(); 
            }}
          >
            <Icon name="logout" size="22" className={styles.menuItemIcon} />
            <span className={styles.menuItemText}>Đăng Xuất</span>
          </a>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (activeTab === 'overview') {
      return (
        <div className={styles.fullScreenMainContent}>
          <div className={styles.adminHeader}>
            <h1 className={styles.adminTitle}>Dashboard Quản Trị Hệ Thống - 38 Functions API</h1>
            <p className={styles.adminSubtitle}>Tổng quan và thống kê hệ thống - Quản lý toàn diện với 38 API endpoints</p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.totalUsers.toLocaleString()}</div>
              <div className={styles.statLabel}>Tổng số khách hàng</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.totalProducts.toLocaleString()}</div>
              <div className={styles.statLabel}>Sản phẩm</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.totalOrders.toLocaleString()}</div>
              <div className={styles.statLabel}>Đơn hàng</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>
                {(stats.totalRevenue / 1000000).toFixed(1)}M VNĐ
              </div>
              <div className={styles.statLabel}>Doanh thu</div>
            </div>
          </div>

          {/* Simple dashboard header */}
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Dashboard Quản Trị Hệ Thống - 38 Functions API</h2>
              <p className={styles.welcomeSubtitle}>Tổng quan và thống kê hệ thống - Quản lý toàn diện với 38 API endpoints</p>
            </div>
          </div>
        </div>
      );
    }

    // Render content for specific function
    const currentFunction = allFunctions.find(f => f.key === activeTab);
    if (!currentFunction) {
      return <EmptyState />;
    }

    // Render nội dung chức năng thật dựa trên function key
    const renderFunctionContent = () => {
      const functionKey = currentFunction.key;
      
      // PRODUCT MANAGEMENT CONTENT
      if (functionKey.startsWith('product')) {
        return renderProductManagement(functionKey, functionData, loadingData);
      }
      
      // CUSTOMER MANAGEMENT CONTENT  
      if (functionKey.startsWith('customer') || functionKey === 'profile.update' || functionKey === 'profile.view' || functionKey === 'addresses.manage') {
        return renderCustomerManagement(functionKey, functionData, loadingData);
      }
      
      // ORDER MANAGEMENT CONTENT
      if (functionKey.startsWith('order')) {
        return renderOrderManagement(functionKey, functionData, loadingData);
      }
      
      // STOCK MANAGEMENT CONTENT
      if (functionKey.startsWith('stock')) {
        return renderStockManagement(functionKey, functionData, loadingData);
      }
      
      // REVIEW MANAGEMENT CONTENT
      if (functionKey.startsWith('review')) {
        return renderReviewManagement(functionKey);
      }
      
      // SEARCH CONTENT
      if (functionKey === 'search.index' || functionKey === 'cart.manage') {
        return renderSearchManagement(functionKey);
      }
      
      // PROMOTION CONTENT
      if (functionKey === 'promotions.manage') {
        return renderPromotionManagement(functionKey);
      }
      
      // AUTHENTICATION CONTENT
      if (functionKey.startsWith('auth')) {
        return renderAuthManagement(functionKey);
      }
      
      // ADMIN MANAGEMENT CONTENT
      if (functionKey.startsWith('admin')) {
        return renderAdminManagement(functionKey);
      }
      
      // OTHER FUNCTIONS
      if (functionKey.startsWith('categories')) {
        return renderOtherFunctions(functionKey);
      }
      
      // Default content
      return (
        <div className={styles.formContainer}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            marginBottom: '20px', 
            color: '#1e40af' 
          }}>
            <Icon name="settings" size="20" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Chức năng: {currentFunction.name}
          </h3>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Mã function:</label>
              <div className={styles.formInput}>{currentFunction.key}</div>
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Danh mục:</label>
              <div className={styles.formInput}>
                <Icon name={functionCategories[currentFunction.category]?.icon} size="20" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                {functionCategories[currentFunction.category]?.title}
              </div>
            </div>
          </div>
          <div className={styles.formActions}>
            <button className={styles.primaryButton}>
              <Icon name="check" size="18" />
              <span>Thực hiện</span>
            </button>
          </div>
        </div>
      );
    };

    return (
      <div className={styles.fullScreenMainContent}>
        <div className={styles.adminHeader}>
          <h1 className={styles.adminTitle}>{currentFunction.name}</h1>
          <p className={styles.adminSubtitle}>
            {functionCategories[currentFunction.category]?.title} - Function: {currentFunction.key}
          </p>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.sectionContent}>
            {renderFunctionContent()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminMainContainer}>
        {renderSidebar()}
        <main className={styles.mainContent}>
          {/* 🚨 DEMO MODE BANNER */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '12px 20px',
            marginBottom: '20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: '18px' }}>🧪</span>
            <div>
              <strong>DEMO MODE - Sử dụng Mock Data</strong>
              <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '2px' }}>
                Hiện tại đang hiển thị dữ liệu mẫu để test UI. Để kết nối database thật, cần đăng nhập admin.
              </div>
            </div>
          </div>
          
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Admin;