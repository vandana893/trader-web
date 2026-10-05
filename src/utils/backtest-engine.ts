import { BacktestConfig, BacktestResult, BacktestPerformance, BacktestTrade, BacktestChartDataPoint } from '@/types/backtesting';
import mockData from '@/data/mock/backtesting.json';

export function generateMockBacktest(config: BacktestConfig, strategyName: string): BacktestResult {
  const isProfitable = Math.random() > 0.3; // 70% chance of profitable simulation for demo
  const multiplier = isProfitable ? 1 : -0.5;
  
  const baseReturn = 15000 * multiplier + (Math.random() * 10000);
  const netPnl = Math.round(baseReturn);
  const grossPnl = Math.round(netPnl + 2500); // 2500 in fees
  const totalTrades = Math.floor(Math.random() * 200) + 50;
  const winRate = isProfitable ? (Math.random() * 20 + 55) : (Math.random() * 15 + 35);
  
  const winningTrades = Math.floor((winRate / 100) * totalTrades);
  const losingTrades = totalTrades - winningTrades;
  
  const maxDrawdown = parseFloat((Math.random() * 15 + 2).toFixed(1));
  const profitFactor = isProfitable ? parseFloat((Math.random() * 1.5 + 1.2).toFixed(2)) : parseFloat((Math.random() * 0.5 + 0.4).toFixed(2));
  
  const averageTrade = netPnl / totalTrades;
  const averageWin = (grossPnl * 1.5) / winningTrades; // Rough math for mock
  const averageLoss = (grossPnl * 0.5 - netPnl) / (losingTrades || 1); // Avoid div by zero

  const performance: BacktestPerformance = {
    netPnl,
    grossPnl,
    winRate: parseFloat(winRate.toFixed(1)),
    totalTrades,
    winningTrades,
    losingTrades,
    maxDrawdown,
    profitFactor,
    averageTrade: Math.round(averageTrade),
    averageWin: Math.round(averageWin),
    averageLoss: Math.abs(Math.round(averageLoss)),
    totalExposure: config.startingCapital * 2.5 // Mock exposure
  };

  // Generate chart data based on start and end dates loosely
  // In a real app we'd map trades over time. Here we just take the mock data and scale it.
  const chartData: BacktestChartDataPoint[] = mockData.sampleChartData.map((d: any, i: number) => {
    const scale = netPnl / 24580; // 24580 is the final PnL of the mock data
    return {
      date: d.date,
      portfolioValue: config.startingCapital + (d.pnl * scale),
      pnl: Math.round(d.pnl * scale),
      drawdown: d.drawdown * (isProfitable ? 1 : 2) // Worse drawdown if unprofitable
    };
  });

  // Just return the sample trades for the table, mapping strategy version and instruments
  const trades: BacktestTrade[] = mockData.sampleTrades.map((t: any) => ({
    ...t,
    instrument: config.instruments[Math.floor(Math.random() * config.instruments.length)] || 'NIFTY',
    strategyVersion: config.version
  }));

  return {
    id: `bt-${Date.now()}`,
    config,
    status: 'Completed',
    runDate: new Date().toISOString(),
    performance,
    chartData,
    trades
  };
}
