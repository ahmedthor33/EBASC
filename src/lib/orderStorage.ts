export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  address: string;
  courier: string;
  trackingNumber: string;
  itemsSummary: string;
  itemsList: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'verified' | 'failed';
  status: 'pending' | 'processing' | 'in_transit' | 'delivered' | 'cancelled';
  date: string;
  notes?: string;
}

// Default clean state with 0 dummy orders
export const DEFAULT_ORDERS: AdminOrder[] = [];

const ORDERS_STORAGE_KEY = 'eba_admin_orders';

// Known legacy test order IDs to filter out automatically
const TEST_ORDER_IDS = new Set(['ord-1', 'ord-2', 'ord-3', 'ord-4', 'test-order-sample']);

export function getStoredOrders(): AdminOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    // Purge any legacy test orders
    const cleaned = parsed.filter(
      (o: AdminOrder) => !TEST_ORDER_IDS.has(o.id) && !o.orderNumber?.startsWith('EBA-ORD-98')
    );

    if (cleaned.length !== parsed.length) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(cleaned));
    }

    return cleaned;
  } catch {
    return [];
  }
}

export function saveStoredOrders(orders: AdminOrder[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // Ensure no legacy test orders get saved
    const cleaned = orders.filter(
      (o: AdminOrder) => !TEST_ORDER_IDS.has(o.id) && !o.orderNumber?.startsWith('EBA-ORD-98')
    );
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(cleaned));
    window.dispatchEvent(new Event('eba_orders_updated'));
    return true;
  } catch (err) {
    console.warn('Failed to save orders to localStorage:', err);
    return false;
  }
}

export function clearStoredOrders(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ORDERS_STORAGE_KEY);
  window.dispatchEvent(new Event('eba_orders_updated'));
}
