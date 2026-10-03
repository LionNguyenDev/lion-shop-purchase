'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Icons swap through the `dark` class, so there is no hydration mismatch to guard against
  return (
    <button
      type='button'
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label='Đổi giao diện sáng/tối'
      className='hover:-translate-y-0.5 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/70 text-slate-700 transition-[transform,color] duration-200 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:text-amber-300'
    >
      <Moon className='h-5 w-5 dark:hidden' aria-hidden />
      <Sun className='hidden h-5 w-5 dark:block' aria-hidden />
    </button>
  );
}
