'use client';

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/_/studio/[[...tool]]/page.tsx` route
 */
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { media } from 'sanity-plugin-media';
import { structureTool } from 'sanity/structure';
// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './src/services/server/sanity/env';
import { schema } from './src/services/server/sanity/schemaTypes';
import { structure } from './src/services/server/sanity/structure';

export default defineConfig({
  basePath: '/_/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    media(),
  ],
});
