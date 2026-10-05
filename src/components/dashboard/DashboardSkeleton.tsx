import React from 'react';
import { Card } from '../ui/Card';

export function DashboardSkeleton() {
  const shimmerStyle: React.CSSProperties = {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    backgroundColor: 'var(--color-border)',
    borderRadius: 'var(--radius-md)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      {/* Header Skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ width: 200, height: 32, marginBottom: 8, ...shimmerStyle }} />
          <div style={{ width: 300, height: 20, ...shimmerStyle }} />
        </div>
        <div style={{ width: 120, height: 36, ...shimmerStyle }} />
      </div>

      {/* KPI Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
        {[1, 2, 3, 4].map(i => (
          <Card key={i} tinted>
            <div style={{ width: 120, height: 20, marginBottom: 12, ...shimmerStyle }} />
            <div style={{ width: 160, height: 36, marginBottom: 12, ...shimmerStyle }} />
            <div style={{ width: 80, height: 20, ...shimmerStyle }} />
          </Card>
        ))}
      </div>

      {/* Main Charts Skeleton */}
      <div style={{ display: 'flex', gap: 'var(--spacing-6)' }}>
        <Card style={{ flex: 1, minHeight: 300 }}>
          <div style={{ width: 150, height: 24, marginBottom: 24, ...shimmerStyle }} />
          <div style={{ width: '100%', height: 200, ...shimmerStyle }} />
        </Card>
        <Card style={{ flex: 2, minHeight: 300 }}>
          <div style={{ width: 200, height: 24, marginBottom: 24, ...shimmerStyle }} />
          <div style={{ width: '100%', height: 200, ...shimmerStyle }} />
        </Card>
      </div>
      
      {/* Tables Skeleton */}
      <Card>
        <div style={{ width: 200, height: 24, marginBottom: 24, ...shimmerStyle }} />
        <div style={{ width: '100%', height: 150, ...shimmerStyle }} />
      </Card>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}} />
    </div>
  );
}
