export type NotificationType = 'ORDER_EXECUTED' | 'ORDER_REJECTED' | 'SL_TARGET_HIT' | 'BROKER_DISCONNECTED' | 'STRATEGY_STOPPED' | 'RISK_BREACH' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILURE' | 'SYSTEM_ALERT';
export type NotificationCategory = 'ORDERS' | 'RISK' | 'SYSTEM' | 'PAYMENTS' | 'STRATEGY';
export type NotificationStatus = 'UNREAD' | 'READ';

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  status: NotificationStatus;
  actionUrl?: string;
  metadata?: {
    orderId?: string;
    strategyId?: string;
    brokerId?: string;
  };
}
