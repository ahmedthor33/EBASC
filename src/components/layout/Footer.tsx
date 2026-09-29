'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-[#1A1615] text-[#FDF9F4] pt-16 pb-12 border-t border-[#31302D]">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-display-brand text-[#FDF9F4] tracking-[0.16em] uppercase text-2xl font-semibold">
                EBA Skin Care
              </span>
              <span className="block font-label-uppercase text-[#C5A880] tracking-[0.25em] text-[10px] uppercase">
                Clinique Botanica • South Asia
              </span>
            </Link>
            <p className="font-body-md text-sm text-[#CDC5C3] max-w-sm leading-relaxed">
              Clinically formulated botanical skincare engineered specifically for Pakistani microclimates. Dermatologist-tested, 100% Halal, and cruelty-free.
            </p>
            <div className="pt-2 text-xs text-[#898281] space-y-1">
              <p>Clifton Block 4, Karachi • Gulberg III, Lahore • F-7/2, Islamabad</p>
              <p>Email: <a href="mailto:care@ebaskincare.pk" className="text-[#FFE088] hover:underline">care@ebaskincare.pk</a> | Tel: +92 21 3589 1234</p>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h4 className="font-label-uppercase text-xs tracking-widest text-[#C5A880] uppercase font-semibold">
              Collections
            </h4>
            <ul className="space-y-2 text-sm text-[#CDC5C3]">
              <li>
                <Link href="/women" className="hover:text-white transition-colors">Women Botanical Line</Link>
              </li>
              <li>
                <Link href="/men" className="hover:text-white transition-colors">Men Obsidian Slate</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">All Formulations</Link>
              </li>
              <li>
                <Link href="/shop?filter=bestseller" className="hover:text-white transition-colors">Best Sellers</Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="space-y-3">
            <h4 className="font-label-uppercase text-xs tracking-widest text-[#C5A880] uppercase font-semibold">
              Client Care
            </h4>
            <ul className="space-y-2 text-sm text-[#CDC5C3]">
              <li>
                <Link href="/my-account" className="hover:text-white transition-colors">Track Order & History</Link>
              </li>
              <li>
                <Link href="/return-and-refund-policy" className="hover:text-white transition-colors">Return & Refund Policy</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white transition-colors">Consultation & Contact</Link>
              </li>
            </ul>
          </div>

          {/* Local Payments & Verification */}
          <div className="space-y-4">
            <h4 className="font-label-uppercase text-xs tracking-widest text-[#C5A880] uppercase font-semibold">
              Payment Methods
            </h4>
            <p className="text-xs text-[#CDC5C3] leading-relaxed">
              Secure localized checkout verified across Pakistan.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded bg-[#31302D] text-[#F4F0EB] text-[11px] font-medium border border-white/10">
                Cash on Delivery (COD)
              </span>
              <span className="px-2.5 py-1 rounded bg-[#31302D] text-[#F4F0EB] text-[11px] font-medium border border-white/10">
                JazzCash
              </span>
              <span className="px-2.5 py-1 rounded bg-[#31302D] text-[#F4F0EB] text-[11px] font-medium border border-white/10">
                EasyPaisa
              </span>
              <span className="px-2.5 py-1 rounded bg-[#31302D] text-[#F4F0EB] text-[11px] font-medium border border-white/10">
                Bank Transfer (IBAN)
              </span>
            </div>
            <div className="text-[11px] text-[#898281] flex items-center gap-1.5 pt-1">
              <span className="material-symbols-outlined text-[15px] text-[#FFE088]">lock</span>
              <span>256-bit Encrypted Checkout</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#898281] gap-4">
          <p>© {new Date().getFullYear()} EBA Skin Care. All rights reserved. Designed for South Asian Dermatological Refinement.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/return-and-refund-policy" className="hover:text-white transition-colors">Returns</Link>
            <Link href="/contact-us" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
