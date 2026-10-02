import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface DataTableProps {
  headers: { label: string; className?: string }[];
  loading?: boolean;
  empty?: ReactNode;
  children: ReactNode;
  isEmpty?: boolean;
}

/** Table inside a card; scrolls horizontally on its own on small screens. */
export function DataTable({ headers, loading, empty, isEmpty, children }: DataTableProps) {
  return (
    <Card className='overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[720px] text-left text-sm'>
          <thead className='border-border border-b bg-muted/60 text-muted-foreground text-xs uppercase tracking-wide'>
            <tr>
              {headers.map((header) => (
                <th key={header.label} scope='col' className={cn('px-4 py-3 font-semibold', header.className)}>
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {loading
              ? Array.from({ length: 5 }, (_, row) => (
                  <tr key={row}>
                    <td colSpan={headers.length} className='px-4 py-3'>
                      <Skeleton className='h-8 w-full' />
                    </td>
                  </tr>
                ))
              : children}
          </tbody>
        </table>
      </div>
      {!loading && isEmpty && <div className='px-4 py-12 text-center text-muted-foreground'>{empty}</div>}
    </Card>
  );
}
