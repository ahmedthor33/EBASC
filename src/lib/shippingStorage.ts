export interface ShippingZone {
  id: string;
  name: string;
  cities: string;
  rate: number;
  deliveryDays: string;
  isActive: boolean;
}

export interface CourierPartner {
  id: string;
  name: string;
  code: string;
  accountNumber: string;
  trackingUrlPrefix: string;
  isActive: boolean;
}

export interface ShippingSettings {
  freeShippingThreshold: number;
  standardRate: number;
  expressRate: number;
  expressEnabled: boolean;
  codFee: number;
  estimatedStandardDays: string;
  estimatedExpressDays: string;
  zones: ShippingZone[];
  couriers: CourierPartner[];
}

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  freeShippingThreshold: 3500,
  standardRate: 250,
  expressRate: 500,
  expressEnabled: true,
  codFee: 0,
  estimatedStandardDays: '2–4 Business Days',
  estimatedExpressDays: '24–36 Hours (Lahore & Karachi)',
  zones: [
    {
      id: 'zone-1',
      name: 'Major Metros',
      cities: 'Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad',
      rate: 200,
      deliveryDays: '1–2 Days',
      isActive: true,
    },
    {
      id: 'zone-2',
      name: 'Secondary Cities',
      cities: 'Multan, Gujranwala, Sialkot, Peshawar, Quetta, Hyderabad, Bahawalpur',
      rate: 250,
      deliveryDays: '2–3 Days',
      isActive: true,
    },
    {
      id: 'zone-3',
      name: 'Remote / Out-of-City Areas',
      cities: 'All other tehsils, Gilgit, Azad Kashmir, rural regions',
      rate: 350,
      deliveryDays: '4–6 Days',
      isActive: true,
    },
  ],
  couriers: [
    {
      id: 'cour-1',
      name: 'TCS Express API',
      code: 'tcs',
      accountNumber: 'TCS-PK-98214',
      trackingUrlPrefix: 'https://www.tcsexpress.com/tracking?track=',
      isActive: true,
    },
    {
      id: 'cour-2',
      name: 'Leopard Courier Portal',
      code: 'leopard',
      accountNumber: 'LEO-KHI-40192',
      trackingUrlPrefix: 'https://www.leopardscourier.com/tracking?num=',
      isActive: true,
    },
    {
      id: 'cour-3',
      name: 'Trax Logistics',
      code: 'trax',
      accountNumber: 'TRX-LHR-8821',
      trackingUrlPrefix: 'https://sonic.trax.pk/tracking?tracking_number=',
      isActive: true,
    },
    {
      id: 'cour-4',
      name: 'PostEx Rapid Delivery',
      code: 'postex',
      accountNumber: 'POSTEX-6721',
      trackingUrlPrefix: 'https://postex.pk/tracking?trackingId=',
      isActive: false,
    },
  ],
};

const STORAGE_KEY = 'eba_shipping_settings';

export function getShippingSettings(): ShippingSettings {
  if (typeof window === 'undefined') return DEFAULT_SHIPPING_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SHIPPING_SETTINGS;
    return { ...DEFAULT_SHIPPING_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SHIPPING_SETTINGS;
  }
}

export function saveShippingSettings(settings: ShippingSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('eba_shipping_updated'));
  } catch (err) {
    console.warn('Failed to save shipping settings locally:', err);
  }
}
