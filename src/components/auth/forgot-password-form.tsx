'use client';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { authClient, authErrorMessage } from '@/lib/auth-client';
import { ROUTES } from '@/lib/routes';
import {
  type ForgotPasswordInput,
  type ResetPasswordInput,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, MailCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AuthHeading } from './auth-heading';

const RESEND_COOLDOWN = 60;

export function ForgotPasswordForm() {
  const [email, setEmail] = useState<string | null>(null);

  return email ? (
    <ResetStep email={email} onBack={() => setEmail(null)} />
  ) : (
    <EmailStep onSent={(value) => setEmail(value)} />
  );
}

async function requestOtp(email: string) {
  const { error } = await authClient.emailOtp.requestPasswordReset({ email });
  return error ? authErrorMessage(error) : null;
}

function EmailStep({ onSent }: { onSent: (email: string) => void }) {
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' } });

  const onSubmit = handleSubmit(async ({ email }) => {
    setFormError('');
    const error = await requestOtp(email);
    if (error) return setFormError(error);
    onSent(email);
  });

  return (
    <>
      <AuthHeading
        title='Quên mật khẩu'
        description='Nhập email đã đăng ký, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.'
      />
      <form onSubmit={onSubmit} className='space-y-5' noValidate>
        {formError && (
          <p role='alert' className='rounded-xl bg-destructive-soft px-4 py-3 font-medium text-destructive text-sm'>
            {formError}
          </p>
        )}
        <FormField label='Email' error={errors.email?.message} required>
          <Input type='email' autoComplete='email' placeholder='ban@example.com' autoFocus {...register('email')} />
        </FormField>
        <Button type='submit' size='lg' className='w-full' loading={isSubmitting}>
          Gửi mã OTP
        </Button>
      </form>
      <Link
        href={ROUTES.LOGIN}
        className='mt-8 inline-flex items-center gap-2 font-semibold text-primary text-sm hover:underline'
      >
        <ArrowLeft className='h-4 w-4' aria-hidden />
        Quay lại đăng nhập
      </Link>
    </>
  );
}

function ResetStep({ email, onBack }: { email: string; onBack: () => void }) {
  const router = useRouter();
  const [formError, setFormError] = useState('');
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: '', password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const resend = async () => {
    setResending(true);
    const error = await requestOtp(email);
    setResending(false);
    if (error) return toast.error(error);
    toast.success('Đã gửi lại mã OTP');
    setCooldown(RESEND_COOLDOWN);
  };

  const onSubmit = handleSubmit(async ({ otp, password }) => {
    setFormError('');
    const { error } = await authClient.emailOtp.resetPassword({ email, otp, password });
    if (error) return setFormError(authErrorMessage(error));
    toast.success('Đặt lại mật khẩu thành công, vui lòng đăng nhập');
    router.replace(ROUTES.LOGIN);
  });

  return (
    <>
      <AuthHeading
        title='Nhập mã OTP'
        description={
          <>
            Nếu email <b className='text-foreground'>{email}</b> đã đăng ký, mã OTP gồm 6 chữ số đã được gửi tới hộp
            thư. Mã có hiệu lực trong 10 phút.
          </>
        }
      />
      <form onSubmit={onSubmit} className='space-y-5' noValidate>
        <div className='flex items-center gap-3 rounded-xl bg-primary-soft p-3 text-primary-hover text-sm'>
          <MailCheck className='h-5 w-5 shrink-0' aria-hidden />
          Không thấy email? Hãy kiểm tra thư mục Spam.
        </div>
        {formError && (
          <p role='alert' className='rounded-xl bg-destructive-soft px-4 py-3 font-medium text-destructive text-sm'>
            {formError}
          </p>
        )}
        <FormField label='Mã OTP' error={errors.otp?.message} required>
          <Input
            inputMode='numeric'
            autoComplete='one-time-code'
            maxLength={6}
            placeholder='••••••'
            autoFocus
            className='text-center font-bold text-xl tracking-[0.5em]'
            {...register('otp')}
          />
        </FormField>
        <FormField label='Mật khẩu mới' error={errors.password?.message} hint='Tối thiểu 8 ký tự' required>
          <PasswordInput autoComplete='new-password' {...register('password')} />
        </FormField>
        <FormField label='Nhắc lại mật khẩu mới' error={errors.confirmPassword?.message} required>
          <PasswordInput autoComplete='new-password' {...register('confirmPassword')} />
        </FormField>
        <Button type='submit' size='lg' className='w-full' loading={isSubmitting}>
          Đặt lại mật khẩu
        </Button>
      </form>
      <div className='mt-6 flex items-center justify-between text-sm'>
        <button
          type='button'
          onClick={onBack}
          className='inline-flex items-center gap-2 font-semibold text-primary hover:underline'
        >
          <ArrowLeft className='h-4 w-4' aria-hidden />
          Đổi email
        </button>
        <Button variant='link' onClick={resend} disabled={cooldown > 0} loading={resending}>
          {cooldown > 0 ? `Gửi lại mã sau ${cooldown}s` : 'Gửi lại mã'}
        </Button>
      </div>
    </>
  );
}
