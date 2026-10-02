import { AdminSettings } from '@/components/admin/settings';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Cài đặt' };

export default function AdminSettingsPage() {
  return <AdminSettings />;
}
