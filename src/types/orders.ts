export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'STOP_LOSS_MARKET';
export type OrderStatus = 'PENDING' | 'OPEN' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED' | 'REJECTED' | 'FAILED';
export type ExecutionMode = 'PAPER' | 'LIVE_SIMULATION';

export interface OrderEvent {
  status: OrderStatus;
  timestamp: string;
  message?: string;
}

export interface Order {
  id: string;
  strategyId?: string;
  strategyName?: string;
  strategyVersion?: string;
  deploymentId?: string;
  instrument: string;
  exchange: string;
  instrumentType?: string;
  side: OrderSide;
  orderType: OrderType;
  quantity: number;
  price?: number;
  filledQuantity: number;
  averageFillPrice?: number;
  status: OrderStatus;
  brokerAccountId?: string;
  executionMode: ExecutionMode;
  createdAt: string;
  updatedAt: string;
  events: OrderEvent[];
  relatedPositionId?: string;
}
