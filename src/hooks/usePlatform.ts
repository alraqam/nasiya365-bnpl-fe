import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

export const usePlatform = () => {
  const [platform, setPlatform] = useState('web');

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setPlatform(Capacitor.getPlatform());
    }
  }, []);

  return { platform, isIOS: platform === 'ios', isNative: platform !== 'web' };
};