'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Bell, CheckCircle, AlertTriangle, AlertCircle, Info, ExternalLink, X, DollarSign, Activity, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

import notificationsDataRaw from '@/data/mock/notifications.json';
import { Notification, NotificationCategory, NotificationType } from '@/types/notifications';

const initialNotifications = notificationsDataRaw as Notification[];

function getIconForType(type: NotificationType) {
  switch (type) {
    case 'ORDER_EXECUTED':
    case 'PAYMENT_SUCCESS':
      return <CheckCircle size={20} color="var(--color-success)" />;
    case 'ORDER_REJECTED':
    case 'RISK_BREACH':
    case 'BROKER_DISCONNECTED':
    case 'PAYMENT_FAILURE':
      return <AlertCircle size={20} color="var(--color-danger)" />;
    case 'STRATEGY_STOPPED':
      return <AlertTriangle size={20} color="var(--color-warning)" />;
    case 'SL_TARGET_HIT':
      return <Activity size={20} color="var(--color-primary)" />;
    case 'SYSTEM_ALERT':
    default:
      return <Info size={20} color="var(--color-primary)" />;
  }
}

function NotificationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = (searchParams?.get('category') as NotificationCategory | 'ALL') || 'ALL';

  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const handleCategoryChange = (cat: string) => {
    router.push(`/notifications?category=${cat}`);
  };

  const filteredNotifications = useMemo(() => {
    if (activeCategory === 'ALL') return notifications;
    return notifications.filter(n => n.category === activeCategory);
  }, [notifications, activeCategory]);

  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'READ' })));
    alert('FRONTEND SIMULATION: All notifications marked as read.');
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'READ' } : n));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', padding: 'var(--spacing-4) var(--spacing-8)', height: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Notifications</h1>
            {unreadCount > 0 && <Badge variant="danger" style={{ fontSize: 'var(--font-size-xs)' }}>{unreadCount} Unread</Badge>}
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
            Stay updated with your orders, risk alerts, and system announcements.
          </p>
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle size={16} style={{ marginRight: '8px' }} /> Mark all as read
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-8)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Sidebar Filters */}
        <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--spacing-2)' }}>Categories</h3>
          
          <FilterButton active={activeCategory === 'ALL'} onClick={() => handleCategoryChange('ALL')} icon={<Bell size={16} />} label="All Notifications" count={notifications.length} />
          <FilterButton active={activeCategory === 'ORDERS'} onClick={() => handleCategoryChange('ORDERS')} icon={<FileText size={16} />} label="Orders" count={notifications.filter(n=>n.category==='ORDERS').length} />
          <FilterButton active={activeCategory === 'RISK'} onClick={() => handleCategoryChange('RISK')} icon={<AlertTriangle size={16} />} label="Risk Alerts" count={notifications.filter(n=>n.category==='RISK').length} />
          <FilterButton active={activeCategory === 'STRATEGY'} onClick={() => handleCategoryChange('STRATEGY')} icon={<Activity size={16} />} label="Strategies" count={notifications.filter(n=>n.category==='STRATEGY').length} />
          <FilterButton active={activeCategory === 'SYSTEM'} onClick={() => handleCategoryChange('SYSTEM')} icon={<Info size={16} />} label="System" count={notifications.filter(n=>n.category==='SYSTEM').length} />
          <FilterButton active={activeCategory === 'PAYMENTS'} onClick={() => handleCategoryChange('PAYMENTS')} icon={<DollarSign size={16} />} label="Payments" count={notifications.filter(n=>n.category==='PAYMENTS').length} />
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ padding: 'var(--spacing-12)', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)' }}>
              <Bell size={48} color="var(--color-text-muted)" style={{ margin: '0 auto var(--spacing-4)' }} />
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>No Notifications</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-2)' }}>You're all caught up! There are no notifications in this category.</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                style={{ 
                  display: 'flex', 
                  gap: 'var(--spacing-4)', 
                  padding: 'var(--spacing-4)', 
                  backgroundColor: notification.status === 'UNREAD' ? 'rgba(79, 70, 229, 0.03)' : 'var(--color-surface)', 
                  borderRadius: 'var(--radius-lg)', 
                  border: notification.status === 'UNREAD' ? '1px solid rgba(79, 70, 229, 0.2)' : '1px solid var(--color-border)',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ marginTop: '2px' }}>
                  {getIconForType(notification.type)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: notification.status === 'UNREAD' ? 700 : 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                      {notification.title}
                    </h4>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.5', marginBottom: 'var(--spacing-3)' }}>
                    {notification.message}
                  </p>
                  
                  <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
                    {notification.actionUrl && (
                      <Button variant="outline" size="sm" onClick={() => router.push(notification.actionUrl!)} style={{ padding: '4px 12px', fontSize: '12px' }}>
                        View Details <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                      </Button>
                    )}
                    
                    {notification.status === 'UNREAD' && (
                      <button onClick={() => markAsRead(notification.id)} style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--color-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>

                <button onClick={() => dismissNotification(notification.id)} style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.5 }}>
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, icon, label, count }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'var(--spacing-3) var(--spacing-4)',
        backgroundColor: active ? 'var(--color-surface)' : 'transparent', 
        border: 'none', 
        borderRadius: 'var(--radius-md)',
        color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        fontWeight: active ? 600 : 500, 
        fontSize: 'var(--font-size-sm)', 
        cursor: 'pointer',
        textAlign: 'left',
        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {icon} {label}
      </div>
      {count > 0 && (
        <Badge variant={active ? "default" : "secondary"} style={{ fontSize: '10px', padding: '2px 6px' }}>{count}</Badge>
      )}
    </button>
  );
}

export default function NotificationsPage() {
  return (
    <div style={{ height: '100%', backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <Suspense fallback={<div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading Notifications...</div>}>
        <NotificationsContent />
      </Suspense>
    </div>
  );
}