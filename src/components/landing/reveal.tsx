'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { useInView } from './use-in-view';

const HIDDEN = {
  up: 'translate-y-10',
  left: '-translate-x-10',
  right: 'translate-x-10',
} as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: keyof typeof HIDDEN;
  delay?: number;
}

/** Fades and slides its content in the first time it scrolls into view */
export function Reveal({ children, className, direction = 'up', delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.1);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none',
        inView ? 'translate-x-0 translate-y-0 opacity-100' : cn('opacity-0', HIDDEN[direction]),
        className
      )}
    >
      {children}
    </div>
  );
}
