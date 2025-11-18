// src/pages/api/utils/authDebug.js
// Debug utilities for authentication issues
// Use: Copy this code and paste into browser console, then run debugAuth()

export function debugAuth() {
  console.log("🔍 === AUTHENTICATION DEBUG ===");
  
  // Check localStorage
  console.log("\n📦 LOCAL STORAGE:");
  const user = localStorage.getItem("user");
  const authToken = localStorage.getItem("authToken");
  const token = localStorage.getItem("token");
  
  console.log("👤 User:", user ? "EXISTS" : "MISSING");
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      console.log("👤 User data:", parsedUser);
    } catch (e) {
      console.log("❌ User JSON parse error:", e);
    }
  }
  
  console.log("🔑 AuthToken:", authToken ? "EXISTS" : "MISSING");
  console.log("🔑 Token:", token ? "EXISTS" : "MISSING");
  
  // Check sessionStorage
  console.log("\n🔄 SESSION STORAGE:");
  const sessionUser = sessionStorage.getItem("user");
  const sessionToken = sessionStorage.getItem("authToken");
  
  console.log("👤 Session User:", sessionUser ? "EXISTS" : "MISSING");
  console.log("🔑 Session AuthToken:", sessionToken ? "EXISTS" : "MISSING");
  
  // Check cookies
  console.log("\n🍪 COOKIES:");
  console.log(document.cookie);
  
  // Test API connection
  console.log("\n🌐 API TEST:");
  if (authToken) {
    testApiConnection(authToken);
  } else {
    console.log("⚠️ No auth token to test API");
  }
  
  // Provide next steps
  console.log("\n💡 NEXT STEPS:");
  console.log("1. If user data is missing, try running: fixAuth()");
  console.log("2. If you have an invalid token, try: clearAuth()");
  console.log("3. To test API manually, run: testApi()");
  console.log("4. To mock login for testing, run: mockLogin()");
}

export function fixAuth() {
  console.log("🔧 Fixing authentication state...");
  
  // Try to fix user data
  const sessionUser = sessionStorage.getItem("user");
  if (sessionUser && !localStorage.getItem("user")) {
    console.log("🔄 Restoring user from sessionStorage");
    localStorage.setItem("user", sessionUser);
  }
  
  // Try to fix token
  const sessionToken = sessionStorage.getItem("authToken");
  if (sessionToken && !localStorage.getItem("authToken")) {
    console.log("🔄 Restoring token from sessionStorage");
    localStorage.setItem("authToken", sessionToken);
    localStorage.setItem("token", sessionToken);
  }
  
  console.log("✅ Authentication state fix completed");
  debugAuth(); // Re-run debug to show results
}

export function clearAuth() {
  console.log("🗑️ Clearing all authentication data...");
  
  // Clear localStorage
  localStorage.removeItem("user");
  localStorage.removeItem("authToken");
  localStorage.removeItem("token");
  
  // Clear sessionStorage
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("authToken");
  
  // Clear cookies
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  
  console.log("✅ All authentication data cleared");
  debugAuth(); // Re-run debug to show results
}

export function mockLogin() {
  console.log("🎭 Creating mock login data...");
  
  const mockUser = {
    id: "test-user-123",
    name: "LE NGUYEN MINH TIEN",
    ten_hien_thi: "LE NGUYEN MINH TIEN",
    email: "test@example.com",
    ten_dang_nhap: "testuser",
    so_dien_thoai: "+84123456789"
  };
  
  const mockToken = "mock-jwt-token-" + Date.now();
  
  localStorage.setItem("user", JSON.stringify(mockUser));
  localStorage.setItem("authToken", mockToken);
  localStorage.setItem("token", mockToken);
  
  console.log("✅ Mock login data created:", { user: mockUser, token: mockToken });
  debugAuth(); // Re-run debug to show results
}

export async function testApi() {
  console.log("🌐 Testing API connection...");
  
  const authToken = localStorage.getItem("authToken") || localStorage.getItem("token");
  
  if (!authToken) {
    console.log("❌ No auth token available");
    return;
  }
  
  try {
    console.log("📡 Making API call with token:", authToken);
    
    const response = await fetch("/api/auth/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json"
      }
    });
    
    console.log("📡 Response status:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ API call successful:", data);
    } else {
      const errorText = await response.text();
      console.log("❌ API call failed:", errorText);
    }
  } catch (error) {
    console.log("💥 API call error:", error);
  }
}

async function testApiConnection(token) {
  try {
    console.log("📡 Testing API connection...");
    
    const response = await fetch("/api/auth/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    console.log("📡 Response status:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ API connection successful:", data);
    } else {
      const errorText = await response.text();
      console.log("❌ API connection failed:", errorText);
    }
  } catch (error) {
    console.log("💥 API connection error:", error);
  }
}

// Auto-run debug if this file is imported
if (typeof window !== 'undefined') {
  // Make functions globally available
  window.debugAuth = debugAuth;
  window.fixAuth = fixAuth;
  window.clearAuth = clearAuth;
  window.mockLogin = mockLogin;
  window.testApi = testApi;
  
  console.log("🔧 Auth debug utilities loaded. Run debugAuth() to start debugging.");
}