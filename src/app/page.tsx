import { Metadata } from 'next';
import { HomeClient } from '@/components/home/HomeClient';

export const metadata: Metadata = {
  title: 'EBA Skin Care | High-Performance Radiance, Tailored for Every Skin',
  description:
    'Clinically proven botanical formulations engineered for South Asian climates. Dermatologically tested, cruelty-free, and meticulously calibrated for Men and Women across Pakistan.',
  keywords: [
    'EBA Skin Care',
    'Skincare Pakistan',
    'Luxury Skincare',
    'Niacinamide Serum Pakistan',
    'Halal Skincare Pakistan',
    'Men Skincare Pakistan',
    'Women Skincare Karachi Lahore Islamabad',
  ],
  openGraph: {
    title: 'EBA Skin Care | High-Performance Radiance for South Asian Skin',
    description:
      'Engineered for humidity, urban heat, and melanin profiles across Pakistan. Halal-certified and cruelty-free.',
    url: 'https://ebaskincare.pk',
    siteName: 'EBA Skin Care',
    locale: 'en_PK',
    type: 'website',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
