import React from 'react';
import { Button } from '../ui/Button';

export function DashboardHeader({ onRefresh, lastUpdated }: { onRefresh: () => void, lastUpdated: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Portfolio overview and trading activity</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Last updated: {lastUpdated}</span>
        <Button variant="outline" size="sm" onClick={onRefresh}>Refresh</Button>
        <Button variant="primary" size="sm" href="/portfolio">View Portfolio</Button>
      </div>
    </div>
  );
}
