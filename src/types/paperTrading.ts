
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
