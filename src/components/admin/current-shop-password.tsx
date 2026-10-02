'use client';

import { useRevealShopPassword } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Check, Copy, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const REASONS = {
  not_configured: 'Chưa đặt mật khẩu cửa hàng.',
  legacy: 'Mật khẩu này được đặt trước khi có tính năng xem lại. Hãy đặt lại mật khẩu bên dưới để lần sau xem được.',
  undecryptable: 'Không giải mã được vì BETTER_AUTH_SECRET đã thay đổi. Hãy đặt lại mật khẩu bên dưới.',
} as const;

/** Masked by default; the plain password is only requested when the admin clicks show. */
export function CurrentShopPassword() {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data, isFetching, isError, error } = useRevealShopPassword(revealed);
  const password = revealed && data && !('reason' in data) ? data.password : null;
  const problem = isError ? (error as Error).message : data && 'reason' in data ? REASONS[data.reason] : null;

  const copy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Không sao chép được, hãy chọn và copy thủ công');
    }
  };

  return (
    <div className='rounded-xl border border-border bg-muted/50 p-4'>
      <p className='mb-2 font-semibold text-sm'>Mật khẩu hiện tại</p>
      <div className='flex items-center gap-2'>
        <code
          className='min-w-0 flex-1 select-all truncate rounded-lg bg-card px-3 py-2.5 font-mono text-base tracking-wide'
          aria-live='polite'
        >
          {isFetching ? (
            <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' aria-label='Đang tải' />
          ) : (
            (password ?? '••••••••')
          )}
        </code>
        <Button
          variant='outline'
          size='icon'
          onClick={() => setRevealed((value) => !value)}
          aria-label={revealed ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          aria-pressed={revealed}
        >
          {revealed ? <EyeOff className='h-5 w-5' aria-hidden /> : <Eye className='h-5 w-5' aria-hidden />}
        </Button>
        <Button variant='outline' size='icon' onClick={copy} disabled={!password} aria-label='Sao chép mật khẩu'>
          {copied ? <Check className='h-5 w-5 text-primary' aria-hidden /> : <Copy className='h-5 w-5' aria-hidden />}
        </Button>
      </div>
      {revealed && !isFetching && problem && (
        <p role='alert' className='mt-2 font-medium text-accent-hover text-xs'>
          {problem}
        </p>
      )}
    </div>
  );
}
