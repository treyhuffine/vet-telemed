import { getIsNativePlatform } from '@/lib/client/mobile';

const API_ROOT = getIsNativePlatform() ? process.env.REMOTE_API_URL : process.env.APP_URL;
export const API_URL = `${API_ROOT}/api`;

export const KEEP_ALIVE_PACKET = '[KEEP_ALIVE]';
