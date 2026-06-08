'use client';

import { PlatformNav } from '@xenoisa/ui-web';
import type { ComponentType } from 'react';
import { useBrand } from '../lib/brand-context';

type PlatformNavProps = {
  activeSurface: 'app' | 'console' | 'docs';
  brandName?: string;
  urls: {
    app: string;
    console: string;
    docs: string;
  };
};

export function PlatformNavBar() {
  const PlatformNavCompat = PlatformNav as unknown as ComponentType<PlatformNavProps>;
  // Runtime brand (#332): PlatformNav otherwise falls back to the build-time
  // NEXT_PUBLIC_BRAND_SHORT (baked "isA"), which breaks the edition-agnostic
  // image. Feed it the per-request brand from the hydrated BrandProvider so the
  // nav logo rebrands at container start.
  const brand = useBrand();

  return (
    <PlatformNavCompat
      activeSurface="docs"
      brandName={brand.short}
      urls={{
        app: process.env.NEXT_PUBLIC_APP_URL || '/app',
        console: process.env.NEXT_PUBLIC_CONSOLE_URL || '/console',
        docs: '/docs',
      }}
    />
  );
}
