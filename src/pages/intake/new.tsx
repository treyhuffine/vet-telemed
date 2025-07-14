import { GetStaticProps } from 'next';
import Head from 'next/head';
import NewPatientScreen from '@/screens/Intake/NewPatient';

export default function NewPatientPage() {
  return (
    <>
      <Head>
        <title>New Patient - Emergency Vet Portal</title>
        <meta name="description" content="Check in a new patient" />
      </Head>
      <NewPatientScreen />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};