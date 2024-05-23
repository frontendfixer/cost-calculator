import '~/styles/globals.css';

import { Inter as FontSans } from 'next/font/google';
import { cn } from '~/lib/utils';
import Providers from './Context/Providers';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Cost Calculator',
  description: 'Manage your costs with ease',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        'bg-background font-sans text-foreground antialiased',
        fontSans.variable,
      )}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
