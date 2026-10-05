'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '1rem', textAlign: 'center' }}>Reset Password</h1>
      
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <div style={{ color: 'var(--color-success)', fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
          <p style={{ marginBottom: '1.5rem' }}>If an account exists with that email, we have sent password reset instructions.</p>
          <Link href="/login" style={{ display: 'inline-block', width: '100%', padding: '0.75rem', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 'bold', textDecoration: 'none' }}>
            Return to Login
          </Link>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', textAlign: 'center', fontSize: 'var(--font-size-sm)' }}>
            Enter your email or mobile number and we'll send you a link to reset your password.
          </p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: 'var(--font-size-sm)', fontWeight: 'bold' }}>Email or Mobile</label>
              <input type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} placeholder="Enter your email" />
            </div>
            
            <button type="submit" style={{ width: '100%', padding: '0.75rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
              Send Reset Link
            </button>
          </form>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: 'var(--font-size-sm)' }}>
            <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Back to Login</Link>
          </div>
        </>
      )}
    </div>
  );
}