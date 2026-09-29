'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // If in admin studio, do not render storefront header & footer
  if (isAdmin) {
    return <>{children}</>;
  }

  // Determine theme mode attribute
  let themeAttr = '';
  if (pathname?.startsWith('/women')) {
    themeAttr = 'women';
  } else if (pathname?.startsWith('/men')) {
    themeAttr = 'men';
  }

  return (
    <div
      data-theme={themeAttr || undefined}
      className={`min-h-screen flex flex-col justify-between ${
        themeAttr === 'women' ? 'theme-women' : themeAttr === 'men' ? 'theme-men' : ''
      }`}
    >
      <Header />
      <main className="w-full pt-28 flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
