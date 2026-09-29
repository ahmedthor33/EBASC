import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProductsByCategory } from '@/lib/products';
import { ProductCard } from '@/components/ui/ProductCard';

export const metadata = {
  title: 'Women Botanical Radiance Collection | EBA Skin Care',
  description:
    'Experience bespoke botanical radiance. Formulated with Damask Rose, 24K Gold essence, and multi-molecular peptides calibrated for Pakistani microclimates.',
};

export default function WomenCollectionPage() {
  const products = getProductsByCategory('women');

  return (
    <div className="w-full bg-[#FDF9F4] text-[#3A2A33] pb-24">
      {/* Editorial Women Hero Banner */}
      <section className="relative w-full bg-[#FAF0F2] border-b border-[#EED7DC] overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6 z-10">
            {/* Category Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#EED7DC] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#B76E79] animate-pulse" />
              <span className="font-label-uppercase text-[11px] tracking-widest text-[#B76E79] font-bold">
                The Women Formulation Line
              </span>
            </div>

            <h1 className="font-display-lg text-4xl sm:text-5xl lg:text-6xl text-[#3A2A33] tracking-tight leading-tight">
              Bespoke Botanical Radiance,{' '}
              <span className="italic font-normal text-[#B76E79]">
                Infused with 24K Essence.
              </span>
            </h1>

            <p className="font-body-lg text-base sm:text-lg text-[#6E5362] max-w-xl leading-relaxed">
              Meticulously calibrated botanical elixirs, damask rose hydrosols, and multi-peptides engineered to fortify cellular resilience against intense heat, urban smog, and humidity across Pakistan.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#products"
                className="px-8 py-4 rounded-full bg-[#3A2A33] text-white font-label-uppercase text-xs tracking-widest font-semibold hover:bg-[#5A434F] transition-all shadow-md flex items-center gap-2"
              >
                <span>Explore Formulations</span>
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              </a>
              <Link
                href="/shop"
                className="px-8 py-4 rounded-full bg-white border border-[#EED7DC] text-[#3A2A33] font-label-uppercase text-xs tracking-widest font-semibold hover:bg-[#F9F2F3] transition-all shadow-sm"
              >
                Complete Apothecary
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#EED7DC] max-w-lg">
              <div>
                <div className="font-price-lg text-xl sm:text-2xl font-bold text-[#3A2A33]">98.6%</div>
                <div className="font-body-sm text-xs text-[#6E5362]">Luminescence Index</div>
              </div>
              <div>
                <div className="font-price-lg text-xl sm:text-2xl font-bold text-[#3A2A33]">14 Days</div>
                <div className="font-body-sm text-xs text-[#6E5362]">Spot Attenuation</div>
              </div>
              <div>
                <div className="font-price-lg text-xl sm:text-2xl font-bold text-[#3A2A33]">100%</div>
                <div className="font-body-sm text-xs text-[#6E5362]">Halal & Pure</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Container */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-[#EED7DC]">
              <Image
                src="/images/hero_women.png"
                alt="EBA Skin Care Women Line"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A2A33]/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="font-label-uppercase text-[10px] tracking-widest text-[#FFE088] font-bold">
                  Clinical Apothecary Grade
                </span>
                <span className="font-headline-sm text-xl text-white">
                  Dewy Translucence & Peptide Barrier Shield
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} theme="women" />
          ))}
        </div>
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
                <span className="material-symbols-outlined text-[18px] text-[#B76E79]">check_circle</span>
                <span>Zero Hydroquinone or Steroids</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#B76E79]">check_circle</span>
                <span>Non-Comedogenic & Feather-light</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#B76E79]">check_circle</span>
                <span>24K Stabilized Micro-Gold Infusion</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#B76E79]">check_circle</span>
                <span>Cruelty-Free & Halal Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
