'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Truck, ShieldCheck } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const isDarkPage = pathname?.startsWith('/men');

  return (
    <footer
      className={`w-full border-t transition-colors duration-300 ${
        isDarkPage
          ? 'bg-[#14171C] border-[#232830] text-[#F2F2F2]'
          : 'bg-[#F7F3EE] border-[#EADECF] text-[#1C1C19]'
      }`}
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <BrandLogo
              variant={isDarkPage ? 'dark' : 'light'}
              size="lg"
              showTagline
              taglineText="LUXURY BOTANICALS • PAKISTAN"
              href="/"
            />

            <p
              className={`font-body-md text-xs sm:text-sm leading-relaxed ${
                isDarkPage ? 'text-[#BAC2CE]' : 'text-[#4E4543]'
              }`}
            >
              Clinically formulated luxury skincare crafted for South Asian skin types and climates. Halal-certified, cruelty-free, and dermatologically tested.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span
                className={`px-3 py-1 rounded-full font-label-uppercase text-[10px] tracking-wider font-semibold border ${
                  isDarkPage
                    ? 'bg-[#1C2026] text-[#FFE088] border-[#2D343E]'
                    : 'bg-[#EBE8E3] text-[#1C1C19] border-[#EADECF]'
                }`}
              >
                Halal Certified
              </span>
              <span
                className={`px-3 py-1 rounded-full font-label-uppercase text-[10px] tracking-wider font-semibold border ${
                  isDarkPage
                    ? 'bg-[#1C2026] text-[#FFE088] border-[#2D343E]'
                    : 'bg-[#EBE8E3] text-[#1C1C19] border-[#EADECF]'
                }`}
              >
                Cruelty Free
              </span>
              <span
                className={`px-3 py-1 rounded-full font-label-uppercase text-[10px] tracking-wider font-semibold border ${
                  isDarkPage
                    ? 'bg-[#1C2026] text-[#FFE088] border-[#2D343E]'
                    : 'bg-[#EBE8E3] text-[#1C1C19] border-[#EADECF]'
                }`}
              >
                Derm Tested
              </span>
            </div>
          </div>

          {/* Collections Column */}
          <div className="space-y-4">
            <h3 className="font-headline-sm text-base font-semibold text-[#1C1C19]">
              Collections
            </h3>
            <ul className="space-y-2.5 font-body-md text-xs sm:text-sm text-[#4E4543]">
              <li>
                <Link href="/men" className="hover:text-[#1C1C19] transition-colors">
                  Men's Charcoal Face Wash
                </Link>
              </li>
              <li>
                <Link href="/men" className="hover:text-[#1C1C19] transition-colors">
                  Men's Cellular Night Recovery
                </Link>
              </li>
              <li>
                <Link href="/women" className="hover:text-[#1C1C19] transition-colors">
                  Women's Gentle Milk Cleanser
                </Link>
              </li>
              <li>
                <Link href="/women" className="hover:text-[#1C1C19] transition-colors">
                  Women's Glow Radiance Serum
                </Link>
              </li>
              <li>
                <Link href="/women" className="hover:text-[#1C1C19] transition-colors">
                  Advanced Whitening Elixir Cream
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#1C1C19] transition-colors">
                  Curated Gift Sets
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=best-sellers" className="hover:text-[#1C1C19] transition-colors">
                  Pakistan Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="space-y-4">
            <h3 className="font-headline-sm text-base font-semibold text-[#1C1C19]">
              Customer Care
            </h3>
            <ul className="space-y-2.5 font-body-md text-xs sm:text-sm text-[#4E4543]">
              <li>
                <Link href="/my-account" className="hover:text-[#1C1C19] transition-colors flex items-center justify-between">
                  <span>Track Your Order (TCS / Leopard)</span>
                  <Truck className="w-4 h-4 text-[#725B38]" />
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#1C1C19] transition-colors">
                  Shipping &amp; Delivery (Pakistan)
                </Link>
              </li>
              <li>
                <Link href="/return-and-refund-policy" className="hover:text-[#1C1C19] transition-colors">
                  Return &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#1C1C19] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-[#1C1C19] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-[#1C1C19] transition-colors">
                  Contact Our Skin Specialists
                </Link>
              </li>
            </ul>
          </div>

          {/* EBA Privilege Club Column */}
          <div className="space-y-4">
            <h3 className="font-headline-sm text-base font-semibold text-[#1C1C19]">
              EBA Privilege Club
            </h3>
            <p className="font-body-md text-xs sm:text-sm text-[#4E4543] leading-relaxed">
              Receive sensorial invitations, clinical skincare insights, and seasonal privileges across Pakistan.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to EBA Privilege Club!');
              }}
              className="space-y-2.5"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="w-full h-11 px-4 bg-white text-xs text-[#1C1C19] rounded-lg border border-[#EADECF] focus:outline-none focus:border-[#C5A880]"
              />
              <button
                type="submit"
                className="w-full h-11 rounded-full bg-[#1A1615] text-[#FDF9F4] font-label-uppercase text-xs tracking-widest font-semibold hover:bg-black transition-all shadow-sm"
              >
                Subscribe to Privilege
              </button>
            </form>
            <div className="flex items-center gap-1.5 pt-1 text-xs text-[#4E4543]">
              <ShieldCheck className="w-4 h-4 text-[#725B38]" />
              <span>Direct Helpline: +92 21 3589 1234</span>
            </div>
          </div>

        </div>

        {/* Bottom Payment Strip & Copyright */}
        <div className="mt-14 pt-8 border-t border-[#EADECF] flex flex-col md:flex-row items-center justify-between gap-4 bg-[#F1EDE8]/60 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="font-label-uppercase text-xs tracking-wider text-[#4E4543] font-semibold">
              Trusted Payment Partners:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-2.5 py-1 rounded bg-white text-[#1C1C19] font-label-uppercase text-[10px] font-semibold tracking-wider shadow-sm border border-[#EADECF]">
                Cash on Delivery (COD)
              </span>
              <span className="px-2.5 py-1 rounded bg-white text-[#1C1C19] font-label-uppercase text-[10px] font-semibold tracking-wider shadow-sm border border-[#EADECF]">
                JazzCash
              </span>
              <span className="px-2.5 py-1 rounded bg-white text-[#1C1C19] font-label-uppercase text-[10px] font-semibold tracking-wider shadow-sm border border-[#EADECF]">
                EasyPaisa
              </span>
              <span className="px-2.5 py-1 rounded bg-white text-[#1C1C19] font-label-uppercase text-[10px] font-semibold tracking-wider shadow-sm border border-[#EADECF]">
                Bank Transfer / 1LINK
              </span>
              <span className="px-2.5 py-1 rounded bg-white text-[#1C1C19] font-label-uppercase text-[10px] font-semibold tracking-wider shadow-sm border border-[#EADECF]">
                Visa / Mastercard
              </span>
            </div>
          </div>

          <div className="font-label-uppercase text-[11px] text-[#7F7572] tracking-wider text-center md:text-right">
            © 2026 EBA Skin Care Pakistan. All Rights Reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
