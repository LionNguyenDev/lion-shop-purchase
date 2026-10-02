import { Minus, Plus } from 'lucide-react';

interface QuantityInputProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
}

export function QuantityInput({ value, max, onChange, disabled, label = 'Số lượng' }: QuantityInputProps) {
  const clamp = (next: number) => Math.min(Math.max(1, next), Math.max(1, max));
  return (
    <div
      className='inline-flex h-11 items-center rounded-xl border border-border bg-card'
      role='group'
      aria-label={label}
    >
      <button
        type='button'
        onClick={() => onChange(clamp(value - 1))}
        disabled={disabled || value <= 1}
        className='flex h-full w-10 items-center justify-center rounded-l-xl text-foreground transition-colors hover:bg-muted disabled:opacity-40'
        aria-label='Giảm số lượng'
      >
        <Minus className='h-4 w-4' aria-hidden />
      </button>
      <input
        type='number'
        inputMode='numeric'
        min={1}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isFinite(next)) onChange(clamp(Math.trunc(next)));
        }}
        className='h-full w-12 border-0 bg-transparent text-center font-semibold tabular-nums [appearance:textfield] focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none'
        aria-label={label}
      />
      <button
        type='button'
        onClick={() => onChange(clamp(value + 1))}
        disabled={disabled || value >= max}
        className='flex h-full w-10 items-center justify-center rounded-r-xl text-foreground transition-colors hover:bg-muted disabled:opacity-40'
        aria-label='Tăng số lượng'
      >
        <Plus className='h-4 w-4' aria-hidden />
      </button>
    </div>
  );
}
