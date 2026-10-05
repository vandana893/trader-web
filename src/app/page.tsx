import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <section style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '2rem' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>No-Code Algorithmic Trading</h1>
        <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
          Build, backtest, and deploy advanced trading strategies without writing a single line of code.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/login" style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}>Login</Link>
          <Link href="/signup" style={{ padding: '0.75rem 1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>Sign Up</Link>
        </div>
      </section>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>1. Connect your broker.</div>
          <div style={{ padding: '1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>2. Build strategy visually.</div>
          <div style={{ padding: '1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>3. Backtest or deploy live.</div>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Core Capabilities</h2>
        <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', lineHeight: '2' }}>
          <li>Visual Strategy Builder</li>
          <li>Extensive Backtesting Engine</li>
          <li>Paper & Live Trading</li>
          <li>Strategy Marketplace</li>
        </ul>
      </section>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Supported Brokers</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', width: '120px', textAlign: 'center' }}>Broker A</div>
          <div style={{ padding: '1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', width: '120px', textAlign: 'center' }}>Broker B</div>
        </div>
      </section>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>FAQ</h2>
        <details style={{ marginBottom: '1rem', background: 'var(--color-surface)', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Is it really no-code?</summary>
          <p style={{ marginTop: '0.5rem', color: 'var(--color-text-secondary)' }}>Yes, you can build complex logic using our visual interface.</p>
        </details>
        <details style={{ background: 'var(--color-surface)', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Do I need to deposit funds here?</summary>
          <p style={{ marginTop: '0.5rem', color: 'var(--color-text-secondary)' }}>No, funds stay in your connected broker account.</p>
        </details>
      </section>

      <section style={{ padding: '1rem', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        <strong>Risk Disclaimer:</strong> Trading involves significant risk. Our platform provides tools for automation but does not guarantee profits. Please trade responsibly.
      </section>
    </div>
  );
}
