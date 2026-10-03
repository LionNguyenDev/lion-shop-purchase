'use client';

import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

/**
 * Page numbers to show: always the first and last page, `siblings` pages on each side of the current one,
 * and an ellipsis for every gap. The list keeps the same length while moving through the middle pages.
 */
export function getPageItems(page: number, totalPages: number, siblings = 1): PageItem[] {
  // first + last + current + both sibling groups + two ellipses
  const slots = siblings * 2 + 5;
  if (totalPages <= slots) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const start = Math.max(page - siblings, 2);
  const end = Math.min(page + siblings, totalPages - 1);
  const showStartGap = start > 3;
  const showEndGap = end < totalPages - 2;

  if (!showStartGap) {
    const head = Array.from({ length: slots - 2 }, (_, i) => i + 1);
    return [...head, 'ellipsis-end', totalPages];
  }
  if (!showEndGap) {
    const tail = Array.from({ length: slots - 2 }, (_, i) => totalPages - (slots - 3) + i);
    return [1, 'ellipsis-start', ...tail];
  }
  const middle = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return [1, 'ellipsis-start', ...middle, 'ellipsis-end', totalPages];
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** With `limit`, shows "Hiển thị 21–40 trong 120" */
  total?: number;
  limit?: number;
  /** Noun for the summary, e.g. "sản phẩm" */
  itemLabel?: string;
  className?: string;
}

const ITEM = 'flex h-10 min-w-10 items-center justify-center rounded-xl px-2 font-semibold text-sm tabular-nums';
const ARROW = cn(
  ITEM,
  'gap-1 border border-border bg-card text-foreground transition-[transform,border-color,color] duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40'
);

export function Pagination({
  page,
  totalPages,
  onPageChange,
  total,
  limit,
  itemLabel = 'mục',
  className,
}: PaginationProps) {
  // When the last item of the last page is removed, the current page no longer exists: step back
  useEffect(() => {
    if (totalPages >= 1 && page > totalPages) onPageChange(totalPages);
  }, [page, totalPages]);

  const hasSummary = total !== undefined && limit !== undefined && total > 0;
  if (totalPages <= 1 && !hasSummary) return null;

  const from = hasSummary ? (page - 1) * limit + 1 : 0;
  const to = hasSummary ? Math.min(page * limit, total) : 0;

  return (
    <div className={cn('flex flex-col items-center gap-3 sm:flex-row sm:justify-between', className)}>
      {hasSummary ? (
        <p className='text-muted-foreground text-sm'>
          Hiển thị{' '}
          <span className='font-semibold text-foreground tabular-nums'>
            {formatNumber(from)}–{formatNumber(to)}
          </span>{' '}
          trong <span className='font-semibold text-foreground tabular-nums'>{formatNumber(total)}</span> {itemLabel}
        </p>
      ) : (
        <span />
      )}

      {totalPages > 1 && (
        <nav aria-label='Phân trang'>
          <ul className='flex items-center gap-1.5'>
            <li>
              <button
                type='button'
                className={ARROW}
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                aria-label='Trang trước'
              >
                <ChevronLeft className='h-5 w-5' aria-hidden />
              </button>
            </li>

            {/* Narrow screens: compact counter instead of the number list */}
            <li className='px-2 font-semibold text-sm tabular-nums sm:hidden' aria-live='polite'>
              Trang {page} / {totalPages}
            </li>

            {getPageItems(page, totalPages).map((item) =>
              typeof item === 'number' ? (
                <li key={item} className='hidden sm:block'>
                  <button
                    type='button'
                    onClick={() => onPageChange(item)}
                    aria-label={`Trang ${item}`}
                    aria-current={item === page ? 'page' : undefined}
                    className={cn(
                      ITEM,
                      'transition-[transform,background-color,color] duration-200',
                      item === page
                        ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-emerald-600/25 shadow-md'
                        : 'hover:-translate-y-0.5 text-foreground hover:bg-muted'
                    )}
                  >
                    {item}
                  </button>
                </li>
              ) : (
                <li key={item} className='hidden w-8 text-center text-muted-foreground sm:block' aria-hidden>
                  …
                </li>
              )
            )}

            <li>
              <button
                type='button'
                className={ARROW}
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                aria-label='Trang sau'
              >
                <ChevronRight className='h-5 w-5' aria-hidden />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
