import { GetStaticProps } from 'next';
import { Page } from '@/components/utils/Page';
import RoleSelectionScreen from '@/screens/Auth/RoleSelection';

export default function RoleSelectionPage() {
  return (
    <Page title="Select Your Role" description="Choose your role to access the appropriate features">
      <RoleSelectionScreen />
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};