import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useVetAuth } from '@/context/VetAuth';

export default function QueuePage() {
  const router = useRouter();
  const { user } = useVetAuth();

  useEffect(() => {
    // Redirect to dashboard which handles queue display based on role
    router.push('/dashboard');
  }, [router]);

  return (
    <>
      <Head>
        <title>Queue - Emergency Vet Portal</title>
        <meta name="description" content="Emergency vet queue management" />
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};