import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_DOCS_URL || 'https://docs.isa.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/docs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/docs/content/agent-sdk`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/docs/content/agent-sdk/quickstart`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/docs/content/agent-sdk/tools`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/docs/content/agent-sdk/streaming`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/docs/content/agent-sdk/human-in-the-loop`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/docs/content/agent-sdk/skills`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/docs/content/agent-sdk/deployment-guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];
}
