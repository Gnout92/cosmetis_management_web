// src/utils/withAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

export default function withAuth(Wrapped, allowedRoles = []) {
  return function Guarded(props) {
    const router = useRouter();
    const { isAuthenticated, authUser, token, isTokenValid } = useAuth();

    useEffect(() => {
      console.log('[withAuth] entering', {
        tokenPresent: !!token,
        tokenValid: token ? isTokenValid() : false,
        allowedRoles,
        authUser,
      });
      
      // Chưa có token hoặc token hết hạn → về login
      if (!token || !isTokenValid()) {
        console.warn('[withAuth] no/invalid token → /login');
        router.replace('/login');
        return;
      }
      
      // Có danh sách role yêu cầu → kiểm tra
      if (allowedRoles.length > 0) {
        // Lấy role từ user object
        const userRole = authUser?.vai_tro || authUser?.role || authUser?.primaryRole || 'Customer';
        const normalizedRole = String(userRole).toLowerCase().replace(/[\s_]+/g, '');
        
        console.log('[withAuth] role check', { 
          originalRole: userRole, 
          normalizedRole, 
          allowedRoles,
          allowedRolesNormalized: allowedRoles.map(r => String(r).toLowerCase().replace(/[\s_]+/g, ''))
        });  
        
        const ok = allowedRoles.some(allowedRole => {
          const normalizedAllowed = String(allowedRole).toLowerCase().replace(/[\s_]+/g, '');
          return normalizedRole === normalizedAllowed;
        });
        
        if (!ok) {
          console.warn('[withAuth] insufficient role → redirect to home');
          router.replace('/');
          return;
        }
      }
    }, [authUser, token, isAuthenticated, router, isTokenValid]);
    
    // Không render gì nếu chưa có token
    if (!token) return null;
    
    // Nếu cần role nhưng user không có role phù hợp
    if (allowedRoles.length) {
      const userRole = authUser?.vai_tro || authUser?.role || authUser?.primaryRole || 'Customer';
      const normalizedRole = String(userRole).toLowerCase().replace(/[\s_]+/g, '');
      
      const hasRole = allowedRoles.some(allowedRole => {
        const normalizedAllowed = String(allowedRole).toLowerCase().replace(/[\s_]+/g, '');
        return normalizedRole === normalizedAllowed;
      });
      
      if (!hasRole) return null;
    }
    
    return <Wrapped {...props} />;
  };
}
