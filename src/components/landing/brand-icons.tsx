import type { SocialPlatform } from '@/config/landing';
import { AtSign } from 'lucide-react';
import type { SVGProps } from 'react';

// lucide-react v1 dropped brand icons, so these are simplified glyphs drawn by hand

type IconProps = SVGProps<SVGSVGElement>;

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden focusable='false' {...props}>
      <path d='M14 8h2.5V4.5H14c-2.8 0-4.5 1.8-4.5 4.6V11H7v3.5h2.5V21H13v-6.5h2.7l.6-3.5H13V9c0-.6.4-1 1-1z' />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      aria-hidden
      focusable='false'
      {...props}
    >
      <rect x='3' y='3' width='18' height='18' rx='5' />
      <circle cx='12' cy='12' r='4' />
      <circle cx='17.5' cy='6.5' r='0.6' fill='currentColor' />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden focusable='false' {...props}>
      <path d='M16.2 3c.3 2.3 1.7 3.9 4 4.1v3.2c-1.5 0-2.9-.4-4-1.2v6.1a6 6 0 1 1-6-6v3.3a2.8 2.8 0 1 0 2.8 2.7V3h3.2z' />
    </svg>
  );
}

/** Official Messenger logo (blue gradient bubble with a white bolt) */
/** `gradientId` must be unique when the icon appears more than once on a page */
export function MessengerIcon({ gradientId = 'messenger-gradient', ...props }: IconProps & { gradientId?: string }) {
  return (
    <svg viewBox='0 0 32 32' fill='none' aria-hidden focusable='false' {...props}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        fill={`url(#${gradientId})`}
        d='M16 28.1791C23.1797 28.1791 29 22.5426 29 15.5896C29 8.63654 23.1797 3 16 3C8.8203 3 3 8.63654 3 15.5896C3 19.3712 4.72168 22.7634 7.44737 25.0711V27.6188C7.44737 28.6145 8.4616 29.2824 9.36588 28.8821L12.193 27.6307C13.397 27.9873 14.6754 28.1791 16 28.1791Z'
      />
      <path
        fill='white'
        d='M12.887 12.9133L9.11723 18.0689C8.71304 18.6217 9.43994 19.2858 9.99334 18.8693L13.2123 16.4469C13.5399 16.2003 13.9992 16.197 14.3307 16.4388L17.1935 18.5272C17.7425 18.9277 18.5272 18.8125 18.9269 18.2727L22.8805 12.9341C23.2905 12.3804 22.558 11.7109 22.0038 12.1328L18.6006 14.7236C18.2729 14.9731 17.8112 14.9777 17.4782 14.7347L14.6247 12.6531C14.0733 12.2509 13.285 12.369 12.887 12.9133Z'
      />
      <defs>
        <linearGradient id={gradientId} x1={16} y1={3} x2={11.8286} y2={28.8583} gradientUnits='userSpaceOnUse'>
          <stop stopColor='#00B1FF' />
          <stop offset={1} stopColor='#006BFF' />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Official Zalo logo (light chat bubble with blue "Zalo" wordmark) */
export function ZaloIcon(props: IconProps) {
  return (
    <svg viewBox='0 0 48 48' aria-hidden focusable='false' {...props}>
      <path
        fill='#2962ff'
        d='M15,36V6.827l-1.211-0.811C8.64,8.083,5,13.112,5,19v10c0,7.732,6.268,14,14,14h10 c4.722,0,8.883-2.348,11.417-5.931V36H15z'
      />
      <path
        fill='#eee'
        d='M29,5H19c-1.845,0-3.601,0.366-5.214,1.014C10.453,9.25,8,14.528,8,19 c0,6.771,0.936,10.735,3.712,14.607c0.216,0.301,0.357,0.653,0.376,1.022c0.043,0.835-0.129,2.365-1.634,3.742 c-0.162,0.148-0.059,0.419,0.16,0.428c0.942,0.041,2.843-0.014,4.797-0.877c0.557-0.246,1.191-0.203,1.729,0.083 C20.453,39.764,24.333,40,28,40c4.676,0,9.339-1.04,12.417-2.916C42.038,34.799,43,32.014,43,29V19C43,11.268,36.732,5,29,5z'
      />
      <path
        fill='#2962ff'
        d='M36.75,27C34.683,27,33,25.317,33,23.25s1.683-3.75,3.75-3.75s3.75,1.683,3.75,3.75 S38.817,27,36.75,27z M36.75,21c-1.24,0-2.25,1.01-2.25,2.25s1.01,2.25,2.25,2.25S39,24.49,39,23.25S37.99,21,36.75,21z'
      />
      <path fill='#2962ff' d='M31.5,27h-1c-0.276,0-0.5-0.224-0.5-0.5V18h1.5V27z' />
      <path
        fill='#2962ff'
        d='M27,19.75v0.519c-0.629-0.476-1.403-0.769-2.25-0.769c-2.067,0-3.75,1.683-3.75,3.75 S22.683,27,24.75,27c0.847,0,1.621-0.293,2.25-0.769V26.5c0,0.276,0.224,0.5,0.5,0.5h1v-7.25H27z M24.75,25.5 c-1.24,0-2.25-1.01-2.25-2.25S23.51,21,24.75,21S27,22.01,27,23.25S25.99,25.5,24.75,25.5z'
      />
      <path
        fill='#2962ff'
        d='M21.25,18h-8v1.5h5.321L13,26h0.026c-0.163,0.211-0.276,0.463-0.276,0.75V27h7.5 c0.276,0,0.5-0.224,0.5-0.5v-1h-5.321L21,19h-0.026c0.163-0.211,0.276-0.463,0.276-0.75V18z'
      />
    </svg>
  );
}

export function ThreadsIcon({ className }: IconProps) {
  return <AtSign className={className} aria-hidden />;
}

export const SOCIAL_ICONS: Record<SocialPlatform, (props: IconProps) => React.JSX.Element> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  threads: ThreadsIcon,
};
