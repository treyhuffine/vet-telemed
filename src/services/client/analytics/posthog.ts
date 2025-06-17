import posthog from 'posthog-js';

if (typeof window !== 'undefined' && process.env.APP_STAGE === 'production') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_API_HOST!,
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST!,
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    },
  });
}

export default posthog;
