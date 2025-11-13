import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from '@/components/providers/ClientProviders';

export const metadata: Metadata = {
  title: 'Crypto Trading Platform',
  description: 'Professional cryptocurrency trading platform with institutional features',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}