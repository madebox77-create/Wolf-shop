import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, Package, MapPin, CheckCircle2, ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const TrackOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [status, setStatus] = useState<'processing' | 'shipped' | 'out-for-delivery' | 'delivered'>('processing');

  // Mock tracking logic
  useEffect(() => {
    const statuses: ('processing' | 'shipped' | 'out-for-delivery' | 'delivered')[] = [
      'processing', 'shipped', 'out-for-delivery', 'delivered'
    ];
    // Random status for demo
    const randomStatus = statuses[Math.floor(Math.random() * 2)]; // Keep it early for new orders
    setStatus(randomStatus);
  }, [orderId]);

  const steps = [
    { id: 'processing', label: 'Order Processed', icon: Package, description: 'Your order is being prepared' },
    { id: 'shipped', label: 'Shipped', icon: Truck, description: 'Your package is on the way' },
    { id: 'out-for-delivery', label: 'Out for Delivery', icon: MapPin, description: 'Carrier is delivering your package' },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle2, description: 'Package has been delivered' },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === status);

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-12 bg-zinc-950 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase font-display text-white">
            Track <span className="text-red-600">Order</span>
          </h1>
          <p className="text-zinc-500 uppercase text-[10px] font-black tracking-[0.2em]">
            Real-time status of your gear
          </p>
        </div>
        <Link to="/shop" className="flex items-center gap-2 text-zinc-500 hover:text-red-600 transition-colors uppercase text-[10px] font-black tracking-widest">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>

      <div className="bg-zinc-900 border border-white/5 rounded-[40px] p-8 md:p-12 space-y-12 soft-shadow">
        <div className="flex flex-col md:flex-row justify-between gap-8 pb-12 border-b border-white/5">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tracking Number</p>
            <p className="text-2xl font-black text-white uppercase tracking-tighter">{orderId || 'WLF-UNKNOWN'}</p>
          </div>
          <div className="space-y-1 md:text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Estimated Delivery</p>
            <p className="text-2xl font-black text-white uppercase tracking-tighter">April 12 - 15, 2026</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="absolute top-5 left-0 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              className="h-full bg-red-600"
            />
          </div>
          
          <div className="relative flex justify-between gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.id} className="flex flex-col items-center text-center space-y-4 flex-1">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 relative z-10",
                    isActive ? "bg-red-600 text-white soft-shadow" : "bg-zinc-800 text-zinc-600",
                    isCurrent && "ring-4 ring-red-600/20 scale-110"
                  )}>
                    <Icon size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest transition-colors",
                      isActive ? "text-white" : "text-zinc-600"
                    )}>
                      {step.label}
                    </p>
                    <p className="text-[8px] text-zinc-500 uppercase font-black leading-tight hidden md:block">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-white/5">
          <div className="p-8 bg-zinc-950/50 rounded-3xl border border-white/5 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <Clock size={20} />
              <h3 className="font-black uppercase tracking-widest text-xs">Recent Updates</h3>
            </div>
            <div className="space-y-6">
              <div className="relative pl-6 border-l border-red-600/20 space-y-1">
                <div className="absolute -left-[5px] top-1 w-2 h-2 bg-red-600 rounded-full" />
                <p className="text-[10px] font-black text-white uppercase">Order Received</p>
                <p className="text-[9px] text-zinc-500 uppercase">April 08, 2026 - 10:30 AM</p>
              </div>
              <div className="relative pl-6 border-l border-zinc-800 space-y-1">
                <div className="absolute -left-[5px] top-1 w-2 h-2 bg-zinc-800 rounded-full" />
                <p className="text-[10px] font-black text-zinc-500 uppercase">Payment Verified</p>
                <p className="text-[9px] text-zinc-500 uppercase">Awaiting Confirmation</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-zinc-950/50 rounded-3xl border border-white/5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="font-black uppercase tracking-widest text-xs text-white">Wolf Protection</p>
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Your order is insured and protected</p>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed uppercase font-black tracking-tight">
              If you have any questions regarding your delivery, please contact our 24/7 support team with your tracking number.
            </p>
            <Link to="/support" className="block w-full py-4 bg-zinc-800 hover:bg-white hover:text-zinc-900 text-white text-center rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
