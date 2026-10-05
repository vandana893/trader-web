'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Settings, LogOut, User } from 'lucide-react';

export function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header" style={{ position: 'relative', zIndex: 50 }}>
      <div className="header-breadcrumb">
        <span>Dashboard</span>
      </div>
      <div className="header-actions">
        <div className="header-search">
          <input type="text" placeholder="Search..." className="header-search-input" />
        </div>
        
        {/* Notification Bell Link */}
        <Link href="/notifications" className="header-notification" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          🔔
        </Link>
        
        {/* Profile Dropdown */}
        <div className="header-profile" style={{ position: 'relative' }} ref={dropdownRef}>
          <div 
            className="avatar" 
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => setProfileOpen(!profileOpen)}
          >
            U
          </div>

          {profileOpen && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              width: '200px',
              padding: 'var(--spacing-2) 0',
              zIndex: 100
            }}>
              <div style={{ padding: 'var(--spacing-2) var(--spacing-4)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--spacing-2)' }}>
                <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', margin: 0, color: 'var(--color-text-primary)' }}>User Profile</p>
                <p style={{ fontSize: 'var(--font-size-xs)', margin: 0, color: 'var(--color-text-muted)' }}>user@example.com</p>
              </div>

              <Link 
                href="/settings" 
                onClick={() => setProfileOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: 'var(--spacing-2) var(--spacing-4)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-tinted)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Settings size={16} /> Settings
              </Link>

              <div 
                onClick={() => {
                  setProfileOpen(false);
                  alert('FRONTEND SIMULATION: Logged out successfully.');
                  window.location.href = '/login';
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: 'var(--spacing-2) var(--spacing-4)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-danger)',
                  cursor: 'pointer',
                  marginTop: 'var(--spacing-1)',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-tinted)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={16} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}