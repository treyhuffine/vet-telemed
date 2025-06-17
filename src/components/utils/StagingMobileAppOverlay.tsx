import { useEffect, useState } from 'react';
import { getIsNativePlatform } from '@/lib/client/mobile';

export const StagingMobileAppOverlay = () => {
  const [tapCount, setTapCount] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  const isTargetPlatformMobile = process.env.TARGET_PLATFORM === 'mobile';
  const isNotProduction = process.env.APP_STAGE !== 'production';
  const isNative = getIsNativePlatform();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only show in client-side rendering
  if (!mounted) return null;

  // Only show on mobile platforms in non-production environments
  if (!(isTargetPlatformMobile && isNotProduction && isNative)) return null;

  // Hidden after 6 taps
  if (!visible) return null;

  const handleTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount >= 6) {
      setVisible(false);
    }
  };

  return (
    <div
      onClick={handleTap}
      className="fixed inset-0 z-[10000] flex h-screen w-screen flex-col items-center justify-center bg-orange-500 bg-opacity-80 text-white"
    >
      <div className="p-4 text-center">
        <h1 className="mb-2 text-2xl font-bold">🚨 STAGING BUILD 🚨</h1>
        <p className="mb-4 text-lg">This is not a production build!</p>
        <p className="text-sm">Tap {6 - tapCount} more times to dismiss</p>
      </div>
    </div>
  );
};
