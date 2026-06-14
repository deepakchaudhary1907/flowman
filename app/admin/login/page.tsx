// app/admin/login/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => { if (r.ok) router.replace('/admin'); else setChecking(false); })
      .catch(() => setChecking(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) { router.push('/admin'); router.refresh(); }
    else { const d = await res.json(); setError(d.error || 'Invalid username or password.'); }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '0.8rem 1rem',
    border: '1.5px solid #dde2e8', borderRadius: 8,
    fontSize: '0.92rem', fontFamily: "'Barlow',Arial,sans-serif",
    outline: 'none', color: '#1e2229', background: '#fff',
    transition: 'border-color .2s, box-shadow .2s', display: 'block',
    boxSizing: 'border-box',
  };

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0d1520 0%,#1e2a3a 50%,#1a3050 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.75rem', color: '#8a9baa', letterSpacing: '3px', textTransform: 'uppercase' }}>Loading…</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0d1520 0%,#1e2229 50%,#0d2035 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <style>{`
        .login-inp:focus { border-color: #4bb6e8 !important; box-shadow: 0 0 0 3px rgba(75,182,232,0.14) !important; }
        .login-btn { transition: all 0.2s; }
        .login-btn:hover:not(:disabled) { background: #2a9fd6 !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(75,182,232,0.35) !important; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Brand mark */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 58, height: 58, borderRadius: 14, background: 'linear-gradient(135deg,#4bb6e8,#1e8fc0)', marginBottom: '1rem', boxShadow: '0 0 0 1px rgba(75,182,232,0.35), 0 12px 32px rgba(0,0,0,0.35)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M12 12l8-5M12 12v10M12 12L4 7" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
            </svg>
          </div>
          <div style={{ fontFamily: "'Barlow Condensed','Arial Narrow',Arial,sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#fff', letterSpacing: '0.5px' }}>FLOWMAN ENGINEERS</div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.6rem', color: '#4bb6e8', letterSpacing: '3px', marginTop: 4 }}>ADMIN PORTAL</div>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(1.5rem,4vw,2.5rem)', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
          <h2 style={{ fontFamily: "'Barlow Condensed','Arial Narrow',Arial,sans-serif", fontWeight: 800, fontSize: '1.65rem', color: '#1e2229', marginBottom: '0.3rem' }}>Welcome Back</h2>
          <p style={{ fontFamily: "'Barlow',Arial,sans-serif", fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.8rem' }}>Sign in to manage your products and catalogue.</p>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.84rem', fontFamily: "'Barlow',Arial,sans-serif", marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '0.5rem' }}>Username</label>
              <input className="login-inp" required value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Enter username" style={inp} autoComplete="username" autoFocus />
            </div>
            <div style={{ marginBottom: '1.6rem' }}>
              <label style={{ display: 'block', fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '0.5rem' }}>Password</label>
              <input className="login-inp" type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter password" style={inp} autoComplete="current-password" />
            </div>
            <button type="submit" disabled={loading} className="login-btn" style={{
              width: '100%', padding: '0.9rem',
              background: loading ? '#dde2e8' : '#4bb6e8',
              color: loading ? '#8a9baa' : '#071520',
              border: 'none', borderRadius: 9,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Barlow Condensed','Arial Narrow',Arial,sans-serif",
              fontWeight: 800, fontSize: '1rem', letterSpacing: '1.5px', textTransform: 'uppercase',
            }}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid #f4f6f8', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.78rem' }}>🔒</span>
            <span style={{ fontFamily: "'Barlow',Arial,sans-serif", fontSize: '0.78rem', color: '#9ca3af' }}>Protected admin area. Unauthorized access is prohibited.</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/" style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.78rem', color: '#8a9baa', textDecoration: 'none', letterSpacing: '1px' }}>← Back to website</a>
        </div>
      </div>
    </div>
  );
}