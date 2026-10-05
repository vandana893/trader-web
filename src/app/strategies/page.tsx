'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Strategy, StrategyStatus } from '@/types/strategy';
import { StrategyHeader } from '@/components/strategies/StrategyHeader';
import { StrategyFilters } from '@/components/strategies/StrategyFilters';
import { StrategySearch } from '@/components/strategies/StrategySearch';
import { StrategyList } from '@/components/strategies/StrategyList';
import { StrategySkeleton } from '@/components/strategies/StrategySkeleton';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Modal } from '@/components/ui/Modal';

import mockData from '@/data/mock/strategies.json';
import { useRouter } from 'next/navigation';

export default function StrategiesPage() {
  const router = useRouter();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StrategyStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortValue, setSortValue] = useState('recent');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    description: string;
    confirmLabel: string;
    variant: 'primary' | 'warning' | 'danger';
    onConfirm: () => void;
  }>({
    title: '', description: '', confirmLabel: '', variant: 'primary', onConfirm: () => {}
  });

  useEffect(() => {
    // Load from local storage or fallback to mock data
    const saved = localStorage.getItem('my-strategies-list');
    if (saved) {
      setStrategies(JSON.parse(saved));
    } else {
      setStrategies(mockData.strategies as Strategy[]);
      localStorage.setItem('my-strategies-list', JSON.stringify(mockData.strategies));
    }
    setLoading(false);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(strategies.map(s => s.category));
    return Array.from(cats);
  }, [strategies]);

  const filteredStrategies = useMemo(() => {
    let result = [...strategies];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(s => s.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(s => s.category === categoryFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.instruments.some(inst => inst.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortValue) {
        case 'recent':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'pnl_high':
          return b.pnl - a.pnl;
        case 'winrate_high':
          return b.winRate - a.winRate;
        default:
          return 0;
      }
    });

    return result;
  }, [strategies, search, statusFilter, categoryFilter, sortValue]);

  const updateStrategyStatus = (id: string, status: StrategyStatus) => {
    setStrategies(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, status, lastUpdated: new Date().toISOString() } : s);
      localStorage.setItem('my-strategies-list', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAction = (action: string, strategy: Strategy) => {
    switch (action) {
      case 'view':
        // Future route
        router.push(`/strategies/${strategy.id}`);
        break;
      case 'edit':
        router.push(`/strategies/builder?strategyId=${strategy.id}`);
        break;
      case 'pause':
        setModalConfig({
          title: 'Pause Strategy',
          description: `Are you sure you want to pause "${strategy.name}"? It will stop executing trades immediately.`,
          confirmLabel: 'Pause Strategy',
          variant: 'warning',
          onConfirm: () => updateStrategyStatus(strategy.id, 'paused')
        });
        setModalOpen(true);
        break;
      case 'resume':
        setModalConfig({
          title: 'Resume Strategy',
          description: `Are you sure you want to resume "${strategy.name}"? It will start executing trades according to its mode.`,
          confirmLabel: 'Resume Strategy',
          variant: 'primary',
          onConfirm: () => updateStrategyStatus(strategy.id, 'running')
        });
        setModalOpen(true);
        break;
      case 'stop':
        setModalConfig({
          title: 'Stop Strategy',
          description: `Are you sure you want to stop the simulated strategy "${strategy.name}"? This action cannot be easily undone.`,
          confirmLabel: 'Stop Strategy',
          variant: 'danger',
          onConfirm: () => updateStrategyStatus(strategy.id, 'stopped')
        });
        setModalOpen(true);
        break;
      case 'duplicate':
        const newStrategy: Strategy = {
          ...strategy,
          id: `strategy-${Date.now()}`,
          name: `${strategy.name} Copy`,
          status: 'draft',
          pnl: 0,
          pnlPercent: 0,
          totalTrades: 0,
          winRate: 0,
          lastUpdated: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        setStrategies(prev => {
          const updated = [newStrategy, ...prev];
          localStorage.setItem('my-strategies-list', JSON.stringify(updated));
          return updated;
        });
        break;
    }
  };

  const stats = useMemo(() => {
    return {
      total: strategies.length,
      running: strategies.filter(s => s.status === 'running').length,
      drafts: strategies.filter(s => s.status === 'draft').length,
      paused: strategies.filter(s => s.status === 'paused').length,
    };
  }, [strategies]);

  if (loading) {
    return (
      <div style={{ padding: 'var(--spacing-2)' }}>
        <StrategyHeader />
        <StrategySkeleton />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-2)' }}>
      <StrategyHeader />

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 'var(--spacing-4)',
        marginBottom: 'var(--spacing-8)'
      }}>
        <KpiCard title="Total Strategies" value={stats.total} change="12.5%" changeType="positive" />
        <KpiCard title="Running" value={stats.running} change="2.1%" changeType="positive" />
        <KpiCard title="Drafts" value={stats.drafts} change="0.0%" changeType="neutral" />
        <KpiCard title="Paused" value={stats.paused} change="1.5%" changeType="negative" />
      </div>

      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <StrategySearch
          value={search}
          onChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          categories={categories}
          sortValue={sortValue}
          onSortChange={setSortValue}
        />
        
        <StrategyFilters
          currentFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      </div>

      <StrategyList 
        strategies={filteredStrategies} 
        onAction={handleAction} 
        isSearchEmpty={strategies.length > 0 && filteredStrategies.length === 0}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalConfig.title}
        description={modalConfig.description}
        confirmLabel={modalConfig.confirmLabel}
        variant={modalConfig.variant}
        onConfirm={modalConfig.onConfirm}
      />
    </div>
  );
}