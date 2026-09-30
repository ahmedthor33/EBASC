'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Phone, Mail, MessageSquare } from 'lucide-react';
import {
  getContactConfig,
  addContactInquiry,
  DEFAULT_CONTACT_CONFIG,
  ContactPageConfig,
} from '@/lib/contactStorage';

export default function ContactUsPage() {
  const [config, setConfig] = useState<ContactPageConfig>(DEFAULT_CONTACT_CONFIG);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Order & Delivery Tracking');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setConfig(getContactConfig());
    const handler = () => setConfig(getContactConfig());
    window.addEventListener('eba_contact_settings_updated', handler);
    return () => window.removeEventListener('eba_contact_settings_updated', handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContactInquiry({
      name,
      email,
      phone,
      subject,
      message,
    });
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#FDF9F4] text-[#1C1C19] pb-24">
      {/* Header */}
      <section className="w-full bg-[#F7F3EE] border-b border-[#EADECF] py-14 px-4 sm:px-6 lg:px-12 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EADECF] text-xs font-label-uppercase tracking-widest text-[#725B38] font-bold">
            <span>{config.headerBadge}</span>
          </div>
          <h1 className="font-display-lg text-3xl sm:text-5xl font-semibold">
            {config.headerTitle}
          </h1>
          <p className="font-body-md text-sm text-[#4E4543] max-w-xl mx-auto leading-relaxed">
            {config.headerSubtitle}
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Form + Regional Boutiques */}
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white border border-[#EADECF] rounded-3xl p-8 sm:p-10 shadow-sm">
            <h2 className="font-display-brand text-2xl font-semibold mb-2">
              Dispatch a Message to Our Concierge
            </h2>
            <p className="text-xs text-[#7F7572] mb-8">
              We aim to respond to all inquiries within 2 to 4 business hours.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Inquiry Dispatched Successfully</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Thank you, <strong>{name}</strong>. A dedicated client advisor will contact you via email at <strong>{email}</strong> or SMS shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs underline font-semibold"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Zaid Malik"
                      className="w-full px-3.5 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                      Mobile Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300 1234567"
                      className="w-full px-3.5 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="zaid@domain.com"
                      className="w-full px-3.5 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                      Inquiry Nature
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-xs focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="Order & Delivery Tracking">Order & Delivery Tracking</option>
                      <option value="Dermatological Consultation">Dermatological Consultation</option>
                      <option value="Payment Verification">Payment Verification (JazzCash/EasyPaisa)</option>
                      <option value="Return or Exchange Request">Return or Exchange Request</option>
                      <option value="Wholesale & Corporate Inquiries">Wholesale & Corporate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please specify your order number or skin regimen requirements..."
                    className="w-full px-3.5 py-2.5 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1A1615] text-[#FDF9F4] font-label-uppercase text-xs tracking-widest font-semibold hover:bg-black transition-all shadow-md"
                >
                  Send Inquiry to Concierge
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Direct Info & Geographic Locations */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#F7F3EE] border border-[#EADECF] shadow-sm space-y-6">
              <h3 className="font-display-brand text-xl font-semibold">Client Care Channels</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#725B38] shrink-0 border border-[#EADECF]">
                    <Phone className="w-4 h-4 text-[#725B38]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Direct Telephone Concierge</h4>
                    <p className="text-[#7F7572]">{config.phoneHours}</p>
                    <a href={`tel:${config.phone.replace(/\s+/g, '')}`} className="font-semibold text-[#1C1C19] hover:underline mt-0.5 block font-mono">
                      {config.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#725B38] shrink-0 border border-[#EADECF]">
                    <Mail className="w-4 h-4 text-[#725B38]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Electronic Correspondence</h4>
                    <p className="text-[#7F7572]">{config.emailSubtitle}</p>
                    <a href={`mailto:${config.email}`} className="font-semibold text-[#1C1C19] hover:underline mt-0.5 block">
                      {config.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#725B38] shrink-0 border border-[#EADECF]">
                    <MessageSquare className="w-4 h-4 text-[#725B38]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">WhatsApp Priority Assist</h4>
                    <p className="text-[#7F7572]">{config.whatsappSubtitle}</p>
                    <a
                      href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-emerald-700 hover:underline mt-0.5 block font-mono"
                    >
                      {config.whatsapp}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Pakistan Regional Locations */}
            <div className="p-8 rounded-3xl bg-white border border-[#EADECF] shadow-sm space-y-4 text-xs">
              <h3 className="font-display-brand text-lg font-semibold">Flagship Cleanrooms & Labs</h3>
              
              <div className="space-y-3 divide-y divide-[#EADECF]">
                {config.locations && config.locations.length > 0 ? (
                  config.locations.map((loc) => (
                    <div key={loc.id} className="pt-2 first:pt-0">
                      <p className="font-semibold text-[#1C1C19]">{loc.name}</p>
                      <p className="text-[#7F7572] mt-0.5">{loc.address}</p>
                    </div>
                  ))
                ) : (
                  <div className="pt-2">
                    <p className="font-semibold text-[#1C1C19]">Karachi Head Cleanroom</p>
                    <p className="text-[#7F7572]">Zamzama Commercial, Clifton, Karachi</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
