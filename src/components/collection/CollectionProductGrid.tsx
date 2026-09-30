'use client';

import React, { useState, useEffect } from 'react';
import { ProductItem, getProductsByCategory } from '@/lib/products';
import { ProductCard } from '@/components/ui/ProductCard';

interface CollectionProductGridProps {
  category: 'women' | 'men';
  initialProducts: ProductItem[];
  theme: 'women' | 'men';
}

export function CollectionProductGrid({
  category,
  initialProducts,
  theme,
}: CollectionProductGridProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);

  useEffect(() => {
    setProducts(getProductsByCategory(category));
    const handler = () => setProducts(getProductsByCategory(category));
    window.addEventListener('eba_products_updated', handler);
    return () => window.removeEventListener('eba_products_updated', handler);
  }, [category]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} theme={theme} />
      ))}
    </div>
  );
}
