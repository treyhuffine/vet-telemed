import { GetStaticProps } from 'next';
import { Page } from '@/components/utils/Page';
import ClinicOnboardingScreen from '@/screens/Onboarding/ClinicOnboarding';

export default function ClinicOnboardingPage() {
  return (
    <Page title="Clinic Onboarding" description="Set up your veterinary clinic on EmergencyVet">
      <ClinicOnboardingScreen />
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};