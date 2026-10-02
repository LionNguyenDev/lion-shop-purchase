'use client';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { authClient, authErrorMessage } from '@/lib/auth-client';
import { ROUTES } from '@/lib/routes';
import { safeRedirect } from '@/lib/safe-redirect';
import { type LoginInput, loginSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthHeading } from './auth-heading';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  const onSubmit = handleSubmit(async (values) => {
    setFormError('');
    const { error } = await authClient.signIn.email(values);
    if (error) return setFormError(authErrorMessage(error));
    await queryClient.invalidateQueries();
    router.replace(safeRedirect(searchParams.get('redirect')));
    router.refresh();
  });

  return (
    <>
      <AuthHeading title='Đăng nhập' description='Chào mừng bạn quay lại Lion Shopping.' />
      <form onSubmit={onSubmit} className='space-y-5' noValidate>
        {formError && (
          <p role='alert' className='rounded-xl bg-destructive-soft px-4 py-3 font-medium text-destructive text-sm'>
            {formError}
          </p>
        )}
        <FormField label='Email' error={errors.email?.message} required>
          <Input type='email' autoComplete='email' placeholder='ban@example.com' {...register('email')} />
        </FormField>
        <FormField label='Mật khẩu' error={errors.password?.message} required>
          <PasswordInput autoComplete='current-password' placeholder='Nhập mật khẩu' {...register('password')} />
        </FormField>
        <div className='flex justify-end'>
          <Link href={ROUTES.FORGOT_PASSWORD} className='font-semibold text-primary text-sm hover:underline'>
            Quên mật khẩu?
          </Link>
        </div>
        <Button type='submit' size='lg' className='w-full' loading={isSubmitting}>
          Đăng nhập
        </Button>
      </form>
      <p className='mt-8 text-center text-muted-foreground text-sm'>
        Chưa có tài khoản?{' '}
        <Link href={ROUTES.REGISTER} className='font-semibold text-primary hover:underline'>
          Đăng ký ngay
        </Link>
      </p>
    </>
  );
}
