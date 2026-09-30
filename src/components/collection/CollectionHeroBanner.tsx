'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCustomBanners, DEFAULT_BANNERS, PageBannerConfig } from '@/lib/bannerStorage';

interface Props {
  pageKey: 'women' | 'men' | 'shop';
}

export function CollectionHeroBanner({ pageKey }: Props) {
  const [banner, setBanner] = useState<PageBannerConfig>(DEFAULT_BANNERS.pageBanners[pageKey]);

  useEffect(() => {
    const banners = getCustomBanners();
    if (banners?.pageBanners?.[pageKey]) {
      setBanner(banners.pageBanners[pageKey]);
    }

    const handler = () => {
      const updated = getCustomBanners();
      if (updated?.pageBanners?.[pageKey]) {
        setBanner(updated.pageBanners[pageKey]);
      }
    };

    window.addEventListener('eba_banners_updated', handler);
    return () => window.removeEventListener('eba_banners_updated', handler);
  }, [pageKey]);

  const isMen = pageKey === 'men';
  const isShop = pageKey === 'shop';

  const containerClasses = isMen
    ? 'bg-[#14171C] text-[#F2F2F2] border-[#232830]'
    : isShop
    ? 'bg-[#F7F3EE] text-[#1C1C19] border-[#EADECF]'
    : 'bg-[#FAF0F2] text-[#3A2A33] border-[#EED7DC]';

  const badgeWrapperClasses = isMen
    ? 'bg-[#1C2026] border-[#2E3540]'
    : isShop
    ? 'bg-white border-[#EADECF]'
    : 'bg-white/80 backdrop-blur-sm border-[#EED7DC]';

  const badgeDotClasses = isMen
    ? 'bg-[#6C8EAD]'
    : isShop
    ? 'bg-[#725B38]'
    : 'bg-[#B76E79]';

  const badgeTextClasses = isMen
    ? 'text-[#8AB8D6]'
    : isShop
    ? 'text-[#725B38]'
    : 'text-[#B76E79]';

  const highlightClasses = isMen
    ? 'text-[#C9A96E]'
    : isShop
    ? 'text-[#725B38]'
    : 'text-[#B76E79]';

  const subtitleClasses = isMen
    ? 'text-[#A5ACB8]'
    : isShop
    ? 'text-[#4E4543]'
    : 'text-[#6E5362]';

  const primaryBtnClasses = isMen
    ? 'bg-white text-[#0F1115] hover:bg-[#EBE8E3]'
    : isShop
    ? 'bg-[#1A1615] text-white hover:bg-[#725B38]'
    : 'bg-[#3A2A33] text-white hover:bg-[#5A434F]';

  const secondaryBtnClasses = isMen
    ? 'bg-[#1C2026] border-[#2E3540] text-[#F2F2F2] hover:bg-[#252B33]'
    : isShop
    ? 'bg-white border-[#EADECF] text-[#1C1C19] hover:bg-[#EBE8E3]'
    : 'bg-white border-[#EED7DC] text-[#3A2A33] hover:bg-[#F9F2F3]';

  const dividerClasses = isMen
    ? 'border-[#232830]'
    : isShop
    ? 'border-[#EADECF]'
    : 'border-[#EED7DC]';

  const statTextClasses = isMen
    ? 'text-[#F2F2F2]'
    : isShop
    ? 'text-[#1C1C19]'
    : 'text-[#3A2A33]';

  const statLabelClasses = isMen
    ? 'text-[#A5ACB8]'
    : isShop
    ? 'text-[#7F7572]'
    : 'text-[#6E5362]';

  const imageCardClasses = isMen
    ? 'border-[#2E3540] bg-[#14171C]'
    : isShop
    ? 'border-[#EADECF] bg-white'
    : 'border-[#EED7DC] bg-[#FAF0F2]';

  return (
    <section className={`relative w-full border-b overflow-hidden ${containerClasses}`}>
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column Text */}
        <div className="lg:col-span-7 space-y-6 z-10">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-sm ${badgeWrapperClasses}`}
          >
            <span className={`w-2 h-2 rounded-full animate-pulse ${badgeDotClasses}`} />
            <span className={`font-label-uppercase text-[11px] tracking-widest font-bold ${badgeTextClasses}`}>
              {banner.badge}
            </span>
          </div>

          <h1 className="font-display-lg text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
            {banner.title}{' '}
            <span className={`italic font-normal ${highlightClasses}`}>
              {banner.titleHighlight}
            </span>
          </h1>

          <p className={`font-body-lg text-base sm:text-lg max-w-xl leading-relaxed ${subtitleClasses}`}>
            {banner.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#products"
              className={`px-8 py-4 rounded-full font-label-uppercase text-xs tracking-widest font-semibold transition-all shadow-md flex items-center justify-center ${primaryBtnClasses}`}
            >
              Explore Formulations
            </a>
            <Link
              href={isShop ? '/women' : '/shop'}
              className={`px-8 py-4 rounded-full border font-label-uppercase text-xs tracking-widest font-semibold transition-all shadow-sm ${secondaryBtnClasses}`}
            >
              {isShop ? 'Women Line' : 'Complete Apothecary'}
            </Link>
          </div>

          {/* Micro Highlights */}
          <div className={`grid grid-cols-3 gap-4 pt-6 border-t max-w-lg ${dividerClasses}`}>
            <div>
              <div className={`font-price-lg text-xl sm:text-2xl font-bold ${statTextClasses}`}>
                {isMen ? '99.4%' : isShop ? '100%' : '98.6%'}
              </div>
              <div className={`font-body-sm text-xs ${statLabelClasses}`}>
                {isMen ? 'Sebum Neutralization' : isShop ? 'Botanical Purity' : 'Luminescence Index'}
              </div>
            </div>
            <div>
              <div className={`font-price-lg text-xl sm:text-2xl font-bold ${statTextClasses}`}>
                {isShop ? '2-4 Days' : '14 Days'}
              </div>
              <div className={`font-body-sm text-xs ${statLabelClasses}`}>
                {isShop ? 'Express Pakistan Delivery' : isMen ? 'Barrier Fortification' : 'Spot Attenuation'}
              </div>
            </div>
            <div>
              <div className={`font-price-lg text-xl sm:text-2xl font-bold ${statTextClasses}`}>
                100%
              </div>
              <div className={`font-body-sm text-xs ${statLabelClasses}`}>
                Halal &amp; Cruelty-Free
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Image */}
        <div className="lg:col-span-5 relative">
          <div className={`relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border ${imageCardClasses}`}>
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
              className="object-cover"
            />
            <div
              className={`absolute inset-0 flex flex-col justify-end p-6 text-white ${
                isMen
                  ? 'bg-gradient-to-t from-[#0F1115]/80 via-transparent to-transparent'
                  : 'bg-gradient-to-t from-[#1A1615]/70 via-transparent to-transparent'
              }`}
            >
              <span className="font-label-uppercase text-[10px] tracking-widest text-[#FFE088] font-bold">
                Clinical Apothecary Grade
              </span>
              <span className="font-headline-sm text-xl text-white">
                {isMen
                  ? 'Active Peptide Defense & Charcoal Matrix'
                  : isShop
                  ? 'Complete Dermatological Pharmacopeia'
                  : 'Dewy Translucence & Peptide Barrier Shield'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
