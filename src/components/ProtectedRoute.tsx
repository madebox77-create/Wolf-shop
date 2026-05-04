import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { isAdminEmail } from '../constants/admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Fast check for hardcoded admin session
  const isWolfAdmin = localStorage.getItem('is_wolf_admin') === 'true';

  if (isWolfAdmin && adminOnly) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    const loginPath = adminOnly ? '/admin/login' : '/';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (adminOnly) {
    // Check if user is in the admin email list
    const isAdmin = isAdminEmail(user.email);
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Access Denied</h1>
            <p className="text-zinc-500">You do not have administrative privileges.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-white hover:text-zinc-900 transition-all"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
