export type LiveDeploymentStatus = 'RUNNING' | 'PAUSED' | 'STOPPED' | 'ERROR' | 'STARTING' | 'STOPPING';
export type BrokerConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'EXPIRED' | 'ERROR';

export interface BrokerAccount {
  id: string;
  name: string;
  accountRef: string;
  status: BrokerConnectionStatus;
  lastSynced: string;
  availableCapital: number;
  permissions: string[];
}

export interface LiveDeployment {
  id: string;
  strategyId: string;
  strategyName: string;
  version: string;
  brokerId: string;
  brokerName: string;
  accountId: string;
  status: LiveDeploymentStatus;
  instruments: string[];
  startedAt: string;
  endedAt?: string;
  initialCapital: number;
  currentEquity: number;
  availableBalance: number;
  totalPnl: number;
  todayPnl: number;
  openPositions: number;
  totalTrades: number;
}

export interface LiveOrder {
  id: string;
  deploymentId: string;
  time: string;
  instrument: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP';
  qty: number;
  requestedPrice?: number;
  executionPrice?: number;
  status: 'Pending' | 'Submitted' | 'Filled' | 'Rejected' | 'Cancelled' | 'Partially Filled';
  executionMode: string;
}

export interface LivePosition {
  id: string;
  deploymentId: string;
  instrument: string;
  side: 'BUY' | 'SELL';
  qty: number;
  avgPrice: number;
  currentPrice: number;
  invested: number;
  unrealizedPnl: number;
  pnlPercent: number;
  openedAt: string;
}

export interface ExecutionEvent {
  id: string;
  deploymentId: string;
  timestamp: string;
  event: string;
  instrument: string;
  description: string;
  status: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
}
