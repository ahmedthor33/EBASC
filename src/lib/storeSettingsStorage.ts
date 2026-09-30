export interface StoreSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  deliveryTimeline: string;
  announcementBanner: string;
  bannerActive: boolean;
  currency?: string;
  // Enhanced Announcement Bar controls
  announcementBgColor?: string;
  announcementTextColor?: string;
  announcementAccentColor?: string;
  announcementLeftTag?: string;
  announcementRightText?: string;
  announcementRightLink?: string;
  announcementTicker?: boolean;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'EBA Skin Care',
  tagline: 'Luxury Botanical Apothecary — Formulated for Pakistan Skin Resiliency',
  supportEmail: 'support@ebaskincare.pk',
  supportPhone: '+92 300 1234567',
  freeShippingThreshold: 3500,
  standardShippingFee: 250,
  deliveryTimeline: '2-4 Business Days via TCS Express / Leopard',
  announcementBanner: '✦ COMPLIMENTARY EXPRESS DELIVERY ON ORDERS OVER RS. 3,500 ACROSS PAKISTAN ✦',
  bannerActive: true,
  currency: 'PKR',
  announcementBgColor: '#1A1615',
  announcementTextColor: '#F7F3EE',
  announcementAccentColor: '#FFE088',
  announcementLeftTag: 'Karachi • Lahore • Islamabad',
  announcementRightText: 'Care: +92 300 1234567',
  announcementRightLink: 'tel:+923001234567',
  announcementTicker: false,
};

const STORE_SETTINGS_KEY = 'eba_store_settings';

export function getStoreSettings(): StoreSettings {
  if (typeof window === 'undefined') return DEFAULT_STORE_SETTINGS;
  try {
    const raw = localStorage.getItem(STORE_SETTINGS_KEY);
    if (!raw) return DEFAULT_STORE_SETTINGS;
    return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
}

export function saveStoreSettings(settings: StoreSettings): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORE_SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('eba_store_settings_updated'));
    return true;
  } catch (err) {
    console.warn('Failed to save store settings to localStorage:', err);
    return false;
  }
}
