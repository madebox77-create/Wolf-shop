import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Zap,
  Percent,
  Award,
  CreditCard,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS, CATEGORIES } from '../data';
import { ProductCard } from '../components/ProductCard';
import { cn } from '../lib/utils';
import { productService, Product as AffiliateProduct, Banner as AffiliateBanner } from '../services/productService';

export const Home: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [banners, setBanners] = useState<AffiliateBanner[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribeProducts = productService.subscribeProducts(setProducts);
    const unsubscribeBanners = productService.subscribeBanners(setBanners);
    return () => {
      unsubscribeProducts();
      unsubscribeBanners();
    };
  }, []);

  const HERO_SLIDES = banners.length > 0 ? banners.map(b => ({
    id: b.id,
    title: b.title,
    subtitle: b.description,
    image: b.imageUrl,
    badge: "Special Offer",
    cta: "Check it out",
    link: "/shop"
  })) : [
    {
      id: 1,
      title: "Unleash Alpha Style",
      subtitle: "Premium gear for the modern predator.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
      badge: "New Drops",
      cta: "Shop Now",
      link: "/shop"
    }
  ];

  // Auto-slide for Hero
  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [HERO_SLIDES.length]);

  // Auto-slide for Categories
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CATEGORIES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth / (window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 2 : 1.2);
      scrollRef.current.scrollTo({
        left: activeIndex * cardWidth,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  const featuredProducts = products.length > 0 ? products.filter(p => p.featured).slice(0, 8) : [];

  return (
    <div className="space-y-16 md:space-y-24 pb-20 bg-zinc-950">
      {/* Hero Section - Premium Slider Style */}
      <section className="relative min-h-[90vh] md:min-h-[80vh] flex items-center overflow-hidden bg-zinc-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-10" />
            <img
              src={HERO_SLIDES[heroIndex].image}
              alt="Hero Background"
              className="w-full h-full object-cover object-center opacity-30 grayscale contrast-125"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800';
                (e.target as HTMLImageElement).style.filter = 'grayscale(100%) brightness(0.2)';
              }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-20 py-20 md:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 md:space-y-10 text-center lg:text-left">
              <motion.div
                key={`content-${heroIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] soft-shadow mx-auto lg:mx-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  {HERO_SLIDES[heroIndex].badge}
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter text-white uppercase leading-[0.9] font-display">
                  {HERO_SLIDES[heroIndex].title.split(' ').map((word, i) => (
                    <React.Fragment key={i}>
                      {word === 'Alpha' ? <span className="text-red-600">Alpha</span> : word}
                      {i === 1 && <br className="hidden md:block" />}
                      {' '}
                    </React.Fragment>
                  ))}
                </h1>
                <p className="text-zinc-400 text-lg md:text-xl max-w-md leading-relaxed font-medium mx-auto lg:mx-0">
                  {HERO_SLIDES[heroIndex].subtitle}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link
                  to={HERO_SLIDES[heroIndex].link}
                  className="px-10 md:px-12 py-5 md:py-6 bg-red-600 text-white font-black uppercase tracking-widest rounded-[20px] hover:bg-white hover:text-zinc-900 transition-all active:scale-95 w-full sm:w-auto text-center soft-shadow"
                >
                  {HERO_SLIDES[heroIndex].cta}
                </Link>
                <Link
                  to="/shop"
                  className="px-10 md:px-12 py-5 md:py-6 bg-zinc-800 text-white font-black uppercase tracking-widest rounded-[20px] border border-white/10 transition-all hover:bg-zinc-700 w-full sm:w-auto text-center soft-shadow"
                >
                  Explore Pack
                </Link>
              </motion.div>
            </div>

            <motion.div
              key={`image-${heroIndex}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative mt-10 lg:mt-0"
            >
              <div className="absolute inset-0 bg-red-600/10 blur-[150px] rounded-full" />
              <div className="relative z-10 bg-zinc-900/40 backdrop-blur-sm rounded-[40px] md:rounded-[60px] p-6 md:p-8 soft-shadow border border-white/10">
                <img
                  src={HERO_SLIDES[heroIndex].image}
                  alt="Hero Product"
                  className="w-full max-w-sm md:max-w-lg mx-auto drop-shadow-2xl transition-transform duration-700 hover:scale-105 rounded-[30px] md:rounded-[40px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800';
                    (e.target as HTMLImageElement).style.filter = 'grayscale(100%) brightness(0.2)';
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Slider Navigation */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={cn(
                "h-1.5 transition-all duration-500 rounded-full",
                heroIndex === i ? "w-10 bg-red-600" : "w-2 bg-zinc-300"
              )}
            />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 md:py-12 border-y border-white/10">
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
              <Truck size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white">Free Shipping</p>
              <p className="text-[8px] text-zinc-500 font-bold uppercase">Orders over ₹7,999</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white">Secure</p>
              <p className="text-[8px] text-zinc-500 font-bold uppercase">100% Encrypted</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
              <RotateCcw size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white">30 Day Returns</p>
              <p className="text-[8px] text-zinc-500 font-bold uppercase">Hassle-free</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
              <Award size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white">Premium</p>
              <p className="text-[8px] text-zinc-500 font-bold uppercase">Certified Authentic</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories - Clean Card UI */}
      <section className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-red-600">Categories</h2>
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase font-display text-white">Featured Collections</h3>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setActiveIndex((prev) => (prev - 1 + CATEGORIES.length) % CATEGORIES.length)}
              className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:border-red-600 transition-all soft-shadow"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => setActiveIndex((prev) => (prev + 1) % CATEGORIES.length)}
              className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:border-red-600 transition-all soft-shadow"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 md:gap-8 pb-10 custom-scrollbar snap-x snap-mandatory"
        >
          {CATEGORIES.map((category, idx) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className={cn(
                "min-w-[280px] md:min-w-[340px] lg:min-w-[calc(25%-24px)] snap-start group",
                "bg-zinc-900 rounded-[20px] p-5 space-y-6 transition-all duration-500 border border-white/5 soft-shadow",
                activeIndex === idx ? "ring-2 ring-red-600/20" : ""
              )}
            >
              <div className="aspect-[4/5] rounded-[15px] overflow-hidden bg-zinc-800">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800';
                    (e.target as HTMLImageElement).style.filter = 'grayscale(100%) brightness(0.2)';
                  }}
                />
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-xl font-black uppercase tracking-tight text-white">{category.name}</h4>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Explore Pack</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          whileHover={{ y: -10 }}
          className="relative h-[350px] md:h-[400px] rounded-[30px] md:rounded-[40px] overflow-hidden bg-zinc-900 group"
        >
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000"
            alt="Promo 1"
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
          />
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center space-y-6 z-10">
            <div className="inline-flex items-center gap-2 text-red-600 font-black uppercase tracking-widest text-xs">
              <Zap size={16} /> Flash Sale
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
              Up to <span className="text-red-600">40%</span> Off <br /> Footwear
            </h3>
            <Link to="/shop?category=fashion" className="inline-flex items-center gap-2 text-white font-black uppercase tracking-widest text-xs hover:text-red-600 transition-colors">
              Shop the Sale <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -10 }}
          className="relative h-[350px] md:h-[400px] rounded-[30px] md:rounded-[40px] overflow-hidden bg-red-600 group"
        >
          <img
            src="https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=1000"
            alt="Promo 2"
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
          />
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center space-y-6 z-10">
            <div className="inline-flex items-center gap-2 text-white font-black uppercase tracking-widest text-xs">
              <Percent size={16} /> Member Exclusive
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
              Join the Pack <br /> Get <span className="text-zinc-900">15%</span> Off
            </h3>
            <button className="inline-flex items-center gap-2 text-white font-black uppercase tracking-widest text-xs hover:text-zinc-900 transition-colors">
              Sign Up Now <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Featured Products - Clean Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">The Elite Selection</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase font-display text-white italic">Featured Gear</h3>
          </div>
          <Link to="/shop" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
            Explore Full Collection <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all"><ArrowRight size={16} /></div>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Newsletter - Premium Banner */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative bg-zinc-900 rounded-[40px] md:rounded-[60px] p-10 md:p-24 overflow-hidden soft-shadow">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/10 blur-[150px] rounded-full translate-x-1/2" />
          <div className="relative z-10 max-w-2xl space-y-8 text-center md:text-left">
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none font-display">
              Don't Miss <br />
              The <span className="text-red-600">Next Drop</span>
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md">
              Join our exclusive newsletter for new collections and limited drops.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/5 border border-white/10 rounded-[15px] md:rounded-[24px] px-6 md:px-8 py-4 md:py-5 text-white focus:outline-none focus:border-red-600 transition-colors"
              />
              <button className="px-10 md:px-12 py-4 md:py-5 bg-red-600 text-white font-black uppercase tracking-widest rounded-[15px] md:rounded-[24px] hover:bg-white hover:text-zinc-900 transition-all active:scale-95 soft-shadow">
                Join Now
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-red-600">Testimonials</h2>
          <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase font-display text-white">Voices of the Pack</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Alex Rivers", role: "Creator", text: "Alpha headphones are unmatched. Pure sound, pure silence." },
            { name: "Sarah Chen", role: "Stylist", text: "Minimalist luxury. Midnight collection is my go-to." },
            { name: "Marcus Thorne", role: "Tech", text: "Sleek design, incredible performance. Wolf Ultra is a game changer." }
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-zinc-900 p-8 md:p-10 rounded-[30px] md:rounded-[40px] border border-white/5 soft-shadow space-y-6"
            >
              <div className="flex text-red-600 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-zinc-400 italic leading-relaxed text-sm md:text-base">"{testimonial.text}"</p>
              <div className="pt-6 border-t border-white/5">
                <p className="text-white font-black uppercase tracking-tight">{testimonial.name}</p>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
