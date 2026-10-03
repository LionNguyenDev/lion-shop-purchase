import type { LucideIcon } from 'lucide-react';
import { GRADIENT_BG } from './styles';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  id?: string;
}

export function SectionHeading({ eyebrow, title, description, icon: Icon, id }: SectionHeadingProps) {
  return (
    <div className='mx-auto max-w-2xl text-center'>
      <p className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 font-semibold text-emerald-800 text-xs uppercase tracking-[0.18em] dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'>
        <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' aria-hidden />
        {eyebrow}
      </p>
      <h2
        id={id}
        className='mt-4 flex flex-wrap items-center justify-center gap-3 font-bold text-3xl text-slate-900 tracking-tight sm:text-4xl dark:text-white'
      >
        <span
          className={`-rotate-6 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-emerald-500/25 shadow-lg ${GRADIENT_BG}`}
          aria-hidden
        >
          <Icon className='h-5 w-5' />
        </span>
        {title}
      </h2>
      {description && <p className='mt-4 text-slate-600 leading-relaxed dark:text-slate-300'>{description}</p>}
      <span className={`mx-auto mt-6 block h-1 w-16 rounded-full ${GRADIENT_BG}`} aria-hidden />
    </div>
  );
}
