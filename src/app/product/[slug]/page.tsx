import ProductDetailClient from '@/components/product/ProductDetailClient';
import { PRODUCTS } from '@/lib/products';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailClient initialSlug={slug} />;
}
