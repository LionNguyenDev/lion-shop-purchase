'use client';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { authClient, authErrorMessage } from '@/lib/auth-client';
import { ROUTES } from '@/lib/routes';
import { type RegisterInput, registerSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AuthHeading } from './auth-heading';

export function RegisterForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', phone: '', facebookUrl: '' },
  });

  const onSubmit = handleSubmit(async ({ confirmPassword: _, ...values }) => {
    setFormError('');
    const { error } = await authClient.signUp.email(values);
    if (error) return setFormError(authErrorMessage(error));
    await queryClient.invalidateQueries();
    toast.success('Tạo tài khoản thành công! Hãy nhập mật khẩu cửa hàng để bắt đầu mua sắm.');
    router.replace(ROUTES.HOME);
    router.refresh();
  });

  return (
    <>
      <AuthHeading title='Tạo tài khoản' description='Điền thông tin để shop liên hệ và giao hàng cho bạn.' />
      <form onSubmit={onSubmit} className='space-y-4' noValidate>
        {formError && (
          <p role='alert' className='rounded-xl bg-destructive-soft px-4 py-3 font-medium text-destructive text-sm'>
            {formError}
          </p>
        )}
        <FormField label='Họ và tên' error={errors.name?.message} required>
          <Input autoComplete='name' placeholder='Nguyễn Văn A' {...register('name')} />
        </FormField>
        <FormField label='Email' error={errors.email?.message} required>
          <Input type='email' autoComplete='email' placeholder='ban@example.com' {...register('email')} />
        </FormField>
        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField label='Mật khẩu' error={errors.password?.message} hint='Tối thiểu 8 ký tự' required>
            <PasswordInput autoComplete='new-password' {...register('password')} />
          </FormField>
          <FormField label='Nhắc lại mật khẩu' error={errors.confirmPassword?.message} required>
            <PasswordInput autoComplete='new-password' {...register('confirmPassword')} />
          </FormField>
        </div>
        <FormField label='Số điện thoại' error={errors.phone?.message} required>
          <Input type='tel' inputMode='tel' autoComplete='tel' placeholder='0912345678' {...register('phone')} />
        </FormField>
        <FormField
          label='Link Facebook'
          error={errors.facebookUrl?.message}
          hint='Shop sẽ liên hệ với bạn qua Facebook khi cần'
          required
        >
          <Input
            type='url'
            inputMode='url'
            placeholder='https://facebook.com/ten.cua.ban'
            {...register('facebookUrl')}
          />
        </FormField>
        <Button type='submit' size='lg' className='w-full' loading={isSubmitting}>
          Đăng ký
        </Button>
      </form>
      <p className='mt-8 text-center text-muted-foreground text-sm'>
        Đã có tài khoản?{' '}
        <Link href={ROUTES.LOGIN} className='font-semibold text-primary hover:underline'>
          Đăng nhập
        </Link>
      </p>
    </>
  );
}
