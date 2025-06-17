// console.log(
//   'process.env.NEXT_PUBLIC_SANITY_API_VERSION',
//   process.env.NEXT_PUBLIC_SANITY_API_VERSION,
// );
// console.log('process.env.NEXT_PUBLIC_SANITY_DATASET', process.env.NEXT_PUBLIC_SANITY_DATASET);
// console.log('process.env.NEXT_PUBLIC_SANITY_PROJECT_ID', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
// console.log('process.env.SANITY_STUDIO_DATASET', process.env.SANITY_STUDIO_DATASET);
// console.log('process.env.SANITY_STUDIO_PROJECT_ID', process.env.SANITY_STUDIO_PROJECT_ID);
// console.log('process.env.SANITY_STUDIO_API_VERSION', process.env.SANITY_STUDIO_API_VERSION);

const datasetEnv =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';
const projectIdEnv =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || 'drzh1lq8';
const apiVersionEnv =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_STUDIO_API_VERSION ||
  '2025-02-24';

export const apiVersion = apiVersionEnv;

export const dataset = assertValue(
  datasetEnv,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET',
);

export const projectId = assertValue(
  projectIdEnv,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID',
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
