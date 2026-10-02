'use client';

import { useAdminCategories, useDeleteCategory, useSaveCategory } from '@/api/admin';
import type { AdminCategory } from '@/api/types';
import { Button } from '@/components/ui/button';
import { ConfirmDialog, Dialog } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input, Textarea } from '@/components/ui/input';
import { formatNumber } from '@/lib/format';
import { type CategoryInput, categorySchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { DataTable } from './data-table';
import { PageHeader } from './page-header';

export function AdminCategories() {
  const { data, isLoading } = useAdminCategories();
  const deleteCategory = useDeleteCategory();
  const [editing, setEditing] = useState<AdminCategory | 'new' | null>(null);
  const [deleting, setDeleting] = useState<AdminCategory | null>(null);

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteCategory.mutateAsync(deleting.id);
      toast.success('Đã xoá danh mục');
      setDeleting(null);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div>
      <PageHeader
        title='Danh mục'
        description='Nhóm sản phẩm để khách dễ tìm'
        action={
          <Button onClick={() => setEditing('new')}>
            <Plus className='h-5 w-5' aria-hidden />
            Thêm danh mục
          </Button>
        }
      />
      <DataTable
        headers={[
          { label: 'Tên' },
          { label: 'Mô tả' },
          { label: 'Số sản phẩm' },
          { label: 'Thao tác', className: 'text-right' },
        ]}
        loading={isLoading}
        isEmpty={data?.length === 0}
        empty='Chưa có danh mục nào. Hãy tạo danh mục trước khi thêm sản phẩm.'
      >
        {data?.map((category) => (
          <tr key={category.id} className='hover:bg-muted/40'>
            <td className='px-4 py-3 font-semibold'>{category.name}</td>
            <td className='max-w-sm px-4 py-3 text-muted-foreground'>
              <span className='line-clamp-2'>{category.description || '—'}</span>
            </td>
            <td className='px-4 py-3 tabular-nums'>{formatNumber(category.productCount)}</td>
            <td className='px-4 py-3'>
              <div className='flex justify-end gap-1'>
                <Button
                  variant='ghost'
                  size='icon-sm'
                  onClick={() => setEditing(category)}
                  aria-label={`Sửa ${category.name}`}
                >
                  <Pencil className='h-4 w-4' aria-hidden />
                </Button>
                <Button
                  variant='ghost'
                  size='icon-sm'
                  className='hover:bg-destructive-soft hover:text-destructive'
                  onClick={() => setDeleting(category)}
                  aria-label={`Xoá ${category.name}`}
                >
                  <Trash2 className='h-4 w-4' aria-hidden />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <CategoryFormDialog category={editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title='Xoá danh mục?'
        description={`Danh mục "${deleting?.name ?? ''}" sẽ bị xoá. Chỉ xoá được khi không còn sản phẩm nào.`}
        confirmLabel='Xoá'
        destructive
        loading={deleteCategory.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function CategoryFormDialog({ category, onClose }: { category: AdminCategory | 'new' | null; onClose: () => void }) {
  const save = useSaveCategory();
  const isEdit = category !== null && category !== 'new';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({ resolver: zodResolver(categorySchema) });

  useEffect(() => {
    if (category)
      reset(isEdit ? { name: category.name, description: category.description } : { name: '', description: '' });
  }, [category, isEdit, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await save.mutateAsync({ ...values, id: isEdit ? category.id : undefined });
      toast.success(isEdit ? 'Đã cập nhật danh mục' : 'Đã tạo danh mục');
      onClose();
    } catch (error) {
      toast.error((error as Error).message);
    }
  });

  return (
    <Dialog
      open={category !== null}
      onOpenChange={(open) => !open && onClose()}
      title={isEdit ? 'Sửa danh mục' : 'Thêm danh mục'}
    >
      <form onSubmit={onSubmit} className='space-y-4' noValidate>
        <FormField label='Tên danh mục' error={errors.name?.message} required>
          <Input autoFocus {...register('name')} />
        </FormField>
        <FormField label='Mô tả' error={errors.description?.message}>
          <Textarea rows={3} {...register('description')} />
        </FormField>
        <Button type='submit' className='w-full' loading={isSubmitting}>
          {isEdit ? 'Lưu thay đổi' : 'Tạo danh mục'}
        </Button>
      </form>
    </Dialog>
  );
}
