'use client';

import { cn } from '@/lib/utils';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { buttonClasses } from './button';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, title, description, children, className }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className='fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[2px] data-[state=open]:animate-[fade-in_150ms_ease-out]' />
        <RadixDialog.Content
          className={cn(
            '-translate-y-1/2 fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[calc(100dvh-2rem)] w-auto max-w-md overflow-y-auto rounded-2xl bg-card p-6 shadow-lift data-[state=open]:animate-[dialog-in_200ms_ease-out]',
            className
          )}
        >
          <div className='mb-5 pr-8'>
            <RadixDialog.Title className='font-bold font-heading text-foreground text-xl'>{title}</RadixDialog.Title>
            {description ? (
              <RadixDialog.Description className='mt-1.5 text-muted-foreground text-sm'>
                {description}
              </RadixDialog.Description>
            ) : (
              <RadixDialog.Description className='sr-only'>{title}</RadixDialog.Description>
            )}
          </div>
          {children}
          <RadixDialog.Close
            className='absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
            aria-label='Đóng'
          >
            <X className='h-5 w-5' aria-hidden />
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  destructive,
  loading,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
        <button
          type='button'
          onClick={() => onOpenChange(false)}
          className='h-11 rounded-xl border border-border px-5 font-semibold transition-colors hover:bg-muted'
        >
          Huỷ
        </button>
        <button
          type='button'
          onClick={onConfirm}
          disabled={loading}
          className={buttonClasses(destructive ? 'destructive' : 'primary')}
        >
          {loading ? 'Đang xử lý...' : confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}
