'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Download, RefreshCw, Search, X, Info, ChevronUp, ChevronDown } from 'lucide-react';
import { Order, OrderStatus } from '@/types/orders';
import mockOrders from '@/data/mock/orders/orders.json';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { OrderDetailsDrawer } from '@/components/orders/OrderDetailsDrawer';

function OrdersContent() {
  const searchParams = useSearchParams();
  const initStrategyId = searchParams?.get('strategyId');
  const initDeploymentId = searchParams?.get('deploymentId');
  const initOrderId = searchParams?.get('orderId');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [modeFilter, setModeFilter] = useState<string>('ALL');

  // Drawer
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<keyof Order>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    // Initial data load
    const saved = localStorage.getItem('mock_orders');
    let data: Order[];
    if (saved) {
      data = JSON.parse(saved);
    } else {
      data = mockOrders as Order[];
      localStorage.setItem('mock_orders', JSON.stringify(data));
    }
    
    // Apply URL filters initially
    if (initStrategyId) setSearchTerm(initStrategyId);
    if (initDeploymentId) setSearchTerm(initDeploymentId);
    if (initOrderId) {
      const ord = data.find(o => o.id === initOrderId);
      if (ord) setSelectedOrder(ord);
    }
    
    setOrders(data);
    setLoading(false);
  }, [initStrategyId, initDeploymentId, initOrderId]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const saved = localStorage.getItem('mock_orders');
      if (saved) setOrders(JSON.parse(saved));
      setLoading(false);
    }, 600);
  };

  const handleCancelOrder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Cancel simulated order ${id}?\nThis is a frontend simulation only.`)) return;

    const updated = orders.map(o => {
      if (o.id === id) {
        return {
          ...o,
          status: 'CANCELLED' as OrderStatus,
          updatedAt: new Date().toISOString(),
          events: [...o.events, { status: 'CANCELLED' as OrderStatus, timestamp: new Date().toISOString(), message: 'User manually cancelled' }]
        };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('mock_orders', JSON.stringify(updated));
    alert('Simulated order cancelled.');
    if (selectedOrder?.id === id) {
      setSelectedOrder(updated.find(o => o.id === id) || null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = !searchTerm || 
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.instrument.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.strategyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.strategyId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.deploymentId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
      const matchesMode = modeFilter === 'ALL' || o.executionMode === modeFilter;
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
  }, [orders, searchTerm, statusFilter, modeFilter, sortField, sortAsc]);

  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const SortIcon = ({ field }: { field: keyof Order }) => {
    if (sortField !== field) return null;
    return sortAsc ? <ChevronUp size={14} style={{ display: 'inline' }} /> : <ChevronDown size={14} style={{ display: 'inline' }} />;
  };

  const handleExport = () => {
    const headers = ['Order ID', 'Strategy', 'Deployment', 'Instrument', 'Side', 'Type', 'Quantity', 'Price', 'Status', 'Execution Mode', 'Created At'];
    const rows = filteredOrders.map(o => [
      o.id, o.strategyName || '-', o.deploymentId || '-', o.instrument, o.side, o.orderType, o.quantity, o.price || 'MKT', o.status, o.executionMode, o.createdAt
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_export_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // KPI Calculations
  const kpiData = useMemo(() => {
    const total = orders.length;
    const open = orders.filter(o => o.status === 'OPEN' || o.status === 'PENDING').length;
    const filled = orders.filter(o => o.status === 'FILLED').length;
    const cancelled = orders.filter(o => o.status === 'CANCELLED' || o.status === 'REJECTED' || o.status === 'FAILED').length;
    return { total, open, filled, cancelled };
  }, [orders]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', padding: 'var(--spacing-4) var(--spacing-8)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Orders</h1>
            <Badge variant="warning" style={{ fontSize: 'var(--font-size-xs)' }}>SIMULATED DATA</Badge>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Monitor simulated order activity across strategies and trading deployments.
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
        <KpiCard title="Total Orders" value={kpiData.total.toString()} theme="strategy" />
        <KpiCard title="Open / Pending" value={kpiData.open.toString()} theme="strategy" />
        <KpiCard title="Filled" value={kpiData.filled.toString()} theme="strategy" />
        <KpiCard title="Cancelled / Failed" value={kpiData.cancelled.toString()} theme="strategy" />
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
            <option value="PENDING">Pending</option>
            <option value="FILLED">Filled</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REJECTED">Rejected</option>
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
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>Date <SortIcon field="createdAt" /></th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', cursor: 'pointer' }} onClick={() => handleSort('id')}>Order ID <SortIcon field="id" /></th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>Strategy / Deployment</th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', cursor: 'pointer' }} onClick={() => handleSort('instrument')}>Instrument <SortIcon field="instrument" /></th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>Side</th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('quantity')}>Qty <SortIcon field="quantity" /></th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('price')}>Price <SortIcon field="price" /></th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', cursor: 'pointer' }} onClick={() => handleSort('status')}>Status <SortIcon field="status" /></th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>Mode</th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} style={{ padding: 'var(--spacing-12)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Loading simulated orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: 'var(--spacing-12)', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-3)', color: 'var(--color-text-muted)' }}>
                      <Info size={32} />
                      <p>No simulated orders match your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }} onClick={() => setSelectedOrder(o)} className="hover-bg-surface-tinted">
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>
                      {new Date(o.createdAt).toLocaleTimeString()}
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>{o.id}</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                      <div style={{ fontWeight: 500 }}>{o.strategyName || '-'}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{o.deploymentId || '-'}</div>
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 600 }}>{o.instrument}</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                      <Badge variant={o.side === 'BUY' ? 'success' : 'danger'}>{o.side}</Badge>
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>
                      {o.filledQuantity} / {o.quantity}
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>
                      {o.price ? `₹${o.price.toFixed(2)}` : 'MKT'}
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                      <Badge variant={o.status === 'FILLED' ? 'success' : o.status === 'CANCELLED' || o.status === 'REJECTED' || o.status === 'FAILED' ? 'danger' : 'warning'}>{o.status}</Badge>
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: o.executionMode === 'PAPER' ? 'var(--color-info)' : 'var(--color-warning)' }}>
                        {o.executionMode.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>
                      {(o.status === 'OPEN' || o.status === 'PENDING') ? (
                        <Button variant="outline" size="sm" onClick={(e) => handleCancelOrder(o.id, e)} style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
                          Cancel
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(o)}>View</Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <OrderDetailsDrawer 
        isOpen={!!selectedOrder} 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        onViewPosition={(pid) => window.location.href = `/positions?positionId=${pid}`} 
      />

    </div>
  );
}

export default function OrdersPage() {
  return (
    <React.Suspense fallback={<div style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>Loading Orders...</div>}>
      <OrdersContent />
    </React.Suspense>
  );
}
// Trigger HMR
