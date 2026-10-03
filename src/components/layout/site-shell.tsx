import { queryKeys } from '@/api/query-keys';
import { BackgroundBlobs } from '@/components/landing/background-blobs';
import { FloatingContact } from '@/components/landing/floating-contact';
import { getMe } from '@/server/me';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

/** Page frame shared by the landing page and the shop: drifting blobs, header, footer and chat buttons */
export async function SiteShell({ children, landing }: { children: ReactNode; landing?: boolean }) {
  // Resolve the signed-in user on the server so the header renders its final buttons in the first HTML,
  // instead of a skeleton that waits for the JS bundle, hydration and a `/api/me` round trip
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: queryKeys.me, queryFn: getMe });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div
        data-landing={landing || undefined}
        className='relative isolate flex min-h-screen flex-col overflow-x-clip bg-white text-slate-900 dark:bg-slate-950 dark:text-white'
      >
        <BackgroundBlobs />
        <SiteHeader />
        {children}
        <SiteFooter />
        <FloatingContact />
      </div>
    </HydrationBoundary>
  );
}
