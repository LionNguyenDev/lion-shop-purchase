import { appConfig } from '.';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  appUrl: appConfig.appUrl,
  name: 'Lion Shopping',
  metaTitle: 'Lion Shopping',
  description: 'Lion Shopping - mua sắm đơn giản, giao hàng tận nơi',
  ogImage: `${appConfig.appUrl}/og-image.jpg`,
};
