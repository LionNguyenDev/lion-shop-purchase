'use client';

import { useUnlockShop } from '@/api/shop';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { PasswordInput } from '@/components/ui/password-input';
import { ROUTES } from '@/lib/routes';
import { type ShopAccessInput, shopAccessSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ShopAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShopAccessDialog({ open, onOpenChange }: ShopAccessDialogProps) {
  const router = useRouter();
  const unlock = useUnlockShop();
  const form = useForm<ShopAccessInput>({ resolver: zodResolver(shopAccessSchema), defaultValues: { password: '' } });

  const onSubmit = form.handleSubmit(async ({ password }) => {
    try {
      await unlock.mutateAsync(password);
      toast.success('Chào mừng bạn đến cửa hàng!');
      onOpenChange(false);
      form.reset();
      router.push(ROUTES.SHOP);
    } catch (error) {
      form.setError('password', { message: (error as Error).message });
    }
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title='Nhập mật khẩu cửa hàng'
      description='Cửa hàng chỉ dành cho khách hàng được mời. Vui lòng nhập mật khẩu do admin cung cấp để bắt đầu mua sắm.'
    >
      <form onSubmit={onSubmit} className='space-y-5' noValidate>
        <div className='flex items-center gap-3 rounded-xl bg-accent-soft p-3 text-accent-hover text-sm'>
          <KeyRound className='h-5 w-5 shrink-0' aria-hidden />
          <span>Chưa có mật khẩu? Liên hệ admin qua Facebook để được cấp.</span>
        </div>
        <FormField label='Mật khẩu cửa hàng' error={form.formState.errors.password?.message} required>
          <PasswordInput autoFocus autoComplete='off' placeholder='Nhập mật khẩu' {...form.register('password')} />
        </FormField>
        <Button type='submit' className='w-full' loading={form.formState.isSubmitting}>
          Vào cửa hàng
        </Button>
      </form>
    </Dialog>
  );
}
