'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ReactQueryProvider } from './ReactQueryProvider';
import { ThemeProvider } from './ThemeProviders';

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
