import { GetStaticProps } from 'next';
import { Page } from '@/components/utils/Page';
import SystemHealthScreen from '@/screens/Admin/SystemHealth';
import { useVetAuth } from '@/context/VetAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function SystemHealthPage() {
  const { user, loading } = useVetAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <Page title="Loading..." description="Loading system health">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Page>
    );
  }

  return (
    <Page title="System Health" description="Monitor system performance and service status">
      <SystemHealthScreen />
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};