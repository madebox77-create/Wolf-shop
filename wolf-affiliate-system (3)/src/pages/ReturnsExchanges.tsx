import React from 'react';
import { RotateCcw, Package, CreditCard, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const ReturnsExchanges: React.FC = () => {
  const steps = [
    { title: 'Request Return', desc: 'Contact our support team with your order number to initiate a return.', icon: Package },
    { title: 'Ship Item', desc: 'Pack the item securely and ship it back to our den using the provided label.', icon: RotateCcw },
    { title: 'Receive Refund', desc: 'Once inspected, we will process your refund or ship your replacement.', icon: CreditCard },
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-16 bg-zinc-950">
      <div className="space-y-4">
        <h2 className="text-red-600 font-black tracking-widest uppercase text-xs">Satisfaction</h2>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none font-display text-white">
          Returns & <span className="text-red-600">Exchanges</span>
        </h1>
      </div>

      <div className="prose prose-invert max-w-none space-y-12">
        <section className="bg-zinc-900 p-8 rounded-3xl border border-white/5 space-y-4 soft-shadow">
          <h2 className="text-2xl font-black uppercase tracking-tight m-0 text-white">Our Guarantee</h2>
          <p className="text-zinc-400 leading-relaxed m-0">
            We stand by the quality of our gear. If you're not 100% satisfied with your purchase, you can return or exchange it within <strong className="text-white">14 days</strong> of delivery.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600">
                  <step.icon size={24} />
                </div>
                <h3 className="font-bold uppercase tracking-tight text-white">{step.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Policy Details</h2>
          <ul className="list-none p-0 space-y-6">
            {[
              { title: 'Condition', text: 'Items must be unused, in the same condition that you received them, and in the original packaging.' },
              { title: 'Refunds', text: 'Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. Your refund will be processed to your original method of payment.' },
              { title: 'Exchanges', text: 'We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email.' },
              { title: 'Shipping Costs', text: 'You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.' },
            ].map((item, i) => (
              <li key={i} className="flex gap-4">
                <CheckCircle2 className="text-red-600 shrink-0" size={20} />
                <div className="space-y-1">
                  <h4 className="font-bold uppercase tracking-widest text-[10px] text-white">{item.title}</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
