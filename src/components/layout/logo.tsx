import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function Logo({ className, href = ROUTES.HOME }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn('inline-flex items-center gap-2 rounded-xl', className)}
      aria-label='Lion Shopping - Trang chủ'
    >
      <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground'>
        <ShoppingBag className='h-5 w-5' aria-hidden />
      </span>
      <span className='font-bold font-heading text-lg tracking-tight'>
        Lion<span className='text-accent'>Shop</span>
      </span>
    </Link>
  );
}
