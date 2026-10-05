import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary' | 'secondary' | 'default';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ children, variant = 'neutral', className = '', style, ...props }: BadgeProps) {
  const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
    success: { backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' },
    warning: { backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
    danger: { backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' },
    info: { backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)' },
    neutral: { backgroundColor: 'var(--color-neutral-bg)', color: 'var(--color-text-secondary)' },
    primary: { backgroundColor: 'var(--color-primary-bg, #e0f2fe)', color: 'var(--color-primary, #0284c7)' },
    secondary: { backgroundColor: 'var(--color-secondary-bg, #f1f5f9)', color: 'var(--color-text-secondary)' },
    default: { backgroundColor: 'var(--color-surface-tinted)', color: 'var(--color-text-primary)' },
  };

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        padding: '0.125rem 0.5rem',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--font-size-xs)',
        fontWeight: 600,
        textTransform: 'uppercase',
        ...variantStyles[variant],
        ...style
      }}
      {...props}
    >
      {children}
    </span>
  );
}