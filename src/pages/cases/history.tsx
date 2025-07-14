import { GetStaticProps } from 'next';
import { Page } from '@/components/utils/Page';
import CaseHistoryScreen from '@/screens/Cases/CaseHistory';
import { useVetAuth } from '@/context/VetAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function CaseHistoryPage() {
  const { user, loading } = useVetAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role === 'vet_tech')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role === 'vet_tech') {
    return (
      <Page title="Loading..." description="Loading case history">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Case History" description="Review past consultations and treatments">
      <CaseHistoryScreen />
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};