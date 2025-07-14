import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import VitalsCaptureScreen from '@/screens/Intake/VitalsCapture';

export default function VitalsCapturePages() {
  return (
    <>
      <Head>
        <title>Vitals Capture - Emergency Vet Portal</title>
        <meta name="description" content="Capture patient vitals and triage information" />
      </Head>
      <VitalsCaptureScreen />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};