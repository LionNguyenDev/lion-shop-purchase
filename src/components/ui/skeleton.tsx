import { cn } from '@/lib/utils';

export const shimmerClasses =
  'animate-shimmer bg-[linear-gradient(90deg,rgb(var(--color-muted))_0%,rgb(var(--color-card))_50%,rgb(var(--color-muted))_100%)] bg-[length:200%_100%]';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('rounded-xl', shimmerClasses, className)} aria-hidden />;
}
