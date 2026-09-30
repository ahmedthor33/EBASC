import React from 'react';
import { getProductsByCategory } from '@/lib/products';
import { CollectionProductGrid } from '@/components/collection/CollectionProductGrid';
import { CollectionHeroBanner } from '@/components/collection/CollectionHeroBanner';
import { CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Women Botanical Radiance Collection | EBA Skin Care',
  description:
    'Experience bespoke botanical radiance. Formulated with Damask Rose, 24K Gold essence, and multi-molecular peptides calibrated for Pakistani microclimates.',
};

export default function WomenCollectionPage() {
  const products = getProductsByCategory('women');

  return (
    <div className="w-full bg-[#FDF9F4] text-[#3A2A33] pb-24">
      {/* Dynamic Drag-and-Drop Customizable Women Hero Banner */}
      <CollectionHeroBanner pageKey="women" />

      {/* Product Catalog Grid */}
      <section id="products" className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 pt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="font-label-uppercase text-xs tracking-widest text-[#B76E79] uppercase font-bold">
              Signature Formulations
            </span>
            <h2 className="font-display-lg text-3xl sm:text-4xl text-[#3A2A33] mt-1">
              The Curated Women Ritual
            </h2>
          </div>
          <p className="font-body-md text-sm text-[#6E5362] max-w-md">
            Every product functions in synergy to detoxify, brighten, and seal continuous cellular hydration.
          </p>
        </div>

        <CollectionProductGrid category="women" initialProducts={products} theme="women" />
      </section>

      {/* Editorial Pharmacopeia Spotlight */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 mt-20">
        <div className="bg-[#FAF0F2] border border-[#EED7DC] rounded-3xl p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            <span className="font-label-uppercase text-xs tracking-widest text-[#B76E79] uppercase font-bold">
              Dermatological Purity
            </span>
            <h3 className="font-display-lg text-2xl sm:text-4xl text-[#3A2A33] mt-2 mb-4">
              Calibrated for Melanin Rich Profiles Under Coastal & Arid Climates.
            </h3>
            <p className="font-body-md text-sm sm:text-base text-[#6E5362] leading-relaxed mb-6">
              Unlike generic international skincare formulated for temperate, low-humidity conditions, EBA formulations are calibrated against heat, humidity spikes, and urban dust in Pakistani metropolitan cities.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-[#3A2A33]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B76E79] shrink-0" />
                <span>Zero Hydroquinone or Steroids</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B76E79] shrink-0" />
                <span>Non-Comedogenic & Feather-light</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B76E79] shrink-0" />
                <span>24K Stabilized Micro-Gold Infusion</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B76E79] shrink-0" />
                <span>Cruelty-Free & Halal Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
