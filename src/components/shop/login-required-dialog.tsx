'use client';

import { buttonClasses } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { KeyRound, LogIn } from 'lucide-react';
import Link from 'next/link';

interface LoginRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = [
  { icon: LogIn, text: 'Đăng nhập hoặc tạo tài khoản mới.' },
  { icon: KeyRound, text: 'Nhập mật khẩu cửa hàng do admin cung cấp để bắt đầu mua sắm.' },
];

/** Shown to guests who try to enter the shop, so they know a shop password is needed after login */
export function LoginRequiredDialog({ open, onOpenChange }: LoginRequiredDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title='Đăng nhập để vào cửa hàng'
      description='Cửa hàng chỉ dành cho khách hàng được mời. Bạn cần hoàn tất 2 bước sau:'
    >
      <ol className='space-y-3'>
        {STEPS.map(({ icon: Icon, text }, index) => (
          <li key={text} className='flex items-start gap-3 text-sm'>
            <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft font-bold text-primary'>
              {index + 1}
            </span>
            <span className='flex items-center gap-2 pt-1.5'>
              <Icon className='h-4 w-4 shrink-0 text-muted-foreground' aria-hidden />
              {text}
            </span>
          </li>
        ))}
      </ol>

      <p className='mt-5 flex items-center gap-3 rounded-xl bg-accent-soft p-3 text-accent-hover text-sm'>
        <KeyRound className='h-5 w-5 shrink-0' aria-hidden />
        Chưa có mật khẩu? Liên hệ admin qua Zalo hoặc Messenger để được cấp.
      </p>

      <div className='mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
        <Link href={ROUTES.REGISTER} className={buttonClasses('outline')} onClick={() => onOpenChange(false)}>
          Tạo tài khoản
        </Link>
        <Link
          href={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.SHOP)}`}
          className={cn(buttonClasses('primary'), 'gap-2')}
          onClick={() => onOpenChange(false)}
        >
          <LogIn className='h-4 w-4' aria-hidden />
          Đăng nhập
        </Link>
      </div>
    </Dialog>
  );
}
