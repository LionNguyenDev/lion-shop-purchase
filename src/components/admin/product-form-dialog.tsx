'use client';

import { useSaveProduct } from '@/api/admin';
import type { CategoryOption, Product } from '@/api/types';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input, Textarea } from '@/components/ui/input';
import { slugify } from '@/lib/text';
import { type ProductInput, productSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CategoryCombobox } from './category-combobox';
import { ImageUploader } from './image-uploader';

type FormValues = ProductInput;

const EMPTY: FormValues = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  sold: 0,
  categoryName: '',
  images: [],
  isVisible: true,
};

interface ProductFormDialogProps {
  product: Product | 'new' | null;
  categories: CategoryOption[];
  onClose: () => void;
}

export function ProductFormDialog({ product, categories, onClose }: ProductFormDialogProps) {
  const save = useSaveProduct();
  const isEdit = product !== null && product !== 'new';
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(productSchema), defaultValues: EMPTY });

  // Matched by slug like the server does, so "son môi" counts as the existing "Son Môi"
  const categorySlug = slugify(watch('categoryName'));
  const isNewCategory = categorySlug !== '' && !categories.some((category) => slugify(category.name) === categorySlug);

  useEffect(() => {
    if (!product) return;
    reset(
      isEdit
        ? {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            sold: product.sold,
            categoryName: product.category?.name ?? '',
            images: product.images,
            isVisible: product.isVisible,
          }
        : { ...EMPTY, categoryName: categories[0]?.name ?? '' }
    );
  }, [product, isEdit, categories, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await save.mutateAsync({ ...values, id: isEdit ? product.id : undefined });
      toast.success(isEdit ? 'Đã cập nhật sản phẩm' : 'Đã tạo sản phẩm');
      onClose();
    } catch (error) {
      toast.error((error as Error).message);
    }
  });

  const number = { valueAsNumber: true } as const;

  return (
    <Dialog
      open={product !== null}
      onOpenChange={(open) => !open && onClose()}
      title={isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
      className='max-w-2xl'
    >
      <form onSubmit={onSubmit} className='space-y-4' noValidate>
        <FormField label='Tên sản phẩm' error={errors.name?.message} required>
          <Input {...register('name')} />
        </FormField>
        <div className='grid gap-4 sm:grid-cols-2'>
          <Controller
            control={control}
            name='categoryName'
            render={({ field, fieldState }) => (
              <FormField
                label='Danh mục'
                error={fieldState.error?.message}
                hint={isNewCategory ? 'Danh mục mới, sẽ được tạo khi lưu' : undefined}
                required
              >
                <CategoryCombobox {...field} options={categories} placeholder='Chọn hoặc nhập danh mục mới' />
              </FormField>
            )}
          />
          <FormField label='Giá (VNĐ)' error={errors.price?.message} required>
            <Input type='number' inputMode='numeric' min={0} step={1000} {...register('price', number)} />
          </FormField>
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField label='Số lượng có thể bán' error={errors.stock?.message} hint='Tự giảm khi có đơn hàng' required>
            <Input type='number' inputMode='numeric' min={0} {...register('stock', number)} />
          </FormField>
          <FormField label='Số lượng đã bán' error={errors.sold?.message} hint='Tự tăng khi có đơn hàng' required>
            <Input type='number' inputMode='numeric' min={0} {...register('sold', number)} />
          </FormField>
        </div>
        <FormField label='Mô tả' error={errors.description?.message}>
          <Textarea rows={5} {...register('description')} />
        </FormField>
        <Controller
          control={control}
          name='images'
          render={({ field, fieldState }) => (
            <ImageUploader
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message ?? errors.images?.root?.message}
              onBusyChange={setUploading}
            />
          )}
        />
        <label className='flex min-h-11 items-center gap-3 font-medium text-sm'>
          <input type='checkbox' className='h-5 w-5 accent-primary' {...register('isVisible')} />
          Hiển thị sản phẩm trong cửa hàng
        </label>
        <div className='flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end'>
          <Button variant='outline' onClick={onClose}>
            Huỷ
          </Button>
          <Button type='submit' loading={isSubmitting} disabled={uploading}>
            {uploading ? 'Đang tải ảnh...' : isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
