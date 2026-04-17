import React from 'react';
import { FileText, AlertCircle, Scale, ShieldAlert } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-16">
      <div className="space-y-4">
        <h2 className="text-red-600 font-black tracking-widest uppercase text-xs">Agreement</h2>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
          Terms of <span className="text-red-600">Service</span>
        </h1>
      </div>

      <div className="prose prose-invert max-w-none space-y-12">
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-white">
            <FileText className="text-red-600" size={24} />
            <h2 className="text-2xl font-black uppercase tracking-tight m-0">Website Usage</h2>
          </div>
          <p className="text-gray-400 leading-relaxed">
            By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4 text-white">
            <Scale className="text-red-600" size={24} />
            <h2 className="text-2xl font-black uppercase tracking-tight m-0">Payment Terms</h2>
          </div>
          <p className="text-gray-400 leading-relaxed">
            All payments are processed securely. By placing an order, you represent and warrant that you have the legal right to use any credit card(s) or other payment method(s) utilized in connection with any transaction.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4 text-white">
            <AlertCircle className="text-red-600" size={24} />
            <h2 className="text-2xl font-black uppercase tracking-tight m-0">User Responsibilities</h2>
          </div>
          <ul className="list-none p-0 space-y-4 text-gray-400">
            {[
              'You must provide accurate and complete information.',
              'You are responsible for maintaining the confidentiality of your account.',
              'You may not use our products for any illegal or unauthorized purpose.',
              'You must not transmit any worms or viruses or any code of a destructive nature.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4 text-white">
            <ShieldAlert className="text-red-600" size={24} />
            <h2 className="text-2xl font-black uppercase tracking-tight m-0">Limitation of Liability</h2>
          </div>
          <p className="text-gray-400 leading-relaxed">
            In no event shall Wolf Brand or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Wolf Brand's website.
          </p>
        </section>
      </div>
    </div>
  );
};
