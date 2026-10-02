import { cn } from '@/lib/utils';
import { type ReactElement, type ReactNode, cloneElement, useId } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  /** A single input-like element; id and aria attributes are wired automatically. */
  children: ReactElement<Record<string, unknown>>;
}

export function FormField({ label, error, hint, required, className, children }: FormFieldProps) {
  const id = useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className='block font-semibold text-foreground text-sm'>
        {label}
        {required && (
          <span className='ml-0.5 text-destructive' aria-hidden>
            *
          </span>
        )}
      </label>
      {cloneElement(children, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        'aria-required': required || undefined,
      })}
      {hint && !error && (
        <p id={`${id}-hint`} className='text-muted-foreground text-xs'>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role='alert' className='font-medium text-destructive text-xs'>
          {error}
        </p>
      )}
    </div>
  );
}
