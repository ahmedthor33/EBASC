import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Return & Refund Policy | EBA Skin Care',
  description: 'Our 7-day formulation return, exchange, and packaging guarantee across Pakistan.',
};

export default function ReturnAndRefundPolicyPage() {
  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-12 py-16 w-full text-[#1C1C19]">
      <div className="mb-10 text-center">
        <span className="font-label-uppercase text-xs tracking-widest text-[#725B38] font-bold uppercase">
          Client Guarantee
        </span>
        <h1 className="font-display-lg text-3xl sm:text-5xl font-semibold mt-2 mb-3">
          Return & Refund Policy
        </h1>
        <p className="text-xs text-[#7F7572]">Last Updated: September 2026 • 7-Day Doorstep Guarantee</p>
      </div>

      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#EADECF] shadow-sm space-y-8 text-sm leading-relaxed text-[#4E4543]">
        <section className="space-y-3">
          <h2 className="font-display-brand text-xl font-semibold text-[#1C1C19]">1. The 7-Day Quality Guarantee</h2>
          <p>
            At EBA Skin Care, every formulation vessel is hand-inspected and sealed in tamper-evident packaging. If your product arrives damaged, leaks in transit, or exhibits any defect, we offer an immediate replacement or full refund within 7 days of verified delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display-brand text-xl font-semibold text-[#1C1C19]">2. Hygiene & Safety Standards</h2>
          <p>
            Due to the clinical and botanical nature of skincare, items that have been extensively used, opened without fault, or adulterated cannot be accepted for return due to sanitary and cross-contamination regulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display-brand text-xl font-semibold text-[#1C1C19]">3. Refund Disbursement Across Pakistan</h2>
          <p>
            Approved refunds are credited back to the customer within 3 business days via:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Direct Bank Transfer (IBAN / Raast)</li>
            <li>JazzCash Mobile Account</li>
            <li>EasyPaisa Mobile Account</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display-brand text-xl font-semibold text-[#1C1C19]">4. How to Initiate a Claim</h2>
          <p>
            Simply reach out to our client concierge via WhatsApp at <a href="https://wa.me/923001234567" className="text-[#725B38] font-semibold underline">+92 300 1234567</a> or email <a href="mailto:care@ebaskincare.pk" className="text-[#725B38] font-semibold underline">care@ebaskincare.pk</a> with your Order Number and photo proof of the damaged vessel.
          </p>
        </section>

        <div className="pt-6 border-t border-[#EADECF] flex items-center justify-between text-xs">
          <Link href="/contact-us" className="text-[#725B38] underline">Speak with Concierge</Link>
          <Link href="/shop" className="text-[#725B38] underline">Return to Shop</Link>
        </div>
      </div>
    </div>
  );
}
