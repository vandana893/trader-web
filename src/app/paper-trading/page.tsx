'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, Square, RefreshCw, Activity, AlertTriangle, Plus, Search, Filter } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import mockDeployments from '@/data/mock/paper-trading/paper-deployments.json';
import { PaperDeployment } from '@/types/paperTrading';
import { useRouter } from 'next/navigation';

export default function PaperTradingPage() {
  const router = useRouter();
  const [deployments, setDeployments] = useState<PaperDeployment[]>([]);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('paper_deployments');
    if (saved) {
      setDeployments(JSON.parse(saved));
    } else {
      setDeployments(mockDeployments as PaperDeployment[]);
      localStorage.setItem('paper_deployments', JSON.stringify(mockDeployments));
    }
  }, []);

  const handlePause = (id: string) => {
    if (confirm("Pause Paper Strategy?\nThe strategy will stop generating simulated new orders until resumed.")) {
      const updated = deployments.map(d => d.id === id ? { ...d, status: 'PAUSED' as const } : d);
      setDeployments(updated);
      localStorage.setItem('paper_deployments', JSON.stringify(updated));
    }
  };

  const handleResume = (id: string) => {
    const updated = deployments.map(d => d.id === id ? { ...d, status: 'RUNNING' as const } : d);
    setDeployments(updated);
    localStorage.setItem('paper_deployments', JSON.stringify(updated));
  };

  const handleStop = (id: string) => {
    if (confirm("Stop Paper Strategy?\nStopping this strategy will end the current paper trading session.")) {
      const updated = deployments.map(d => d.id === id ? { ...d, status: 'STOPPED' as const } : d);
      setDeployments(updated);
      localStorage.setItem('paper_deployments', JSON.stringify(updated));
    }
  };

  const activeStrategies = deployments.filter(d => ['RUNNING', 'PAUSED'].includes(d.status));
  const historyStrategies = deployments.filter(d => d.status === 'STOPPED');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', padding: 'var(--spacing-4) var(--spacing-8)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Paper Trading
            </h1>
            <Badge variant="warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Activity size={12} /> PAPER MODE
            </Badge>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />
            Simulated trading — no real money is used. Test your strategy with virtual capital before going live.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw size={16} style={{ marginRight: '8px' }} /> Refresh
          </Button>
          <Button variant="primary" onClick={() => setIsStartModalOpen(true)}>
            <Plus size={16} style={{ marginRight: '8px' }} /> Start Paper Trading
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
        <KpiCard title="Virtual Capital" value="₹150,000" theme="strategy" />
        <KpiCard title="Available Balance" value="₹133,150" theme="strategy" />
        <KpiCard title="Total P&L" value="+₹4,920" change="+3.4%" changeType="positive" theme="strategy" />
        <KpiCard title="Today's P&L" value="+₹1,240" change="+1.2%" changeType="positive" theme="strategy" />
        <KpiCard title="Open Positions" value="3" theme="strategy" />
        <KpiCard title="Active Strategies" value={activeStrategies.length.toString()} theme="strategy" />
        <KpiCard title="Total Trades" value="40" theme="strategy" />
        <KpiCard title="Win Rate" value="67.8%" theme="strategy" />
      </div>

      {/* Active Strategies */}
      <div>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-4)' }}>Active Paper Strategies</h2>
        
        {activeStrategies.length === 0 ? (
          <Card style={{ padding: 'var(--spacing-12)', textAlign: 'center' }}>
            <Activity size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto var(--spacing-4)' }} />
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>No active paper strategies</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-6)' }}>Start a paper trading session to test your strategy with virtual capital.</p>
            <Button variant="primary" onClick={() => setIsStartModalOpen(true)}>Start Paper Trading</Button>
          </Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-6)' }}>
            {activeStrategies.map(dep => (
              <Card key={dep.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      {dep.strategyName} 
                      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{dep.version}</span>
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
                      <Badge variant={dep.status === 'RUNNING' ? 'success' : 'warning'}>{dep.status}</Badge>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', padding: '2px 6px', backgroundColor: 'var(--color-background)', borderRadius: '4px' }}>
                        {dep.instruments.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Current P&L</div>
                    <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: dep.totalPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {dep.totalPnl >= 0 ? '+' : ''}₹{Math.abs(dep.totalPnl).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Virtual Capital</div>
                    <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>₹{dep.initialCapital.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Open Positions</div>
                    <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{dep.openPositions}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Started At</div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{new Date(dep.startedAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'auto', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)' }}>
                  <Button variant="outline" style={{ flex: 1 }} onClick={() => router.push(`/paper-trading/${dep.id}`)}>
                    View
                  </Button>
                  {dep.status === 'RUNNING' && (
                    <Button variant="outline" style={{ flex: 1, borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }} onClick={() => handlePause(dep.id)}>
                      <Pause size={14} style={{ marginRight: '4px' }} /> Pause
                    </Button>
                  )}
                  {dep.status === 'PAUSED' && (
                    <Button variant="outline" style={{ flex: 1, borderColor: 'var(--color-success)', color: 'var(--color-success)' }} onClick={() => handleResume(dep.id)}>
                      <Play size={14} style={{ marginRight: '4px' }} /> Resume
                    </Button>
                  )}
                  <Button variant="outline" style={{ flex: 1, borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }} onClick={() => handleStop(dep.id)}>
                    <Square size={14} style={{ marginRight: '4px' }} /> Stop
                  </Button>
                </div>
                <div style={{ marginTop: 'var(--spacing-2)' }}>
                  <Button variant="primary" style={{ width: '100%' }} onClick={() => router.push(`/live-trading?strategyId=${dep.strategyId}&version=${dep.version}`)}>
                    Deploy Live
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      {historyStrategies.length > 0 && (
        <div style={{ marginTop: 'var(--spacing-6)' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-4)' }}>Paper Trading History</h2>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
               <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-background)', padding: 'var(--spacing-2)', borderRadius: 'var(--radius-md)' }}>
                 <Search size={16} style={{ color: 'var(--color-text-muted)', marginRight: '8px' }} />
                 <input type="text" placeholder="Search history..." style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }} />
               </div>
               <Button variant="outline" size="sm">
                 <Filter size={14} style={{ marginRight: '6px' }} /> Filters
               </Button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase' }}>
                    <th style={{ padding: 'var(--spacing-3)' }}>Session ID</th>
                    <th style={{ padding: 'var(--spacing-3)' }}>Strategy</th>
                    <th style={{ padding: 'var(--spacing-3)' }}>Start Date</th>
                    <th style={{ padding: 'var(--spacing-3)' }}>Capital</th>
                    <th style={{ padding: 'var(--spacing-3)' }}>Net P&L</th>
                    <th style={{ padding: 'var(--spacing-3)' }}>Win Rate</th>
                    <th style={{ padding: 'var(--spacing-3)' }}>Status</th>
                    <th style={{ padding: 'var(--spacing-3)' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {historyStrategies.map(dep => (
                    <tr key={dep.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{dep.id.toUpperCase()}</td>
                      <td style={{ padding: 'var(--spacing-3)' }}>
                        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{dep.strategyName}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{dep.version}</div>
                      </td>
                      <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--font-size-sm)' }}>{new Date(dep.startedAt).toLocaleDateString()}</td>
                      <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--font-size-sm)' }}>₹{dep.initialCapital.toLocaleString()}</td>
                      <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--font-size-sm)', fontWeight: 700, color: dep.totalPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        {dep.totalPnl >= 0 ? '+' : ''}₹{Math.abs(dep.totalPnl).toLocaleString()}
                      </td>
                      <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--font-size-sm)' }}>{(Math.random() * (70 - 40) + 40).toFixed(1)}%</td>
                      <td style={{ padding: 'var(--spacing-3)' }}>
                        <Badge variant="neutral">{dep.status}</Badge>
                      </td>
                      <td style={{ padding: 'var(--spacing-3)', textAlign: 'right' }}>
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/paper-trading/${dep.id}`)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Modal PlaceHolder */}
      {isStartModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card style={{ width: '500px', maxWidth: '90%', padding: 'var(--spacing-6)' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--spacing-4)' }}>Start Paper Trading</h2>
            <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-warning-bg)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)', display: 'flex', gap: 'var(--spacing-2)' }}>
               <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />
               <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-warning)' }}>Simulated environment. No real money used.</p>
            </div>
            
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>Strategy</label>
              <select style={{ width: '100%', padding: 'var(--spacing-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <option>Moving Average Crossover</option>
              </select>
            </div>
            
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>Virtual Capital</label>
              <input type="number" defaultValue={100000} style={{ width: '100%', padding: 'var(--spacing-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-6)' }}>
              <Button variant="outline" onClick={() => setIsStartModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => {
                const newDep: PaperDeployment = {
                  id: 'pt_' + Math.random().toString(36).substring(2, 9),
                  strategyId: 's3',
                  strategyName: 'Moving Average Crossover',
                  version: 'v1.5',
                  status: 'RUNNING',
                  instruments: ['NIFTY 50', 'BANKNIFTY'],
                  startedAt: new Date().toISOString(),
                  initialCapital: 100000,
                  currentEquity: 100000,
                  availableBalance: 100000,
                  totalPnl: 0,
                  todayPnl: 0,
                  openPositions: 0,
                  totalTrades: 0
                };
                const updated = [newDep, ...deployments];
                setDeployments(updated);
                localStorage.setItem('paper_deployments', JSON.stringify(updated));
                setIsStartModalOpen(false);
                router.push(`/paper-trading/${newDep.id}`);
              }}>Start Simulation</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
