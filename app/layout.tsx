import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'Bhukkad POS — World-Class Restaurant Management',
  description: 'Next-generation POS and restaurant management system built with Material Design 3',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
