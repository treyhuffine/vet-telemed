import { GetStaticProps } from 'next';
import { Page } from '@/components/utils/Page';
import PasswordResetScreen from '@/screens/Auth/PasswordReset';

export default function PasswordResetPage() {
  return (
    <Page title="Reset Password" description="Reset your EmergencyVet account password">
      <PasswordResetScreen />
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};