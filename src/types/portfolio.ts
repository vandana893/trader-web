export type ExecutionMode = 'PAPER' | 'LIVE_SIMULATION';

export interface PortfolioHolding {
  id: string;
  instrument: string;
  exchange: string;
  positionId: string;
  strategyId: string;
  strategyName: string;
  deploymentId: string;
  side: 'LONG' | 'SHORT';
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  unrealizedPnl: number;
  realizedPnl: number;
  pnlPercentage: number;
  allocationPercentage: number;
  status: 'OPEN' | 'CLOSED';
  brokerAccountId: string;
  brokerAccountName: string;
  executionMode: ExecutionMode;
  openedAt: string;
  lastUpdatedAt: string;
}

export interface PortfolioSummary {
  totalPortfolioValue: number;
  availableFunds: number;
  investedCapital: number;
  todaysPnl: number;
  totalPnl: number;
  unrealizedPnl: number;
  realizedPnl: number;
  pnlPercentage: number;
}

export interface PortfolioPerformancePoint {
  date: string;
  portfolioValue: number;
  investedCapital: number;
  pnl: number;
}

export interface PortfolioActivity {
  id: string;
  type: 'POSITION_OPENED' | 'POSITION_CLOSED' | 'CAPITAL_ALLOCATED' | 'VALUE_UPDATED';
  instrument?: string;
  positionId?: string;
  timestamp: string;
  description: string;
}

export interface PortfolioAccount {
  accountId: string;
  accountName: string;
  brokerName: string;
  availableFunds: number;
  usedMargin: number;
  portfolioValue: number;
  accountStatus: 'CONNECTED' | 'DISCONNECTED';
  executionMode: ExecutionMode;
}

export interface AssetAllocation {
  instrument: string;
  currentValue: number;
  investedValue: number;
  pnl: number;
}

export interface StrategyAllocation {
  strategyId: string;
  strategyName: string;
  currentValue: number;
  investedValue: number;
  pnl: number;
  positionCount: number;
}