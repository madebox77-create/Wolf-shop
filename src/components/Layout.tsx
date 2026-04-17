import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AuthModal } from './AuthModal';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const { user, loading, openAuthModal } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // Show login popup after 5 seconds if user is not logged in
    if (!loading && !user) {
      const timer = setTimeout(() => {
        openAuthModal();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user, loading, openAuthModal]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <Navbar />
      <AuthModal />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
