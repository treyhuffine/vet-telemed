import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { ROOT_PAGE_URL } from '@/constants/pages';
import { reset } from '@/services/client/analytics';
import { signOut } from '@/services/client/supabase';
import { Page } from '@/components/utils/Page';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const { error } = await signOut();
        reset();

        if (error) {
          throw error;
        }
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        // Always redirect to home page, even if there was an error
        router.push(ROOT_PAGE_URL);
      }
    };

    handleLogout();
  }, [router]);

  // Return empty div while handling logout and redirect

  return (
    <Page isNoIndex title="Log Out" description="Log out of your account.">
      <div />
    </Page>
  );
}
