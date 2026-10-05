import React from 'react';
import { Card } from '../ui/Card';

export function StrategySkeleton() {
  const cards = Array.from({ length: 6 });

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 'var(--spacing-6)'
    }}>
      {cards.map((_, i) => (
        <Card key={i} tinted style={{ minHeight: '280px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div>
              <div style={{ height: '24px', width: '150px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--spacing-2)' }} />
              <div style={{ height: '16px', width: '200px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ height: '20px', width: '60px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)' }} />
            <div style={{ height: '20px', width: '60px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)' }} />
          </div>
          <div style={{ flexGrow: 1 }}>
            <div style={{ height: '40px', width: '100%', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
          </div>
        </Card>
      ))}
    </div>
  );
}
