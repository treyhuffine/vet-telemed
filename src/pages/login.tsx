import { GetStaticProps } from 'next';
import Head from 'next/head';
import LoginScreen from '@/screens/Auth/Login';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login - Emergency Vet Portal</title>
        <meta name="description" content="Sign in to the Emergency Vet Portal" />
      </Head>
      <LoginScreen />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};