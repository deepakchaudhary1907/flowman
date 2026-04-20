'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/products', label: 'Products', icon: '⚙' },
  { href: '/admin/categories', label: 'Categories', icon: '◫' },
  { href: '/', label: 'View Site ↗', icon: '◎' },
];

export default function AdminSidebar() {
  const path = usePathname();
  return (
    <aside style={{ width: 230, background: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ padding: '1.5rem 1.2rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.25rem' }}>
          <div style={{ width: 30, height: 30, borderRadius: 5, background: 'linear-gradient(135deg, var(--cobalt), var(--gold-dim))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>⚙</div>
          <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '1rem', color: 'white', letterSpacing: '0.5px' }}>FLOWMAN</div>
        </div>
        <div style={{ fontFamily: 'DM Mono', fontSize: '0.55rem', color: 'var(--gold)', letterSpacing: '3px', marginLeft: '2.4rem' }}>ADMIN PANEL</div>
      </div>
      <nav style={{ flex: 1, padding: '0.8rem 0' }}>
        {links.map(link => {
          const active = link.href === '/admin' ? path === '/admin' : path.startsWith(link.href) && link.href !== '/';
          return (
            <Link key={link.href} href={link.href} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.7rem 1.2rem', textDecoration: 'none',
              background: active ? 'rgba(201,136,42,0.15)' : 'transparent',
              borderLeft: `3px solid ${active ? 'var(--gold)' : 'transparent'}`,
              color: active ? 'white' : 'var(--slate)',
              fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.5px',
              transition: 'all 0.18s', marginBottom: '0.1rem',
            }}
            onMouseOver={e => { if (!active) e.currentTarget.style.color = 'white'; }}
            onMouseOut={e => { if (!active) e.currentTarget.style.color = 'var(--slate)'; }}>
              <span style={{ fontSize: '0.9rem', opacity: active ? 1 : 0.6 }}>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: '1rem 1.2rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.65rem', color: '#3a4a5c', fontFamily: 'DM Mono' }}>
        FLOWMAN ENGINEERS v1.0
      </div>
    </aside>
  );
}
