import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_DOCS_URL || 'https://docs.isa.dev';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE_URL}/docs/sitemap.xml`,
  };
}
