'use client';

import { useAdminUsers, useRevokeShopAccess } from '@/api/admin';
import type { AdminUser } from '@/api/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import { formatDateTime, formatNumber } from '@/lib/format';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from './data-table';
import { PageHeader } from './page-header';
import { SearchInput } from './search-input';

export function AdminUsers() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers({ q: q || undefined, page, limit: 20 });
  const revoke = useRevokeShopAccess();
  const [revoking, setRevoking] = useState<AdminUser | null>(null);

  const confirmRevoke = async () => {
    if (!revoking) return;
    try {
      await revoke.mutateAsync(revoking.id);
      toast.success(`Đã thu hồi quyền vào cửa hàng của ${revoking.name}`);
      setRevoking(null);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div>
      <PageHeader
        title='Người dùng'
        description={data ? `${formatNumber(data.total)} tài khoản` : undefined}
        action={
          <SearchInput
            placeholder='Tìm theo tên, email, SĐT'
            onSearch={(value) => {
              setQ(value);
              setPage(1);
            }}
          />
        }
      />
      <DataTable
        headers={[
          { label: 'Người dùng' },
          { label: 'Số điện thoại' },
          { label: 'Facebook' },
          { label: 'Quyền vào shop' },
          { label: 'Ngày đăng ký' },
          { label: 'Thao tác', className: 'text-right' },
        ]}
        loading={isLoading}
        isEmpty={data?.items.length === 0}
        empty='Không có người dùng nào'
      >
        {data?.items.map((user) => (
          <tr key={user.id} className='hover:bg-muted/40'>
            <td className='px-4 py-3'>
              <p className='flex items-center gap-2 font-semibold'>
                {user.name}
                {user.role === 'admin' && <Badge tone='violet'>Admin</Badge>}
              </p>
              <p className='text-muted-foreground text-xs'>{user.email}</p>
            </td>
            <td className='px-4 py-3 tabular-nums'>{user.phone || '—'}</td>
            <td className='px-4 py-3'>
              {user.facebookUrl ? (
                <a
                  href={user.facebookUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex min-h-9 items-center gap-1 font-semibold text-primary hover:underline'
                >
                  Mở Facebook
                  <ExternalLink className='h-3.5 w-3.5' aria-hidden />
                </a>
              ) : (
                '—'
              )}
            </td>
            <td className='px-4 py-3'>
              {user.hasShopAccess ? <Badge tone='primary'>Đã mở khoá</Badge> : <Badge>Chưa mở khoá</Badge>}
            </td>
            <td className='px-4 py-3 text-muted-foreground'>{formatDateTime(user.createdAt)}</td>
            <td className='px-4 py-3 text-right'>
              {user.hasShopAccess && user.role !== 'admin' && (
                <Button variant='outline' size='sm' onClick={() => setRevoking(user)}>
                  Thu hồi quyền
                </Button>
              )}
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
            itemLabel='tài khoản'
            onPageChange={setPage}
          />
        </div>
      )}
      <ConfirmDialog
        open={Boolean(revoking)}
        onOpenChange={(open) => !open && setRevoking(null)}
        title='Thu hồi quyền vào cửa hàng?'
        description={`${revoking?.name ?? ''} sẽ phải nhập lại mật khẩu cửa hàng để mua hàng.`}
        confirmLabel='Thu hồi'
        destructive
        loading={revoke.isPending}
        onConfirm={confirmRevoke}
      />
    </div>
  );
}
