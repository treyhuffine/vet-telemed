import { GetStaticProps } from 'next';
import { Page } from '@/components/utils/Page';
import ClinicSettingsScreen from '@/screens/Admin/ClinicSettings';
import { useVetAuth } from '@/context/VetAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ClinicSettingsPage() {
  const { user, loading } = useVetAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <Page title="Loading..." description="Loading clinic settings">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Clinic Settings" description="Manage clinic configuration and preferences">
      <ClinicSettingsScreen />
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};