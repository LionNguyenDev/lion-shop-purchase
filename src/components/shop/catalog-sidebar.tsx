'use client';

import type { CategoryWithCount } from '@/api/types';
import { Input } from '@/components/ui/input';
import { RangeSlider } from '@/components/ui/range-slider';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { formatCompactPrice, formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import { LayoutGrid, RotateCcw } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { useDebouncedValue } from './use-debounced-value';

export interface CatalogFilterState {
  category: string;
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
}

interface CatalogSidebarProps extends CatalogFilterState {
  categories?: CategoryWithCount[];
  priceBounds?: { min: number; max: number };
  onChange: (patch: Partial<CatalogFilterState>) => void;
  onReset: () => void;
  hasFilters: boolean;
}

const PRESETS = [
  { label: 'Dưới 100k', max: 100_000 },
  { label: '100k – 300k', min: 100_000, max: 300_000 },
  { label: '300k – 500k', min: 300_000, max: 500_000 },
  { label: 'Trên 500k', min: 500_000 },
];

/** Rounds the slider ends to a step that suits the price range. */
function sliderScale(bounds: { min: number; max: number }) {
  const step = bounds.max <= 200_000 ? 5_000 : 10_000;
  const min = Math.floor(bounds.min / step) * step;
  const max = Math.max(Math.ceil(bounds.max / step) * step, min + step);
  return { min, max, step };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className='border-border/70 border-b py-5 first:pt-0 last:border-b-0 last:pb-0'>
      <h3 className='mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider'>{title}</h3>
      {children}
    </section>
  );
}

export function CatalogSidebar({
  category,
  minPrice,
  maxPrice,
  inStock,
  categories,
  priceBounds,
  onChange,
  onReset,
  hasFilters,
}: CatalogSidebarProps) {
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

      <Section title='Khoảng giá'>
        <PriceFilter minPrice={minPrice} maxPrice={maxPrice} bounds={priceBounds} onChange={onChange} />
      </Section>

      <Section title='Tình trạng'>
        <div className='flex min-h-11 items-center justify-between gap-3'>
          <span className='font-medium text-sm'>Chỉ hiện sản phẩm còn hàng</span>
          <Switch
            checked={inStock}
            onCheckedChange={(checked) => onChange({ inStock: checked })}
            label='Chỉ hiện sản phẩm còn hàng'
          />
        </div>
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

interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
  bounds?: { min: number; max: number };
  onChange: (patch: Partial<CatalogFilterState>) => void;
}

function PriceFilter({ minPrice, maxPrice, bounds, onChange }: PriceFilterProps) {
  const scale = bounds && bounds.max > 0 ? sliderScale(bounds) : null;
  const fromUrl = (): [number, number] => [minPrice ?? scale?.min ?? 0, maxPrice ?? scale?.max ?? 0];

  // Local value follows the thumbs instantly; the URL (and the fetch) follows after a short pause
  const [range, setRange] = useState<[number, number]>(fromUrl);
  const [dirty, setDirty] = useState(false);
  const debounced = useDebouncedValue(range, 350);

  // Resync only when the URL or the slider bounds change
  useEffect(() => {
    setRange(fromUrl());
    setDirty(false);
  }, [minPrice, maxPrice, scale?.min, scale?.max]);

  // Commit only the debounced value
  useEffect(() => {
    if (!dirty || !scale) return;
    const [low, high] = debounced;
    onChange({ minPrice: low > scale.min ? low : undefined, maxPrice: high < scale.max ? high : undefined });
  }, [debounced]);

  const update = (next: [number, number]) => {
    setRange(next);
    setDirty(true);
  };

  const commitInput = (index: 0 | 1, raw: string) => {
    if (!scale) return;
    const parsed = raw.trim() === '' ? (index === 0 ? scale.min : scale.max) : Math.trunc(Number(raw));
    if (!Number.isFinite(parsed)) return;
    const clamped = Math.min(Math.max(parsed, scale.min), scale.max);
    update(index === 0 ? [Math.min(clamped, range[1]), range[1]] : [range[0], Math.max(clamped, range[0])]);
  };

  if (!scale) return <Skeleton className='h-28' />;

  const isActive = (preset: (typeof PRESETS)[number]) => minPrice === preset.min && maxPrice === preset.max;

  return (
    <div className='space-y-4'>
      <div className='flex items-baseline justify-between font-semibold text-sm tabular-nums' aria-live='polite'>
        <span>{formatCurrency(range[0])}</span>
        <span className='text-muted-foreground'>–</span>
        <span>{formatCurrency(range[1])}</span>
      </div>
      <RangeSlider
        min={scale.min}
        max={scale.max}
        step={scale.step}
        value={range}
        onChange={update}
        labels={['Giá thấp nhất', 'Giá cao nhất']}
        formatValue={formatCurrency}
      />
      {/* Typed alternative to dragging (WCAG 2.5.7) */}
      <div className='grid grid-cols-2 gap-2'>
        <PriceInput label='Giá từ' value={range[0]} onCommit={(raw) => commitInput(0, raw)} />
        <PriceInput label='Giá đến' value={range[1]} onCommit={(raw) => commitInput(1, raw)} />
      </div>
      <div className='flex flex-wrap gap-2'>
        {PRESETS.map((preset) => {
          const active = isActive(preset);
          return (
            <button
              key={preset.label}
              type='button'
              aria-pressed={active}
              onClick={() =>
                onChange(
                  active ? { minPrice: undefined, maxPrice: undefined } : { minPrice: preset.min, maxPrice: preset.max }
                )
              }
              className={cn(
                'min-h-9 rounded-full border px-3 font-semibold text-xs transition-all duration-200 active:scale-95',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card hover:border-primary hover:text-primary'
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
      <p className='text-muted-foreground text-xs'>
        Giá trong danh mục: {formatCompactPrice(scale.min)} – {formatCompactPrice(scale.max)}
      </p>
    </div>
  );
}

function PriceInput({ label, value, onCommit }: { label: string; value: number; onCommit: (raw: string) => void }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  return (
    <label className='block'>
      <span className='mb-1 block font-medium text-muted-foreground text-xs'>{label}</span>
      <Input
        type='number'
        inputMode='numeric'
        min={0}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => onCommit(draft)}
        onKeyDown={(event) => event.key === 'Enter' && onCommit(draft)}
        className='h-10 px-3 text-sm tabular-nums'
      />
    </label>
  );
}
