'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Strategy } from '@/types/strategy';
import mockDataStrategies from '@/data/mock/strategies.json';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { BacktestConfig, BacktestResult } from '@/types/backtesting';
import { generateMockBacktest } from '@/utils/backtest-engine'; // We'll create this util
import { Play, History, Loader2, Info } from 'lucide-react';

import { BacktestConfigPanel } from '@/components/backtesting/BacktestConfigPanel';
import { BacktestHistory } from '@/components/backtesting/BacktestHistory';

export default function BacktestingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStrategyId = searchParams.get('strategyId') || '';

  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [history, setHistory] = useState<BacktestResult[]>([]);

  useEffect(() => {
    // Load strategies
    const savedStrats = localStorage.getItem('my-strategies-list');
    if (savedStrats) {
      setStrategies(JSON.parse(savedStrats));
    } else {
      setStrategies(mockDataStrategies.strategies as Strategy[]);
    }
    
    // Load history
    const savedHistory = localStorage.getItem('backtest-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const [config, setConfig] = useState<BacktestConfig>({
    strategyId: initialStrategyId,
    version: 'v1.0',
    instruments: [],
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    startingCapital: 100000,
    feeModel: 'default',
    slippageModel: 'medium',
    positionSizing: 'fixed_capital'
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState('');
  const selectedStrategy = strategies.find(s => s.id === config.strategyId);

  const handleRunBacktest = async () => {
    setIsSimulating(true);
    
    // Simulate steps
    setSimulationStep('Preparing historical data...');
    await new Promise(r => setTimeout(r, 600));
    setSimulationStep('Running strategy simulation...');
    await new Promise(r => setTimeout(r, 800));
    setSimulationStep('Calculating performance...');
    await new Promise(r => setTimeout(r, 600));
    setSimulationStep('Generating trade report...');
    await new Promise(r => setTimeout(r, 400));
    
    // Generate mock result
    const result = generateMockBacktest(config, selectedStrategy?.name || 'Strategy');
    
    // Save to history
    const newHistory = [result, ...history];
    setHistory(newHistory);
    localStorage.setItem('backtest-history', JSON.stringify(newHistory));
    
    setIsSimulating(false);
    
    // Navigate to results
    router.push(`/backtesting/${result.id}`);
  };

  return (
    <div style={{ padding: 'var(--spacing-4) var(--spacing-8)', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>
          Backtesting Engine
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)' }}>
          Configure and run historical simulations for your trading strategies.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-8)', alignItems: 'start' }}>
        
        {/* Left Column: Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <BacktestConfigPanel 
            config={config} 
            setConfig={setConfig} 
            strategies={strategies} 
            isSimulating={isSimulating}
            simulationStep={simulationStep}
            onRun={handleRunBacktest}
          />
        </div>

        {/* Right Column: History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <BacktestHistory history={history} strategies={strategies} />
        </div>

      </div>
    </div>
  );
}
