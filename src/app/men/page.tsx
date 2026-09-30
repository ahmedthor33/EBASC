import React from 'react';
import { getProductsByCategory } from '@/lib/products';
import { CollectionProductGrid } from '@/components/collection/CollectionProductGrid';
import { CollectionHeroBanner } from '@/components/collection/CollectionHeroBanner';
import { CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: "Men's Obsidian Slate Grooming Collection | EBA Skin Care",
  description:
    "High-performance skincare for men. Activated volcanic charcoal, 15% Vitamin C complex, and barrier defense engineered for urban resilience across Pakistan.",
};

export default function MenCollectionPage() {
  const products = getProductsByCategory('men');

  return (
    <div className="w-full bg-[#0F1115] text-[#F2F2F2] pb-24">
      {/* Dynamic Drag-and-Drop Customizable Men Hero Banner */}
      <CollectionHeroBanner pageKey="men" />

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

        <CollectionProductGrid category="men" initialProducts={products} theme="men" />
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
                <CheckCircle2 className="w-4 h-4 text-[#C9A96E] shrink-0" />
                <span>Cools Post-Shave Razor Burn</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9A96E] shrink-0" />
                <span>Zero Shine Under Hot Sunlight</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9A96E] shrink-0" />
                <span>Unclogs Deep Pores in 60 Seconds</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9A96E] shrink-0" />
                <span>Alcohol-Free & 100% Halal</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
