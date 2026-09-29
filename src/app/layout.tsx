import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { StoreLayout } from '@/components/layout/StoreLayout';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <StoreLayout>{children}</StoreLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
