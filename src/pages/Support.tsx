import React from 'react';
import { MessageSquare, Mail, Phone, Clock, HelpCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const Support: React.FC = () => {
  const supportCategories = [
    {
      title: 'Order Issues',
      desc: 'Track your order, change shipping details, or cancel an order.',
      icon: Clock,
    },
    {
      title: 'Payment Help',
      desc: 'Issues with checkout, promo codes, or payment methods.',
      icon: HelpCircle,
    },
    {
      title: 'Delivery Help',
      desc: 'Missing packages, damaged items, or delivery delays.',
      icon: MessageSquare,
    },
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-20 bg-zinc-950">
      <div className="text-center space-y-2">
        <h2 className="text-red-600 font-black tracking-widest uppercase text-[10px]">Help Center</h2>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display text-white">
          Wolf <span className="text-red-600">Support</span>
        </h1>
        <p className="text-zinc-500 max-w-md mx-auto text-xs uppercase font-black tracking-widest">
          Seamless support for the pack.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {supportCategories.map((cat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="app-card p-8 space-y-6 hover:border-red-600/30 transition-all group"
          >
            <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
              <cat.icon size={28} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">{cat.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{cat.desc}</p>
            <button className="text-red-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
              Get Help <ArrowRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12">
        <div className="app-card p-10 space-y-8">
          <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Contact Options</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-6 bg-zinc-800 rounded-2xl border border-white/5">
              <div className="w-12 h-12 bg-zinc-900 text-red-600 rounded-full flex items-center justify-center soft-shadow">
                <Mail size={20} />
              </div>
              <div>
                <p className="font-black uppercase tracking-widest text-[10px] text-zinc-500">Email Support</p>
                <p className="text-white font-bold text-sm">wolfbankurawolfbankura@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-zinc-800 rounded-2xl border border-white/5">
              <div className="w-12 h-12 bg-zinc-900 text-red-600 rounded-full flex items-center justify-center soft-shadow">
                <Phone size={20} />
              </div>
              <div>
                <p className="font-black uppercase tracking-widest text-[10px] text-zinc-500">Phone Support</p>
                <p className="text-white font-bold text-sm">+91 9046223528</p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-zinc-800 rounded-2xl border border-white/5">
              <div className="w-12 h-12 bg-zinc-900 text-red-600 rounded-full flex items-center justify-center soft-shadow">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="font-black uppercase tracking-widest text-[10px] text-zinc-500">Live Chat</p>
                <p className="text-white font-bold text-sm">Mon-Sat, 10am-8pm IST</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Quick FAQ</h3>
          <div className="space-y-4">
            {[
              'How do I track my order?',
              'What is your return policy?',
              'Do you ship internationally?',
              'How can I change my shipping address?',
            ].map((q, i) => (
              <Link
                key={i}
                to="/faq"
                className="flex items-center justify-between p-6 bg-zinc-900 rounded-2xl border border-white/5 hover:border-red-600/30 transition-all group soft-shadow"
              >
                <span className="font-black text-sm uppercase tracking-tight text-white">{q}</span>
                <ArrowRight size={18} className="text-zinc-700 group-hover:text-red-600 transition-colors" />
              </Link>
            ))}
          </div>
          <Link
            to="/faq"
            className="inline-block text-red-600 font-black uppercase text-[10px] tracking-widest hover:underline"
          >
            View all frequently asked questions
          </Link>
        </div>
      </div>
    </div>
  );
};
