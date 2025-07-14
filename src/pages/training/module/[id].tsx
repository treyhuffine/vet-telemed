import { GetStaticProps, GetStaticPaths } from 'next';
import { Page } from '@/components/utils/Page';
import TrainingModuleScreen from '@/screens/Training/TrainingModule';
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout';

export default function TrainingModulePage() {
  return (
    <Page title="Training Module" description="Complete your training module">
      <AuthenticatedLayout>
        <TrainingModuleScreen />
      </AuthenticatedLayout>
    </Page>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // In a real app, this would fetch all module IDs from the database
  const paths = [
    { params: { id: '1' } },
    { params: { id: '2' } },
    { params: { id: '3' } },
    { params: { id: '4' } },
    { params: { id: '5' } },
    { params: { id: '6' } },
  ];

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // In a real app, this would fetch the specific module data
  return {
    props: {
      moduleId: params?.id || '1',
    },
  };
};