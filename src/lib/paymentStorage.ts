export interface PaymentSettings {
  codEnabled: boolean;
  codVerificationCall: boolean;
  codMaxLimit: number;
  bankTransferEnabled: boolean;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  jazzcashEnabled: boolean;
  jazzcashAccount: string;
  jazzcashTitle: string;
  easypaisaEnabled: boolean;
  easypaisaAccount: string;
  easypaisaTitle: string;
}

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  codEnabled: true,
  codVerificationCall: true,
  codMaxLimit: 30000,
  bankTransferEnabled: true,
  bankName: 'Meezan Bank Limited',
  accountTitle: 'EBA SKIN CARE APOTHECARY',
  accountNumber: '02010108920141',
  iban: 'PK36MEZN0002010108920141',
  jazzcashEnabled: true,
  jazzcashAccount: '0300 8492011',
  jazzcashTitle: 'EBA Skin Care Online',
  easypaisaEnabled: true,
  easypaisaAccount: '0345 8899123',
  easypaisaTitle: 'EBA Skin Care Online',
};

const PAYMENT_STORAGE_KEY = 'eba_payment_settings';

export function getPaymentSettings(): PaymentSettings {
  if (typeof window === 'undefined') return DEFAULT_PAYMENT_SETTINGS;
  try {
    const raw = localStorage.getItem(PAYMENT_STORAGE_KEY);
    if (!raw) return DEFAULT_PAYMENT_SETTINGS;
    return { ...DEFAULT_PAYMENT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PAYMENT_SETTINGS;
  }
}

export function savePaymentSettings(settings: PaymentSettings): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('eba_payments_updated'));
    return true;
  } catch (err) {
    console.warn('Failed to save payment settings to localStorage:', err);
    return false;
  }
}
