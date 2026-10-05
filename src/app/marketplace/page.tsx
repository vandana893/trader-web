'use client';

import React, { useState, useMemo } from 'react';
import { MarketplaceStrategy, MarketplaceFiltersState } from '@/types/marketplace';
import mockData from '@/data/mock/marketplace.json';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters';
import { MarketplaceStrategyCard } from '@/components/marketplace/MarketplaceStrategyCard';
import { Select } from '@/components/ui/Select';

export default function MarketplacePage() {
  const [filters, setFilters] = useState<MarketplaceFiltersState>({
    search: '',
    category: 'all',
    riskLevel: 'all',
    pricing: 'all',
    performanceType: 'all',
    favoritesOnly: false,
    sort: 'popular'
  });

  const sortOptions = [
    { label: 'Most Popular', value: 'popular' },
    { label: 'Highest Rated', value: 'rated' },
    { label: 'Highest Return', value: 'return' },
    { label: 'Highest Win Rate', value: 'winrate' },
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' }
  ];

  const updateFilters = (updates: Partial<MarketplaceFiltersState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '', category: 'all', riskLevel: 'all', pricing: 'all', 
      performanceType: 'all', favoritesOnly: false, sort: 'popular'
    });
  };

  const filteredStrategies = useMemo(() => {
    let result = [...(mockData.strategies as MarketplaceStrategy[])];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.creator.name.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q)) ||
        s.supportedInstruments.some(i => i.toLowerCase().includes(q))
      );
    }

    if (filters.category !== 'all') {
      result = result.filter(s => s.category === filters.category);
    }
    if (filters.riskLevel !== 'all') {
      result = result.filter(s => s.riskLevel === filters.riskLevel);
    }
    if (filters.pricing !== 'all') {
      result = result.filter(s => s.pricing.type === filters.pricing);
    }
    if (filters.performanceType !== 'all') {
      result = result.filter(s => s.performance.type === filters.performanceType);
    }

    if (filters.favoritesOnly) {
      const favs = JSON.parse(localStorage.getItem('marketplace-favorites') || '[]');
      result = result.filter(s => favs.includes(s.id));
    }

    // Sorting
    result.sort((a, b) => {
      switch(filters.sort) {
        case 'popular': return b.subscribers - a.subscribers;
        case 'rated': return b.rating - a.rating;
        case 'return': return b.performance.returnPercent - a.performance.returnPercent;
        case 'winrate': return b.performance.winRate - a.performance.winRate;
        case 'newest': return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'price_asc': return (a.pricing.amount || 0) - (b.pricing.amount || 0);
        case 'price_desc': return (b.pricing.amount || 0) - (a.pricing.amount || 0);
        default: return 0;
      }
    });

    return result;
  }, [filters]);

  return (
    <div style={{ padding: 'var(--spacing-4) var(--spacing-8)' }}>
      <MarketplaceHeader 
        search={filters.search} 
        onSearchChange={(val) => updateFilters({ search: val })} 
      />

      <div style={{ display: 'flex', gap: 'var(--spacing-8)', alignItems: 'flex-start' }}>
        
        {/* Left Sidebar Filters */}
        <div style={{ width: '280px', flexShrink: 0 }}>
          <MarketplaceFilters 
            filters={filters} 
            onFilterChange={updateFilters} 
            onClear={handleClearFilters}
          />
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Showing {filteredStrategies.length} strategies
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Sort by:</span>
              <div style={{ width: '200px' }}>
                <Select 
                  value={filters.sort}
                  onChange={(val) => updateFilters({ sort: val })}
                  options={sortOptions}
                />
              </div>
            </div>
          </div>

          {filteredStrategies.length === 0 ? (
            <div style={{ padding: 'var(--spacing-12)', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--color-border)' }}>
              <h3 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>No strategies found</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-6)' }}>Try changing your search or clearing the filters.</p>
              <button 
                onClick={handleClearFilters}
                style={{ padding: 'var(--spacing-2) var(--spacing-4)', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-6)' }}>
              {filteredStrategies.map(strategy => (
                <MarketplaceStrategyCard key={strategy.id} strategy={strategy} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}