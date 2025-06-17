import { TEST_EVENT_NAME } from './events';
import { client } from './posthog';

type CaptureEventParams = {
  event: string;
  distinctId: string;
  properties: Record<string, any>;
};

type NamedEventParams = Omit<CaptureEventParams, 'event'>;

export const captureEvent = async ({ event, distinctId, properties }: CaptureEventParams) => {
  client.capture({ event, distinctId, properties });
  await client.shutdown();
  return;
};

export const captureTestEvent = async ({ distinctId, properties }: NamedEventParams) => {
  return captureEvent({ event: TEST_EVENT_NAME, distinctId, properties });
};
