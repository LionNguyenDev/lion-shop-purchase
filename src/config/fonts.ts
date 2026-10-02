import { Lexend, Nunito_Sans } from 'next/font/google';

// Rubik (suggested by the design system) has no Vietnamese subset, so headings use Lexend
export const fontHeading = Lexend({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-heading',
  display: 'swap',
});

export const fontSans = Nunito_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});
