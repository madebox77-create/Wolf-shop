import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye, ExternalLink } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { trackClick } from '../services/database';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.affiliateLink) {
      await trackClick(product.id);
      window.open(product.affiliateLink, '_blank');
    } else {
      addToCart(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative app-card overflow-hidden flex flex-col h-full"
    >
      {/* Clickable Image Area */}
      <Link to={`/product/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-zinc-900 rounded-[20px] block">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800';
            (e.target as HTMLImageElement).style.filter = 'grayscale(100%) brightness(0.2)';
          }}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          <div className="w-12 h-12 bg-white text-zinc-900 rounded-full flex items-center justify-center soft-shadow transform scale-50 group-hover:scale-100 transition-transform duration-500">
            <Eye size={20} />
          </div>
        </div>

        {product.featured && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest soft-shadow">
            Featured
          </div>
        )}
        
        <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest soft-shadow flex items-center gap-1 border border-white/5">
          <Star size={12} fill="currentColor" className="text-yellow-500" /> {product.rating}
        </div>

        {/* Stock Indicator */}
        <div className="absolute bottom-4 left-4">
          <div className="text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-zinc-900/60 backdrop-blur-md border border-white/10 text-zinc-300">
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Sold Out'}
          </div>
        </div>
      </Link>

      {/* Content Area */}
      <div className="pt-5 pb-4 px-3 space-y-3 flex-1 flex flex-col">
        <Link to={`/product/${product.id}`} className="space-y-1 block flex-1">
          <div className="flex justify-between items-start">
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{product.category}</p>
          </div>
          <h3 className="text-sm font-black text-white group-hover:text-red-600 transition-colors truncate uppercase tracking-tight">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-black text-white tracking-tighter">₹{product.price.toLocaleString('en-IN')}</p>
          </div>
        </Link>
        
        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="w-full h-11 bg-white text-zinc-900 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all active:scale-95 font-black uppercase tracking-widest text-[10px] disabled:opacity-50 disabled:cursor-not-allowed soft-shadow"
        >
          {product.affiliateLink ? (
            <>
              <ExternalLink size={14} /> Buy on Amazon
            </>
          ) : (
            <>
              <ShoppingCart size={14} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
