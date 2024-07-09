import '~/styles/globals.css';

import { Inter as FontSans } from 'next/font/google';
import { cn } from '~/lib/utils';
import Providers from './Context/Providers';
import type { Metadata, Viewport } from 'next';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Cost Calculator',
  description: 'Manage your costs with ease',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: '#68b7fd',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'bg-background font-sans text-foreground antialiased',
          fontSans.variable,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
