// src/pages/_app.js
import "../styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import MainLayout from "../layouts/MainLayout";
import { AuthProvider, useAuth } from "../context/AuthContext";

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
          borderTop: "5px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ marginTop: 12 }}>Đang tải...</p>

      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const { loading } = useAuth();
  const [isRouting, setIsRouting] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsRouting(true);
    const handleDone = () => setIsRouting(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleDone);
    router.events.on("routeChangeError", handleDone);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleDone);
      router.events.off("routeChangeError", handleDone);
    };
  }, [router.events]);

  const showBusy = loading || isRouting;
  if (showBusy) return <LoadingOverlay />;

  // Per-page layout pattern
  const getLayout =
    Component.getLayout ||
    ((page) => <MainLayout>{page}</MainLayout>);

  return getLayout(<Component {...pageProps} />);
}

export default function MyApp(props) {
  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>KaKa Cosmetics</title>
      </Head>
      <AppContent {...props} />
    </AuthProvider>
  );
}
