import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Instagram, Twitter, Facebook } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormState({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-20 bg-zinc-950">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-red-600 font-black tracking-widest uppercase text-[10px]">Get in Touch</h2>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display text-white">
          Contact <span className="text-red-600">Us</span>
        </h1>
        <p className="text-zinc-500 max-w-md mx-auto text-xs uppercase font-black tracking-widest">
          We're here to help you lead the pack.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side: Contact Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="app-card p-8 space-y-4 group hover:border-red-600/30 transition-all">
              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                <Mail size={24} />
              </div>
              <h3 className="font-black uppercase tracking-widest text-[10px] text-zinc-500">Email Us</h3>
              <p className="text-white font-bold">wolfbankurawolfbankura@gmail.com</p>
            </div>
            <div className="app-card p-8 space-y-4 group hover:border-red-600/30 transition-all">
              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                <Phone size={24} />
              </div>
              <h3 className="font-black uppercase tracking-widest text-[10px] text-zinc-500">Call Us</h3>
              <p className="text-white font-bold">+91 9046223528</p>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Mon-Sat: 10am - 8pm IST</p>
            </div>
            <div className="app-card p-8 space-y-4 group hover:border-red-600/30 transition-all">
              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                <MapPin size={24} />
              </div>
              <h3 className="font-black uppercase tracking-widest text-[10px] text-zinc-500">Visit WOLF</h3>
              <p className="text-white font-bold">School Danga, Bankura, West Bengal, India</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">Follow the Pack</h3>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:bg-red-600 hover:text-white transition-all soft-shadow">
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form + Map */}
        <div className="space-y-8">
          {/* Contact Form */}
          <div className="app-card p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-red-600/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-1">
                <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Send a Message</h3>
                <p className="text-zinc-500 text-xs">We'll get back to you as soon as possible.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full bg-zinc-800 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full bg-zinc-800 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Phone Number</label>
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full bg-zinc-800 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                    placeholder="+91 00000 00000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-zinc-800 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-red-600 transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitted}
                  className={cn(
                    "w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 soft-shadow",
                    isSubmitted ? "bg-green-600 text-white" : "bg-red-600 text-white hover:bg-white hover:text-zinc-900"
                  )}
                >
                  {isSubmitted ? (
                    <>Message Sent <MessageSquare size={20} /></>
                  ) : (
                    <>Send Message <Send size={20} /></>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Google Map Embed */}
          <div className="aspect-video rounded-[40px] overflow-hidden bg-zinc-900 border border-white/5 relative group soft-shadow">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233.12!2d87.0609375!3d23.2404679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f7a5f5b29032db%3A0x8cf9e9dc356dc826!2sJibandeep%20Nursing%20Home!5e0!3m2!1sen!2sin!4v1712482133000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};
