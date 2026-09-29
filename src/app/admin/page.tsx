'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { PRODUCTS } from '@/lib/products';

export default function AdminDashboardPage() {
  const { user, profile, isAdmin, loginAsDemoAdmin, signOut } = useAuth();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [inventoryList, setInventoryList] = useState(PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample Orders Data with Pakistan Courier Logistics
  const [orders] = useState([
    {
      id: 'EBA-ORD-9841',
      customer: 'Ayesha Malik',
      city: 'Lahore (DHA Ph 5)',
      phone: '+92 300 8492011',
      courier: 'TCS Express',
      tracking: 'TCS-772910481',
      items: 'Women Glow Serum + Night Cream',
      amount: 6050,
      paymentMethod: 'Cash on Delivery (COD)',
      status: 'In Transit',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
      date: 'Today, 2:15 PM',
    },
    {
      id: 'EBA-ORD-9840',
      customer: 'Fahad Khan',
      city: 'Karachi (Clifton Block 4)',
      phone: '+92 321 4455889',
      courier: 'Leopard Courier',
      tracking: 'LEO-99182301',
      items: "Men's Charcoal Wash + Restorative Cream",
      amount: 4850,
      paymentMethod: 'JazzCash Verified',
      status: 'Out for Delivery',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-300',
      date: 'Today, 11:30 AM',
    },
    {
      id: 'EBA-ORD-9839',
      customer: 'Dr. Zainab Rehman',
      city: 'Islamabad (Sector F-8/2)',
      phone: '+92 333 5123908',
      courier: 'TCS Express',
      tracking: 'TCS-772909120',
      items: 'Complete 3-Step Women Regimen Trio',
      amount: 6545,
      paymentMethod: 'Bank Transfer (Meezan)',
      status: 'Delivered',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      date: 'Yesterday, 4:45 PM',
    },
    {
      id: 'EBA-ORD-9838',
      customer: 'Hamza Siddiqui',
      city: 'Rawalpindi (Bahria Town Ph 4)',
      phone: '+92 345 8899123',
      courier: 'Trax Logistics',
      tracking: 'TRX-4401928',
      items: "Men's Active Defense Glow Serum",
      amount: 2950,
      paymentMethod: 'EasyPaisa Verified',
      status: 'Processing',
      statusColor: 'bg-purple-100 text-purple-800 border-purple-300',
      date: 'Yesterday, 1:20 PM',
    },
  ]);

  // Handle Quick Stock Adjust
  const handleStockAdjust = (id: string, delta: number) => {
    setInventoryList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#FDF9F4] text-[#1C1C19] flex">
      {/* 1. Left Admin Sidebar */}
      <aside className="w-72 bg-white border-r border-[#EADECF] flex flex-col justify-between fixed top-0 bottom-0 left-0 z-40 shadow-sm overflow-y-auto">
        <div className="flex flex-col">
          {/* Sidebar Header Brand */}
          <div className="p-6 border-b border-[#EADECF] flex flex-col items-start gap-1">
            <BrandLogo
              variant="light"
              size="md"
              showTagline
              taglineText="ADMIN CONSOLE • STUDIO"
              href="/admin"
            />
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 font-label-ui text-xs">
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'dashboard'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[19px]">dashboard</span>
                <span>Dashboard Overview</span>
              </div>
            </button>

            <button
              onClick={() => setActiveNav('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'orders'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[19px]">local_mall</span>
                <span>Orders Logistics</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#FEDEB2] text-[#78603E] text-[10px] font-bold">
                4 NEW
              </span>
            </button>

            <button
              onClick={() => setActiveNav('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'products'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[19px]">inventory_2</span>
                <span>Products & Pricing</span>
              </div>
            </button>

            <button
              onClick={() => setActiveNav('coupons')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'coupons'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[19px]">loyalty</span>
                <span>Coupons & Promos</span>
              </div>
              <span className="font-semibold text-[10px] text-[#725B38]">EBAGLOW</span>
            </button>

            <button
              onClick={() => setActiveNav('payments')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'payments'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[19px]">payments</span>
                <span>Payment Gateways</span>
              </div>
              <span className="text-[10px] text-[#7F7572]">PKR COD</span>
            </button>

            <button
              onClick={() => setActiveNav('customers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'customers'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[19px]">group</span>
                <span>Patrons & VIP Club</span>
              </div>
            </button>

            <button
              onClick={() => setActiveNav('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'settings'
                  ? 'bg-[#1A1615] text-white font-semibold shadow-sm'
                  : 'text-[#4E4543] hover:bg-[#F7F3EE] hover:text-[#1C1C19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[19px]">settings</span>
                <span>Store Settings</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#EADECF] flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#F7F3EE] hover:bg-[#EBE8E3] transition-colors text-xs font-medium text-[#1C1C19] border border-[#EADECF]"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#725B38]">
                visibility
              </span>
              <span>View Live Storefront</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#7F7572]">
              north_east
            </span>
          </Link>

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#FDF9F4] border border-[#EADECF]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1A1615] text-[#FFE088] flex items-center justify-center font-bold text-xs">
                {profile?.full_name?.charAt(0) || 'A'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#1C1C19] truncate max-w-[120px]">
                  {profile?.full_name || 'Admin Owner'}
                </span>
                <span className="text-[10px] text-[#725B38] font-medium uppercase tracking-wider">
                  Store Owner
                </span>
              </div>
            </div>

            <button
              onClick={signOut}
              title="Sign Out"
              className="p-1.5 text-[#7F7572] hover:text-red-600 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Admin Workspace (offset left 72 = 288px) */}
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-[#EADECF] sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center w-72 sm:w-80">
              <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#7F7572]">
                search
              </span>
              <input
                type="text"
                placeholder="Search orders, SKUs, patrons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F7F3EE] rounded-full border border-[#EADECF] focus:outline-none focus:border-[#725B38] text-[#1C1C19]"
              />
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F3EE] text-xs text-[#4E4543] border border-[#EADECF]">
              <span className="material-symbols-outlined text-[15px] text-[#725B38]">
                calendar_today
              </span>
              <span>Last 30 Days (PKR)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBE8E3] text-[#1C1C19] border border-[#EADECF]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-label-uppercase text-[10px] tracking-wider font-semibold">
                Live in Pakistan • PKR
              </span>
            </div>

            <button
              onClick={() => setActiveNav('orders')}
              className="relative p-2 rounded-full text-[#4E4543] hover:bg-[#F7F3EE] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#CCA730]" />
            </button>

            <Link
              href="/shop"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1A1615] text-white hover:bg-[#725B38] transition-colors text-xs font-semibold shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>New SKU</span>
            </Link>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="p-6 sm:p-8 space-y-8 flex-1">
          {/* Executive Overview Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EADECF]">
            <div>
              <div className="flex items-center gap-2 text-xs font-label-uppercase text-[#725B38] tracking-widest font-semibold">
                <span>Apothecary Management Studio</span>
                <span>•</span>
                <span>Pakistan Headquarters</span>
              </div>
              <h1 className="font-headline-lg text-2xl sm:text-3xl text-[#1C1C19] mt-1 font-semibold">
                Executive Console — EBA Skin Care
              </h1>
              <p className="text-xs text-[#7F7572] mt-0.5">
                Consolidated real-time operational data synced with courier logistics (TCS & Leopard).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Exporting PDF executive report...')}
                className="px-4 py-2 rounded-full bg-white text-[#1C1C19] border border-[#EADECF] text-xs font-semibold hover:bg-[#F7F3EE] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px] text-[#725B38]">
                  picture_as_pdf
                </span>
                <span>Export PDF</span>
              </button>
              <button
                onClick={() => alert('Exporting CSV order ledger...')}
                className="px-4 py-2 rounded-full bg-white text-[#1C1C19] border border-[#EADECF] text-xs font-semibold hover:bg-[#F7F3EE] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px] text-[#725B38]">
                  download
                </span>
                <span>CSV Ledger</span>
              </button>
            </div>
          </div>

          {/* 4 Bento KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#EADECF] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#7F7572] font-label-uppercase tracking-wider">
                <span>Consolidated Revenue</span>
                <span className="material-symbols-outlined text-[#725B38] text-[20px]">payments</span>
              </div>
              <div className="mt-3">
                <div className="font-price-lg text-2xl text-[#1C1C19] font-bold">
                  Rs. 3,842,500
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-700 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  <span>+18.4% this month</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EADECF] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#7F7572] font-label-uppercase tracking-wider">
                <span>Fulfilled Orders</span>
                <span className="material-symbols-outlined text-[#725B38] text-[20px]">local_mall</span>
              </div>
              <div className="mt-3">
                <div className="font-price-lg text-2xl text-[#1C1C19] font-bold">
                  932 <span className="text-sm font-normal text-[#7F7572]">Orders</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-[#725B38] font-semibold">
                  <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                  <span>87% via TCS & Leopard</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EADECF] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#7F7572] font-label-uppercase tracking-wider">
                <span>Active Patrons</span>
                <span className="material-symbols-outlined text-[#725B38] text-[20px]">workspace_premium</span>
              </div>
              <div className="mt-3">
                <div className="font-price-lg text-2xl text-[#1C1C19] font-bold">
                  1,428 <span className="text-sm font-normal text-[#7F7572]">Profiles</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-purple-700 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">repeat</span>
                  <span>42% repeat acquisition rate</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EADECF] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#7F7572] font-label-uppercase tracking-wider">
                <span>Delivery Success</span>
                <span className="material-symbols-outlined text-[#725B38] text-[20px]">verified</span>
              </div>
              <div className="mt-3">
                <div className="font-price-lg text-2xl text-[#1C1C19] font-bold">
                  99.1%
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-700 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>Zero transit damages reported</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Logistics Table */}
          <div className="bg-white rounded-2xl border border-[#EADECF] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#EADECF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-headline-sm text-lg text-[#1C1C19] font-semibold">
                  Real-Time Courier Synch & Live Dispatches
                </h3>
                <p className="text-xs text-[#7F7572] mt-0.5">
                  Shipments connected to TCS Express API and Leopard Courier portal across Pakistan.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#FEDEB2] text-[#78603E] text-xs font-bold font-label-uppercase tracking-wider self-start sm:self-auto">
                4 Orders Requiring Attention
              </span>
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
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADECF]/60">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FDF9F4] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1C1C19]">
                        {ord.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1C1C19]">{ord.customer}</div>
                        <div className="text-[11px] text-[#7F7572]">{ord.city}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#725B38] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            local_shipping
                          </span>
                          {ord.courier}
                        </div>
                        <div className="font-mono text-[10px] text-[#7F7572]">{ord.tracking}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[#4E4543] max-w-[200px] truncate">
                        {ord.items}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#1C1C19]">
                        Rs. {ord.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-[#725B38] font-medium">
                        {ord.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${ord.statusColor}`}
                        >
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Product Inventory Quick Adjustment */}
          <div className="bg-white rounded-2xl border border-[#EADECF] shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EADECF]">
              <div>
                <h3 className="font-headline-sm text-lg text-[#1C1C19] font-semibold">
                  Formulation Inventory & Immediate Stock Control
                </h3>
                <p className="text-xs text-[#7F7572]">
                  Live units synchronized with e-commerce cart reserves and warehouse batches.
                </p>
              </div>

              <span className="text-xs text-[#725B38] font-semibold">
                6 Active Formulations Live
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {inventoryList.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-xl border border-[#EADECF] bg-[#F7F3EE]/50 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-label-uppercase font-bold text-[#725B38]">
                        {prod.category === 'women' ? 'Women Line' : 'Men Line'}
                      </span>
                      <h4 className="font-headline-sm text-sm font-semibold text-[#1C1C19] line-clamp-1">
                        {prod.name}
                      </h4>
                      <span className="text-xs font-mono text-[#7F7572]">
                        Rs. {prod.salePrice || prod.price} • {prod.size}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prod.stock < 30
                          ? 'bg-red-100 text-red-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {prod.stock < 30 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EADECF]/60">
                    <span className="text-xs font-semibold text-[#1C1C19]">
                      Units: <span className="font-bold text-[#725B38]">{prod.stock}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStockAdjust(prod.id, -5)}
                        className="w-7 h-7 rounded-lg bg-white border border-[#EADECF] hover:bg-[#EBE8E3] flex items-center justify-center font-bold text-sm shadow-sm"
                        title="Reduce 5 units"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleStockAdjust(prod.id, 10)}
                        className="w-7 h-7 rounded-lg bg-white border border-[#EADECF] hover:bg-[#EBE8E3] flex items-center justify-center font-bold text-sm shadow-sm"
                        title="Add 10 units"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
