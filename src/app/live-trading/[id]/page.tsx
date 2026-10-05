'use client';
import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, AlertTriangle, ShieldAlert, Activity, ArrowLeft, Briefcase, ListOrdered, History, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { LiveDeployment, LiveOrder, LivePosition, ExecutionEvent } from '@/types/liveTrading';
import mockOrders from '@/data/mock/live-trading/orders.json';
import mockPositions from '@/data/mock/live-trading/positions.json';
import mockExecutions from '@/data/mock/live-trading/executions.json';
import { useRouter, useParams } from 'next/navigation';

export default function LiveTradingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const deploymentId = typeof params?.id === 'string' ? params.id : '';
  
  const [deployment, setDeployment] = useState<LiveDeployment | null>(null);
  const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'history'>('positions');

  useEffect(() => {
    const saved = localStorage.getItem('live_deployments');
    if (saved) {
      const deployments = JSON.parse(saved) as LiveDeployment[];
      const found = deployments.find(d => d.id === deploymentId);
      if (found) setDeployment(found);
    }
  }, [deploymentId]);

  if (!deployment) {
    return <div style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>Loading deployment...</div>;
  }

  const handlePause = () => {
    if (confirm("Pause Live Strategy?\nPausing will prevent the strategy from generating new orders until resumed.")) {
      updateStatus('PAUSED');
    }
  };

  const handleResume = () => {
    if (confirm("Resume Live Strategy?\nEnsure broker and risk settings are correct.")) {
      updateStatus('RUNNING');
    }
  };

  const handleStop = () => {
    if (confirm("Stop Live Strategy?\nStopping this deployment will stop the strategy from generating new orders.")) {
      updateStatus('STOPPED');
    }
  };

  const updateStatus = (status: LiveDeployment['status']) => {
    const saved = localStorage.getItem('live_deployments');
    if (saved) {
      let deps = JSON.parse(saved) as LiveDeployment[];
      deps = deps.map(d => d.id === deploymentId ? { ...d, status } : d);
      localStorage.setItem('live_deployments', JSON.stringify(deps));
      setDeployment({ ...deployment, status });
    }
  };

  const orders = mockOrders.filter(o => o.deploymentId === deployment.id) as LiveOrder[];
  const positions = mockPositions.filter(p => p.deploymentId === deployment.id) as LivePosition[];
  const executions = mockExecutions.filter(e => e.deploymentId === deployment.id) as ExecutionEvent[];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', padding: 'var(--spacing-4) var(--spacing-8)' }}>
      
      {/* Safety Banner */}
      <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
        <ShieldAlert size={20} style={{ color: 'var(--color-warning)' }} />
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-warning)' }}>
          <strong>Frontend Simulation:</strong> This live trading deployment is completely simulated. No real money or actual broker orders are involved.
        </p>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/live-trading')} style={{ marginBottom: 'var(--spacing-2)', padding: 0 }}>
            <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Live Trading
          </Button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {deployment.strategyName}
            </h1>
            <Badge variant="danger" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Activity size={12} /> LIVE
            </Badge>
            <Badge variant={deployment.status === 'RUNNING' ? 'success' : deployment.status === 'PAUSED' ? 'warning' : 'neutral'}>
              {deployment.status}
            </Badge>
          </div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', display: 'flex', gap: 'var(--spacing-4)' }}>
            <span><strong>ID:</strong> {deployment.id}</span>
            <span><strong>Version:</strong> {deployment.version}</span>
            <span><strong>Broker:</strong> {deployment.brokerName} ({deployment.accountId})</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          {deployment.status === 'RUNNING' && (
            <>
              <Button variant="outline" onClick={handlePause} style={{ color: 'var(--color-warning)', borderColor: 'var(--color-warning)' }}>
                <Pause size={16} style={{ marginRight: '8px' }} /> Pause
              </Button>
              <Button variant="outline" onClick={handleStop} style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
                <Square size={16} style={{ marginRight: '8px' }} /> Stop
              </Button>
            </>
          )}
          {deployment.status === 'PAUSED' && (
            <>
              <Button variant="outline" onClick={handleResume} style={{ color: 'var(--color-success)', borderColor: 'var(--color-success)' }}>
                <Play size={16} style={{ marginRight: '8px' }} /> Resume
              </Button>
              <Button variant="outline" onClick={handleStop} style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
                <Square size={16} style={{ marginRight: '8px' }} /> Stop
              </Button>
            </>
          )}
          {deployment.status === 'STOPPED' && (
            <Button variant="primary" onClick={() => router.push('/live-trading')}>
              Deploy New Instance
            </Button>
          )}
        </div>
      </div>

      {/* External Links */}
      <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
         <Button variant="outline" size="sm" onClick={() => router.push(`/orders?deploymentId=${deployment.id}`)}>
           <ListOrdered size={16} style={{ marginRight: '8px' }} /> View Orders
         </Button>
         <Button variant="outline" size="sm" onClick={() => router.push(`/positions?deploymentId=${deployment.id}`)}>
           <Briefcase size={16} style={{ marginRight: '8px' }} /> View Positions
         </Button>
      </div>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 'var(--spacing-6)' }}>
        
        {/* Left Column (Main Content) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          
          {/* Account Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
            <KpiCard title="Allocated Capital" value={`₹${deployment.initialCapital.toLocaleString()}`} theme="strategy" />
            <KpiCard title="Current Equity" value={`₹${deployment.currentEquity.toLocaleString()}`} theme="strategy" />
            <KpiCard title="Total P&L" value={`${deployment.totalPnl >= 0 ? '+' : ''}₹${Math.abs(deployment.totalPnl).toLocaleString()}`} changeType={deployment.totalPnl >= 0 ? 'positive' : 'negative'} theme="strategy" />
            <KpiCard title="Today's P&L" value={`${deployment.todayPnl >= 0 ? '+' : ''}₹${Math.abs(deployment.todayPnl).toLocaleString()}`} theme="strategy" />
          </div>

          {/* Chart Placeholder */}
          <Card style={{ padding: 'var(--spacing-6)', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Live Equity (Mock Data)</h3>
            <div style={{ flex: 1, backgroundColor: 'var(--color-surface-tinted)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--color-border)' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Equity Curve Chart</span>
            </div>
          </Card>

          {/* Tabs for Positions / Orders / History */}
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-tinted)' }}>
              {[
                { id: 'positions', label: 'Open Positions', icon: Briefcase },
                { id: 'orders', label: 'Execution / Orders', icon: ListOrdered },
                { id: 'history', label: 'Execution History', icon: History }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: 'var(--spacing-4) var(--spacing-6)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    transition: 'all 0.2s'
                  }}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </div>

            <div style={{ padding: 'var(--spacing-4)' }}>
              {activeTab === 'positions' && (
                <div style={{ overflowX: 'auto' }}>
                  {positions.length === 0 ? (
                    <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No open positions.</div>
                  ) : (
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', borderBottom: '1px solid var(--color-border)' }}>
                          <th style={{ padding: 'var(--spacing-3)' }}>Instrument</th>
                          <th style={{ padding: 'var(--spacing-3)' }}>Side</th>
                          <th style={{ padding: 'var(--spacing-3)', textAlign: 'right' }}>Qty</th>
                          <th style={{ padding: 'var(--spacing-3)', textAlign: 'right' }}>Avg Price</th>
                          <th style={{ padding: 'var(--spacing-3)', textAlign: 'right' }}>LTP</th>
                          <th style={{ padding: 'var(--spacing-3)', textAlign: 'right' }}>P&L</th>
                        </tr>
                      </thead>
                      <tbody>
                        {positions.map(p => (
                          <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ padding: 'var(--spacing-3)', fontWeight: 600 }}>{p.instrument}</td>
                            <td style={{ padding: 'var(--spacing-3)' }}><Badge variant={p.side === 'BUY' ? 'success' : 'danger'}>{p.side}</Badge></td>
                            <td style={{ padding: 'var(--spacing-3)', textAlign: 'right' }}>{p.qty}</td>
                            <td style={{ padding: 'var(--spacing-3)', textAlign: 'right' }}>₹{p.avgPrice.toFixed(2)}</td>
                            <td style={{ padding: 'var(--spacing-3)', textAlign: 'right' }}>₹{p.currentPrice.toFixed(2)}</td>
                            <td style={{ padding: 'var(--spacing-3)', textAlign: 'right', fontWeight: 600, color: p.unrealizedPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                              {p.unrealizedPnl >= 0 ? '+' : ''}₹{p.unrealizedPnl}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div style={{ overflowX: 'auto' }}>
                  {orders.length === 0 ? (
                    <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No orders yet.</div>
                  ) : (
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', borderBottom: '1px solid var(--color-border)' }}>
                          <th style={{ padding: 'var(--spacing-3)' }}>Time</th>
                          <th style={{ padding: 'var(--spacing-3)' }}>Instrument</th>
                          <th style={{ padding: 'var(--spacing-3)' }}>Side</th>
                          <th style={{ padding: 'var(--spacing-3)' }}>Type</th>
                          <th style={{ padding: 'var(--spacing-3)', textAlign: 'right' }}>Qty</th>
                          <th style={{ padding: 'var(--spacing-3)', textAlign: 'right' }}>Price</th>
                          <th style={{ padding: 'var(--spacing-3)' }}>Status</th>
                          <th style={{ padding: 'var(--spacing-3)' }}>Mode</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--font-size-sm)' }}>{new Date(o.time).toLocaleTimeString()}</td>
                            <td style={{ padding: 'var(--spacing-3)', fontWeight: 600 }}>{o.instrument}</td>
                            <td style={{ padding: 'var(--spacing-3)' }}><Badge variant={o.side === 'BUY' ? 'success' : 'danger'}>{o.side}</Badge></td>
                            <td style={{ padding: 'var(--spacing-3)' }}>{o.type}</td>
                            <td style={{ padding: 'var(--spacing-3)', textAlign: 'right' }}>{o.qty}</td>
                            <td style={{ padding: 'var(--spacing-3)', textAlign: 'right' }}>{o.executionPrice ? `₹${o.executionPrice.toFixed(2)}` : (o.requestedPrice ? `₹${o.requestedPrice.toFixed(2)}` : 'MKT')}</td>
                            <td style={{ padding: 'var(--spacing-3)' }}>
                              <Badge variant={o.status === 'Filled' ? 'success' : o.status === 'Pending' ? 'warning' : 'neutral'}>{o.status}</Badge>
                            </td>
                            <td style={{ padding: 'var(--spacing-3)' }}>
                              <Badge variant="warning">{o.executionMode}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div style={{ padding: 'var(--spacing-2)' }}>
                  {executions.length === 0 ? (
                     <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No events yet.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                      {executions.map((e, idx) => (
                        <div key={e.id} style={{ display: 'flex', gap: 'var(--spacing-4)', position: 'relative' }}>
                           {idx !== executions.length - 1 && <div style={{ position: 'absolute', left: '15px', top: '30px', bottom: '-20px', width: '2px', backgroundColor: 'var(--color-border)' }} />}
                           <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: e.status === 'SUCCESS' ? 'var(--color-success-bg)' : e.status === 'WARNING' ? 'var(--color-warning-bg)' : 'var(--color-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                             {e.status === 'WARNING' ? <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} /> : <Activity size={16} style={{ color: e.status === 'SUCCESS' ? 'var(--color-success)' : 'var(--color-info)' }} />}
                           </div>
                           <div style={{ flex: 1, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3)' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                               <span style={{ fontWeight: 600 }}>{e.event}</span>
                               <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{new Date(e.timestamp).toLocaleTimeString()}</span>
                             </div>
                             <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{e.description}</div>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column (Side Panels) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          
          {/* Risk Monitor */}
          <Card>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Risk Monitor</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Maximum Loss</span>
                  <span style={{ fontWeight: 600 }}>₹1,250 / ₹5,000</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-surface-tinted)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '25%', height: '100%', backgroundColor: 'var(--color-success)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Maximum Trades</span>
                  <span style={{ fontWeight: 600 }}>12 / 20</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-surface-tinted)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '60%', height: '100%', backgroundColor: 'var(--color-warning)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Exposure</span>
                  <span style={{ fontWeight: 600 }}>₹72,000 / ₹1,00,000</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-surface-tinted)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '72%', height: '100%', backgroundColor: 'var(--color-warning)' }} />
                </div>
              </div>

            </div>
          </Card>

          {/* Broker Status */}
          <Card>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Broker Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Connection</span>
                <Badge variant="success">Connected</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Market Data</span>
                <Badge variant="success">Connected</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Last Sync</span>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Just now</span>
              </div>
            </div>
          </Card>

          {/* Alerts Panel */}
          <Card style={{ backgroundColor: 'var(--color-surface-tinted)', border: '1px solid var(--color-border)' }}>
             <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-3)' }}>
               <AlertCircle size={16} style={{ color: 'var(--color-warning)' }} /> Alerts
             </h3>
             <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>No active alerts for this deployment.</p>
          </Card>

        </div>
      </div>
    </div>
  );
}
