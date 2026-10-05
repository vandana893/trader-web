'use client';
import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Strategy } from '@/types/strategy';
import { StrategyStatusBadge, StrategyModeBadge } from './StrategyStatusBadge';
import { StrategyActionMenu } from './StrategyActionMenu';

interface StrategyCardProps {
  strategy: Strategy;
  onAction: (action: string, strategy: Strategy) => void;
}

export function StrategyCard({ strategy, onAction }: StrategyCardProps) {
  const isDraft = strategy.status === 'draft';

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }} tinted>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-2)' }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>
            {strategy.name}
          </h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)', minHeight: '40px' }}>
            {strategy.description}
          </p>
        </div>
        <StrategyActionMenu status={strategy.status} onAction={(act) => onAction(act, strategy)} />
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
        <StrategyStatusBadge status={strategy.status} />
        <StrategyModeBadge mode={strategy.mode} />
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
          {strategy.category}
        </span>
      </div>

      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
        <strong style={{ color: 'var(--color-text-primary)' }}>Instruments: </strong>
        {strategy.instruments.join(', ')}
      </div>

      {!isDraft && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)', flexGrow: 1 }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>P&L</div>
            <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, color: strategy.pnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {strategy.pnl >= 0 ? '+' : ''}₹{strategy.pnl.toLocaleString()}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: strategy.pnlPercent >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {strategy.pnlPercent >= 0 ? '+' : ''}{strategy.pnlPercent}%
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Win Rate</div>
            <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {strategy.winRate}%
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              {strategy.totalTrades} trades
            </div>
          </div>
        </div>
      )}

      {isDraft && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, marginBottom: 'var(--spacing-4)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
          Strategy is in draft mode. Edit to configure conditions.
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          <div>v{strategy.version}</div>
          <div>Updated {new Date(strategy.lastUpdated).toLocaleDateString()}</div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          {isDraft && (
            <Button variant="outline" size="sm" onClick={() => onAction('edit', strategy)}>Edit</Button>
          )}
          <Button variant="primary" size="sm" href={`/strategies/${strategy.id}`}>View</Button>
        </div>
      </div>
    </Card>
  );
}
