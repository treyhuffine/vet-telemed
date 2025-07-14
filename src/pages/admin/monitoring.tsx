import { GetStaticProps } from 'next';
import { Page } from '@/components/utils/Page';
import MonitoringScreen from '@/screens/Admin/Monitoring';
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout';

export default function MonitoringPage() {
  return (
    <Page title="System Monitoring" description="Real-time system health and performance metrics">
      <AuthenticatedLayout>
        <MonitoringScreen />
      </AuthenticatedLayout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};