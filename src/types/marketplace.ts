export type RiskLevel = 'low' | 'medium' | 'high';
export type PricingType = 'free' | 'paid';
export type PerformanceType = 'backtest' | 'paper' | 'live';

export interface Creator {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  publishedStrategies?: number;
  subscribers?: number;
  rating?: number;
}

export interface Pricing {
  type: PricingType;
  amount?: number;
  currency?: string;
  period?: string;
}

export interface Performance {
  type: PerformanceType;
  returnPercent: number;
  winRate: number;
  maxDrawdown: number;
  totalTrades: number;
  chartData?: { date: string; value: number }[];
}

export interface MarketplaceStrategy {
  id: string;
  name: string;
  description: string;
  category: string;
  creator: Creator;
  supportedInstruments: string[];
  riskLevel: RiskLevel;
  pricing: Pricing;
  version: string;
  performance: Performance;
  rating: number;
  subscribers: number;
  tags: string[];
  publishedAt: string;
}

export interface MarketplaceFiltersState {
  search: string;
  category: string | 'all';
  riskLevel: RiskLevel | 'all';
  pricing: PricingType | 'all';
  performanceType: PerformanceType | 'all';
  favoritesOnly: boolean;
  sort: string;
}
