import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProductsByCategory } from '@/lib/products';
import { ProductCard } from '@/components/ui/ProductCard';

export const metadata = {
  title: "Men's Obsidian Slate Grooming Collection | EBA Skin Care",
  description:
    "High-performance skincare for men. Activated volcanic charcoal, 15% Vitamin C complex, and barrier defense engineered for urban resilience across Pakistan.",
};

export default function MenCollectionPage() {
  const products = getProductsByCategory('men');

  return (
    <div className="w-full bg-[#0F1115] text-[#F2F2F2] pb-24">
      {/* Dark Slate Editorial Men Hero */}
      <section className="relative w-full bg-[#14171C] border-b border-[#232830] overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6 z-10">
            {/* Category Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C2026] border border-[#2E3540] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#6C8EAD] animate-pulse" />
              <span className="font-label-uppercase text-[11px] tracking-widest text-[#8AB8D6] font-bold">
                The Men Fortitude Line
              </span>
            </div>

            <h1 className="font-display-lg text-4xl sm:text-5xl lg:text-6xl text-[#F2F2F2] tracking-tight leading-tight">
              Obsidian Slate Fortitude,{' '}
              <span className="italic font-normal text-[#C9A96E]">
                High-Performance Purity.
              </span>
            </h1>

            <p className="font-body-lg text-base sm:text-lg text-[#A5ACB8] max-w-xl leading-relaxed font-light">
              Engineered specifically for male dermal thickness and active lifestyle exposure. Activated volcanic charcoal, clinical Niacinamide, and antioxidant shields that defeat grease, humidity, and pollution.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#products"
                className="px-8 py-4 rounded-full bg-white text-[#0F1115] font-label-uppercase text-xs tracking-widest font-semibold hover:bg-[#EBE8E3] transition-all shadow-md flex items-center gap-2"
              >
                <span>Explore Formulations</span>
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              </a>
              <Link
                href="/shop"
                className="px-8 py-4 rounded-full bg-[#1C2026] border border-[#2E3540] text-white font-label-uppercase text-xs tracking-widest font-semibold hover:bg-[#242A32] transition-all shadow-sm"
              >
                Complete Apothecary
              </Link>
            </div>

            {/* Metric Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#232830] max-w-lg">
              <div>
                <div className="font-price-lg text-xl sm:text-2xl font-bold text-white">12 Hours</div>
                <div className="font-body-sm text-xs text-[#A5ACB8]">Sebum Control</div>
              </div>
              <div>
                <div className="font-price-lg text-xl sm:text-2xl font-bold text-white">100%</div>
                <div className="font-body-sm text-xs text-[#A5ACB8]">Matte Finish</div>
              </div>
              <div>
                <div className="font-price-lg text-xl sm:text-2xl font-bold text-white">0% Tacky</div>
                <div className="font-body-sm text-xs text-[#A5ACB8]">Rapid Absorption</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Container */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-[#232830] bg-[#181B20]">
              <Image
                src="/images/hero_men.png"
                alt="EBA Skin Care Men Line"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115]/90 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="font-label-uppercase text-[10px] tracking-widest text-[#C9A96E] font-bold">
                  High-Performance Grooming
                </span>
                <span className="font-headline-sm text-xl text-white">
                  Volcanic Detox & Peptide Cellular Shield
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Product Catalog Grid */}
      <section id="products" className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 pt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="font-label-uppercase text-xs tracking-widest text-[#8AB8D6] uppercase font-bold">
              High Potency Essentials
            </span>
            <h2 className="font-display-lg text-3xl sm:text-4xl text-[#F2F2F2] mt-1">
              The Men Regimen Triad
            </h2>
          </div>
          <p className="font-body-md text-sm text-[#A5ACB8] max-w-md">
            Three simple, high-potency steps: Cleanse with volcanic charcoal, treat with Vitamin C, and repair overnight with peptide barrier cream.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} theme="men" />
          ))}
        </div>
      </section>

      {/* Men Clinical Guarantee Bar */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 mt-20">
        <div className="bg-[#14171C] border border-[#232830] rounded-3xl p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            <span className="font-label-uppercase text-xs tracking-widest text-[#C9A96E] uppercase font-bold">
              Engineering Standard
            </span>
            <h3 className="font-display-lg text-2xl sm:text-4xl text-white mt-2 mb-4">
              Calibrated for Heavy Sun Exposure, Bike Commutes, & City Smog.
            </h3>
            <p className="font-body-md text-sm sm:text-base text-[#A5ACB8] leading-relaxed mb-6">
              Male skin in Pakistan endures harsh UV exposure and dense urban exhaust during traffic and commutes. EBA Men fortifies your skin with activated charcoal and barrier-strengthening ceramides.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-white">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#C9A96E]">check_circle</span>
                <span>Cools Post-Shave Razor Burn</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#C9A96E]">check_circle</span>
                <span>Zero Shine Under Hot Sunlight</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#C9A96E]">check_circle</span>
                <span>Unclogs Deep Pores in 60 Seconds</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#C9A96E]">check_circle</span>
                <span>Alcohol-Free & 100% Halal</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
