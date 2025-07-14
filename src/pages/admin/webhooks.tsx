import { GetStaticProps } from 'next';
import { Page } from '@/components/utils/Page';
import WebhookManagementScreen from '@/screens/Admin/WebhookManagement';
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout';

export default function WebhookManagementPage() {
  return (
    <Page title="Webhook Management" description="Configure PIMS integrations and webhooks">
      <AuthenticatedLayout>
        <WebhookManagementScreen />
      </AuthenticatedLayout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};