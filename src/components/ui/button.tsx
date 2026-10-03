import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

const variants = {
  // Same gradient + light sweep as the landing page CTA; white text stays above 4.5:1 in both themes
  primary:
    'btn-shimmer bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30',
  accent: 'bg-accent text-accent-foreground hover:bg-accent-hover shadow-sm',
  outline: 'border border-border bg-card text-foreground hover:border-primary hover:text-primary',
  ghost: 'text-foreground hover:bg-muted',
  destructive: 'bg-destructive text-white hover:bg-destructive/90',
  link: 'text-primary underline-offset-4 hover:underline px-0 h-auto',
} as const;

const sizes = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-[15px] gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  icon: 'h-11 w-11',
  'icon-sm': 'h-9 w-9',
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
}

export const buttonClasses = (variant: keyof typeof variants = 'primary', size: keyof typeof sizes = 'md') =>
  cn(
    'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-[color,background-color,border-color,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size]
  );

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonClasses(variant, size), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 className='h-4 w-4 animate-spin' aria-hidden />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
