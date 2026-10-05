export type PositionSide = 'LONG' | 'SHORT';
export type PositionStatus = 'OPEN' | 'CLOSED';
export type ExecutionMode = 'PAPER' | 'LIVE_SIMULATION';

export interface PositionEvent {
  type: string;
  timestamp: string;
  price: number;
  quantity: number;
  message?: string;
}

export interface Position {
  id: string;
  strategyId?: string;
  strategyName?: string;
  deploymentId?: string;
  instrument: string;
  side: PositionSide;
  quantity: number;
  averageEntryPrice: number;
  currentPrice: number;
  exitPrice?: number;
  investedValue: number;
  unrealizedPnl: number;
  realizedPnl: number;
  pnlPercentage: number;
  status: PositionStatus;
  brokerAccountId?: string;
  executionMode: ExecutionMode;
  openedAt: string;
  closedAt?: string | null;
  events: PositionEvent[];
  relatedOrderIds: string[];
}
