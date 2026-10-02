import { siteConfig } from '@/config/site';
import { PUBLIC_ROUTES } from '@/lib/routes';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return PUBLIC_ROUTES.map((route) => ({
    url: `${siteConfig.appUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 1,
  }));
}
