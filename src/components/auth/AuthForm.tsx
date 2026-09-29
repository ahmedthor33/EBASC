'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BrandLogo } from '@/components/ui/BrandLogo';

interface AuthFormProps {
  initialTab?: 'signin' | 'signup';
}

export function AuthForm({ initialTab = 'signin' }: AuthFormProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, signUp, loginAsDemoAdmin, loginAsDemoCustomer } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/my-account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (tab === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMessage(error.message || 'Invalid email or password.');
          setIsSubmitting(false);
          return;
        }
        router.push(redirectTo);
      } else {
        if (!fullName.trim()) {
          setErrorMessage('Please enter your full name.');
          setIsSubmitting(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setErrorMessage(error.message || 'Unable to register account.');
          setIsSubmitting(false);
          return;
        }
        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push(redirectTo);
        }, 1200);
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAdmin = () => {
    loginAsDemoAdmin();
    router.push('/admin');
  };

  const handleDemoCustomer = () => {
    loginAsDemoCustomer();
    router.push('/my-account');
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto min-h-[760px] my-4 lg:my-8 bg-[#FFFFFF] rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-[#EADECF]">
      
      {/* Left Editorial Visual Showcase */}
      <div className="relative lg:col-span-6 xl:col-span-7 flex flex-col justify-between p-8 sm:p-12 lg:p-14 min-h-[460px] lg:min-h-full overflow-hidden bg-[#1F1B1A]">
        {/* Background Skincare Editorial Image with Overlay */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 ease-out scale-105 hover:scale-100 opacity-60"
          style={{
            backgroundImage: `url('/images/hero_women.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFE088] animate-pulse" />
            <span className="font-label-uppercase text-xs uppercase text-[#FDF9F4] tracking-[0.22em] drop-shadow-sm font-semibold">
              EBA Formulation Laboratory
            </span>
          </div>
          <span className="font-label-uppercase text-[11px] text-[#F7F3EE] tracking-widest uppercase px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            Pakistan Est. 2021
          </span>
        </div>

        {/* Middle Narrative */}
        <div className="relative z-10 mt-16 lg:mt-28 max-w-lg">
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#FFE088] border border-white/10 text-xs">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span className="font-label-uppercase tracking-wider font-semibold">Clinical Botanical Discipline</span>
          </div>
          <h1 className="font-display-lg text-3xl lg:text-5xl text-[#FFFFFF] tracking-tight leading-tight">
            Pure Botanical Resilience for Pakistani Microclimates.
          </h1>
          <p className="font-body-md text-sm text-[#E6E2DD] mt-4 leading-relaxed font-light">
            Calibrated formulations designed to defend cellular integrity against dense urban heat, coastal salinity, and seasonal arid swings across Karachi, Lahore, and Islamabad.
          </p>

          {/* Luxury Guarantee Badges */}
          <div className="mt-8 pt-6 space-y-4 border-t border-white/10">
            <div className="flex items-start gap-3.5 text-white">
              <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-[#FFE088] shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              </div>
              <div>
                <p className="font-label-ui text-xs text-[#FFFFFF] font-semibold tracking-wide">
                  Complimentary Priority Dispatch
                </p>
                <p className="font-body-sm text-xs text-[#CDC5C3] mt-0.5">
                  Guaranteed 24–48h tracked courier delivery with Cash on Delivery & digital options.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 text-white">
              <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-[#FFE088] shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <div>
                <p className="font-label-ui text-xs text-[#FFFFFF] font-semibold tracking-wide">
                  100% Halal & Non-Comedogenic
                </p>
                <p className="font-body-sm text-xs text-[#CDC5C3] mt-0.5">
                  Dermatologist formulated, alcohol-free, cruelty-free, and sealed for potency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="relative z-10 pt-6 mt-6 flex items-center justify-between text-xs text-[#E6E2DD]/80 border-t border-white/10">
          <span className="tracking-widest uppercase text-[10px]">Verified Apothecary Standard</span>
          <span className="tracking-wider text-[11px]">COD • JazzCash • EasyPaisa • Bank</span>
        </div>
      </div>

      {/* Right Column: Authentication Card & Tabs */}
      <div className="lg:col-span-6 xl:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-[#FFFFFF]">
        <div>
          {/* Header Brand */}
          <div className="flex items-center justify-between mb-8">
            <BrandLogo variant="light" size="md" href="/" />
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 font-label-ui text-xs text-[#4E4543] hover:text-[#1A1615] transition-colors"
            >
              <span>Explore Catalog</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="w-full p-1 bg-[#F7F3EE] rounded-xl flex items-center mb-8 border border-[#EADECF]">
            <button
              type="button"
              onClick={() => {
                setTab('signin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-lg font-label-ui text-xs text-center tracking-wide font-medium transition-all duration-300 ${
                tab === 'signin'
                  ? 'bg-white text-[#1C1C19] shadow-sm font-semibold'
                  : 'text-[#4E4543] hover:text-[#1C1C19]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-lg font-label-ui text-xs text-center tracking-wide font-medium transition-all duration-300 ${
                tab === 'signup'
                  ? 'bg-white text-[#1C1C19] shadow-sm font-semibold'
                  : 'text-[#4E4543] hover:text-[#1C1C19]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {tab === 'signup' && (
              <div>
                <label className="block font-label-ui text-xs font-semibold text-[#1C1C19] mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-[#7F7572]">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ayesha Khan"
                    className="w-full pl-11 pr-4 py-3 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-sm text-[#1C1C19] placeholder-[#7F7572] focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 transition-all"
                  />
                </div>
              </div>
            )}

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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-label-ui text-xs font-semibold text-[#1C1C19] uppercase tracking-wider">
                  Password
                </label>
                {tab === 'signin' && (
                  <Link
                    href="/forgot-password"
                    className="font-label-ui text-xs text-[#725B38] hover:text-[#1A1615] underline transition-colors"
                  >
                    Forgot Password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-[#7F7572]">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-[#FDF9F4] border border-[#EADECF] rounded-lg text-sm text-[#1C1C19] placeholder-[#7F7572] focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7F7572] hover:text-[#1C1C19] focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-4 rounded-full bg-[#1A1615] text-[#FDF9F4] font-label-uppercase text-xs tracking-widest font-semibold hover:bg-black transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : tab === 'signin' ? (
                <>
                  <span>Sign In to Sanctuary</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </>
              ) : (
                <>
                  <span>Create EBA Client Account</span>
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-8 pt-6 border-t border-[#EADECF]">
            <p className="font-label-uppercase text-[10px] text-center text-[#7F7572] tracking-wider uppercase mb-3 font-semibold">
              Instant Development & Review Access
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="py-2.5 px-3 rounded-lg border border-[#1A1615] bg-[#1F1B1A] text-[#FFE088] font-label-ui text-xs font-semibold hover:bg-black transition-all text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">shield_person</span>
                <span>Enter as Owner Admin</span>
              </button>
              <button
                type="button"
                onClick={handleDemoCustomer}
                className="py-2.5 px-3 rounded-lg border border-[#EADECF] bg-[#F7F3EE] text-[#1C1C19] font-label-ui text-xs font-semibold hover:bg-[#EBE8E3] transition-all text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">person</span>
                <span>Enter as Customer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Localized Bottom Trust Strip */}
        <div className="pt-8 text-center text-xs text-[#7F7572]">
          By proceeding, you agree to EBA Skin Care&apos;s{' '}
          <Link href="/privacy-policy" className="underline hover:text-[#1A1615]">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/return-and-refund-policy" className="underline hover:text-[#1A1615]">
            Terms of Service
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
