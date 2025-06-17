import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const date = new Date();
const isCapacitor = process.env.TARGET_PLATFORM === 'mobile';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  output: isCapacitor ? 'export' : undefined,
  distDir: isCapacitor ? 'out' : undefined,
  images: isCapacitor
    ? {
        unoptimized: true,
      }
    : {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'cdn.sanity.io',
            port: '',
            pathname: '**',
          },
        ],
      },
  async redirects() {
    return [
      {
        source: '/auth/callback',
        destination: '/',
        statusCode: 307,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/lytics/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/lytics/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/lytics/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  env: {
    APP_STAGE: process.env.APP_STAGE,
    TARGET_PLATFORM: process.env.TARGET_PLATFORM,
    BUILD_TIME: date.toString(),
    BUILD_TIMESTAMP: String(+date),
    GRAPHQL_URL: process.env.GRAPHQL_URL,
    ROOT_URL: process.env.ROOT_URL,
    APP_URL: process.env.APP_URL,
    REMOTE_API_URL: process.env.REMOTE_API_URL,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    SENTRY_INGEST: process.env.SENTRY_INGEST,
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    CLOUDFLARE_PUBLIC_URL: process.env.CLOUDFLARE_PUBLIC_URL,
    // STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    // GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
    // SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
    // SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/sentury',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
