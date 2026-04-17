import React from 'react';
import { Truck, Globe, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const ShippingPolicy: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-16 bg-zinc-950">
      <div className="space-y-4">
        <h2 className="text-red-600 font-black tracking-widest uppercase text-xs">Logistics</h2>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display text-white">
          Shipping <span className="text-red-600">Policy</span>
        </h1>
      </div>

      <div className="prose prose-invert max-w-none space-y-12">
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-white">
            <Clock className="text-red-600" size={24} />
            <h2 className="text-2xl font-black uppercase tracking-tight m-0">Order Processing</h2>
          </div>
          <p className="text-zinc-400 leading-relaxed">
            All orders are processed within <strong className="text-white">1–3 business days</strong>. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4 text-white">
            <Truck className="text-red-600" size={24} />
            <h2 className="text-2xl font-black uppercase tracking-tight m-0">Delivery Estimates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-zinc-900 rounded-2xl border border-white/5 soft-shadow">
              <h3 className="text-red-500 font-bold uppercase tracking-widest text-xs mb-2">Standard Shipping</h3>
              <p className="text-white font-black text-xl">5–10 Business Days</p>
              <p className="text-zinc-500 text-xs mt-2">Free on orders over $150</p>
            </div>
            <div className="p-6 bg-zinc-900 rounded-2xl border border-white/5 soft-shadow">
              <h3 className="text-red-500 font-bold uppercase tracking-widest text-xs mb-2">Express Shipping</h3>
              <p className="text-white font-black text-xl">2–3 Business Days</p>
              <p className="text-zinc-500 text-xs mt-2">Flat rate of $25.00</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4 text-white">
            <Globe className="text-red-600" size={24} />
            <h2 className="text-2xl font-black uppercase tracking-tight m-0">International Shipping</h2>
          </div>
          <ul className="list-none p-0 space-y-4">
            {[
              'We ship to over 50 countries worldwide.',
              'International delivery typically takes 10–20 business days.',
              'Customs, duties, and taxes are the responsibility of the customer.',
              'Shipping rates vary by destination and will be calculated at checkout.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-zinc-400">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4 text-white">
            <ShieldCheck className="text-red-600" size={24} />
            <h2 className="text-2xl font-black uppercase tracking-tight m-0">Shipment Confirmation</h2>
          </div>
          <p className="text-zinc-400 leading-relaxed">
            You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
          </p>
        </section>
      </div>
    </div>
  );
};
