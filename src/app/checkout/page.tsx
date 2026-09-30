'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getPaymentSettings, DEFAULT_PAYMENT_SETTINGS, PaymentSettings } from '@/lib/paymentStorage';
import { getShippingSettings, getCalculatedShipping, ShippingSettings, DEFAULT_SHIPPING_SETTINGS } from '@/lib/shippingStorage';
import { AlertCircle, Banknote, Smartphone, Wallet, Building2, Truck } from 'lucide-react';

type PaymentMethodType = 'cod' | 'jazzcash' | 'easypaisa' | 'bank';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, clearCart } = useCart();
  const { user, profile } = useAuth();

  // Dynamic payment gateways from Admin
  const [payments, setPayments] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);

  useEffect(() => {
    const loaded = getPaymentSettings();
    setPayments(loaded);
    // If COD is disabled, fallback to first enabled
    if (!loaded.codEnabled) {
      if (loaded.jazzcashEnabled) setPaymentMethod('jazzcash');
      else if (loaded.easypaisaEnabled) setPaymentMethod('easypaisa');
      else if (loaded.bankTransferEnabled) setPaymentMethod('bank');
    }
    const handler = () => setPayments(getPaymentSettings());
    window.addEventListener('eba_payments_updated', handler);
    return () => window.removeEventListener('eba_payments_updated', handler);
  }, []);

  // Form states
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.address_line1 || '');
  const [city, setCity] = useState(profile?.city || 'Karachi');
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [customCityText, setCustomCityText] = useState('');
  const [postalCode, setPostalCode] = useState(profile?.postal_code || '');
  const [notes, setNotes] = useState('');

  // Dynamic shipping calculation based on customer's city and active admin regional zones
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(DEFAULT_SHIPPING_SETTINGS);

  useEffect(() => {
    setShippingSettings(getShippingSettings());
    const handler = () => setShippingSettings(getShippingSettings());
    window.addEventListener('eba_shipping_updated', handler);
    return () => window.removeEventListener('eba_shipping_updated', handler);
  }, []);

  const effectiveCity = isCustomCity ? customCityText : city;

  const dynamicShipping = useMemo(() => {
    return getCalculatedShipping(subtotal, effectiveCity, shippingSettings);
  }, [subtotal, effectiveCity, shippingSettings]);

  const effectiveShippingFee = items.length === 0 ? 0 : dynamicShipping.fee;
  const effectiveTotal = Math.max(0, subtotal - discount + effectiveShippingFee);

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cod');
  const [transactionId, setTransactionId] = useState('');
  const [proofFileName, setProofFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 py-20 text-center">
        <h1 className="font-display-brand text-2xl font-semibold mb-2">No Items to Checkout</h1>
        <p className="text-xs text-[#7F7572] mb-6">Your bag is currently empty.</p>
        <Link
          href="/shop"
          className="px-6 py-3 rounded-full bg-[#1A1615] text-[#FDF9F4] font-label-uppercase text-xs"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setError('Please provide complete recipient and delivery coordinates.');
      return;
    }

    if ((paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa' || paymentMethod === 'bank') && !transactionId.trim() && !proofFileName) {
      setError('Please provide your Transaction ID (TID) or attach payment screenshot proof.');
      return;
    }

    setIsProcessing(true);

    try {
      const orderNumber = `EBA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderData = {
        orderNumber,
        fullName,
        email,
        phone,
        address,
        city: effectiveCity || city,
        postalCode,
        notes,
        paymentMethod,
        transactionId,
        items,
        subtotal,
        shippingFee: effectiveShippingFee,
        discount,
        totalAmount: effectiveTotal,
        shippingZone: dynamicShipping.zoneName,
        deliveryDays: dynamicShipping.deliveryDays,
        createdAt: new Date().toISOString(),
      };

      // Store placed order for confirmation screen
      if (typeof window !== 'undefined') {
        localStorage.setItem('eba_latest_order', JSON.stringify(orderData));
      }

      clearCart();
      router.push(`/order-confirmation?orderNumber=${orderNumber}`);
    } catch {
      setError('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 py-10 w-full">
      {/* Breadcrumb Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2 font-label-uppercase text-xs tracking-widest text-[#7F7572]">
          <Link href="/cart" className="hover:text-black">Bag</Link>
          <span>/</span>
          <span className="text-[#725B38] font-bold">Secure Checkout</span>
        </div>
        <h1 className="font-display-lg text-3xl sm:text-4xl text-[#1C1C19] font-semibold">
          Finalize Dispatch Coordinates
        </h1>
        <p className="text-xs text-[#7F7572] mt-1">
          Complimentary courier tracking SMS dispatched immediately upon parcel seal.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Delivery Coordinates & Payment Option */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Step 1: Customer Contact & Delivery Address */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADECF] shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1C1C19] border-b border-[#EADECF] pb-3">
              <span className="w-6 h-6 rounded-full bg-[#1A1615] text-[#FFE088] text-xs flex items-center justify-center font-bold">1</span>
              <span>Delivery Coordinates (Pakistan Only)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-[#1C1C19]">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ayesha Khan"
                  className="w-full px-3.5 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-xs text-[#1C1C19] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-[#1C1C19]">
                  Mobile Phone (SMS Tracking) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300 1234567"
                  className="w-full px-3.5 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-xs text-[#1C1C19] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-[#1C1C19]">
                  Email Address (Receipt & Updates)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ayesha.khan@domain.com"
                  className="w-full px-3.5 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-xs text-[#1C1C19] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-[#1C1C19]">
                  City (Destination) *
                </label>
                <select
                  value={isCustomCity ? '__other__' : city}
                  onChange={(e) => {
                    if (e.target.value === '__other__') {
                      setIsCustomCity(true);
                      if (!customCityText) setCustomCityText('');
                    } else {
                      setIsCustomCity(false);
                      setCity(e.target.value);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-xs text-[#1C1C19] focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="Karachi">Karachi (Sindh)</option>
                  <option value="Lahore">Lahore (Punjab)</option>
                  <option value="Islamabad">Islamabad (ICT)</option>
                  <option value="Rawalpindi">Rawalpindi (Punjab)</option>
                  <option value="Faisalabad">Faisalabad (Punjab)</option>
                  <option value="Multan">Multan (Punjab)</option>
                  <option value="Peshawar">Peshawar (KPK)</option>
                  <option value="Quetta">Quetta (Balochistan)</option>
                  <option value="Sialkot">Sialkot (Punjab)</option>
                  <option value="Gujranwala">Gujranwala (Punjab)</option>
                  <option value="Hyderabad">Hyderabad (Sindh)</option>
                  <option value="Bahawalpur">Bahawalpur (Punjab)</option>
                  <option value="Sargodha">Sargodha (Punjab)</option>
                  <option value="Sukkur">Sukkur (Sindh)</option>
                  <option value="Larkana">Larkana (Sindh)</option>
                  <option value="Abbottabad">Abbottabad (KPK)</option>
                  <option value="Mirpur">Mirpur (AJK)</option>
                  <option value="Gilgit">Gilgit (Gilgit-Baltistan)</option>
                  <option value="__other__">✦ Other City / Region (Type manually)</option>
                </select>

                {isCustomCity && (
                  <div className="mt-2">
                    <input
                      type="text"
                      required
                      value={customCityText}
                      onChange={(e) => setCustomCityText(e.target.value)}
                      placeholder="Type your city name (e.g. Swat, Nawabshah, Rahim Yar Khan)..."
                      className="w-full px-3.5 py-2 bg-white border border-[#C5A880] rounded-lg text-xs text-[#1C1C19] focus:outline-none"
                    />
                  </div>
                )}

                {dynamicShipping.zoneName && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#725B38] bg-[#FEDEB2]/30 px-3 py-1.5 rounded-lg border border-[#FEDEB2]">
                    <Truck className="w-3.5 h-3.5 text-[#725B38] shrink-0" />
                    <span>
                      <strong>{dynamicShipping.zoneName}:</strong>{' '}
                      {effectiveShippingFee === 0 ? 'Free Shipping (Complimentary)' : `Rs. ${effectiveShippingFee}`} • {dynamicShipping.deliveryDays}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-[#1C1C19]">
                Street Address, House/Bungalow, Floor & Landmark *
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House # 12-B, Street 5, Phase 6, DHA"
                className="w-full px-3.5 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-xs text-[#1C1C19] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-[#1C1C19]">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 75500"
                  className="w-full px-3.5 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-xs text-[#1C1C19] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-[#1C1C19]">
                  Special Delivery Instructions
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Ring doorbell twice, deliver after 2 PM"
                  className="w-full px-3.5 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-xs text-[#1C1C19] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADECF] shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1C1C19] border-b border-[#EADECF] pb-3">
              <span className="w-6 h-6 rounded-full bg-[#1A1615] text-[#FFE088] text-xs flex items-center justify-center font-bold">2</span>
              <span>Payment Protocol</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: COD */}
              {payments.codEnabled && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#1A1615] bg-[#F7F3EE] ring-1 ring-[#1A1615]'
                      : 'border-[#EADECF] bg-white hover:bg-[#FDF9F4]'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-[#725B38] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-xs text-[#1C1C19]">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-[#7F7572] mt-0.5">Pay in cash upon doorstep arrival across Pakistan.</p>
                  </div>
                </button>
              )}

              {/* Option 2: JazzCash */}
              {payments.jazzcashEnabled && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('jazzcash')}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'jazzcash'
                      ? 'border-[#1A1615] bg-[#F7F3EE] ring-1 ring-[#1A1615]'
                      : 'border-[#EADECF] bg-white hover:bg-[#FDF9F4]'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-xs text-[#1C1C19]">JazzCash Mobile Account</h4>
                    <p className="text-[11px] text-[#7F7572] mt-0.5">Transfer to {payments.jazzcashAccount} and input TID.</p>
                  </div>
                </button>
              )}

              {/* Option 3: EasyPaisa */}
              {payments.easypaisaEnabled && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('easypaisa')}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'easypaisa'
                      ? 'border-[#1A1615] bg-[#F7F3EE] ring-1 ring-[#1A1615]'
                      : 'border-[#EADECF] bg-white hover:bg-[#FDF9F4]'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-xs text-[#1C1C19]">EasyPaisa Wallet</h4>
                    <p className="text-[11px] text-[#7F7572] mt-0.5">Transfer to {payments.easypaisaAccount} and input TID.</p>
                  </div>
                </button>
              )}

              {/* Option 4: Direct Bank Transfer */}
              {payments.bankTransferEnabled && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'bank'
                      ? 'border-[#1A1615] bg-[#F7F3EE] ring-1 ring-[#1A1615]'
                      : 'border-[#EADECF] bg-white hover:bg-[#FDF9F4]'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-[#725B38] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-xs text-[#1C1C19]">{payments.bankName || 'Direct Bank'}</h4>
                    <p className="text-[11px] text-[#7F7572] mt-0.5">Online transfer & attach TID / receipt screenshot.</p>
                  </div>
                </button>
              )}
            </div>

            {/* Sub-Panel for Digital / Bank Payments */}
            {paymentMethod !== 'cod' && (
              <div className="p-4 rounded-2xl bg-[#F7F3EE] border border-[#EADECF] space-y-3 animate-fade-in text-xs">
                <div className="font-semibold text-[#1C1C19]">
                  {paymentMethod === 'jazzcash' &&
                    `JazzCash Account: ${payments.jazzcashAccount} (Title: ${payments.jazzcashTitle})`}
                  {paymentMethod === 'easypaisa' &&
                    `EasyPaisa Account: ${payments.easypaisaAccount} (Title: ${payments.easypaisaTitle})`}
                  {paymentMethod === 'bank' &&
                    `${payments.bankName}: IBAN ${payments.iban} (Account Title: ${payments.accountTitle}${payments.accountNumber ? `, Account No: ${payments.accountNumber}` : ''})`}
                </div>
                <p className="text-[#7F7572] leading-relaxed">
                  Please complete the payment transfer for <strong>Rs. {effectiveTotal.toLocaleString()}</strong> and provide your Transaction ID (TID) or upload screenshot receipt below:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wider text-[#1C1C19]">
                      Transaction ID (TID)
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. 98124018241"
                      className="w-full px-3 py-2 bg-white border border-[#EADECF] rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wider text-[#1C1C19]">
                      Upload Receipt Screenshot
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setProofFileName(file.name);
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-[#EADECF] rounded-lg text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-[#1A1615] file:text-white"
                    />
                    {proofFileName && <p className="text-[10px] text-emerald-700 mt-1">Attached: {proofFileName}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADECF] shadow-lg space-y-5">
            <h2 className="font-display-brand text-xl font-semibold text-[#1C1C19]">
              Parcel Summary ({items.length} items)
            </h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#F7F3EE] shrink-0 border border-[#EADECF]">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1C1C19] line-clamp-1">{product.name}</p>
                      <p className="text-[11px] text-[#7F7572]">Qty: {quantity} • {product.size}</p>
                    </div>
                  </div>
                  <span className="font-semibold">
                    Rs. {((product.salePrice ?? product.price) * quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#EADECF] pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#4E4543]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1C1C19]">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[#4E4543]">
                <div>
                  <span>Shipping</span>
                  <span className="block text-[10px] text-[#7F7572]">
                    {dynamicShipping.zoneName} ({dynamicShipping.deliveryDays})
                  </span>
                </div>
                <span className="font-semibold text-emerald-700">
                  {effectiveShippingFee === 0 ? 'COMPLIMENTARY' : `Rs. ${effectiveShippingFee}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Voucher Applied</span>
                  <span className="font-semibold">- Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-[#EADECF] text-[#1C1C19]">
                <span>Total Due</span>
                <span>Rs. {effectiveTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-full bg-[#1A1615] text-[#FDF9F4] font-label-uppercase text-xs tracking-widest font-semibold hover:bg-black transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Sealing Dispatch...</span>
                </>
              ) : (
                <span>Confirm & Place Order</span>
              )}
            </button>

            <div className="pt-2 text-[11px] text-[#7F7572] space-y-1">
              <p>• Estimated nationwide courier dispatch: 24–48 hours</p>
              <p>• Free exchanges on defective packaging</p>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
