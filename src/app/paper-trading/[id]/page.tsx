'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Square, Activity, AlertTriangle, RefreshCw, BarChart2, Briefcase, FileText, History, ShieldAlert } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import mockDeployments from '@/data/mock/paper-trading/paper-deployments.json';
import { PaperDeployment } from '@/types/paperTrading';
import { useRouter } from 'next/navigation';

const MOCK_POSITIONS = [
  { id: 'pos_1', instrument: 'NIFTY 50', side: 'BUY', qty: 50, avgPrice: 22400, currentPrice: 22520, invested: 1120000, unrealizedPnl: 6000, pnlPercent: 0.53, openedAt: '10:32 AM' },
  { id: 'pos_2', instrument: 'BANKNIFTY', side: 'SELL', qty: 15, avgPrice: 47800, currentPrice: 47750, invested: 717000, unrealizedPnl: 750, pnlPercent: 0.10, openedAt: '11:15 AM' }
];

const MOCK_ORDERS = [
  { id: 'ORD-9821', time: '11:15 AM', instrument: 'BANKNIFTY', side: 'SELL', type: 'MARKET', qty: 15, price: 47800, status: 'Filled (Simulated)', executionType: 'Paper' },
  { id: 'ORD-9820', time: '10:32 AM', instrument: 'NIFTY 50', side: 'BUY', type: 'LIMIT', qty: 50, price: 22400, status: 'Filled (Simulated)', executionType: 'Paper' },
  { id: 'ORD-9819', time: '09:15 AM', instrument: 'RELIANCE', side: 'BUY', type: 'MARKET', qty: 100, price: 2950, status: 'Cancelled', executionType: 'Paper' }
];

const MOCK_EVENTS = [
  { time: '11:15 AM', event: 'Simulated order filled', instrument: 'BANKNIFTY', result: 'SELL 15 @ 47800' },
  { time: '11:15 AM', event: 'Simulated order created', instrument: 'BANKNIFTY', result: 'SELL 15 MARKET' },
  { time: '11:15 AM', event: 'SELL signal generated', instrument: 'BANKNIFTY', result: 'RSI Overbought' },
  { time: '10:32 AM', event: 'Simulated order filled', instrument: 'NIFTY 50', result: 'BUY 50 @ 22400' },
  { time: '10:32 AM', event: 'Simulated order created', instrument: 'NIFTY 50', result: 'BUY 50 LIMIT 22400' },
  { time: '10:32 AM', event: 'BUY signal generated', instrument: 'NIFTY 50', result: 'MACD Crossover' },
  { time: '09:00 AM', event: 'Paper simulation started', instrument: 'System', result: 'Virtual Capital: ₹100,000' }
];

export default function PaperTradingDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [deployment, setDeployment] = useState<PaperDeployment | null>(null);
  const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'history' | 'risk'>('positions');

  useEffect(() => {
    Promise.resolve(params).then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem('paper_deployments');
      let deps = mockDeployments as PaperDeployment[];
      if (saved) {
        deps = JSON.parse(saved);
      }
      const found = deps.find(d => d.id === id);
      if (found) {
        setDeployment(found);
      }
    }
  }, [id]);

  const updateStatus = (newStatus: 'RUNNING' | 'PAUSED' | 'STOPPED') => {
    if (!deployment) return;
    const updated = { ...deployment, status: newStatus };
    setDeployment(updated);
    
    const saved = localStorage.getItem('paper_deployments');
    if (saved) {
      const deps = JSON.parse(saved) as PaperDeployment[];
      const idx = deps.findIndex(d => d.id === deployment.id);
      if (idx !== -1) {
        deps[idx] = updated;
        localStorage.setItem('paper_deployments', JSON.stringify(deps));
      }
    }
  };

  if (!deployment) return (
    <div style={{ padding: 'var(--spacing-12)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
      Loading paper trading session...
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', padding: 'var(--spacing-4) var(--spacing-8)' }}>
      <Button variant="ghost" onClick={() => router.push('/paper-trading')} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
        <ArrowLeft size={16} /> Back to Paper Trading
      </Button>

      {/* Header Card */}
      <Card style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-6)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{deployment.strategyName}</h1>
            <Badge variant={deployment.status === 'RUNNING' ? 'success' : deployment.status === 'PAUSED' ? 'warning' : 'neutral'}>
              {deployment.status}
            </Badge>
            <Badge variant="warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Activity size={12} /> PAPER MODE
            </Badge>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            <span><strong>Version:</strong> {deployment.version}</span>
            <span><strong>Started:</strong> {new Date(deployment.startedAt).toLocaleString()}</span>
            <span><strong>Instruments:</strong> {deployment.instruments.join(', ')}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          {deployment.status === 'RUNNING' && (
            <>
              <Button variant="outline" style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }} onClick={() => {
                if(confirm("Pause Paper Strategy?\nThe strategy will stop generating simulated new orders until resumed.")) updateStatus('PAUSED');
              }}>
                <Pause size={16} style={{ marginRight: '8px' }} /> Pause
              </Button>
              <Button variant="outline" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }} onClick={() => {
                if(confirm("Stop Paper Strategy?\nStopping this strategy will end the current paper trading session.")) updateStatus('STOPPED');
              }}>
                <Square size={16} style={{ marginRight: '8px' }} /> Stop
              </Button>
            </>
          )}
          {deployment.status === 'PAUSED' && (
            <>
              <Button variant="outline" style={{ borderColor: 'var(--color-success)', color: 'var(--color-success)' }} onClick={() => updateStatus('RUNNING')}>
                <Play size={16} style={{ marginRight: '8px' }} /> Resume
              </Button>
              <Button variant="outline" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }} onClick={() => {
                if(confirm("Stop Paper Strategy?\nStopping this strategy will end the current paper trading session.")) updateStatus('STOPPED');
              }}>
                <Square size={16} style={{ marginRight: '8px' }} /> Stop
              </Button>
            </>
          )}
          {deployment.status === 'STOPPED' && (
            <Button variant="outline" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
              <RefreshCw size={16} style={{ marginRight: '8px' }} /> Restart
            </Button>
          )}
          <Button variant="primary" onClick={() => router.push(`/live-trading?strategyId=${deployment.strategyId}&version=${deployment.version}`)}>
            Deploy Live
          </Button>
        </div>
      </Card>

      <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-info-bg)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
        <AlertTriangle size={18} style={{ color: 'var(--color-info)' }} />
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
          <strong>Simulated Environment:</strong> All orders, positions, and history shown below are completely simulated. No real money is being used or at risk.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
        <KpiCard title="Initial Capital" value={`₹${deployment.initialCapital.toLocaleString()}`} theme="strategy" />
        <KpiCard title="Current Equity" value={`₹${deployment.currentEquity.toLocaleString()}`} theme="strategy" />
        <KpiCard title="Total P&L" value={`${deployment.totalPnl >= 0 ? '+' : ''}₹${Math.abs(deployment.totalPnl).toLocaleString()}`} changeType={deployment.totalPnl >= 0 ? 'positive' : 'negative'} theme="strategy" />
        <KpiCard title="Today's P&L" value={`${deployment.todayPnl >= 0 ? '+' : ''}₹${Math.abs(deployment.todayPnl).toLocaleString()}`} theme="strategy" />
        <KpiCard title="Total Trades" value={deployment.totalTrades} theme="strategy" />
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-tinted)' }}>
          {[
            { id: 'positions', label: 'Open Positions', icon: Briefcase },
            { id: 'orders', label: 'Paper Orders', icon: FileText },
            { id: 'history', label: 'Execution History', icon: History },
            { id: 'risk', label: 'Risk Panel', icon: ShieldAlert }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: 'var(--spacing-4) var(--spacing-6)',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: activeTab === tab.id ? 600 : 500,
                fontSize: 'var(--font-size-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '0' }}>
          {activeTab === 'positions' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase' }}>
                    <th style={{ padding: 'var(--spacing-4)' }}>Instrument</th>
                    <th style={{ padding: 'var(--spacing-4)' }}>Side</th>
                    <th style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>Quantity</th>
                    <th style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>Avg Price</th>
                    <th style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>LTP</th>
                    <th style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>Unrealized P&L</th>
                    <th style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>Opened At</th>
                  </tr>
                </thead>
                <tbody>
                  {deployment.status === 'STOPPED' ? (
                    <tr>
                      <td colSpan={7} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                        No open positions. Session is stopped.
                      </td>
                    </tr>
                  ) : MOCK_POSITIONS.map(pos => (
                    <tr key={pos.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{pos.instrument}</td>
                      <td style={{ padding: 'var(--spacing-4)' }}>
                        <Badge variant={pos.side === 'BUY' ? 'info' : 'danger'}>{pos.side}</Badge>
                      </td>
                      <td style={{ padding: 'var(--spacing-4)', textAlign: 'right', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{pos.qty}</td>
                      <td style={{ padding: 'var(--spacing-4)', textAlign: 'right', fontSize: 'var(--font-size-sm)' }}>₹{pos.avgPrice.toLocaleString()}</td>
                      <td style={{ padding: 'var(--spacing-4)', textAlign: 'right', fontSize: 'var(--font-size-sm)' }}>₹{pos.currentPrice.toLocaleString()}</td>
                      <td style={{ padding: 'var(--spacing-4)', textAlign: 'right', fontSize: 'var(--font-size-sm)', fontWeight: 700, color: pos.unrealizedPnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        {pos.unrealizedPnl >= 0 ? '+' : ''}₹{pos.unrealizedPnl.toLocaleString()}
                        <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 400, color: 'var(--color-text-secondary)' }}>{pos.pnlPercent}%</div>
                      </td>
                      <td style={{ padding: 'var(--spacing-4)', textAlign: 'right', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{pos.openedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'orders' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase' }}>
                    <th style={{ padding: 'var(--spacing-4)' }}>Time</th>
                    <th style={{ padding: 'var(--spacing-4)' }}>Order ID</th>
                    <th style={{ padding: 'var(--spacing-4)' }}>Instrument</th>
                    <th style={{ padding: 'var(--spacing-4)' }}>Side / Type</th>
                    <th style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>Qty</th>
                    <th style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>Price</th>
                    <th style={{ padding: 'var(--spacing-4)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ORDERS.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{order.time}</td>
                      <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{order.id}</td>
                      <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{order.instrument}</td>
                      <td style={{ padding: 'var(--spacing-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: order.side === 'BUY' ? 'var(--color-info)' : 'var(--color-danger)' }}>{order.side}</span>
                          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>|</span>
                          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 500 }}>{order.type}</span>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--spacing-4)', textAlign: 'right', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{order.qty}</td>
                      <td style={{ padding: 'var(--spacing-4)', textAlign: 'right', fontSize: 'var(--font-size-sm)' }}>₹{order.price.toLocaleString()}</td>
                      <td style={{ padding: 'var(--spacing-4)' }}>
                        <Badge variant={order.status.includes('Filled') ? 'success' : 'neutral'}>{order.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'history' && (
            <div style={{ padding: 'var(--spacing-6)' }}>
              <div style={{ position: 'relative', borderLeft: '2px solid var(--color-border)', marginLeft: '16px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                {MOCK_EVENTS.map((event, i) => (
                  <div key={i} style={{ position: 'relative', paddingLeft: '24px' }}>
                    <div style={{ position: 'absolute', width: '12px', height: '12px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', left: '-7px', top: '4px', border: '2px solid var(--color-surface)' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '4px' }}>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-text-secondary)', width: '80px' }}>{event.time}</span>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{event.event}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{event.instrument}</span>
                      <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                      <span style={{ backgroundColor: 'var(--color-surface-tinted)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}>{event.result}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'risk' && (
            <div style={{ padding: 'var(--spacing-6)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-8)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Risk Limits (Simulated)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Maximum Loss</span>
                      <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>₹2,400 / ₹5,000</span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: 'var(--color-border)', borderRadius: '999px', height: '8px' }}>
                      <div style={{ backgroundColor: 'var(--color-primary)', height: '8px', borderRadius: '999px', width: '48%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Maximum Trades</span>
                      <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>28 / 50</span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: 'var(--color-border)', borderRadius: '999px', height: '8px' }}>
                      <div style={{ backgroundColor: 'var(--color-warning)', height: '8px', borderRadius: '999px', width: '56%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Maximum Quantity (per trade)</span>
                      <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>100 / 200</span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: 'var(--color-border)', borderRadius: '999px', height: '8px' }}>
                      <div style={{ backgroundColor: 'var(--color-success)', height: '8px', borderRadius: '999px', width: '50%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ backgroundColor: 'var(--color-surface-tinted)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Strategy Settings</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', fontSize: 'var(--font-size-sm)' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed var(--color-border)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Stop Loss</span>
                    <span style={{ fontWeight: 600 }}>2.5%</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed var(--color-border)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Target</span>
                    <span style={{ fontWeight: 600 }}>5.0%</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed var(--color-border)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Trailing Stop</span>
                    <span style={{ fontWeight: 600 }}>Active (1%)</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed var(--color-border)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Time-based Exit</span>
                    <span style={{ fontWeight: 600 }}>15:15 IST</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
