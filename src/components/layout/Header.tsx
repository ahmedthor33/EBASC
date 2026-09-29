'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const pathname = usePathname();
  const { user, profile, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic category theme check
  const isMenCategory = pathname?.startsWith('/men');
  const isWomenCategory = pathname?.startsWith('/women');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Announcement Strip */}
      <div className="bg-[#1F1B1A] text-[#F7F3EE] px-4 sm:px-6 lg:px-12 py-2">
        <div className="max-w-[1380px] mx-auto flex flex-col md:flex-row items-center justify-between gap-y-1 font-label-uppercase text-label-uppercase text-surface-container-low text-xs">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[#FFE088] font-semibold tracking-wider">PKR Rs.</span>
            <span className="text-[#7F7572]">|</span>
            <span className="tracking-wider text-[#EBE8E3]">Karachi • Lahore • Islamabad • Nationwide</span>
          </div>

          <div className="text-center tracking-widest font-medium text-[#FDF9F4]">
            Free Nationwide Delivery on Orders Over <span className="font-semibold text-[#FFE088]">Rs. 3,500</span> | Cash on Delivery Available
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden lg:inline text-[#D1C4C1]">Client Concierge:</span>
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
      <div className="bg-[var(--surface)]/95 backdrop-blur-xl border-b border-theme shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo - Styled Text "EBA Skin Care" */}
          <Link href="/" className="flex flex-col group py-1">
            <span className="font-display-brand text-on-surface tracking-[0.16em] uppercase text-2xl lg:text-3xl font-semibold transition-transform group-hover:scale-[1.01]">
              EBA Skin Care
            </span>
            <span className="font-label-uppercase text-secondary tracking-[0.3em] text-[9px] -mt-1 uppercase">
              Bespoke Dermatologie
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-7 font-label-uppercase tracking-widest text-[11px] uppercase">
            <Link
              href="/"
              className={`transition-colors hover:text-primary ${
                pathname === '/' ? 'text-primary font-bold border-b border-secondary pb-1' : 'text-on-surface-variant'
              }`}
            >
              Home
            </Link>
            <Link
              href="/men"
              className={`transition-colors hover:text-primary ${
                isMenCategory ? 'text-[#6C8EAD] font-bold border-b border-[#6C8EAD] pb-1' : 'text-on-surface-variant'
              }`}
            >
              Men Collection
            </Link>
            <Link
              href="/women"
              className={`transition-colors hover:text-primary ${
                isWomenCategory ? 'text-[#B76E79] font-bold border-b border-[#B76E79] pb-1' : 'text-on-surface-variant'
              }`}
            >
              Women Collection
            </Link>
            <Link
              href="/shop"
              className={`transition-colors hover:text-primary ${
                pathname === '/shop' ? 'text-primary font-bold border-b border-secondary pb-1' : 'text-on-surface-variant'
              }`}
            >
              Shop Catalog
            </Link>
            <Link
              href="/about-us"
              className={`transition-colors hover:text-primary ${
                pathname === '/about-us' ? 'text-primary font-bold border-b border-secondary pb-1' : 'text-on-surface-variant'
              }`}
            >
              About Us
            </Link>
            <Link
              href="/contact-us"
              className={`transition-colors hover:text-primary ${
                pathname === '/contact-us' ? 'text-primary font-bold border-b border-secondary pb-1' : 'text-on-surface-variant'
              }`}
            >
              Contact Us
            </Link>

            {/* Quick Link to Admin Panel for Admin/Owner */}
            {isAdmin && (
              <Link
                href="/admin"
                className="px-2.5 py-1 rounded bg-[#1F1B1A] text-[#FFE088] font-semibold text-[10px] tracking-wider hover:bg-black transition-colors"
              >
                Admin Studio
              </Link>
            )}
          </nav>

          {/* Action Icons (Search, Wishlist, Cart, Account) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search */}
            <Link
              href="/shop"
              aria-label="Search"
              className="p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-black/5"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-black/5"
            >
              <span className="material-symbols-outlined text-[22px]">favorite</span>
              <span className="absolute 0.5 top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#735C00] text-white text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex items-center gap-2 p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-black/5"
            >
              <div className="relative">
                <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#1A1615] text-white text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
              </div>
              <span className="hidden md:inline font-price-md text-sm font-semibold text-on-surface">
                Rs. 2,850
              </span>
            </Link>

            <div className="h-5 w-px bg-outline-variant hidden sm:block"></div>

            {/* Account / Sign In */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/my-account"
                  className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center text-xs font-bold border border-theme">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline text-xs font-medium font-label-ui">
                    {profile?.full_name?.split(' ')[0] || 'My Account'}
                  </span>
                </Link>
                <button
                  onClick={() => signOut()}
                  title="Sign Out"
                  className="p-1 text-on-surface-variant hover:text-red-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="hidden lg:inline font-label-uppercase text-[11px] tracking-wider">
                  Sign In
                </span>
                <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-on-surface focus:outline-none"
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
          <div className="xl:hidden bg-[var(--surface)] border-t border-theme px-6 py-6 flex flex-col gap-4 animate-fade-in shadow-xl">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest text-on-surface py-2 border-b border-theme/50"
            >
              Home
            </Link>
            <Link
              href="/men"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest text-[#6C8EAD] py-2 border-b border-theme/50 flex items-center justify-between"
            >
              <span>Men Collection</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-black/10">Dark Slate</span>
            </Link>
            <Link
              href="/women"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest text-[#B76E79] py-2 border-b border-theme/50 flex items-center justify-between"
            >
              <span>Women Collection</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100/50">Rosé Plum</span>
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest text-on-surface py-2 border-b border-theme/50"
            >
              Shop Catalog
            </Link>
            <Link
              href="/about-us"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest text-on-surface py-2 border-b border-theme/50"
            >
              About Us
            </Link>
            <Link
              href="/contact-us"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-uppercase text-xs tracking-widest text-on-surface py-2 border-b border-theme/50"
            >
              Contact Us
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="font-label-uppercase text-xs tracking-widest text-[#FFE088] bg-[#1F1B1A] px-4 py-2.5 rounded-lg text-center"
              >
                Admin Dashboard Studio
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
