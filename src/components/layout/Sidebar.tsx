'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  LineChart, 
  Store, 
  History, 
  NotebookPen, 
  Activity, 
  ShoppingCart, 
  Briefcase, 
  PieChart, 
  FileText, 
  Wand2, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Strategies', href: '/strategies', icon: LineChart },
  { label: 'Marketplace', href: '/marketplace', icon: Store },
  { label: 'Backtest', href: '/backtesting', icon: History },
  { label: 'Paper Trading', href: '/paper-trading', icon: NotebookPen },
  { label: 'Live Trading', href: '/live-trading', icon: Activity },
  { label: 'Orders', href: '/orders', icon: ShoppingCart },
  { label: 'Positions', href: '/positions', icon: Briefcase },
  { label: 'Portfolio', href: '/portfolio', icon: PieChart },
  { label: 'Reports', href: '/reports', icon: FileText },
  { label: 'Creator', href: '/creator', icon: Wand2 },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen?: boolean, setMobileMenuOpen?: (v: boolean) => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">{collapsed ? 'AL' : 'ALGO PLATFORM'}</div>
        {/* On desktop, this is collapse. On mobile, this should close the drawer. */}
        <button onClick={() => {
          if (window.innerWidth <= 768 && setMobileMenuOpen) {
            setMobileMenuOpen(false);
          } else {
            setCollapsed(!collapsed);
          }
        }} className="collapse-btn">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}