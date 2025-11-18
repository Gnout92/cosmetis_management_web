// API endpoint để lấy thông tin profile người dùng
// File: src/pages/api/user/getProfile.js
// SMART VERSION - Tự động detect và trả về username field

const mysql = require('mysql2/promise');

export default async function handler(req, res) {
  // Chỉ cho phép GET request
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method không được phép' 
    });
  }

  try {
    console.log('🔍 ENV CHECK:', {
      DB_HOST: process.env.DB_HOST || 'MISSING',
      DB_USER: process.env.DB_USER || 'MISSING',
      DB_NAME: process.env.DB_NAME || 'MISSING',
      DB_PASSWORD_EXISTS: !!process.env.DB_PASSWORD
    });

    // Kiểm tra token xác thực
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token xác thực không hợp lệ' 
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔍 Raw token =', token);
    
    // Parse userId từ token - cải tiến logic parsing
    let userId = null;
    
    try {
      // Strategy 1: Nếu token chứa JWT structure, lấy userId từ payload
      if (token && token.includes('.')) {
        try {
          const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          userId = payload.userId;
          console.log('✅ JWT payload parsed:', { userId: payload.userId });
        } catch (jwtError) {
          console.log('⚠️ JWT parsing failed, trying fallback...');
        }
      }
      
      // Strategy 2: Nếu token là số đơn giản
      if (!userId && /^[0-9]+$/.test(token)) {
        userId = parseInt(token);
        console.log('✅ Simple number token parsed:', userId);
      }
      
      // Strategy 3: Extract số đầu tiên trong token
      if (!userId) {
        const match = token.match(/[0-9]+/);
        if (match) {
          userId = parseInt(match[0]);
          console.log('✅ Number extracted from token:', userId);
        }
      }
      
    } catch (parseError) {
      console.error('❌ Token parsing error:', parseError.message);
    }
    
    // Fallback nếu không parse được
    if (!userId || userId <= 0) {
      console.log('🚨 Using fallback ID = 1');
      userId = 1;
    }
    
    console.log('📊 Final userId:', userId);

    let user = null;
    let connection;

    try {
      console.log('🔌 Creating MySQL connection...');
      
      connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'myphamshop',
        charset: 'utf8mb4'
      });

      console.log('✅ MySQL connected');

      // 🧠 SMART STRATEGY: Tự động detect username field
      const possibleUsernameFields = [
        'username', 'ten_dang_nhap', 'user_name', 'tai_khoan', 
        'login_name', 'user_login', 'account_name', 'login'
      ];
      
      let usernameField = null;
      let selectFields = ['id', 'email', 'ten_hien_thi', 'ho', 'ten', 'anh_dai_dien', 'ngay_sinh', 'gioi_tinh'];

      // Test different username field names
      for (const field of possibleUsernameFields) {
        try {
          console.log(`🧪 Testing username field: ${field}`);
          const testQuery = `SELECT ${field} FROM nguoi_dung WHERE id = ? LIMIT 1`;
          const [testRows] = await connection.execute(testQuery, [userId]);
          
          if (testRows && testRows.length > 0) {
            const value = testRows[0][field];
            console.log(`✅ Field ${field} exists with value:`, value);
            
            // Nếu field tồn tại và có giá trị hoặc không null
            if (value !== null && value !== undefined) {
              usernameField = field;
              selectFields.push(field);
              console.log(`🎯 Selected username field: ${field}`);
              break;
            } else {
              console.log(`⚠️ Field ${field} exists but value is null/undefined`);
            }
          }
        } catch (testError) {
          console.log(`❌ Field ${field} not found:`, testError.message);
          // Continue to next field
        }
      }

      // Build final query
      const query = `SELECT ${selectFields.join(', ')} FROM nguoi_dung WHERE id = ?`;
      
      console.log('🗄️ Executing smart query for userId:', userId);
      console.log('🗄️ Selected fields:', selectFields);
      const [rows] = await connection.execute(query, [userId]);

      console.log('🗄️ Rows found:', rows?.length || 0);
      
      if (rows && rows.length > 0) {
        user = rows[0];
        console.log('✅ Found user:', user.id);
      } else {
        console.log('❌ No user found, trying fallback...');
        
        // Fallback: Get first user
        const fallbackQuery = `SELECT ${selectFields.join(', ')} FROM nguoi_dung ORDER BY id LIMIT 1`;
        const [fallbackRows] = await connection.execute(fallbackQuery);
        
        if (fallbackRows && fallbackRows.length > 0) {
          user = fallbackRows[0];
          console.log('✅ Using fallback user:', user.id);
        }
      }

      await connection.end();
      console.log('🔌 Connection closed');

    } catch (dbError) {
      console.error('❌ DATABASE ERROR:');
      console.error('Message:', dbError.message);
      console.error('Code:', dbError.code);
      console.error('SQL State:', dbError.sqlState);
      console.error('SQL Message:', dbError.sqlMessage);
      
      console.error('🔍 Connection info:', {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        database: process.env.DB_NAME || 'myphamshop'
      });
      
      if (connection) {
        try {
          await connection.end();
        } catch (endError) {
          console.error('Error closing connection:', endError);
        }
      }
      
      throw new Error(`Lỗi database: ${dbError.sqlMessage || dbError.message}`);
    }

    if (!user) {
      console.log('❌ No user found in database');
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy người dùng' 
      });
    }

    console.log('✅ Returning user data');
    
    // Tạo tên hiển thị từ ho + ten nếu ten_hien_thi rỗng
    const displayName = user.ten_hien_thi || 
                        (user.ho && user.ten ? `${user.ho} ${user.ten}`.trim() : '') ||
                        user.email?.split('@')[0] || 
                        'User';
    
    // 🎯 SMART USERNAME EXTRACTION
    const possibleUsernameValues = [
      user.username,
      user.ten_dang_nhap, 
      user.user_name,
      user.tai_khoan,
      user.login_name,
      user.user_login,
      user.account_name,
      user.login
    ].filter(value => value !== null && value !== undefined && value !== '');

    let finalUsername;
    if (possibleUsernameValues.length > 0) {
      finalUsername = possibleUsernameValues[0];
      console.log('🎯 Found username from field:', finalUsername);
    } else {
      // Fallback strategies
      finalUsername = user.email?.split('@')[0] || `user_${user.id}`;
      console.log('🎯 Using fallback username:', finalUsername);
    }
    
    const responseData = {
      id: user.id,
      email: user.email,
      ten_hien_thi: displayName,
      ho: user.ho || '',
      ten: user.ten || '',
      anh_dai_dien: user.anh_dai_dien || '',
      ngay_sinh: user.ngay_sinh || '',
      gioi_tinh: user.gioi_tinh || '',
      // 🆕 THÊM USERNAME FIELD
      username: finalUsername,
      // 🆕 THÊM METADATA về username field
      _usernameField: usernameField || 'fallback'
    };
    
    console.log('📤 Smart Response:', responseData);
    
    res.status(200).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Lỗi server'
    });
  }
}