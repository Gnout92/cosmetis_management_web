// pages/_app.js
import '../styles/globals.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import React from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';

function LoadingSpinner() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(255,255,255,0.9)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
    }}>
      <div style={{
        width: '60px', height: '60px', border: '5px solid #ccc',
        borderTop: '5px solid #3b82f6', borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p>Đang tải...</p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const { isAuthenticated, authUser, logout, loading } = useAuth();
  const [isRouting, setIsRouting] = useState(false);


  useEffect(() => {
    const handleStart = () => setIsRouting(true);
    const handleComplete = () => setIsRouting(false);
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  if (loading || isRouting) return <LoadingSpinner />;

  return (
    <Component {...pageProps} user={authUser} onLogout={logout} />
  );
}

export default function MyApp(props) {
  return (
    <AuthProvider>
      <Head>
        <title>KaKa Cosmetics</title>
      </Head>
      <AppContent {...props} />
    </AuthProvider>
  );
}
