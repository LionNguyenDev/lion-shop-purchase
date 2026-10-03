'use client';

import { ROUTES } from '@/lib/routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider, useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { type ReactNode, useState } from 'react';
import { Toaster } from 'sonner';

export interface ProvidersProps {
  children: ReactNode;
}

// The landing page and the shop support dark mode; auth and admin stay light
const isThemedRoute = (pathname: string) => pathname === ROUTES.HOME || pathname.startsWith(ROUTES.SHOP);

/** Sonner follows the active theme */
function ThemedToaster() {
  const { forcedTheme, resolvedTheme } = useTheme();
  const theme = forcedTheme ?? resolvedTheme;
  return <Toaster position='top-center' richColors closeButton theme={theme === 'dark' ? 'dark' : 'light'} />;
}

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
      forcedTheme={isThemedRoute(pathname) ? undefined : 'light'}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <ThemedToaster />
        <ReactQueryDevtools buttonPosition='bottom-left' initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default Providers;
