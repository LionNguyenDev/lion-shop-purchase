'use client';

import { useSaveShopPassword, useShopSettings } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { PasswordInput } from '@/components/ui/password-input';
import { formatDateTime } from '@/lib/format';
import { type ShopPasswordInput, shopPasswordSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CurrentShopPassword } from './current-shop-password';
import { PageHeader } from './page-header';

export function AdminSettings() {
  const { data: settings } = useShopSettings();
  const save = useSaveShopPassword();
  const [pending, setPending] = useState<ShopPasswordInput | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShopPasswordInput>({
    resolver: zodResolver(shopPasswordSchema),
    defaultValues: { password: '' },
  });

  const persist = async (values: ShopPasswordInput) => {
    try {
      await save.mutateAsync(values);
      toast.success(
        settings?.hasShopPassword
          ? 'Đã đổi mật khẩu. Tất cả khách cần nhập mật khẩu mới để vào cửa hàng.'
          : 'Đã đặt mật khẩu cửa hàng'
      );
      reset({ password: '' });
      setPending(null);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  // Changing an existing password locks every customer out, so ask first
  const onSubmit = handleSubmit((values) => (settings?.hasShopPassword ? setPending(values) : persist(values)));

  return (
    <div className='max-w-2xl'>
      <PageHeader title='Cài đặt' />
      <Card className='p-6'>
        <div className='mb-5 flex items-start gap-3'>
          <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary'>
            <KeyRound className='h-5 w-5' aria-hidden />
          </div>
          <div>
            <h2 className='font-semibold text-lg'>Mật khẩu cửa hàng</h2>
            <p className='text-muted-foreground text-sm'>
              Khách hàng cần nhập mật khẩu này một lần để vào trang mua hàng.{' '}
              {settings?.hasShopPassword
                ? settings.shopPasswordUpdatedAt &&
                  `Cập nhật lần cuối: ${formatDateTime(settings.shopPasswordUpdatedAt)}.`
                : 'Hiện chưa đặt mật khẩu nên chưa ai vào được cửa hàng.'}
            </p>
          </div>
        </div>
        {settings?.hasShopPassword && (
          <div className='mb-5'>
            <CurrentShopPassword />
          </div>
        )}
        <form onSubmit={onSubmit} className='space-y-4' noValidate>
          <FormField
            label={settings?.hasShopPassword ? 'Mật khẩu mới' : 'Mật khẩu'}
            error={errors.password?.message}
            hint='Mật khẩu được mã hoá khi lưu. Chỉ admin xem lại được ở mục Mật khẩu hiện tại.'
            required
          >
            <PasswordInput autoComplete='new-password' {...register('password')} />
          </FormField>
          {settings?.hasShopPassword && (
            <p className='flex items-start gap-2 rounded-xl bg-accent-soft p-3 text-accent-hover text-sm'>
              <AlertTriangle className='mt-0.5 h-4 w-4 shrink-0' aria-hidden />
              Đổi mật khẩu sẽ thu hồi quyền vào cửa hàng của tất cả khách hàng. Họ phải nhập mật khẩu mới để tiếp tục
              mua sắm.
            </p>
          )}
          <Button type='submit' loading={save.isPending && !pending}>
            {settings?.hasShopPassword ? 'Đổi mật khẩu' : 'Lưu mật khẩu'}
          </Button>
        </form>
      </Card>
      <ConfirmDialog
        open={Boolean(pending)}
        onOpenChange={(open) => !open && setPending(null)}
        title='Đổi mật khẩu cửa hàng?'
        description='Tất cả khách hàng đang vào được cửa hàng sẽ bị thu hồi quyền và phải nhập mật khẩu mới. Hãy gửi mật khẩu mới cho khách sau khi đổi.'
        confirmLabel='Đổi và thu hồi quyền'
        destructive
        loading={save.isPending}
        onConfirm={() => pending && persist(pending)}
      />
    </div>
  );
}
