'use client';

import { cn } from '@/lib/utils';

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  /** Accessible names for the two thumbs. */
  labels: [string, string];
  formatValue?: (value: number) => string;
  disabled?: boolean;
}

/** Two-thumb slider built on native range inputs, so keyboard and touch work out of the box. */
export function RangeSlider({ min, max, step, value, onChange, labels, formatValue, disabled }: RangeSliderProps) {
  const span = Math.max(max - min, 1);
  const [low, high] = value;
  const toPercent = (v: number) => ((Math.min(Math.max(v, min), max) - min) / span) * 100;
  // When both thumbs sit at the right end, the low thumb must stay on top to be draggable
  const lowOnTop = low > min + span / 2;

  return (
    <div className={cn('relative h-11', disabled && 'opacity-50')}>
      <div className='-translate-y-1/2 absolute top-1/2 right-0 left-0 h-1.5 rounded-full bg-border' aria-hidden />
      <div
        className='-translate-y-1/2 absolute top-1/2 h-1.5 rounded-full bg-primary transition-[left,right] duration-75'
        style={{ left: `${toPercent(low)}%`, right: `${100 - toPercent(high)}%` }}
        aria-hidden
      />
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={low}
        disabled={disabled}
        onChange={(event) => onChange([Math.min(Number(event.target.value), high - step), high])}
        aria-label={labels[0]}
        aria-valuetext={formatValue?.(low)}
        className={cn('range-thumb', lowOnTop ? 'z-20' : 'z-10')}
      />
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={high}
        disabled={disabled}
        onChange={(event) => onChange([low, Math.max(Number(event.target.value), low + step)])}
        aria-label={labels[1]}
        aria-valuetext={formatValue?.(high)}
        className={cn('range-thumb', lowOnTop ? 'z-10' : 'z-20')}
      />
    </div>
  );
}
