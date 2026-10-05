export interface BacktestConfig {
  strategyId: string;
  version: string;
  instruments: string[];
  startDate: string;
  endDate: string;
  startingCapital: number;
  feeModel: 'default' | 'custom';
  slippageModel: 'none' | 'low' | 'medium' | 'high' | 'custom';
  positionSizing: 'fixed_qty' | 'fixed_capital' | 'percent_capital' | 'risk_based';
}

export interface BacktestTrade {
  id: string;
  tradeNumber: number;
  entryTime: string;
  exitTime: string;
  instrument: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  grossPnl: number;
  fees: number;
  netPnl: number;
  exitReason: 'Target Hit' | 'Stop Loss' | 'Time Exit' | 'Signal Exit' | 'Risk Exit';
  strategyVersion: string;
}

export interface BacktestPerformance {
  netPnl: number;
  grossPnl: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  maxDrawdown: number;
  profitFactor: number;
  averageTrade: number;
  averageWin: number;
  averageLoss: number;
  totalExposure: number;
}

export interface BacktestChartDataPoint {
  date: string;
  portfolioValue: number;
  pnl: number;
  drawdown: number;
}

export interface BacktestResult {
  id: string;
  config: BacktestConfig;
  status: 'Completed' | 'Running' | 'Failed';
  runDate: string;
  performance?: BacktestPerformance;
  chartData?: BacktestChartDataPoint[];
  trades?: BacktestTrade[];
}
