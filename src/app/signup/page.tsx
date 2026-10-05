'use client';
import React from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '1.5rem', textAlign: 'center' }}>Create an Account</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: 'var(--font-size-sm)', fontWeight: 'bold' }}>Full Name</label>
          <input type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} placeholder="John Doe" />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: 'var(--font-size-sm)', fontWeight: 'bold' }}>Email</label>
            <input type="email" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} placeholder="john@example.com" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: 'var(--font-size-sm)', fontWeight: 'bold' }}>Mobile</label>
            <input type="tel" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} placeholder="+1 234 567 8900" />
          </div>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: 'var(--font-size-sm)', fontWeight: 'bold' }}>Password</label>
          <input type="password" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} placeholder="••••••••" />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: 'var(--font-size-sm)', fontWeight: 'bold' }}>Confirm Password</label>
          <input type="password" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} placeholder="••••••••" />
        </div>
        
        <div style={{ fontSize: 'var(--font-size-sm)' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" required style={{ marginTop: '0.25rem' }} /> 
            <span>I agree to the <a href="#" style={{ color: 'var(--color-primary)' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--color-primary)' }}>Privacy Policy</a>.</span>
          </label>
        </div>
        
        <button type="submit" style={{ width: '100%', padding: '0.75rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
          Create Account
        </button>
      </form>
      
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
        Already have an account? <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Login</Link>
      </div>
    </div>
  );
}