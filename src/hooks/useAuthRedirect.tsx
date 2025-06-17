import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ONBOARD_PAGE_URL } from '@/constants/pages';
import { useAuth } from '@/context/Auth';

interface UseAuthRedirectOptions {
  redirectUrl?: string;
  redirectElement?: ReactNode;
  shouldOnlyCheckInitialLogin?: boolean;
}

const DefaultRedirectElement = (
  <div className="flex flex-col items-center gap-4 text-center">
    <h2 className="text-xl font-semibold">Successfully logged in!</h2>
    <p className="text-sm text-muted-foreground">Let&apos;s help you bake...</p>
  </div>
);

export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
  const {
    redirectUrl = ONBOARD_PAGE_URL,
    redirectElement = DefaultRedirectElement,
    shouldOnlyCheckInitialLogin = true,
  } = options;

  const router = useRouter();
  const { isUser, isAnonymous, isReady } = useAuth();
  const [hasCheckedInitialLogin, setHasCheckedInitialLogin] = useState(false);

  useEffect(() => {
    if (shouldOnlyCheckInitialLogin && hasCheckedInitialLogin) {
      return;
    }

    if (!isReady) {
      return;
    }

    setHasCheckedInitialLogin(true);

    if (isAnonymous || !isUser) {
      return;
    }

    router.push(redirectUrl);
  }, [
    isUser,
    router,
    redirectUrl,
    shouldOnlyCheckInitialLogin,
    hasCheckedInitialLogin,
    isReady,
    isAnonymous,
  ]);

  if (isUser) {
    return {
      isAuthenticated: true,
      redirectElement,
    };
  }

  return {
    isAuthenticated: false,
    redirectElement: null,
  };
}
