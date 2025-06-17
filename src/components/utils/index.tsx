import { ReactNode } from 'react';
import {
  NativePlatform,
  PlatformType,
  getIsNativePlatform,
  getNativePlatform,
} from '@/lib/client/mobile';

interface PlatformTypeProps {
  children: ReactNode;
  platform: PlatformType;
}

interface DetailedPlatformProps {
  children: ReactNode;
  platform: NativePlatform | 'web';
}

interface PlatformSwitchProps {
  web?: ReactNode;
  native?: ReactNode;
  // For when you need platform-specific rendering
  ios?: ReactNode;
  android?: ReactNode;
}

// Simple web vs native rendering
export function PlatformTypeRenderer({ children, platform }: PlatformTypeProps) {
  const isNative = getIsNativePlatform();
  const shouldRender = platform === 'native' ? isNative : !isNative;
  return shouldRender ? <>{children}</> : null;
}

// Detailed platform-specific rendering when needed
export function DetailedPlatformRenderer({ children, platform }: DetailedPlatformProps) {
  const isNative = getIsNativePlatform();
  const nativePlatform = getNativePlatform();

  if (platform === 'web') {
    return !isNative ? <>{children}</> : null;
  }

  return nativePlatform === platform ? <>{children}</> : null;
}

// Flexible switch that handles both simple and detailed cases
export function PlatformSwitch({ web, native, ios, android }: PlatformSwitchProps) {
  const isNative = getIsNativePlatform();
  const nativePlatform = getNativePlatform();

  if (!isNative) {
    return web ? <>{web}</> : null;
  }

  // If platform-specific content is provided, use it
  if (nativePlatform === 'ios' && ios) {
    return <>{ios}</>;
  }
  if (nativePlatform === 'android' && android) {
    return <>{android}</>;
  }

  // Fall back to general native content
  return native ? <>{native}</> : null;
}

// Convenience components
export function WebOnly({ children }: { children: ReactNode }) {
  return <PlatformTypeRenderer platform="web">{children}</PlatformTypeRenderer>;
}

export function NativeOnly({ children }: { children: ReactNode }) {
  return <PlatformTypeRenderer platform="native">{children}</PlatformTypeRenderer>;
}

// Platform-specific components when needed
export function IOSOnly({ children }: { children: ReactNode }) {
  return <DetailedPlatformRenderer platform="ios">{children}</DetailedPlatformRenderer>;
}

export function AndroidOnly({ children }: { children: ReactNode }) {
  return <DetailedPlatformRenderer platform="android">{children}</DetailedPlatformRenderer>;
}
