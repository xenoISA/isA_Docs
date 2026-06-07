'use client';

import { PlatformNav } from '@xenoisa/ui-web';
import type { ComponentType } from 'react';

type PlatformNavProps = {
  activeSurface: 'app' | 'console' | 'docs';
  urls: {
    app: string;
    console: string;
    docs: string;
  };
};

export function PlatformNavBar() {
  const PlatformNavCompat = PlatformNav as unknown as ComponentType<PlatformNavProps>;

  return (
    <PlatformNavCompat
      activeSurface="docs"
      urls={{
        app: process.env.NEXT_PUBLIC_APP_URL || '/app',
        console: process.env.NEXT_PUBLIC_CONSOLE_URL || '/console',
        docs: '/docs',
      }}
    />
  );
}
