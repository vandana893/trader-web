import React from 'react';
import { Button } from '@/components/ui/Button';

interface MarketplaceHeaderProps {
  search: string;
  onSearchChange: (val: string) => void;
}

export function MarketplaceHeader({ search, onSearchChange }: MarketplaceHeaderProps) {
  return (
    <div style={{ marginBottom: 'var(--spacing-8)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>
            Strategy Marketplace
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)' }}>
            Discover, compare and explore algorithmic trading strategies.
          </p>
        </div>
        <div>
          <Button variant="primary" size="lg" href="/strategies/builder">
            Create Your Strategy
          </Button>
        </div>
      </div>
      
      <div style={{ position: 'relative', maxWidth: '600px' }}>
        <input 
          type="text" 
          placeholder="Search strategies, creators, instruments or tags..." 
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: 'var(--spacing-3) var(--spacing-4)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            fontSize: 'var(--font-size-base)',
            outline: 'none',
            boxShadow: 'var(--shadow-sm)'
          }}
        />
      </div>
    </div>
  );
}
