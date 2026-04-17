import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 text-white pt-20 pb-10 border-t border-white/10 soft-shadow">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="text-3xl font-black tracking-tighter flex items-center gap-2 font-display group">
            <div className="bg-red-600 text-white px-3 py-1 rounded-2xl italic soft-shadow group-hover:bg-white group-hover:text-red-600 transition-all">WOLF</div>
          </Link>
          <p className="text-zinc-500 text-xs leading-relaxed max-w-[200px]">
            Premium gear for the modern predator. Luxury aesthetics, high-performance.
          </p>
          <div className="flex gap-3">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all soft-shadow">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[10px] font-black mb-6 uppercase tracking-widest text-zinc-500">Quick Links</h4>
          <ul className="space-y-4 text-zinc-400 text-xs font-black uppercase tracking-widest">
            <li><Link to="/" className="hover:text-red-600 transition-colors">Home</Link></li>
            <li><Link to="/shop" className="hover:text-red-600 transition-colors">Shop All</Link></li>
            <li><Link to="/shop?wishlist=true" className="hover:text-red-600 transition-colors">Wishlist</Link></li>
            <li><Link to="/contact" className="hover:text-red-600 transition-colors">Contact Us</Link></li>
            <li><Link to="/support" className="hover:text-red-600 transition-colors">Support Center</Link></li>
            <li><Link to="/faq" className="hover:text-red-600 transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Support & Policies */}
        <div>
          <h4 className="text-[10px] font-black mb-6 uppercase tracking-widest text-zinc-500">Policies</h4>
          <ul className="space-y-4 text-zinc-400 text-xs font-black uppercase tracking-widest">
            <li><Link to="/shipping-policy" className="hover:text-red-600 transition-colors">Shipping Policy</Link></li>
            <li><Link to="/returns-exchanges" className="hover:text-red-600 transition-colors">Returns & Exchanges</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-red-600 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="hover:text-red-600 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[10px] font-black mb-6 uppercase tracking-widest text-red-600">Get in Touch</h4>
          <ul className="space-y-4 text-zinc-400 text-xs font-black uppercase tracking-widest">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-red-600 shrink-0" />
              <span>School Danga, Bankura, West Bengal, India</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-red-600 shrink-0" />
              <span>+91 9046223528</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-red-600 shrink-0" />
              <span>wolfbankurawolfbankura@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
        <p>© 2026 WOLF BRAND. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6">
          <span>Designed for the Bold</span>
          <span>Built for the Pack</span>
        </div>
      </div>
    </footer>
  );
};
