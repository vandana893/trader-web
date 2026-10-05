'use client';
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import Link from 'next/link';

export function DashboardAlerts({ initialAlerts }: { initialAlerts: any[] }) {
  const [alerts, setAlerts] = useState(initialAlerts || []);

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const getAlertColor = (type: string) => {
    switch(type) {
      case 'success': return 'var(--color-success)';
      case 'warning': return 'var(--color-warning)';
      case 'error': return 'var(--color-danger)';
      default: return 'var(--color-info)';
    }
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>Alerts & Notifications</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        {alerts.map((alert) => (
          <Link 
            key={alert.id} 
            href={alert.link || '#'}
            style={{ 
              display: 'block',
              padding: 'var(--spacing-3)', 
              borderRadius: 'var(--radius-md)',
              backgroundColor: alert.read ? 'var(--color-surface)' : 'var(--color-surface-tinted)',
              border: '1px solid',
              borderColor: alert.read ? 'var(--color-border)' : `${getAlertColor(alert.type)}40`,
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                {!alert.read && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: getAlertColor(alert.type) }} />}
                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{alert.title}</div>
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{alert.timestamp}</div>
            </div>
            
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)', paddingLeft: alert.read ? 0 : '16px' }}>
              {alert.message}
            </div>
            
            {!alert.read && (
              <div style={{ paddingLeft: '16px' }}>
                <button 
                  onClick={(e) => markAsRead(alert.id, e)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 'var(--font-size-xs)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Mark as read
                </button>
              </div>
            )}
          </Link>
        ))}
        {alerts.length === 0 && (
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>No new alerts.</div>
        )}
      </div>
    </Card>
  );
}
