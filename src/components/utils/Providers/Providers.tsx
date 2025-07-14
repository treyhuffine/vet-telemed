'use client';

import { useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { PostHogProvider } from 'posthog-js/react';
import posthog from '@/services/client/analytics/posthog';
import { useApollo } from '@/lib/client/apolloClient';
import { AuthProvider } from '@/context/Auth';
import { AuthDialogProvider } from '@/context/AuthDialog';
import { ChatProvider } from '@/context/Chat';
import { ThemeProvider } from '@/context/NextThemeProvider';
import { VetAuthProvider } from '@/context/VetAuth';
import { DemoDataProvider } from '@/context/DemoData';
import { AuthDialog } from '@/components/auth';
import { Toaster } from '@/components/ui/sonner';

const DEFAULT_OFFSET = 16;
type Offset = {
  top: string;
  bottom: string;
  left: string;
  right: string;
};

interface Props {
  children: React.ReactNode;
  pageProps?: any;
}

const getSafeArea = () => {
  const safeAreaTop =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sat')) || 0;
  const safeAreaRight =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sar')) || 0;
  const safeAreaBottom =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sab')) || 0;
  const safeAreaLeft =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sal')) || 0;

  return {
    top: safeAreaTop,
    right: safeAreaRight,
    bottom: safeAreaBottom,
    left: safeAreaLeft,
  };
};

// Wrapper component for Toaster that waits until insets are ready
function ToasterWithOffset() {
  const [isReady, setIsReady] = useState(false);
  const [offset, setOffset] = useState<undefined | Offset>(undefined);

  useEffect(() => {
    // Calculate insets and then render the Toaster
    const calculateInsets = () => {
      /**
       * @note needed a delay to render propery and ensure safeareas get set
       */
      setTimeout(() => {
        const safeArea = getSafeArea();

        if (safeArea.top || safeArea.bottom || safeArea.left || safeArea.right) {
          setOffset({
            top: `${DEFAULT_OFFSET + safeArea.top}px`,
            bottom: `${DEFAULT_OFFSET + safeArea.bottom}px`,
            left: `${DEFAULT_OFFSET + safeArea.left}px`,
            right: `${DEFAULT_OFFSET + safeArea.right}px`,
          });
        } else {
          setOffset(undefined);
        }

        setIsReady(true);
      }, 500);
    };

    // Calculate immediately
    calculateInsets();

    // Set up event listeners for recalculation
    window.addEventListener('orientationchange', calculateInsets);
    window.addEventListener('resize', calculateInsets);

    return () => {
      window.removeEventListener('orientationchange', calculateInsets);
      window.removeEventListener('resize', calculateInsets);
    };
  }, []);

  // Don't render anything until we have insets
  if (!isReady) return null;

  return <Toaster richColors mobileOffset={offset} />;
}

export function Providers({ children, pageProps = {} }: Props) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <VetAuthProvider>
          <DemoDataProvider>
            <AuthDialogProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <PostHogProvider client={posthog}>
                  <ChatProvider>
                    {children}
                    <ToasterWithOffset />
                    <AuthDialog />
                  </ChatProvider>
                </PostHogProvider>
              </ThemeProvider>
            </AuthDialogProvider>
          </DemoDataProvider>
        </VetAuthProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
