import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, ShieldCheck, Truck, CheckCircle2, Wallet } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

declare const Razorpay: any;

export const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, loading, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: 'India',
  });

  useEffect(() => {
    // Check if Razorpay script is loaded
    const checkRazorpay = () => {
      if (typeof Razorpay === 'undefined') {
        console.warn("Razorpay SDK not found, attempting to reload...");
        const script = document.createElement('script');
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.head.appendChild(script);
      } else {
        console.log("Razorpay SDK is ready");
      }
    };
    checkRazorpay();

    if (!loading && !user && !isOrdered) {
      navigate('/cart');
      openAuthModal();
    } else if (user) {
      setFormData(prev => ({ 
        ...prev, 
        fullName: user.displayName || prev.fullName,
        email: user.email || prev.email 
      }));
    }
  }, [user, loading, navigate, openAuthModal, isOrdered]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveOrderToSupabase = async (generatedId: string, status: string = 'pending') => {
    try {
      const orderData = {
        id: generatedId,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.zip}, ${formData.country}`,
        products: cart,
        total_price: cartTotal,
        payment_method: paymentMethod,
        status: status,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from("orders")
        .insert([orderData]);

      if (error) {
        console.error("Supabase Order Save Error:", error);
        // We don't block the UI here since the user already saw success, 
        // but in a real app we might want to retry or log to a secondary service
      } else {
        console.log("Order saved to Supabase successfully");
      }
    } catch (err) {
      console.error("Unexpected error saving to Supabase:", err);
    }
  };

  const handleRazorpayPayment = async () => {
    const rzpWindow = window as any;
    if (!rzpWindow.Razorpay) {
      setIsProcessing(false);
      alert("Payment system is still loading. Please wait 2 seconds and try again.");
      return;
    }

    const RAZORPAY_KEY_ID = (import.meta as any).env.VITE_RAZORPAY_KEY_ID || "rzp_live_SaynzqwF2GvwDh";
    console.log("Initializing Razorpay with Key ID:", RAZORPAY_KEY_ID);
    
    // Ensure amount is at least 100 paise (1 INR)
    const finalAmount = Math.max(100, Math.round(cartTotal * 100));

    try {
      console.log("Creating order on server for amount:", finalAmount);
      // Create order on server
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalAmount,
          currency: 'INR',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server order creation failed:", errorText);
        throw new Error(`Failed to create order on server: ${errorText}`);
      }

      const orderData = await response.json();
      console.log("Order created successfully:", orderData);

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Wolf Gear",
        description: "Order Payment",
        order_id: orderData.id,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200",
        handler: async function (response: any) {
          console.log("Payment Successful", response);
          const generatedOrderId = `WLF-${Math.floor(Math.random() * 1000000)}`;
          setOrderId(generatedOrderId);
          
          // Save to Supabase
          await saveOrderToSupabase(generatedOrderId, 'paid');
          
          setIsProcessing(false);
          setIsOrdered(true);
          clearCart();
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed by user");
            setIsProcessing(false);
          },
          escape: true,
          backdropclose: false
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#dc2626"
        },
        retry: {
          enabled: true,
          enabled_net_err: true
        }
      };

      const rzp = new rzpWindow.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error("Payment Failed", response.error);
        alert(`Payment Failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error) {
      console.error("Razorpay initialization error:", error);
      alert("Could not initialize payment. Please check your connection.");
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.phone || formData.phone.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === 'online') {
      handleRazorpayPayment();
    } else {
      // COD Flow
      const generatedOrderId = `WLF-${Math.floor(Math.random() * 1000000)}`;
      setOrderId(generatedOrderId);
      
      // Save to Supabase
      await saveOrderToSupabase(generatedOrderId, 'pending');
      
      setIsOrdered(true);
      clearCart();
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !isOrdered) {
    navigate('/shop');
    return null;
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto bg-zinc-950">
      <AnimatePresence mode="wait">
        {isOrdered ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center space-y-8 py-20"
          >
            <div className="w-24 h-24 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={64} />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-black uppercase tracking-tighter text-white font-display">
                {paymentMethod === 'cod' ? 'Order Confirmed!' : 'Payment Initiated!'}
              </h1>
              <p className="text-zinc-400 text-lg">
                {paymentMethod === 'cod' 
                  ? "Order placed successfully (Cash on Delivery). Welcome to the pack."
                  : "Payment successful! Your premium gear is being prepared for shipment."}
                You will receive a confirmation email shortly.
              </p>
            </div>
            <div className="p-8 bg-zinc-900 rounded-[32px] border border-white/5 text-left space-y-4 soft-shadow">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Order Details</p>
              <p className="text-sm text-zinc-400">Order ID: <span className="text-white font-black">#{orderId}</span></p>
              <p className="text-sm text-zinc-400">Estimated Delivery: <span className="text-white font-black">3-5 Business Days</span></p>
              <p className="text-sm text-zinc-400">Payment Status: <span className="text-green-600 font-black uppercase">{paymentMethod === 'cod' ? 'Pending (COD)' : 'Paid'}</span></p>
              <div className="pt-4">
                <Link 
                  to={`/track/${orderId}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-zinc-900 transition-all soft-shadow"
                >
                  <Truck size={14} /> Track Your Order
                </Link>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Link to="/" className="text-red-600 uppercase text-[10px] font-black tracking-widest hover:text-white transition-colors">Return to Home</Link>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Redirecting to home in 5 seconds...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="checkout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="space-y-2">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display text-white">
                  Secure <span className="text-red-600">Checkout</span>
                </h1>
                <p className="text-zinc-500 uppercase text-[10px] font-black tracking-[0.2em]">
                  Complete your order to join the pack
                </p>
              </div>
              <Link to="/cart" className="flex items-center gap-2 text-zinc-500 hover:text-red-600 transition-colors uppercase text-[10px] font-black tracking-widest">
                <ArrowLeft size={16} /> Back to Cart
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Form */}
              <div className="lg:col-span-2 space-y-12">
                {/* Shipping Info */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-black">1</div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Shipping Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Name</label>
                      <input
                        required
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600 transition-colors soft-shadow"
                        placeholder="John Wolf"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600 transition-colors soft-shadow"
                        placeholder="alpha@wolf.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Phone Number</label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600 transition-colors soft-shadow"
                        placeholder="+91 9046223528"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600 transition-colors appearance-none soft-shadow"
                      >
                        <option>India</option>
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Address</label>
                      <input
                        required
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600 transition-colors soft-shadow"
                        placeholder="School Danga, Bankura, West Bengal"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">City</label>
                      <input
                        required
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600 transition-colors soft-shadow"
                        placeholder="Bankura"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">ZIP / Postal Code</label>
                      <input
                        required
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600 transition-colors soft-shadow"
                        placeholder="722101"
                      />
                    </div>
                  </div>
                </section>

                {/* Payment Info */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-black">2</div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Payment Method</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online')}
                      className={cn(
                        "w-full p-6 bg-zinc-900 border rounded-[24px] flex items-center justify-between transition-all soft-shadow",
                        paymentMethod === 'online' ? "border-red-600 ring-1 ring-red-600/20" : "border-white/5 hover:border-white/10"
                      )}
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                          paymentMethod === 'online' ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-400"
                        )}>
                          <CreditCard size={24} />
                        </div>
                        <div>
                          <p className="font-black uppercase tracking-widest text-[10px] text-white">Online Payment</p>
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Secure Payment via Razorpay</p>
                        </div>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 transition-all",
                        paymentMethod === 'online' ? "border-red-600 bg-red-600" : "border-white/10 bg-zinc-800"
                      )}>
                        {paymentMethod === 'online' && <div className="w-full h-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={cn(
                        "w-full p-6 bg-zinc-900 border rounded-[24px] flex items-center justify-between transition-all soft-shadow",
                        paymentMethod === 'cod' ? "border-red-600 ring-1 ring-red-600/20" : "border-white/5 hover:border-white/10"
                      )}
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                          paymentMethod === 'cod' ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-400"
                        )}>
                          <Wallet size={24} />
                        </div>
                        <div>
                          <p className="font-black uppercase tracking-widest text-[10px] text-white">Cash on Delivery</p>
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Pay when you receive the gear</p>
                        </div>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 transition-all",
                        paymentMethod === 'cod' ? "border-red-600 bg-red-600" : "border-white/10 bg-zinc-800"
                      )}>
                        {paymentMethod === 'cod' && <div className="w-full h-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>}
                      </div>
                    </button>

                    <div className="p-8 bg-zinc-900 border border-white/5 rounded-[32px] space-y-4 soft-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <p className="font-black uppercase tracking-widest text-[10px] text-white">Secure Transaction</p>
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Your payment is encrypted and secure</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Summary */}
              <div className="space-y-6">
                <div className="bg-zinc-900 p-8 rounded-[32px] border border-white/5 space-y-8 sticky top-32 soft-shadow">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Order Summary</h2>
                  
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 border border-white/5 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black text-white truncate uppercase tracking-tight">{item.name}</p>
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-black text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500 uppercase tracking-widest font-black text-[10px]">Subtotal</span>
                      <span className="font-black text-white">₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500 uppercase tracking-widest font-black text-[10px]">Shipping</span>
                      <span className="text-green-600 font-black uppercase text-[10px]">Free</span>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                      <span className="text-xl font-black uppercase tracking-tighter text-white">Total</span>
                      <span className="text-3xl font-black text-red-600">₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-red-600 text-white font-black uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white hover:text-zinc-900 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed soft-shadow"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      paymentMethod === 'online' ? 'Pay & Place Order' : 'Place Order (COD)'
                    )}
                  </button>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 text-zinc-500">
                      <ShieldCheck size={16} className="text-green-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest">SSL Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500">
                      <Truck size={16} className="text-red-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Insured Shipping</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
