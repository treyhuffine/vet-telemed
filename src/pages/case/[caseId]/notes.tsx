import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import SOAPNotesEditorScreen from '@/screens/Notes/SOAPNotesEditor';

export default function SOAPNotesPage() {
  return (
    <>
      <Head>
        <title>Clinical Notes - Emergency Vet Portal</title>
        <meta name="description" content="Create SOAP notes for patient consultation" />
      </Head>
      <SOAPNotesEditorScreen />
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