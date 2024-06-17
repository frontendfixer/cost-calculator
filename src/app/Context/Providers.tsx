'use client';

import { ThemeProvider } from './ThemeProviders';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useIsClient } from '~/hooks/useIsClient';

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const isClient = useIsClient();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        enabled: isClient,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ReactQueryProvider>{children}</ReactQueryProvider>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 2000,
        }}
      />
    </ThemeProvider>
  );
};

export default Providers;
