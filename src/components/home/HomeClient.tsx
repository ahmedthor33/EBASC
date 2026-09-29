'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ProductItem, PRODUCTS } from '@/lib/products';

interface DisplayProduct {
  id: string;
  category: 'women' | 'men';
  name: string;
  slug: string;
  subtitle: string;
  size: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  badge: string;
  badgeColor: string;
  image: string;
  description: string;
}

const BEST_SELLER_PRODUCTS: DisplayProduct[] = [
  {
    id: 'prod-w-2',
    category: 'women',
    name: "Women's Beauty Glow Serum",
    slug: 'beauty-glow-serum-30ml',
    subtitle: 'Niacinamide 10% + Alpha Arbutin',
    size: '30ml Dropper',
    price: 2850,
    originalPrice: 3400,
    rating: 5.0,
    reviewsCount: 342,
    badge: 'BEST SELLER',
    badgeColor: 'bg-[#FEDEB2] text-[#78603E]',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDXTANK53uj18t1_ILPGUQbZzqMFr5OWJTagkxfISowoC8Emq_mQL1Rw2QCBTc10w3sKIC8htMRZ-VuZvMZcP_V0S121SkywotnqyoStnDBvdIf9V4yp3iJIw3yO0VdTi_vgKTBToYxU50XG9uPjCtLM_Xb7jsyoSBfakl0SnErdcglo0l-p0b7_t5BMDkS6gNhiiRAyr1EfVaSsnv6NYzC3vyuKATYk3PvU0Af-XBk-ro6_IgMOUUzYQ',
    description:
      'Clinically formulated with 10% high-purity Niacinamide and Alpha Arbutin to address hyperpigmentation, melasma, and solar lentigines under intense South Asian sunlight.',
  },
  {
    id: 'prod-w-3',
    category: 'women',
    name: "Women's Beauty Night Whitening Cream",
    slug: 'women-beauty-night-whitening-cream-50gm',
    subtitle: 'Glutathione + Peptides Complex',
    size: '50gm Glass Jar',
    price: 3200,
    originalPrice: 3750,
    rating: 5.0,
    reviewsCount: 280,
    badge: 'AWARD WINNER',
    badgeColor: 'bg-[#FFE088] text-[#241A00]',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAIiiXXSdy9vlZKuoJpyflbwD43OEGYXpjoa_BtaXjAgP700fOTmnbwe__i-4_i0M57yP6P17yhHCHqSoCe9-say7nUbYY17wTmqigciyW0HzDyxqM4brVi4Wcggl_kSx1cj-qCTuxbc4akBqZo0G2Qd0eoAZcMEE2cIIXiILSiOoTgzIHyDtLHJ5bLFAVlJ-Hl6LsxgGw-mM-rHtJwpESC5pRUiAF4GpjLjTT8GyodpgVIokIq135tkA',
    description:
      'Rich night-time cellular repair cream with pure Glutathione and multi-peptides to regenerate and even skin tone while you rest.',
  },
  {
    id: 'prod-w-1',
    category: 'women',
    name: "Women's Gentle Clarifying Cleanser",
    slug: 'women-face-wash-100ml',
    subtitle: 'Salicylic Acid + Centella Asiatica',
    size: '100ml Tube',
    price: 1650,
    originalPrice: 1950,
    rating: 5.0,
    reviewsCount: 195,
    badge: 'GENTLE CLEAN',
    badgeColor: 'bg-[#EBE8E3] text-[#1C1C19]',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_XonK9OWe-_sx5cLTbaSxS6BEhdEtUZlYqC93z-1b4NwobQQlsbR7QLjrBaasrZzOOq5pa-d0B51_X4ksyNWhaJb60_Ipp_RudHZR3eK5-Ll6mbZQCB96UjgHJd6GFEf1lnRIvlisf1vqx4x3zSiU6a8a3dD1g5Uikwl7miJR6UU5Wc6RpGok4Fanrk6zXpJ_OnEFPabTg512Y-31bPeduAwptoo1U3Np8n7mfe45XxjUQtIhB8ROXA',
    description:
      'Mild foaming clarifying wash that gently clears excess sebum and environmental dust without stripping vital ceramides.',
  },
  {
    id: 'prod-m-1',
    category: 'men',
    name: "Men's Charcoal Oil-Control Cleanser",
    slug: 'men-charcoal-face-wash-100ml',
    subtitle: 'Activated Charcoal + Tea Tree',
    size: '100ml Matte Tube',
    price: 1750,
    originalPrice: 2100,
    rating: 5.0,
    reviewsCount: 210,
    badge: 'OIL CONTROL',
    badgeColor: 'bg-[#1F1B1A] text-white',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC4PM3fmqwyfmb8D1qxv9COAmK2rP4rISrLduNYlFEMAIbirA8WM6HR6DWrCk8tu26_Qa1ggQOxsAdEJ16cTqRJinElHkER_5RT2EbF4htencgh35GrHEeHpNc8gYeG63NN0WvcKoDKDtl8-F6JConWejsfJih5uXxcFSuOCuMvXHtdVl98nA6cQGAw_qDRgjnOvb2NsbCkqkXsFy4gBWq5Yk8PXQn2U1P2VnLz1IJlIaObKlgep-G3EA',
    description:
      'Deep pore clarifying cleanser infused with activated bamboo charcoal to sweep away stubborn urban grime and control daytime shine.',
  },
  {
    id: 'prod-m-3',
    category: 'men',
    name: "Men's Restorative Night Cream",
    slug: 'men-restorative-night-cream-50gm',
    subtitle: 'Hyaluronic 4D + Caffeine Complex',
    size: '50gm Jar',
    price: 3100,
    originalPrice: 3600,
    rating: 5.0,
    reviewsCount: 168,
    badge: 'NIGHT CELL REBOUND',
    badgeColor: 'bg-[#725B38] text-white',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBCusN0fPfAUMAMJteXyjDQuBpWlj24jh7_HFLrPs33u1UatYiUzW-ZKPWJcJKpAg7zAQDS09ACRimtQn_13SzkzSEcIMYYxIhJ0D47qx8KePRJnsQVOAnPb4wuHinvWQFPQYOrFzin1uGiH8e9wRT_5Bhw0vRyTfGimBeYOfGGXSGSG4JIsowsIXe-mlKIeezFKxFgOkzkIudH1rVRGwgBrwQWZDgS4PfE_9YovHdnMnMrnlqSOPcDjw',
    description:
      'Restores the skin barrier after shaving and sun exposure with caffeine extracts and 4D hyaluronic acid matrices.',
  },
  {
    id: 'prod-m-2',
    category: 'men',
    name: "Men's Active Defense Glow Serum",
    slug: 'men-active-defense-glow-serum-30ml',
    subtitle: 'Vitamin C 15% + Zinc PCA',
    size: '30ml Dark Vial',
    price: 2950,
    originalPrice: 3500,
    rating: 5.0,
    reviewsCount: 185,
    badge: 'DEFENSE SHIELD',
    badgeColor: 'bg-[#FEDEB2] text-[#78603E]',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDRBhtbrjtgAb2qXPbqaHZbCcsx7w-nCvLKLeQTnmbhf4DyVEEHe9-piHC13BnlysNujBfbG9hFv8rS-bSJ2PWnIZVO0Lp-HewiQmLPlPsNqF8Q9eU0Sz8LvXnlTxuHgoUeaeBfEF2mAOSryvtGBEiOT4AXneT-xyUqibzry3pXFKpi4yxHE1yL1yE7ZY0h6EP_k4mBcLMVualmUJwSNSzdUBK8rFbiwE3JjdYPtJVeabVYRKf8y7xiXA',
    description:
      'High-potency antioxidant serum formulated to combat urban pollution, brighten dull uneven tone, and support collagen density.',
  },
];

export function HomeClient() {
  const { addToCart, applyCoupon } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // State
  const [bestsellerCategory, setBestsellerCategory] = useState<'all' | 'women' | 'men'>('all');
  const [ritualTab, setRitualTab] = useState<'women' | 'men'>('women');
  const [quickViewProduct, setQuickViewProduct] = useState<DisplayProduct | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [couponCopied, setCouponCopied] = useState(false);
  const [trioAddedToast, setTrioAddedToast] = useState(false);

  // Filtered Products
  const filteredProducts =
    bestsellerCategory === 'all'
      ? BEST_SELLER_PRODUCTS
      : BEST_SELLER_PRODUCTS.filter((p) => p.category === bestsellerCategory);

  // Helper to add to cart from display product
  const handleAddToCart = (item: DisplayProduct) => {
    const fullProduct = PRODUCTS.find((p) => p.id === item.id) || {
      id: item.id,
      category: item.category,
      categoryName: item.category === 'women' ? 'Women Collection' : 'Men Collection',
      name: item.name,
      slug: item.slug,
      subtitle: item.subtitle,
      description: item.description,
      howToUse: 'Apply gently to clean skin.',
      size: item.size,
      price: item.originalPrice,
      salePrice: item.price,
      sku: `EBA-${item.id}`,
      stock: 50,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      image: item.image,
      badge: item.badge,
      benefits: ['Clinically proven', 'South Asian skin calibrated', 'Dermatologist tested'],
    };

    addToCart(fullProduct, 1);
  };

  // Helper to buy complete 3-step routine bundle
  const handleBuyFullTrio = () => {
    const relevantProducts =
      ritualTab === 'women'
        ? PRODUCTS.filter((p) => p.category === 'women')
        : PRODUCTS.filter((p) => p.category === 'men');

    relevantProducts.forEach((p) => addToCart(p, 1));
    applyCoupon('EBAGLOW');
    setTrioAddedToast(true);
    setTimeout(() => setTrioAddedToast(false), 4000);
  };

  // Copy Coupon Code
  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('EBAGLOW');
    setCouponCopied(true);
    applyCoupon('EBAGLOW');
    setTimeout(() => setCouponCopied(false), 3000);
  };

  // Newsletter Submit
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSubscribed(false), 5000);
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Toast notifications */}
      {trioAddedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1615] text-[#FDF9F4] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-[#CCA730] animate-fade-in">
          <span className="material-symbols-outlined text-[#FFE088] text-[22px]">check_circle</span>
          <div>
            <div className="font-semibold text-sm">3-Step Regimen Trio Added!</div>
            <div className="text-xs text-[#E6E2DD]">Coupon EBAGLOW applied for 15% discount.</div>
          </div>
        </div>
      )}

      {/* 1. Interactive Dual Hero Section */}
      <section className="relative w-full bg-[#F7F3EE] px-4 sm:px-6 lg:px-12 pt-8 pb-20">
        <div className="max-w-[1380px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Headline & Dual CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBE8E3] shadow-sm mb-4 border border-[#EADECF]">
              <span className="w-2 h-2 rounded-full bg-[#CCA730] animate-pulse" />
              <span className="font-label-uppercase text-[11px] tracking-widest text-[#4E4543] font-semibold">
                Clinique Botanica • South Asia
              </span>
            </div>

            <h1 className="font-display-lg text-4xl sm:text-5xl lg:text-6xl text-[#1C1C19] leading-tight tracking-tight mb-4">
              High-Performance Radiance,{' '}
              <span className="italic font-normal text-[#725B38]">
                Tailored for Every Skin.
              </span>
            </h1>

            <p className="font-body-lg text-base sm:text-lg text-[#4E4543] max-w-xl mb-8 leading-relaxed">
              Clinically proven botanical formulations engineered for South Asian climates. Dermatologically tested, cruelty-free, and meticulously calibrated for Men and Women.
            </p>

            {/* Dual Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link
                href="/women"
                className="group relative px-8 py-4 rounded-full bg-[#725B38] text-white font-label-uppercase text-xs tracking-widest font-semibold shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Shop Women Collection
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </span>
                <div className="absolute inset-0 bg-[#FEDEB2] opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>

              <Link
                href="/men"
                className="group relative px-8 py-4 rounded-full bg-[#1F1B1A] text-white font-label-uppercase text-xs tracking-widest font-semibold shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Shop Men Collection
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>
            </div>

            {/* Metric Highlights */}
            <div className="grid grid-cols-3 gap-6 pt-6 mt-8 w-full bg-[#F1EDE8]/70 p-5 rounded-2xl border border-[#EADECF]">
              <div>
                <div className="font-price-lg text-xl sm:text-2xl text-[#1C1C19] font-bold">98.4%</div>
                <div className="font-body-sm text-xs text-[#4E4543] mt-0.5">Barrier Restoration</div>
              </div>
              <div>
                <div className="font-price-lg text-xl sm:text-2xl text-[#1C1C19] font-bold">14 Days</div>
                <div className="font-body-sm text-xs text-[#4E4543] mt-0.5">Visible Radiance</div>
              </div>
              <div>
                <div className="font-price-lg text-xl sm:text-2xl text-[#1C1C19] font-bold">100%</div>
                <div className="font-body-sm text-xs text-[#4E4543] mt-0.5">Halal & Non-Comedogenic</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Dual Montage */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[5/6] rounded-2xl overflow-hidden shadow-2xl bg-[#F1EDE8] border border-[#EADECF]">
              <div className="absolute inset-0 grid grid-cols-2">
                {/* Left Half: Women's Soft Luxury Glow */}
                <Link href="/women" className="relative h-full overflow-hidden group block">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlOJoPgKGYUTFyrU6Zkru90zysTKfNIA4WC0fjWWHRJmUI181UrP1n64fpKiIZ3rMJr6HhkDWyTrC53gMDjEcXGh1SXlC4ZlCKX8FFMEV8Q7E872J-un1b7RAwbBaMqbjKDcYJ5DLdji-2WfzWnFoR6t9lN-uKhDrKpeqJITYrEZU3ZGkD5QkHH1PSRhBr_GNkxRHIvAzbt4s_WpNr25tYizGsnxp_2nU-oUVqZxEZn95dhwawTgezCw"
                    alt="Close-up luxury skincare bottle of golden radiant serum resting on wet travertine marble surface"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
                    <span className="font-label-uppercase text-[11px] text-[#FEDEB2] tracking-widest font-bold">
                      The Women Line
                    </span>
                    <span className="font-headline-sm text-lg sm:text-xl text-white">
                      Glow & Luminescence
                    </span>
                  </div>
                </Link>

                {/* Right Half: Men's Obsidian Slate */}
                <Link href="/men" className="relative h-full overflow-hidden group block bg-[#14171C]">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWdjQaMELbJx4Huf2UMZsszy_ANpp09ABiY8lcItAUlA4ruXHAoBRm7pTW0Z_hn3UGNDH-eQLub5BqroLcHqDYKI78drAb9I2DOOjdnGuIjxXB2uFz_weBpGtYujNDSZe8pE0eeDezriMDEgS_Bz9VcGAInXpBK9dllvmUMUE0065H5wR0yK2fA1TXmz5NvDvsTiZ6Qi3gFoZfYoMHTVAfsJHaTpWRWjO8KpF2SJHQnL-JwZknuUIUkw"
                    alt="Minimalist luxury cosmetic dropper and matte black pumice container for men skincare"
                    fill
                    className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1615] via-black/40 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
                    <span className="font-label-uppercase text-[11px] text-[#FFE088] tracking-widest font-bold">
                      The Men Line
                    </span>
                    <span className="font-headline-sm text-lg sm:text-xl text-white">
                      Active Pure Fortitude
                    </span>
                  </div>
                </Link>
              </div>

              {/* Floating Clinical Capsule Overlay */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 whitespace-nowrap border border-[#EADECF]">
                <span className="material-symbols-outlined text-[#CCA730] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="font-label-ui text-xs text-[#1C1C19] font-semibold">
                  Formulated for Humidity, Urban Heat & Melanin Profiles
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Trust & Benefits Strip */}
      <section className="w-full bg-[#EBE8E3] py-6 shadow-sm border-y border-[#EADECF]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-[#EADECF] shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#F1EDE8] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#725B38] text-[24px]">science</span>
              </div>
              <div>
                <div className="font-label-ui text-xs font-semibold text-[#1C1C19]">Dermatologist Tested</div>
                <div className="font-body-sm text-[11px] text-[#4E4543]">Bio-active purity standards</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-[#EADECF] shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#F1EDE8] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#735C00] text-[24px]">verified</span>
              </div>
              <div>
                <div className="font-label-ui text-xs font-semibold text-[#1C1C19]">100% Halal & Pure</div>
                <div className="font-body-sm text-[11px] text-[#4E4543]">Cruelty-free botanical extracts</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-[#EADECF] shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#F1EDE8] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#725B38] text-[24px]">rocket_launch</span>
              </div>
              <div>
                <div className="font-label-ui text-xs font-semibold text-[#1C1C19]">Express Delivery</div>
                <div className="font-body-sm text-[11px] text-[#4E4543]">2-4 days via TCS / Leopard</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-[#EADECF] shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#F1EDE8] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#735C00] text-[24px]">payments</span>
              </div>
              <div>
                <div className="font-label-ui text-xs font-semibold text-[#1C1C19]">Cash on Delivery</div>
                <div className="font-body-sm text-[11px] text-[#4E4543]">Pay safely upon receipt</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dual Skin Ecosystems (Category Split Interactive Banners) */}
      <section className="w-full bg-[#FDF9F4] py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1380px] mx-auto flex flex-col space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-label-uppercase text-xs tracking-widest text-[#735C00] font-bold">
                Engineered Protocols
              </span>
              <h2 className="font-headline-lg text-3xl sm:text-4xl text-[#1C1C19] mt-1">
                Dual Skin Ecosystems
              </h2>
            </div>
            <p className="font-body-md text-sm sm:text-base text-[#4E4543] max-w-md">
              Explore specialized regimens calibrated for individual pore physiology, lifestyle stressors, and oxidative exposure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Women Collection Card */}
            <div className="group relative rounded-2xl overflow-hidden bg-[#F7F3EE] border border-[#EADECF] shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-between p-6 sm:p-10 min-h-[480px]">
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPi0NXUwKknclMwDhsA31eHakfqIjw5naozUqTuX_Lm3exQtILEW0eJ634MgK2zprb8i85xrwDHXwiDIMk4TepQHE50Asi_92jMjKniW4LXpJGWGjnGGCyw4rXpoJsnDrp9aSee8RgkT0qZ9Z3bkKvcEoWVftFFaY5BsAqKocdtBcXR7OZ-mL0sv_poN7DbwX7Pa2IYc44RgIuViQUrNu0pbHYZd8QVSbqY-mgQCZaZc7BmUMHL1LDhw"
                  alt="Artistic composition of luxury skincare bottles, golden elixir dropper"
                  fill
                  className="object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F7F3EE] via-[#F7F3EE]/75 to-transparent" />
              </div>

              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-[#FEDEB2] text-[#78603E] font-label-uppercase text-[11px] font-bold tracking-wider">
                  Women&apos;s Regimen
                </span>
                <span className="font-label-uppercase text-xs text-[#4E4543] font-semibold">
                  3-Step Luminance
                </span>
              </div>

              <div className="mt-28 space-y-3">
                <span className="font-label-uppercase text-xs text-[#725B38] tracking-widest font-bold">
                  Glow, Restore & Even Tone
                </span>
                <h3 className="font-headline-lg text-2xl sm:text-3xl text-[#1C1C19]">
                  The Luminance Regimen
                </h3>
                <p className="font-body-md text-sm text-[#4E4543] max-w-md leading-relaxed">
                  Formulated with high-grade Niacinamide, Glutathione, and Botanical Centella to combat hyperpigmentation, photo-aging, and uneven tone under intense sun exposure.
                </p>
                <div className="pt-3">
                  <Link
                    href="/women"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#725B38] text-white font-label-uppercase text-xs font-semibold tracking-wider hover:bg-[#1C1C19] transition-all shadow-md"
                  >
                    <span>Explore Women</span>
                    <span className="material-symbols-outlined text-[16px]">east</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Men Collection Card */}
            <div className="group relative rounded-2xl overflow-hidden bg-[#1F1B1A] text-white border border-[#2D343E] shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-between p-6 sm:p-10 min-h-[480px]">
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk4PZJZLWfLnugGVUR6DQn2mW3_OVzdxo8Hq_tqGTJyTp1iIQG0DPpXAWc5YfNNTBEcowzHydiKCUlDGIW8SkGPms18Ia66d8vayqHl8FQEtB1KcUiZv7sJMuTRXENskW2b3U-BKSGoD3fvlbfLF_XM-gDcKwUq4IuWUYhWsrwC3oCr4oL1NcA-oSLC9cLJccZYDeO2npQleyD3CHl0Jqn0ygW_iGWPElJswAchUVH_wfRqAIm19BNIQ"
                  alt="Masculine grooming luxury bottle on rough slate stone"
                  fill
                  className="object-cover opacity-25 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F1B1A] via-[#1F1B1A]/85 to-transparent" />
              </div>

              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-[#EBE8E3]/20 text-[#FFE088] font-label-uppercase text-[11px] font-bold tracking-wider backdrop-blur-sm">
                  Men&apos;s Regimen
                </span>
                <span className="font-label-uppercase text-xs text-[#EBE8E3] font-semibold">
                  3-Step Fortitude
                </span>
              </div>

              <div className="mt-28 space-y-3">
                <span className="font-label-uppercase text-xs text-[#FFE088] tracking-widest font-bold">
                  Anti-Pollution & Rebalance
                </span>
                <h3 className="font-headline-lg text-2xl sm:text-3xl text-white">
                  The Pure Fortitude Line
                </h3>
                <p className="font-body-md text-sm text-[#EBE8E3]/80 max-w-md leading-relaxed">
                  Targeted activated charcoal, caffeine, and 15% Vitamin C complex designed specifically for denser dermis, post-shave sensitivity, and urban pollution defense.
                </p>
                <div className="pt-3">
                  <Link
                    href="/men"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#1C1C19] font-label-uppercase text-xs font-semibold tracking-wider hover:bg-[#FFE088] transition-all shadow-md"
                  >
                    <span>Explore Men</span>
                    <span className="material-symbols-outlined text-[16px]">east</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Best Sellers Grid */}
      <section id="bestsellers" className="w-full bg-[#F7F3EE] py-20 px-4 sm:px-6 lg:px-12 border-t border-[#EADECF]">
        <div className="max-w-[1380px] mx-auto flex flex-col space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-label-uppercase text-xs tracking-widest text-[#725B38] font-bold">
                Pakistani Favorites
              </span>
              <h2 className="font-headline-lg text-3xl sm:text-4xl text-[#1C1C19] mt-1">
                Curated Best Sellers
              </h2>
            </div>

            {/* Filter Toggle Buttons */}
            <div className="inline-flex p-1 bg-[#EBE8E3] rounded-full self-start md:self-auto border border-[#EADECF]">
              <button
                onClick={() => setBestsellerCategory('all')}
                className={`px-5 py-2 rounded-full font-label-uppercase text-xs tracking-wider transition-all font-semibold ${
                  bestsellerCategory === 'all'
                    ? 'bg-[#1A1615] text-white shadow-sm'
                    : 'text-[#4E4543] hover:text-[#1C1C19]'
                }`}
              >
                All Formulations
              </button>
              <button
                onClick={() => setBestsellerCategory('women')}
                className={`px-5 py-2 rounded-full font-label-uppercase text-xs tracking-wider transition-all font-semibold ${
                  bestsellerCategory === 'women'
                    ? 'bg-[#1A1615] text-white shadow-sm'
                    : 'text-[#4E4543] hover:text-[#1C1C19]'
                }`}
              >
                Women
              </button>
              <button
                onClick={() => setBestsellerCategory('men')}
                className={`px-5 py-2 rounded-full font-label-uppercase text-xs tracking-wider transition-all font-semibold ${
                  bestsellerCategory === 'men'
                    ? 'bg-[#1A1615] text-white shadow-sm'
                    : 'text-[#4E4543] hover:text-[#1C1C19]'
                }`}
              >
                Men
              </button>
            </div>
          </div>

          {/* 6 Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const inWish = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="group product-card flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 p-4 border border-[#EADECF]"
                >
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#F1EDE8] mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Badge */}
                    <div
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full font-label-uppercase text-[10px] font-bold tracking-widest uppercase shadow-sm ${product.badgeColor}`}
                    >
                      {product.badge}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      aria-label="Add to wishlist"
                      onClick={() =>
                        toggleWishlist({
                          id: product.id,
                          category: product.category,
                          categoryName: product.category === 'women' ? 'Women Collection' : 'Men Collection',
                          name: product.name,
                          slug: product.slug,
                          subtitle: product.subtitle,
                          description: product.description,
                          howToUse: '',
                          size: product.size,
                          price: product.originalPrice,
                          salePrice: product.price,
                          sku: `EBA-${product.id}`,
                          stock: 50,
                          rating: product.rating,
                          reviewsCount: product.reviewsCount,
                          image: product.image,
                          badge: product.badge,
                          benefits: [],
                        })
                      }
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-all shadow-sm ${
                        inWish ? 'text-red-500' : 'text-[#4E4543] hover:text-red-500 hover:scale-110'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: inWish ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                    </button>

                    {/* Quick View Hover Button */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="w-full py-2.5 px-4 rounded-full bg-white/95 backdrop-blur-md text-[#1C1C19] font-label-uppercase text-xs tracking-wider font-semibold shadow-md hover:bg-white transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span> Quick Overview
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1 text-[#CCA730]">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined text-[14px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <span className="font-body-sm text-xs text-[#4E4543] font-medium">
                        ({product.reviewsCount})
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#F1EDE8] font-label-uppercase text-[10px] text-[#4E4543] font-semibold">
                      {product.size}
                    </span>
                  </div>

                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-headline-sm text-lg text-[#1C1C19] line-clamp-1 mb-1 hover:text-[#725B38] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="font-body-sm text-xs text-[#725B38] font-medium mb-4">
                    {product.subtitle}
                  </p>

                  <div className="mt-auto pt-3 border-t border-[#EADECF]/60 flex items-center justify-between">
                    <div>
                      <span className="font-price-md text-base font-bold text-[#1C1C19]">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      <span className="block font-body-sm text-xs text-[#7F7572] line-through">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="px-4 py-2.5 rounded-full bg-[#1A1615] text-white hover:bg-[#725B38] font-label-uppercase text-xs tracking-widest font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">shopping_bag</span> Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Interactive 3-Step Ritual Guide */}
      <section id="rituals" className="w-full bg-[#FDF9F4] py-20 px-4 sm:px-6 lg:px-12 border-t border-[#EADECF]">
        <div className="max-w-[1380px] mx-auto flex flex-col items-center">
          <div className="text-center max-w-2xl mb-12">
            <span className="font-label-uppercase text-xs tracking-widest text-[#725B38] font-bold">
              The Science of Layering
            </span>
            <h2 className="font-headline-lg text-3xl sm:text-4xl text-[#1C1C19] mt-1">
              Interactive 3-Step Ritual
            </h2>
            <p className="font-body-md text-sm sm:text-base text-[#4E4543] mt-2">
              Engineered synergistic formulation sequences that amplify cellular absorption, fortifying lipid moisture locks overnight.
            </p>

            {/* Gender Switcher Tab */}
            <div className="inline-flex p-1 bg-[#EBE8E3] rounded-full mt-6 shadow-inner border border-[#EADECF]">
              <button
                onClick={() => setRitualTab('women')}
                className={`px-6 py-2.5 rounded-full font-label-uppercase text-xs tracking-wider transition-all font-semibold ${
                  ritualTab === 'women'
                    ? 'bg-white text-[#1C1C19] shadow-sm'
                    : 'text-[#4E4543] hover:text-[#1C1C19]'
                }`}
              >
                Women&apos;s Ritual (Luminance)
              </button>
              <button
                onClick={() => setRitualTab('men')}
                className={`px-6 py-2.5 rounded-full font-label-uppercase text-xs tracking-wider transition-all font-semibold ${
                  ritualTab === 'men'
                    ? 'bg-white text-[#1C1C19] shadow-sm'
                    : 'text-[#4E4543] hover:text-[#1C1C19]'
                }`}
              >
                Men&apos;s Ritual (Fortitude)
              </button>
            </div>
          </div>

          {/* 3 Steps Visual Flow */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="relative bg-[#F7F3EE] rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all border border-[#EADECF]">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-full bg-[#EBE8E3] text-[#1C1C19] font-headline-sm flex items-center justify-center font-bold">
                  01
                </span>
                <span className="font-label-uppercase text-xs text-[#725B38] font-bold tracking-widest">
                  Morning & Night
                </span>
              </div>
              <div className="aspect-square rounded-xl overflow-hidden bg-[#F1EDE8] mb-4 relative">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUJBFt12xzc1HeDatdsTN9x08omSQKaJCwkubUXPMurn8iGajnXF0tpgSBQvmo3JH0cY6F6Y1TVRTtG3-lZ3GVmu0qCtXfcGd_1cNd5v6RIObdMafVh9z0P17B_YkgoWRmY9iNDsWKwosPTzz3depFHftDvFFMsPnXLenOZzxjoPw9RsR0IgrMazSGmbXCT2_B9CnIMzVwcOEdbVMw_T_w7DwsElMaeeIQxwno7MoaFWh496cZ6R4how"
                  alt="Gentle botanical cleansing milk face wash pouring softly onto wet skin"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-headline-sm text-xl text-[#1C1C19] mb-1">
                  {ritualTab === 'women' ? 'Step 1: Cleanse & Clarify' : 'Step 1: Deep Charcoal Detox'}
                </h3>
                <p className="font-body-sm text-sm text-[#4E4543] mb-3 leading-relaxed">
                  {ritualTab === 'women'
                    ? '100ml Clarifying Cleanser removes deep-seated urban particulate matter, sweat salts, and excess sebum without stripping vital ceramides.'
                    : '100ml Charcoal Oil-Control Cleanser removes heavy automotive pollutants, sweat residue, and stubborn excess sebum for a crisp matte finish.'}
                </p>
                <div className="inline-flex items-center gap-1 text-[#725B38] font-label-ui text-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px]">done</span>
                  <span>
                    {ritualTab === 'women'
                      ? 'pH 5.5 Balanced • Salicylic Acid'
                      : 'Activated Charcoal + Organic Tea Tree'}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-[#F7F3EE] rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all border border-[#EADECF]">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-full bg-[#EBE8E3] text-[#1C1C19] font-headline-sm flex items-center justify-center font-bold">
                  02
                </span>
                <span className="font-label-uppercase text-xs text-[#725B38] font-bold tracking-widest">
                  Target Treatment
                </span>
              </div>
              <div className="aspect-square rounded-xl overflow-hidden bg-[#F1EDE8] mb-4 relative">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlf-Dtl92XY3VChhT2CtkNI_nerwXuIzKIFzIFMYIznQYvjLUsHj6fPk9raQGSz9gpyES3L4AXowPCPSMnh2j99rMntBYcAPvUpRRsUjuWS7jRrV5-5FCasG2qCXG_OSSeLBdls9s3VKkL7sM9ZDxf3EImkLTihdjfspFY6zpnF-9gXNZ0luDfD-A4C6zr7wdCKPc8Fpf4q5fI7omjCDRaIGf3wgqNcAz0EA-moCn3_g7UkjxU6mTpyA"
                  alt="High potency skin serum droplet falling from golden pipette into glass dish"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-headline-sm text-xl text-[#1C1C19] mb-1">
                  {ritualTab === 'women' ? 'Step 2: Target & Brighten' : 'Step 2: Active Defense Shield'}
                </h3>
                <p className="font-body-sm text-sm text-[#4E4543] mb-3 leading-relaxed">
                  {ritualTab === 'women'
                    ? '30ml Concentrated Glow Serum penetrates dermal strata to inhibit tyrosinase activity, fading dark spots and sun damage.'
                    : '30ml Active Defense Serum energizes fatigued skin cells with 15% Vitamin C and Zinc to prevent oxidation and environmental dullness.'}
                </p>
                <div className="inline-flex items-center gap-1 text-[#725B38] font-label-ui text-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px]">done</span>
                  <span>
                    {ritualTab === 'women'
                      ? 'Niacinamide 10% + Alpha Arbutin'
                      : 'Vitamin C 15% + Zinc PCA'}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-[#F7F3EE] rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all border border-[#EADECF]">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-full bg-[#EBE8E3] text-[#1C1C19] font-headline-sm flex items-center justify-center font-bold">
                  03
                </span>
                <span className="font-label-uppercase text-xs text-[#725B38] font-bold tracking-widest">
                  Overnight Recovery
                </span>
              </div>
              <div className="aspect-square rounded-xl overflow-hidden bg-[#F1EDE8] mb-4 relative">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDswO1GWMYsS3IbdCmZCgwvYYny2woqzrIdvvgDuXgn7gEjRmWlK4_fn3rhomsfL9VjkgUayE4rkBCv5_ROyxmnxyqAeUatXsZxM-R3f8_naN05GQHtdbgytlqwncVVkO2BoEOT3aWOvEk55sRHJRNeA1vwUta3dYLvXso_z9Py_Wylv4oGcEwZfwDyeLgrqYNdxVvokXGT31lQD7ivP-IPEXKM32rEMalFuHTpLPoy7X0QDLLAqPzlOQ"
                  alt="Luxurious rich restorative whitening night cream texture spread on cool white marble slab"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-headline-sm text-xl text-[#1C1C19] mb-1">
                  {ritualTab === 'women' ? 'Step 3: Hydrate & Rejuvenate' : 'Step 3: Nocturnal Cell Fortitude'}
                </h3>
                <p className="font-body-sm text-sm text-[#4E4543] mb-3 leading-relaxed">
                  {ritualTab === 'women'
                    ? '50gm Night Whitening Elixir seals nutrients, stimulating collagen synthesis during nocturnal recovery cycles.'
                    : '50gm Restorative Night Cream reinforces dermal resilience, soothing post-shave irritation with high-potency caffeine and 4D Hyaluronic acid.'}
                </p>
                <div className="inline-flex items-center gap-1 text-[#725B38] font-label-ui text-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px]">done</span>
                  <span>
                    {ritualTab === 'women'
                      ? 'Glutathione + Multi-Peptides'
                      : 'Hyaluronic 4D + Caffeine Complex'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Routine Bundle CTA */}
          <div className="mt-10 p-6 sm:p-8 bg-[#EBE8E3] rounded-2xl w-full flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm border border-[#EADECF]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#725B38] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">card_giftcard</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-lg text-[#1C1C19]">
                  Order The Complete 3-Step Regimen
                </h4>
                <p className="font-body-sm text-xs sm:text-sm text-[#4E4543]">
                  Includes free clinical velvet vanity case and priority nationwide express shipping.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 shrink-0">
              <div className="text-right hidden sm:block">
                <div className="font-price-md text-base sm:text-lg text-[#1C1C19] font-bold">
                  Rs. 6,545 <span className="line-through text-[#7F7572] font-normal text-xs">Rs. 7,700</span>
                </div>
                <div className="font-label-uppercase text-[10px] text-[#735C00] font-bold uppercase tracking-wider">
                  Bundle Savings -15%
                </div>
              </div>

              <button
                onClick={handleBuyFullTrio}
                className="px-6 py-3.5 rounded-full bg-[#1A1615] text-white hover:bg-[#725B38] transition-colors font-label-uppercase text-xs tracking-wider font-semibold shadow-md whitespace-nowrap"
              >
                Get Full Trio Regimen
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Promotional Limited-Time Offer Banner */}
      <section className="w-full bg-[#F7F3EE] px-4 sm:px-6 lg:px-12 py-12">
        <div className="max-w-[1380px] mx-auto rounded-3xl bg-[#1A1615] text-white overflow-hidden relative shadow-2xl p-6 sm:p-12 border border-[#2D343E]">
          {/* Subtle Ambient Glow Shapes */}
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#725B38]/25 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-[#CCA730]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FFE088] font-label-uppercase text-xs tracking-widest font-semibold backdrop-blur-sm">
                <span className="material-symbols-outlined text-[14px]">local_offer</span>
                Exclusive Season Privileges
              </div>

              <h3 className="font-headline-lg lg:font-display-lg text-3xl sm:text-4xl lg:text-5xl text-white">
                The Complete Regimen Trio — <span className="text-[#FFE088] italic">15% Off</span>
              </h3>

              <p className="font-body-lg text-sm sm:text-base text-[#E6E2DD] max-w-2xl leading-relaxed">
                Acquire the full Face Wash, Glow Radiance Serum, and Night Whitening Cream set. Enter coupon code{' '}
                <button
                  onClick={handleCopyCoupon}
                  title="Click to copy coupon code"
                  className="px-2 py-0.5 rounded bg-white/20 text-[#FFE088] font-bold tracking-wider hover:bg-white/30 transition-colors inline-flex items-center gap-1"
                >
                  <span>EBAGLOW</span>
                  <span className="material-symbols-outlined text-[13px]">content_copy</span>
                </button>{' '}
                at checkout. Includes complimentary imported velvet travel organizer.
              </p>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
                <div className="flex items-center gap-2 text-[#FDF9F4] font-body-sm text-xs">
                  <span className="material-symbols-outlined text-[#FFE088] text-[18px]">verified</span>
                  Complimentary Shipping
                </div>
                <div className="flex items-center gap-2 text-[#FDF9F4] font-body-sm text-xs">
                  <span className="material-symbols-outlined text-[#FFE088] text-[18px]">card_giftcard</span>
                  Free Luxury Gift Pouch
                </div>
                <div className="flex items-center gap-2 text-[#FDF9F4] font-body-sm text-xs">
                  <span className="material-symbols-outlined text-[#FFE088] text-[18px]">schedule</span>
                  Dispatch within 24 Hours
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl w-full max-w-xs text-center border border-white/10 shadow-lg">
                <span className="font-label-uppercase text-xs text-[#E6E2DD] tracking-widest">
                  Promo Coupon
                </span>
                <div
                  onClick={handleCopyCoupon}
                  className="my-3 py-2.5 px-4 rounded-xl bg-white text-[#1C1C19] font-price-lg text-xl tracking-widest font-bold select-all cursor-pointer hover:bg-[#FFE088] transition-colors"
                >
                  {couponCopied ? 'COPIED!' : 'EBAGLOW'}
                </div>
                <Link
                  href="/shop?coupon=EBAGLOW"
                  className="w-full py-3 rounded-full bg-[#725B38] text-white font-label-uppercase text-xs tracking-widest font-semibold hover:bg-[#FFE088] hover:text-[#1C1C19] transition-all shadow-md inline-block text-center"
                >
                  Claim Offer Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Verified Pakistan Customer Voices */}
      <section className="w-full bg-[#FDF9F4] py-20 px-4 sm:px-6 lg:px-12 border-t border-[#EADECF]">
        <div className="max-w-[1380px] mx-auto flex flex-col space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-label-uppercase text-xs tracking-widest text-[#725B38] font-bold">
                Real Stories, Real Transformations
              </span>
              <h2 className="font-headline-lg text-3xl sm:text-4xl text-[#1C1C19] mt-1">
                Verified Pakistan Customer Voices
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous review"
                className="w-11 h-11 rounded-full bg-[#EBE8E3] text-[#1C1C19] hover:bg-[#1A1615] hover:text-white transition-all flex items-center justify-center shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button
                aria-label="Next review"
                className="w-11 h-11 rounded-full bg-[#EBE8E3] text-[#1C1C19] hover:bg-[#1A1615] hover:text-white transition-all flex items-center justify-center shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1: Lahore */}
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#EADECF]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-[#CCA730]">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="font-label-uppercase text-[11px] text-[#7F7572] font-semibold">
                    2 days ago
                  </span>
                </div>
                <p className="font-body-md text-sm text-[#1C1C19] leading-relaxed mb-6 italic">
                  &ldquo;Living in Lahore&apos;s smog and extreme summer heat ruined my skin texture. The Glow Serum + Night Cream visibly reduced my stubborn tanning within 10 days. TCS delivery was prompt, arriving in 48 hours with cash on delivery.&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 bg-[#F7F3EE]/60 p-3 rounded-xl border border-[#EADECF]/50">
                <div className="w-10 h-10 rounded-full bg-[#FEDEB2] text-[#78603E] flex items-center justify-center font-bold text-sm">
                  AM
                </div>
                <div>
                  <div className="font-label-ui text-xs font-semibold text-[#1C1C19]">Ayesha Malik</div>
                  <div className="flex items-center gap-1 text-[11px] text-[#725B38] font-medium">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    <span>Verified Buyer • DHA Lahore</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review 2: Karachi */}
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#EADECF]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-[#CCA730]">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="font-label-uppercase text-[11px] text-[#7F7572] font-semibold">
                    1 week ago
                  </span>
                </div>
                <p className="font-body-md text-sm text-[#1C1C19] leading-relaxed mb-6 italic">
                  &ldquo;Karachi humidity usually makes every night cream feel sticky and greasy. EBA Men&apos;s Charcoal Cleanser and Restorative Cream absorbed completely matte without clogging my pores. My post-shave razor bumps are gone.&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 bg-[#F7F3EE]/60 p-3 rounded-xl border border-[#EADECF]/50">
                <div className="w-10 h-10 rounded-full bg-[#EBE8E3] text-[#1C1C19] flex items-center justify-center font-bold text-sm">
                  FK
                </div>
                <div>
                  <div className="font-label-ui text-xs font-semibold text-[#1C1C19]">Fahad Khan</div>
                  <div className="flex items-center gap-1 text-[11px] text-[#725B38] font-medium">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    <span>Verified Buyer • Clifton Karachi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review 3: Islamabad */}
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#EADECF]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-[#CCA730]">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="font-label-uppercase text-[11px] text-[#7F7572] font-semibold">
                    2 weeks ago
                  </span>
                </div>
                <p className="font-body-md text-sm text-[#1C1C19] leading-relaxed mb-6 italic">
                  &ldquo;Ordered the complete Women&apos;s Regimen trio to Islamabad. The packaging feels like a high-end French luxury apothecary, but formulated specifically for our local skin. My hyperpigmentation on cheeks has lightened dramatically.&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 bg-[#F7F3EE]/60 p-3 rounded-xl border border-[#EADECF]/50">
                <div className="w-10 h-10 rounded-full bg-[#FEDEB2] text-[#78603E] flex items-center justify-center font-bold text-sm">
                  ZR
                </div>
                <div>
                  <div className="font-label-ui text-xs font-semibold text-[#1C1C19]">Zainab Rehman</div>
                  <div className="flex items-center gap-1 text-[11px] text-[#725B38] font-medium">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    <span>Verified Buyer • F-8 Islamabad</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. VIP Privilege Club Newsletter & 10% Voucher Teaser */}
      <section className="w-full bg-[#EBE8E3] py-16 px-4 sm:px-6 lg:px-12 border-t border-[#EADECF]">
        <div className="max-w-[960px] mx-auto text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-white text-[#725B38] flex items-center justify-center mb-4 shadow-sm border border-[#EADECF]">
            <span className="material-symbols-outlined text-[28px]">mark_email_read</span>
          </div>

          <span className="font-label-uppercase text-xs tracking-widest text-[#725B38] font-bold">
            The EBA Privilege Circle
          </span>
          <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-[#1C1C19] mt-1">
            Unlock 10% Off Your First Acquisition
          </h2>
          <p className="font-body-md text-sm sm:text-base text-[#4E4543] max-w-xl mt-2 mb-8 leading-relaxed">
            Join discerning patrons across Karachi, Lahore, and Islamabad. Receive early seasonal launches, dermatological consultation invitations, and an instant 10% welcome voucher sent to your inbox.
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 bg-white rounded-full border border-[#CCA730] text-[#1C1C19] font-medium text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[#CCA730]">check_circle</span>
              Welcome to the EBA Privilege Club. Your 10% voucher code has been dispatched to your email.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-2">
              <input
                className="flex-1 h-12 px-5 bg-white text-[#1C1C19] font-body-md text-sm rounded-full focus:outline-none placeholder:text-[#7F7572] shadow-inner border border-[#EADECF]"
                placeholder="Enter your email address"
                required
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <button
                className="h-12 px-8 rounded-full bg-[#1A1615] text-white font-label-uppercase text-xs tracking-widest font-semibold hover:bg-[#725B38] transition-all shadow-md whitespace-nowrap"
                type="submit"
              >
                Claim 10% Off
              </button>
            </form>
          )}

          <div className="flex items-center justify-center gap-6 mt-4 text-[#4E4543] font-body-sm text-xs">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#735C00]">check_circle</span> Instant Email Voucher
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#735C00]">lock</span> Zero Spam Policy
            </span>
          </div>
        </div>
      </section>

      {/* 9. Interactive Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 bg-[#1F1B1A]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl relative p-6 sm:p-8 border border-[#EADECF] animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close modal"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F1EDE8] flex items-center justify-center text-[#1C1C19] hover:bg-[#1A1615] hover:text-white transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#F1EDE8] relative">
                <Image
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-3">
                <span
                  className={`px-3 py-1 rounded-full font-label-uppercase text-[10px] font-bold tracking-widest uppercase inline-block ${quickViewProduct.badgeColor}`}
                >
                  {quickViewProduct.badge}
                </span>

                <h3 className="font-headline-sm text-xl text-[#1C1C19]">
                  {quickViewProduct.name}
                </h3>

                <p className="text-xs text-[#725B38] font-medium">
                  {quickViewProduct.subtitle}
                </p>

                <div className="font-price-lg text-xl font-bold text-[#1C1C19]">
                  Rs. {quickViewProduct.price.toLocaleString()}{' '}
                  <span className="line-through text-xs font-normal text-[#7F7572]">
                    Rs. {quickViewProduct.originalPrice.toLocaleString()}
                  </span>
                </div>

                <p className="font-body-sm text-xs text-[#4E4543] leading-relaxed">
                  {quickViewProduct.description}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="w-full py-3 rounded-full bg-[#1A1615] text-white font-label-uppercase text-xs tracking-widest font-semibold hover:bg-[#725B38] transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">shopping_bag</span> Add to Cart Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
