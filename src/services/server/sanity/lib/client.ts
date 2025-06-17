import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

/**
 * @note since I will be caching inside the app, I don't need to use the CDN to ensure I get the latest content from Sanity
 */
const SHOULD_USE_CDN = false;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: SHOULD_USE_CDN,
});
