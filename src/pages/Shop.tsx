import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES } from '../data';
import { ProductCard } from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { productService } from '../services/productService';
import { Product } from '../types';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [minRating, setMinRating] = useState(0);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsubscribe = productService.subscribeProducts(setProducts);
    return () => unsubscribe();
  }, []);

  const currentCategory = searchParams.get('category') || 'all';
  const isWishlist = searchParams.get('wishlist') === 'true';

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (isWishlist) {
      result = result.filter(p => localStorage.getItem(`wolf_fav_${p.id}`) === 'true');
    }

    if (currentCategory !== 'all') {
      result = result.filter(p => p.category === currentCategory);
    }

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price Filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Rating Filter
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    // Availability Filter
    if (onlyInStock) {
      result = result.filter(p => p.stock > 0);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Keep original order or sort by featured
        break;
    }

    return result;
  }, [products, currentCategory, searchQuery, sortBy, priceRange, minRating, onlyInStock, isWishlist]);

  const handleCategoryChange = (id: string) => {
    if (id === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', id);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12 bg-zinc-950">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display text-white">
          {isWishlist ? 'Your' : 'The'} <span className="text-red-600">{isWishlist ? 'Wishlist' : 'Collection'}</span>
        </h1>
        <p className="text-zinc-500 max-w-md text-xs uppercase font-black tracking-widest">
          {isWishlist ? 'Your saved premium gear.' : 'Premium gear. High-performance.'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className={cn(
          "lg:w-64 space-y-8 shrink-0 lg:block",
          isFilterOpen ? "fixed inset-0 z-50 bg-zinc-950 p-8 overflow-y-auto" : "hidden"
        )}>
          <div className="flex items-center justify-between lg:hidden">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Filters</h2>
            <button onClick={() => setIsFilterOpen(false)} className="p-2 text-zinc-400">
              <X size={24} />
            </button>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Price Range</h3>
            <div className="space-y-2">
              <input 
                type="range" 
                min="0" 
                max="50000" 
                step="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-red-600"
              />
              <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Minimum Rating</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setMinRating(star)}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-colors",
                    minRating >= star ? "bg-red-600 text-white" : "bg-zinc-900 text-zinc-500 border border-white/5"
                  )}
                >
                  {star}★
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Availability</h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                onlyInStock ? "bg-red-600 border-red-600" : "border-white/10 group-hover:border-white/20"
              )}>
                {onlyInStock && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={onlyInStock}
                onChange={() => setOnlyInStock(!onlyInStock)}
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">In Stock Only</span>
            </label>
          </div>

          <button
            onClick={() => {
              setPriceRange([0, 50000]);
              setMinRating(0);
              setOnlyInStock(false);
              setSearchQuery('');
              handleCategoryChange('all');
            }}
            className="w-full py-3 bg-zinc-900 border border-white/5 text-zinc-500 hover:text-white hover:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Reset All
          </button>
        </aside>

        <div className="flex-1 space-y-12">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between app-card p-6 bg-zinc-900 border-white/5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={cn(
                  "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                  currentCategory === 'all' ? "bg-red-600 text-white soft-shadow" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                )}
              >
                All
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                    currentCategory === cat.id ? "bg-red-600 text-white soft-shadow" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="text"
                  placeholder="Search pack..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-800 border border-white/5 rounded-full pl-12 pr-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-zinc-800 border border-white/5 rounded-full px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-red-600 transition-colors cursor-pointer pr-12"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low</option>
                    <option value="price-high">Price: High</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
                </div>

                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="p-3 bg-zinc-800 border border-white/5 rounded-full hover:bg-zinc-700 transition-colors lg:hidden"
                >
                  <SlidersHorizontal size={18} className="text-zinc-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-700">
                    <Search size={40} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white">No products found</h3>
                  <p className="text-zinc-500 text-sm">Try adjusting your search or filters.</p>
                  <button
                    onClick={() => {
                      setPriceRange([0, 50000]);
                      setMinRating(0);
                      setOnlyInStock(false);
                      setSearchQuery('');
                      handleCategoryChange('all');
                    }}
                    className="text-red-600 font-black uppercase tracking-widest text-[10px] hover:underline"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
