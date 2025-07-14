import { GetStaticProps } from 'next';
import Head from 'next/head';
import PatientSearchScreen from '@/screens/Search/PatientSearch';

export default function PatientSearchPage() {
  return (
    <>
      <Head>
        <title>Search Patients - Emergency Vet Portal</title>
        <meta name="description" content="Search for existing patients and owners" />
      </Head>
      <PatientSearchScreen />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};