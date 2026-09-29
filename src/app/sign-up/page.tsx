import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata = {
  title: 'Create Account | EBA Skin Care',
  description: 'Join EBA Skin Care to unlock complimentary priority shipping, personalized consultations, and exclusive access to seasonal formulations.',
};

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-14rem)] w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-[#FDF9F4]">
      <Suspense fallback={<div className="text-center p-12 text-sm text-[#7F7572]">Loading registration...</div>}>
        <AuthForm initialTab="signup" />
      </Suspense>
    </div>
  );
}
