'use client';
// components/AdminShell.tsx
// Responsive sidebar shell for all admin pages
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/admin',             label: 'Dashboard',  icon: '◈' },
  { href: '/admin/products',    label: 'Products',   icon: '⚙' },
  { href: '/admin/categories',  label: 'Categories', icon: '◫' },
  { href: '/admin/enquiries',   label: 'Enquiries',  icon: '✉' },
  { href: '/admin/profile',     label: 'Profile',    icon: '👤' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path     = usePathname();
  const router   = useRouter();
  const [sideOpen, setSideOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 900);
    fn();
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => { setSideOpen(false); }, [path]);

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  const isActive = (href: string) =>
    href === '/admin' ? path === '/admin' : path.startsWith(href);

  return (
    <>
      <style>{`
        /* ── Admin Shell Styles ── */
        .adm-shell {
          display: flex;
          min-height: 100vh;
          background: #f4f6f8;
          font-family: 'Barlow', Arial, sans-serif;
        }

        /* Sidebar */
        .adm-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: #1e2229;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          transition: transform .28s cubic-bezier(.4,0,.2,1);
          z-index: 300;
        }

        /* Mobile sidebar — off-canvas */
        @media (max-width: 900px) {
          .adm-sidebar {
            position: fixed;
            left: 0; top: 0; bottom: 0;
            transform: translateX(-100%);
          }
          .adm-sidebar.open { transform: translateX(0); box-shadow: 6px 0 32px rgba(0,0,0,0.35); }
        }

        /* Sidebar overlay */
        .adm-overlay {
          display: none;
          position: fixed; inset: 0; z-index: 299;
          background: rgba(0,0,0,0.45);
        }
        .adm-overlay.open { display: block; }

        /* Sidebar logo area */
        .adm-logo {
          padding: 20px 20px 16px;
          border-bottom: 1px solid rgba(75,182,232,0.15);
          display: flex; align-items: center; gap: 10px;
        }
        .adm-logo-mark {
          width: 36px; height: 36px; border-radius: 8px;
          background: linear-gradient(135deg, #4bb6e8, #1e8fc0);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800; font-size: 1rem; color: #fff;
          flex-shrink: 0;
        }
        .adm-logo-text { flex: 1; min-width: 0; }
        .adm-logo-name {
          font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif;
          font-weight: 800; font-size: 0.95rem; color: #fff;
          line-height: 1; letter-spacing: 0.5px;
        }
        .adm-logo-sub {
          font-family: 'DM Mono', monospace;
          font-size: 0.52rem; letter-spacing: 2px;
          text-transform: uppercase; color: #4bb6e8;
          margin-top: 2px;
        }

        /* Nav items */
        .adm-nav { padding: 12px 12px; flex: 1; }
        .adm-nav-section {
          font-family: 'DM Mono', monospace;
          font-size: 0.52rem; letter-spacing: 2.5px;
          text-transform: uppercase; color: #8a9baa;
          padding: 0 8px; margin: 16px 0 6px;
        }
        .adm-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 0.6rem 0.85rem; border-radius: 7px;
          text-decoration: none; color: #8a9baa;
          font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif;
          font-weight: 600; font-size: 0.95rem;
          transition: background .14s, color .14s;
          margin-bottom: 2px;
        }
        .adm-nav-item:hover  { background: rgba(75,182,232,.08); color: #fff; }
        .adm-nav-item.active { background: rgba(75,182,232,.14); color: #4bb6e8; }
        .adm-nav-item .ic    { font-size: 0.95rem; width: 20px; text-align: center; flex-shrink: 0; }

        /* Sidebar footer */
        .adm-sidebar-foot {
          padding: 12px 12px 16px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .adm-logout {
          display: flex; align-items: center; gap: 10px;
          padding: 0.6rem 0.85rem; border-radius: 7px; width: 100%;
          background: none; border: none; cursor: pointer; color: #8a9baa;
          font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif;
          font-weight: 600; font-size: 0.95rem;
          transition: background .14s, color .14s;
        }
        .adm-logout:hover { background: rgba(220,38,38,.10); color: #f87171; }

        /* Main content */
        .adm-main {
          flex: 1; min-width: 0;
          display: flex; flex-direction: column;
        }

        /* Top bar */
        .adm-topbar {
          background: #fff;
          border-bottom: 1px solid #dde2e8;
          padding: 0 24px;
          height: 60px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
          position: sticky; top: 0; z-index: 100;
          box-shadow: 0 1px 4px rgba(30,34,41,0.06);
        }
        .adm-hamburger {
          display: none;
          width: 36px; height: 36px; border-radius: 6px;
          background: rgba(75,182,232,.08); border: 1.5px solid rgba(75,182,232,.22);
          color: #1e2229; font-size: 1.15rem; cursor: pointer;
          align-items: center; justify-content: center;
          transition: background .18s;
        }
        @media (max-width: 900px) {
          .adm-hamburger { display: flex; }
        }

        .adm-page-title {
          font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif;
          font-weight: 700; font-size: 1.1rem; color: #1e2229;
        }

        .adm-topbar-right {
          display: flex; align-items: center; gap: 12px;
        }
        .adm-view-site {
          font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif;
          font-weight: 700; font-size: 0.78rem; letter-spacing: 1px;
          text-transform: uppercase; text-decoration: none;
          color: #6b7280; border: 1.5px solid #dde2e8;
          padding: 0.38rem 0.9rem; border-radius: 4px;
          transition: color .15s, border-color .15s;
          display: none;
        }
        @media (min-width: 600px) { .adm-view-site { display: inline-block; } }
        .adm-view-site:hover { color: #4bb6e8; border-color: #4bb6e8; }

        .adm-user-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 10px 4px 4px;
          background: #f4f6f8; border: 1px solid #dde2e8;
          border-radius: 24px; cursor: default;
        }
        .adm-user-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #4bb6e8, #1e8fc0);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800; font-size: 0.82rem; color: #fff;
          flex-shrink: 0;
        }
        .adm-user-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: 0.85rem; color: #1e2229;
          white-space: nowrap;
          display: none;
        }
        @media (min-width: 600px) { .adm-user-name { display: block; } }

        /* Content area */
        .adm-content {
          padding: clamp(16px, 3vw, 32px);
          flex: 1;
          max-width: 1400px;
          width: 100%;
        }
      `}</style>

      <div className="adm-shell">
        {/* ── SIDEBAR ── */}
        <aside className={`adm-sidebar${sideOpen ? ' open' : ''}`}>
          {/* Logo */}
          <div className="adm-logo">
            <div className="adm-logo-mark">FE</div>
            <div className="adm-logo-text">
              <div className="adm-logo-name">FLOWMAN</div>
              <div className="adm-logo-sub">Admin Panel</div>
            </div>
            {/* Mobile close */}
            {isMobile && (
              <button onClick={() => setSideOpen(false)}
                style={{ background: 'none', border: 'none', color: '#8a9baa', fontSize: '1.1rem', cursor: 'pointer', padding: 4, marginLeft: 'auto' }}>✕</button>
            )}
          </div>

          {/* Nav */}
          <nav className="adm-nav">
            <div className="adm-nav-section">Main Menu</div>
            {NAV.map(item => (
              <Link key={item.href} href={item.href}
                className={`adm-nav-item${isActive(item.href) ? ' active' : ''}`}>
                <span className="ic">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="adm-sidebar-foot">
            <Link href="/products" target="_blank"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 0.85rem', borderRadius: 7, textDecoration: 'none', color: '#8a9baa', fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 600, fontSize: '0.92rem', marginBottom: 2, transition: 'background .14s, color .14s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(75,182,232,.07)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#8a9baa'; }}>
              <span style={{ fontSize: '0.9rem', width: 20, textAlign: 'center' }}>↗</span>
              View Site
            </Link>
            <button className="adm-logout" onClick={handleLogout}>
              <span style={{ fontSize: '0.9rem', width: 20, textAlign: 'center' }}>⎋</span>
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        {isMobile && sideOpen && (
          <div className={`adm-overlay${sideOpen ? ' open' : ''}`} onClick={() => setSideOpen(false)} />
        )}

        {/* ── MAIN ── */}
        <div className="adm-main">
          {/* Top bar */}
          <div className="adm-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="adm-hamburger" onClick={() => setSideOpen(true)} aria-label="Open menu">≡</button>
              <span className="adm-page-title">
                {NAV.find(n => isActive(n.href))?.label ?? 'Admin'}
              </span>
            </div>
            <div className="adm-topbar-right">
              <Link href="/products" target="_blank" className="adm-view-site">View Site ↗</Link>
              <div className="adm-user-pill">
                <div className="adm-user-avatar">A</div>
                <span className="adm-user-name">Admin</span>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div className="adm-content">{children}</div>
        </div>
      </div>
    </>
  );
}