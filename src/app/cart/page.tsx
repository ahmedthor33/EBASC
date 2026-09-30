'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, Lock, Trash2, Plus, Minus, ShoppingBag, Truck } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    discount,
    totalAmount,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMessage({ success: res.success, text: res.message });
  };

  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F7F3EE] text-[#725B38] flex items-center justify-center mx-auto mb-4 border border-[#EADECF]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-display-brand text-3xl font-semibold mb-2 text-[#1C1C19]">Your Bag is Empty</h1>
        <p className="font-body-md text-sm text-[#7F7572] max-w-md mx-auto mb-8 leading-relaxed">
          Your botanical curation awaits. Explore our calibrated collections for Women and Men to start your ritual.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/shop"
            className="px-8 py-3.5 rounded-full bg-[#1A1615] text-[#FDF9F4] font-label-uppercase text-xs tracking-widest font-semibold hover:bg-black transition-all shadow-md"
          >
            Explore All Formulations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 py-10 w-full">
      {/* Page Title & Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2 font-label-uppercase text-xs tracking-widest text-[#7F7572]">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-[#725B38] font-bold">Shopping Bag</span>
        </div>
        <h1 className="font-display-lg text-3xl sm:text-4xl text-[#1C1C19] font-semibold">
          Your Bespoke Selection
        </h1>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F3EE] border border-[#EADECF] mb-8">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2 font-semibold text-[#1C1C19]">
            <Truck className="w-4 h-4 text-[#725B38] shrink-0" />
            {amountNeededForFreeShipping === 0 ? (
              <span className="text-emerald-700">Congratulations! You unlocked Complimentary Nationwide Shipping.</span>
            ) : (
              <span>
                Add <strong className="text-[#725B38]">Rs. {amountNeededForFreeShipping.toLocaleString()}</strong> more to unlock Free Nationwide Delivery
              </span>
            )}
          </div>
          <span className="font-label-uppercase text-[11px] text-[#7F7572] font-semibold">
            {freeShippingPercent}%
          </span>
        </div>
        <div className="w-full h-2 bg-[#EADECF] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#725B38] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${freeShippingPercent}%` }}
          />
        </div>
      </div>

      {/* Grid: Cart Items List + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Items */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EADECF] pb-3 text-xs font-label-uppercase tracking-wider text-[#7F7572]">
            <span>Formulation</span>
            <span>Quantity / Total</span>
          </div>

          {items.map(({ product, quantity }) => {
            const unitPrice = product.salePrice ?? product.price;
            return (
              <div
                key={product.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EADECF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#F7F3EE] shrink-0 border border-[#EADECF]">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="font-label-uppercase text-[10px] text-[#725B38] font-bold tracking-wider">
                      {product.size}
                    </span>
                    <h3 className="font-headline-sm text-base sm:text-lg font-semibold text-[#1C1C19]">
                      <Link href={`/product/${product.slug}`} className="hover:underline">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#7F7572] mt-0.5">{product.subtitle}</p>
                    <p className="font-price-md text-sm font-semibold text-[#1C1C19] mt-2">
                      Rs. {unitPrice.toLocaleString()}{' '}
                      <span className="text-[11px] font-normal text-[#7F7572]">each</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-0 border-[#EADECF]">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#EADECF] rounded-full px-3 py-1 bg-[#FDF9F4]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1 hover:text-[#C5A880] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-semibold text-xs">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1 hover:text-[#C5A880] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[90px]">
                    <div className="font-price-lg text-base font-bold text-[#1C1C19]">
                      Rs. {(unitPrice * quantity).toLocaleString()}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="text-[11px] text-red-600 hover:underline flex items-center gap-1 justify-end mt-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/shop"
              className="text-xs font-label-ui text-[#725B38] hover:underline flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Formulations Shopping</span>
            </Link>

            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-label-ui text-[#7F7572] hover:text-red-600 transition-colors"
            >
              Clear Bag
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADECF] shadow-lg space-y-6">
            <h2 className="font-display-brand text-xl font-semibold text-[#1C1C19]">Order Summary</h2>

            {/* Price Breakdown */}
            <div className="space-y-3 text-sm border-b border-[#EADECF] pb-4">
              <div className="flex items-center justify-between text-[#4E4543]">
                <span>Formulations Subtotal</span>
                <span className="font-semibold text-[#1C1C19]">Rs. {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-[#4E4543]">
                <div className="flex items-center gap-1">
                  <span>Shipping Fee</span>
                  <span className="text-[10px] text-[#7F7572]">(Pakistan)</span>
                </div>
                {shippingFee === 0 ? (
                  <span className="text-emerald-700 font-semibold uppercase text-xs">FREE</span>
                ) : (
                  <span className="font-semibold text-[#1C1C19]">Rs. {shippingFee.toLocaleString()}</span>
                )}
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-800">
                  <div className="flex items-center gap-1">
                    <span>Voucher Discount</span>
                    <button onClick={removeCoupon} className="text-[11px] underline text-red-600">
                      (Remove)
                    </button>
                  </div>
                  <span className="font-semibold">- Rs. {discount.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="font-display-brand text-xl font-bold text-[#1C1C19]">Estimated Total</span>
                <p className="text-[11px] text-[#7F7572]">PKR (All Taxes Included)</p>
              </div>
              <span className="font-price-lg text-2xl font-bold text-[#1C1C19]">
                Rs. {totalAmount.toLocaleString()}
              </span>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="pt-2">
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider text-[#1C1C19]">
                Promo Voucher or Coupon
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. EBAWELCOME"
                  className="flex-1 px-3.5 py-2 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-xs uppercase focus:outline-none focus:border-[#C5A880]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F7F3EE] hover:bg-[#EBE8E3] border border-[#EADECF] rounded-lg text-xs font-semibold font-label-ui transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className={`text-xs mt-2 ${couponMessage.success ? 'text-emerald-700' : 'text-red-600'}`}>
                  {couponMessage.text}
                </p>
              )}
              {appliedCoupon && (
                <div className="mt-2 text-xs text-emerald-700 flex items-center justify-between bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <span>Active: <strong>{appliedCoupon}</strong></span>
                  <button onClick={removeCoupon} className="text-red-600 underline text-[11px]">Remove</button>
                </div>
              )}
            </form>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full py-4 rounded-full bg-[#1A1615] text-[#FDF9F4] font-label-uppercase text-xs tracking-widest font-semibold hover:bg-black transition-all shadow-md flex items-center justify-center"
            >
              <span>Proceed to Checkout</span>
            </Link>

            {/* Trust Badges in Drawer */}
            <div className="pt-3 border-t border-[#EADECF] space-y-2 text-xs text-[#7F7572]">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                <span>256-bit Bank Grade Encrypted Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#725B38]" />
                <span>Cash on Delivery & Raast Instant Transfer</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
