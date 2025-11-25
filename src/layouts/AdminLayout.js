// src/layouts/AdminLayout.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import SidebarColapsible from '../components/SidebarColapsible';

const AdminLayout = ({ children, activeTab, setActiveTab, showSidebar = true }) => {
  const { authUser, loading } = useAuth();

  // Show loading if auth is still loading
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Đang tải...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundColor: '#fafafa'
    }}>
      {/* Sidebar */}
      {showSidebar && authUser && (
        <SidebarColapsible 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      )}
      
      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        padding: '2rem',
        overflowY: 'auto'
      }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;