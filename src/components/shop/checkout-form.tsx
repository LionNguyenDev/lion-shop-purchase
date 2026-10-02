'use client';

import { useCart, useCreateOrder, useMe, useProvinces, useWards } from '@/api/shop';
import { Button, buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { FormField } from '@/components/ui/form-field';
import { Input, Select, Textarea } from '@/components/ui/input';
import { ProductImage } from '@/components/ui/product-image';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';
import { ROUTES } from '@/lib/routes';
import { type CheckoutInput, checkoutSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, MapPin, ShoppingCart, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type CheckoutValues = z.input<typeof checkoutSchema>;

export function CheckoutForm() {
  const { data: me } = useMe();
  const { data: cart, isLoading: cartLoading } = useCart();
  const createOrder = useCreateOrder();
  const [placedCode, setPlacedCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues, unknown, z.output<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: '', phone: '', facebookUrl: '', street: '', note: '' },
  });

  // Prefill contact details from the account once it is loaded
  useEffect(() => {
    if (me?.user) {
      reset((values) => ({
        ...values,
        name: values.name || me.user!.name,
        phone: values.phone || me.user!.phone,
        facebookUrl: values.facebookUrl || me.user!.facebookUrl,
      }));
    }
  }, [me, reset]);

  const provinceCode = watch('provinceCode');
  const provinces = useProvinces();
  const wards = useWards(provinceCode || undefined);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const order = await createOrder.mutateAsync(values as CheckoutInput);
      setPlacedCode(order.code);
      window.scrollTo({ top: 0 });
    } catch (error) {
      toast.error((error as Error).message);
    }
  });

  if (placedCode) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title='Đặt hàng thành công!'
        description={
          <>
            Mã đơn hàng của bạn là <b className='text-foreground'>{placedCode}</b>. Shop sẽ liên hệ xác nhận qua số điện
            thoại hoặc Facebook sớm nhất.
          </>
        }
        action={
          <div className='flex flex-col gap-2 sm:flex-row'>
            <Link href={ROUTES.MY_ORDERS} className={buttonClasses('primary')}>
              Xem đơn hàng
            </Link>
            <Link href={ROUTES.SHOP} className={buttonClasses('outline')}>
              Tiếp tục mua sắm
            </Link>
          </div>
        }
      />
    );
  }

  if (cartLoading) return <Skeleton className='h-96 w-full' />;

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title='Giỏ hàng đang trống'
        action={
          <Link href={ROUTES.SHOP} className={buttonClasses('primary')}>
            Về cửa hàng
          </Link>
        }
      />
    );
  }

  const numberField = { setValueAs: (value: string) => (value === '' ? undefined : Number(value)) };

  return (
    <form onSubmit={onSubmit} noValidate>
      <h1 className='font-bold text-3xl tracking-tight'>Đặt hàng</h1>
      <div className='mt-6 grid gap-6 lg:grid-cols-[1fr_380px]'>
        <div className='space-y-6'>
          <Card className='space-y-4 p-5 sm:p-6'>
            <h2 className='font-semibold text-lg'>Thông tin người nhận</h2>
            <FormField label='Họ và tên' error={errors.name?.message} required>
              <Input autoComplete='name' {...register('name')} />
            </FormField>
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField label='Số điện thoại' error={errors.phone?.message} required>
                <Input type='tel' inputMode='tel' autoComplete='tel' {...register('phone')} />
              </FormField>
              <FormField label='Link Facebook' error={errors.facebookUrl?.message} required>
                <Input type='url' inputMode='url' {...register('facebookUrl')} />
              </FormField>
            </div>
          </Card>

          <Card className='space-y-4 p-5 sm:p-6'>
            <h2 className='flex items-center gap-2 font-semibold text-lg'>
              <MapPin className='h-5 w-5 text-primary' aria-hidden />
              Địa chỉ giao hàng
            </h2>
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                label='Tỉnh / Thành phố'
                error={
                  errors.provinceCode?.message ?? (provinces.isError ? (provinces.error as Error).message : undefined)
                }
                required
              >
                <Select
                  disabled={provinces.isLoading}
                  {...register('provinceCode', {
                    ...numberField,
                    onChange: () => setValue('wardCode', undefined as unknown as number),
                  })}
                >
                  <option value=''>{provinces.isLoading ? 'Đang tải...' : 'Chọn tỉnh / thành phố'}</option>
                  {provinces.data?.map((province) => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField
                label='Phường / Xã'
                error={errors.wardCode?.message ?? (wards.isError ? (wards.error as Error).message : undefined)}
                required
              >
                <Select disabled={!provinceCode || wards.isLoading} {...register('wardCode', numberField)}>
                  <option value=''>
                    {!provinceCode ? 'Chọn tỉnh trước' : wards.isLoading ? 'Đang tải...' : 'Chọn phường / xã'}
                  </option>
                  {wards.data?.map((ward) => (
                    <option key={ward.code} value={ward.code}>
                      {ward.name}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>
            <FormField label='Số nhà, tên đường' error={errors.street?.message} required>
              <Input autoComplete='street-address' placeholder='VD: 12 Nguyễn Trãi' {...register('street')} />
            </FormField>
            <FormField label='Ghi chú cho shop' error={errors.note?.message}>
              <Textarea rows={3} placeholder='VD: Giao giờ hành chính' {...register('note')} />
            </FormField>
          </Card>
        </div>

        <Card className='h-fit p-5 lg:sticky lg:top-24'>
          <h2 className='font-semibold text-lg'>Đơn hàng ({cart.count} sản phẩm)</h2>
          <ul className='mt-4 max-h-80 space-y-3 overflow-y-auto pr-1'>
            {cart.items.map(({ product, quantity }) => (
              <li key={product.id} className='flex gap-3'>
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  width={120}
                  className='h-14 w-14 shrink-0 rounded-lg'
                />
                <div className='min-w-0 flex-1 text-sm'>
                  <p className='line-clamp-2 font-medium'>{product.name}</p>
                  <p className='text-muted-foreground tabular-nums'>
                    {quantity} × {formatCurrency(product.price)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className='mt-4 flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm'>
            <Wallet className='h-4 w-4 text-primary' aria-hidden />
            Thanh toán khi nhận hàng (COD)
          </div>
          <div className='mt-4 flex items-center justify-between border-border border-t pt-4'>
            <span className='font-semibold'>Tổng cộng</span>
            <span className='font-bold text-2xl text-accent tabular-nums'>{formatCurrency(cart.subtotal)}</span>
          </div>
          <Button type='submit' variant='accent' size='lg' className='mt-5 w-full' loading={isSubmitting}>
            Đặt hàng
          </Button>
        </Card>
      </div>
    </form>
  );
}
