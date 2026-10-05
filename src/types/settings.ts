export type SettingsTab = 'profile' | 'brokers' | 'security' | 'notifications' | 'billing' | 'legal';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  joinedDate: string;
}

export interface BrokerAccount {
  id: string;
  brokerCode: string; // e.g. UPSTOX, ZERODHA
  brokerName: string;
  accountRef: string;
  status: 'ACTIVE' | 'EXPIRED' | 'ERROR' | 'DISCONNECTED';
  lastSyncAt: string;
}

export interface NotificationPreferences {
  orderExecuted: { push: boolean; email: boolean; sms: boolean };
  orderRejected: { push: boolean; email: boolean; sms: boolean };
  riskBreach: { push: boolean; email: boolean; sms: boolean };
  promotional: { push: boolean; email: boolean; sms: boolean };
}

export interface BillingInfo {
  activePlan: string;
  nextBillingDate: string;
  paymentMethod: string;
  invoices: Invoice[];
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'PAID' | 'PENDING' | 'FAILED';
  downloadUrl: string;
}
