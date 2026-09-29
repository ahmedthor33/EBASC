import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | EBA Skin Care',
  description: 'Learn how EBA Skin Care protects and respects your client confidentiality and personal data in Pakistan.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-12 py-16 w-full text-[#1C1C19]">
      <div className="mb-10 text-center">
        <span className="font-label-uppercase text-xs tracking-widest text-[#725B38] font-bold uppercase">
          Client Sanctuary Commitment
        </span>
        <h1 className="font-display-lg text-3xl sm:text-5xl font-semibold mt-2 mb-3">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#7F7572]">Last Updated: September 2026 • Pakistan Legal Compliance</p>
      </div>

      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#EADECF] shadow-sm space-y-8 text-sm leading-relaxed text-[#4E4543]">
        <section className="space-y-3">
          <h2 className="font-display-brand text-xl font-semibold text-[#1C1C19]">1. Information Collection</h2>
          <p>
            When you purchase formulations or register an account at EBA Skin Care, we collect your name, mobile phone number, shipping address, and email address solely to dispatch, track, and verify your orders through our courier partners across Pakistan (TCS, Leopard, Call Courier, Trax).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display-brand text-xl font-semibold text-[#1C1C19]">2. Payment Processing & Security</h2>
          <p>
            We do not store complete debit or credit card details on our local servers. Mobile wallet transactions (JazzCash and EasyPaisa) and direct bank deposits (Meezan Bank) are verified via official Transaction IDs (TID) or banking screenshots uploaded by the customer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display-brand text-xl font-semibold text-[#1C1C19]">3. Courier & SMS Tracking</h2>
          <p>
            Your mobile telephone number is shared strictly with authorized courier services for the sole purpose of dispatch notifications, SMS tracking alerts, and doorstep delivery coordination.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display-brand text-xl font-semibold text-[#1C1C19]">4. Client Rights & Deletion</h2>
          <p>
            You retain full rights to inspect, update, or request permanent deletion of your patron profile data by contacting our concierge at <a href="mailto:care@ebaskincare.pk" className="text-[#725B38] underline">care@ebaskincare.pk</a>.
          </p>
        </section>

        <div className="pt-6 border-t border-[#EADECF] flex items-center justify-between text-xs">
          <Link href="/contact-us" className="text-[#725B38] underline">Contact Client Support</Link>
          <Link href="/return-and-refund-policy" className="text-[#725B38] underline">View Return Policy</Link>
        </div>
      </div>
    </div>
  );
}
