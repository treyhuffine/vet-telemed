import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Inter, Poppins } from 'next/font/google';
import Head from 'next/head';
import Script from 'next/script';
import { APP_VIEWPORT, WEB_VIEWPORT } from '@/constants/app';
import { APP_CONFIG } from '@/constants/config';
import { getIsNativePlatform } from '@/lib/client/mobile';
import { Providers } from '@/components/utils/Providers';
import { StagingMobileAppOverlay } from '@/components/utils/StagingMobileAppOverlay';
import '@/styles/globals.css';

const GTAG = process.env.GOOGLE_ANALYTICS_ID;

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter', // Define a CSS variable for body text
  style: ['normal', 'italic'],
  display: 'swap',
});
const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body', // Define a CSS variable for body text
  style: ['normal', 'italic'],
  display: 'swap',
});
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins', // Define a CSS variable for titles
  style: ['normal', 'italic'],
  display: 'swap',
});
const title = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-title', // Define a CSS variable for titles
  style: ['normal', 'italic'],
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  const viewport = getIsNativePlatform() ? APP_VIEWPORT : WEB_VIEWPORT;

  useEffect(() => {
    const initConsole = async () => {
      if (process.env.TARGET_PLATFORM === 'mobile' && process.env.APP_ENV === 'development') {
        await import('eruda').then((eruda) => {
          eruda.default.init();
        });
      }
    };
    initConsole();
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content={viewport} />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href={`${process.env.APP_URL}/icons/favicon-96x96.png`}
        />
        <link
          rel="alternate shortcut icon"
          type="image/x-icon"
          href={`${process.env.APP_URL}/icons/favicon.ico`}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${process.env.APP_URL}/icons/apple-touch-icon.png`}
        />
        <meta name="application-name" content={APP_CONFIG.name} />
        <meta name="apple-mobile-web-app-title" content={APP_CONFIG.name} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href={`${process.env.APP_URL}/site.webmanifest`} />
      </Head>
      <Script id="demo-script">{`(function() { console.log("Hello! You're doing great today."); })();`}</Script>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GTAG}`} />
      <Script id="google-analytics">
        {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GTAG}');
          `}
      </Script>
      <div className={`${inter.variable} ${poppins.variable} ${body.variable} ${title.variable}`}>
        <Providers pageProps={pageProps}>
          <StagingMobileAppOverlay />
          <Component {...pageProps} />
        </Providers>
      </div>
    </>
  );
}
