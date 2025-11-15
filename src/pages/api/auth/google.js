// src/pages/api/auth/google.js - API xử lý đăng nhập Google OAuth 2.0
// Phiên bản hoàn chỉnh đã khắc phục tất cả lỗi

import jwt from "jsonwebtoken";
import { google } from "googleapis";

// Verify Google OAuth 2.0 token
async function verifyGoogleToken(idToken) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
    );

    const ticket = await oauth2Client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    return {
      sub: payload.sub,           // Google user ID
      email: payload.email,
      emailVerified: payload.email_verified,
      name: payload.name,
      givenName: payload.given_name,
      familyName: payload.family_name,
      picture: payload.picture,   // Avatar URL
      locale: payload.locale,
      hd: payload.hd,            // Hosted domain
    };
  } catch (error) {
    console.error('Google token verification failed:', error);
    throw new Error('Token Google không hợp lệ');
  }
}

// Sign JWT token for application
function signAppToken(payload) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'beauty-shop-jwt-secret-key-2024';
    
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '30d',  // Token expires in 30 days
      issuer: 'beauty-shop',
      audience: 'shop-customers',
    });
    return token;
  } catch (error) {
    console.error('JWT signing failed:', error);
    throw new Error('Không thể tạo token xác thực');
  }
}

// Database connection pool
function getPool() {
  const mysql = require('mysql2/promise');
  
  if (!global.mysqlPool) {
    try {
      global.mysqlPool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'beauty_shop',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true,
        charset: 'utf8mb4',
        ssl: false,
        multipleStatements: false,
      });
    } catch (error) {
      console.error('Failed to create database pool:', error);
      throw new Error('Không thể kết nối cơ sở dữ liệu');
    }
  }
  return global.mysqlPool;
}

// Initialize database - KHẮC PHỤC LỖI PREPARED STATEMENT
async function initializeDatabase() {
  const mysql = require('mysql2/promise');
  
  try {
    const dbName = process.env.DB_NAME || 'beauty_shop';
    
    // Method 1: Try to connect directly to the database
    let pool;
    try {
      pool = await mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: dbName,
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
        charset: 'utf8mb4',
      });
      
      // Test connection by executing a simple query
      await pool.execute('SELECT 1');
      
      // Check if customers table exists
      const [tables] = await pool.query('SHOW TABLES LIKE "customers"');
      if (tables.length === 0) {
        console.log('Creating customers table...');
        await pool.query(`
          CREATE TABLE customers (
            customer_id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255),
            avatar VARCHAR(500) DEFAULT '/default-avatar.png',
            google_id VARCHAR(255) UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_email (email),
            INDEX idx_google_id (google_id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('Customers table created successfully');
      }
      
      // Store the working pool globally
      global.mysqlPool = pool;
      return;
      
    } catch (dbError) {
      if (dbError.code === 'ER_BAD_DB_ERROR') {
        console.log(`Database ${dbName} does not exist. Attempting to create...`);
        // Database doesn't exist, try to create it
        const tempConnection = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
        });

        // Create database (regular query, not prepared statement)
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        await tempConnection.end();
        
        // Now try to connect again
        return await initializeDatabase(); // Recursive call
      } else {
        throw dbError;
      }
    }
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

/**
 * API Endpoint: POST /api/auth/google
 * Body: { token: "<google_id_token>" }
 * Response: { token, user, isNewUser }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { token: googleIdToken } = req.body || {};
    if (!googleIdToken) {
      return res.status(400).json({ message: "Thiếu Google token" });
    }

    // Initialize database
    await initializeDatabase();
    const pool = getPool();

    // 1. Verify Google OAuth 2.0 token
    const googleProfile = await verifyGoogleToken(googleIdToken);

    if (!googleProfile.email || !googleProfile.emailVerified) {
      return res.status(401).json({ 
        message: "Tài khoản Google chưa xác thực email" 
      });
    }

    // 2. Check if user exists in customers table
    const [rows] = await pool.query(
      "SELECT customer_id, full_name, email, avatar FROM customers WHERE email = ? LIMIT 1",
      [googleProfile.email]
    );

    let userId;
    let userAvatar = "/default-avatar.png";
    let isNewUser = false;

    if (rows.length === 0) {
      // 2a. Create new user
      const [insertResult] = await pool.query(
        `INSERT INTO customers (full_name, phone, email, password_hash, avatar, google_id, created_at, updated_at)
         VALUES (?, NULL, ?, NULL, ?, ?, NOW(), NOW())`,
        [
          googleProfile.name || "Khách hàng",
          googleProfile.email,
          googleProfile.picture || "/default-avatar.png",
          googleProfile.sub, // Google user ID
        ]
      );
      userId = insertResult.insertId;
      userAvatar = googleProfile.picture || "/default-avatar.png";
      isNewUser = true;
    } else {
      // 2b. Update existing user info
      userId = rows[0].customer_id;
      userAvatar = googleProfile.picture || rows[0].avatar || "/default-avatar.png";
      
      await pool.query(
        `UPDATE customers SET 
          full_name = ?, 
          avatar = ?, 
          google_id = ?, 
          updated_at = NOW()
         WHERE customer_id = ?`,
        [
          googleProfile.name || "Khách hàng",
          googleProfile.picture || "/default-avatar.png",
          googleProfile.sub,
          userId
        ]
      );
    }

    // 3. Build user object for frontend
    const userObj = {
      id: userId,
      name: googleProfile.name,
      email: googleProfile.email,
      avatar: userAvatar,
      provider: "google",
      loginMethod: "google",
      role: "customer",
    };

    // 4. Generate application JWT token
    const appToken = signAppToken({
      id: userObj.id,
      email: userObj.email,
      provider: "google",
      role: "customer",
    });

    // 5. Return success response
    return res.status(200).json({
      token: appToken,
      user: userObj,
      isNewUser,
      message: isNewUser ? "Đăng ký thành công" : "Đăng nhập thành công"
    });

  } catch (err) {
    console.error("Google auth error:", err);
    
    // Provide specific error messages
    let errorMessage = "Không thể đăng nhập bằng Google";
    
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      errorMessage = "Lỗi kết nối database: Kiểm tra username/password MySQL";
    } else if (err.code === 'ECONNREFUSED') {
      errorMessage = "Không thể kết nối MySQL: Service chưa khởi động";
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      errorMessage = "Database không tồn tại: Vui lòng chạy setup_database.sql";
    } else if (err.code === 'ER_UNSUPPORTED_PS') {
      errorMessage = "Lỗi MySQL protocol: Không hỗ trợ prepared statement";
    } else if (err.message.includes('token') || err.message.includes('id_token')) {
      errorMessage = "Token Google không hợp lệ: " + err.message;
    }
    
    return res.status(500).json({
      message: errorMessage,
      error: err.message,
      details: err.code
    });
  }
}
