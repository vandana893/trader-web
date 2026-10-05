export type CreatorTab = 'overview' | 'strategies' | 'subscribers' | 'performance' | 'revenue' | 'support';

export interface CreatorStrategy {
  id: string;
  name: string;
  category: string;
  instruments: string[];
  currentVersion: string;
  status: 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'SUSPENDED';
  pricingModel: 'Monthly' | 'Yearly' | 'One-time' | 'Free';
  price: number;
  currency: string;
  subscribers: number;
  performanceSummary: string;
  lastUpdated: string;
  versions: StrategyVersion[];
}

export interface StrategyVersion {
  version: string;
  createdAt: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  changeSummary: string;
  publishedAt?: string;
  subscriberCount: number;
}

export interface CreatorSubscriber {
  subscriberReference: string;
  strategyId: string;
  strategyName: string;
  assignedVersion: string;
  publishedVersion: string;
  subscriptionStatus: 'ACTIVE' | 'PENDING' | 'CANCELLED' | 'EXPIRED' | 'REFUNDED' | 'DISPUTED';
  accessStatus: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  startDate: string;
  endDate: string;
  plan: string;
  amount: number;
  currency: string;
}

export interface CreatorPerformance {
  strategyId: string;
  strategyName: string;
  version: string;
  performanceType: 'BACKTEST' | 'PAPER' | 'LIVE_SIMULATION';
  totalPnl: number;
  pnlPercentage: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  averageTrade: number;
  maxDrawdown: number;
  dateRange: string;
}

export interface CreatorRevenue {
  paymentReference: string;
  subscriptionId: string;
  subscriberReference: string;
  strategyId: string;
  strategyName: string;
  plan: string;
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'REFUNDED' | 'FAILED' | 'PENDING';
  date: string;
}

export interface SupportTicket {
  ticketId: string;
  subject: string;
  strategyId: string;
  strategyName: string;
  subscriberReference: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  lastUpdatedAt: string;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  sender: 'SUBSCRIBER' | 'CREATOR' | 'SYSTEM';
  content: string;
  timestamp: string;
}
