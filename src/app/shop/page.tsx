'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, ProductItem } from '@/lib/products';
import { ProductCard } from '@/components/ui/ProductCard';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(4000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Price filter
      const effectivePrice = product.salePrice ?? product.price;
      if (effectivePrice > maxPrice) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSub = product.subtitle.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [selectedCategory, searchQuery, maxPrice, sortBy]);

  return (
    <div className="w-full bg-[#FDF9F4] text-[#1C1C19] pb-24">
      {/* Editorial Header Banner */}
      <section className="w-full bg-[#F7F3EE] border-b border-[#EADECF] py-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1380px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 font-label-uppercase text-xs tracking-widest text-[#7F7572]">
              <Link href="/" className="hover:text-black">Home</Link>
              <span>/</span>
              <span className="text-[#725B38] font-bold">Catalog</span>
            </div>
            <h1 className="font-display-lg text-3xl sm:text-5xl text-[#1C1C19] font-medium">
              The Pharmacopeia Catalog
            </h1>
            <p className="font-body-md text-sm text-[#4E4543] mt-2 max-w-xl">
              Discover every clinical botanical formulation engineered for the regional climate. Meticulously packaged in protective apothecary vessels.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-4 py-2.5 rounded-full border border-[#EADECF] bg-white text-xs font-label-ui flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Filter & Sort</span>
            </button>
            <div className="font-label-uppercase text-xs text-[#7F7572] tracking-wider">
              Showing <span className="font-bold text-[#1C1C19]">{filteredProducts.length}</span> Formulations
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Layout */}
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Category & Filter Sidebar (Desktop) */}
          <aside className={`lg:col-span-3 space-y-8 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white border border-[#EADECF] rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Search Box */}
              <div>
                <label className="block font-label-uppercase text-xs tracking-wider uppercase font-semibold text-[#1C1C19] mb-2">
                  Search Formulations
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-[#7F7572]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Serum, Charcoal..."
                    className="w-full pl-9 pr-3 py-2 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-xs text-[#1C1C19] placeholder-[#7F7572] focus:outline-none focus:border-[#C5A880]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#7F7572] hover:text-black"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="font-label-uppercase text-xs tracking-wider uppercase font-semibold text-[#1C1C19] mb-3">
                  Collections
                </h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-label-ui flex items-center justify-between transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-[#1A1615] text-white font-semibold'
                        : 'text-[#4E4543] hover:bg-[#F7F3EE]'
                    }`}
                  >
                    <span>All Collections</span>
                    <span>{PRODUCTS.length}</span>
                  </button>

                  <button
                    onClick={() => setSelectedCategory('women')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-label-ui flex items-center justify-between transition-colors ${
                      selectedCategory === 'women'
                        ? 'bg-[#3A2A33] text-white font-semibold'
                        : 'text-[#4E4543] hover:bg-[#F7F3EE]'
                    }`}
                  >
                    <span>Women Botanical Line</span>
                    <span>3</span>
                  </button>

                  <button
                    onClick={() => setSelectedCategory('men')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-label-ui flex items-center justify-between transition-colors ${
                      selectedCategory === 'men'
                        ? 'bg-[#2F4858] text-white font-semibold'
                        : 'text-[#4E4543] hover:bg-[#F7F3EE]'
                    }`}
                  >
                    <span>Men Obsidian Slate</span>
                    <span>3</span>
                  </button>
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-uppercase text-xs tracking-wider uppercase font-semibold text-[#1C1C19]">
                    Max Price: Rs. {maxPrice.toLocaleString()}
                  </span>
                  <button
                    onClick={() => setMaxPrice(4000)}
                    className="text-[10px] text-[#725B38] hover:underline"
                  >
                    Reset
                  </button>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="4000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#1A1615] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#7F7572] mt-1">
                  <span>Rs. 1,500</span>
                  <span>Rs. 4,000</span>
                </div>
              </div>

              {/* Sort By Filter */}
              <div>
                <label className="block font-label-uppercase text-xs tracking-wider uppercase font-semibold text-[#1C1C19] mb-2">
                  Sort Order
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-xs text-[#1C1C19] focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="featured">Featured Apothecary</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated (5 Stars)</option>
                </select>
              </div>

              {/* Shipping Trust Pill */}
              <div className="p-3.5 rounded-xl bg-[#F7F3EE] border border-[#EADECF] text-xs text-[#4E4543] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#1C1C19]">
                  <span className="material-symbols-outlined text-[16px] text-[#725B38]">local_shipping</span>
                  <span>Free Nationwide Delivery</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Applies automatically to all cart orders exceeding <strong>Rs. 3,500</strong>.
                </p>
              </div>

            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-[#EADECF] rounded-2xl p-12 text-center shadow-sm">
                <span className="material-symbols-outlined text-[36px] text-[#7F7572] mb-3">inventory_2</span>
                <h3 className="font-display-brand text-xl text-[#1C1C19] font-semibold mb-1">
                  No Formulations Found
                </h3>
                <p className="text-xs text-[#7F7572] mb-4">
                  Try adjusting your search query, price limit, or category selection.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setMaxPrice(4000);
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#1A1615] text-[#FDF9F4] font-label-uppercase text-xs tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[#7F7572]">Loading Apothecary Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
