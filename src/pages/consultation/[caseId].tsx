import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import VideoConsultationScreen from '@/screens/Consultation/VideoConsultation';

export default function VideoConsultationPage() {
  return (
    <>
      <Head>
        <title>Video Consultation - Emergency Vet Portal</title>
        <meta name="description" content="Live video consultation with emergency vet" />
      </Head>
      <VideoConsultationScreen />
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