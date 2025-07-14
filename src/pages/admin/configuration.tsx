import { GetStaticProps } from 'next';
import { Page } from '@/components/utils/Page';
import SystemConfigurationScreen from '@/screens/Admin/SystemConfiguration';
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout';

export default function SystemConfigurationPage() {
  return (
    <Page title="System Configuration" description="Manage platform settings and integrations">
      <AuthenticatedLayout>
        <SystemConfigurationScreen />
      </AuthenticatedLayout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};