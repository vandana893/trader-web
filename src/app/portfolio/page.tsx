'use client';
import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  RefreshCw, Download, Search, X, ChevronUp, ChevronDown, 
  ArrowUpRight, ArrowDownRight, Briefcase, Activity, 
  TrendingUp, PieChart, ExternalLink, XCircle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { KpiCard } from '@/components/dashboard/KpiCard';

import portfolioDataRaw from '@/data/mock/portfolio.json';
import { PortfolioHolding, PortfolioPerformancePoint, PortfolioActivity, PortfolioAccount, AssetAllocation, StrategyAllocation } from '@/types/portfolio';

// Type assertion for mock data
const portfolioData = {
  holdings: portfolioDataRaw.holdings as PortfolioHolding[],
  performance: portfolioDataRaw.performance as PortfolioPerformancePoint[],
  activities: portfolioDataRaw.activities as PortfolioActivity[],
  account: portfolioDataRaw.account as PortfolioAccount
};

// --- Sub-components will be defined here (or inline) ---

function PortfolioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URL Filters
  const initStrategyId = searchParams?.get('strategyId') || '';
  const initDeploymentId = searchParams?.get('deploymentId') || '';
  const initPositionId = searchParams?.get('positionId') || '';
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');
  
  // Drawer state
  const [selectedHolding, setSelectedHolding] = useState<PortfolioHolding | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<keyof PortfolioHolding>('lastUpdatedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof PortfolioHolding) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  // Filter Holdings
  const filteredHoldings = useMemo(() => {
    return portfolioData.holdings.filter(h => {
      if (initStrategyId && h.strategyId !== initStrategyId) return false;
      if (initDeploymentId && h.deploymentId !== initDeploymentId) return false;
      if (initPositionId && h.positionId !== initPositionId) return false;
      
      if (statusFilter !== 'ALL' && h.status !== statusFilter) return false;
      if (modeFilter !== 'ALL' && h.executionMode !== modeFilter) return false;
      
      if (search) {
        const q = search.toLowerCase();
        return h.instrument.toLowerCase().includes(q) ||
               h.strategyName.toLowerCase().includes(q) ||
               h.positionId.toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [initStrategyId, initDeploymentId, initPositionId, search, statusFilter, modeFilter, sortField, sortDir]);

  // Derived KPI Calculations
  const metrics = useMemo(() => {
    const openHoldings = filteredHoldings.filter(h => h.status === 'OPEN');
    const closedHoldings = filteredHoldings.filter(h => h.status === 'CLOSED');

    const investedCapital = openHoldings.reduce((sum, h) => sum + h.investedValue, 0);
    const currentValue = openHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    
    const unrealizedPnl = openHoldings.reduce((sum, h) => sum + h.unrealizedPnl, 0);
    const realizedPnl = closedHoldings.reduce((sum, h) => sum + h.realizedPnl, 0);
    const totalPnl = unrealizedPnl + realizedPnl;
    
    // We assume Available Funds comes from account, but this is a filtered view, so total PF value might be different
    const availableFunds = portfolioData.account.availableFunds;
    const totalPortfolioValue = availableFunds + currentValue;
    const pnlPercent = investedCapital > 0 ? (totalPnl / investedCapital) * 100 : 0;
    
    // Just a mock for today's PNL
    const todaysPnl = unrealizedPnl * 0.15; 

    return {
      investedCapital, currentValue, unrealizedPnl, realizedPnl, totalPnl, 
      availableFunds, totalPortfolioValue, pnlPercent, todaysPnl,
      openCount: openHoldings.length,
      closedCount: closedHoldings.length
    };
  }, [filteredHoldings]);

  // Strategy Allocation
  const strategyAllocations = useMemo(() => {
    const map = new Map<string, StrategyAllocation>();
    filteredHoldings.filter(h => h.status === 'OPEN').forEach(h => {
      const existing = map.get(h.strategyId) || { strategyId: h.strategyId, strategyName: h.strategyName, currentValue: 0, investedValue: 0, pnl: 0, positionCount: 0 };
      existing.currentValue += h.currentValue;
      existing.investedValue += h.investedValue;
      existing.pnl += h.unrealizedPnl;
      existing.positionCount += 1;
      map.set(h.strategyId, existing);
    });
    return Array.from(map.values()).sort((a,b) => b.currentValue - a.currentValue);
  }, [filteredHoldings]);

  const exportCSV = () => {
    if (filteredHoldings.length === 0) return;
    const headers = ['Instrument,Exchange,Quantity,AvgPrice,CurrentPrice,InvestedValue,CurrentValue,UnrealizedPnl,RealizedPnl,TotalPnl,Pnl%,Status,Strategy,ExecutionMode'];
    const rows = filteredHoldings.map(h => 
      `${h.instrument},${h.exchange},${h.quantity},${h.averagePrice},${h.currentPrice},${h.investedValue},${h.currentValue},${h.unrealizedPnl},${h.realizedPnl},${h.unrealizedPnl+h.realizedPnl},${h.pnlPercentage},${h.status},${h.strategyName},${h.executionMode}`
    );
    const csv = headers.concat(rows).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio_export.csv';
    a.click();
  };

  const handleRefresh = () => {
    alert('FRONTEND SIMULATION: Portfolio data refreshed.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', padding: 'var(--spacing-4) var(--spacing-8)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Portfolio</h1>
            <Badge variant="warning" style={{ fontSize: 'var(--font-size-xs)' }}>SIMULATED DATA</Badge>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Monitor your simulated funds, holdings, positions and portfolio performance.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Last simulated update: Just now</span>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-4)' }}>
        <KpiCard title="Total Portfolio Value" value={`₹${metrics.totalPortfolioValue.toLocaleString()}`} theme="strategy" />
        <KpiCard title="Invested Capital" value={`₹${metrics.investedCapital.toLocaleString()}`} theme="strategy" />
        <KpiCard title="Total P&L" value={`₹${metrics.totalPnl.toLocaleString()}`} subtitle={`${metrics.pnlPercent >= 0 ? '+' : ''}${metrics.pnlPercent.toFixed(2)}%`} theme="strategy" />
        <KpiCard title="Available Funds" value={`₹${metrics.availableFunds.toLocaleString()}`} theme="strategy" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-6)' }}>
        
        {/* Left Column: Holdings & Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-tinted)', display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1 1 250px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search holdings..." 
                  style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', outline: 'none' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select 
                value={statusFilter} 
                onChange={setStatusFilter} 
                options={[
                  { label: 'All Statuses', value: 'ALL' },
                  { label: 'Open', value: 'OPEN' },
                  { label: 'Closed', value: 'CLOSED' }
                ]} 
              />
              <Select 
                value={modeFilter} 
                onChange={setModeFilter} 
                options={[
                  { label: 'All Execution Modes', value: 'ALL' },
                  { label: 'Paper Trading', value: 'PAPER' },
                  { label: 'Live Simulation', value: 'LIVE_SIMULATION' }
                ]} 
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('instrument')}>Instrument</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('quantity')}>Qty</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('averagePrice')}>Avg Price</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('currentPrice')}>LTP</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleSort('unrealizedPnl')}>Unrealized P&L</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600, textAlign: 'center' }}>Status</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHoldings.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        No holdings match your current filters.
                        <br/>
                        <Button variant="outline" size="sm" style={{ marginTop: 'var(--spacing-4)' }} onClick={() => { setSearch(''); setStatusFilter('ALL'); setModeFilter('ALL'); }}>Clear Filters</Button>
                      </td>
                    </tr>
                  ) : filteredHoldings.map(h => (
                    <tr key={h.id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{h.instrument}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{h.strategyName}</div>
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>{h.quantity}</td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>₹{h.averagePrice.toLocaleString()}</td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>₹{h.currentPrice.toLocaleString()}</td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                        <div style={{ fontWeight: 600, color: h.unrealizedPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                          {h.unrealizedPnl >= 0 ? '+' : ''}₹{h.unrealizedPnl.toLocaleString()}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: h.unrealizedPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                          {h.pnlPercentage.toFixed(2)}%
                        </div>
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'center' }}>
                        <Badge variant={h.status === 'OPEN' ? 'success' : 'default'} style={{ fontSize: '10px' }}>
                          {h.status}
                        </Badge>
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>
                        <Button variant="outline" size="sm" onClick={() => setSelectedHolding(h)}>
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Account & Allocation */}
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Account Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Account</span>
                <span className="font-semibold text-slate-800">{portfolioData.account.accountName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Broker</span>
                <span className="font-semibold text-slate-800">{portfolioData.account.brokerName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Available Margin</span>
                <span className="font-bold text-green-600">₹{portfolioData.account.availableFunds.toLocaleString()}</span>
              </div>
              <div className="mt-4 pt-2">
                <Badge variant="default" className="w-full justify-center">MOCK BROKER ACCOUNT</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Strategy Allocation</h3>
            {strategyAllocations.length === 0 ? (
              <div className="text-sm text-slate-500 py-4 text-center">No active allocations.</div>
            ) : (
              <div className="space-y-4">
                {strategyAllocations.map(sa => {
                  const percent = metrics.investedCapital > 0 ? (sa.investedValue / metrics.investedCapital) * 100 : 0;
                  return (
                    <div key={sa.strategyId} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700">{sa.strategyName}</span>
                        <span className="font-semibold">{percent.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

        </div>
      </div>

      {/* Drawer */}
      <PortfolioDrawer 
        holding={selectedHolding} 
        onClose={() => setSelectedHolding(null)} 
        router={router}
      />
    </div>
  );
}

// Drawer Component
function PortfolioDrawer({ holding, onClose, router }: { holding: PortfolioHolding | null, onClose: () => void, router: any }) {
  if (!holding) return null;
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)', zIndex: 40 }} onClick={onClose}></div>
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '480px', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-2xl)', zIndex: 50, display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--color-border)' }}>
        
        {/* Header */}
        <div style={{ padding: 'var(--spacing-5) var(--spacing-6)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-surface-tinted)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Holding Details</h2>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>ID: {holding.id}</div>
          </div>
          <button onClick={onClose} style={{ padding: 'var(--spacing-2)', cursor: 'pointer', backgroundColor: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} color="var(--color-text-secondary)" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
          
          {/* Top Section: Title & PnL */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-text-primary)' }}>{holding.instrument}</h3>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                <Badge variant={holding.status === 'OPEN' ? 'success' : 'default'} style={{ fontSize: '11px' }}>{holding.status}</Badge>
                <Badge variant="default" style={{ fontSize: '11px', backgroundColor: '#e0e7ff', color: '#4338ca' }}>{holding.executionMode.replace('_', ' ')}</Badge>
              </div>
            </div>
            <div style={{ padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-lg)', textAlign: 'center', backgroundColor: holding.unrealizedPnl >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', minWidth: '130px' }}>
              <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Unrealized P&L</div>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: holding.unrealizedPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {holding.unrealizedPnl >= 0 ? '+' : ''}₹{holding.unrealizedPnl.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Grid of Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
            <div style={{ backgroundColor: 'var(--color-surface-tinted)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-1)' }}>Quantity</div>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{holding.quantity} <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 400, color: 'var(--color-text-muted)' }}>({holding.side})</span></div>
            </div>
            <div style={{ backgroundColor: 'var(--color-surface-tinted)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-1)' }}>Invested Value</div>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>₹{holding.investedValue.toLocaleString()}</div>
            </div>
            <div style={{ backgroundColor: 'var(--color-surface-tinted)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-1)' }}>Avg Price</div>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>₹{holding.averagePrice.toLocaleString()}</div>
            </div>
            <div style={{ backgroundColor: 'var(--color-surface-tinted)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-1)' }}>Current Price</div>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>₹{holding.currentPrice.toLocaleString()}</div>
            </div>
          </div>

          {/* Related Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Related Strategy</h4>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface-tinted)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{holding.strategyName}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>{holding.strategyId}</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push(`/strategies/${holding.strategyId}`)}>
                  View Strategy <ExternalLink size={14} style={{ marginLeft: '6px' }} />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Related Position</h4>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface-tinted)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Position Tracking</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>{holding.positionId}</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push(`/positions?positionId=${holding.positionId}`)}>
                  View Position <ExternalLink size={14} style={{ marginLeft: '6px' }} />
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default function PortfolioPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<div className="h-full flex items-center justify-center p-10"><div className="animate-pulse flex flex-col items-center gap-4"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div><div className="text-slate-500 font-medium">Loading Portfolio...</div></div></div>}>
        <PortfolioContent />
      </Suspense>
    </div>
  );
}