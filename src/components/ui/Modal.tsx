import React, { useEffect } from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  variant?: 'danger' | 'warning' | 'primary';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'primary',
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const variantToButtonVariant: Record<string, 'primary' | 'secondary' | 'outline' | 'ghost'> = {
    danger: 'primary', // Maybe style danger explicitly, but our Button doesn't have a danger variant by default. Let's use primary with red background inline, or just primary.
    warning: 'primary',
    primary: 'primary',
  };

  // We don't have a native danger button, let's use primary and style it if needed.
  let confirmStyle = {};
  if (variant === 'danger') {
    confirmStyle = { backgroundColor: 'var(--color-danger)' };
  } else if (variant === 'warning') {
    confirmStyle = { backgroundColor: 'var(--color-warning)' };
  }

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-6)',
          width: '90%',
          maxWidth: '400px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-2)', color: 'var(--color-text-primary)' }}>
          {title}
        </h3>
        
        {description && (
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-6)' }}>
            {description}
          </p>
        )}
        
        {children}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          {onConfirm && (
            <Button variant={variantToButtonVariant[variant]} style={confirmStyle} onClick={() => { onConfirm(); onClose(); }}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}