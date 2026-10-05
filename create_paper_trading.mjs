import fs from 'fs';
import path from 'path';

const basePath = 'e:/trader-web/src';

const dirs = [
  'data/mock/paper-trading',
  'types',
  'components/paper-trading',
  'app/paper-trading',
  'app/paper-trading/[id]'
];

dirs.forEach(d => {
  fs.mkdirSync(path.join(basePath, d), { recursive: true });
});

// Mock Data
fs.writeFileSync(path.join(basePath, 'data/mock/paper-trading/paper-deployments.json'), JSON.stringify([
  {
    "id": "pt_1",
    "strategyId": "s1",
    "strategyName": "Moving Average Crossover",
    "version": "v1.2",
    "status": "RUNNING",
    "instruments": ["NIFTY 50", "BANKNIFTY"],
    "startedAt": "2026-10-05T09:00:00Z",
    "initialCapital": 100000,
    "currentEquity": 106420,
    "availableBalance": 84650,
    "totalPnl": 6420,
    "todayPnl": 1240,
    "openPositions": 3,
    "totalTrades": 28
  },
  {
    "id": "pt_2",
    "strategyId": "s2",
    "strategyName": "RSI Mean Reversion",
    "version": "v2.0",
    "status": "PAUSED",
    "instruments": ["RELIANCE"],
    "startedAt": "2026-10-04T10:30:00Z",
    "initialCapital": 50000,
    "currentEquity": 48500,
    "availableBalance": 48500,
    "totalPnl": -1500,
    "todayPnl": 0,
    "openPositions": 0,
    "totalTrades": 12
  }
], null, 2));

// types/paperTrading.ts
fs.writeFileSync(path.join(basePath, 'types/paperTrading.ts'), `
export interface PaperDeployment {
  id: string;
  strategyId: string;
  strategyName: string;
  version: string;
  status: 'RUNNING' | 'PAUSED' | 'STOPPED';
  instruments: string[];
  startedAt: string;
  initialCapital: number;
  currentEquity: number;
  availableBalance: number;
  totalPnl: number;
  todayPnl: number;
  openPositions: number;
  totalTrades: number;
}
`);

// components/paper-trading/PaperKpiCard.tsx
fs.writeFileSync(path.join(basePath, 'components/paper-trading/PaperKpiCard.tsx'), `
import React from 'react';

export default function PaperKpiCard({ title, value, subtitle, trend }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
      <span className="text-slate-500 text-sm font-medium">{title}</span>
      <span className="text-2xl font-bold text-slate-800 mt-1">{value}</span>
      {subtitle && <span className="text-xs text-slate-400 mt-1">{subtitle}</span>}
      {trend && (
        <span className={\`text-sm font-medium mt-1 \${trend > 0 ? 'text-green-500' : 'text-red-500'}\`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
  );
}
`);

// app/paper-trading/page.tsx
fs.writeFileSync(path.join(basePath, 'app/paper-trading/page.tsx'), `
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, Square, RefreshCw, Activity, AlertTriangle } from 'lucide-react';
import PaperKpiCard from '../../components/paper-trading/PaperKpiCard';
import mockDeployments from '../../data/mock/paper-trading/paper-deployments.json';
import { PaperDeployment } from '../../types/paperTrading';

export default function PaperTradingPage() {
  const [deployments, setDeployments] = useState<PaperDeployment[]>([]);

  useEffect(() => {
    // Load from local storage or fallback to mock
    const saved = localStorage.getItem('paper_deployments');
    if (saved) {
      setDeployments(JSON.parse(saved));
    } else {
      setDeployments(mockDeployments as PaperDeployment[]);
      localStorage.setItem('paper_deployments', JSON.stringify(mockDeployments));
    }
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-800">Paper Trading</h1>
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1 border border-amber-200">
              <Activity className="w-3 h-3" /> PAPER MODE
            </span>
          </div>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-slate-400" />
            Simulated trading — no real money is used. Test your strategy with virtual capital before going live.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all">
            <Play className="w-4 h-4" /> Start Paper Trading
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PaperKpiCard title="Virtual Capital" value="₹150,000" />
        <PaperKpiCard title="Available Balance" value="₹133,150" />
        <PaperKpiCard title="Total P&L" value="+₹4,920" trend={3.4} />
        <PaperKpiCard title="Active Strategies" value={deployments.filter(d => d.status === 'RUNNING').length.toString()} />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Active Paper Strategies</h2>
        
        {deployments.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
            <Activity className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-semibold text-slate-700">No active paper strategies</h3>
            <p className="text-slate-500 mt-1 max-w-md">Start a paper trading session to test your strategy with virtual capital in real market conditions without any financial risk.</p>
            <button className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Start Paper Trading
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {deployments.map(dep => (
              <div key={dep.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800">{dep.strategyName} <span className="text-xs text-slate-400 font-normal ml-2">{dep.version}</span></h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={\`text-xs px-2 py-0.5 rounded-full font-medium \${
                        dep.status === 'RUNNING' ? 'bg-green-100 text-green-700 border border-green-200' : 
                        dep.status === 'PAUSED' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }\`}>
                        {dep.status}
                      </span>
                      <span className="text-xs text-slate-500">{dep.instruments.join(', ')}</span>
                    </div>
                  </div>
                  <Link href={\`/paper-trading/\${dep.id}\`} className="text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    View
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Current P&L</div>
                    <div className={\`font-semibold \${dep.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}\`}>
                      {dep.totalPnl >= 0 ? '+' : ''}₹{Math.abs(dep.totalPnl).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Virtual Capital</div>
                    <div className="font-semibold text-slate-700">₹{dep.initialCapital.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Open Positions</div>
                    <div className="font-semibold text-slate-700">{dep.openPositions}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Started At</div>
                    <div className="font-semibold text-slate-700 text-sm">{new Date(dep.startedAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                  {dep.status === 'RUNNING' && (
                    <>
                      <button className="px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center gap-1">
                        <Pause className="w-3.5 h-3.5" /> Pause
                      </button>
                      <button className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1">
                        <Square className="w-3.5 h-3.5" /> Stop
                      </button>
                    </>
                  )}
                  {dep.status === 'PAUSED' && (
                    <>
                      <button className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg flex items-center gap-1">
                        <Play className="w-3.5 h-3.5" /> Resume
                      </button>
                      <button className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1">
                        <Square className="w-3.5 h-3.5" /> Stop
                      </button>
                    </>
                  )}
                  {dep.status === 'STOPPED' && (
                    <button className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5" /> Restart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
`);

// app/paper-trading/[id]/page.tsx
fs.writeFileSync(path.join(basePath, 'app/paper-trading/[id]/page.tsx'), `
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Square, Activity, AlertTriangle } from 'lucide-react';
import PaperKpiCard from '../../../components/paper-trading/PaperKpiCard';
import mockDeployments from '../../../data/mock/paper-trading/paper-deployments.json';
import { PaperDeployment } from '../../../types/paperTrading';

export default function PaperTradingDetail({ params }: { params: { id: string } }) {
  const [id, setId] = useState<string | null>(null);
  const [deployment, setDeployment] = useState<PaperDeployment | null>(null);

  useEffect(() => {
    // Unwrap params to get the id correctly according to Next.js rules
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

  if (!deployment) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/paper-trading" className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Paper Trading
        </Link>
      </div>

      <div className="flex justify-between items-start bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-800">{deployment.strategyName}</h1>
            <span className={\`px-2.5 py-0.5 rounded-full text-xs font-bold border \${
              deployment.status === 'RUNNING' ? 'bg-green-100 text-green-700 border-green-200' : 
              deployment.status === 'PAUSED' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
              'bg-slate-100 text-slate-700 border-slate-200'
            }\`}>
              {deployment.status}
            </span>
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border border-amber-200">
              PAPER MODE
            </span>
          </div>
          <div className="text-sm text-slate-500 flex gap-4 mt-2">
            <span>Version: <span className="font-medium text-slate-700">{deployment.version}</span></span>
            <span>Started: <span className="font-medium text-slate-700">{new Date(deployment.startedAt).toLocaleString()}</span></span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {deployment.status === 'RUNNING' && (
            <>
              <button className="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center gap-2 border border-amber-200 transition-colors">
                <Pause className="w-4 h-4" /> Pause
              </button>
              <button className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-2 border border-red-200 transition-colors">
                <Square className="w-4 h-4" /> Stop
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex items-center gap-2 text-sm text-blue-800">
        <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0" />
        <p><strong>Simulated Environment:</strong> All orders shown below are simulated. No real money is being used or at risk.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <PaperKpiCard title="Current Equity" value={\`₹\${deployment.currentEquity.toLocaleString()}\`} />
        <PaperKpiCard title="Total P&L" value={\`\${deployment.totalPnl >= 0 ? '+' : ''}₹\${Math.abs(deployment.totalPnl).toLocaleString()}\`} trend={deployment.totalPnl > 0 ? 5.2 : -2.1} />
        <PaperKpiCard title="Today's P&L" value={\`\${deployment.todayPnl >= 0 ? '+' : ''}₹\${Math.abs(deployment.todayPnl).toLocaleString()}\`} />
        <PaperKpiCard title="Total Trades (Simulated)" value={deployment.totalTrades.toString()} />
      </div>

      {/* Placeholder for Tabs like Open Positions, Orders, Execution History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex gap-6">
          <button className="text-sm font-bold text-blue-600 border-b-2 border-blue-600 pb-4 -mb-4">Open Positions</button>
          <button className="text-sm font-medium text-slate-500 hover:text-slate-800 pb-4 -mb-4">Paper Orders</button>
          <button className="text-sm font-medium text-slate-500 hover:text-slate-800 pb-4 -mb-4">Execution History</button>
          <button className="text-sm font-medium text-slate-500 hover:text-slate-800 pb-4 -mb-4">Risk Panel</button>
        </div>
        <div className="p-6 min-h-[300px] flex items-center justify-center text-slate-400">
          <div className="text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Mock Positions Table Here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
`);

console.log('Files generated successfully.');
