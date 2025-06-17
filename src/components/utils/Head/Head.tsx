import * as React from 'react';
import NextHead from 'next/head';
import { useRouter } from 'next/router';
import { APP_CONFIG, SEO_CONFIG, generateBrandTitle } from '@/constants/config';

const DEFAULT_DESCRIPTION = APP_CONFIG.tagline;
const DEFAULT_IMAGE = `${process.env.APP_URL}/og.png`;

export interface Props {
  title?: string;
  description?: string;
  url?: string;
  ogImage?: string;
  preventBrandTitle?: boolean;
  useCurrentUrl?: boolean;
  isNoIndex?: boolean;
}

const addBrandTitle = (title?: string) => generateBrandTitle(title);

const getTitle = (title?: string, preventBrandTitle?: boolean) => {
  if (!title) {
    return '';
  }

  return preventBrandTitle ? title : addBrandTitle(title);
};

const getCurrentUrl = (asPath?: string) => {
  return `${process.env.APP_URL}${asPath}`;
};

const getUrl = ({ url, asPath }: { url?: string; asPath?: string }) => {
  return url ? url : getCurrentUrl(asPath);
};

export default function Head({
  title,
  description,
  url,
  ogImage,
  preventBrandTitle,
  isNoIndex,
}: Props) {
  const router = useRouter();
  const finalTitle = getTitle(title, preventBrandTitle);
  const finalUrl = getUrl({ url, asPath: router.asPath });

  return (
    <NextHead>
      {(isNoIndex || process.env.APP_STAGE !== 'production') && (
        <meta name="robots" content="noindex" />
      )}

      <title>{finalTitle}</title>
      <link rel="canonical" href={finalUrl} />
      <meta name="description" content={description || DEFAULT_DESCRIPTION} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description || DEFAULT_DESCRIPTION} />
      <meta property="og:image" content={ogImage || DEFAULT_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={description || DEFAULT_DESCRIPTION} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage || DEFAULT_IMAGE} />
    </NextHead>
  );
}
