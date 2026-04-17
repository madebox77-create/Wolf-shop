import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      openAuthModal();
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center space-y-8">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-500">
          <ShoppingBag size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Your Cart is Empty</h1>
          <p className="text-gray-400">Looks like you haven't added anything to your pack yet.</p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-full hover:bg-red-700 transition-all"
        >
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12 bg-zinc-950">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display text-white">
            Your <span className="text-red-600">Cart</span>
          </h1>
          <p className="text-zinc-500 uppercase text-[10px] font-black tracking-[0.2em]">
            {cartCount} Items in your pack
          </p>
        </div>
        <Link to="/shop" className="flex items-center gap-2 text-zinc-500 hover:text-red-600 transition-colors uppercase text-[10px] font-black tracking-widest">
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col sm:flex-row gap-6 bg-zinc-900 p-6 rounded-[32px] border border-white/5 soft-shadow group"
              >
                <div className="w-full sm:w-32 aspect-square rounded-2xl overflow-hidden bg-zinc-800 border border-white/5 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] text-red-600 font-black uppercase tracking-widest">{item.category}</p>
                      <h3 className="text-xl font-black uppercase tracking-tight text-white hover:text-red-600 transition-colors">
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </h3>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-zinc-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                    <div className="flex items-center bg-zinc-800 border border-white/5 rounded-full p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-red-600 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-red-600 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Subtotal</p>
                      <p className="text-xl font-black text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="bg-zinc-900 p-8 rounded-[32px] border border-white/5 soft-shadow space-y-8 sticky top-32">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 uppercase tracking-widest font-black text-[10px]">Subtotal</span>
                <span className="font-bold text-white">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 uppercase tracking-widest font-black text-[10px]">Shipping</span>
                <span className="text-green-600 font-black uppercase text-[10px]">Calculated at next step</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 uppercase tracking-widest font-black text-[10px]">Tax</span>
                <span className="font-bold text-white">₹0</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                <span className="text-xl font-black uppercase tracking-tighter text-white">Total</span>
                <span className="text-3xl font-black text-red-600">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCheckout}
                className="w-full bg-red-600 text-white font-black uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white hover:text-zinc-900 transition-all active:scale-95 soft-shadow"
              >
                {user ? 'Proceed to Checkout' : 'Login to Checkout'} <ArrowRight size={20} />
              </button>
              <p className="text-[10px] text-center text-zinc-500 font-black uppercase tracking-widest">
                Taxes and shipping calculated at checkout
              </p>
            </div>

            <div className="pt-8 border-t border-white/5 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">We Accept</p>
              <div className="flex gap-3 opacity-50 grayscale hover:grayscale-0 transition-all">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
