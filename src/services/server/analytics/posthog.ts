import { PostHog } from 'posthog-node';

export const client = new PostHog(process.env.POSTHOG_KEY!, {
  host: process.env.POSTHOG_UI_HOST,
  flushAt: 1,
  flushInterval: 0,
});
