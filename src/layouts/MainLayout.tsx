import { ReactNode } from 'react';
import { Navigation } from '@/components/Navigation';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex h-full min-h-dvh grow flex-col pb-safe-bottom pl-safe-left pr-safe-right pt-safe-top">
      <Navigation />
      {children}
    </div>
  );
}
