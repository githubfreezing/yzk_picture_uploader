// auth/auth.ts
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // トークンがあれば true
};