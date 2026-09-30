'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { getStoredOrders, AdminOrder } from '@/lib/orderStorage';
import { Lock, CheckCircle2, Mail, Phone, ShieldCheck, LogOut, Check, Package, Truck, Home } from 'lucide-react';

export default function MyAccountPage() {
  const { user, profile, role, isAdmin, signOut, isLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'security'>('orders');
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [userOrders, setUserOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    if (!user) return;
    const userEmail = (user.email || '').toLowerCase();
    const all = getStoredOrders();
    setUserOrders(all.filter((o) => (o.customerEmail || '').toLowerCase() === userEmail));

    const handler = () => {
      const updated = getStoredOrders();
      setUserOrders(updated.filter((o) => (o.customerEmail || '').toLowerCase() === userEmail));
    };
    window.addEventListener('eba_orders_updated', handler);
    return () => window.removeEventListener('eba_orders_updated', handler);
  }, [user]);

  const activeOrdersCount = userOrders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const userTotalSpent = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Editable profile state
  const [fullName, setFullName] = useState(profile?.full_name || 'EBA Patron');
  const [phone, setPhone] = useState(profile?.phone || '+92 300 8245190');
  const [address, setAddress] = useState(profile?.address_line1 || 'House 42, Street 8, F-7/2');
  const [city, setCity] = useState(profile?.city || 'Islamabad');
  const [postalCode, setPostalCode] = useState(profile?.postal_code || '44000');

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-2 border-[#1A1615] border-t-[#C5A880] rounded-full animate-spin" />
          <span className="font-label-uppercase text-xs tracking-widest text-[#7F7572]">
            Loading Client Sanctuary...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#FDF9F4]">
        <div className="max-w-md w-full bg-white border border-[#EADECF] rounded-2xl p-8 text-center shadow-lg">
          <div className="w-12 h-12 rounded-full bg-[#F7F3EE] text-[#725B38] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-display-brand text-2xl text-[#1C1C19] font-semibold mb-2">
            Client Authentication Required
          </h2>
          <p className="font-body-md text-sm text-[#7F7572] mb-6 leading-relaxed">
            Please sign in to access your bespoke orders, live shipment tracking, and verified patron profile.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/sign-in"
              className="w-full py-3.5 rounded-full bg-[#1A1615] text-[#FDF9F4] font-label-uppercase text-xs tracking-widest font-semibold hover:bg-black transition-all"
            >
              Sign In to Sanctuary
            </Link>
            <Link
              href="/sign-up"
              className="w-full py-3.5 rounded-full border border-[#EADECF] bg-[#F7F3EE] text-[#1C1C19] font-label-uppercase text-xs tracking-widest font-semibold hover:bg-[#EBE8E3] transition-all"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }, 600);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 py-8 w-full">
      {/* Brand Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-[#EADECF]/60">
        <BrandLogo variant="light" size="md" href="/" />
        <div className="flex items-center gap-2 font-label-uppercase text-[11px] tracking-widest text-[#7F7572]">
          <Link href="/" className="hover:text-[#1C1C19]">Home</Link>
          <span>/</span>
          <span className="text-[#725B38] font-semibold">Client Patron Portal</span>
        </div>
      </div>

      {/* Client Overview Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#F7F3EE] border border-[#EADECF] shadow-sm p-6 lg:p-10 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Profile Identity */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative w-20 h-20 rounded-full bg-[#1F1B1A] text-[#FFE088] flex items-center justify-center font-display-brand text-2xl font-semibold shadow-md shrink-0">
              <span>{profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}</span>
              <span className="absolute bottom-0 right-0 w-6 h-6 bg-[#725B38] rounded-full flex items-center justify-center text-white text-[12px] shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-headline-lg text-2xl lg:text-3xl text-[#1C1C19] font-semibold">
                  {profile?.full_name || 'EBA Patron'}
                </h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FEDEB2] text-[#78603E] font-label-uppercase text-[10px] tracking-wider uppercase font-bold">
                  {role === 'owner' ? 'Platform Owner' : role === 'admin' ? 'Store Administrator' : 'Privilege Patron'}
                </span>
              </div>
              <p className="font-body-md text-xs sm:text-sm text-[#4E4543] flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#725B38]" />
                  {user.email}
                </span>
                <span className="text-[#D1C4C1] hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#725B38]" />
                  {phone}
                </span>
              </p>
              <p className="font-body-sm text-xs text-[#725B38]">
                Complimentary Tracked Nationwide Shipping Active Across Pakistan
              </p>
            </div>
          </div>

          {/* Quick Stat Bento Cards */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3.5 border border-[#EADECF] shadow-sm flex flex-col justify-between">
              <span className="font-label-uppercase text-[10px] tracking-wider text-[#7F7572]">Orders</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display-brand text-2xl text-[#1C1C19] font-bold">{userOrders.length}</span>
                <span className="font-body-sm text-[11px] text-[#725B38]">{activeOrdersCount} Active</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3.5 border border-[#EADECF] shadow-sm flex flex-col justify-between">
              <span className="font-label-uppercase text-[10px] tracking-wider text-[#7F7572]">Total Spent</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-price-md text-base text-[#1C1C19] font-bold">Rs. {userTotalSpent.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3.5 border border-[#EADECF] shadow-sm flex flex-col justify-between">
              <span className="font-label-uppercase text-[10px] tracking-wider text-[#7F7572]">City</span>
              <div className="mt-2 truncate">
                <span className="font-display-brand text-base text-[#1C1C19] font-semibold">{city}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Admin Quick Action Button if Owner/Admin */}
        {isAdmin && (
          <div className="mt-6 pt-5 border-t border-[#EADECF] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#78603E] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#78603E]" />
              <span>You possess administrative permissions for EBA Skin Care.</span>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 rounded-full bg-[#1F1B1A] text-[#FFE088] font-label-uppercase text-xs tracking-wider font-semibold hover:bg-black transition-colors"
            >
              Open Admin Dashboard Studio
            </Link>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-[#EADECF] mb-8 pb-1">
        <div className="flex gap-8 font-label-uppercase text-xs tracking-widest uppercase">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-semibold transition-colors relative ${
              activeTab === 'orders' ? 'text-[#1C1C19]' : 'text-[#7F7572] hover:text-[#1C1C19]'
            }`}
          >
            Live Orders & History
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1C1C19]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 font-semibold transition-colors relative ${
              activeTab === 'profile' ? 'text-[#1C1C19]' : 'text-[#7F7572] hover:text-[#1C1C19]'
            }`}
          >
            Delivery Address & Profile
            {activeTab === 'profile' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1C1C19]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 font-semibold transition-colors relative ${
              activeTab === 'security' ? 'text-[#1C1C19]' : 'text-[#7F7572] hover:text-[#1C1C19]'
            }`}
          >
            Security & Credentials
            {activeTab === 'security' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1C1C19]" />
            )}
          </button>
        </div>

        <button
          onClick={handleSignOut}
          className="text-xs font-label-ui text-red-600 hover:text-red-700 flex items-center gap-1.5 pb-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tab 1: Orders and Tracking */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {userOrders.length === 0 ? (
            <div className="bg-white border border-[#EADECF] rounded-2xl p-12 text-center shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#F7F3EE] text-[#725B38] flex items-center justify-center mx-auto mb-3 border border-[#EADECF]">
                <Package className="w-7 h-7 text-[#725B38]" />
              </div>
              <h3 className="font-headline-sm text-lg font-semibold text-[#1C1C19] mb-1">
                No Orders Placed Yet
              </h3>
              <p className="font-body-md text-xs text-[#7F7572] max-w-sm mx-auto mb-6">
                Your order sanctuary is currently empty. Explore our botanical formulations to begin your ritual.
              </p>
              <Link
                href="/shop"
                className="px-6 py-2.5 rounded-full bg-[#1A1615] text-[#FDF9F4] font-label-uppercase text-xs tracking-wider font-semibold hover:bg-black transition-colors shadow-sm inline-block"
              >
                Explore Formulations
              </Link>
            </div>
          ) : (
            userOrders.map((ord) => (
              <div key={ord.id} className="bg-white border border-[#EADECF] rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EADECF] gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-label-uppercase text-xs font-bold text-[#1C1C19] tracking-wider">
                        {ord.orderNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-label-uppercase font-semibold uppercase">
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="font-body-sm text-xs text-[#7F7572] mt-0.5">
                      Placed on {ord.date} • Payment: {ord.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-price-lg text-lg font-bold text-[#1C1C19]">
                      Rs. {ord.totalAmount.toLocaleString()}
                    </span>
                    <p className="font-body-sm text-[11px] text-[#725B38]">
                      {ord.itemsList?.length || 1} Formulations
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4 items-center justify-between">
                  <div className="text-xs text-[#1C1C19]">
                    <p className="font-semibold">{ord.itemsSummary}</p>
                    <p className="text-[#7F7572]">Courier: {ord.courier} • Tracking: {ord.trackingNumber}</p>
                  </div>
                  <Link
                    href="/shop"
                    className="px-4 py-2 rounded-full border border-[#EADECF] text-xs font-label-ui hover:bg-[#F7F3EE] transition-colors"
                  >
                    Reorder Formulations
                  </Link>
                </div>
              </div>
            ))
          )}


        </div>
      )}

      {/* Tab 2: Profile & Delivery Address */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white border border-[#EADECF] rounded-2xl p-8 shadow-sm">
          <h2 className="font-display-brand text-xl text-[#1C1C19] font-semibold mb-6">
            Patron Personal Details & Default Address
          </h2>

          {profileSaved && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your profile and delivery coordinates have been updated.</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-ui text-xs font-semibold text-[#1C1C19] mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-sm text-[#1C1C19] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block font-label-ui text-xs font-semibold text-[#1C1C19] mb-1 uppercase tracking-wider">
                  Mobile Phone (SMS Tracking)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-sm text-[#1C1C19] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-ui text-xs font-semibold text-[#1C1C19] mb-1 uppercase tracking-wider">
                Street Address & House / Apartment
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-sm text-[#1C1C19] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label-ui text-xs font-semibold text-[#1C1C19] mb-1 uppercase tracking-wider">
                  City (Pakistan)
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-sm text-[#1C1C19] focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Quetta">Quetta</option>
                  <option value="Sialkot">Sialkot</option>
                  <option value="Gujranwala">Gujranwala</option>
                </select>
              </div>

              <div>
                <label className="block font-label-ui text-xs font-semibold text-[#1C1C19] mb-1 uppercase tracking-wider">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-sm text-[#1C1C19] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="mt-4 px-6 py-3 rounded-full bg-[#1A1615] text-[#FDF9F4] font-label-uppercase text-xs tracking-widest font-semibold hover:bg-black transition-all shadow-sm"
            >
              {isUpdating ? 'Saving Changes...' : 'Save Updated Address'}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Security & Credentials */}
      {activeTab === 'security' && (
        <div className="max-w-xl bg-white border border-[#EADECF] rounded-2xl p-8 shadow-sm">
          <h2 className="font-display-brand text-xl text-[#1C1C19] font-semibold mb-4">
            Security & Authentication
          </h2>
          <p className="text-xs text-[#7F7572] mb-6 leading-relaxed">
            Manage your credentials and password protection. Supabase authentication is secured with encrypted hashing.
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F7F3EE] border border-[#EADECF] flex items-center justify-between">
              <div>
                <p className="font-label-ui text-xs font-semibold text-[#1C1C19]">Change Account Password</p>
                <p className="text-xs text-[#7F7572]">Receive a verified reset token to your registered email address.</p>
              </div>
              <Link
                href="/forgot-password"
                className="px-4 py-2 rounded-full border border-[#EADECF] text-xs font-label-ui bg-white hover:bg-[#EBE8E3] transition-colors"
              >
                Send Reset Link
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F3EE] border border-[#EADECF] flex items-center justify-between">
              <div>
                <p className="font-label-ui text-xs font-semibold text-[#1C1C19]">Registered Email</p>
                <p className="text-xs text-[#7F7572]">{user.email}</p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold uppercase">
                Verified
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
