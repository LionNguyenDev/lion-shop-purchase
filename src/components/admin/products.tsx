'use client';

import { useAdminProducts, useCategoryOptions, useDeleteProduct, useSetProductVisibility } from '@/api/admin';
import type { Product } from '@/api/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Select } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { ProductImage } from '@/components/ui/product-image';
import { Switch } from '@/components/ui/switch';
import { formatCurrency, formatNumber } from '@/lib/format';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from './data-table';
import { PageHeader } from './page-header';
import { ProductFormDialog } from './product-form-dialog';
import { SearchInput } from './search-input';

export function AdminProducts() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState('all');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminProducts({
    q: q || undefined,
    category: category || undefined,
    visibility,
    page,
    limit: 20,
  });
  const { data: categories } = useCategoryOptions();
  const setVisible = useSetProductVisibility();
  const deleteProduct = useDeleteProduct();
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const toggleVisible = async (product: Product, isVisible: boolean) => {
    try {
      await setVisible.mutateAsync({ id: product.id, isVisible });
      toast.success(isVisible ? `Đã hiển thị "${product.name}"` : `Đã ẩn "${product.name}"`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteProduct.mutateAsync(deleting.id);
      toast.success('Đã xoá sản phẩm');
      setDeleting(null);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div>
      <PageHeader
        title='Sản phẩm'
        description={data ? `${formatNumber(data.total)} sản phẩm` : undefined}
        action={
          <Button onClick={() => setEditing('new')} disabled={categories?.length === 0}>
            <Plus className='h-5 w-5' aria-hidden />
            Thêm sản phẩm
          </Button>
        }
      />
      {categories?.length === 0 && (
        <p className='mb-4 rounded-xl bg-accent-soft px-4 py-3 font-medium text-accent-hover text-sm'>
          Bạn cần tạo ít nhất một danh mục trước khi thêm sản phẩm.
        </p>
      )}
      <div className='mb-4 flex flex-col gap-2 sm:flex-row'>
        <SearchInput
          placeholder='Tìm theo tên sản phẩm'
          onSearch={(value) => {
            setQ(value);
            setPage(1);
          }}
        />
        <Select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          aria-label='Lọc theo danh mục'
          className='sm:w-52'
        >
          <option value=''>Tất cả danh mục</option>
          {categories?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
        <Select
          value={visibility}
          onChange={(e) => {
            setVisibility(e.target.value);
            setPage(1);
          }}
          aria-label='Lọc theo trạng thái hiển thị'
          className='sm:w-44'
        >
          <option value='all'>Tất cả trạng thái</option>
          <option value='visible'>Đang hiển thị</option>
          <option value='hidden'>Đang ẩn</option>
        </Select>
      </div>

      <DataTable
        headers={[
          { label: 'Sản phẩm' },
          { label: 'Giá', className: 'text-right' },
          { label: 'Có thể bán', className: 'text-right' },
          { label: 'Đã bán', className: 'text-right' },
          { label: 'Hiển thị', className: 'text-center' },
          { label: 'Thao tác', className: 'text-right' },
        ]}
        loading={isLoading}
        isEmpty={data?.items.length === 0}
        empty='Không có sản phẩm nào'
      >
        {data?.items.map((product) => (
          <tr key={product.id} className='hover:bg-muted/40'>
            <td className='px-4 py-3'>
              <div className='flex items-center gap-3'>
                <ProductImage
                  src={product.images[0]}
                  alt={product.name}
                  width={100}
                  className='h-12 w-12 shrink-0 rounded-lg'
                />
                <div className='min-w-0'>
                  <p className='line-clamp-1 font-semibold'>{product.name}</p>
                  <p className='text-muted-foreground text-xs'>{product.category?.name ?? 'Không có danh mục'}</p>
                </div>
              </div>
            </td>
            <td className='px-4 py-3 text-right font-semibold tabular-nums'>{formatCurrency(product.price)}</td>
            <td className='px-4 py-3 text-right tabular-nums'>
              {product.stock > 0 ? formatNumber(product.stock) : <Badge tone='danger'>Hết hàng</Badge>}
            </td>
            <td className='px-4 py-3 text-right tabular-nums'>{formatNumber(product.sold)}</td>
            <td className='px-4 py-1 text-center'>
              <Switch
                checked={product.isVisible}
                onCheckedChange={(checked) => toggleVisible(product, checked)}
                disabled={setVisible.isPending && setVisible.variables?.id === product.id}
                label={`Hiển thị ${product.name}`}
              />
            </td>
            <td className='px-4 py-3'>
              <div className='flex justify-end gap-1'>
                <Button
                  variant='ghost'
                  size='icon-sm'
                  onClick={() => setEditing(product)}
                  aria-label={`Sửa ${product.name}`}
                >
                  <Pencil className='h-4 w-4' aria-hidden />
                </Button>
                <Button
                  variant='ghost'
                  size='icon-sm'
                  className='hover:bg-destructive-soft hover:text-destructive'
                  onClick={() => setDeleting(product)}
                  aria-label={`Xoá ${product.name}`}
                >
                  <Trash2 className='h-4 w-4' aria-hidden />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
      {data && (
        <div className='mt-6'>
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            limit={data.limit}
            itemLabel='sản phẩm'
            onPageChange={setPage}
          />
        </div>
      )}

      <ProductFormDialog product={editing} categories={categories ?? []} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title='Xoá sản phẩm?'
        description={`"${deleting?.name ?? ''}" sẽ bị xoá vĩnh viễn và gỡ khỏi giỏ hàng của khách. Đơn hàng cũ vẫn được giữ. Nếu chỉ muốn tạm ngừng bán, hãy tắt hiển thị.`}
        confirmLabel='Xoá vĩnh viễn'
        destructive
        loading={deleteProduct.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
