import { GetStaticProps } from 'next';
import { Page } from '@/components/utils/Page';
import DataExportScreen from '@/screens/Admin/DataExport';
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout';

export default function DataExportPage() {
  return (
    <Page title="Data Export" description="Export your data in various formats">
      <AuthenticatedLayout>
        <DataExportScreen />
      </AuthenticatedLayout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};