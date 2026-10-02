'use client';

import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { type InputHTMLAttributes, forwardRef, useState } from 'react';
import { Input } from './input';

export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    return (
      <div className='relative'>
        <Input ref={ref} type={visible ? 'text' : 'password'} className={cn('pr-12', className)} {...props} />
        <button
          type='button'
          onClick={() => setVisible((value) => !value)}
          className='absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground'
          aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        >
          {visible ? <EyeOff className='h-5 w-5' aria-hidden /> : <Eye className='h-5 w-5' aria-hidden />}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';
