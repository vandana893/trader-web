import React from 'react';
import { MarketplaceFiltersState, RiskLevel, PricingType, PerformanceType } from '@/types/marketplace';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import mockData from '@/data/mock/marketplace.json';

interface MarketplaceFiltersProps {
  filters: MarketplaceFiltersState;
  onFilterChange: (filters: Partial<MarketplaceFiltersState>) => void;
  onClear: () => void;
}

export function MarketplaceFilters({ filters, onFilterChange, onClear }: MarketplaceFiltersProps) {
  
  const categories = [{ label: 'All Categories', value: 'all' }, ...mockData.categories.map(c => ({ label: c, value: c }))];
  const riskLevels = [
    { label: 'All Risks', value: 'all' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' }
  ];
  const pricingOptions = [
    { label: 'All Pricing', value: 'all' },
    { label: 'Free', value: 'free' },
    { label: 'Paid', value: 'paid' }
  ];
  const performanceTypes = [
    { label: 'All Types', value: 'all' },
    { label: 'Backtest', value: 'backtest' },
    { label: 'Paper', value: 'paper' },
    { label: 'Live', value: 'live' }
  ];

  return (
    <Card tinted style={{ padding: 'var(--spacing-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--color-text-primary)' }}>Filters</h3>
        <button 
          onClick={onClear}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 500, cursor: 'pointer' }}
        >
          Clear
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        
        <div>
          <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)', color: 'var(--color-text-secondary)' }}>Category</label>
          <Select 
            value={filters.category}
            onChange={(val) => onFilterChange({ category: val })}
            options={categories}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)', color: 'var(--color-text-secondary)' }}>Risk Level</label>
          <Select 
            value={filters.riskLevel}
            onChange={(val) => onFilterChange({ riskLevel: val as RiskLevel | 'all' })}
            options={riskLevels}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)', color: 'var(--color-text-secondary)' }}>Pricing</label>
          <Select 
            value={filters.pricing}
            onChange={(val) => onFilterChange({ pricing: val as PricingType | 'all' })}
            options={pricingOptions}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)', color: 'var(--color-text-secondary)' }}>Performance Type</label>
          <Select 
            value={filters.performanceType}
            onChange={(val) => onFilterChange({ performanceType: val as PerformanceType | 'all' })}
            options={performanceTypes}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
          <input 
            type="checkbox" 
            id="fav-filter" 
            checked={filters.favoritesOnly}
            onChange={(e) => onFilterChange({ favoritesOnly: e.target.checked })}
            style={{ cursor: 'pointer' }}
          />
          <label htmlFor="fav-filter" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
            Favorites Only
          </label>
        </div>

      </div>
    </Card>
  );
}
