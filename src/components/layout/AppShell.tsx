'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const NO_SHELL_ROUTES = ['/', '/login', '/signup', '/forgot-password'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isNoShell = NO_SHELL_ROUTES.includes(pathname || '');

  if (isNoShell) {
    return <div className="app-container"><main className="page-content">{children}</main></div>;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}