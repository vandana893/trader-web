import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tinted?: boolean;
}

export function Card({ children, tinted = false, className = '', style, ...props }: CardProps) {
  return (
    <div
      className={`card ${className}`}
      style={{
        backgroundColor: tinted ? 'var(--color-surface-tinted)' : 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        padding: 'var(--spacing-6)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}