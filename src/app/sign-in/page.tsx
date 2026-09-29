import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata = {
  title: 'Sign In | EBA Skin Care',
  description: 'Sign in to your EBA Skin Care account to view past orders, track live shipments, and manage your bespoke skincare rituals.',
};

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-14rem)] w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-[#FDF9F4]">
      <Suspense fallback={<div className="text-center p-12 text-sm text-[#7F7572]">Loading authentication...</div>}>
        <AuthForm initialTab="signin" />
      </Suspense>
    </div>
  );
}
