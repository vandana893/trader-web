export type StrategyStatus = 'draft' | 'running' | 'paused' | 'stopped';
export type StrategyMode = 'paper' | 'live';

export interface Strategy {
  id: string;
  name: string;
  description: string;
  category: string;
  status: StrategyStatus;
  mode: StrategyMode;
  version: string;
  instruments: string[];
  pnl: number;
  pnlPercent: number;
  winRate: number;
  totalTrades: number;
  lastUpdated: string;
  createdAt: string;
}