import { GetStaticProps } from 'next';
import { Page } from '@/components/utils/Page';
import TrainingCenterScreen from '@/screens/Training/TrainingCenter';
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout';

export default function TrainingCenterPage() {
  return (
    <Page title="Training Center" description="Build your skills with interactive training">
      <AuthenticatedLayout>
        <TrainingCenterScreen />
      </AuthenticatedLayout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};