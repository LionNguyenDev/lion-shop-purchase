'use client';

import { cn } from '@/lib/utils';
import { type ReactNode, useEffect, useRef, useState } from 'react';

/**
 * Sticky header shared by the landing page and the shop: transparent at the top, frosted once the page
 * scrolls past 10px, with a gradient reading-progress bar along the bottom edge.
 */
export function StickyHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const { scrollY, innerHeight } = window;
      const max = document.documentElement.scrollHeight - innerHeight;
      setScrolled(scrollY > 10);
      // Written straight to the DOM so scrolling does not re-render the header
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300',
        scrolled
          ? 'border-slate-200/80 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-950/80'
          : 'border-transparent bg-transparent'
      )}
    >
      <div className='mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6'>
        {children}
      </div>
      <span
        ref={progressRef}
        className='absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400'
        style={{ transform: 'scaleX(0)' }}
        aria-hidden
      />
    </header>
  );
}
