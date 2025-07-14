import { GetStaticProps } from 'next';
import { Page } from '@/components/utils/Page';
import HelpCenterScreen from '@/screens/Help/HelpCenter';
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout';

export default function HelpCenterPage() {
  return (
    <Page title="Help Center" description="Find answers and learn how to use EmergencyVet">
      <AuthenticatedLayout>
        <HelpCenterScreen />
      </AuthenticatedLayout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};