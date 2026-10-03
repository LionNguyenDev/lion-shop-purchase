import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

const tones = {
  neutral: 'bg-muted text-muted-foreground',
  primary: 'bg-primary-soft text-primary-hover',
  accent: 'bg-accent-soft text-accent-hover',
  danger: 'bg-destructive-soft text-destructive',
  info: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-200',
  violet: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-200',
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 font-semibold text-xs',
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
