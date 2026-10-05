'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Download, RefreshCw, Search, X, Info, ChevronUp, ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Position } from '@/types/positions';
import mockPositions from '@/data/mock/positions/positions.json';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { PositionDetailsDrawer } from '@/components/positions/PositionDetailsDrawer';

function PositionsContent() {
  const searchParams = useSearchParams();
  const initStrategyId = searchParams?.get('strategyId');
  const initDeploymentId = searchParams?.get('deploymentId');
  const initPositionId = searchParams?.get('positionId'); // Support deep linking from order

  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [modeFilter, setModeFilter] = useState<string>('ALL');

  // Drawer
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<keyof Position>('openedAt');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    // Initial data load
    const saved = localStorage.getItem('mock_positions');
    let data: Position[];
    if (saved) {
      data = JSON.parse(saved);
    } else {
      data = mockPositions as Position[];
      localStorage.setItem('mock_positions', JSON.stringify(data));
    }
    
    // Apply URL filters initially
    if (initStrategyId) setSearchTerm(initStrategyId);
    if (initDeploymentId) setSearchTerm(initDeploymentId);
    if (initPositionId) {
      const pos = data.find(p => p.id === initPositionId);
      if (pos) setSelectedPosition(pos);
    }
    
    setPositions(data);
    setLoading(false);
  }, [initStrategyId, initDeploymentId, initPositionId]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const saved = localStorage.getItem('mock_positions');
      if (saved) setPositions(JSON.parse(saved));
      setLoading(false);
    }, 600);
  };

  const filteredPositions = useMemo(() => {
    return positions.filter(p => {
      const matchesSearch = !searchTerm || 
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.instrument.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.strategyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.strategyId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.deploymentId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchesMode = modeFilter === 'ALL' || p.executionMode === modeFilter;
      return matchesSearch && matchesStatus && matchesMode;
    }).sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [positions, searchTerm, statusFilter, modeFilter, sortField, sortAsc]);

  const handleSort = (field: keyof Position) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const SortIcon = ({ field }: { field: keyof Position }) => {
    if (sortField !== field) return null;
    return sortAsc ? <ChevronUp size={14} style={{ display: 'inline' }} /> : <ChevronDown size={14} style={{ display: 'inline' }} />;
  };

  const handleExport = () => {
    const headers = ['Position ID', 'Strategy', 'Deployment', 'Instrument', 'Side', 'Quantity', 'Avg Entry Price', 'Current Price', 'Invested Value', 'Unrealized P&L', 'Realized P&L', 'Status', 'Execution Mode', 'Opened At'];
    const rows = filteredPositions.map(p => [
      p.id, p.strategyName || '-', p.deploymentId || '-', p.instrument, p.side, p.quantity, p.averageEntryPrice, p.currentPrice, p.investedValue, p.unrealizedPnl, p.realizedPnl, p.status, p.executionMode, p.openedAt
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `positions_export_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // KPI Calculations
  const kpiData = useMemo(() => {
    const openPositions = positions.filter(p => p.status === 'OPEN').length;
    const longPositions = positions.filter(p => p.status === 'OPEN' && p.side === 'LONG').length;
    const shortPositions = positions.filter(p => p.status === 'OPEN' && p.side === 'SHORT').length;
    const totalExposure = positions.filter(p => p.status === 'OPEN').reduce((sum, p) => sum + p.investedValue, 0);
    const unrealizedPnl = positions.filter(p => p.status === 'OPEN').reduce((sum, p) => sum + p.unrealizedPnl, 0);
    const realizedPnl = positions.reduce((sum, p) => sum + p.realizedPnl, 0);
    return { openPositions, longPositions, shortPositions, totalExposure, unrealizedPnl, realizedPnl };
  }, [positions]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', padding: 'var(--spacing-4) var(--spacing-8)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Positions</h1>
            <Badge variant="warning" style={{ fontSize: 'var(--font-size-xs)' }}>SIMULATED DATA</Badge>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Monitor open and historical simulated positions across strategies.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw size={16} style={{ marginRight: '8px' }} /> Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download size={16} style={{ marginRight: '8px' }} /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-4)' }}>
        <KpiCard title="Open Positions" value={`${kpiData.openPositions} (${kpiData.longPositions} L / ${kpiData.shortPositions} S)`} theme="strategy" />
        <KpiCard title="Total Exposure" value={`₹${kpiData.totalExposure.toLocaleString()}`} theme="strategy" />
        <KpiCard title="Unrealized P&L" value={`${kpiData.unrealizedPnl >= 0 ? '+' : ''}₹${Math.abs(kpiData.unrealizedPnl).toLocaleString()}`} changeType={kpiData.unrealizedPnl >= 0 ? 'positive' : 'negative'} theme="strategy" />
        <KpiCard title="Realized P&L" value={`${kpiData.realizedPnl >= 0 ? '+' : ''}₹${Math.abs(kpiData.realizedPnl).toLocaleString()}`} changeType={kpiData.realizedPnl >= 0 ? 'positive' : 'negative'} theme="strategy" />
      </div>

      {/* Filters & Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        
        {/* Filter Bar */}
        <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-tinted)', display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by ID, Strategy, Instrument..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: 'var(--font-size-sm)' }}
            />
            {searchTerm && (
              <X size={14} onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '12px', top: '11px', color: 'var(--color-text-muted)', cursor: 'pointer' }} />
            )}
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: 'var(--font-size-sm)' }}>
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select value={modeFilter} onChange={e => setModeFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: 'var(--font-size-sm)' }}>
            <option value="ALL">All Modes</option>
            <option value="PAPER">Paper Trading</option>
            <option value="LIVE_SIMULATION">Live Simulation</option>
          </select>
          {(searchTerm || statusFilter !== 'ALL' || modeFilter !== 'ALL') && (
            <Button variant="ghost" onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); setModeFilter('ALL'); }} style={{ padding: '0 var(--spacing-2)' }}>
              Clear Filters
            </Button>
          )}
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', cursor: 'pointer' }} onClick={() => handleSort('instrument')}>Instrument <SortIcon field="instrument" /></th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>Strategy / Deployment</th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>Side</th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('quantity')}>Qty <SortIcon field="quantity" /></th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('averageEntryPrice')}>Avg Entry <SortIcon field="averageEntryPrice" /></th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('currentPrice')}>LTP <SortIcon field="currentPrice" /></th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('unrealizedPnl')}>P&L <SortIcon field="unrealizedPnl" /></th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', cursor: 'pointer' }} onClick={() => handleSort('status')}>Status <SortIcon field="status" /></th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', cursor: 'pointer' }} onClick={() => handleSort('openedAt')}>Opened At <SortIcon field="openedAt" /></th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} style={{ padding: 'var(--spacing-12)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Loading simulated positions...
                  </td>
                </tr>
              ) : filteredPositions.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: 'var(--spacing-12)', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-3)', color: 'var(--color-text-muted)' }}>
                      <Info size={32} />
                      <p>No simulated positions match your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPositions.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }} onClick={() => setSelectedPosition(p)} className="hover-bg-surface-tinted">
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                      <div style={{ fontWeight: 600 }}>{p.instrument}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{p.id}</div>
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                      <div style={{ fontWeight: 500 }}>{p.strategyName || '-'}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{p.deploymentId || '-'}</div>
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                      <Badge variant={p.side === 'LONG' ? 'success' : 'danger'}>{p.side}</Badge>
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right', fontWeight: 600 }}>
                      {p.quantity}
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>
                      ₹{p.averageEntryPrice.toFixed(2)}
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>
                      ₹{(p.status === 'CLOSED' ? p.exitPrice : p.currentPrice)?.toFixed(2) || '-'}
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>
                      {p.status === 'OPEN' ? (
                         <div style={{ fontWeight: 600, color: p.unrealizedPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                           {p.unrealizedPnl >= 0 ? '+' : ''}₹{p.unrealizedPnl.toFixed(2)}
                           <div style={{ fontSize: 'var(--font-size-xs)' }}>{p.pnlPercentage}%</div>
                         </div>
                      ) : (
                         <div style={{ fontWeight: 600, color: p.realizedPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                           {p.realizedPnl >= 0 ? '+' : ''}₹{p.realizedPnl.toFixed(2)} (Realized)
                         </div>
                      )}
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                      <Badge variant={p.status === 'OPEN' ? 'success' : 'neutral'}>{p.status}</Badge>
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>
                      {new Date(p.openedAt).toLocaleDateString()}
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{new Date(p.openedAt).toLocaleTimeString()}</div>
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedPosition(p)}>View</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <PositionDetailsDrawer 
        isOpen={!!selectedPosition} 
        position={selectedPosition} 
        onClose={() => setSelectedPosition(null)} 
        onViewOrder={(oid) => window.location.href = `/orders?orderId=${oid}`} 
      />

    </div>
  );
}

export default function PositionsPage() {
  return (
    <React.Suspense fallback={<div style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>Loading Positions...</div>}>
      <PositionsContent />
    </React.Suspense>
  );
}