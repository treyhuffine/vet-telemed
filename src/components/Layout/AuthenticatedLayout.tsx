'use client';

import { ReactNode } from 'react';
import MainNav from '@/components/Navigation/MainNav';
import { useVetAuth } from '@/context/VetAuth';
import FeedbackWidget from '@/components/Feedback/FeedbackWidget';
import OfflineIndicator from '@/components/OfflineIndicator/OfflineIndicator';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user } = useVetAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <div className="pt-16">
        {children}
      </div>
      <FeedbackWidget />
      <OfflineIndicator />
    </div>
  );
}