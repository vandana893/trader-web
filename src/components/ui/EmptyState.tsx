import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, onAction, actionHref }: EmptyStateProps) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 'var(--spacing-8)',
      textAlign: 'center',
      backgroundColor: 'var(--color-surface-tinted)',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--color-border)'
    }}>
      <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>
        {title}
      </div>
      <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: actionLabel ? 'var(--spacing-4)' : 0 }}>
        {description}
      </div>
      {actionLabel && (
        <Button variant="primary" onClick={onAction} href={actionHref}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}