import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center rounded-2xl border border-border border-dashed bg-card/60 px-6 py-14 text-center'>
      <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary'>
        <Icon className='h-7 w-7' aria-hidden />
      </div>
      <h3 className='font-semibold text-lg'>{title}</h3>
      {description && <p className='mt-1 max-w-sm text-muted-foreground text-sm'>{description}</p>}
      {action && <div className='mt-5'>{action}</div>}
    </div>
  );
}
