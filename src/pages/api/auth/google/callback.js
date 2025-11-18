// API endpoint để xử lý Google OAuth callback
// Đường dẫn trong project: /api/auth/google/callback.js

import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code không được cung cấp'
      });
    }

    console.log('🔍 Processing OAuth callback with code:', code);
    
    // Redirect về trang chủ hoặc trang tài khoản tùy vào state
    const redirectUrl = state === 'newUser' ? '/taikhoan' : '/';
    
    // Tạo URL redirect
    const redirectWithParams = `${redirectUrl}?status=success&login=google`;
    
    console.log('🎯 Redirecting to:', redirectWithParams);
    
    // Redirect user về frontend
    res.writeHead(302, {
      Location: redirectWithParams
    });
    res.end();

  } catch (error) {
    console.error('❌ Callback Error:', error);
    
    // Redirect về trang login với error
    res.writeHead(302, {
      Location: '/login?error=callback_failed'
    });
    res.end();
  }
}