import React, { useState } from 'react';
import { BacktestConfig } from '@/types/backtesting';
import { Strategy } from '@/types/strategy';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Play, Loader2, Info } from 'lucide-react';

interface BacktestConfigPanelProps {
  config: BacktestConfig;
  setConfig: React.Dispatch<React.SetStateAction<BacktestConfig>>;
  strategies: Strategy[];
  isSimulating: boolean;
  simulationStep: string;
  onRun: () => void;
}

export function BacktestConfigPanel({
  config,
  setConfig,
  strategies,
  isSimulating,
  simulationStep,
  onRun
}: BacktestConfigPanelProps) {
  const [error, setError] = useState<string | null>(null);

  const selectedStrategy = strategies.find(s => s.id === config.strategyId);
  const availableInstruments = ["NIFTY 50", "BANK NIFTY", "FINNIFTY", "RELIANCE", "TCS", "HDFCBANK", "INFY", "ITC"];

  const handleRun = () => {
    setError(null);
    if (!config.strategyId) {
      setError('Strategy is required.');
      return;
    }
    if (config.instruments.length === 0) {
      setError('At least one instrument is required.');
      return;
    }
    if (!config.startDate || !config.endDate) {
      setError('Start date and End date are required.');
      return;
    }
    if (new Date(config.endDate) < new Date(config.startDate)) {
      setError('End date cannot be before start date.');
      return;
    }
    if (config.startingCapital <= 0) {
      setError('Starting capital must be greater than 0.');
      return;
    }
    onRun();
  };

  const handleInstrumentToggle = (inst: string) => {
    setConfig(prev => {
      const exists = prev.instruments.includes(inst);
      if (exists) {
        return { ...prev, instruments: prev.instruments.filter(i => i !== inst) };
      }
      return { ...prev, instruments: [...prev.instruments, inst] };
    });
  };

  return (
    <Card tinted>
      <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--spacing-6)' }}>Configuration</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        {/* Strategy Select */}
        <div>
          <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Strategy</label>
          <Select 
            value={config.strategyId}
            onChange={(val) => setConfig(prev => ({ ...prev, strategyId: val }))}
            options={[
              { label: 'Select Strategy', value: '' },
              ...strategies.map(s => ({ label: s.name, value: s.id }))
            ]}
          />
          {selectedStrategy && (
            <div style={{ marginTop: 'var(--spacing-3)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--font-size-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-1)' }}>
                <span style={{ fontWeight: 600 }}>{selectedStrategy.name}</span>
                <Badge variant="primary">{selectedStrategy.status}</Badge>
              </div>
              <div style={{ color: 'var(--color-text-secondary)' }}>{selectedStrategy.description}</div>
              <div style={{ marginTop: 'var(--spacing-2)' }}>Version: {config.version}</div>
            </div>
          )}
        </div>

        {/* Instruments */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
            <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Instrument Universe</label>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{config.instruments.length} selected</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            {availableInstruments.map(inst => {
              const isSelected = config.instruments.includes(inst);
              return (
                <button
                  key={inst}
                  onClick={() => handleInstrumentToggle(inst)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: isSelected ? 'var(--color-primary-light)' : 'transparent',
                    color: isSelected ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)'
                  }}
                >
                  {inst}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Range */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Start Date</label>
            <Input type="date" value={config.startDate} onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>End Date</label>
            <Input type="date" value={config.endDate} onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))} />
          </div>
        </div>

        {/* Capital & Position */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Starting Capital (₹)</label>
            <Input type="number" value={config.startingCapital.toString()} onChange={(e) => setConfig(prev => ({ ...prev, startingCapital: Number(e.target.value) }))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Position Sizing</label>
            <Select 
              value={config.positionSizing}
              onChange={(val) => setConfig(prev => ({ ...prev, positionSizing: val as any }))}
              options={[
                { label: 'Fixed Capital', value: 'fixed_capital' },
                { label: 'Fixed Quantity', value: 'fixed_qty' },
                { label: '% of Capital', value: 'percent_capital' },
                { label: 'Risk Based', value: 'risk_based' }
              ]}
            />
          </div>
        </div>

        {/* Fees & Slippage */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Brokerage & Fees</label>
            <Select 
              value={config.feeModel}
              onChange={(val) => setConfig(prev => ({ ...prev, feeModel: val as any }))}
              options={[
                { label: 'Default Assumptions', value: 'default' },
                { label: 'Custom (0.03%)', value: 'custom' }
              ]}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Slippage</label>
            <Select 
              value={config.slippageModel}
              onChange={(val) => setConfig(prev => ({ ...prev, slippageModel: val as any }))}
              options={[
                { label: 'No Slippage', value: 'none' },
                { label: 'Low (0.05%)', value: 'low' },
                { label: 'Medium (0.1%)', value: 'medium' },
                { label: 'High (0.2%)', value: 'high' },
                { label: 'Custom', value: 'custom' }
              ]}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'var(--spacing-8)' }}>
        {error && (
          <div style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-4)', padding: 'var(--spacing-3)', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}
        <Button 
          variant="primary" 
          size="lg" 
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--spacing-2)' }}
          onClick={handleRun}
          disabled={isSimulating}
        >
          {isSimulating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              {simulationStep}
            </>
          ) : (
            <>
              <Play size={20} fill="currentColor" />
              Run Backtest
            </>
          )}
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-3)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', justifyContent: 'center' }}>
          <Info size={14} /> This is a historical simulation. Results do not guarantee future returns.
        </div>
      </div>
    </Card>
  );
}
