'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ProductItem } from '@/lib/products';
import { getShippingSettings, DEFAULT_SHIPPING_SETTINGS, ShippingSettings } from '@/lib/shippingStorage';
import { getStoredCoupons } from '@/lib/couponStorage';

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: ProductItem, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(DEFAULT_SHIPPING_SETTINGS);

  // Sync dynamic shipping settings from admin storage
  useEffect(() => {
    setShippingSettings(getShippingSettings());
    const handler = () => setShippingSettings(getShippingSettings());
    window.addEventListener('eba_shipping_updated', handler);
    return () => window.removeEventListener('eba_shipping_updated', handler);
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    try {
      // Purge old mock test cart once
      const purgeKey = 'eba_cart_test_purged_v2';
      if (!localStorage.getItem(purgeKey)) {
        localStorage.removeItem('eba_cart_items');
        localStorage.setItem(purgeKey, 'true');
        setItems([]);
        setIsLoaded(true);
        return;
      }

      const saved = localStorage.getItem('eba_cart_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        setItems(Array.isArray(parsed) ? parsed : []);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('eba_cart_items', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (product: ProductItem, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
    localStorage.removeItem('eba_cart_items');
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.product.salePrice ?? item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const freeShippingThreshold = shippingSettings.freeShippingThreshold || 3500;
  const standardShippingFee = shippingSettings.standardRate ?? 250;
  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : standardShippingFee;

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();

    // Check stored / admin coupons first
    const storedCoupons = getStoredCoupons();
    const matched = storedCoupons.find((c) => c.code.toUpperCase() === clean);

    if (matched) {
      if (!matched.isActive) {
        return { success: false, message: `Coupon code "${clean}" is currently disabled.` };
      }
      if (subtotal < matched.minOrder) {
        return {
          success: false,
          message: `${clean} requires a minimum order of Rs. ${matched.minOrder.toLocaleString()}`,
        };
      }
      let disc = 0;
      if (matched.type === 'percentage') {
        disc = Math.round((subtotal * matched.value) / 100);
      } else {
        disc = Math.min(subtotal, matched.value);
      }
      const label = `${matched.code} (${matched.type === 'percentage' ? `${matched.value}% Off` : `Rs. ${matched.value} Off`})`;
      setAppliedCoupon(label);
      setCouponDiscount(disc);
      return { success: true, message: `Discount coupon ${matched.code} applied!` };
    }

    if (clean === 'EBAWELCOME') {
      const disc = Math.round(subtotal * 0.1);
      setAppliedCoupon('EBAWELCOME (10% Off)');
      setCouponDiscount(disc);
      return { success: true, message: '10% discount applied to your order!' };
    }
    if (clean === 'GLOW500') {
      if (subtotal < 3000) {
        return { success: false, message: 'GLOW500 requires minimum order of Rs. 3,000' };
      }
      setAppliedCoupon('GLOW500 (Rs. 500 Off)');
      setCouponDiscount(500);
      return { success: true, message: 'Rs. 500 discount voucher applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const totalAmount = Math.max(0, subtotal - couponDiscount + shippingFee);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        shippingFee,
        discount: couponDiscount,
        totalAmount,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
