import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Shield, Truck, RotateCcw, Plus, Minus, Share2, Heart, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { getProducts, trackClick } from '../services/database';
import { Product } from '../types';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [products, setProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(() => {
    const saved = localStorage.getItem(`wolf_fav_${id}`);
    return saved === 'true';
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const unsubscribe = getProducts(setProducts);
    return () => unsubscribe();
  }, []);

  const product = products.find(p => p.id === id);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (product.affiliateLink) {
      await trackClick(product.id);
      window.open(product.affiliateLink, '_blank');
    } else {
      addToCart(product, quantity);
    }
  };

  if (!product) {
    return (
      <div className="pt-40 pb-20 text-center space-y-6">
        <h1 className="text-4xl font-black uppercase">Product Not Found</h1>
        <Link to="/shop" className="inline-block text-red-500 font-bold uppercase tracking-widest hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleShare = async () => {
    if (navigator.share && navigator.canShare?.({ url: window.location.href })) {
      try {
        await navigator.share({
          title: `WOLF | ${product.name}`,
          text: product.description,
          url: window.location.href,
        });
        showToast('Shared successfully');
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error sharing:', err);
          showToast('Could not share', 'error');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard');
      } catch (err) {
        console.error('Clipboard error:', err);
        showToast('Failed to copy link', 'error');
      }
    }
  };

  const handleFavorite = () => {
    const newState = !isFavorited;
    setIsFavorited(newState);
    localStorage.setItem(`wolf_fav_${id}`, String(newState));
    showToast(newState ? 'Added to Wishlist' : 'Removed from Wishlist');
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-16 bg-zinc-950">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={cn(
              "fixed bottom-10 left-1/2 z-[100] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] soft-shadow border",
              toast.type === 'success' ? "bg-zinc-900 text-white border-red-600/20" : "bg-red-600 text-white border-white/10"
            )}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs & Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-500 hover:text-red-600 transition-colors uppercase text-[10px] font-black tracking-widest"
      >
        <ArrowLeft size={14} /> Back to Collection
      </button>

      {/* Product Main */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Image Gallery - Large Top Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="aspect-square rounded-[40px] overflow-hidden bg-zinc-900 soft-shadow border border-white/5">
            <img
              src={product.images[activeImage] || product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800';
                (e.target as HTMLImageElement).style.filter = 'grayscale(100%) brightness(0.2)';
              }}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {(product.images.length > 0 ? product.images : [product.image]).map((img, i) => (
              <div 
                key={i} 
                onClick={() => setActiveImage(i)}
                className={cn(
                  "aspect-square rounded-2xl overflow-hidden bg-zinc-900 border soft-shadow transition-all cursor-pointer",
                  activeImage === i ? "border-red-600 opacity-100" : "border-white/5 opacity-60 hover:opacity-100"
                )}
              >
                <img
                  src={img}
                  alt={`${product.name} view ${i}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800';
                    (e.target as HTMLImageElement).style.filter = 'grayscale(100%) brightness(0.2)';
                  }}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info - Card Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="app-card p-8 md:p-12 space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5">
                  {product.category}
                </span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                  product.stock > 0 ? "bg-zinc-800 text-emerald-500 border-emerald-500/20" : "bg-zinc-800 text-red-500 border-red-500/20"
                )}>
                  {product.stock > 0 ? `In Stock: ${product.stock}` : 'Sold Out'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={14} fill="currentColor" />
                <span className="text-xs font-bold text-zinc-400 ml-1">{product.rating}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none font-display text-white">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-4">
              <p className="text-4xl font-black text-white tracking-tighter">₹{product.price.toLocaleString('en-IN')}</p>
              <p className="text-sm text-zinc-500 line-through tracking-tighter">₹{(product.price * 1.2).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Overview</h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
              {product.description}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-6 pt-8 border-t border-white/5">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center bg-zinc-900 rounded-2xl p-1 border border-white/10 w-full sm:w-auto">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-zinc-500 hover:text-red-600 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-black text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-zinc-500 hover:text-red-600 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 w-full bg-red-600 text-white font-black uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white hover:text-zinc-900 transition-all active:scale-95 soft-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.affiliateLink ? (
                  <>
                    <ExternalLink size={20} /> {product.stock > 0 ? 'Buy on Amazon' : 'Out of Stock'}
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </>
                )}
              </button>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleFavorite}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all soft-shadow",
                  isFavorited 
                    ? "bg-red-600 border-red-600 text-white" 
                    : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:border-white"
                )}
              >
                <Heart size={16} fill={isFavorited ? "currentColor" : "none"} /> 
                {isFavorited ? 'In Wishlist' : 'Save to Wishlist'}
              </button>
              <button 
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-zinc-900 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white transition-all soft-shadow"
              >
                <Share2 size={16} /> 
                Share Gear
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center space-y-2 p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
              <div className="w-10 h-10 bg-red-600/10 rounded-full flex items-center justify-center mx-auto text-red-600">
                <Truck size={18} />
              </div>
              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Insured Shipping</p>
            </div>
            <div className="text-center space-y-2 p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
              <div className="w-10 h-10 bg-red-600/10 rounded-full flex items-center justify-center mx-auto text-red-600">
                <RotateCcw size={18} />
              </div>
              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">30 Day Returns</p>
            </div>
            <div className="text-center space-y-2 p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
              <div className="w-10 h-10 bg-red-600/10 rounded-full flex items-center justify-center mx-auto text-red-600">
                <Shield size={18} />
              </div>
              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Wolf Warranty</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs - Journal Style */}
      <div className="app-card p-8 md:p-12 space-y-8">
        <div className="flex gap-8 border-b border-white/5 overflow-x-auto custom-scrollbar">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                activeTab === tab ? "text-red-600" : "text-zinc-500 hover:text-white"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[150px] text-zinc-400 text-sm leading-relaxed">
          {activeTab === 'description' && (
            <div className="space-y-4 max-w-3xl">
              <p>
                The {product.name} blends high-grade materials with cutting-edge tech.
              </p>
              <p>
                Built for the urban jungle and the great outdoors. Sleek, aggressive, and durable.
              </p>
            </div>
          )}
          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white font-bold uppercase text-[10px] tracking-widest">Material</span>
                  <span className="text-xs">Premium Grade Alpha-X</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white font-bold uppercase text-[10px] tracking-widest">Weight</span>
                  <span className="text-xs">Lightweight (0.8kg)</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white font-bold uppercase text-[10px] tracking-widest">Warranty</span>
                  <span className="text-xs">2 Year Limited</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white font-bold uppercase text-[10px] tracking-widest">SKU</span>
                  <span className="text-xs">WLF-{product.id}00X</span>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-8 max-w-3xl">
              {[
                { name: 'John D.', rating: 5, date: '2 days ago', text: 'Absolutely incredible quality. Exceeded my expectations.' },
                { name: 'Elena R.', rating: 4, date: '1 week ago', text: 'Sleek design and very functional. Shipping was fast.' },
              ].map((rev, i) => (
                <div key={i} className="space-y-2 pb-6 border-b border-white/5 last:border-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, j) => <Star key={j} size={10} fill={j < rev.rating ? "currentColor" : "none"} />)}
                      </div>
                      <span className="text-white font-bold text-xs">{rev.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">{rev.date}</span>
                  </div>
                  <p className="text-zinc-400 italic text-sm">"{rev.text}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-12 pt-12">
          <div className="space-y-1">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-red-600">Complete the Look</h2>
            <h3 className="text-3xl font-black tracking-tighter uppercase font-display text-white">Related Products</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
};
