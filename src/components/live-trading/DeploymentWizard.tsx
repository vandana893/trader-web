'use client';
import React, { useState } from 'react';
import { Activity, X, CheckCircle, AlertTriangle, Shield, Check, Server, FileText, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LiveDeployment } from '@/types/liveTrading';
import mockBrokers from '@/data/mock/live-trading/brokers.json';
import { useRouter } from 'next/navigation';

interface DeploymentWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (deployment: LiveDeployment) => void;
  initialStrategyId?: string;
  initialVersion?: string;
}

export function DeploymentWizard({ isOpen, onClose, onDeploy, initialStrategyId, initialVersion }: DeploymentWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [strategyId, setStrategyId] = useState(initialStrategyId || 's1');
  const [version, setVersion] = useState(initialVersion || 'v1.2');
  const [brokerId, setBrokerId] = useState('brk_1');
  const [capital, setCapital] = useState(100000);
  const [isDeploying, setIsDeploying] = useState(false);
  const [acceptedRisk, setAcceptedRisk] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => setStep(prev => Math.min(prev + 1, 8));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      const broker = mockBrokers.find(b => b.id === brokerId);
      const newDeployment: LiveDeployment = {
        id: `DEP-2026-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        strategyId,
        strategyName: strategyId === 's1' ? 'Moving Average Crossover' : strategyId === 's2' ? 'RSI Mean Reversion' : 'Options Straddle',
        version,
        brokerId,
        brokerName: broker?.name || 'Unknown',
        accountId: broker?.accountRef || 'Unknown',
        status: 'RUNNING',
        instruments: ['NIFTY 50'],
        startedAt: new Date().toISOString(),
        initialCapital: capital,
        currentEquity: capital,
        availableBalance: capital,
        totalPnl: 0,
        todayPnl: 0,
        openPositions: 0,
        totalTrades: 0
      };
      setIsDeploying(false);
      onDeploy(newDeployment);
    }, 2000);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-4)' }}>
      <Card style={{ width: '650px', maxWidth: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: 'var(--spacing-4) var(--spacing-6)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-surface-tinted)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} style={{ color: 'var(--color-primary)' }} /> Live Deployment Wizard
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--spacing-6)', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--spacing-6)' }}>
            {[1,2,3,4,5,6,7].map(s => (
              <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: step >= s ? 'var(--color-primary)' : 'var(--color-border)' }} />
            ))}
          </div>

          {step === 1 && (
            <div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Step 1: Select Strategy</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {[
                  { id: 's1', name: 'Moving Average Crossover', status: 'Active' },
                  { id: 's2', name: 'RSI Mean Reversion', status: 'Active' },
                  { id: 's3', name: 'Options Straddle', status: 'Draft' }
                ].map(s => (
                  <label key={s.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: 'var(--spacing-4)', border: strategyId === s.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: s.status === 'Draft' ? 'not-allowed' : 'pointer', opacity: s.status === 'Draft' ? 0.6 : 1, backgroundColor: strategyId === s.id ? 'var(--color-info-bg)' : 'transparent' }}>
                    <input type="radio" name="strategy" checked={strategyId === s.id} onChange={() => setStrategyId(s.id)} disabled={s.status === 'Draft'} style={{ marginTop: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.name}</div>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Status: {s.status}</div>
                      {s.status === 'Draft' && <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)', marginTop: '4px' }}>Strategy must be saved and validated before deployment.</div>}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Step 2: Select Version</h3>
              <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-info-bg)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)' }}><strong>Note:</strong> Live deployments use a fixed, immutable strategy version.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {['v1.2', 'v1.1', 'v1.0'].map(v => (
                  <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: 'var(--spacing-3)', border: version === v ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', backgroundColor: version === v ? 'var(--color-info-bg)' : 'transparent' }}>
                    <input type="radio" name="version" checked={version === v} onChange={() => setVersion(v)} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{v}</div>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Created: {new Date().toLocaleDateString()}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Step 3: Select Broker Account</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {mockBrokers.map(b => (
                  <label key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: 'var(--spacing-4)', border: brokerId === b.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: b.status === 'CONNECTED' ? 'pointer' : 'not-allowed', opacity: b.status === 'CONNECTED' ? 1 : 0.6, backgroundColor: brokerId === b.id ? 'var(--color-info-bg)' : 'transparent' }}>
                    <input type="radio" name="broker" checked={brokerId === b.id} onChange={() => setBrokerId(b.id)} disabled={b.status !== 'CONNECTED'} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600 }}>{b.name} ({b.accountRef})</span>
                        <Badge variant={b.status === 'CONNECTED' ? 'success' : 'danger'}>{b.status}</Badge>
                      </div>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Available Capital: ₹{b.availableCapital.toLocaleString()}</div>
                      {b.status !== 'CONNECTED' && <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)', marginTop: '4px' }}>Connect a broker account before deploying this strategy.</div>}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Step 4: Configure Capital</h3>
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 500, marginBottom: 'var(--spacing-2)' }}>Deployment Capital (₹)</label>
                <input type="number" value={capital} onChange={(e) => setCapital(Number(e.target.value))} style={{ width: '100%', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--font-size-base)' }} min="1" max={500000} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-tinted)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Available Broker Capital</div>
                  <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>₹500,000</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Remaining Capital</div>
                  <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: (500000 - capital) < 0 ? 'var(--color-danger)' : 'var(--color-text-primary)' }}>₹{(500000 - capital).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Step 5: Risk Controls</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                <div style={{ backgroundColor: 'var(--color-surface-tinted)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Maximum Loss</div>
                  <div style={{ fontWeight: 600 }}>₹5,000</div>
                </div>
                <div style={{ backgroundColor: 'var(--color-surface-tinted)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Maximum Trades</div>
                  <div style={{ fontWeight: 600 }}>20</div>
                </div>
                <div style={{ backgroundColor: 'var(--color-surface-tinted)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Maximum Quantity</div>
                  <div style={{ fontWeight: 600 }}>100</div>
                </div>
                <div style={{ backgroundColor: 'var(--color-surface-tinted)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Trailing Stop</div>
                  <div style={{ fontWeight: 600 }}>Enabled</div>
                </div>
              </div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-4)' }}>Review these strategy-level risk limits. They will apply to this live deployment.</p>
            </div>
          )}

          {step === 6 && (
            <div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Step 6: Pre-flight Checks</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {[
                  { label: 'Strategy validation passed', status: 'passed' },
                  { label: 'Strategy version verified', status: 'passed' },
                  { label: 'Broker connected', status: 'passed' },
                  { label: 'Account permissions valid', status: 'passed' },
                  { label: 'Market data status', status: 'warning', detail: 'Market data unavailable (Simulated)' },
                  { label: 'Risk configuration valid', status: 'passed' },
                  { label: 'Capital availability', status: 'passed' }
                ].map((check, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-tinted)', borderRadius: 'var(--radius-md)' }}>
                    {check.status === 'passed' ? <CheckCircle size={18} style={{ color: 'var(--color-success)', marginTop: '2px' }} /> : <AlertTriangle size={18} style={{ color: 'var(--color-warning)', marginTop: '2px' }} />}
                    <div>
                      <div style={{ fontWeight: 500 }}>{check.label}</div>
                      {check.detail && <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-warning)', marginTop: '4px' }}>{check.detail}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Step 7: Final Confirmation</h3>
              
              <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-tinted)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-6)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', fontSize: 'var(--font-size-sm)' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-text-secondary)' }}>Strategy</span><span style={{ fontWeight: 600 }}>{strategyId}</span></li>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-text-secondary)' }}>Version</span><span style={{ fontWeight: 600 }}>{version}</span></li>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-text-secondary)' }}>Broker</span><span style={{ fontWeight: 600 }}>Zerodha (ZER-88192)</span></li>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-text-secondary)' }}>Capital</span><span style={{ fontWeight: 600 }}>₹{capital.toLocaleString()}</span></li>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--color-text-secondary)' }}>Deployment Mode</span><span style={{ fontWeight: 600, color: 'var(--color-warning)' }}>Frontend Simulation</span></li>
                </ul>
              </div>

              <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-danger-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)', display: 'flex', gap: 'var(--spacing-3)' }}>
                <Shield size={20} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-danger)', marginBottom: '4px' }}>Live trading involves real financial risk.</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>This is a SIMULATED LIVE DEPLOYMENT. No real orders will be placed.</div>
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={acceptedRisk} onChange={(e) => setAcceptedRisk(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>I have reviewed the strategy, broker account and risk settings.</span>
              </label>
            </div>
          )}

          {step === 8 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-8) 0', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-6)' }}>
                <Server size={32} style={{ color: 'var(--color-primary)' }} className={isDeploying ? 'animate-pulse' : ''} />
              </div>
              <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--spacing-2)' }}>{isDeploying ? 'Deploying Strategy...' : 'Simulation Started'}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', maxWidth: '300px' }}>
                {isDeploying ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} style={{ color: 'var(--color-success)' }} /> Validating strategy...</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} style={{ color: 'var(--color-success)' }} /> Checking broker...</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-primary)', fontWeight: 500 }}><RefreshCw size={14} className="animate-spin" /> Preparing deployment...</div>
                  </>
                ) : (
                  <p>The simulated frontend deployment has been created.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: 'var(--spacing-4) var(--spacing-6)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--color-surface-tinted)' }}>
          {step < 8 && <Button variant="ghost" onClick={handleBack} disabled={step === 1}>Back</Button>}
          {step < 7 && <Button variant="primary" onClick={handleNext} style={{ marginLeft: 'auto' }}>Continue</Button>}
          {step === 7 && <Button variant="primary" onClick={() => { setStep(8); handleDeploy(); }} disabled={!acceptedRisk} style={{ marginLeft: 'auto', backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>Confirm Live Deployment</Button>}
          {step === 8 && !isDeploying && <span style={{ marginLeft: 'auto' }}>Redirecting...</span>}
        </div>
      </Card>
    </div>
  );
}
