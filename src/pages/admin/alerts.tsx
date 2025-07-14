import { GetStaticProps } from 'next';
import { Page } from '@/components/utils/Page';
import AlertingConfigScreen from '@/screens/Admin/AlertingConfig';
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout';

export default function AlertingConfigPage() {
  return (
    <Page title="Alerting Configuration" description="Configure monitoring alerts and notifications">
      <AuthenticatedLayout>
        <AlertingConfigScreen />
      </AuthenticatedLayout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};