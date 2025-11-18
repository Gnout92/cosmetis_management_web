// src/hooks/useAuth.js - Custom hook cho authentication
import { useAuth as useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useAuthContext();
  
  return {
    ...context,
    // Additional functions
    updateUser: (userData) => {
      if (context.authUser) {
        const updatedUser = { ...context.authUser, ...userData };
        context.login(updatedUser, context.token);
      }
    },
    
    getCurrentUser: async () => {
      try {
        const res = await fetch('/api/user/getProfile', {
          headers: {
            'Authorization': `Bearer ${context.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            context.login(data.data, context.token);
            return data.data;
          }
        }
      } catch (error) {
        console.error('Get current user error:', error);
      }
      return context.authUser;
    },
    
    updateProfile: async (profileData) => {
      try {
        const res = await fetch('/api/user/updateProfile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${context.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(profileData)
        });
        
        const data = await res.json();
        
        if (res.ok && data.success) {
          // Update user in context
          if (context.authUser) {
            const updatedUser = { 
              ...context.authUser, 
              ten_hien_thi: data.data.ten_hien_thi,
              ho: data.data.ho,
              ten: data.data.ten,
              ngay_sinh: data.data.ngay_sinh,
              gioi_tinh: data.data.gioi_tinh,
              anh_dai_dien: context.authUser.anh_dai_dien // Keep existing avatar
            };
            context.login(updatedUser, context.token);
          }
          return { success: true, data: data.data };
        } else {
          throw new Error(data.message || 'Update failed');
        }
      } catch (error) {
        console.error('Update profile error:', error);
        throw error;
      }
    }
  };
};