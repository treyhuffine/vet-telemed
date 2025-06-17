import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ONBOARD_PAGE_URL, ROOT_PAGE_URL } from '@/constants/pages';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { OtpVerificationForm } from '@/components/auth/OtpVerificationForm';

export default function VerifyOtpPage() {
  const router = useRouter();
  const { email: encodedEmail } = router.query;
  const email = encodedEmail ? decodeURIComponent(encodedEmail as string) : '';
  const { redirectElement } = useAuthRedirect();

  useEffect(() => {
    if (router.isReady && !encodedEmail) {
      router.push(ROOT_PAGE_URL);
    }
  }, [encodedEmail, router]);

  if (redirectElement) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        {redirectElement}
      </div>
    );
  }

  if (!encodedEmail) {
    return null;
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <OtpVerificationForm
          email={email}
          onBack={() => router.push(ROOT_PAGE_URL)}
          onSuccess={() => router.push(ONBOARD_PAGE_URL)}
        />
      </div>
    </div>
  );
}
