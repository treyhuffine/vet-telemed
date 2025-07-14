import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import CaseDetailScreen from '@/screens/Case/CaseDetail';

export default function CaseDetailPage() {
  return (
    <>
      <Head>
        <title>Case Details - Emergency Vet Portal</title>
        <meta name="description" content="View case details and patient information" />
      </Head>
      <CaseDetailScreen />
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