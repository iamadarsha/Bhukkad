import type { Metadata, Viewport } from 'next';
import { Manrope, Sora } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const metadataBase = process.env.APP_URL ? new URL(process.env.APP_URL) : undefined;
const bhukkadSans = Manrope({
  subsets: ['latin'],
  variable: '--font-bhukkad-sans',
  display: 'swap',
});
const bhukkadDisplay = Sora({
  subsets: ['latin'],
  variable: '--font-bhukkad-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase,
  applicationName: 'Bhukkad',
  title: {
    default: 'Bhukkad',
    template: '%s | Bhukkad',
  },
  description:
    'Bhukkad is a restaurant operating system for POS, KOT, tables, menu management, customers, and daily reporting.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf6f1' },
    { media: '(prefers-color-scheme: dark)', color: '#17120f' },
  ],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bhukkadSans.variable} ${bhukkadDisplay.variable} bg-background font-sans text-foreground antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
