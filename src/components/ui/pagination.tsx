import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav className='flex items-center justify-center gap-3' aria-label='Phân trang'>
      <Button
        variant='outline'
        size='icon'
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label='Trang trước'
      >
        <ChevronLeft className='h-5 w-5' aria-hidden />
      </Button>
      <span className='min-w-24 text-center font-medium text-sm tabular-nums'>
        Trang {page} / {totalPages}
      </span>
      <Button
        variant='outline'
        size='icon'
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label='Trang sau'
      >
        <ChevronRight className='h-5 w-5' aria-hidden />
      </Button>
    </nav>
  );
}
