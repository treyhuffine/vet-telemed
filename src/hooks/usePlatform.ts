import { useEffect, useState } from 'react';
import {
  NativePlatform,
  PlatformType,
  getNativePlatform,
  getPlatformType,
} from '@/lib/client/mobile';

type UsePlatformReturn = {
  platformType: PlatformType;
  nativePlatform: NativePlatform | null;
  isNative: boolean;
};

export const usePlatform = (): UsePlatformReturn => {
  const [state, setState] = useState<UsePlatformReturn>({
    platformType: 'web',
    nativePlatform: null,
    isNative: false,
  });

  useEffect(() => {
    const platformType = getPlatformType();
    const nativePlatform = getNativePlatform();

    setState({
      platformType,
      nativePlatform,
      isNative: platformType === 'native',
    });
  }, []);

  return state;
};
