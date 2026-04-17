import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  ShoppingBag, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CreditCard,
  Truck,
  ChevronDown,
  ChevronUp,
  Loader2,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface Order {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  products: any[];
  total_price: number;
  payment_method: string;
  status: string;
  created_at: string;
}

export const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-red-600" size={48} />
        <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">Fetching orders from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-900 border border-white/10 rounded-xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors w-80"
          />
        </div>
        <button 
          onClick={fetchOrders}
          className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => (
          <div 
            key={order.id}
            className="bg-zinc-900 border border-white/10 rounded-[32px] overflow-hidden soft-shadow transition-all hover:border-white/20"
          >
            <div 
              className="p-8 flex flex-wrap items-center justify-between gap-6 cursor-pointer"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-red-600">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black uppercase tracking-tighter text-white">#{order.id.substring(0, 8)}</h3>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                      order.status === 'paid' ? "bg-green-600/10 text-green-600" : "bg-yellow-600/10 text-yellow-600"
                    )}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                    {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="hidden md:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Customer</p>
                  <p className="text-sm font-black text-white">{order.name}</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Total</p>
                  <p className="text-lg font-black text-red-600">₹{order.total_price.toLocaleString()}</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Payment</p>
                  <p className="text-xs font-black text-white uppercase tracking-widest">{order.payment_method}</p>
                </div>
                {expandedOrder === order.id ? <ChevronUp size={20} className="text-zinc-500" /> : <ChevronDown size={20} className="text-zinc-500" />}
              </div>
            </div>

            <AnimatePresence>
              {expandedOrder === order.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/5 bg-white/[0.02]"
                >
                  <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Customer & Shipping */}
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-red-600">Customer Information</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-zinc-400">
                            <User size={16} />
                            <span className="text-sm font-bold">{order.name}</span>
                          </div>
                          <div className="flex items-center gap-3 text-zinc-400">
                            <Mail size={16} />
                            <span className="text-sm font-bold">{order.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-zinc-400">
                            <Phone size={16} />
                            <span className="text-sm font-bold">{order.phone}</span>
                          </div>
                          <div className="flex items-start gap-3 text-zinc-400">
                            <MapPin size={16} className="mt-1 shrink-0" />
                            <span className="text-sm font-bold leading-relaxed">{order.address}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-red-600">Order Timeline</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-zinc-400">
                            <Calendar size={16} />
                            <span className="text-sm font-bold italic">Placed on {new Date(order.created_at).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-3 text-zinc-400">
                            <CreditCard size={16} />
                            <span className="text-sm font-bold italic uppercase tracking-widest">Payment via {order.payment_method}</span>
                          </div>
                          <div className="flex items-center gap-3 text-zinc-400">
                            <Truck size={16} />
                            <span className="text-sm font-bold italic">Status: {order.status === 'paid' ? 'Paid & Processing' : 'Pending Payment (COD)'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-red-600">Order Items</h4>
                      <div className="space-y-4 bg-zinc-950/50 rounded-3xl p-6 border border-white/5">
                        {order.products.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-800 rounded-xl overflow-hidden shrink-0">
                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black uppercase tracking-tight text-white truncate">{item.name}</p>
                              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                            </div>
                            <p className="text-sm font-black text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                        <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total Amount</p>
                          <p className="text-2xl font-black text-red-600">₹{order.total_price.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="bg-zinc-900 border border-white/10 rounded-[40px] p-20 text-center space-y-4 soft-shadow">
            <ShoppingBag size={48} className="text-zinc-700 mx-auto" />
            <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">No orders found in Supabase.</p>
          </div>
        )}
      </div>
    </div>
  );
};
