import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import TreatmentPlanBuilderScreen from '@/screens/TreatmentPlan/TreatmentPlanBuilder';

export default function TreatmentPlanPage() {
  return (
    <>
      <Head>
        <title>Treatment Plan - Emergency Vet Portal</title>
        <meta name="description" content="Create treatment plan for patient" />
      </Head>
      <TreatmentPlanBuilderScreen />
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