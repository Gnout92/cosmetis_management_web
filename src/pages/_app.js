// src/pages/_app.js
import '../styles/globals.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import React from 'react';
// import '@/styles/globals.css';
function LoadingSpinner() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      flexDirection: 'column',
      gap: '20px',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        border: '5px solid #e5e7eb',
        borderTop: '5px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{
        color: '#475569',
        fontSize: '16px',
        fontWeight: '600',
        letterSpacing: '0.5px'
      }}>
        Đang tải...
      </p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Auth Hook
function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    router.push('/login');
  };

  return { user, loading, login, logout };
}

// Main App Component
export default function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading: authLoading, login, logout } = useAuth();
  const router = useRouter();

  // Handle route changes
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // Redirect logic
  useEffect(() => {
    if (!authLoading) {
      const isLoginPage = router.pathname === '/login';
      
      if (!user && !isLoginPage) {
        // User not logged in and not on login page - redirect to login
        router.push('/login');
      } else if (user && isLoginPage) {
        // User logged in but on login page - redirect to dashboard
        router.push('/');
      }
    }
  }, [user, authLoading, router.pathname]);

  // Show loading during auth check
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Show loading during route changes
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Head>
        <title>MenCare Admin Dashboard</title>
        <meta name="description" content="Hệ thống quản lý toàn diện cho doanh nghiệp chăm sóc da nam" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Font Awesome */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        
        {/* Google Fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Meta tags for SEO */}
        <meta property="og:title" content="MenCare Admin Dashboard" />
        <meta property="og:description" content="Hệ thống quản lý toàn diện cho doanh nghiệp chăm sóc da nam" />
        <meta property="og:type" content="website" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#3b82f6" />
      </Head>

      <Component 
        {...pageProps} 
        user={user}
        onLogin={login}
        onLogout={logout}
      />

      {/* Global Styles */}
      <style jsx global>{`
        /* Loading Animation */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /* Utility classes */
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .slide-in-up {
          animation: slideInUp 0.5s ease-out;
        }

        .slide-in-down {
          animation: slideInDown 0.5s ease-out;
        }

        .slide-in-left {
          animation: slideInLeft 0.5s ease-out;
        }

        .slide-in-right {
          animation: slideInRight 0.5s ease-out;
        }

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
}