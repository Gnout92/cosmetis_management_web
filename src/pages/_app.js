// src/pages/_app.js
import "../styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import React, { useEffect, useState, createContext, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import MainLayout from "../layouts/MainLayout";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

function LoadingOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(255,255,255,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          border: "5px solid #ccc",
          borderTop: "5px solid #ff6b9d",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ marginTop: 12, color: '#666' }}>Đang tải...</p>

      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .dark {
          color-scheme: dark;
        }
      `}</style>
    </div>
  );
}

// Phần AppContent chạy BÊN TRONG AuthProvider, nên có thể gọi useAuth()
function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const { loading } = useAuth();
  const [isRouting, setIsRouting] = useState(false);
  const [theme, setTheme] = useState('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Handle theme changes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const handleStart = () => setIsRouting(true);
    const handleDone = () => setIsRouting(false);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleDone);
      router.events.off("routeChangeError", handleDone);
    };
  }, [router.events]);

  const showBusy = loading || isRouting;
  if (showBusy) return <LoadingOverlay />;

  // hỗ trợ per-page layout, fallback MainLayout
  const getLayout = Component.getLayout || ((page) => <MainLayout>{page}</MainLayout>);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {getLayout(<Component {...pageProps} />)}
    </ThemeContext.Provider>
  );
}

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Beauty Shop - Mỹ Phẩm Cao Cấp</title>
        <meta name="description" content="Beauty Shop - Mua sắm mỹ phẩm online chất lượng cao" />
      </Head>

      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
} 
