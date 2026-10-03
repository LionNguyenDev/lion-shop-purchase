'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Full-height panel sliding in from the left, used for filters on small screens. */
export function Sheet({ open, onOpenChange, title, children, footer }: SheetProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className='fixed inset-0 z-50 animate-fade-in bg-slate-950/50 backdrop-blur-[2px]' />
        <RadixDialog.Content className='fixed inset-y-0 left-0 z-50 flex w-[min(88vw,360px)] animate-slide-in-left flex-col bg-card shadow-lift'>
          <div className='flex h-16 shrink-0 items-center justify-between border-border border-b px-5'>
            <RadixDialog.Title className='font-bold font-heading text-lg'>{title}</RadixDialog.Title>
            <RadixDialog.Description className='sr-only'>{title}</RadixDialog.Description>
            <RadixDialog.Close
              className='flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
              aria-label='Đóng'
            >
              <X className='h-5 w-5' aria-hidden />
            </RadixDialog.Close>
          </div>
          <div className='flex-1 overflow-y-auto px-5 py-5'>{children}</div>
          {footer && <div className='shrink-0 border-border border-t p-4'>{footer}</div>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
