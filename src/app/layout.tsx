import '~/styles/globals.css';

import type { Metadata, Viewport } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { constants } from '~/constants';
import { cn } from '~/lib/utils';
import Providers from './Context/Providers';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: constants.app_name,
  description: constants.app_description,
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
          'mx-auto max-w-screen-sm bg-background font-sans text-foreground antialiased',
          fontSans.variable,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
