'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '◉', exact: true },
  { href: '/admin/products', label: 'Products', icon: '⚙', exact: false },
  { href: '/admin/categories', label: 'Categories', icon: '◫', exact: false },
  { href: '/admin/enquiries', label: 'Enquiries', icon: '📨', exact: false, badge: true },
];

const SIDEBAR_W = 230;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newEnqCount, setNewEnqCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState('');

  // Load avatar on mount
  useEffect(() => {
    fetch('/api/admin/avatar')
      .then(r => r.ok ? r.json() : { url: null })
      .then(d => { if (d.url) setAvatarUrl(d.url); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/enquiries?status=new')
      .then(r => r.ok ? r.json() : [])
      .then(d => setNewEnqCount(Array.isArray(d) ? d.length : 0))
      .catch(() => {});
  }, [path]);

  useEffect(() => { setSidebarOpen(false); }, [path]);

  // Apply admin background to body without SSR mismatch
  useEffect(() => {
    document.body.style.background = 'var(--fog)';
    document.body.style.margin = '0';
    return () => { document.body.style.background = ''; };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  const currentPage = [
    ...NAV.map(n => ({ ...n, match: n.exact ? path === n.href : path.startsWith(n.href) })),
    { href: '/admin/profile', label: 'Profile & Users', match: path.startsWith('/admin/profile') },
  ].find(n => n.match)?.label || 'Admin Panel';

  const NavLinks = () => (
    <>
      <div style={{ padding: '0.7rem 1.2rem 0.4rem', fontFamily: 'DM Mono, monospace', fontSize: '0.48rem', letterSpacing: '2.5px', color: '#3a4a5c', textTransform: 'uppercase' }}>Main Menu</div>
      {NAV.map(link => {
        const active = link.exact ? path === link.href : path.startsWith(link.href);
        const badge = link.badge && newEnqCount > 0;
        return (
          <Link key={link.href} href={link.href}
            style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.62rem 1.2rem', textDecoration: 'none', background: active ? 'rgba(201,136,42,0.14)' : 'transparent', borderLeft: `3px solid ${active ? 'var(--gold)' : 'transparent'}`, color: active ? 'white' : 'var(--slate)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.15s', marginBottom: '1px' }}
            onMouseEnter={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.color = 'white'; el.style.background = 'rgba(255,255,255,0.05)'; } }}
            onMouseLeave={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--slate)'; el.style.background = 'transparent'; } }}>
            <span style={{ fontSize: '0.88rem', opacity: active ? 1 : 0.55, width: 18, textAlign: 'center', flexShrink: 0 }}>{link.icon}</span>
            <span style={{ flex: 1 }}>{link.label}</span>
            {badge && <span style={{ background: '#16a34a', color: 'white', borderRadius: 20, padding: '1px 7px', fontSize: '0.58rem', fontFamily: 'DM Mono, monospace' }}>{newEnqCount}</span>}
            {active && !badge && <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />}
          </Link>
        );
      })}

      <div style={{ margin: '0.7rem 1.2rem', height: 1, background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ padding: '0.4rem 1.2rem 0.4rem', fontFamily: 'DM Mono, monospace', fontSize: '0.48rem', letterSpacing: '2.5px', color: '#3a4a5c', textTransform: 'uppercase' }}>Account</div>
      {(() => {
        const active = path.startsWith('/admin/profile');
        return (
          <Link href="/admin/profile"
            style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.62rem 1.2rem', textDecoration: 'none', background: active ? 'rgba(201,136,42,0.14)' : 'transparent', borderLeft: `3px solid ${active ? 'var(--gold)' : 'transparent'}`, color: active ? 'white' : 'var(--slate)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.15s', marginBottom: '1px' }}
            onMouseEnter={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.color = 'white'; el.style.background = 'rgba(255,255,255,0.05)'; } }}
            onMouseLeave={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--slate)'; el.style.background = 'transparent'; } }}>
            <span style={{ fontSize: '0.88rem', opacity: active ? 1 : 0.55, width: 18, textAlign: 'center' }}>👤</span>
            <span style={{ flex: 1 }}>Profile & Users</span>
            {active && <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)' }} />}
          </Link>
        );
      })()}

      <div style={{ padding: '0.4rem 1.2rem 0.3rem', fontFamily: 'DM Mono, monospace', fontSize: '0.48rem', letterSpacing: '2.5px', color: '#3a4a5c', textTransform: 'uppercase', marginTop: '0.3rem' }}>External</div>
      <a href="/products" target="_blank"
        style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.62rem 1.2rem', textDecoration: 'none', color: 'var(--slate)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.15s' }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'white'; el.style.background = 'rgba(255,255,255,0.05)'; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--slate)'; el.style.background = 'transparent'; }}>
        <span style={{ fontSize: '0.88rem', opacity: 0.55, width: 18, textAlign: 'center' }}>↗</span>
        <span>View Live Site</span>
      </a>
    </>
  );

  return (
    <>
      {/* All responsive CSS via media queries — no JS-based isMobile to avoid hydration mismatch */}
      <style>{`
        .admin-sidebar {
          width: ${SIDEBAR_W}px;
          background: var(--ink);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 20;
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .admin-main {
          margin-left: ${SIDEBAR_W}px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          min-width: 0;
        }
        .admin-topbar-burger { display: none; }
        .admin-topbar-username { display: flex; }
        .mobile-overlay { display: none; }
        .mobile-sidebar-close { display: none; }
        .admin-main-content { padding: 2rem; }

        @media (max-width: 1023px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
            box-shadow: 4px 0 32px rgba(0,0,0,0.4);
          }
          .admin-main {
            margin-left: 0;
          }
          .admin-topbar-burger { display: flex; }
          .admin-topbar-username { display: none; }
          .mobile-overlay.open {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 19;
          }
          .mobile-sidebar-close { display: flex; }
          .admin-main-content { padding: 1.25rem; }
        }
        @media (max-width: 600px) {
          .admin-topbar-username { display: none; }
          .enq-detail-right { display: none; }
          .profile-left-card { display: none; }
        }
      `}</style>

      {/* Mobile overlay */}
      <div className={`mobile-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="/admin" style={{ textDecoration: 'none', display: 'block' }}>
              <img
                src="/flowman-logo.svg"
                alt="Flowman Engineers"
                style={{ height: 120, width: 'auto', filter: 'brightness(0) invert(1)', display: 'block' }}
              />
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.46rem', color: 'var(--gold)', letterSpacing: '3px', marginTop: '4px', textTransform: 'uppercase' }}>Admin Panel</div>
            </a>
            <button className="mobile-sidebar-close" onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 4 }}>✕</button>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '0.6rem 0' }}>
          <NavLinks />
        </nav>

        {/* Profile mini + logout */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <Link href="/admin/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.9rem 1.2rem', textDecoration: 'none', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cobalt), var(--gold-dim))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 0 2px rgba(201,136,42,0.25)', overflow: 'hidden' }}>
              {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '0.88rem', color: 'white' }}>A</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: 'white', lineHeight: 1 }}>Administrator</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.5rem', color: 'var(--slate)', letterSpacing: '1px', marginTop: '2px' }}>admin</div>
            </div>
            <span style={{ fontSize: '0.6rem', color: 'var(--slate)', opacity: 0.5 }}>›</span>
          </Link>
          <div style={{ padding: '0 0.9rem 0.9rem' }}>
            <button onClick={handleLogout} disabled={loggingOut}
              style={{ width: '100%', padding: '0.52rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, color: 'var(--slate)', cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.82rem', transition: 'all 0.18s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(239,68,68,0.12)'; el.style.color = '#f87171'; el.style.borderColor = 'rgba(239,68,68,0.25)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.color = 'var(--slate)'; el.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
              <span style={{ fontSize: '0.8rem' }}>⎋</span>
              {loggingOut ? 'Signing out…' : 'Sign Out'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="admin-main">
        {/* Top header */}
        <header style={{ background: 'white', borderBottom: '1px solid var(--mist)', padding: '0 1.25rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 15, boxShadow: '0 1px 4px rgba(8,14,26,0.06)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Burger — shown via CSS on mobile */}
            <button className="admin-topbar-burger" onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', fontSize: '1.25rem', width: 34, height: 34, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>≡</button>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '1px', color: 'var(--slate)', textTransform: 'uppercase' }}>Admin</span>
              {currentPage !== 'Admin Panel' && <>
                <span style={{ color: 'var(--mist)', fontSize: '0.75rem' }}>›</span>
                <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: 'var(--ink)' }}>{currentPage}</span>
              </>}
            </div>
          </div>

          {/* Profile dropdown */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.3rem 0.65rem 0.3rem 0.3rem', background: profileMenuOpen ? 'var(--fog)' : 'transparent', border: `1.5px solid ${profileMenuOpen ? 'var(--mist)' : 'transparent'}`, borderRadius: 8, cursor: 'pointer', transition: 'all 0.18s' }}
              onMouseEnter={e => { if (!profileMenuOpen) { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--fog)'; el.style.borderColor = 'var(--mist)'; } }}
              onMouseLeave={e => { if (!profileMenuOpen) { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.borderColor = 'transparent'; } }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cobalt), var(--gold-dim))', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '0.78rem', color: 'white' }}>A</span>}
              </div>
              <div className="admin-topbar-username" style={{ textAlign: 'left', flexDirection: 'column' }}>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.83rem', color: 'var(--ink)', lineHeight: 1 }}>Administrator</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.5rem', color: 'var(--slate)', letterSpacing: '1px' }}>admin</div>
              </div>
              <span style={{ fontSize: '0.6rem', color: 'var(--slate)', transition: 'transform 0.18s', display: 'inline-block', transform: profileMenuOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
            </button>

            {profileMenuOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setProfileMenuOpen(false)} />
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'white', border: '1px solid var(--mist)', borderRadius: 10, boxShadow: '0 8px 32px rgba(8,14,26,0.14)', minWidth: 200, zIndex: 50, overflow: 'hidden' }}>
                  <div style={{ padding: '0.9rem 1rem', borderBottom: '1px solid var(--fog)', background: 'var(--fog)' }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '0.92rem', color: 'var(--ink)' }}>Administrator</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', color: 'var(--slate)', letterSpacing: '1px', marginTop: '1px' }}>flowmanengg@gmail.com</div>
                  </div>
                  {[
                    { href: '/admin', label: 'Dashboard', icon: '◉' },
                    { href: '/admin/profile', label: 'My Profile', icon: '👤' },
                    { href: '/admin/enquiries', label: 'Enquiries', icon: '📨' },
                  ].map(item => (
                    <Link key={item.label} href={item.href} onClick={() => setProfileMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1rem', textDecoration: 'none', color: 'var(--ink)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, fontSize: '0.88rem', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--fog)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      <span style={{ fontSize: '0.82rem', width: 18 }}>{item.icon}</span>{item.label}
                    </Link>
                  ))}
                  <div style={{ height: 1, background: 'var(--fog)' }} />
                  <button onClick={() => { setProfileMenuOpen(false); handleLogout(); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1rem', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#dc2626', transition: 'background 0.15s', textAlign: 'left' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fef2f2'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <span style={{ width: 18 }}>⎋</span>{loggingOut ? 'Signing out…' : 'Sign Out'}
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="admin-main-content" style={{ flex: 1, overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
    </>
  );
}