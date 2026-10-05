import React from 'react';
import { StrategyStatus } from '@/types/strategy';

interface StrategyFiltersProps {
  currentFilter: StrategyStatus | 'all';
  onFilterChange: (filter: StrategyStatus | 'all') => void;
}

export function StrategyFilters({ currentFilter, onFilterChange }: StrategyFiltersProps) {
  const filters: { label: string; value: StrategyStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Drafts', value: 'draft' },
    { label: 'Running', value: 'running' },
    { label: 'Paused', value: 'paused' },
    { label: 'Stopped', value: 'stopped' },
  ];

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', marginBottom: 'var(--spacing-4)' }}>
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          style={{
            padding: 'var(--spacing-2) var(--spacing-4)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid',
            borderColor: currentFilter === filter.value ? 'var(--color-primary)' : 'var(--color-border)',
            backgroundColor: currentFilter === filter.value ? 'var(--color-primary)' : 'var(--color-surface)',
            color: currentFilter === filter.value ? '#ffffff' : 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: currentFilter === filter.value ? 600 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
