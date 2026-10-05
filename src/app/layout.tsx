import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Algo Trading Platform',
  description: 'No-code algorithmic trading platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* We can conditionally render AppShell here later based on route or use Route Groups. For now, it wraps everything. */}
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
