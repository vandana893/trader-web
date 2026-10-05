export type ReportType = 'daily-pnl' | 'monthly-pnl' | 'strategy-performance' | 'execution' | 'subscriptions';

export interface DailyPnlReport {
  id: string;
  date: string;
  openingPortfolioValue: number;
  closingPortfolioValue: number;
  investedCapital: number;
  realizedPnl: number;
  unrealizedPnl: number;
  totalPnl: number;
  pnlPercentage: number;
  numberOfTrades: number;
  winningTrades: number;
  losingTrades: number;
  openPositions: number;
  closedPositions: number;
}

export interface MonthlyPnlReport {
  id: string;
  month: string;
  openingPortfolioValue: number;
  closingPortfolioValue: number;
  investedCapital: number;
  realizedPnl: number;
  unrealizedPnl: number;
  totalPnl: number;
  pnlPercentage: number;
  numberOfTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
}

export interface StrategyPerformanceReport {
  strategyId: string;
  strategyName: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  realizedPnl: number;
  unrealizedPnl: number;
  totalPnl: number;
  pnlPercentage: number;
  averageTradePnl: number;
  openPositions: number;
  closedPositions: number;
  executionMode: 'PAPER' | 'LIVE_SIMULATION';
}

export interface ExecutionReport {
  orderId: string;
  positionId: string;
  strategyId: string;
  strategyName: string;
  deploymentId: string;
  instrument: string;
  side: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT' | 'STOP';
  quantity: number;
  price: number;
  status: 'FILLED' | 'REJECTED' | 'CANCELLED';
  executionMode: 'PAPER' | 'LIVE_SIMULATION';
  brokerAccountId: string;
  submittedAt: string;
  filledAt: string;
  executionResult: string;
}

export interface SubscriptionReport {
  subscriptionId: string;
  strategyId: string;
  strategyName: string;
  subscriberReference: string;
  plan: string;
  paymentReference: string;
  status: 'ACTIVE' | 'PENDING' | 'FAILED' | 'CANCELLED' | 'EXPIRED' | 'REFUNDED' | 'DISPUTED';
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
}
