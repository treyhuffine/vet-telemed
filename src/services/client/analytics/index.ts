import * as Sentry from '@sentry/nextjs';
import posthog from '@/services/client/analytics/posthog';
import { getIsNativePlatform, getPlatform } from '@/lib/client/mobile';

// Host regex does not match
// ^(localhost|127\.0\.0\.1)($|:)

const IS_PRODUCTION_ONLY = false;
const isProduction = process.env.APP_STAGE === 'production';

export const isAnalyticsEnabled = () => {
  if (IS_PRODUCTION_ONLY) return isProduction;
  return true;
};

export const logPageview = () => {
  if (isAnalyticsEnabled()) {
    // Does this happen automatically for posthog?
    posthog.capture('$pageview', {
      platform: getPlatform(),
      isNative: getIsNativePlatform(),
    });
  }
};

type IdentifyParams = {
  userId: string;
  email?: string;
  name?: string;
  additionalUserParams: object;
};
export const identify = (params: IdentifyParams) => {
  if (!params.userId || !isAnalyticsEnabled()) return;

  const { userId, email, name, additionalUserParams } = params;
  posthog.identify(userId, {
    ...additionalUserParams,
    email,
    name,
  });
  Sentry.setUser({ id: userId, email, name });
};

export const reset = () => {
  if (isAnalyticsEnabled()) {
    posthog.reset();
    Sentry.setUser(null);
  }
};

export const trackEvent = (eventName: string, eventParams: Record<string, any>) => {
  if (isAnalyticsEnabled()) {
    posthog.capture(eventName, {
      ...eventParams,
      platform: getPlatform(),
      isNative: getIsNativePlatform(),
    });

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, eventParams);
    }
  }
};
