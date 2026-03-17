'use client';

import { PlatformNav } from '@isa/ui-web';

export function PlatformNavBar() {
  return (
    <PlatformNav
      activeSurface="docs"
      urls={{
        app: process.env.NEXT_PUBLIC_APP_URL || '/app',
        console: process.env.NEXT_PUBLIC_CONSOLE_URL || '/console',
        docs: '/docs',
      }}
    />
  );
}
