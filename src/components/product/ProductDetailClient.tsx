'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProductBySlug, PRODUCTS } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Minus, Plus, ShoppingBag, CheckCircle2, Truck, CreditCard, ShieldCheck, RotateCcw, Heart, Star } from 'lucide-react';

export default function ProductDetailClient({ initialSlug }: { initialSlug?: string }) {
  const params = useParams();
  const slug = (initialSlug || params?.slug) as string;
  const product = getProductBySlug(slug) || PRODUCTS[0];

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'howToUse' | 'reviews'>('benefits');
  const [addedToast, setAddedToast] = useState(false);

  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isLiked = isInWishlist(product.id);
  const isMen = product.category === 'men';

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewName('');
      setReviewComment('');
    }, 1500);
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  return (
    <div className={`w-full pb-24 ${isMen ? 'bg-[#0F1115] text-[#F2F2F2]' : 'bg-[#FDF9F4] text-[#1C1C19]'}`}>
      
      {/* Breadcrumb Navigation */}
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 pb-4">
        <div className="flex items-center gap-2 font-label-uppercase text-xs tracking-widest text-[#7F7572]">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black">Shop</Link>
          <span>/</span>
          <Link href={`/${product.category}`} className="hover:text-black capitalize">
            {product.category} Line
          </Link>
          <span>/</span>
          <span className="text-[#725B38] font-bold truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 pt-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Product Image Vessel */}
          <div className="lg:col-span-6 sticky top-28">
            <div className={`relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border ${
              isMen ? 'bg-[#181B20] border-[#232830]' : 'bg-white border-[#EADECF]'
            }`}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              {product.badge && (
                <span className={`absolute top-6 left-6 px-3.5 py-1.5 rounded-full font-label-uppercase text-xs tracking-wider font-semibold shadow-md ${
                  isMen ? 'bg-[#0F1115]/90 text-[#FFE088]' : 'bg-[#3A2A33] text-white'
                }`}>
                  {product.badge}
                </span>
              )}

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label="Wishlist"
                className={`absolute top-6 right-6 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md active:scale-90 ${
                  isMen ? 'bg-[#14171C]/90 text-white hover:text-[#C9A96E]' : 'bg-white/90 text-[#1C1C19] hover:text-[#B76E79]'
                }`}
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isLiked
                      ? isMen
                        ? 'fill-[#C9A96E] text-[#C9A96E]'
                        : 'fill-[#B76E79] text-[#B76E79]'
                      : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Right Column: Formulation Attributes & Order Desk */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]"
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold">({product.reviewsCount} verified reviews)</span>
                <span className="text-outline-variant">•</span>
                <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">In Stock & Verified</span>
              </div>

              <h1 className="font-display-lg text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                {product.name}
              </h1>

              <p className={`font-headline-sm text-base sm:text-lg font-medium mt-1 ${isMen ? 'text-[#6C8EAD]' : 'text-[#725B38]'}`}>
                {product.subtitle}
              </p>
            </div>

            {/* Pricing Section */}
            <div className={`p-5 rounded-2xl border flex items-center justify-between ${
              isMen ? 'bg-[#14171C] border-[#232830]' : 'bg-[#F7F3EE] border-[#EADECF]'
            }`}>
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-price-lg text-2xl sm:text-3xl font-bold">
                    Rs. {(product.salePrice ?? product.price).toLocaleString()}
                  </span>
                  {product.salePrice && (
                    <span className="font-price-md text-base text-[#7F7572] line-through">
                      Rs. {product.price.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="font-body-sm text-[11px] text-[#7F7572] mt-0.5">
                  Taxes included • Free shipping across Pakistan on orders over Rs. 3,500
                </p>
              </div>

              <span className={`px-3 py-1 rounded-md text-xs font-label-uppercase tracking-wider font-semibold ${
                isMen ? 'bg-[#2F4858] text-white' : 'bg-[#725B38] text-white'
              }`}>
                {product.size}
              </span>
            </div>

            {/* Formulation Description */}
            <p className={`text-sm sm:text-base leading-relaxed ${isMen ? 'text-[#A5ACB8]' : 'text-[#4E4543]'}`}>
              {product.description}
            </p>

            {/* Active Matrix Highlight Box */}
            {product.activeMatrix && (
              <div className={`p-4 rounded-xl border text-xs space-y-1 ${
                isMen ? 'bg-[#14171C] border-[#232830]' : 'bg-white border-[#EADECF]'
              }`}>
                <span className={`font-label-uppercase text-[10px] tracking-wider font-bold block ${
                  isMen ? 'text-[#C9A96E]' : 'text-[#725B38]'
                }`}>
                  Bio-Active Formulation Matrix:
                </span>
                <span className="font-medium">{product.activeMatrix}</span>
              </div>
            )}

            {/* Quantity Selector & Add to Bag */}
            <div className="pt-2 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Stepper */}
                <div className={`flex items-center justify-between border rounded-full px-4 py-2 w-full sm:w-36 ${
                  isMen ? 'border-[#2E3540] bg-[#14171C]' : 'border-[#EADECF] bg-white'
                }`}>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:text-[#C5A880] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-price-md font-semibold text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:text-[#C5A880] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 px-8 rounded-full font-label-uppercase text-xs tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 ${
                    isMen
                      ? 'bg-white text-[#0F1115] hover:bg-[#EBE8E3]'
                      : 'bg-[#1A1615] text-[#FDF9F4] hover:bg-black'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • Rs. {((product.salePrice ?? product.price) * quantity).toLocaleString()}</span>
                </button>
              </div>

              {addedToast && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Added <strong>{product.name}</strong> to your bag!</span>
                  </div>
                  <Link href="/cart" className="underline font-semibold hover:text-black">
                    View Bag & Checkout
                  </Link>
                </div>
              )}
            </div>

            {/* Local Trust Badges */}
            <div className={`p-4 rounded-2xl border grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs ${
              isMen ? 'bg-[#14171C] border-[#232830]' : 'bg-white border-[#EADECF]'
            }`}>
              <div className="flex flex-col items-center">
                <Truck className="w-5 h-5 text-[#725B38] mb-1.5" />
                <p className="font-semibold text-[11px]">Free Shipping</p>
                <p className="text-[10px] text-[#7F7572]">Orders &gt; Rs. 3,500</p>
              </div>
              <div className="flex flex-col items-center">
                <CreditCard className="w-5 h-5 text-[#725B38] mb-1.5" />
                <p className="font-semibold text-[11px]">Cash on Delivery</p>
                <p className="text-[10px] text-[#7F7572]">Nationwide Pakistan</p>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-[#725B38] mb-1.5" />
                <p className="font-semibold text-[11px]">100% Halal</p>
                <p className="text-[10px] text-[#7F7572]">Alcohol-Free</p>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-5 h-5 text-[#725B38] mb-1.5" />
                <p className="font-semibold text-[11px]">Easy Returns</p>
                <p className="text-[10px] text-[#7F7572]">7-Day Guarantee</p>
              </div>
            </div>

            {/* Deep Tabs: Benefits | How to Use | Reviews */}
            <div className="pt-6 border-t border-theme">
              <div className="flex gap-6 border-b border-theme pb-2 mb-6 font-label-uppercase text-xs tracking-widest uppercase">
                <button
                  onClick={() => setActiveTab('benefits')}
                  className={`pb-2 transition-colors relative font-semibold ${
                    activeTab === 'benefits' ? (isMen ? 'text-white' : 'text-[#1C1C19]') : 'text-[#7F7572]'
                  }`}
                >
                  Clinical Benefits
                  {activeTab === 'benefits' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A880]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('howToUse')}
                  className={`pb-2 transition-colors relative font-semibold ${
                    activeTab === 'howToUse' ? (isMen ? 'text-white' : 'text-[#1C1C19]') : 'text-[#7F7572]'
                  }`}
                >
                  Application Ritual
                  {activeTab === 'howToUse' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A880]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 transition-colors relative font-semibold ${
                    activeTab === 'reviews' ? (isMen ? 'text-white' : 'text-[#1C1C19]') : 'text-[#7F7572]'
                  }`}
                >
                  Client Reviews ({product.reviewsCount})
                  {activeTab === 'reviews' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A880]" />
                  )}
                </button>
              </div>

              {activeTab === 'benefits' && (
                <ul className="space-y-2.5 text-sm">
                  {product.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#725B38] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'howToUse' && (
                <div className="space-y-3 text-sm leading-relaxed">
                  <p>{product.howToUse}</p>
                  <p className="text-xs text-[#7F7572]">
                    *For optimal outcomes, store in a cool, dry place away from direct solar radiation. Patch test recommended prior to first ritual.
                  </p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Review Submission Form */}
                  <div className={`p-5 rounded-2xl border ${
                    isMen ? 'bg-[#181B20] border-[#232830]' : 'bg-white border-[#EADECF]'
                  }`}>
                    <h4 className="font-display-brand text-base font-semibold mb-2">Write a Client Review</h4>
                    <p className="text-xs text-[#7F7572] mb-4">
                      Share your experience with this formulation. Reviews undergo administrative moderation before public display.
                    </p>

                    {reviewSubmitted ? (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                        Thank you! Your verified review has been submitted for administrative approval.
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wider">Your Name</label>
                            <input
                              type="text"
                              required
                              value={reviewName}
                              onChange={(e) => setReviewName(e.target.value)}
                              placeholder="e.g. Fatima Zahra"
                              className={`w-full px-3 py-2 rounded-lg text-xs border ${
                                isMen ? 'bg-[#14171C] border-[#2E3540] text-white' : 'bg-[#FDF9F4] border-[#EADECF] text-[#1C1C19]'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wider">Rating</label>
                            <select
                              value={reviewRating}
                              onChange={(e) => setReviewRating(Number(e.target.value))}
                              className={`w-full px-3 py-2 rounded-lg text-xs border ${
                                isMen ? 'bg-[#14171C] border-[#2E3540] text-white' : 'bg-[#FDF9F4] border-[#EADECF] text-[#1C1C19]'
                              }`}
                            >
                              <option value="5">★★★★★ (5 Stars - Exceptional)</option>
                              <option value="4">★★★★☆ (4 Stars - Highly Pleased)</option>
                              <option value="3">★★★☆☆ (3 Stars - Satisfactory)</option>
                              <option value="2">★★☆☆☆ (2 Stars - Mediocre)</option>
                              <option value="1">★☆☆☆☆ (1 Star - Disappointed)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wider">Your Review</label>
                          <textarea
                            required
                            rows={3}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Describe how your skin responded to this formulation..."
                            className={`w-full px-3 py-2 rounded-lg text-xs border ${
                              isMen ? 'bg-[#14171C] border-[#2E3540] text-white' : 'bg-[#FDF9F4] border-[#EADECF] text-[#1C1C19]'
                            }`}
                          />
                        </div>

                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-full bg-[#1A1615] text-[#FDF9F4] font-label-uppercase text-xs tracking-wider font-semibold hover:bg-black"
                        >
                          Submit for Moderation
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Related Formulations */}
      {relatedProducts.length > 0 && (
        <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 pt-12 border-t border-theme">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display-brand text-2xl font-semibold">
              Complete the Ritual
            </h2>
            <Link href={`/${product.category}`} className="text-xs font-label-ui hover:underline">
              View {product.categoryName}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl border bg-white/5 border-theme">
                <Link href={`/product/${p.slug}`} className="block relative aspect-square rounded-xl overflow-hidden mb-3">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </Link>
                <h4 className="font-headline-sm text-base font-semibold">{p.name}</h4>
                <p className="text-xs text-[#7F7572] mt-0.5">{p.subtitle}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-price-md text-sm font-bold">Rs. {(p.salePrice ?? p.price).toLocaleString()}</span>
                  <Link
                    href={`/product/${p.slug}`}
                    className="px-3 py-1.5 rounded-full border border-theme text-xs font-label-ui hover:bg-black/5"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
