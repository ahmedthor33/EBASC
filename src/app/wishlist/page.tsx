'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart, X, ShoppingBag, Eye } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F7F3EE] text-[#725B38] flex items-center justify-center mx-auto mb-4 border border-[#EADECF]">
          <Heart className="w-8 h-8 text-[#725B38]" />
        </div>
        <h1 className="font-display-brand text-3xl font-semibold mb-2 text-[#1C1C19]">Your Wishlist is Empty</h1>
        <p className="font-body-md text-sm text-[#7F7572] max-w-md mx-auto mb-8 leading-relaxed">
          Save your favorite botanical elixirs, serums, and creams to easily track and order them later.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3.5 rounded-full bg-[#1A1615] text-[#FDF9F4] font-label-uppercase text-xs tracking-widest font-semibold hover:bg-black transition-all shadow-md"
        >
          Explore All Formulations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 py-10 w-full text-[#1C1C19]">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2 font-label-uppercase text-xs tracking-widest text-[#7F7572]">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-[#725B38] font-bold">Saved Formulations</span>
        </div>
        <h1 className="font-display-lg text-3xl sm:text-4xl font-semibold">
          Your Curated Wishlist ({wishlist.length})
        </h1>
        <p className="text-xs text-[#7F7572] mt-1">
          Formulations preserved for your seasonal skincare regimen.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product) => {
          const unitPrice = product.salePrice ?? product.price;
          return (
            <div
              key={product.id}
              className="bg-white border border-[#EADECF] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group"
            >
              <div className="relative aspect-[4/5] bg-[#F7F3EE] overflow-hidden">
                <Link href={`/product/${product.slug}`} className="block relative w-full h-full">
                  <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  title="Remove from wishlist"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-red-600 flex items-center justify-center shadow-sm hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-[#1A1615] text-white text-[10px] font-label-uppercase">
                  {product.size}
                </span>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                <div>
                  <h3 className="font-headline-sm text-base font-semibold">
                    <Link href={`/product/${product.slug}`} className="hover:underline">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-[#7F7572] mt-0.5 line-clamp-1">{product.subtitle}</p>
                  <div className="mt-2 font-price-lg text-base font-bold">
                    Rs. {unitPrice.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#EADECF]">
                  <button
                    type="button"
                    onClick={() => addToCart(product, 1)}
                    className="flex-1 py-2.5 rounded-full bg-[#1A1615] text-[#FDF9F4] font-label-uppercase text-[11px] font-semibold tracking-wider hover:bg-black flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                  <Link
                    href={`/product/${product.slug}`}
                    className="p-2 rounded-full border border-[#EADECF] text-xs hover:bg-[#F7F3EE] flex items-center justify-center"
                    aria-label="View product details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
