/**
 * Landing page content. Everything here is sample copy: replace with the real shop details.
 * Links marked TODO point to placeholder accounts.
 */

export const BRAND = {
  name: 'Lion Cosmetic',
  tagline: 'Shopping & Lifestyle',
  techTeam: 'Nguyễn Danh Lưu',
};

export type SocialPlatform = 'facebook' | 'instagram' | 'tiktok' | 'threads';

interface SocialLink {
  platform: SocialPlatform;
  name: string;
  handle: string;
  href: string;
  /** Follower count shown on the card, e.g. '12,5K'. Hidden when empty */
  followers?: string;
}

/** Add `{ platform: 'tiktok', ... }` here when the shop has a TikTok account; its card design is ready */
export const SOCIALS: SocialLink[] = [
  {
    platform: 'facebook',
    name: 'Facebook',
    handle: 'ThuyLinhLion206',
    href: 'https://www.facebook.com/ThuyLinhLion206',
  },
  {
    platform: 'instagram',
    name: 'Instagram',
    handle: '@thuylinnlion',
    href: 'https://www.instagram.com/thuylinnlion/',
  },
  {
    platform: 'threads',
    name: 'Threads',
    handle: '@thuylinnlion',
    href: 'https://www.threads.com/@thuylinnlion',
  },
];

export const CONTACTS = {
  zalo: 'https://zalo.me/0826223912',
  messenger: 'https://m.me/ThuyLinhLion206',
};

export const NAV_LINKS = [{ id: 'contact', label: 'Liên hệ' }];
