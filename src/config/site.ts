import { appConfig } from '.';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  appUrl: appConfig.appUrl,
  name: 'Lion Cosmetic',
  metaTitle: 'Lion Cosmetic',
  description: 'Lion Cosmetic - mua sắm đơn giản, giao hàng tận nơi',
  ogImage: `${appConfig.appUrl}/og-image.jpg`,
};
