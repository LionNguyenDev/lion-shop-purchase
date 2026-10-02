import type { ReactNode } from 'react';

export function AuthHeading({ title, description }: { title: string; description: ReactNode }) {
  return (
    <div className='mb-8'>
      <h1 className='font-bold text-3xl tracking-tight'>{title}</h1>
      <p className='mt-2 text-muted-foreground'>{description}</p>
    </div>
  );
}
