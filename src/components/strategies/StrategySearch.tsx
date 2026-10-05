import React from 'react';
import { Select } from '../ui/Select';

interface StrategySearchProps {
  value: string;
  onChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  sortValue: string;
  onSortChange: (sort: string) => void;
}

export function StrategySearch({ 
  value, 
  onChange, 
  categoryFilter, 
  onCategoryChange, 
  categories,
  sortValue,
  onSortChange
}: StrategySearchProps) {
  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 300px', position: 'relative' }}>
        <input
          type="text"
          placeholder="Search strategies by name, description, instrument..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: 'var(--spacing-3) var(--spacing-4)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-sm)',
            outline: 'none',
          }}
        />
      </div>
      
      <Select
        value={categoryFilter}
        onChange={onCategoryChange}
        options={[
          { label: 'All Categories', value: 'all' },
          ...categories.map(cat => ({ label: cat, value: cat }))
        ]}
        style={{ flex: '0 0 auto', minWidth: '180px' }}
      />

      <Select
        value={sortValue}
        onChange={onSortChange}
        options={[
          { label: 'Recently Updated', value: 'recent' },
          { label: 'Name A-Z', value: 'name_asc' },
          { label: 'Name Z-A', value: 'name_desc' },
          { label: 'Highest P&L', value: 'pnl_high' },
          { label: 'Highest Win Rate', value: 'winrate_high' }
        ]}
        style={{ flex: '0 0 auto', minWidth: '200px' }}
      />
    </div>
  );
}
