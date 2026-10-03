import { JetBrains_Mono, Lexend, Nunito_Sans } from 'next/font/google';

// Rubik (suggested by the design system) has no Vietnamese subset, so headings use Lexend
export const fontHeading = Lexend({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-heading',
  display: 'swap',
});

export const fontSans = Nunito_Sans({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

// Numbers on the landing page (with tabular-nums); has a Vietnamese subset, unlike Fira Code
export const fontMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-mono',
  display: 'swap',
});
