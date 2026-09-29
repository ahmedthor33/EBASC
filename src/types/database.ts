export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'owner' | 'admin' | 'staff' | 'customer';

export type ProductStatus = 'draft' | 'published' | 'archived' | 'out_of_stock';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'verified' | 'rejected' | 'failed' | 'refunded';

export type ShipmentStatus =
  | 'label_created'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'returned';

export interface Profile {
  id: string;
  role_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postal_code: string | null;
  created_at: string;
  updated_at: string;
  role?: Role;
}

export interface Role {
  id: string;
  name: UserRole;
  description: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  gender_target: 'women' | 'men' | 'unisex';
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subcategories?: Category[];
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  how_to_use: string | null;
  size: string | null;
  price: number;
  sale_price: number | null;
  sku: string;
  stock: number;
  status: ProductStatus;
  is_featured: boolean;
  is_best_seller: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string | null;
  session_id: string | null;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Cart {
  id: string;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode?: string;
  province: string;
}

export interface ShippingRate {
  id: string;
  name: string;
  rate: number;
  free_shipping_threshold: number;
  estimated_days: string;
  is_active: boolean;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order: number;
  usage_limit: number;
  times_used: number;
  expiry: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  guest_email: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  shipping_address: ShippingAddress;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total_amount: number;
  coupon_code: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  payments?: Payment[];
  shipments?: Shipment[];
  status_history?: OrderStatusHistory[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_size: string | null;
  product_image: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  changed_by: string | null;
  created_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  slug: 'cash_on_delivery' | 'jazzcash' | 'easypaisa' | 'bank_transfer';
  enabled: boolean;
  account_title: string | null;
  account_number: string | null;
  instructions: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  method: string;
  amount: number;
  status: PaymentStatus;
  proof_image_url: string | null;
  transaction_reference: string | null;
  verified_at: string | null;
  verified_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface Shipment {
  id: string;
  order_id: string;
  courier: string;
  tracking_number: string | null;
  tracking_url: string | null;
  status: ShipmentStatus;
  dispatched_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  reviewer_name: string;
  rating: number;
  title: string | null;
  comment: string;
  approved: boolean;
  created_at: string;
  product?: Product;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: Json;
  description: string | null;
  updated_at: string;
}

export interface NavLink {
  id: string;
  label: string;
  url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface HeroSection {
  id: string;
  category_mode: 'all' | 'women' | 'men';
  badge_text: string | null;
  title: string;
  subtitle: string | null;
  primary_cta_label: string | null;
  primary_cta_url: string | null;
  secondary_cta_label: string | null;
  secondary_cta_url: string | null;
  image_url: string | null;
  secondary_image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  target_url: string | null;
  placement: 'home_top' | 'women_hero' | 'men_hero' | 'shop_banner' | 'announcement_bar';
  display_order: number;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface FooterContent {
  id: string;
  section_title: string;
  links: { label: string; url: string }[];
  display_order: number;
  created_at: string;
}
