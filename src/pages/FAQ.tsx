import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/5">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className={cn(
          "text-lg font-bold uppercase tracking-tight transition-colors",
          isOpen ? "text-red-500" : "text-white group-hover:text-red-400"
        )}>
          {question}
        </span>
        {isOpen ? <ChevronUp className="text-red-500" /> : <ChevronDown className="text-zinc-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-zinc-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Browse, add to cart, and checkout. Follow prompts for shipping and payment.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'All major credit cards, PayPal, and Apple Pay. Secure and encrypted.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard: 5–10 days. Express: 2–3 days.',
    },
    {
      question: 'What is your return policy?',
      answer: '14-day returns for unused items in original packaging.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, to over 50 countries. Rates calculated at checkout.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Tracking number provided via email once shipped.',
    },
  ];

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-16 bg-zinc-950">
      <div className="text-center space-y-4">
        <h2 className="text-red-600 font-black tracking-widest uppercase text-xs">Knowledge Base</h2>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display text-white">
          Frequently Asked <span className="text-red-600">Questions</span>
        </h1>
      </div>

      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input
          type="text"
          placeholder="Search for answers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-white/10 rounded-full pl-12 pr-6 py-4 text-white focus:outline-none focus:border-red-600 transition-colors soft-shadow"
        />
      </div>

      <div className="space-y-2">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => (
            <FAQItem
              key={idx}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === idx}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))
        ) : (
          <div className="text-center py-12 space-y-4">
            <HelpCircle size={48} className="mx-auto text-zinc-800" />
            <p className="text-zinc-500 uppercase font-bold tracking-widest">No results found for "{searchQuery}"</p>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 p-10 rounded-[40px] border border-white/5 text-center space-y-6 soft-shadow">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Still have questions?</h3>
        <p className="text-zinc-400">Our support team is ready to help you with anything you need.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/contact"
            className="px-8 py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-zinc-900 transition-all w-full sm:w-auto soft-shadow"
          >
            Contact Us
          </Link>
          <Link
            to="/support"
            className="px-8 py-4 bg-zinc-800 text-white font-black uppercase tracking-widest rounded-full border border-white/10 hover:bg-white/10 transition-all w-full sm:w-auto soft-shadow"
          >
            Support Center
          </Link>
        </div>
      </div>
    </div>
  );
};
