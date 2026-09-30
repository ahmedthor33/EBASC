export interface AdminCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  timesUsed: number;
  usageLimit: number;
  expiry: string;
  isActive: boolean;
}

export const DEFAULT_COUPONS: AdminCoupon[] = [
  {
    id: 'cp-1',
    code: 'EBAGLOW',
    type: 'percentage',
    value: 15,
    minOrder: 3000,
    timesUsed: 64,
    usageLimit: 500,
    expiry: '2026-12-31',
    isActive: true,
  },
  {
    id: 'cp-2',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrder: 2000,
    timesUsed: 142,
    usageLimit: 1000,
    expiry: '2026-11-30',
    isActive: true,
  },
  {
    id: 'cp-3',
    code: 'VIP500',
    type: 'fixed',
    value: 500,
    minOrder: 4500,
    timesUsed: 29,
    usageLimit: 200,
    expiry: '2026-10-31',
    isActive: true,
  },
];

const COUPONS_STORAGE_KEY = 'eba_coupons_store';

export function getStoredCoupons(): AdminCoupon[] {
  if (typeof window === 'undefined') return DEFAULT_COUPONS;
  try {
    const raw = localStorage.getItem(COUPONS_STORAGE_KEY);
    if (!raw) return DEFAULT_COUPONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_COUPONS;
  } catch {
    return DEFAULT_COUPONS;
  }
}

export function saveStoredCoupons(coupons: AdminCoupon[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
    window.dispatchEvent(new Event('eba_coupons_updated'));
    return true;
  } catch (err) {
    console.warn('Failed to save coupons to localStorage:', err);
    return false;
  }
}
