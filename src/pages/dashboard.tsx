import { GetStaticProps } from 'next';
import Head from 'next/head';
import DashboardScreen from '@/screens/Dashboard';

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Dashboard - Emergency Vet Portal</title>
        <meta name="description" content="Emergency Vet Portal Dashboard" />
      </Head>
      <DashboardScreen />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};