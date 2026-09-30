'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductItem } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
  theme?: 'women' | 'men' | 'default';
}

export function ProductCard({ product, theme = 'default' }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isLiked = isInWishlist(product.id);
  const isMenTheme = theme === 'men' || product.category === 'men';
  const isWomenTheme = theme === 'women' || product.category === 'women';

  return (
    <article
      className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ${
        isMenTheme
          ? 'bg-[#181B20] border border-[#232830] text-[#F2F2F2] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.65)]'
          : isWomenTheme
          ? 'bg-white border border-[#EED7DC] text-[#3A2A33] hover:shadow-[0_14px_34px_-10px_rgba(183,110,121,0.15)]'
          : 'bg-white border border-[#EADECF] text-[#1C1C19] hover:shadow-[0_14px_34px_-10px_rgba(26,22,21,0.08)]'
      }`}
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-[4/5] bg-black/5 overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Wishlist Heart Toggle */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 shadow-sm z-10 ${
            isMenTheme
              ? 'bg-[#14171C]/80 text-white hover:text-[#C9A96E]'
              : 'bg-white/80 text-[#1C1C19] hover:text-[#B76E79]'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked
                ? isMenTheme
                  ? 'fill-[#C9A96E] text-[#C9A96E]'
                  : 'fill-[#B76E79] text-[#B76E79]'
                : ''
            }`}
          />
        </button>

        {/* Category / Feature Badge */}
        {product.badge && (
          <div className="absolute top-3.5 left-3.5 pointer-events-none">
            <span
              className={`px-3 py-1 rounded-full font-label-uppercase text-[10px] tracking-wider font-semibold shadow-sm backdrop-blur-sm ${
                isMenTheme
                  ? 'bg-[#0F1115]/90 text-[#FFE088] border border-white/10'
                  : isWomenTheme
                  ? 'bg-[#FAF0F2]/95 text-[#3A2A33] border border-[#EED7DC]'
                  : 'bg-[#F7F3EE]/95 text-[#1C1C19] border border-[#EADECF]'
              }`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Size Pill */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span
            className={`px-2.5 py-1 rounded-md font-label-uppercase text-[10px] tracking-wider ${
              isMenTheme
                ? 'bg-[#2F4858] text-white'
                : 'bg-[#725B38] text-white'
            }`}
          >
            {product.size}
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Star Cluster */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex items-center text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]"
                />
              ))}
            </div>
            <span
              className={`font-body-sm text-[11px] ml-1 ${
                isMenTheme ? 'text-[#A5ACB8]' : 'text-[#7F7572]'
              }`}
            >
              ({product.reviewsCount} reviews)
            </span>
          </div>

          <Link href={`/product/${product.slug}`} className="block group/title">
            <h3
              className={`font-headline-sm text-lg sm:text-xl font-semibold transition-colors ${
                isMenTheme
                  ? 'text-[#F2F2F2] group-hover/title:text-[#C9A96E]'
                  : isWomenTheme
                  ? 'text-[#3A2A33] group-hover/title:text-[#B76E79]'
                  : 'text-[#1C1C19] group-hover/title:text-[#725B38]'
              }`}
            >
              {product.name}
            </h3>
          </Link>

          <p
            className={`font-body-sm text-xs font-semibold mt-1 ${
              isMenTheme ? 'text-[#6C8EAD]' : 'text-[#725B38]'
            }`}
          >
            {product.subtitle}
          </p>

          <p
            className={`font-body-sm text-xs mt-2 line-clamp-2 leading-relaxed ${
              isMenTheme ? 'text-[#A5ACB8]' : 'text-[#6E6662]'
            }`}
          >
            {product.description}
          </p>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-2 border-t border-theme/50 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-price-lg text-lg font-bold">
                Rs. {(product.salePrice ?? product.price).toLocaleString()}
              </span>
              {product.salePrice && (
                <span className="font-body-sm text-xs text-[#7F7572] line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
            </div>
            <span className="font-label-uppercase text-[10px] text-emerald-600 font-semibold tracking-wider">
              In Stock
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              className={`flex-1 h-11 rounded-full font-label-uppercase text-xs tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 ${
                isMenTheme
                  ? 'bg-white text-[#0F1115] hover:bg-[#EBE8E3]'
                  : isWomenTheme
                  ? 'bg-[#3A2A33] text-white hover:bg-[#5A434F]'
                  : 'bg-[#1A1615] text-[#FDF9F4] hover:bg-black'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag</span>
            </button>

            <Link
              href={`/product/${product.slug}`}
              aria-label="View Product Details"
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors border shadow-sm ${
                isMenTheme
                  ? 'border-[#2E3540] bg-[#14171C] text-[#F2F2F2] hover:bg-[#242A32]'
                  : 'border-[#EADECF] bg-[#F7F3EE] text-[#1C1C19] hover:bg-[#EBE8E3]'
              }`}
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
