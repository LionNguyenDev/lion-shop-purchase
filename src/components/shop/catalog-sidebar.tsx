'use client';

import type { CategoryWithCount } from '@/api/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { LayoutGrid, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';

export interface CatalogFilterState {
  category: string;
}

interface CatalogSidebarProps extends CatalogFilterState {
  categories?: CategoryWithCount[];
  onChange: (patch: Partial<CatalogFilterState>) => void;
  onReset: () => void;
  hasFilters: boolean;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className='border-border/70 border-b py-5 first:pt-0 last:border-b-0 last:pb-0'>
      <h3 className='mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider'>{title}</h3>
      {children}
    </section>
  );
}

export function CatalogSidebar({ category, categories, onChange, onReset, hasFilters }: CatalogSidebarProps) {
  const total = categories?.reduce((sum, item) => sum + item.productCount, 0) ?? 0;

  return (
    <div>
      <Section title='Danh mục'>
        {!categories ? (
          <div className='space-y-2'>
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className='h-11' />
            ))}
          </div>
        ) : (
          <ul className='space-y-1'>
            {[{ id: '', name: 'Tất cả sản phẩm', productCount: total }, ...categories].map((item) => {
              const active = category === item.id;
              return (
                <li key={item.id || 'all'}>
                  <button
                    type='button'
                    onClick={() => onChange({ category: item.id })}
                    aria-pressed={active}
                    className={cn(
                      'group flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left font-semibold text-sm transition-all duration-200',
                      active
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground hover:translate-x-0.5 hover:bg-primary-soft/70'
                    )}
                  >
                    {item.id ? (
                      <span
                        className={cn(
                          'h-2 w-2 shrink-0 rounded-full transition-colors',
                          active ? 'bg-accent-soft' : 'bg-primary/40 group-hover:bg-primary'
                        )}
                        aria-hidden
                      />
                    ) : (
                      <LayoutGrid className='h-4 w-4 shrink-0' aria-hidden />
                    )}
                    <span className='min-w-0 flex-1 truncate'>{item.name}</span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs tabular-nums',
                        active ? 'bg-white/20' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {item.productCount}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {hasFilters && (
        <button
          type='button'
          onClick={onReset}
          className='mt-5 flex min-h-11 w-full animate-fade-in items-center justify-center gap-2 rounded-xl border border-border border-dashed font-semibold text-muted-foreground text-sm transition-colors hover:border-destructive hover:text-destructive'
        >
          <RotateCcw className='h-4 w-4' aria-hidden />
          Xoá tất cả bộ lọc
        </button>
      )}
    </div>
  );
}
