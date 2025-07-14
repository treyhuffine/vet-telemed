import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import CaseSummaryScreen from '@/screens/CaseSummary/CaseSummary';

export default function CaseSummaryPage() {
  return (
    <>
      <Head>
        <title>Case Summary - Emergency Vet Portal</title>
        <meta name="description" content="Review and export case summary" />
      </Head>
      <CaseSummaryScreen />
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