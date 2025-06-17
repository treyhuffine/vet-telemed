import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ROOT_PAGE_URL } from '@/constants/pages';
import { getIsNewUserAuth } from '@/lib/client/getIsNewUserAuth';
import { useAuth } from '@/context/Auth';

export default function Onboard() {
  const router = useRouter();
  const { isUser, isAnonymous, isReady, session } = useAuth();
  const [isRouting, setIsRouting] = useState(false);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (isRouting) {
      return;
    }

    if (isAnonymous) {
      setIsRouting(true);
      router.push(ROOT_PAGE_URL);
      return;
    }

    const needsOnboarding = getIsNewUserAuth(session.user);

    if (!needsOnboarding) {
      setIsRouting(true);
      router.push(ROOT_PAGE_URL);
      return;
    }

    setIsRouting(true);
    router.push(ROOT_PAGE_URL);
  }, [isUser, isReady, isAnonymous, router, session, isRouting]);

  if (!isReady) {
    return;
  }

  return (
    <div className="flex min-h-dvh w-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">Setting up your experience...</h1>
        <p className="text-muted-foreground">Just a moment while we get everything ready.</p>
      </div>
    </div>
  );
}
