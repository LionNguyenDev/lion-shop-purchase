'use client';

import { ROUTES } from '@/lib/routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { usePathname } from 'next/navigation';
import { type ReactNode, useState } from 'react';
import { Toaster } from 'sonner';

export interface ProvidersProps {
  children: ReactNode;
}

// Only the landing page has dark styles so far; every other route stays light
const THEMED_ROUTES: string[] = [ROUTES.HOME];

function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 5 * 1000,
            retry: false,
          },
        },
      })
  );

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
      forcedTheme={THEMED_ROUTES.includes(pathname) ? undefined : 'light'}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position='top-center' richColors closeButton />
        <ReactQueryDevtools buttonPosition='bottom-left' initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default Providers;
