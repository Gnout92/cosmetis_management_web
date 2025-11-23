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
        const roles = authUser?.roles || [];
        const ok = roles.some(r => allowedRoles.includes(r));
        console.log('[withAuth] role check', { roles, ok });  
        if (!ok) router.replace('/'); // không đủ quyền
      }
    }, [authUser, token, isAuthenticated, router, isTokenValid]);
      if (!token) return null;
      if (allowedRoles.length && !(authUser?.roles && authUser.roles.length)) return null;
    return <Wrapped {...props} />;
  };
 
}
