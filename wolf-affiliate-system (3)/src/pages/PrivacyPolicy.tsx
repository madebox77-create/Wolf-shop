import React from 'react';
import { Shield, Lock, Eye, Database } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-16 bg-zinc-950">
      <div className="space-y-4">
        <h2 className="text-red-600 font-black tracking-widest uppercase text-xs">Security</h2>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display text-white">
          Privacy <span className="text-red-600">Policy</span>
        </h1>
      </div>

      <div className="prose prose-invert max-w-none space-y-12">
        <p className="text-zinc-400 text-lg leading-relaxed">
          At Wolf Brand, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information when you join the pack.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-zinc-900 rounded-3xl border border-white/5 space-y-4 soft-shadow">
            <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600">
              <Database size={24} />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight text-white">Data Collection</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              We collect information you provide directly to us, such as your name, email address, phone number, and shipping address when you make a purchase.
            </p>
          </div>
          <div className="p-8 bg-zinc-900 rounded-3xl border border-white/5 space-y-4 soft-shadow">
            <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600">
              <Eye size={24} />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight text-white">Data Usage</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              We use your data to process orders, provide customer support, and send you updates about the pack (if you've opted in).
            </p>
          </div>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Security Assurance</h2>
          <div className="flex items-start gap-4 p-6 bg-red-600/5 border border-red-600/20 rounded-2xl">
            <Shield className="text-red-600 shrink-0" size={24} />
            <p className="text-zinc-300 text-sm m-0">
              We implement a variety of security measures to maintain the safety of your personal information. Your sensitive data is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our payment gateway providers database.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">No Misuse</h2>
          <p className="text-zinc-400 leading-relaxed">
            We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
          </p>
        </section>
      </div>
    </div>
  );
};
