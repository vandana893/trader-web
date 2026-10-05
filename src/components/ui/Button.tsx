import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  href,
  style,
  ...props 
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-md)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    textDecoration: 'none',
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: 'var(--spacing-1) var(--spacing-3)', fontSize: 'var(--font-size-xs)' },
    md: { padding: 'var(--spacing-2) var(--spacing-4)', fontSize: 'var(--font-size-sm)' },
    lg: { padding: 'var(--spacing-3) var(--spacing-6)', fontSize: 'var(--font-size-base)' },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: 'var(--color-primary)', color: '#ffffff' },
    secondary: { backgroundColor: 'var(--color-surface-tinted)', color: 'var(--color-text-primary)' },
    outline: { backgroundColor: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' },
    ghost: { backgroundColor: 'transparent', color: 'var(--color-text-secondary)' },
  };

  const finalStyle = { ...baseStyle, ...sizeStyles[size], ...variantStyles[variant], ...style };

  if (href) {
    return (
      <Link href={href} className={className} style={finalStyle} {...(props as any)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} style={finalStyle} {...props}>
      {children}
    </button>
  );
}