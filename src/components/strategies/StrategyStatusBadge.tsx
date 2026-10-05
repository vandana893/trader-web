import React from 'react';
import { Badge } from '../ui/Badge';
import { StrategyStatus, StrategyMode } from '@/types/strategy';

export function StrategyStatusBadge({ status }: { status: StrategyStatus }) {
  let variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' = 'neutral';
  
  switch (status) {
    case 'running':
      variant = 'success';
      break;
    case 'paused':
      variant = 'warning';
      break;
    case 'stopped':
      variant = 'danger';
      break;
    case 'draft':
      variant = 'info';
      break;
  }
  
  return <Badge variant={variant}>{status}</Badge>;
}

export function StrategyModeBadge({ mode }: { mode: StrategyMode }) {
  // Live mode should have a semantic emphasis, paper should be neutral/info
  const variant = mode === 'live' ? 'warning' : 'neutral';
  
  return <Badge variant={variant} style={{ 
    backgroundColor: mode === 'live' ? 'rgba(255, 184, 66, 0.2)' : 'var(--color-neutral-bg)',
    color: mode === 'live' ? '#d97706' : 'var(--color-text-secondary)',
  }}>
    {mode}
  </Badge>;
}
