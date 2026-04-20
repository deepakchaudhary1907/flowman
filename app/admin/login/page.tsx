'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => {
        if (r.ok) router.replace('/admin');
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || 'Invalid username or password.');
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '0.8rem 1rem',
    border: '1.5px solid #e2e8f0', borderRadius: 8,
    fontSize: '0.92rem', fontFamily: 'Barlow, system-ui, sans-serif',
    outline: 'none', color: '#0d1829', background: 'white',
    transition: 'all 0.2s', display: 'block',
  };

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #080e1a 0%, #0f2040 50%, #1a3a6e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#8fa3bc', letterSpacing: '3px', textTransform: 'uppercase' }}>Loading…</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #080e1a 0%, #0f2040 50%, #1a3a6e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <style>{`
        .login-inp:focus { border-color: #1c5fa8 !important; box-shadow: 0 0 0 3px rgba(28,95,168,0.12); }
        .login-btn:hover:not(:disabled) { background: #e4a84e !important; transform: translateY(-1px); }
        .login-btn { transition: all 0.2s; }
      `}</style>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #1c5fa8, #7a5018)', marginBottom: '1rem', boxShadow: '0 0 0 1px rgba(201,136,42,0.4), 0 12px 32px rgba(0,0,0,0.35)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M12 12l8-5M12 12v10M12 12L4 7" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'Barlow Condensed, system-ui, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: 'white', letterSpacing: '0.5px' }}>FLOWMAN ENGINEERS</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: '#c9882a', letterSpacing: '3px', marginTop: '4px' }}>ADMIN PORTAL</div>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: 16, padding: '2.5rem', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
          <h2 style={{ fontFamily: 'Barlow Condensed, system-ui, sans-serif', fontWeight: 800, fontSize: '1.65rem', color: '#080e1a', marginBottom: '0.3rem' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.8rem' }}>Sign in to manage your products and catalogue.</p>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.84rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '0.5rem' }}>Username</label>
              <input className="login-inp" required value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Enter username" style={inp} autoComplete="username" autoFocus />
            </div>
            <div style={{ marginBottom: '1.6rem' }}>
              <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '0.5rem' }}>Password</label>
              <input className="login-inp" type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter password" style={inp} autoComplete="current-password" />
            </div>
            <button type="submit" disabled={loading} className="login-btn" style={{
              width: '100%', padding: '0.9rem',
              background: loading ? '#d1d5db' : '#c9882a',
              color: '#080e1a', border: 'none', borderRadius: 9,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Barlow Condensed, system-ui, sans-serif',
              fontWeight: 800, fontSize: '1rem', letterSpacing: '1.5px', textTransform: 'uppercase',
            }}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          {/* Security info */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem' }}>🔒</span>
            <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Protected admin area. Unauthorized access is prohibited.</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/" style={{ fontSize: '0.8rem', color: '#8fa3bc', textDecoration: 'none', fontFamily: 'DM Mono, monospace', letterSpacing: '1px' }}>← Back to website</a>
        </div>
      </div>
    </div>
  );
}