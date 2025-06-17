import React from 'react';
import { Head, Props as HeadProps } from '@/components/utils/Head';

interface PageProps extends HeadProps {
  children: React.ReactNode;
}

export default function Page({ children, ...headProps }: PageProps) {
  return (
    <>
      <Head {...headProps} />
      {children}
    </>
  );
}
