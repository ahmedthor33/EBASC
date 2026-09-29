'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export function Header() {
  const pathname = usePathname();
  const { user, profile, isAdmin } = useAuth();
  const { totalCount: cartCount, subtotal: cartSubtotal } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Announcement Strip */}
      <div className="bg-[#1A1615] text-[#F7F3EE] px-4 sm:px-6 lg:px-12 py-2">
        <div className="max-w-[1380px] mx-auto flex flex-col md:flex-row items-center justify-between gap-y-1 font-label-uppercase text-[11px] tracking-wider text-[#FDF9F4]">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[#FFE088] font-bold tracking-widest">PKR Rs.</span>
            <span className="text-[#7F7572]">|</span>
            <span className="tracking-widest text-[#E6E2DD]">Karachi • Lahore • Islamabad</span>
          </div>

          <div className="text-center tracking-widest font-medium text-[#FDF9F4] text-xs">
            Free Nationwide Delivery Across Pakistan on Orders Over Rs. 3,500 | Cash on Delivery Available
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden lg:inline text-[#CDC5C3]">Care:</span>
            <a
              href="tel:+922135891234"
              className="text-[#FDF9F4] hover:text-[#FFE088] transition-colors font-medium"
            >
              +92 21 3589 1234
            </a>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <div className="bg-[#FDF9F4]/95 backdrop-blur-xl border-b border-[#EADECF] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Wordmark (Stacked Two-Line Logo matching Stitch Reference Design) */}
          <Link href="/" className="flex flex-col select-none group shrink-0 leading-tight">
            <span className="font-serif text-[19px] sm:text-[21px] font-bold tracking-[0.22em] text-[#1C1C19] group-hover:text-[#725B38] transition-colors uppercase leading-[1.0]">
              EBA SKIN
            </span>
            <span className="font-serif text-[19px] sm:text-[21px] font-bold tracking-[0.22em] text-[#1C1C19] group-hover:text-[#725B38] transition-colors uppercase leading-[1.0]">
              CARE
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 font-label-uppercase text-[12px] tracking-[0.14em]">
            <Link
              href="/"
              className={`transition-colors py-1 ${
                pathname === '/' ? 'text-[#1C1C19] font-bold' : 'text-[#4E4543] hover:text-[#1C1C19] font-medium'
              }`}
            >
              Home
            </Link>
            <Link
              href="/men"
              className={`transition-colors py-1 ${
                pathname === '/men' ? 'text-[#1C1C19] font-bold' : 'text-[#4E4543] hover:text-[#1C1C19] font-medium'
              }`}
            >
              Men
            </Link>
            <Link
              href="/women"
              className={`transition-colors py-1 ${
                pathname === '/women' ? 'text-[#1C1C19] font-bold' : 'text-[#4E4543] hover:text-[#1C1C19] font-medium'
              }`}
            >
              Women
            </Link>
            <Link
              href="/shop"
              className={`transition-colors py-1 ${
                pathname === '/shop' ? 'text-[#1C1C19] font-bold' : 'text-[#4E4543] hover:text-[#1C1C19] font-medium'
              }`}
            >
              Shop
            </Link>
            <Link
              href="/#bestsellers"
              className={`transition-colors py-1 ${
                pathname?.includes('filter=best-sellers') ? 'text-[#1C1C19] font-bold' : 'text-[#4E4543] hover:text-[#1C1C19] font-medium'
              }`}
            >
              Best Sellers
            </Link>
            <Link
              href="/#rituals"
              className="text-[#4E4543] hover:text-[#1C1C19] font-medium transition-colors py-1"
            >
              Rituals
            </Link>
            <Link
              href="/contact-us"
              className={`transition-colors py-1 ${
                pathname === '/contact-us' ? 'text-[#1C1C19] font-bold' : 'text-[#4E4543] hover:text-[#1C1C19] font-medium'
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
              className="p-2 text-[#4E4543] hover:text-[#1C1C19] transition-colors rounded-full hover:bg-black/5"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-2 text-[#4E4543] hover:text-[#1C1C19] transition-colors rounded-full hover:bg-black/5"
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
              className="relative flex items-center gap-1 p-2 text-[#4E4543] hover:text-[#1C1C19] transition-colors rounded-full hover:bg-black/5"
            >
              <div className="relative flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#1A1615] text-white text-[10px] font-bold flex items-center justify-center font-label-uppercase">
                  {cartCount > 0 ? cartCount : 1}
                </span>
              </div>
              <span className="hidden sm:inline font-price-md text-sm font-semibold text-[#1C1C19] ml-1">
                Rs. {cartSubtotal > 0 ? cartSubtotal.toLocaleString() : '2,850'}
              </span>
            </Link>

            <div className="h-5 w-px bg-[#EADECF] hidden sm:block mx-1"></div>

            {/* Account / Sign In */}
            <Link
              href={user ? '/my-account' : '/sign-in'}
              className="flex items-center gap-2 text-[#4E4543] hover:text-[#1C1C19] transition-colors p-1"
              aria-label="Account"
            >
              <span className="hidden 2xl:inline font-label-uppercase text-xs tracking-wider">
                {user ? (profile?.full_name?.split(' ')[0] || 'My Account') : 'Sign In / Account'}
              </span>
              <div className="w-8 h-8 rounded-full bg-[#1A1615] text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
            </Link>

            {/* Admin discrete indicator if admin logged in */}
            {isAdmin && (
              <Link
                href="/my-account"
                title="Admin Account"
                className="hidden xl:flex items-center justify-center w-6 h-6 rounded-full bg-[#FFE088] text-[#1C1C19] text-[10px] font-bold"
              >
                ★
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1C1C19] focus:outline-none"
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
          <div className="lg:hidden bg-[#FDF9F4] border-t border-[#EADECF] px-6 py-6 flex flex-col gap-4 animate-fade-in shadow-xl">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest text-[#1C1C19] py-2 border-b border-[#EADECF]/50 font-bold"
            >
              Home
            </Link>
            <Link
              href="/men"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest text-[#1C1C19] py-2 border-b border-[#EADECF]/50"
            >
              Men Collection
            </Link>
            <Link
              href="/women"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest text-[#1C1C19] py-2 border-b border-[#EADECF]/50"
            >
              Women Collection
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest text-[#1C1C19] py-2 border-b border-[#EADECF]/50"
            >
              Shop Catalog
            </Link>
            <Link
              href="/shop?filter=best-sellers"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest text-[#1C1C19] py-2 border-b border-[#EADECF]/50"
            >
              Best Sellers
            </Link>
            <Link
              href="/#rituals"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest text-[#1C1C19] py-2 border-b border-[#EADECF]/50"
            >
              Rituals
            </Link>
            <Link
              href="/contact-us"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest text-[#1C1C19] py-2 border-b border-[#EADECF]/50"
            >
              Contact Us
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
