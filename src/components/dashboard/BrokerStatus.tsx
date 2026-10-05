import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function BrokerStatus({ brokers }: { brokers: any[] }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>Broker Status</h3>
        <Button variant="ghost" size="sm" href="/settings">Manage</Button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        {brokers?.map((broker, idx) => (
          <div key={broker.id || idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: idx !== brokers.length - 1 ? 'var(--spacing-3)' : 0, borderBottom: idx !== brokers.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>{broker.name}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Last sync: {broker.lastSync}</div>
            </div>
            <Badge variant={broker.status.toLowerCase() === 'connected' ? 'success' : 'danger'}>
              {broker.status}
            </Badge>
          </div>
        ))}
        {(!brokers || brokers.length === 0) && (
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>No brokers connected.</div>
        )}
      </div>
    </Card>
  );
}
