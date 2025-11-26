// src/lib/authToken.js
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;

  let token = localStorage.getItem('authToken');
  if (!token) {
    console.warn('⚠️ No token found in localStorage');
    return null;
  }

  if (!token.startsWith('Bearer ')) {
    token = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  }

  return token;
};
