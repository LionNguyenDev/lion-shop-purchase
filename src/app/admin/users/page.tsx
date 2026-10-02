import { AdminUsers } from '@/components/admin/users';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Người dùng' };

export default function AdminUsersPage() {
  return <AdminUsers />;
}
