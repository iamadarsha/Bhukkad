import type { Metadata, Viewport } from 'next';
import { Manrope, Noto_Sans_Devanagari, Sora } from 'next/font/google';
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
const bhukkadScript = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-bhukkad-script',
  display: 'swap',
  weight: ['600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase,
  applicationName: 'Bhukkad',
  title: {
    default: 'Bhukkad | भुक्कड़',
    template: '%s | Bhukkad',
  },
  description:
    'Bhukkad is an expressive restaurant operating system for India-first dining rooms, kitchen teams, table service, and daily operations.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff7ef' },
    { media: '(prefers-color-scheme: dark)', color: '#1a100c' },
  ],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bhukkadSans.variable} ${bhukkadDisplay.variable} ${bhukkadScript.variable} bg-background font-sans text-foreground antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
