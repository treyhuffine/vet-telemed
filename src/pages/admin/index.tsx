import { GetStaticProps } from 'next';
import Head from 'next/head';
import AdminDashboard from '@/screens/Dashboard/AdminDashboard';

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Admin Dashboard - Emergency Vet Portal</title>
        <meta name="description" content="Emergency Vet Portal Admin Dashboard" />
      </Head>
      <AdminDashboard />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};