import { Capacitor } from '@capacitor/core';

export type NativePlatform = 'ios' | 'android';
export type PlatformType = 'web' | 'native';

// For local development, you can toggle these overrides
export const PLATFORM_TYPE_OVERRIDE: PlatformType | null = null;
export const NATIVE_PLATFORM_OVERRIDE: NativePlatform | null = null;

export const getIsNativePlatform = () => {
  if (PLATFORM_TYPE_OVERRIDE !== null) {
    return PLATFORM_TYPE_OVERRIDE === 'native';
  }
  return Capacitor.isNativePlatform();
};

export const getNativePlatform = (): NativePlatform | null => {
  if (NATIVE_PLATFORM_OVERRIDE) {
    return NATIVE_PLATFORM_OVERRIDE;
  }

  if (!getIsNativePlatform()) {
    return null;
  }

  const platform = Capacitor.getPlatform();
  return platform === 'ios' || platform === 'android' ? platform : null;
};

export const getPlatform = () => {
  return Capacitor.getPlatform();
};

export const getPlatformType = (): PlatformType => {
  return getIsNativePlatform() ? 'native' : 'web';
};

export const isIos = (): boolean => {
  return getNativePlatform() === 'ios';
};
