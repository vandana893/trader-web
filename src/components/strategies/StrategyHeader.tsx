import React from 'react';
import { Button } from '../ui/Button';

export function StrategyHeader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-8)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>Strategies</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)' }}>Manage, organize and monitor your algorithmic trading strategies.</p>
      </div>
      <div>
        <Button variant="primary" href="/strategies/builder" size="lg">Create Strategy</Button>
      </div>
    </div>
  );
}
