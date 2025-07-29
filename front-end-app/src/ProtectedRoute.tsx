import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to='/' />;
}