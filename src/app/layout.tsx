import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { StoreLayout } from '@/components/layout/StoreLayout';

import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

export const metadata: Metadata = {
  title: 'EBA Skin Care | High-Performance Luxury Skincare Pakistan',
  description:
    'Clinically proven botanical formulations engineered for South Asian climates. Dermatologically tested luxury skincare for Men and Women across Pakistan.',
  keywords: [
    'EBA Skin Care',
    'Luxury Skincare Pakistan',
    'Botanical Skincare Karachi',
    'Men Skincare Lahore',
    'Women Skincare Islamabad',
    'Cash on Delivery Skincare',
  ],
  openGraph: {
    title: 'EBA Skin Care | Bespoke Dermatologie',
    description:
      'High-performance radiance tailored for every skin. Nationwide delivery in Pakistan with Cash on Delivery, JazzCash & EasyPaisa.',
    type: 'website',
    locale: 'en_PK',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <StoreLayout>{children}</StoreLayout>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
