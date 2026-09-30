'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { PRODUCTS, ProductItem, getStoredProducts, saveStoredProducts } from '@/lib/products';
import { createClient } from '@/lib/supabase/client';
import {
  getShippingSettings,
  saveShippingSettings,
  ShippingSettings,
  DEFAULT_SHIPPING_SETTINGS,
} from '@/lib/shippingStorage';
import {
  getCustomBanners,
  saveCustomBanners,
  compressImageFile,
  BannerStoreState,
  DEFAULT_BANNERS,
} from '@/lib/bannerStorage';
import {
  getStoredCoupons,
  saveStoredCoupons,
  AdminCoupon,
  DEFAULT_COUPONS,
} from '@/lib/couponStorage';
import {
  getPaymentSettings,
  savePaymentSettings,
  PaymentSettings,
  DEFAULT_PAYMENT_SETTINGS,
} from '@/lib/paymentStorage';
import {
  getStoreSettings,
  saveStoreSettings,
  StoreSettings,
  DEFAULT_STORE_SETTINGS,
} from '@/lib/storeSettingsStorage';
import {
  getStoredOrders,
  saveStoredOrders,
  AdminOrder,
  DEFAULT_ORDERS,
} from '@/lib/orderStorage';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  CreditCard,
  Users,
  Settings,
  Eye,
  ExternalLink,
  LogOut,
  Search,
  Calendar,
  Bell,
  Plus,
  FileText,
  Download,
  TrendingUp,
  Truck,
  Award,
  Repeat,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  Filter,
  Check,
  AlertCircle,
  Copy,
  Save,
  Phone,
  Mail,
  MapPin,
  Menu,
  ChevronRight,
  Clock,
  Sparkles,
  Image as ImageIcon,
  UploadCloud,
  Layers,
  SlidersHorizontal,
  RefreshCw,
  Navigation,
  Megaphone,
  MessageSquare,
  Inbox,
} from 'lucide-react';
import {
  getContactConfig,
  saveContactConfig,
  getContactInquiries,
  saveContactInquiries,
  ContactPageConfig,
  ContactInquiry,
  DEFAULT_CONTACT_CONFIG,
} from '@/lib/contactStorage';

// Customer Profile Type Definition
interface AdminCustomer {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  city: string;
  role: 'owner' | 'admin' | 'staff' | 'customer';
  ordersCount: number;
  totalSpent: number;
  joinedAt: string;
}

export default function AdminDashboardPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  // Route protection: Block any unauthorized user immediately
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.replace('/sign-in?redirectTo=/admin');
    }
  }, [user, isAdmin, isLoading, router]);

  // Loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1F1B1A] flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-9 h-9 border-2 border-[#C9A96E]/20 border-t-[#C9A96E] rounded-full animate-spin" />
        <span className="font-label-uppercase text-xs tracking-widest text-[#E6E2DD]">Authenticating Studio Access...</span>
      </div>
    );
  }

  // Fallback unauthorized barrier
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#1F1B1A] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#14171C] border border-[#232830] text-white shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-[#FFE088] mx-auto mb-4" />
          <h2 className="text-xl font-serif font-bold text-white mb-2">Restricted Access</h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            The EBA Administrative Studio is strictly restricted to authorized store administrators.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#FFE088] text-[#1C1C19] font-medium text-xs tracking-wider uppercase hover:bg-white transition-colors"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return <AdminDashboardContent />;
}

function AdminDashboardContent() {
  const { user, profile, isAdmin, isOwner, signOut } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  // Navigation & UI States
  const [activeNav, setActiveNav] = useState<
    'dashboard' | 'orders' | 'products' | 'shipping' | 'banners' | 'announcement' | 'coupons' | 'payments' | 'customers' | 'contact' | 'settings'
  >('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [announcementPreviewDevice, setAnnouncementPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // CONTACT US & INQUIRIES STATE
  // -------------------------------------------------------------
  const [contactConfig, setContactConfig] = useState<ContactPageConfig>(DEFAULT_CONTACT_CONFIG);
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>([]);
  const [activeContactTab, setActiveContactTab] = useState<'inquiries' | 'channels' | 'locations'>('inquiries');
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'new' | 'replied' | 'resolved'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  useEffect(() => {
    setContactConfig(getContactConfig());
    setContactInquiries(getContactInquiries());
    const configHandler = () => setContactConfig(getContactConfig());
    const inqHandler = () => setContactInquiries(getContactInquiries());
    window.addEventListener('eba_contact_settings_updated', configHandler);
    window.addEventListener('eba_contact_inquiries_updated', inqHandler);
    return () => {
      window.removeEventListener('eba_contact_settings_updated', configHandler);
      window.removeEventListener('eba_contact_inquiries_updated', inqHandler);
    };
  }, []);

  const handleSaveContactConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveContactConfig(contactConfig);
    showToast('Contact Us page settings & channels updated successfully!');
  };

  const handleUpdateInquiryStatus = (id: string, newStatus: ContactInquiry['status']) => {
    const updated = contactInquiries.map((inq) =>
      inq.id === id ? { ...inq, status: newStatus } : inq
    );
    setContactInquiries(updated);
    saveContactInquiries(updated);
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Inquiry marked as ${newStatus.toUpperCase()}`);
  };

  const handleDeleteInquiry = (id: string) => {
    if (confirm('Delete this client inquiry permanently?')) {
      const updated = contactInquiries.filter((inq) => inq.id !== id);
      setContactInquiries(updated);
      saveContactInquiries(updated);
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      showToast('Client inquiry removed.');
    }
  };

  const handleAddLocation = () => {
    const newLoc = {
      id: `loc-${Date.now()}`,
      name: 'New Regional Boutique',
      address: 'Street, Sector, City',
    };
    const updated = {
      ...contactConfig,
      locations: [...(contactConfig.locations || []), newLoc],
    };
    setContactConfig(updated);
  };

  const handleRemoveLocation = (id: string) => {
    const updated = {
      ...contactConfig,
      locations: contactConfig.locations.filter((l) => l.id !== id),
    };
    setContactConfig(updated);
  };

  const handleUpdateLocation = (id: string, field: 'name' | 'address', val: string) => {
    const updated = {
      ...contactConfig,
      locations: contactConfig.locations.map((l) =>
        l.id === id ? { ...l, [field]: val } : l
      ),
    };
    setContactConfig(updated);
  };

  const filteredInquiries = useMemo(() => {
    return contactInquiries.filter((inq) => {
      const matchStatus = inquiryFilter === 'all' || inq.status === inquiryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.phone.toLowerCase().includes(q) ||
        inq.subject.toLowerCase().includes(q) ||
        inq.message.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [contactInquiries, inquiryFilter, searchQuery]);

  // -------------------------------------------------------------
  // 1. ORDERS STATE & LOGISTICS
  // -------------------------------------------------------------
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'processing' | 'in_transit' | 'delivered' | 'cancelled'>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  // Load persisted orders on mount and listen for real-time updates
  useEffect(() => {
    setOrders(getStoredOrders());
    const handler = () => setOrders(getStoredOrders());
    window.addEventListener('eba_orders_updated', handler);
    return () => window.removeEventListener('eba_orders_updated', handler);
  }, []);

  // Load real orders from Supabase on mount
  useEffect(() => {
    async function loadSupabaseOrders() {
      try {
        const { data: dbOrders, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false })
          .limit(20);

        if (!error && dbOrders && dbOrders.length > 0) {
          const mapped: AdminOrder[] = dbOrders.map((o) => {
            const shipAddr = o.shipping_address || {};
            const cityStr = shipAddr.city ? `${shipAddr.city}` : 'Pakistan';
            const fullAddress = `${shipAddr.address_line1 || ''}, ${shipAddr.city || ''}`;
            const items = (o.order_items || []).map((it: { product_name?: string; quantity?: number; unit_price?: number }) => ({
              name: it.product_name || 'EBA Product',
              quantity: it.quantity || 1,
              price: it.unit_price || 0,
            }));
            const summary = items.map((i: { name: string; quantity: number }) => `${i.name} (x${i.quantity})`).join(', ') || 'Skincare Order';

            return {
              id: o.id,
              orderNumber: o.order_number || `EBA-${o.id.slice(0, 8)}`,
              customerName: o.guest_name || shipAddr.full_name || 'Valued Patron',
              customerEmail: o.guest_email || 'patron@ebaskincare.pk',
              customerPhone: o.guest_phone || shipAddr.phone || '+92 300 0000000',
              city: cityStr,
              address: fullAddress,
              courier: 'TCS Express',
              trackingNumber: `TCS-${Math.floor(10000000 + Math.random() * 90000000)}`,
              itemsSummary: summary,
              itemsList: items.length > 0 ? items : [{ name: 'EBA Skincare Formulation', quantity: 1, price: Number(o.total_amount) }],
              totalAmount: Number(o.total_amount) || 0,
              paymentMethod: 'Cash on Delivery (COD)',
              paymentStatus: (o.payment_status as 'pending' | 'verified' | 'failed') || 'pending',
              status: (o.status as 'pending' | 'processing' | 'in_transit' | 'delivered' | 'cancelled') || 'pending',
              date: new Date(o.created_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              notes: o.notes || undefined,
            };
          });

          setOrders(mapped);
          saveStoredOrders(mapped);
        } else {
          setOrders(getStoredOrders());
        }
      } catch (err) {
        console.warn('Could not load orders from Supabase:', err);
      }
    }

    loadSupabaseOrders();
  }, [supabase]);

  // Synchronize remote site_settings from Supabase on mount
  useEffect(() => {
    async function hydrateRemoteSettings() {
      try {
        const { data, error } = await supabase.from('site_settings').select('*');
        if (!error && data && data.length > 0) {
          for (const row of data) {
            if (row.key === 'shipping_settings' && row.value) {
              setShippingConfig(row.value);
              saveShippingSettings(row.value);
            } else if (row.key === 'hero_banners' && row.value) {
              setBannerStore(row.value);
              saveCustomBanners(row.value);
            } else if (row.key === 'coupons_list' && Array.isArray(row.value)) {
              setCoupons(row.value);
              saveStoredCoupons(row.value);
            } else if (row.key === 'payment_settings' && row.value) {
              setPaymentSettings(row.value);
              savePaymentSettings(row.value);
            } else if (row.key === 'store_settings' && row.value) {
              setStoreSettings(row.value);
              saveStoreSettings(row.value);
            }
          }
        }
      } catch (err) {
        console.warn('Remote site_settings hydration notice:', err);
      }
    }

    hydrateRemoteSettings();
  }, [supabase]);

  // Handle Order Status Change
  const handleUpdateOrderStatus = async (orderId: string, newStatus: AdminOrder['status']) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    saveStoredOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Order status updated to: ${newStatus.replace('_', ' ').toUpperCase()}`);

    try {
      await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);
    } catch {
      // Non-blocking
    }
  };

  // Clear all orders handler
  const handleClearAllOrders = async () => {
    if (confirm('Are you sure you want to clear all orders? This will permanently remove order records.')) {
      setOrders([]);
      saveStoredOrders([]);
      setSelectedOrder(null);
      showToast('All orders cleared.');
      try {
        await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch {
        // Non-blocking
      }
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer', 'Phone', 'City', 'Total (PKR)', 'Payment Method', 'Status', 'Courier Tracking'];
    const rows = orders.map((o) => [
      o.orderNumber,
      `"${o.date}"`,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.city}"`,
      o.totalAmount,
      `"${o.paymentMethod}"`,
      o.status,
      o.trackingNumber,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eba_orders_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders CSV Ledger downloaded successfully.');
  };

  // -------------------------------------------------------------
  // 2. PRODUCTS STATE & MANAGEMENT
  // -------------------------------------------------------------
  const [productsList, setProductsList] = useState<ProductItem[]>(PRODUCTS);
  const [productCategoryFilter, setProductCategoryFilter] = useState<'all' | 'women' | 'men'>('all');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  useEffect(() => {
    setProductsList(getStoredProducts());
    const handler = () => setProductsList(getStoredProducts());
    window.addEventListener('eba_products_updated', handler);
    return () => window.removeEventListener('eba_products_updated', handler);
  }, []);

  // New / Edit Product Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'women' | 'men'>('women');
  const [formSize, setFormSize] = useState('100ml');
  const [formSku, setFormSku] = useState('');
  const [formPrice, setFormPrice] = useState(1950);
  const [formSalePrice, setFormSalePrice] = useState(1650);
  const [formStock, setFormStock] = useState(100);
  const [formDescription, setFormDescription] = useState('');

  // Handle Quick Stock Adjust
  const handleStockAdjust = async (id: string, delta: number) => {
    const updated = productsList.map((item) =>
      item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
    );
    setProductsList(updated);
    saveStoredProducts(updated);
    showToast('Stock units updated and saved!');

    try {
      const target = productsList.find((p) => p.id === id);
      if (target) {
        const newStock = Math.max(0, target.stock + delta);
        await supabase.from('products').update({ stock: newStock }).eq('sku', target.sku);
      }
    } catch {
      // Non-blocking
    }
  };

  // Open Create Product Modal
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('women');
    setFormSize('100ml');
    setFormSku(`EBA-${formCategory === 'women' ? 'W' : 'M'}-${Math.floor(100 + Math.random() * 900)}`);
    setFormPrice(2000);
    setFormSalePrice(1750);
    setFormStock(100);
    setFormDescription('Luxury botanical formulation engineered for radiant skin.');
    setProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod: ProductItem) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormSize(prod.size);
    setFormSku(prod.sku);
    setFormPrice(prod.price);
    setFormSalePrice(prod.salePrice || prod.price);
    setFormStock(prod.stock);
    setFormDescription(prod.description);
    setProductModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSku.trim()) {
      alert('Please provide product name and SKU.');
      return;
    }

    let updated: ProductItem[];
    if (editingProduct) {
      updated = productsList.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: formName,
              category: formCategory,
              categoryName: formCategory === 'women' ? 'Women Collection' : 'Men Collection',
              size: formSize,
              sku: formSku,
              price: Number(formPrice),
              salePrice: Number(formSalePrice) || undefined,
              stock: Number(formStock),
              description: formDescription,
            }
          : p
      );
      showToast(`Updated "${formName}" successfully!`);
    } else {
      const newProduct: ProductItem = {
        id: `prod-${Date.now()}`,
        name: formName,
        slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formCategory,
        categoryName: formCategory === 'women' ? 'Women Collection' : 'Men Collection',
        subtitle: 'Botanical Performance Complex',
        description: formDescription,
        howToUse: 'Apply gently onto cleansed skin in circular motions.',
        size: formSize,
        price: Number(formPrice),
        salePrice: Number(formSalePrice) || undefined,
        sku: formSku,
        stock: Number(formStock),
        rating: 5.0,
        reviewsCount: 0,
        image:
          formCategory === 'women'
            ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkv5jVPPTESDqRukEOVPhDdyl8VS4CvYWHOSOPukgL9jJixKDUcHcsY2B0lKkhoqelpkgzzWTLRM6kAqQigYusDKXpxYlZBYskWxvO8jq2vAYzWDsL_geWxXSfxSQLaOhR_HEuwhXNlCXBfiOB08fBWp2DrTAg2Pe_fLxISsln5sj8QVN3IP8V3B-bo70OnfIe4LQs4VG8IT8Kr4KrK2NVcuSzvkHroPpG4sUjbf-RC9OrDFcy-IBPYQ'
            : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ9kU24yO-z0eZ0FshB3b8uXQc0Tf5bK1vEaF8Rk3-o_Yj3eI3uW6l1kF8Z0x-Y_l1f3Q9wE_v6A_b8A',
        badge: 'New Formulation',
        benefits: ['Hydrating', 'Revitalizing', 'Barrier Restoration'],
      };

      updated = [newProduct, ...productsList];
      showToast(`Created new product "${formName}"!`);
    }

    setProductsList(updated);
    saveStoredProducts(updated);
    setProductModalOpen(false);

    try {
      const targetProd = editingProduct
        ? updated.find((p) => p.id === editingProduct.id)
        : updated[0];
      if (targetProd) {
        await supabase.from('products').upsert(
          {
            name: targetProd.name,
            slug: targetProd.slug,
            description: targetProd.description,
            size: targetProd.size,
            price: targetProd.price,
            sale_price: targetProd.salePrice || null,
            sku: targetProd.sku,
            stock: targetProd.stock,
            status: 'published',
          },
          { onConflict: 'sku' }
        );
      }
    } catch (err) {
      console.warn('Supabase product upsert notice:', err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the active catalog?`)) {
      const target = productsList.find((p) => p.id === id);
      const updated = productsList.filter((p) => p.id !== id);
      setProductsList(updated);
      saveStoredProducts(updated);
      showToast(`Removed "${name}".`);

      if (target) {
        try {
          await supabase.from('products').delete().eq('sku', target.sku);
        } catch {
          // Non-blocking
        }
      }
    }
  };

  // -------------------------------------------------------------
  // 3. SHIPPING & LOGISTICS CONTROLS (NEW DEDICATED OPTION)
  // -------------------------------------------------------------
  const [shippingConfig, setShippingConfig] = useState<ShippingSettings>(DEFAULT_SHIPPING_SETTINGS);

  useEffect(() => {
    setShippingConfig(getShippingSettings());
    const handler = () => setShippingConfig(getShippingSettings());
    window.addEventListener('eba_shipping_updated', handler);
    return () => window.removeEventListener('eba_shipping_updated', handler);
  }, []);

  const handleSaveShippingConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    saveShippingSettings(shippingConfig);
    showToast('Shipping rates, thresholds, and courier rules saved successfully!');

    try {
      await supabase.from('site_settings').upsert(
        {
          key: 'shipping_settings',
          value: shippingConfig,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

      await supabase.from('shipping_rates').upsert(
        {
          name: 'Standard Pakistan Delivery',
          rate: shippingConfig.standardRate,
          free_shipping_threshold: shippingConfig.freeShippingThreshold,
          estimated_days: shippingConfig.estimatedStandardDays,
          is_active: true,
        },
        { onConflict: 'name' }
      );
    } catch (err) {
      console.warn('Supabase shipping sync notice:', err);
    }
  };

  const handleUpdateZoneRate = (zoneId: string, newRate: number) => {
    const updated = {
      ...shippingConfig,
      zones: shippingConfig.zones.map((z) => (z.id === zoneId ? { ...z, rate: newRate } : z)),
    };
    setShippingConfig(updated);
    saveShippingSettings(updated);
  };

  const handleToggleZone = (zoneId: string) => {
    const updated = {
      ...shippingConfig,
      zones: shippingConfig.zones.map((z) => (z.id === zoneId ? { ...z, isActive: !z.isActive } : z)),
    };
    setShippingConfig(updated);
    saveShippingSettings(updated);
  };

  const handleToggleCourier = (courierId: string) => {
    const updated = {
      ...shippingConfig,
      couriers: shippingConfig.couriers.map((c) => (c.id === courierId ? { ...c, isActive: !c.isActive } : c)),
    };
    setShippingConfig(updated);
    saveShippingSettings(updated);
    showToast('Courier partner status updated & saved.');
  };

  // -------------------------------------------------------------
  // 4. DRAG & DROP HERO & BANNERS STUDIO (NEW DEDICATED OPTION)
  // -------------------------------------------------------------
  const [bannerStore, setBannerStore] = useState<BannerStoreState>(DEFAULT_BANNERS);
  const [activeBannerTab, setActiveBannerTab] = useState<'home' | 'women' | 'men' | 'shop' | 'ribbon'>('home');
  const [isDraggingOver, setIsDraggingOver] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetField, setUploadTargetField] = useState<'homePrimary' | 'homeSecondary' | 'women' | 'men' | 'shop'>('homePrimary');

  useEffect(() => {
    setBannerStore(getCustomBanners());
    const handler = () => setBannerStore(getCustomBanners());
    window.addEventListener('eba_banners_updated', handler);
    return () => window.removeEventListener('eba_banners_updated', handler);
  }, []);

  // Preset Luxury Images
  const BANNER_PRESETS = [
    {
      title: '24K Gold Dropper (Travertine Marble)',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlOJoPgKGYUTFyrU6Zkru90zysTKfNIA4WC0fjWWHRJmUI181UrP1n64fpKiIZ3rMJr6HhkDWyTrC53gMDjEcXGh1SXlC4ZlCKX8FFMEV8Q7E872J-un1b7RAwbBaMqbjKDcYJ5DLdji-2WfzWnFoR6t9lN-uKhDrKpeqJITYrEZU3ZGkD5QkHH1PSRhBr_GNkxRHIvAzbt4s_WpNr25tYizGsnxp_2nU-oUVqZxEZn95dhwawTgezCw',
    },
    {
      title: 'Obsidian Slate Men Grooming',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWdjQaMELbJx4Huf2UMZsszy_ANpp09ABiY8lcItAUlA4ruXHAoBRm7pTW0Z_hn3UGNDH-eQLub5BqroLcHqDYKI78drAb9I2DOOjdnGuIjxXB2uFz_weBpGtYujNDSZe8pE0eeDezriMDEgS_Bz9VcGAInXpBK9dllvmUMUE0065H5wR0yK2fA1TXmz5NvDvsTiZ6Qi3gFoZfYoMHTVAfsJHaTpWRWjO8KpF2SJHQnL-JwZknuUIUkw',
    },
    {
      title: 'Damask Rose Botanical Hydrosol',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXTANK53uj18t1_ILPGUQbZzqMFr5OWJTagkxfISowoC8Emq_mQL1Rw2QCBTc10w3sKIC8htMRZ-VuZvMZcP_V0S121SkywotnqyoStnDBvdIf9V4yp3iJIw3yO0VdTi_vgKTBToYxU50XG9uPjCtLM_Xb7jsyoSBfakl0SnErdcglo0l-p0b7_t5BMDkS6gNhiiRAyr1EfVaSsnv6NYzC3vyuKATYk3PvU0Af-XBk-ro6_IgMOUUzYQ',
    },
    {
      title: 'Frosted Glass Night Cream Elixir',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIiiXXSdy9vlZKuoJpyflbwD43OEGYXpjoa_BtaXjAgP700fOTmnbwe__i-4_i0M57yP6P17yhHCHqSoCe9-say7nUbYY17wTmqigciyW0HzDyxqM4brVi4Wcggl_kSx1cj-qCTuxbc4akBqZo0G2Qd0eoAZcMEE2cIIXiILSiOoTgzIHyDtLHJ5bLFAVlJ-Hl6LsxgGw-mM-rHtJwpESC5pRUiAF4GpjLjTT8GyodpgVIokIq135tkA',
    },
  ];

  // Apply image to targeted section
  const applyImageToField = (field: 'homePrimary' | 'homeSecondary' | 'women' | 'men' | 'shop', imageUrl: string) => {
    if (field === 'homePrimary') {
      setBannerStore((prev) => ({
        ...prev,
        homeHero: { ...prev.homeHero, primaryImage: imageUrl },
      }));
    } else if (field === 'homeSecondary') {
      setBannerStore((prev) => ({
        ...prev,
        homeHero: { ...prev.homeHero, secondaryImage: imageUrl },
      }));
    } else if (field === 'women' || field === 'men' || field === 'shop') {
      setBannerStore((prev) => ({
        ...prev,
        pageBanners: {
          ...prev.pageBanners,
          [field]: { ...prev.pageBanners[field], imageUrl },
        },
      }));
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent, dropzoneId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(dropzoneId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(null);
  };

  const handleDropImage = async (
    e: React.DragEvent,
    field: 'homePrimary' | 'homeSecondary' | 'women' | 'men' | 'shop'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        showToast('Please drop a valid image file (.png, .jpg, .webp)');
        return;
      }
      try {
        const compressed = await compressImageFile(file);
        applyImageToField(field, compressed);
        showToast('Image uploaded, compressed & preview updated!');
      } catch (err) {
        console.warn('Failed to compress image:', err);
        showToast('Error processing image. Please try another file.');
      }
    }
  };

  // Trigger file picker
  const triggerFilePicker = (field: 'homePrimary' | 'homeSecondary' | 'women' | 'men' | 'shop') => {
    setUploadTargetField(field);
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const compressed = await compressImageFile(file);
        applyImageToField(uploadTargetField, compressed);
        showToast('Image uploaded, compressed & preview updated!');
      } catch (err) {
        console.warn('Failed to compress image:', err);
        showToast('Error processing image. Please try another file.');
      }
    }
  };

  // Swap Left and Right Hero Visuals
  const handleSwapHeroVisuals = () => {
    setBannerStore((prev) => ({
      ...prev,
      homeHero: {
        ...prev.homeHero,
        primaryImage: prev.homeHero.secondaryImage,
        secondaryImage: prev.homeHero.primaryImage,
      },
    }));
    showToast('Swapped left and right hero montage visuals!');
  };

  // Save all custom banners
  const handleSaveAllBanners = async () => {
    const success = saveCustomBanners(bannerStore);
    if (success) {
      showToast('Hero section & page banners saved & published live across all pages!');
    } else {
      showToast('Saved to session storage (browser quota limit reached)');
    }

    try {
      await supabase.from('site_settings').upsert(
        {
          key: 'hero_banners',
          value: bannerStore,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

      await supabase.from('hero_sections').upsert(
        {
          category_mode: 'all',
          badge_text: bannerStore.homeHero.badge,
          title: `${bannerStore.homeHero.title} ${bannerStore.homeHero.titleHighlight}`,
          subtitle: bannerStore.homeHero.subtitle,
          primary_cta_label: bannerStore.homeHero.primaryCtaLabel,
          primary_cta_url: bannerStore.homeHero.primaryCtaUrl,
          secondary_cta_label: bannerStore.homeHero.secondaryCtaLabel,
          secondary_cta_url: bannerStore.homeHero.secondaryCtaUrl,
          image_url: bannerStore.homeHero.primaryImage,
          secondary_image_url: bannerStore.homeHero.secondaryImage,
          is_active: true,
        },
        { onConflict: 'category_mode' }
      );
    } catch (err) {
      console.warn('Supabase banner sync notice:', err);
    }
  };

  // -------------------------------------------------------------
  // 5. COUPONS STATE & MANAGEMENT
  // -------------------------------------------------------------
  const [coupons, setCoupons] = useState<AdminCoupon[]>(DEFAULT_COUPONS);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponVal, setNewCouponVal] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(2500);

  useEffect(() => {
    setCoupons(getStoredCoupons());
    const handler = () => setCoupons(getStoredCoupons());
    window.addEventListener('eba_coupons_updated', handler);
    return () => window.removeEventListener('eba_coupons_updated', handler);
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const newCp: AdminCoupon = {
      id: `cp-${Date.now()}`,
      code: newCouponCode.toUpperCase().trim(),
      type: newCouponType,
      value: Number(newCouponVal),
      minOrder: Number(newCouponMin),
      timesUsed: 0,
      usageLimit: 500,
      expiry: '2026-12-31',
      isActive: true,
    };

    const updated = [newCp, ...coupons];
    setCoupons(updated);
    saveStoredCoupons(updated);
    setCouponModalOpen(false);
    showToast(`Coupon ${newCp.code} created & saved successfully!`);

    try {
      await supabase.from('site_settings').upsert(
        {
          key: 'coupons_list',
          value: updated,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

      await supabase.from('coupons').upsert(
        {
          code: newCp.code,
          type: newCp.type,
          value: newCp.value,
          min_order: newCp.minOrder,
          usage_limit: newCp.usageLimit,
          is_active: newCp.isActive,
        },
        { onConflict: 'code' }
      );
    } catch (err) {
      console.warn('Supabase coupon sync notice:', err);
    }
  };

  const handleToggleCoupon = async (id: string) => {
    const updated = coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
    setCoupons(updated);
    saveStoredCoupons(updated);
    showToast('Coupon status updated & saved.');

    try {
      await supabase.from('site_settings').upsert(
        {
          key: 'coupons_list',
          value: updated,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

      const target = updated.find((c) => c.id === id);
      if (target) {
        await supabase.from('coupons').update({ is_active: target.isActive }).eq('code', target.code);
      }
    } catch (err) {
      console.warn('Supabase coupon toggle notice:', err);
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (confirm(`Delete coupon code ${code}?`)) {
      const updated = coupons.filter((c) => c.id !== id);
      setCoupons(updated);
      saveStoredCoupons(updated);
      showToast(`Coupon ${code} removed.`);

      try {
        await supabase.from('site_settings').upsert(
          {
            key: 'coupons_list',
            value: updated,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );

        await supabase.from('coupons').delete().eq('code', code);
      } catch (err) {
        console.warn('Supabase coupon delete notice:', err);
      }
    }
  };

  // -------------------------------------------------------------
  // 6. PAYMENT GATEWAYS CONFIGURATION (PAKISTAN)
  // -------------------------------------------------------------
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);

  useEffect(() => {
    setPaymentSettings(getPaymentSettings());
    const handler = () => setPaymentSettings(getPaymentSettings());
    window.addEventListener('eba_payments_updated', handler);
    return () => window.removeEventListener('eba_payments_updated', handler);
  }, []);

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentSettings(paymentSettings);
    showToast('Pakistan Payment Gateways settings saved successfully!');

    try {
      await supabase.from('site_settings').upsert(
        {
          key: 'payment_settings',
          value: paymentSettings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );
    } catch (err) {
      console.warn('Supabase payment sync notice:', err);
    }
  };

  // -------------------------------------------------------------
  // 7. CUSTOMERS & PATRONS MANAGEMENT
  // -------------------------------------------------------------
  const [customers, setCustomers] = useState<AdminCustomer[]>([
    {
      id: 'owner-ahmed',
      email: 'ahmedthor33@gmail.com',
      fullName: 'Ahmed (Platform Owner)',
      phone: '+92 300 1234567',
      city: 'Lahore',
      role: 'owner',
      ordersCount: 0,
      totalSpent: 0,
      joinedAt: 'Sep 2026',
    },
  ]);

  // Load real registered customers from Supabase profiles
  useEffect(() => {
    async function loadRealCustomers() {
      try {
        const { data, error } = await supabase.from('profiles').select('*');
        if (!error && data && data.length > 0) {
          const mapped: AdminCustomer[] = data.map((p) => ({
            id: p.id,
            email: p.email || 'customer@ebaskincare.pk',
            fullName: p.full_name || 'Valued Patron',
            phone: p.phone || '—',
            city: p.city || 'Pakistan',
            role: (p.role as AdminCustomer['role']) || (p.email === 'ahmedthor33@gmail.com' ? 'owner' : 'customer'),
            ordersCount: 0,
            totalSpent: 0,
            joinedAt: new Date(p.created_at || Date.now()).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' }),
          }));

          if (!mapped.some((m) => m.email.toLowerCase() === 'ahmedthor33@gmail.com')) {
            mapped.unshift({
              id: 'owner-ahmed',
              email: 'ahmedthor33@gmail.com',
              fullName: 'Ahmed (Platform Owner)',
              phone: '+92 300 1234567',
              city: 'Lahore',
              role: 'owner',
              ordersCount: 0,
              totalSpent: 0,
              joinedAt: 'Sep 2026',
            });
          }
          setCustomers(mapped);
        }
      } catch (err) {
        console.warn('Could not load profiles from Supabase:', err);
      }
    }
    loadRealCustomers();
  }, [supabase]);

  const handleChangeCustomerRole = (id: string, newRole: AdminCustomer['role']) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, role: newRole } : c))
    );
    showToast(`Patron role updated to: ${newRole.toUpperCase()}`);
  };

  // -------------------------------------------------------------
  // 8. STORE SETTINGS
  // -------------------------------------------------------------
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  useEffect(() => {
    setStoreSettings(getStoreSettings());
    const handler = () => setStoreSettings(getStoreSettings());
    window.addEventListener('eba_store_settings_updated', handler);
    return () => window.removeEventListener('eba_store_settings_updated', handler);
  }, []);

  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    saveStoreSettings(storeSettings);
    showToast('Store settings & brand rules saved successfully!');

    try {
      await supabase.from('site_settings').upsert(
        {
          key: 'store_settings',
          value: storeSettings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );
    } catch (err) {
      console.warn('Supabase store settings sync notice:', err);
    }
  };

  const handleSaveAnnouncementBar = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveStoreSettings(storeSettings);
    showToast('Top announcement bar saved & published live across all store pages!');

    try {
      await supabase.from('site_settings').upsert(
        {
          key: 'store_settings',
          value: storeSettings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );
    } catch (err) {
      console.warn('Supabase announcement save notice:', err);
    }
  };

  // -------------------------------------------------------------
  // COMPUTED KPI METRICS & SEARCH FILTERS
  // -------------------------------------------------------------
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  }, [orders]);

  const totalOrdersCount = orders.length;

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchFilter = orderFilter === 'all' || o.status === orderFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.trackingNumber.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [orders, orderFilter, searchQuery]);

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [productsList, productCategoryFilter, searchQuery]);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDF9F4] text-[#1C1C19] flex relative">
      {/* Hidden File Input for Image Pickers */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1615] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#725B38]/40 flex items-center gap-3 animate-fade-in text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-[#7F7572] hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Left Admin Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-[#EADECF] flex flex-col justify-between shadow-sm transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="p-6 border-b border-[#EADECF] flex items-center justify-between">
            <BrandLogo
              variant="light"
              size="md"
              showTagline
              taglineText="ADMIN CONSOLE • STUDIO"
              href="/admin"
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-[#7F7572] hover:bg-[#F7F3EE]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1 font-label-ui text-xs">
            <button
              onClick={() => {
                setActiveNav('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'dashboard'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveNav('orders');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'orders'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders Logistics</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#FEDEB2] text-[#78603E] text-[10px] font-bold">
                {orders.filter((o) => o.status === 'pending' || o.status === 'processing').length} NEW
              </span>
            </button>

            <button
              onClick={() => {
                setActiveNav('products');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'products'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Products & Catalog</span>
              </div>
              <span className="text-[10px] text-[#7F7572] font-mono">{productsList.length} SKUs</span>
            </button>

            {/* NEW: SHIPPING & COURIERS OPTION */}
            <button
              onClick={() => {
                setActiveNav('shipping');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'shipping'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-[#725B38]" />
                <span className="font-medium">Shipping & Couriers</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#EBE8E3] text-[#725B38] text-[10px] font-bold">
                Rs. {shippingConfig.standardRate}
              </span>
            </button>

            {/* NEW: HERO & BANNERS STUDIO OPTION */}
            <button
              onClick={() => {
                setActiveNav('banners');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'banners'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4 text-[#725B38]" />
                <span className="font-medium">Hero & Banners Studio</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[#FFE088] text-[#241A00] text-[9px] font-bold">
                DRAG & DROP
              </span>
            </button>

            {/* DEDICATED ANNOUNCEMENT BAR OPTION */}
            <button
              onClick={() => {
                setActiveNav('announcement');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'announcement'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Megaphone className="w-4 h-4 text-[#725B38]" />
                <span className="font-medium">Announcement Bar</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  storeSettings.bannerActive !== false
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {storeSettings.bannerActive !== false ? 'LIVE' : 'OFF'}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveNav('coupons');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'coupons'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4" />
                <span>Coupons & Promos</span>
              </div>
              <span className="font-semibold text-[10px] text-[#725B38] font-mono">EBAGLOW</span>
            </button>

            <button
              onClick={() => {
                setActiveNav('payments');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'payments'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4" />
                <span>Payment Gateways</span>
              </div>
              <span className="text-[10px] text-[#7F7572]">PKR COD</span>
            </button>

            <button
              onClick={() => {
                setActiveNav('customers');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'customers'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Patrons & VIP Club</span>
              </div>
              <span className="text-[10px] text-[#7F7572] font-mono">{customers.length}</span>
            </button>

            {/* CONTACT US & INQUIRIES OPTION */}
            <button
              onClick={() => {
                setActiveNav('contact');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'contact'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-[#725B38]" />
                <span className="font-medium">Contact Us & Inquiries</span>
              </div>
              {contactInquiries.filter((i) => i.status === 'new').length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#FEDEB2] text-[#78603E] text-[10px] font-bold">
                  {contactInquiries.filter((i) => i.status === 'new').length} NEW
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveNav('settings');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'settings'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Store Settings</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#EADECF] flex flex-col gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#F7F3EE] hover:bg-[#EBE8E3] transition-colors text-xs font-medium text-[#1C1C19] border border-[#EADECF]"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#725B38]" />
              <span>Live Storefront</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#7F7572]" />
          </Link>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FDF9F4] border border-[#EADECF]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1A1615] text-[#FFE088] flex items-center justify-center font-bold text-xs">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#1C1C19] truncate max-w-[120px]">
                  {profile?.full_name || user?.email || 'Owner Admin'}
                </span>
                <span className="text-[10px] text-[#725B38] font-bold uppercase tracking-wider">
                  Platform Owner
                </span>
              </div>
            </div>

            <button
              onClick={signOut}
              title="Sign Out"
              className="p-1.5 text-[#7F7572] hover:text-red-600 transition-colors rounded-lg hover:bg-[#F7F3EE]"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Workspace Body (Offset left for desktop) */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-72">
        {/* Top Header Bar */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#EADECF] sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-[#1C1C19] hover:bg-[#F7F3EE]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative flex items-center w-60 sm:w-80">
              <Search className="absolute left-3 w-4 h-4 text-[#7F7572]" />
              <input
                type="text"
                placeholder={
                  activeNav === 'orders'
                    ? 'Search orders, tracking, patron...'
                    : activeNav === 'products'
                    ? 'Search products, SKU...'
                    : activeNav === 'customers'
                    ? 'Search patrons, emails...'
                    : 'Search console...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F7F3EE] rounded-full border border-[#EADECF] focus:outline-none focus:border-[#725B38] text-[#1C1C19]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-[#7F7572] hover:text-[#1C1C19]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBE8E3] text-[#1C1C19] border border-[#EADECF]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-label-uppercase text-[10px] tracking-wider font-semibold">
                Pakistan Live • PKR
              </span>
            </div>

            <button
              onClick={handleOpenCreateProduct}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1A1615] text-white hover:bg-[#725B38] transition-colors text-xs font-semibold shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New SKU</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Views */}
        <main className="p-4 sm:p-8 space-y-8 flex-1">
          {/* ======================================================== */}
          {/* VIEW 1: DASHBOARD OVERVIEW                               */}
          {/* ======================================================== */}
          {activeNav === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EADECF]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-label-uppercase text-[#725B38] tracking-widest font-semibold">
                    <span>Apothecary Management Studio</span>
                    <span>•</span>
                    <span>Pakistan Operations</span>
                  </div>
                  <h1 className="font-headline-lg text-2xl sm:text-3xl text-[#1C1C19] mt-1 font-semibold">
                    Executive Console — EBA Skin Care
                  </h1>
                  <p className="text-xs text-[#7F7572] mt-0.5">
                    Consolidated operational data synchronized with TCS Express, Leopard Courier, and Bank Portals.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-full bg-white text-[#1C1C19] border border-[#EADECF] text-xs font-semibold hover:bg-[#F7F3EE] transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <FileText className="w-4 h-4 text-[#725B38]" />
                    <span>Print / PDF</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 rounded-full bg-white text-[#1C1C19] border border-[#EADECF] text-xs font-semibold hover:bg-[#F7F3EE] transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-4 h-4 text-[#725B38]" />
                    <span>CSV Ledger</span>
                  </button>
                </div>
              </div>

              {/* 4 Bento KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#EADECF] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[#7F7572] font-label-uppercase tracking-wider">
                    <span>Consolidated Revenue</span>
                    <CreditCard className="w-5 h-5 text-[#725B38]" />
                  </div>
                  <div className="mt-3">
                    <div className="font-price-lg text-2xl text-[#1C1C19] font-bold">
                      Rs. {totalRevenue.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-700 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{orders.length > 0 ? `Calculated from ${orders.length} live orders` : 'Live store revenue (PKR)'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#EADECF] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[#7F7572] font-label-uppercase tracking-wider">
                    <span>Fulfilled Orders</span>
                    <ShoppingBag className="w-5 h-5 text-[#725B38]" />
                  </div>
                  <div className="mt-3">
                    <div className="font-price-lg text-2xl text-[#1C1C19] font-bold">
                      {totalOrdersCount} <span className="text-sm font-normal text-[#7F7572]">Orders</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-[#725B38] font-semibold">
                      <Truck className="w-3.5 h-3.5" />
                      <span>{orders.length > 0 ? `${orders.filter((o) => o.status === 'delivered').length} delivered` : 'Awaiting storefront orders'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#EADECF] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[#7F7572] font-label-uppercase tracking-wider">
                    <span>Registered Patrons</span>
                    <Award className="w-5 h-5 text-[#725B38]" />
                  </div>
                  <div className="mt-3">
                    <div className="font-price-lg text-2xl text-[#1C1C19] font-bold">
                      {customers.length} <span className="text-sm font-normal text-[#7F7572]">Patrons</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-purple-700 font-semibold">
                      <Repeat className="w-3.5 h-3.5" />
                      <span>Platform registered</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#EADECF] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[#7F7572] font-label-uppercase tracking-wider">
                    <span>Logistics Success</span>
                    <ShieldCheck className="w-5 h-5 text-[#725B38]" />
                  </div>
                  <div className="mt-3">
                    <div className="font-price-lg text-2xl text-[#1C1C19] font-bold">
                      {orders.length > 0
                        ? `${Math.round(((orders.length - orders.filter((o) => o.status === 'cancelled').length) / orders.length) * 100)}%`
                        : '100%'}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Zero transit damage</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Ribbon */}
              <div className="p-4 rounded-2xl bg-white border border-[#EADECF] flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#725B38]" />
                  <span className="text-xs font-semibold text-[#1C1C19]">Quick Administrative Actions:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveNav('shipping')}
                    className="px-3 py-1.5 rounded-xl bg-[#F7F3EE] hover:bg-[#EBE8E3] text-xs font-medium text-[#1C1C19] border border-[#EADECF] transition-colors flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5 text-[#725B38]" />
                    <span>Control Shipping Rules</span>
                  </button>
                  <button
                    onClick={() => setActiveNav('banners')}
                    className="px-3 py-1.5 rounded-xl bg-[#F7F3EE] hover:bg-[#EBE8E3] text-xs font-medium text-[#1C1C19] border border-[#EADECF] transition-colors flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#725B38]" />
                    <span>Drag & Drop Banners</span>
                  </button>
                  <button
                    onClick={() => setActiveNav('announcement')}
                    className="px-3 py-1.5 rounded-xl bg-[#F7F3EE] hover:bg-[#EBE8E3] text-xs font-medium text-[#1C1C19] border border-[#EADECF] transition-colors flex items-center gap-1.5"
                  >
                    <Megaphone className="w-3.5 h-3.5 text-[#725B38]" />
                    <span>Announcement Bar</span>
                  </button>
                  <button
                    onClick={handleOpenCreateProduct}
                    className="px-3 py-1.5 rounded-xl bg-[#1A1615] hover:bg-[#725B38] text-xs font-semibold text-white transition-colors"
                  >
                    + Add New Product
                  </button>
                  <button
                    onClick={handleClearAllOrders}
                    className="px-3 py-1.5 rounded-xl bg-[#F7F3EE] hover:bg-red-50 text-xs font-medium text-red-700 border border-[#EADECF] transition-colors flex items-center gap-1.5"
                    title="Clear all orders"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Clear Orders</span>
                  </button>
                </div>
              </div>

              {/* Recent Orders Logistics Table */}
              <div className="bg-white rounded-2xl border border-[#EADECF] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#EADECF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-headline-sm text-lg text-[#1C1C19] font-semibold">
                      Real-Time Courier Synch & Dispatches
                    </h3>
                    <p className="text-xs text-[#7F7572] mt-0.5">
                      Live dispatches synchronized with TCS Express, Leopard Courier, and Trax.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveNav('orders')}
                    className="text-xs font-semibold text-[#725B38] hover:underline flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>View all in Orders Manager</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F3EE] text-[#4E4543] font-label-uppercase text-[11px] tracking-wider border-b border-[#EADECF]">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer & City</th>
                        <th className="py-3 px-4">Courier & Tracking</th>
                        <th className="py-3 px-4">Formulations</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EADECF]/60">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-[#7F7572]">
                            <ShoppingBag className="w-8 h-8 text-[#725B38]/30 mx-auto mb-2" />
                            <p className="font-semibold text-sm text-[#1C1C19]">No Orders Placed Yet</p>
                            <p className="text-xs text-[#7F7572] mt-0.5">Real customer orders from the storefront will appear here in real time.</p>
                          </td>
                        </tr>
                      ) : (
                        orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FDF9F4] transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#1C1C19]">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-[#1C1C19]">{ord.customerName}</div>
                            <div className="text-[11px] text-[#7F7572]">{ord.city}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-[#725B38] flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5" />
                              {ord.courier}
                            </div>
                            <div className="font-mono text-[10px] text-[#7F7572]">{ord.trackingNumber}</div>
                          </td>
                          <td className="py-3.5 px-4 text-[#4E4543] max-w-[200px] truncate">
                            {ord.itemsSummary}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#1C1C19]">
                            Rs. {ord.totalAmount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : ord.status === 'in_transit'
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : ord.status === 'processing'
                                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                                  : 'bg-purple-100 text-purple-800 border-purple-300'
                              }`}
                            >
                              {ord.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrder(ord);
                                setActiveNav('orders');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#F7F3EE] hover:bg-[#EBE8E3] text-[#1C1C19] font-medium text-xs border border-[#EADECF]"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: ORDERS LOGISTICS & MANAGEMENT                    */}
          {/* ======================================================== */}
          {activeNav === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EADECF]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-label-uppercase text-[#725B38] tracking-widest font-semibold">
                    <span>Logistics Center</span>
                    <span>•</span>
                    <span>Pakistan Courier APIs</span>
                  </div>
                  <h1 className="font-headline-lg text-2xl text-[#1C1C19] mt-1 font-semibold">
                    Orders & Shipment Dispatch Manager
                  </h1>
                  <p className="text-xs text-[#7F7572] mt-0.5">
                    Update order dispatches, change courier statuses, and verify customer payments.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearAllOrders}
                    className="px-3.5 py-2 rounded-full bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Clear All Orders</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="px-3.5 py-2 rounded-full bg-white text-[#1C1C19] border border-[#EADECF] hover:bg-[#F7F3EE] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-[#725B38]" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {(['all', 'pending', 'processing', 'in_transit', 'delivered', 'cancelled'] as const).map((tab) => {
                  const count =
                    tab === 'all'
                      ? orders.length
                      : orders.filter((o) => o.status === tab).length;
                  return (
                    <button
                      key={tab}
                      onClick={() => setOrderFilter(tab)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all capitalize shrink-0 ${
                        orderFilter === tab
                          ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                          : 'bg-white text-[#4E4543] border border-[#EADECF] hover:bg-[#F7F3EE]'
                      }`}
                    >
                      {tab.replace('_', ' ')} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-[#EADECF] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F3EE] text-[#4E4543] font-label-uppercase text-[11px] tracking-wider border-b border-[#EADECF]">
                      <tr>
                        <th className="py-3 px-4">Order ID & Date</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">Courier & Tracking</th>
                        <th className="py-3 px-4">Total Amount</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Order Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EADECF]/60">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-[#7F7572]">
                            No orders found matching the selected filter.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-[#FDF9F4] transition-colors">
                            <td className="py-3.5 px-4 font-mono">
                              <div className="font-bold text-[#1C1C19]">{ord.orderNumber}</div>
                              <div className="text-[10px] text-[#7F7572] font-sans">{ord.date}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-[#1C1C19]">{ord.customerName}</div>
                              <div className="text-[11px] text-[#7F7572]">{ord.customerPhone}</div>
                              <div className="text-[10px] text-[#7F7572] truncate max-w-[180px]">{ord.city}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-[#725B38] flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5" />
                                {ord.courier}
                              </div>
                              <div className="font-mono text-[10px] text-[#7F7572]">{ord.trackingNumber}</div>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-[#1C1C19]">
                              Rs. {ord.totalAmount.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-medium text-[#1C1C19] block">{ord.paymentMethod}</span>
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase mt-0.5 ${
                                  ord.paymentStatus === 'verified'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {ord.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={ord.status}
                                onChange={(e) =>
                                  handleUpdateOrderStatus(ord.id, e.target.value as AdminOrder['status'])
                                }
                                className="px-2.5 py-1 text-xs rounded-lg border border-[#EADECF] bg-[#F7F3EE] font-semibold text-[#1C1C19] focus:outline-none focus:border-[#725B38]"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="in_transit">In Transit</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="px-3 py-1.5 rounded-lg bg-[#1A1615] text-white hover:bg-[#725B38] transition-colors text-xs font-semibold"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Details Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl border border-[#EADECF] max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-[#EADECF]">
                      <div>
                        <span className="text-[10px] font-label-uppercase text-[#725B38] font-bold">
                          Order Details
                        </span>
                        <h3 className="font-headline-sm text-lg font-bold text-[#1C1C19]">
                          {selectedOrder.orderNumber}
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="p-1 rounded-lg text-[#7F7572] hover:bg-[#F7F3EE]"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F7F3EE] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1C1C19]">{selectedOrder.customerName}</span>
                        <span className="font-mono text-[#725B38]">{selectedOrder.customerPhone}</span>
                      </div>
                      <div className="text-[#4E4543]">{selectedOrder.customerEmail}</div>
                      <div className="text-[#7F7572] text-[11px] pt-1 border-t border-[#EADECF]">
                        <MapPin className="w-3.5 h-3.5 inline mr-1 text-[#725B38]" />
                        {selectedOrder.address}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-label-uppercase text-[#7F7572] font-semibold">
                        Ordered Formulations
                      </span>
                      <div className="space-y-1.5 divide-y divide-[#EADECF]/60">
                        {selectedOrder.itemsList.map((it, idx) => (
                          <div key={idx} className="pt-1.5 flex items-center justify-between text-xs">
                            <span className="text-[#1C1C19] font-medium">
                              {it.name} <span className="text-[#7F7572]">x{it.quantity}</span>
                            </span>
                            <span className="font-bold text-[#1C1C19]">
                              Rs. {(it.price * it.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-[#EADECF] flex items-center justify-between text-sm font-bold text-[#1C1C19]">
                        <span>Grand Total (PKR)</span>
                        <span className="text-[#725B38]">Rs. {selectedOrder.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#EADECF]">
                      <span className="text-[11px] font-label-uppercase text-[#7F7572] font-semibold">
                        Update Dispatch Status
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={selectedOrder.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(
                              selectedOrder.id,
                              e.target.value as AdminOrder['status']
                            )
                          }
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#EADECF] bg-[#F7F3EE] font-semibold text-[#1C1C19]"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="in_transit">In Transit (Dispatched)</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#F7F3EE] border border-[#EADECF] text-xs font-mono">
                          <Truck className="w-3.5 h-3.5 text-[#725B38]" />
                          <span>{selectedOrder.trackingNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EADECF]">
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="px-4 py-2 rounded-xl bg-[#1A1615] text-white text-xs font-semibold hover:bg-[#725B38] transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 3: PRODUCTS & CATALOG MANAGEMENT                     */}
          {/* ======================================================== */}
          {activeNav === 'products' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EADECF]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-label-uppercase text-[#725B38] tracking-widest font-semibold">
                    <span>Apothecary Catalog</span>
                    <span>•</span>
                    <span>Inventory Controls</span>
                  </div>
                  <h1 className="font-headline-lg text-2xl text-[#1C1C19] mt-1 font-semibold">
                    Products & Pricing Catalog
                  </h1>
                  <p className="text-xs text-[#7F7572] mt-0.5">
                    Create new formulations, update PKR prices, and adjust live warehouse inventory.
                  </p>
                </div>

                <button
                  onClick={handleOpenCreateProduct}
                  className="px-4 py-2 rounded-full bg-[#1A1615] text-white hover:bg-[#725B38] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Product</span>
                </button>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 text-xs">
                {(['all', 'women', 'men'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProductCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all capitalize ${
                      productCategoryFilter === cat
                        ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                        : 'bg-white text-[#4E4543] border border-[#EADECF] hover:bg-[#F7F3EE]'
                    }`}
                  >
                    {cat === 'all' ? 'All Catalog' : `${cat} Line`} (
                    {cat === 'all'
                      ? productsList.length
                      : productsList.filter((p) => p.category === cat).length}
                    )
                  </button>
                ))}
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-[#EADECF] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F3EE] text-[#4E4543] font-label-uppercase text-[11px] tracking-wider border-b border-[#EADECF]">
                      <tr>
                        <th className="py-3 px-4">Formulation</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">SKU</th>
                        <th className="py-3 px-4">Size</th>
                        <th className="py-3 px-4">Regular Price</th>
                        <th className="py-3 px-4">Sale Price</th>
                        <th className="py-3 px-4">Stock Units</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EADECF]/60">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-[#FDF9F4] transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-[#1C1C19]">
                            {prod.name}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBE8E3] text-[#725B38] uppercase">
                              {prod.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[#7F7572]">{prod.sku}</td>
                          <td className="py-3.5 px-4 text-[#4E4543]">{prod.size}</td>
                          <td className="py-3.5 px-4 text-[#7F7572] line-through">
                            Rs. {prod.price.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#1C1C19]">
                            Rs. {(prod.salePrice || prod.price).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold ${
                                  prod.stock < 30 ? 'text-red-700' : 'text-emerald-700'
                                }`}
                              >
                                {prod.stock}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleStockAdjust(prod.id, -5)}
                                  className="w-5 h-5 rounded bg-[#F7F3EE] hover:bg-[#EBE8E3] flex items-center justify-center font-bold text-xs"
                                  title="Deduct 5"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => handleStockAdjust(prod.id, 10)}
                                  className="w-5 h-5 rounded bg-[#F7F3EE] hover:bg-[#EBE8E3] flex items-center justify-center font-bold text-xs"
                                  title="Add 10"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="p-1.5 rounded-lg text-[#725B38] hover:bg-[#F7F3EE]"
                                title="Edit Product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add / Edit Product Modal */}
              {productModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl border border-[#EADECF] max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-in max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-[#EADECF]">
                      <h3 className="font-headline-sm text-lg font-bold text-[#1C1C19]">
                        {editingProduct ? 'Edit Formulation' : 'Create New Formulation SKU'}
                      </h3>
                      <button
                        onClick={() => setProductModalOpen(false)}
                        className="p-1 rounded-lg text-[#7F7572] hover:bg-[#F7F3EE]"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          Product Title
                        </label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g. 24K Gold Vitamin C Serum"
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] focus:outline-none focus:border-[#725B38]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-[#1C1C19] mb-1">Category</label>
                          <select
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value as 'women' | 'men')}
                            className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] focus:outline-none focus:border-[#725B38]"
                          >
                            <option value="women">Women Line</option>
                            <option value="men">Men Line</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold text-[#1C1C19] mb-1">Size</label>
                          <input
                            type="text"
                            required
                            value={formSize}
                            onChange={(e) => setFormSize(e.target.value)}
                            placeholder="e.g. 100ml / 50gm"
                            className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] focus:outline-none focus:border-[#725B38]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block font-semibold text-[#1C1C19] mb-1">SKU</label>
                          <input
                            type="text"
                            required
                            value={formSku}
                            onChange={(e) => setFormSku(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] font-mono focus:outline-none focus:border-[#725B38]"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#1C1C19] mb-1">
                            Price (PKR)
                          </label>
                          <input
                            type="number"
                            required
                            value={formPrice}
                            onChange={(e) => setFormPrice(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] focus:outline-none focus:border-[#725B38]"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#1C1C19] mb-1">
                            Sale Price (PKR)
                          </label>
                          <input
                            type="number"
                            value={formSalePrice}
                            onChange={(e) => setFormSalePrice(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] focus:outline-none focus:border-[#725B38]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          Initial Stock Units
                        </label>
                        <input
                          type="number"
                          required
                          value={formStock}
                          onChange={(e) => setFormStock(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] focus:outline-none focus:border-[#725B38]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          Botanical Description
                        </label>
                        <textarea
                          rows={3}
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          placeholder="Describe ingredients, benefits, and botanical notes..."
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] focus:outline-none focus:border-[#725B38]"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EADECF]">
                        <button
                          type="button"
                          onClick={() => setProductModalOpen(false)}
                          className="px-4 py-2 rounded-xl bg-[#F7F3EE] text-[#1C1C19] font-medium hover:bg-[#EBE8E3]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#1A1615] text-white font-semibold hover:bg-[#725B38] transition-colors shadow-sm"
                        >
                          {editingProduct ? 'Save Changes' : 'Create Product'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 4: SHIPPING & COURIER LOGISTICS (NEW REQUESTED)     */}
          {/* ======================================================== */}
          {activeNav === 'shipping' && (
            <div className="space-y-6 animate-fade-in max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EADECF]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-label-uppercase text-[#725B38] tracking-widest font-semibold">
                    <span>Logistics Infrastructure</span>
                    <span>•</span>
                    <span>Pakistan Shipping Control</span>
                  </div>
                  <h1 className="font-headline-lg text-2xl text-[#1C1C19] mt-1 font-semibold">
                    Shipping Rates, Thresholds & Regional Zones
                  </h1>
                  <p className="text-xs text-[#7F7572] mt-0.5">
                    Control standard and express shipping charges across Pakistan, free delivery eligibility, and courier integrations.
                  </p>
                </div>

                <button
                  onClick={handleSaveShippingConfig}
                  className="px-5 py-2 rounded-full bg-[#1A1615] text-white hover:bg-[#725B38] text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Shipping Rules</span>
                </button>
              </div>

              {/* Free Shipping Highlight Banner */}
              <div className="p-4 rounded-2xl bg-[#FEDEB2]/40 border border-[#FEDEB2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#725B38] text-white flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1C1C19] block text-sm">
                      Current Free Delivery Rule: Orders Over Rs. {shippingConfig.freeShippingThreshold.toLocaleString()}
                    </span>
                    <span className="text-[#7F7572]">
                      Customers with cart subtotal exceeding this threshold automatically receive complimentary shipping at checkout.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto bg-white px-3 py-1.5 rounded-xl border border-[#EADECF]">
                  <span className="font-semibold text-[#1C1C19]">Threshold:</span>
                  <input
                    type="number"
                    value={shippingConfig.freeShippingThreshold}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        freeShippingThreshold: Number(e.target.value),
                      })
                    }
                    className="w-24 px-2 py-1 rounded-lg border border-[#EADECF] font-bold text-[#725B38] bg-[#F7F3EE]"
                  />
                  <span className="text-[#7F7572]">PKR</span>
                </div>
              </div>

              {/* 3 Core Rate Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Standard Shipping */}
                <div className="bg-white p-5 rounded-2xl border border-[#EADECF] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-label-uppercase text-[11px] font-bold text-[#725B38]">
                      Standard Delivery
                    </span>
                    <Truck className="w-4 h-4 text-[#725B38]" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#7F7572] mb-1">Fee (PKR)</label>
                    <input
                      type="number"
                      value={shippingConfig.standardRate}
                      onChange={(e) =>
                        setShippingConfig({ ...shippingConfig, standardRate: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 rounded-xl border border-[#EADECF] bg-[#F7F3EE] font-bold text-lg text-[#1C1C19]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#7F7572] mb-1">Estimated Days</label>
                    <input
                      type="text"
                      value={shippingConfig.estimatedStandardDays}
                      onChange={(e) =>
                        setShippingConfig({
                          ...shippingConfig,
                          estimatedStandardDays: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl border border-[#EADECF] bg-[#F7F3EE] text-xs"
                    />
                  </div>
                </div>

                {/* Express / Same-Day */}
                <div className="bg-white p-5 rounded-2xl border border-[#EADECF] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-label-uppercase text-[11px] font-bold text-[#725B38]">
                      Express Urgent
                    </span>
                    <input
                      type="checkbox"
                      checked={shippingConfig.expressEnabled}
                      onChange={(e) =>
                        setShippingConfig({ ...shippingConfig, expressEnabled: e.target.checked })
                      }
                      className="rounded border-[#EADECF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#7F7572] mb-1">Fee (PKR)</label>
                    <input
                      type="number"
                      value={shippingConfig.expressRate}
                      onChange={(e) =>
                        setShippingConfig({ ...shippingConfig, expressRate: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 rounded-xl border border-[#EADECF] bg-[#F7F3EE] font-bold text-lg text-[#1C1C19]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#7F7572] mb-1">Timeline & Scope</label>
                    <input
                      type="text"
                      value={shippingConfig.estimatedExpressDays}
                      onChange={(e) =>
                        setShippingConfig({
                          ...shippingConfig,
                          estimatedExpressDays: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl border border-[#EADECF] bg-[#F7F3EE] text-xs"
                    />
                  </div>
                </div>

                {/* COD Handling Fee */}
                <div className="bg-white p-5 rounded-2xl border border-[#EADECF] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-label-uppercase text-[11px] font-bold text-[#725B38]">
                      COD Surcharge
                    </span>
                    <CreditCard className="w-4 h-4 text-[#725B38]" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#7F7572] mb-1">Handling Fee (PKR)</label>
                    <input
                      type="number"
                      value={shippingConfig.codFee}
                      onChange={(e) =>
                        setShippingConfig({ ...shippingConfig, codFee: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 rounded-xl border border-[#EADECF] bg-[#F7F3EE] font-bold text-lg text-[#1C1C19]"
                    />
                  </div>
                  <p className="text-[11px] text-[#7F7572] pt-2">
                    Set to 0 for complimentary cash-on-delivery collection across Pakistan.
                  </p>
                </div>
              </div>

              {/* Regional Shipping Zones */}
              <div className="bg-white rounded-2xl border border-[#EADECF] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#EADECF] flex items-center justify-between">
                  <div>
                    <h3 className="font-headline-sm text-base font-bold text-[#1C1C19]">
                      Pakistan Regional Shipping Zones
                    </h3>
                    <p className="text-xs text-[#7F7572]">
                      Tiered delivery tariffs based on regional destination tiers.
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-[#EADECF]/60">
                  {shippingConfig.zones.map((zone) => (
                    <div
                      key={zone.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FDF9F4] transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#1C1C19]">{zone.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              zone.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {zone.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-xs text-[#7F7572]">{zone.cities}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-[#1C1C19]">Rate:</span>
                          <input
                            type="number"
                            value={zone.rate}
                            onChange={(e) => handleUpdateZoneRate(zone.id, Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs rounded-lg border border-[#EADECF] bg-[#F7F3EE] font-bold text-[#725B38]"
                          />
                          <span className="text-xs text-[#7F7572]">PKR</span>
                        </div>

                        <span className="text-xs text-[#4E4543] font-mono bg-[#EBE8E3] px-2.5 py-1 rounded-lg">
                          {zone.deliveryDays}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleZone(zone.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                            zone.isActive
                              ? 'border-red-200 text-red-600 hover:bg-red-50'
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {zone.isActive ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courier Partner Integrations */}
              <div className="bg-white rounded-2xl border border-[#EADECF] shadow-sm p-6 space-y-4">
                <div className="border-b border-[#EADECF] pb-3">
                  <h3 className="font-headline-sm text-base font-bold text-[#1C1C19]">
                    Courier Partner Dispatches & Tracking Links
                  </h3>
                  <p className="text-xs text-[#7F7572]">
                    Connect your merchant accounts with major courier services across Pakistan.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {shippingConfig.couriers.map((cour) => (
                    <div
                      key={cour.id}
                      className="p-4 rounded-xl border border-[#EADECF] bg-[#F7F3EE]/40 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#725B38]" />
                          <span className="font-bold text-[#1C1C19]">{cour.name}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={cour.isActive}
                          onChange={() => handleToggleCourier(cour.id)}
                          className="rounded border-[#EADECF]"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[#7F7572] pt-1">
                        <span>Merchant ID:</span>
                        <span className="font-mono text-[#1C1C19] font-semibold">{cour.accountNumber}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 5: DRAG & DROP HERO & BANNERS STUDIO (NEW REQUESTED)*/}
          {/* ======================================================== */}
          {activeNav === 'banners' && (
            <div className="space-y-6 animate-fade-in max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EADECF]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-label-uppercase text-[#725B38] tracking-widest font-semibold">
                    <span>Visual Experience Studio</span>
                    <span>•</span>
                    <span>Live Banner Customizer</span>
                  </div>
                  <h1 className="font-headline-lg text-2xl text-[#1C1C19] mt-1 font-semibold">
                    Drag & Drop Hero & Page Banners
                  </h1>
                  <p className="text-xs text-[#7F7572] mt-0.5">
                    Drag images directly from your computer to customize the Home Hero, Women, Men, and Shop banners.
                  </p>
                </div>

                <button
                  onClick={handleSaveAllBanners}
                  className="px-5 py-2 rounded-full bg-[#1A1615] text-white hover:bg-[#725B38] text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish All Banners Live</span>
                </button>
              </div>

              {/* Section Sub-Navigation */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'home', label: 'Home Page Hero Montage' },
                  { id: 'women', label: 'Women Collection Banner' },
                  { id: 'men', label: 'Men Collection Banner' },
                  { id: 'shop', label: 'Shop Page Header' },
                  { id: 'ribbon', label: 'Top Announcement Ribbon' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveBannerTab(t.id as any)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all shrink-0 ${
                      activeBannerTab === t.id
                        ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                        : 'bg-white text-[#4E4543] border border-[#EADECF] hover:bg-[#F7F3EE]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* -------------------------------------------------- */}
              {/* SUBTAB 1: HOME HERO MONTAGE                       */}
              {/* -------------------------------------------------- */}
              {activeBannerTab === 'home' && (
                <div className="space-y-6">
                  {/* Live Interactive Preview Box */}
                  <div className="bg-white rounded-2xl border border-[#EADECF] shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#EADECF]">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#725B38]" />
                        <span className="font-label-uppercase text-xs font-bold text-[#1C1C19]">
                          Live Homepage Hero Preview
                        </span>
                      </div>
                      <button
                        onClick={handleSwapHeroVisuals}
                        className="px-3 py-1.5 rounded-lg bg-[#F7F3EE] hover:bg-[#EBE8E3] text-xs font-semibold text-[#725B38] border border-[#EADECF] flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Swap Left / Right Visuals</span>
                      </button>
                    </div>

                    {/* Preview Canvas */}
                    <div className="p-6 rounded-2xl bg-[#FDF9F4] border border-[#EADECF] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      <div className="lg:col-span-6 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBE8E3] text-[10px] font-bold text-[#4E4543] border border-[#EADECF]">
                          <span className="w-2 h-2 rounded-full bg-[#CCA730] animate-pulse" />
                          <span>{bannerStore.homeHero.badge}</span>
                        </div>

                        <h2 className="font-display-lg text-2xl sm:text-3xl text-[#1C1C19] leading-snug">
                          {bannerStore.homeHero.title}{' '}
                          <span className="italic font-normal text-[#725B38]">
                            {bannerStore.homeHero.titleHighlight}
                          </span>
                        </h2>

                        <p className="text-xs text-[#4E4543] leading-relaxed line-clamp-3">
                          {bannerStore.homeHero.subtitle}
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                          <span className="px-4 py-2 rounded-full bg-[#725B38] text-white text-[10px] font-bold uppercase tracking-wider">
                            {bannerStore.homeHero.primaryCtaLabel}
                          </span>
                          <span className="px-4 py-2 rounded-full bg-[#1F1B1A] text-white text-[10px] font-bold uppercase tracking-wider">
                            {bannerStore.homeHero.secondaryCtaLabel}
                          </span>
                        </div>
                      </div>

                      <div className="lg:col-span-6">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden grid grid-cols-2 shadow-lg border border-[#EADECF]">
                          <div className="relative h-full">
                            <Image
                              src={bannerStore.homeHero.primaryImage}
                              alt="Primary hero"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3 text-white text-[10px] font-bold">
                              Women Line
                            </div>
                          </div>
                          <div className="relative h-full bg-[#14171C]">
                            <Image
                              src={bannerStore.homeHero.secondaryImage}
                              alt="Secondary hero"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3 text-white text-[10px] font-bold">
                              Men Line
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dual Drag & Drop Zones */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Dropzone 1: Women Visual */}
                    <div
                      onDragOver={(e) => handleDragOver(e, 'homePrimary')}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDropImage(e, 'homePrimary')}
                      className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer ${
                        isDraggingOver === 'homePrimary'
                          ? 'border-[#725B38] bg-[#FEDEB2]/30 scale-[1.01]'
                          : 'border-[#EADECF] bg-white hover:border-[#725B38]'
                      }`}
                      onClick={() => triggerFilePicker('homePrimary')}
                    >
                      <UploadCloud className="w-8 h-8 text-[#725B38]" />
                      <div>
                        <span className="font-bold text-xs text-[#1C1C19] block">
                          Drop Left Visual (Women Line)
                        </span>
                        <span className="text-[11px] text-[#7F7572]">
                          Drag & drop JPG, PNG, WEBP, or click to browse
                        </span>
                      </div>
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#EADECF] mt-2 shadow-sm">
                        <Image
                          src={bannerStore.homeHero.primaryImage}
                          alt="Left visual"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Dropzone 2: Men Visual */}
                    <div
                      onDragOver={(e) => handleDragOver(e, 'homeSecondary')}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDropImage(e, 'homeSecondary')}
                      className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer ${
                        isDraggingOver === 'homeSecondary'
                          ? 'border-[#725B38] bg-[#FEDEB2]/30 scale-[1.01]'
                          : 'border-[#EADECF] bg-white hover:border-[#725B38]'
                      }`}
                      onClick={() => triggerFilePicker('homeSecondary')}
                    >
                      <UploadCloud className="w-8 h-8 text-[#725B38]" />
                      <div>
                        <span className="font-bold text-xs text-[#1C1C19] block">
                          Drop Right Visual (Men Line)
                        </span>
                        <span className="text-[11px] text-[#7F7572]">
                          Drag & drop JPG, PNG, WEBP, or click to browse
                        </span>
                      </div>
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#EADECF] mt-2 shadow-sm">
                        <Image
                          src={bannerStore.homeHero.secondaryImage}
                          alt="Right visual"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preset Quick Selectors */}
                  <div className="bg-white p-5 rounded-2xl border border-[#EADECF] space-y-3 shadow-sm text-xs">
                    <span className="font-bold text-[#1C1C19] block">
                      Or Choose from Curated Luxury Apothecary Presets:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {BANNER_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            applyImageToField('homePrimary', preset.url);
                            showToast(`Applied preset to Women visual!`);
                          }}
                          className="p-2 rounded-xl border border-[#EADECF] hover:border-[#725B38] flex flex-col items-center gap-2 text-left group transition-all"
                        >
                          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                            <Image src={preset.url} alt={preset.title} fill className="object-cover" />
                          </div>
                          <span className="text-[10px] font-medium text-[#4E4543] line-clamp-1 group-hover:text-[#725B38]">
                            {preset.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Typography & CTA Controls */}
                  <div className="bg-white p-6 rounded-2xl border border-[#EADECF] space-y-4 shadow-sm text-xs">
                    <h3 className="font-headline-sm text-sm font-bold text-[#1C1C19] pb-3 border-b border-[#EADECF]">
                      Headline, Subtitle & Button Labels
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">Badge Text</label>
                        <input
                          type="text"
                          value={bannerStore.homeHero.badge}
                          onChange={(e) =>
                            setBannerStore({
                              ...bannerStore,
                              homeHero: { ...bannerStore.homeHero, badge: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">Main Headline</label>
                        <input
                          type="text"
                          value={bannerStore.homeHero.title}
                          onChange={(e) =>
                            setBannerStore({
                              ...bannerStore,
                              homeHero: { ...bannerStore.homeHero, title: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          Headline Italic Highlight
                        </label>
                        <input
                          type="text"
                          value={bannerStore.homeHero.titleHighlight}
                          onChange={(e) =>
                            setBannerStore({
                              ...bannerStore,
                              homeHero: { ...bannerStore.homeHero, titleHighlight: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          Primary CTA Label
                        </label>
                        <input
                          type="text"
                          value={bannerStore.homeHero.primaryCtaLabel}
                          onChange={(e) =>
                            setBannerStore({
                              ...bannerStore,
                              homeHero: { ...bannerStore.homeHero, primaryCtaLabel: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          Subtitle Paragraph
                        </label>
                        <textarea
                          rows={2}
                          value={bannerStore.homeHero.subtitle}
                          onChange={(e) =>
                            setBannerStore({
                              ...bannerStore,
                              homeHero: { ...bannerStore.homeHero, subtitle: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------- */}
              {/* SUBTAB 2, 3, 4: PAGE BANNERS (WOMEN / MEN / SHOP) */}
              {/* -------------------------------------------------- */}
              {(activeBannerTab === 'women' || activeBannerTab === 'men' || activeBannerTab === 'shop') && (
                <div className="space-y-6">
                  {/* Current Active Page Banner */}
                  {(() => {
                    const pageKey = activeBannerTab;
                    const banner = bannerStore.pageBanners[pageKey];

                    return (
                      <>
                        {/* Live Banner Preview */}
                        <div className="bg-white rounded-2xl border border-[#EADECF] p-6 shadow-sm space-y-4">
                          <span className="font-label-uppercase text-xs font-bold text-[#725B38] block">
                            Live {banner.pageName} Header Preview
                          </span>

                          <div
                            className={`relative rounded-2xl overflow-hidden p-8 sm:p-12 border ${
                              pageKey === 'men'
                                ? 'bg-[#14171C] text-white border-[#2E3540]'
                                : 'bg-[#FAF0F2] text-[#3A2A33] border-[#EED7DC]'
                            }`}
                          >
                            <div className="relative z-10 max-w-xl space-y-3">
                              <span className="inline-block px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[10px] font-bold text-[#725B38]">
                                {banner.badge}
                              </span>
                              <h2 className="font-display-lg text-2xl sm:text-4xl leading-tight">
                                {banner.title}{' '}
                                <span className="italic font-normal opacity-85">
                                  {banner.titleHighlight}
                                </span>
                              </h2>
                              <p className="text-xs opacity-80 leading-relaxed line-clamp-3">
                                {banner.subtitle}
                              </p>
                            </div>

                            {/* Background Image Preview */}
                            <div className="absolute top-0 right-0 bottom-0 w-1/2 opacity-60 pointer-events-none">
                              <Image
                                src={banner.imageUrl}
                                alt="Banner background"
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Drag and Drop Upload Card */}
                        <div
                          onDragOver={(e) => handleDragOver(e, pageKey)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDropImage(e, pageKey)}
                          className={`p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer ${
                            isDraggingOver === pageKey
                              ? 'border-[#725B38] bg-[#FEDEB2]/30 scale-[1.01]'
                              : 'border-[#EADECF] bg-white hover:border-[#725B38]'
                          }`}
                          onClick={() => triggerFilePicker(pageKey)}
                        >
                          <UploadCloud className="w-10 h-10 text-[#725B38]" />
                          <div>
                            <span className="font-bold text-sm text-[#1C1C19] block">
                              Drag & Drop Image for {banner.pageName}
                            </span>
                            <span className="text-xs text-[#7F7572]">
                              Drop JPG, PNG, WEBP from your desktop, or click to browse
                            </span>
                          </div>
                          <div className="relative w-36 h-24 rounded-xl overflow-hidden border border-[#EADECF] mt-2 shadow-md">
                            <Image
                              src={banner.imageUrl}
                              alt="Active banner"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>

                        {/* Image URL Manual Input */}
                        <div className="bg-white p-4 rounded-xl border border-[#EADECF] flex items-center gap-3 text-xs">
                          <span className="font-semibold text-[#1C1C19] whitespace-nowrap">
                            Or Paste Direct Image URL:
                          </span>
                          <input
                            type="text"
                            value={banner.imageUrl}
                            onChange={(e) => applyImageToField(pageKey, e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-[#EADECF] bg-[#F7F3EE] font-mono text-[11px]"
                          />
                        </div>

                        {/* Text Customizer Form */}
                        <div className="bg-white p-6 rounded-2xl border border-[#EADECF] space-y-4 text-xs shadow-sm">
                          <h3 className="font-headline-sm text-sm font-bold text-[#1C1C19] pb-3 border-b border-[#EADECF]">
                            Edit Banner Typography
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-semibold text-[#1C1C19] mb-1">Badge</label>
                              <input
                                type="text"
                                value={banner.badge}
                                onChange={(e) =>
                                  setBannerStore({
                                    ...bannerStore,
                                    pageBanners: {
                                      ...bannerStore.pageBanners,
                                      [pageKey]: { ...banner, badge: e.target.value },
                                    },
                                  })
                                }
                                className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                              />
                            </div>
                            <div>
                              <label className="block font-semibold text-[#1C1C19] mb-1">Headline</label>
                              <input
                                type="text"
                                value={banner.title}
                                onChange={(e) =>
                                  setBannerStore({
                                    ...bannerStore,
                                    pageBanners: {
                                      ...bannerStore.pageBanners,
                                      [pageKey]: { ...banner, title: e.target.value },
                                    },
                                  })
                                }
                                className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block font-semibold text-[#1C1C19] mb-1">
                                Subtitle Paragraph
                              </label>
                              <textarea
                                rows={2}
                                value={banner.subtitle}
                                onChange={(e) =>
                                  setBannerStore({
                                    ...bannerStore,
                                    pageBanners: {
                                      ...bannerStore.pageBanners,
                                      [pageKey]: { ...banner, subtitle: e.target.value },
                                    },
                                  })
                                }
                                className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* -------------------------------------------------- */}
              {/* SUBTAB 5: TOP PROMOTIONAL RIBBON                  */}
              {/* -------------------------------------------------- */}
              {activeBannerTab === 'ribbon' && (
                <div className="bg-white p-6 rounded-2xl border border-[#EADECF] shadow-sm space-y-4 text-xs">
                  <h3 className="font-headline-sm text-sm font-bold text-[#1C1C19] pb-3 border-b border-[#EADECF]">
                    Top Announcement Ribbon Customizer
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="ribbonActive"
                        checked={bannerStore.promoRibbon.isActive}
                        onChange={(e) =>
                          setBannerStore({
                            ...bannerStore,
                            promoRibbon: { ...bannerStore.promoRibbon, isActive: e.target.checked },
                          })
                        }
                        className="rounded border-[#EADECF]"
                      />
                      <label htmlFor="ribbonActive" className="font-bold text-[#1C1C19]">
                        Display Ribbon at the very top of all store pages
                      </label>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1C1C19] mb-1">Ribbon Text</label>
                      <input
                        type="text"
                        value={bannerStore.promoRibbon.text}
                        onChange={(e) =>
                          setBannerStore({
                            ...bannerStore,
                            promoRibbon: { ...bannerStore.promoRibbon, text: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW: TOP ANNOUNCEMENT BAR STUDIO                        */}
          {/* ======================================================== */}
          {activeNav === 'announcement' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header with Title & Save Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EADECF]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-label-uppercase text-[#725B38] tracking-widest font-semibold">
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Storefront Header Notification</span>
                    <span>•</span>
                    <span>All Pages</span>
                  </div>
                  <h1 className="font-headline-lg text-2xl text-[#1C1C19] mt-1 font-semibold">
                    Top Announcement Bar Studio
                  </h1>
                  <p className="text-xs text-[#7F7572] mt-0.5">
                    Customize the global top announcement strip, promotional message, colors, cities tag, and care phone.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#EADECF] text-xs">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        storeSettings.bannerActive !== false ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'
                      }`}
                    />
                    <span className="font-semibold text-[#1C1C19]">
                      {storeSettings.bannerActive !== false ? 'Live on Store' : 'Strip Hidden'}
                    </span>
                  </div>

                  <button
                    onClick={handleSaveAnnouncementBar}
                    className="px-5 py-2 rounded-full bg-[#1A1615] text-white hover:bg-[#725B38] text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save &amp; Publish Bar</span>
                  </button>
                </div>
              </div>

              {/* LIVE REAL-TIME PREVIEW WINDOW */}
              <div className="bg-[#1C1C19] rounded-2xl p-4 sm:p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-white/70 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                    </div>
                    <span className="font-mono text-[11px] text-white/50 pl-2">
                      https://ebaskincare.pk/ [Header Live Preview]
                    </span>
                  </div>

                  {/* Device Preview Toggle */}
                  <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg">
                    <button
                      onClick={() => setAnnouncementPreviewDevice('desktop')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                        announcementPreviewDevice === 'desktop'
                          ? 'bg-white text-[#1C1C19] shadow-sm font-semibold'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Desktop Bar
                    </button>
                    <button
                      onClick={() => setAnnouncementPreviewDevice('mobile')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                        announcementPreviewDevice === 'mobile'
                          ? 'bg-white text-[#1C1C19] shadow-sm font-semibold'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Mobile Preview
                    </button>
                  </div>
                </div>

                {/* Simulated Announcement Bar */}
                <div className="transition-all duration-300">
                  {storeSettings.bannerActive === false ? (
                    <div className="py-6 px-4 rounded-xl bg-white/5 border border-dashed border-white/20 text-center text-white/50 text-xs">
                      [Announcement Bar is currently disabled and hidden from customers]
                    </div>
                  ) : announcementPreviewDevice === 'desktop' ? (
                    <div
                      className="px-6 py-2.5 rounded-xl border border-white/15 transition-all flex items-center justify-between text-[11px] tracking-wider font-label-uppercase font-medium shadow-md"
                      style={{
                        backgroundColor: storeSettings.announcementBgColor || '#1A1615',
                        color: storeSettings.announcementTextColor || '#F7F3EE',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          style={{ color: storeSettings.announcementAccentColor || '#FFE088' }}
                          className="font-bold tracking-widest"
                        >
                          {storeSettings.currency || 'PKR'} Rs.
                        </span>
                        <span className="opacity-40">|</span>
                        <span className="opacity-80">
                          {storeSettings.announcementLeftTag || 'Karachi • Lahore • Islamabad'}
                        </span>
                      </div>

                      <div className="text-center font-medium text-xs px-4">
                        {storeSettings.announcementTicker ? (
                          <span className="inline-block animate-pulse font-semibold">
                            {storeSettings.announcementBanner}
                          </span>
                        ) : (
                          storeSettings.announcementBanner
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          style={{ color: storeSettings.announcementAccentColor || '#FFE088' }}
                          className="font-semibold underline"
                        >
                          {storeSettings.announcementRightText || storeSettings.supportPhone || '+92 300 1234567'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="max-w-xs mx-auto px-4 py-2.5 rounded-xl border border-white/15 text-center text-[10px] tracking-wide font-medium shadow-md space-y-1"
                      style={{
                        backgroundColor: storeSettings.announcementBgColor || '#1A1615',
                        color: storeSettings.announcementTextColor || '#F7F3EE',
                      }}
                    >
                      <div className="font-semibold">
                        {storeSettings.announcementBanner}
                      </div>
                      <div
                        style={{ color: storeSettings.announcementAccentColor || '#FFE088' }}
                        className="text-[9px] font-bold"
                      >
                        {storeSettings.announcementRightText || storeSettings.supportPhone || '+92 300 1234567'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 1-CLICK CURATED LUXURY PRESETS */}
              <div className="bg-white p-6 rounded-2xl border border-[#EADECF] shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EADECF]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#725B38]" />
                    <h3 className="font-headline-sm text-sm font-bold text-[#1C1C19]">
                      1-Click Curated Luxury Presets
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#7F7572]">Click to apply immediately</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    {
                      title: 'Free Shipping Pakistan',
                      desc: 'Threshold reminder for complimentary courier delivery across all provinces',
                      banner: '✦ COMPLIMENTARY EXPRESS DELIVERY ON ORDERS OVER RS. 3,500 ACROSS PAKISTAN ✦',
                      leftTag: 'Karachi • Lahore • Islamabad',
                      rightText: 'Care: +92 300 1234567',
                      rightLink: 'tel:+923001234567',
                      bg: '#1A1615',
                      text: '#F7F3EE',
                      accent: '#FFE088',
                    },
                    {
                      title: 'Welcome 10% Voucher',
                      desc: 'Promote first order coupon code EBAWELCOME',
                      banner: '🌿 ENJOY 10% OFF YOUR FIRST APOTHECARY ORDER WITH CODE: EBAWELCOME 🌿',
                      leftTag: 'First Order Privilege',
                      rightText: 'Shop New Arrivals',
                      rightLink: '/shop',
                      bg: '#0D2818',
                      text: '#F2F9F4',
                      accent: '#82D0A5',
                    },
                    {
                      title: 'Complimentary Travel Gift',
                      desc: 'Incentivize multi-product routine purchases with a gift',
                      banner: '✨ BUY ANY 2 BOTANICAL ELIXIRS & RECEIVE A FREE DAMASK ROSE HYDROSOL ✨',
                      leftTag: 'Limited Time Gift',
                      rightText: 'Explore Collection',
                      rightLink: '/women',
                      bg: '#2A0C16',
                      text: '#FDF5F7',
                      accent: '#F0B2BE',
                    },
                    {
                      title: 'Urgent Metro Dispatch',
                      desc: 'Highlight fast 24h delivery times for Lahore & Karachi customers',
                      banner: '⚡ 24–36 HOUR PRIORITY DELIVERY IN LAHORE & KARACHI VIA TCS EXPRESS ⚡',
                      leftTag: 'Same-Day Dispatch',
                      rightText: 'Track Order',
                      rightLink: '/shop',
                      bg: '#725B38',
                      text: '#FFFFFF',
                      accent: '#FFF0CE',
                    },
                    {
                      title: 'Obsidian Men Regimen',
                      desc: 'Promote new launch of men grooming & charcoal wash line',
                      banner: '⚔️ HIGH-PERFORMANCE OBSIDIAN SLATE GROOMING FORMULATIONS LIVE FOR MEN ⚔️',
                      leftTag: 'Obsidian Regimen',
                      rightText: "Men's Collection",
                      rightLink: '/men',
                      bg: '#0A0C0E',
                      text: '#E6E2DD',
                      accent: '#9AC5E8',
                    },
                    {
                      title: 'Eid / Seasonal Gifting',
                      desc: 'Curated packaging for festivities and seasonal celebrations',
                      banner: '🎁 BESPOKE BOTANICAL GIFT BOXES & SENSORIAL LUXURY PACKAGING INCLUDED 🎁',
                      leftTag: 'Celebration Privileges',
                      rightText: 'View Gift Sets',
                      rightLink: '/shop',
                      bg: '#1A1615',
                      text: '#F7F3EE',
                      accent: '#FFE088',
                    },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setStoreSettings({
                          ...storeSettings,
                          announcementBanner: preset.banner,
                          announcementLeftTag: preset.leftTag,
                          announcementRightText: preset.rightText,
                          announcementRightLink: preset.rightLink,
                          announcementBgColor: preset.bg,
                          announcementTextColor: preset.text,
                          announcementAccentColor: preset.accent,
                          bannerActive: true,
                        });
                        showToast(`Loaded preset: "${preset.title}"! Click Save to publish.`);
                      }}
                      className="p-3.5 rounded-xl border border-[#EADECF] hover:border-[#725B38] bg-[#FDF9F4] hover:bg-white text-left transition-all space-y-1.5 group shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#1C1C19] group-hover:text-[#725B38]">
                          {preset.title}
                        </span>
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: preset.bg }}
                        />
                      </div>
                      <p className="text-[11px] text-[#7F7572] leading-snug line-clamp-2">
                        {preset.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* CORE ANNOUNCEMENT BAR CONTROLS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Card: Text & Formatting */}
                <div className="bg-white p-6 rounded-2xl border border-[#EADECF] shadow-sm space-y-5 text-xs">
                  <h3 className="font-headline-sm text-sm font-bold text-[#1C1C19] pb-3 border-b border-[#EADECF]">
                    Announcement Message &amp; Content
                  </h3>

                  {/* Master Visibility Switch */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F3EE] border border-[#EADECF]">
                    <div>
                      <div className="font-bold text-[#1C1C19]">Master Display Status</div>
                      <div className="text-[11px] text-[#7F7572]">
                        Show or hide the top announcement strip across all store pages
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={storeSettings.bannerActive !== false}
                        onChange={(e) =>
                          setStoreSettings({ ...storeSettings, bannerActive: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A1615]"></div>
                    </label>
                  </div>

                  {/* Announcement Banner Text */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-[#1C1C19]">Main Announcement Message</label>
                      <span className="text-[10px] text-[#7F7572] font-mono">
                        {storeSettings.announcementBanner.length} characters
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={storeSettings.announcementBanner}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, announcementBanner: e.target.value })
                      }
                      placeholder="e.g. ✦ COMPLIMENTARY EXPRESS DELIVERY ON ORDERS OVER RS. 3,500 ACROSS PAKISTAN ✦"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADECF] bg-[#F7F3EE] text-xs focus:outline-none focus:border-[#725B38]"
                    />

                    {/* Emoji Inserters */}
                    <div className="flex items-center gap-1.5 pt-2 flex-wrap">
                      <span className="text-[10px] text-[#7F7572]">Insert Symbol:</span>
                      {['✦', '🌿', '✨', '⚡', '🎁', '🇵🇰', '💧', '🧪', '•', '|'].map((sym) => (
                        <button
                          key={sym}
                          type="button"
                          onClick={() =>
                            setStoreSettings({
                              ...storeSettings,
                              announcementBanner: `${storeSettings.announcementBanner} ${sym}`,
                            })
                          }
                          className="px-2 py-0.5 rounded-md bg-[#F7F3EE] hover:bg-[#EBE8E3] border border-[#EADECF] text-xs font-mono"
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ticker Animation Mode */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#FDF9F4] border border-[#EADECF]">
                    <div>
                      <div className="font-bold text-[#1C1C19]">Ticker / Pulse Animation</div>
                      <div className="text-[11px] text-[#7F7572]">
                        Draw subtle attention with soft breathing pulse animation
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!storeSettings.announcementTicker}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, announcementTicker: e.target.checked })
                      }
                      className="rounded border-[#EADECF] w-4 h-4 text-[#725B38]"
                    />
                  </div>

                  {/* Left Regional Tag */}
                  <div>
                    <label className="block font-semibold text-[#1C1C19] mb-1">
                      Left Regional Cities Tag
                    </label>
                    <input
                      type="text"
                      value={storeSettings.announcementLeftTag || ''}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, announcementLeftTag: e.target.value })
                      }
                      placeholder="e.g. Karachi • Lahore • Islamabad"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] text-xs focus:outline-none focus:border-[#725B38]"
                    />
                  </div>

                  {/* Right CTA Text & Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block font-semibold text-[#1C1C19] mb-1">
                        Right Action Label
                      </label>
                      <input
                        type="text"
                        value={storeSettings.announcementRightText || ''}
                        onChange={(e) =>
                          setStoreSettings({ ...storeSettings, announcementRightText: e.target.value })
                        }
                        placeholder="e.g. Care: +92 300 1234567"
                        className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1C1C19] mb-1">
                        Target Link / Phone
                      </label>
                      <input
                        type="text"
                        value={storeSettings.announcementRightLink || ''}
                        onChange={(e) =>
                          setStoreSettings({ ...storeSettings, announcementRightLink: e.target.value })
                        }
                        placeholder="e.g. tel:+923001234567 or /shop"
                        className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Card: Colors & Palettes */}
                <div className="bg-white p-6 rounded-2xl border border-[#EADECF] shadow-sm space-y-5 text-xs">
                  <h3 className="font-headline-sm text-sm font-bold text-[#1C1C19] pb-3 border-b border-[#EADECF]">
                    Color Aesthetics &amp; Palettes
                  </h3>

                  {/* 5 Luxury Theme Swatches */}
                  <div>
                    <label className="block font-semibold text-[#1C1C19] mb-2">
                      Pre-tailored Luxury Apothecary Palettes
                    </label>
                    <div className="space-y-2">
                      {[
                        {
                          name: 'Luxury Noir (Gold Accents)',
                          bg: '#1A1615',
                          text: '#F7F3EE',
                          accent: '#FFE088',
                        },
                        {
                          name: 'Imperial Botanical Forest (Jade)',
                          bg: '#0D2818',
                          text: '#F2F9F4',
                          accent: '#82D0A5',
                        },
                        {
                          name: 'Velvet Damask Rose (Rose Gold)',
                          bg: '#2A0C16',
                          text: '#FDF5F7',
                          accent: '#F0B2BE',
                        },
                        {
                          name: 'Travertine Amber Honey (Pure Cream)',
                          bg: '#725B38',
                          text: '#FFFFFF',
                          accent: '#FFF0CE',
                        },
                        {
                          name: 'Obsidian Slate (Ice Platinum)',
                          bg: '#0A0C0E',
                          text: '#E6E2DD',
                          accent: '#9AC5E8',
                        },
                      ].map((pal, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setStoreSettings({
                              ...storeSettings,
                              announcementBgColor: pal.bg,
                              announcementTextColor: pal.text,
                              announcementAccentColor: pal.accent,
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-[#EADECF] hover:border-[#1C1C19] flex items-center justify-between text-left transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <span
                                className="w-5 h-5 rounded-full border border-black/20"
                                style={{ backgroundColor: pal.bg }}
                              />
                              <span
                                className="w-5 h-5 rounded-full border border-black/20"
                                style={{ backgroundColor: pal.accent }}
                              />
                            </div>
                            <span className="font-semibold text-xs text-[#1C1C19]">
                              {pal.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#7F7572] font-mono">{pal.bg}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Hex Pickers */}
                  <div className="pt-2 border-t border-[#EADECF] space-y-3">
                    <label className="block font-semibold text-[#1C1C19]">
                      Custom Color Overrides
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#7F7572] mb-1">
                          Background
                        </label>
                        <div className="flex items-center gap-2 p-1.5 rounded-xl border border-[#EADECF] bg-[#F7F3EE]">
                          <input
                            type="color"
                            value={storeSettings.announcementBgColor || '#1A1615'}
                            onChange={(e) =>
                              setStoreSettings({
                                ...storeSettings,
                                announcementBgColor: e.target.value,
                              })
                            }
                            className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                          />
                          <span className="font-mono text-[10px] text-[#1C1C19]">
                            {storeSettings.announcementBgColor || '#1A1615'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#7F7572] mb-1">Text Color</label>
                        <div className="flex items-center gap-2 p-1.5 rounded-xl border border-[#EADECF] bg-[#F7F3EE]">
                          <input
                            type="color"
                            value={storeSettings.announcementTextColor || '#F7F3EE'}
                            onChange={(e) =>
                              setStoreSettings({
                                ...storeSettings,
                                announcementTextColor: e.target.value,
                              })
                            }
                            className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                          />
                          <span className="font-mono text-[10px] text-[#1C1C19]">
                            {storeSettings.announcementTextColor || '#F7F3EE'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#7F7572] mb-1">
                          Accent Gold
                        </label>
                        <div className="flex items-center gap-2 p-1.5 rounded-xl border border-[#EADECF] bg-[#F7F3EE]">
                          <input
                            type="color"
                            value={storeSettings.announcementAccentColor || '#FFE088'}
                            onChange={(e) =>
                              setStoreSettings({
                                ...storeSettings,
                                announcementAccentColor: e.target.value,
                              })
                            }
                            className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                          />
                          <span className="font-mono text-[10px] text-[#1C1C19]">
                            {storeSettings.announcementAccentColor || '#FFE088'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save button card footer */}
                  <div className="pt-4 border-t border-[#EADECF] flex items-center justify-between">
                    <span className="text-[11px] text-[#7F7572]">
                      Changes publish instantly across all pages
                    </span>
                    <button
                      onClick={handleSaveAnnouncementBar}
                      className="px-6 py-2.5 rounded-full bg-[#1A1615] text-white hover:bg-[#725B38] text-xs font-semibold transition-colors flex items-center gap-2 shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save &amp; Publish Bar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 6: COUPONS & PROMOTIONAL CODES                      */}
          {/* ======================================================== */}
          {activeNav === 'coupons' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EADECF]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-label-uppercase text-[#725B38] tracking-widest font-semibold">
                    <span>Marketing & Incentives</span>
                    <span>•</span>
                    <span>Promotional Engine</span>
                  </div>
                  <h1 className="font-headline-lg text-2xl text-[#1C1C19] mt-1 font-semibold">
                    Coupons & Promotional Codes
                  </h1>
                  <p className="text-xs text-[#7F7572] mt-0.5">
                    Issue promotional codes, percentage discounts, and order threshold incentives.
                  </p>
                </div>

                <button
                  onClick={() => setCouponModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-[#1A1615] text-white hover:bg-[#725B38] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create Promo Code</span>
                </button>
              </div>

              {/* Coupons Table */}
              <div className="bg-white rounded-2xl border border-[#EADECF] shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F3EE] text-[#4E4543] font-label-uppercase text-[11px] tracking-wider border-b border-[#EADECF]">
                    <tr>
                      <th className="py-3 px-4">Coupon Code</th>
                      <th className="py-3 px-4">Discount Value</th>
                      <th className="py-3 px-4">Minimum Order</th>
                      <th className="py-3 px-4">Redemptions</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EADECF]/60">
                    {coupons.map((cp) => (
                      <tr key={cp.id} className="hover:bg-[#FDF9F4] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#1C1C19] text-sm">
                          {cp.code}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#725B38]">
                          {cp.type === 'percentage' ? `${cp.value}% OFF` : `Rs. ${cp.value} OFF`}
                        </td>
                        <td className="py-3.5 px-4 text-[#4E4543]">
                          Rs. {cp.minOrder.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-[#7F7572]">
                          {cp.timesUsed} / {cp.usageLimit}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleCoupon(cp.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              cp.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {cp.isActive ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteCoupon(cp.id, cp.code)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Create Coupon Modal */}
              {couponModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl border border-[#EADECF] max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-in">
                    <div className="flex items-center justify-between pb-3 border-b border-[#EADECF]">
                      <h3 className="font-headline-sm text-lg font-bold text-[#1C1C19]">
                        Create New Coupon Code
                      </h3>
                      <button
                        onClick={() => setCouponModalOpen(false)}
                        className="p-1 rounded-lg text-[#7F7572] hover:bg-[#F7F3EE]"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          Coupon Code
                        </label>
                        <input
                          type="text"
                          required
                          value={newCouponCode}
                          onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                          placeholder="e.g. RAMADAN20"
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] font-mono font-bold uppercase focus:outline-none focus:border-[#725B38]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-[#1C1C19] mb-1">Type</label>
                          <select
                            value={newCouponType}
                            onChange={(e) =>
                              setNewCouponType(e.target.value as 'percentage' | 'fixed')
                            }
                            className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] focus:outline-none focus:border-[#725B38]"
                          >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed PKR (Rs.)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold text-[#1C1C19] mb-1">
                            Discount Value
                          </label>
                          <input
                            type="number"
                            required
                            value={newCouponVal}
                            onChange={(e) => setNewCouponVal(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] focus:outline-none focus:border-[#725B38]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          Minimum Order (PKR)
                        </label>
                        <input
                          type="number"
                          value={newCouponMin}
                          onChange={(e) => setNewCouponMin(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] focus:outline-none focus:border-[#725B38]"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EADECF]">
                        <button
                          type="button"
                          onClick={() => setCouponModalOpen(false)}
                          className="px-4 py-2 rounded-xl bg-[#F7F3EE] text-[#1C1C19] font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#1A1615] text-white font-semibold hover:bg-[#725B38]"
                        >
                          Create Coupon
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 7: PAKISTAN PAYMENT GATEWAYS                        */}
          {/* ======================================================== */}
          {activeNav === 'payments' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div className="pb-6 border-b border-[#EADECF]">
                <div className="flex items-center gap-2 text-xs font-label-uppercase text-[#725B38] tracking-widest font-semibold">
                  <span>Finance & Banking</span>
                  <span>•</span>
                  <span>Pakistan Payment Infrastructure</span>
                </div>
                <h1 className="font-headline-lg text-2xl text-[#1C1C19] mt-1 font-semibold">
                  Pakistan Payment Gateways Configuration
                </h1>
                <p className="text-xs text-[#7F7572] mt-0.5">
                  Configure Cash on Delivery rules, Direct Bank Transfer instructions, and Mobile Wallets.
                </p>
              </div>

              <form onSubmit={handleSavePaymentSettings} className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-[#EADECF] shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EADECF]">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-[#725B38]" />
                      <div>
                        <h3 className="font-headline-sm text-base font-bold text-[#1C1C19]">
                          Cash on Delivery (COD) Across Pakistan
                        </h3>
                        <p className="text-xs text-[#7F7572]">
                          Available via TCS Express, Leopard Courier, and Trax.
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentSettings.codEnabled}
                        onChange={(e) =>
                          setPaymentSettings({ ...paymentSettings, codEnabled: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#725B38]"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-[#1C1C19] mb-1">
                        Maximum Order Limit for COD (PKR)
                      </label>
                      <input
                        type="number"
                        value={paymentSettings.codMaxLimit}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            codMaxLimit: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="verifyCall"
                        checked={paymentSettings.codVerificationCall}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            codVerificationCall: e.target.checked,
                          })
                        }
                        className="rounded border-[#EADECF] text-[#725B38]"
                      />
                      <label htmlFor="verifyCall" className="font-medium text-[#1C1C19]">
                        Require phone confirmation call prior to dispatch
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#EADECF] shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EADECF]">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-[#725B38]" />
                      <div>
                        <h3 className="font-headline-sm text-base font-bold text-[#1C1C19]">
                          Direct Bank Wire (Meezan / HBL / Alfalah)
                        </h3>
                        <p className="text-xs text-[#7F7572]">
                          Display banking coordinates for customer direct deposits with receipt upload.
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentSettings.bankTransferEnabled}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            bankTransferEnabled: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#725B38]"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-[#1C1C19] mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={paymentSettings.bankName}
                        onChange={(e) =>
                          setPaymentSettings({ ...paymentSettings, bankName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1C1C19] mb-1">
                        Account Title
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.accountTitle}
                        onChange={(e) =>
                          setPaymentSettings({ ...paymentSettings, accountTitle: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1C1C19] mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.accountNumber}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            accountNumber: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1C1C19] mb-1">IBAN Number</label>
                      <input
                        type="text"
                        value={paymentSettings.iban}
                        onChange={(e) =>
                          setPaymentSettings({ ...paymentSettings, iban: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#EADECF] shadow-sm space-y-4">
                  <div className="pb-3 border-b border-[#EADECF]">
                    <h3 className="font-headline-sm text-base font-bold text-[#1C1C19]">
                      Pakistan Mobile Wallets (JazzCash & EasyPaisa)
                    </h3>
                    <p className="text-xs text-[#7F7572]">
                      Direct mobile numbers for instant mobile payment confirmation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    <div className="p-4 rounded-xl border border-[#EADECF] bg-[#F7F3EE]/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1C1C19]">JazzCash Merchant Wallet</span>
                        <input
                          type="checkbox"
                          checked={paymentSettings.jazzcashEnabled}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              jazzcashEnabled: e.target.checked,
                            })
                          }
                          className="rounded border-[#EADECF]"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#7F7572] mb-1">
                          Account Number / Mobile
                        </label>
                        <input
                          type="text"
                          value={paymentSettings.jazzcashAccount}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              jazzcashAccount: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#7F7572] mb-1">
                          Account Title
                        </label>
                        <input
                          type="text"
                          value={paymentSettings.jazzcashTitle || ''}
                          placeholder="e.g. EBA Skin Care or Ahmed Thor"
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              jazzcashTitle: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-white"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-[#EADECF] bg-[#F7F3EE]/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1C1C19]">EasyPaisa Wallet</span>
                        <input
                          type="checkbox"
                          checked={paymentSettings.easypaisaEnabled}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              easypaisaEnabled: e.target.checked,
                            })
                          }
                          className="rounded border-[#EADECF]"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#7F7572] mb-1">
                          Account Number / Mobile
                        </label>
                        <input
                          type="text"
                          value={paymentSettings.easypaisaAccount}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              easypaisaAccount: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#7F7572] mb-1">
                          Account Title
                        </label>
                        <input
                          type="text"
                          value={paymentSettings.easypaisaTitle || ''}
                          placeholder="e.g. EBA Skin Care or Ahmed Thor"
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              easypaisaTitle: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#1A1615] text-white hover:bg-[#725B38] font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Payment Gateways</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 8: PATRONS & VIP CLUB (CUSTOMERS)                   */}
          {/* ======================================================== */}
          {activeNav === 'customers' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EADECF]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-label-uppercase text-[#725B38] tracking-widest font-semibold">
                    <span>VIP Circle</span>
                    <span>•</span>
                    <span>Patron Profiles & Permissions</span>
                  </div>
                  <h1 className="font-headline-lg text-2xl text-[#1C1C19] mt-1 font-semibold">
                    Registered Patrons & Access Roles
                  </h1>
                  <p className="text-xs text-[#7F7572] mt-0.5">
                    View customer lifetime spend and manage administrator and staff roles.
                  </p>
                </div>
              </div>

              {/* Customers Table */}
              <div className="bg-white rounded-2xl border border-[#EADECF] shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F3EE] text-[#4E4543] font-label-uppercase text-[11px] tracking-wider border-b border-[#EADECF]">
                    <tr>
                      <th className="py-3 px-4">Patron</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">City</th>
                      <th className="py-3 px-4">Orders Placed</th>
                      <th className="py-3 px-4">Lifetime Spend</th>
                      <th className="py-3 px-4">Role Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EADECF]/60">
                    {filteredCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-[#FDF9F4] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#1A1615] text-[#FFE088] flex items-center justify-center font-bold text-xs">
                              {cust.fullName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-[#1C1C19]">{cust.fullName}</div>
                              <div className="text-[10px] text-[#7F7572]">Joined {cust.joinedAt}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <div className="text-[#1C1C19]">{cust.email}</div>
                          <div className="text-[11px] text-[#7F7572]">{cust.phone}</div>
                        </td>
                        <td className="py-3.5 px-4 text-[#4E4543]">{cust.city}</td>
                        <td className="py-3.5 px-4 font-semibold text-[#1C1C19]">
                          {cust.ordersCount} Orders
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#725B38]">
                          Rs. {cust.totalSpent.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={cust.role}
                            onChange={(e) =>
                              handleChangeCustomerRole(
                                cust.id,
                                e.target.value as AdminCustomer['role']
                              )
                            }
                            className={`px-2.5 py-1 text-xs rounded-lg border font-bold ${
                              cust.role === 'owner'
                                ? 'bg-[#1A1615] text-[#FFE088] border-[#1A1615]'
                                : cust.role === 'admin'
                                ? 'bg-[#725B38] text-white border-[#725B38]'
                                : 'bg-[#F7F3EE] text-[#1C1C19] border-[#EADECF]'
                            }`}
                          >
                            <option value="customer">Customer</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                            <option value="owner">Owner</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 9: STORE SETTINGS & LOGISTICS RULES                 */}
          {/* ======================================================== */}
          {activeNav === 'settings' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div className="pb-6 border-b border-[#EADECF]">
                <div className="flex items-center gap-2 text-xs font-label-uppercase text-[#725B38] tracking-widest font-semibold">
                  <span>Configuration</span>
                  <span>•</span>
                  <span>Global Brand Rules</span>
                </div>
                <h1 className="font-headline-lg text-2xl text-[#1C1C19] mt-1 font-semibold">
                  Store Operations & Brand Profile
                </h1>
                <p className="text-xs text-[#7F7572] mt-0.5">
                  Update customer service contact info, support hotline, and brand information.
                </p>
              </div>

              <form onSubmit={handleSaveStoreSettings} className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-[#EADECF] shadow-sm space-y-4">
                  <h3 className="font-headline-sm text-base font-bold text-[#1C1C19] pb-3 border-b border-[#EADECF]">
                    General Identity & Support Contact
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-[#1C1C19] mb-1">Store Name</label>
                      <input
                        type="text"
                        value={storeSettings.storeName}
                        onChange={(e) =>
                          setStoreSettings({ ...storeSettings, storeName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1C1C19] mb-1">
                        Customer Support WhatsApp
                      </label>
                      <input
                        type="text"
                        value={storeSettings.supportPhone}
                        onChange={(e) =>
                          setStoreSettings({ ...storeSettings, supportPhone: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-[#1C1C19] mb-1">
                        Brand Tagline
                      </label>
                      <input
                        type="text"
                        value={storeSettings.tagline}
                        onChange={(e) =>
                          setStoreSettings({ ...storeSettings, tagline: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#1A1615] text-white hover:bg-[#725B38] font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Store Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 10. CONTACT US & INQUIRIES MANAGEMENT VIEW */}
          {activeNav === 'contact' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#EADECF]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-label-uppercase tracking-wider text-[#725B38] font-bold">
                    <span>Client Concierge</span>
                    <span>•</span>
                    <span>Direct Channels & Form Inquiries</span>
                  </div>
                  <h1 className="font-headline-lg text-2xl text-[#1C1C19] mt-1 font-semibold">
                    Contact Us & Concierge Management
                  </h1>
                  <p className="text-xs text-[#7F7572] mt-0.5">
                    Manage client communication channels, support hotline, cleanroom locations, and review incoming patron inquiries.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href="/contact-us"
                    target="_blank"
                    className="px-4 py-2 rounded-full border border-[#EADECF] bg-white hover:bg-[#F7F3EE] text-[#1C1C19] text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#725B38]" />
                    <span>View Live Page</span>
                  </Link>
                </div>
              </div>

              {/* Sub-tabs Switcher */}
              <div className="flex flex-wrap items-center gap-2 border-b border-[#EADECF] pb-3 text-xs font-label-uppercase">
                <button
                  type="button"
                  onClick={() => setActiveContactTab('inquiries')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activeContactTab === 'inquiries'
                      ? 'bg-[#1A1615] text-white shadow-sm'
                      : 'bg-white text-[#4E4543] border border-[#EADECF] hover:bg-[#F7F3EE]'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Client Inquiries Inbox</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#FEDEB2] text-[#78603E] font-bold">
                    {contactInquiries.filter((i) => i.status === 'new').length} NEW
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveContactTab('channels')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activeContactTab === 'channels'
                      ? 'bg-[#1A1615] text-white shadow-sm'
                      : 'bg-white text-[#4E4543] border border-[#EADECF] hover:bg-[#F7F3EE]'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Channels & Concierge Info</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveContactTab('locations')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activeContactTab === 'locations'
                      ? 'bg-[#1A1615] text-white shadow-sm'
                      : 'bg-white text-[#4E4543] border border-[#EADECF] hover:bg-[#F7F3EE]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Cleanrooms & Boutiques ({contactConfig.locations?.length || 0})</span>
                </button>
              </div>

              {/* SUBTAB 1: INQUIRIES INBOX */}
              {activeContactTab === 'inquiries' && (
                <div className="space-y-4">
                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#EADECF] shadow-sm">
                    <div className="flex items-center gap-2 text-xs">
                      {(['all', 'new', 'replied', 'resolved'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setInquiryFilter(st)}
                          className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                            inquiryFilter === st
                              ? 'bg-[#725B38] text-white font-semibold'
                              : 'bg-[#F7F3EE] text-[#4E4543] hover:text-[#1C1C19]'
                          }`}
                        >
                          {st === 'all' ? 'All Inquiries' : st} (
                          {st === 'all'
                            ? contactInquiries.length
                            : contactInquiries.filter((i) => i.status === st).length}
                          )
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-[#7F7572]">
                      Showing {filteredInquiries.length} of {contactInquiries.length} messages
                    </span>
                  </div>

                  {/* Inquiries List */}
                  {filteredInquiries.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#EADECF] p-12 text-center shadow-sm">
                      <Inbox className="w-12 h-12 text-[#CCA730] mx-auto mb-3 opacity-60" />
                      <h3 className="font-semibold text-base text-[#1C1C19]">No Inquiries Found</h3>
                      <p className="text-xs text-[#7F7572] mt-1 max-w-sm mx-auto">
                        There are currently no customer inquiries matching this status. Customer submissions from the Contact Us form will appear here in real-time.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredInquiries.map((inq) => {
                        const statusColors = {
                          new: 'bg-amber-100 text-amber-800 border-amber-200',
                          replied: 'bg-blue-100 text-blue-800 border-blue-200',
                          resolved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                        };

                        return (
                          <div
                            key={inq.id}
                            className="bg-white rounded-2xl border border-[#EADECF] p-5 shadow-sm hover:shadow-md transition-shadow space-y-4"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EADECF]">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#F7F3EE] border border-[#EADECF] flex items-center justify-center font-bold text-[#725B38] text-sm shrink-0">
                                  {inq.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-sm text-[#1C1C19]">{inq.name}</h3>
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${statusColors[inq.status]}`}
                                    >
                                      {inq.status}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#7F7572] mt-0.5">
                                    <span>{inq.email}</span>
                                    {inq.phone && <span>• {inq.phone}</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="text-[11px] text-[#7F7572] flex items-center gap-1 font-mono">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{new Date(inq.createdAt).toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Subject & Message */}
                            <div className="space-y-1.5 bg-[#FDF9F4] p-3.5 rounded-xl border border-[#EADECF]/60">
                              <span className="font-label-uppercase text-[10px] tracking-wider font-bold text-[#725B38] px-2 py-0.5 rounded bg-white border border-[#EADECF] inline-block">
                                {inq.subject}
                              </span>
                              <p className="text-xs text-[#1C1C19] leading-relaxed pt-1 whitespace-pre-line">
                                {inq.message}
                              </p>
                            </div>

                            {/* Actions Toolbar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                              <div className="flex items-center gap-2">
                                {inq.phone && (
                                  <a
                                    href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                      `Hi ${inq.name}, thank you for contacting EBA Skin Care Concierge regarding "${inq.subject}". How may we assist you today?`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Reply via WhatsApp</span>
                                  </a>
                                )}
                                <a
                                  href={`mailto:${inq.email}?subject=${encodeURIComponent(
                                    `Re: ${inq.subject} - EBA Skin Care Concierge`
                                  )}&body=${encodeURIComponent(
                                    `Dear ${inq.name},\n\nThank you for reaching out to EBA Skin Care regarding:\n"${inq.message}"\n\n`
                                  )}`}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#F7F3EE] hover:bg-[#EBE8E3] text-[#1C1C19] border border-[#EADECF] text-xs font-medium flex items-center gap-1.5 transition-colors"
                                >
                                  <Mail className="w-3.5 h-3.5 text-[#725B38]" />
                                  <span>Email Response</span>
                                </a>
                              </div>

                              <div className="flex items-center gap-2">
                                {inq.status !== 'replied' && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateInquiryStatus(inq.id, 'replied')}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                                  >
                                    Mark as Replied
                                  </button>
                                )}
                                {inq.status !== 'resolved' && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateInquiryStatus(inq.id, 'resolved')}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                                  >
                                    Mark as Resolved
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteInquiry(inq.id)}
                                  className="p-1.5 rounded-lg text-[#7F7572] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Delete Inquiry"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 2: CHANNELS & CONCIERGE SETTINGS */}
              {activeContactTab === 'channels' && (
                <form onSubmit={handleSaveContactConfig} className="space-y-6">
                  {/* Header / Banner Copy */}
                  <div className="bg-white p-6 rounded-2xl border border-[#EADECF] shadow-sm space-y-4">
                    <h3 className="font-headline-sm text-base font-bold text-[#1C1C19] pb-3 border-b border-[#EADECF]">
                      Contact Us Header & Copy
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          Concierge Badge
                        </label>
                        <input
                          type="text"
                          value={contactConfig.headerBadge}
                          onChange={(e) =>
                            setContactConfig({ ...contactConfig, headerBadge: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          Main Headline Title
                        </label>
                        <input
                          type="text"
                          value={contactConfig.headerTitle}
                          onChange={(e) =>
                            setContactConfig({ ...contactConfig, headerTitle: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          Header Subtitle Description
                        </label>
                        <textarea
                          rows={2}
                          value={contactConfig.headerSubtitle}
                          onChange={(e) =>
                            setContactConfig({ ...contactConfig, headerSubtitle: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Care Channels */}
                  <div className="bg-white p-6 rounded-2xl border border-[#EADECF] shadow-sm space-y-4">
                    <h3 className="font-headline-sm text-base font-bold text-[#1C1C19] pb-3 border-b border-[#EADECF]">
                      Client Care Direct Channels
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Phone */}
                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          Direct Telephone Concierge
                        </label>
                        <input
                          type="text"
                          value={contactConfig.phone}
                          onChange={(e) =>
                            setContactConfig({ ...contactConfig, phone: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          Phone Working Hours
                        </label>
                        <input
                          type="text"
                          value={contactConfig.phoneHours}
                          onChange={(e) =>
                            setContactConfig({ ...contactConfig, phoneHours: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          Electronic Support Email
                        </label>
                        <input
                          type="email"
                          value={contactConfig.email}
                          onChange={(e) =>
                            setContactConfig({ ...contactConfig, email: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          Email Channel Subtitle
                        </label>
                        <input
                          type="text"
                          value={contactConfig.emailSubtitle}
                          onChange={(e) =>
                            setContactConfig({ ...contactConfig, emailSubtitle: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                        />
                      </div>

                      {/* WhatsApp */}
                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          WhatsApp Priority Number
                        </label>
                        <input
                          type="text"
                          value={contactConfig.whatsapp}
                          onChange={(e) =>
                            setContactConfig({ ...contactConfig, whatsapp: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          WhatsApp Subtitle Note
                        </label>
                        <input
                          type="text"
                          value={contactConfig.whatsappSubtitle}
                          onChange={(e) =>
                            setContactConfig({ ...contactConfig, whatsappSubtitle: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                        />
                      </div>

                      {/* Response Time Guarantee */}
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-[#1C1C19] mb-1">
                          Expected Response Time Guarantee (Displayed Above Form)
                        </label>
                        <input
                          type="text"
                          value={contactConfig.responseSpeedText}
                          onChange={(e) =>
                            setContactConfig({
                              ...contactConfig,
                              responseSpeedText: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EADECF] bg-[#F7F3EE]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-[#1A1615] text-white hover:bg-[#725B38] font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Channels & Copy</span>
                    </button>
                  </div>
                </form>
              )}

              {/* SUBTAB 3: REGIONAL CLEANROOMS & BOUTIQUES */}
              {activeContactTab === 'locations' && (
                <form onSubmit={handleSaveContactConfig} className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-[#EADECF] shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#EADECF]">
                      <div>
                        <h3 className="font-headline-sm text-base font-bold text-[#1C1C19]">
                          Flagship Cleanrooms & Distribution Hubs
                        </h3>
                        <p className="text-xs text-[#7F7572]">
                          Manage the physical addresses shown on the Contact Us page across Pakistan.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddLocation}
                        className="px-3.5 py-1.5 rounded-full bg-[#F7F3EE] hover:bg-[#EBE8E3] border border-[#EADECF] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Location</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {contactConfig.locations.map((loc, idx) => (
                        <div
                          key={loc.id || idx}
                          className="p-4 rounded-xl bg-[#FDF9F4] border border-[#EADECF] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                        >
                          <div className="sm:col-span-4">
                            <label className="block text-[11px] font-semibold text-[#7F7572] mb-1">
                              Location / Facility Name
                            </label>
                            <input
                              type="text"
                              value={loc.name}
                              onChange={(e) => handleUpdateLocation(loc.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-[#EADECF] bg-white text-xs font-semibold"
                            />
                          </div>
                          <div className="sm:col-span-7">
                            <label className="block text-[11px] font-semibold text-[#7F7572] mb-1">
                              Physical Street Address
                            </label>
                            <input
                              type="text"
                              value={loc.address}
                              onChange={(e) =>
                                handleUpdateLocation(loc.id, 'address', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg border border-[#EADECF] bg-white text-xs"
                            />
                          </div>
                          <div className="sm:col-span-1 flex justify-end sm:pt-4">
                            <button
                              type="button"
                              onClick={() => handleRemoveLocation(loc.id)}
                              className="p-2 text-[#7F7572] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Location"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-[#1A1615] text-white hover:bg-[#725B38] font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Locations</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
