import React from 'react';
import { Strategy } from '@/types/strategy';
import { StrategyCard } from './StrategyCard';
import { EmptyState } from '../ui/EmptyState';

interface StrategyListProps {
  strategies: Strategy[];
  onAction: (action: string, strategy: Strategy) => void;
  isSearchEmpty: boolean;
}

export function StrategyList({ strategies, onAction, isSearchEmpty }: StrategyListProps) {
  if (strategies.length === 0) {
    if (isSearchEmpty) {
      return (
        <EmptyState 
          title="No strategies found" 
          description="Try changing your search or filters." 
        />
      );
    }
    return (
      <EmptyState 
        title="No strategies yet" 
        description="Create your first strategy to get started." 
        actionLabel="Create Strategy"
        actionHref="/strategies/builder"
      />
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 'var(--spacing-6)'
    }}>
      {strategies.map(strategy => (
        <StrategyCard key={strategy.id} strategy={strategy} onAction={onAction} />
      ))}
    </div>
  );
}
