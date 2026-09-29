'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'EBA-2026-918231';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('eba_latest_order');
      if (saved) {
        setOrderData(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-12 py-16 w-full text-[#1C1C19]">
      {/* Success Stamp */}
      <div className="text-center space-y-4 mb-12">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
          <span className="material-symbols-outlined text-[34px]">verified</span>
        </div>
        <span className="font-label-uppercase text-xs tracking-widest text-[#725B38] font-bold uppercase">
          Dispatch Order Confirmed
        </span>
        <h1 className="font-display-lg text-3xl sm:text-5xl font-semibold">
          Thank You for Your Patronage.
        </h1>
        <p className="font-body-md text-sm text-[#4E4543] max-w-lg mx-auto leading-relaxed">
          Your order <strong>#{orderNumber}</strong> has been secured in our formulation cleanroom. A tracked dispatch SMS notification will be sent once the courier representative scans the package.
        </p>
      </div>

      {/* Invoice Details Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EADECF] shadow-lg space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EADECF] gap-4">
          <div>
            <span className="font-label-uppercase text-[10px] text-[#7F7572] uppercase tracking-wider">
              Official Invoice Identifier
            </span>
            <div className="font-display-brand text-2xl font-bold mt-0.5">{orderNumber}</div>
            <div className="text-xs text-[#7F7572] mt-0.5">
              Placed on {new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-full border border-[#EADECF] text-xs font-label-ui flex items-center gap-1.5 hover:bg-[#F7F3EE] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Official Invoice</span>
            </button>
            <Link
              href="/my-account"
              className="px-4 py-2 rounded-full bg-[#1A1615] text-[#FDF9F4] text-xs font-label-ui hover:bg-black transition-colors"
            >
              Track in Portal
            </Link>
          </div>
        </div>

        {/* Breakdown of items */}
        {orderData?.items && orderData.items.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-label-uppercase text-xs uppercase tracking-wider font-semibold text-[#1C1C19]">
              Ordered Formulations
            </h3>
            <div className="divide-y divide-[#EADECF]">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {orderData.items.map((item: any) => (
                <div key={item.product.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-sm">{item.product.name}</span>
                    <span className="text-[#7F7572] ml-2">({item.product.size}) × {item.quantity}</span>
                  </div>
                  <span className="font-semibold text-sm">
                    Rs. {((item.product.salePrice ?? item.product.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#EADECF] space-y-1.5 text-xs text-right">
              <div>Subtotal: <strong>Rs. {orderData.subtotal?.toLocaleString()}</strong></div>
              <div>Shipping Fee: <strong>{orderData.shippingFee === 0 ? 'FREE' : `Rs. ${orderData.shippingFee}`}</strong></div>
              {orderData.discount > 0 && <div>Discount: <strong>- Rs. {orderData.discount?.toLocaleString()}</strong></div>}
              <div className="text-base font-bold pt-2 border-t border-[#EADECF]">
                Total Paid / Due: Rs. {orderData.totalAmount?.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Delivery Coordinates & Payment summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#EADECF] text-xs">
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-[#725B38] mb-1 font-label-uppercase">
              Destination Coordinates
            </h4>
            <p className="font-medium text-[#1C1C19]">{orderData?.fullName || 'EBA Patron'}</p>
            <p className="text-[#4E4543]">{orderData?.phone || '+92 300 1234567'}</p>
            <p className="text-[#4E4543]">{orderData?.address || 'Clifton Block 4'}, {orderData?.city || 'Karachi'}</p>
          </div>

          <div>
            <h4 className="font-semibold uppercase tracking-wider text-[#725B38] mb-1 font-label-uppercase">
              Payment Protocol
            </h4>
            <p className="font-medium text-[#1C1C19] uppercase">
              {orderData?.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : orderData?.paymentMethod || 'Cash on Delivery'}
            </p>
            {orderData?.transactionId && (
              <p className="text-[#4E4543]">TID Reference: {orderData.transactionId}</p>
            )}
            <p className="text-[#7F7572] mt-1">Status: Verification & Dispatch in Progress</p>
          </div>
        </div>

      </div>

      <div className="mt-12 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1A1615] text-[#FDF9F4] font-label-uppercase text-xs tracking-widest font-semibold hover:bg-black transition-all shadow-md"
        >
          <span>Continue Exploring Catalog</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[#7F7572]">Loading order summary...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
