// src/pages/api/auth/logout.js - API đăng xuất
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method không được phép' 
    });
  }

  try {
    // Log logout activity if needed
    console.log('User logout at:', new Date().toISOString());
    
    // Clear any server-side sessions if implemented
    // (This depends on your session management approach)
    
    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công'
    });

  } catch (error) {
    console.error('Logout error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng xuất'
    });
  }
}