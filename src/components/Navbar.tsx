import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount } = useCart();
  const { user, logout, openAuthModal } = useAuth();
  const location = useLocation();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Admin', path: '/admin/login' },
    { name: 'Wishlist', path: '/shop?wishlist=true' },
    { name: 'Contact', path: '/contact' },
    { name: 'Support', path: '/support' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4',
        isScrolled ? 'bg-zinc-900/80 backdrop-blur-xl py-3 soft-shadow' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-3xl font-black tracking-tighter text-white flex items-center gap-2 font-display group">
          <div className="bg-red-600 text-white px-3 py-1 rounded-2xl italic soft-shadow group-hover:bg-white group-hover:text-red-600 transition-all">WOLF</div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-red-600 relative group',
                location.pathname === link.path ? 'text-red-600' : 'text-zinc-400'
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-1 left-0 h-0.5 bg-red-600 transition-all duration-300",
                location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
              )} />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="text"
                  placeholder="Search pack..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-zinc-800 border-none rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600/20 mr-2"
                />
              )}
            </AnimatePresence>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-zinc-400 hover:text-red-600 transition-colors"
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <span className="text-[8px] font-bold text-red-600 uppercase tracking-widest">Alpha Member</span>
              </div>
              <button 
                onClick={logout}
                className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all soft-shadow"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={openAuthModal}
              className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all soft-shadow"
              title="Login"
            >
              <User size={18} />
            </button>
          )}

          <Link to="/cart" className="relative w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white hover:bg-white hover:text-zinc-900 transition-all soft-shadow">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-red-600 text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-red-600">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-zinc-900 soft-shadow border-t border-white/5 p-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'text-lg font-bold uppercase tracking-widest transition-colors',
                    location.pathname === link.path ? 'text-red-600' : 'text-white hover:text-red-400'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-lg font-bold uppercase tracking-widest text-red-600 text-left flex items-center gap-3"
                >
                  <LogOut size={20} /> Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
