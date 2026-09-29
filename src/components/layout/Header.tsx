'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { BrandLogo } from '@/components/ui/BrandLogo';

export function Header() {
  const pathname = usePathname();
  const { user, profile, isAdmin } = useAuth();
  const { totalCount: cartCount, subtotal: cartSubtotal } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if current route is a dark-theme page (e.g. Men Collection)
  const isDarkPage = pathname?.startsWith('/men');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Announcement Strip */}
      <div
        className={`px-4 sm:px-6 lg:px-12 py-2 transition-colors duration-300 ${
          isDarkPage ? 'bg-[#0A0C0E] text-[#E6E2DD]' : 'bg-[#1A1615] text-[#F7F3EE]'
        }`}
      >
        <div className="max-w-[1380px] mx-auto flex flex-col md:flex-row items-center justify-between gap-y-1 font-label-uppercase text-[11px] tracking-wider">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[#FFE088] font-bold tracking-widest">PKR Rs.</span>
            <span className="text-[#7F7572]">|</span>
            <span className="tracking-widest text-[#E6E2DD]">Karachi • Lahore • Islamabad</span>
          </div>

          <div className="text-center tracking-widest font-medium text-xs">
            Free Nationwide Delivery Across Pakistan on Orders Over Rs. 3,500 | Cash on Delivery Available
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden lg:inline text-[#CDC5C3]">Care:</span>
            <a
              href="tel:+922135891234"
              className="hover:text-[#FFE088] transition-colors font-medium"
            >
              +92 21 3589 1234
            </a>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <div
        className={`backdrop-blur-xl border-b shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-colors duration-300 ${
          isDarkPage
            ? 'bg-[#14171C]/95 border-[#232830] text-[#F2F2F2]'
            : 'bg-[#FDF9F4]/95 border-[#EADECF] text-[#1C1C19]'
        }`}
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo with Gold Monogram and Refined Serif Wordmark */}
          <BrandLogo
            variant={isDarkPage ? 'dark' : 'light'}
            size="md"
            href="/"
          />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 font-label-uppercase text-[12px] tracking-[0.14em]">
            <Link
              href="/"
              className={`transition-colors py-1 ${
                pathname === '/'
                  ? isDarkPage
                    ? 'text-white font-bold'
                    : 'text-[#1C1C19] font-bold'
                  : isDarkPage
                  ? 'text-[#A5ACB8] hover:text-white font-medium'
                  : 'text-[#4E4543] hover:text-[#1C1C19] font-medium'
              }`}
            >
              Home
            </Link>
            <Link
              href="/men"
              className={`transition-colors py-1 ${
                pathname === '/men'
                  ? isDarkPage
                    ? 'text-white font-bold'
                    : 'text-[#1C1C19] font-bold'
                  : isDarkPage
                  ? 'text-[#A5ACB8] hover:text-white font-medium'
                  : 'text-[#4E4543] hover:text-[#1C1C19] font-medium'
              }`}
            >
              Men
            </Link>
            <Link
              href="/women"
              className={`transition-colors py-1 ${
                pathname === '/women'
                  ? isDarkPage
                    ? 'text-white font-bold'
                    : 'text-[#1C1C19] font-bold'
                  : isDarkPage
                  ? 'text-[#A5ACB8] hover:text-white font-medium'
                  : 'text-[#4E4543] hover:text-[#1C1C19] font-medium'
              }`}
            >
              Women
            </Link>
            <Link
              href="/shop"
              className={`transition-colors py-1 ${
                pathname === '/shop'
                  ? isDarkPage
                    ? 'text-white font-bold'
                    : 'text-[#1C1C19] font-bold'
                  : isDarkPage
                  ? 'text-[#A5ACB8] hover:text-white font-medium'
                  : 'text-[#4E4543] hover:text-[#1C1C19] font-medium'
              }`}
            >
              Shop
            </Link>
            <Link
              href="/#bestsellers"
              className={`transition-colors py-1 ${
                pathname?.includes('filter=best-sellers')
                  ? isDarkPage
                    ? 'text-white font-bold'
                    : 'text-[#1C1C19] font-bold'
                  : isDarkPage
                  ? 'text-[#A5ACB8] hover:text-white font-medium'
                  : 'text-[#4E4543] hover:text-[#1C1C19] font-medium'
              }`}
            >
              Best Sellers
            </Link>
            <Link
              href="/#rituals"
              className={`transition-colors py-1 ${
                isDarkPage
                  ? 'text-[#A5ACB8] hover:text-white font-medium'
                  : 'text-[#4E4543] hover:text-[#1C1C19] font-medium'
              }`}
            >
              Rituals
            </Link>
            <Link
              href="/contact-us"
              className={`transition-colors py-1 ${
                pathname === '/contact-us'
                  ? isDarkPage
                    ? 'text-white font-bold'
                    : 'text-[#1C1C19] font-bold'
                  : isDarkPage
                  ? 'text-[#A5ACB8] hover:text-white font-medium'
                  : 'text-[#4E4543] hover:text-[#1C1C19] font-medium'
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Action Icons (Search, Wishlist, Cart, Account) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Search */}
            <Link
              href="/shop"
              aria-label="Search"
              className={`p-2 transition-colors rounded-full hover:bg-black/5 ${
                isDarkPage
                  ? 'text-[#BAC2CE] hover:text-white hover:bg-white/10'
                  : 'text-[#4E4543] hover:text-[#1C1C19]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className={`relative p-2 transition-colors rounded-full hover:bg-black/5 ${
                isDarkPage
                  ? 'text-[#BAC2CE] hover:text-white hover:bg-white/10'
                  : 'text-[#4E4543] hover:text-[#1C1C19]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">favorite</span>
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#735C00] text-white text-[10px] font-bold flex items-center justify-center font-label-uppercase">
                {wishlistCount > 0 ? wishlistCount : 2}
              </span>
            </Link>

            {/* Cart with Price Pill */}
            <Link
              href="/cart"
              aria-label="Cart"
              className={`relative flex items-center gap-1 p-2 transition-colors rounded-full hover:bg-black/5 ${
                isDarkPage
                  ? 'text-[#BAC2CE] hover:text-white hover:bg-white/10'
                  : 'text-[#4E4543] hover:text-[#1C1C19]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                <span
                  className={`absolute -top-1 -right-1.5 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center font-label-uppercase ${
                    isDarkPage ? 'bg-[#FFE088] text-[#1C1C19]' : 'bg-[#1A1615] text-white'
                  }`}
                >
                  {cartCount > 0 ? cartCount : 1}
                </span>
              </div>
              <span
                className={`hidden sm:inline font-price-md text-sm font-semibold ml-1 ${
                  isDarkPage ? 'text-white' : 'text-[#1C1C19]'
                }`}
              >
                Rs. {cartSubtotal > 0 ? cartSubtotal.toLocaleString() : '2,850'}
              </span>
            </Link>

            <div
              className={`h-5 w-px hidden sm:block mx-1 ${
                isDarkPage ? 'bg-[#2E3540]' : 'bg-[#EADECF]'
              }`}
            ></div>

            {/* Account / Sign In */}
            <Link
              href={user ? '/my-account' : '/sign-in'}
              className={`flex items-center gap-2 transition-colors p-1 ${
                isDarkPage
                  ? 'text-[#BAC2CE] hover:text-white'
                  : 'text-[#4E4543] hover:text-[#1C1C19]'
              }`}
              aria-label="Account"
            >
              <span className="hidden 2xl:inline font-label-uppercase text-xs tracking-wider">
                {user ? profile?.full_name?.split(' ')[0] || 'My Account' : 'Sign In / Account'}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border ${
                  isDarkPage
                    ? 'bg-[#1C2026] text-white border-[#C9A96E]/50'
                    : 'bg-[#1A1615] text-white border-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
            </Link>

            {/* Admin discrete indicator if admin logged in */}
            {isAdmin && (
              <Link
                href="/admin"
                title="Admin Dashboard"
                className="hidden xl:flex items-center justify-center w-6 h-6 rounded-full bg-[#FFE088] text-[#1C1C19] text-[10px] font-bold shadow-sm"
              >
                ★
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 focus:outline-none ${
                isDarkPage ? 'text-white' : 'text-[#1C1C19]'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-[26px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t px-6 py-6 flex flex-col gap-4 animate-fade-in shadow-xl ${
              isDarkPage
                ? 'bg-[#14171C] border-[#232830] text-white'
                : 'bg-[#FDF9F4] border-[#EADECF] text-[#1C1C19]'
            }`}
          >
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest py-2 border-b border-current/10 font-bold"
            >
              Home
            </Link>
            <Link
              href="/men"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest py-2 border-b border-current/10"
            >
              Men Collection
            </Link>
            <Link
              href="/women"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest py-2 border-b border-current/10"
            >
              Women Collection
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest py-2 border-b border-current/10"
            >
              Shop Catalog
            </Link>
            <Link
              href="/#bestsellers"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest py-2 border-b border-current/10"
            >
              Best Sellers
            </Link>
            <Link
              href="/#rituals"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest py-2 border-b border-current/10"
            >
              Rituals
            </Link>
            <Link
              href="/contact-us"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest py-2 border-b border-current/10"
            >
              Contact Us
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="font-label-uppercase text-xs tracking-widest py-2 text-[#FFE088] font-bold"
              >
                ★ Admin Studio
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

