'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ProductItem } from '@/lib/products';

interface WishlistContextType {
  wishlist: ProductItem[];
  toggleWishlist: (product: ProductItem) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<ProductItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      // Purge old mock test items once
      const purgeKey = 'eba_wishlist_test_purged_v2';
      if (!localStorage.getItem(purgeKey)) {
        localStorage.removeItem('eba_wishlist_items');
        localStorage.setItem(purgeKey, 'true');
        setWishlist([]);
        setIsLoaded(true);
        return;
      }

      const saved = localStorage.getItem('eba_wishlist_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        setWishlist(Array.isArray(parsed) ? parsed : []);
      } else {
        setWishlist([]);
      }
    } catch {
      setWishlist([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('eba_wishlist_items', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const toggleWishlist = (product: ProductItem) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
    try {
      localStorage.removeItem('eba_wishlist_items');
    } catch {
      // ignore
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        count: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
