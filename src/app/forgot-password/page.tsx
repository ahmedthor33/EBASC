'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    const res = await resetPassword(email);
    if (res.error) {
      setError(res.error.message || 'Unable to process password reset request.');
    } else {
      setMessage(
        'Password recovery instructions have been dispatched to your email address. Please inspect your inbox and spam folder.'
      );
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-[#FDF9F4]">
      <div className="w-full max-w-md bg-white border border-[#EADECF] rounded-2xl p-8 sm:p-10 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F7F3EE] text-[#725B38] mb-3">
            <span className="material-symbols-outlined text-[26px]">lock_reset</span>
          </div>
          <h1 className="font-display-brand text-2xl text-[#1C1C19] uppercase tracking-wider font-semibold">
            Password Recovery
          </h1>
          <p className="font-body-sm text-xs text-[#7F7572] mt-2 leading-relaxed">
            Enter your registered email address to receive secure reset credentials.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 leading-relaxed">
            <span className="material-symbols-outlined text-[18px] shrink-0">check_circle</span>
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-label-ui text-xs font-semibold text-[#1C1C19] mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-[#7F7572]">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="w-full pl-11 pr-4 py-3 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-sm text-[#1C1C19] placeholder-[#7F7572] focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-[#1A1615] text-[#FDF9F4] font-label-uppercase text-xs tracking-widest font-semibold hover:bg-black transition-all shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Sending Instructions...</span>
              </>
            ) : (
              <span>Dispatch Reset Link</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#EADECF] text-center">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 font-label-ui text-xs text-[#725B38] hover:text-[#1A1615] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
