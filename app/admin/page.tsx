// app/admin/page.tsx
import { getProducts, getCategories } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const auth = await isAuthenticated();
  if (!auth) redirect('/admin/login');

  const products       = await getProducts();
  const categories     = await getCategories();
  const recentProducts = products.slice(-5).reverse();

  return (
    <div>
      <style>{`
        .stat-card { transition: transform .22s, box-shadow .22s; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(30,34,41,.13) !important; }
        .recent-row { transition: background .15s; cursor: default; }
        .recent-row:hover { background: #f4f6f8 !important; }
        .act-btn { transition: all .18s; }
        .act-btn:hover { transform: translateY(-1px); }

        /* responsive grid */
        .dash-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .dash-main  { display: grid; grid-template-columns: 1fr 320px; gap: 1rem; }

        @media (max-width: 1024px) {
          .dash-main { grid-template-columns: 1fr; }
        }
        @media (max-width: 700px) {
          .dash-stats { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .dash-stats { grid-template-columns: 1fr; }
        }

        /* New Product button hover — CSS instead of JS event handlers
           (this page is a Server Component, so no onMouseEnter/Leave) */
        .new-prod-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0.58rem 1.2rem; background: #4bb6e8; color: #071520;
          border-radius: 6px; font-family: 'Barlow Condensed',Arial,sans-serif;
          font-weight: 700; font-size: 0.87rem; letter-spacing: 0.5px;
          text-decoration: none; transition: background .18s;
        }
        .new-prod-btn:hover { background: #2a9fd6; }

        .view-site-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0.58rem 1.2rem; background: #fff; color: #6b7280;
          border: 1.5px solid #dde2e8; border-radius: 6px;
          font-family: 'Barlow Condensed',Arial,sans-serif;
          font-weight: 700; font-size: 0.87rem; text-decoration: none;
          transition: color .15s, border-color .15s;
        }
        .view-site-btn:hover { color: #4bb6e8; border-color: #4bb6e8; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#8a9baa', marginBottom: '0.3rem' }}>Overview</div>
          <h1 style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.1rem)', color: '#1e2229', margin: 0 }}>Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link href="/admin/products/new" className="new-prod-btn">+ New Product</Link>
          <Link href="/products" target="_blank" className="view-site-btn">View Site ↗</Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="dash-stats">
        {[
          { label: 'Total Products', value: products.length,                     sub: 'Live on site',        color: '#4bb6e8', bg: 'rgba(75,182,232,0.07)',  icon: '📦' },
          { label: 'Categories',     value: categories.length,                   sub: 'Product groups',      color: '#1e8fc0', bg: 'rgba(30,143,192,0.07)',  icon: '🗂' },
          { label: 'With Images',    value: products.filter(p => p.image).length,sub: 'Have product photo',  color: '#16a34a', bg: 'rgba(22,163,74,0.07)',   icon: '🖼' },
        ].map(stat => (
          <div key={stat.label} className="stat-card" style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', boxShadow: '0 2px 10px rgba(30,34,41,0.06)', border: '1px solid #dde2e8', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: stat.color }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,4vw,2.8rem)', color: stat.color, lineHeight: 1, marginBottom: '0.2rem' }}>{stat.value}</div>
                <div style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.92rem', color: '#1e2229', marginBottom: '0.15rem' }}>{stat.label}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.58rem', letterSpacing: '1px', color: '#8a9baa', textTransform: 'uppercase' }}>{stat.sub}</div>
              </div>
              <div style={{ width: 42, height: 42, background: stat.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="dash-main">
        {/* Recent Products */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 10px rgba(30,34,41,0.06)', border: '1px solid #dde2e8', overflow: 'hidden' }}>
          <div style={{ padding: '1.2rem 1.4rem', borderBottom: '1px solid #dde2e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#1e2229' }}>Recent Products</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', letterSpacing: '1.5px', color: '#8a9baa', textTransform: 'uppercase', marginTop: 1 }}>Latest additions</div>
            </div>
            <Link href="/admin/products" style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.78rem', letterSpacing: '1px', color: '#4bb6e8', textDecoration: 'none' }}>View All →</Link>
          </div>

          {recentProducts.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#8a9baa', fontFamily: "'Barlow',Arial,sans-serif", fontSize: '0.9rem' }}>
              No products yet. <Link href="/admin/products/new" style={{ color: '#4bb6e8' }}>Add one →</Link>
            </div>
          ) : recentProducts.map((p, i) => {
            const cat = categories.find(c => c.id === p.categoryId);
            return (
              <div key={p.id} className="recent-row" style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '0.85rem 1.4rem', borderBottom: i < recentProducts.length - 1 ? '1px solid #f4f6f8' : 'none', background: '#fff' }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: 'linear-gradient(135deg,#1e2229,#2d3440)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '1.1rem', opacity: .3, color: '#fff' }}>⚙</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, color: '#1e2229', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, flexWrap: 'wrap' }}>
                    {cat && <span style={{ background: 'rgba(75,182,232,0.10)', color: '#1e8fc0', border: '1px solid rgba(75,182,232,0.25)', padding: '1px 7px', borderRadius: 3, fontFamily: "'DM Mono',monospace", fontSize: '0.57rem', letterSpacing: '1px' }}>{cat.name}</span>}
                    {p.image && <span style={{ background: 'rgba(22,163,74,0.08)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.22)', padding: '1px 7px', borderRadius: 3, fontFamily: "'DM Mono',monospace", fontSize: '0.57rem', letterSpacing: '1px' }}>Image</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <Link href={`/products/${p.id}`} target="_blank" style={{ padding: '0.28rem 0.7rem', fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.72rem', color: '#8a9baa', border: '1px solid #dde2e8', borderRadius: 4, textDecoration: 'none' }}>View</Link>
                  <Link href={`/admin/products/edit/${p.id}`} style={{ padding: '0.28rem 0.7rem', fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.72rem', color: '#4bb6e8', border: '1px solid #4bb6e8', borderRadius: 4, textDecoration: 'none' }}>Edit</Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Quick Actions */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '1.3rem 1.4rem', boxShadow: '0 2px 10px rgba(30,34,41,0.06)', border: '1px solid #dde2e8' }}>
            <div style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#1e2229', marginBottom: 2 }}>Quick Actions</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', letterSpacing: '1.5px', color: '#8a9baa', textTransform: 'uppercase', marginBottom: '1rem' }}>Common tasks</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { href: '/admin/products/new', label: '+ Add New Product', primary: true },
                { href: '/admin/products',     label: 'Manage Products',   primary: false },
                { href: '/admin/categories',   label: 'Manage Categories', primary: false },
                { href: '/admin/enquiries',    label: 'View Enquiries',    primary: false },
              ].map(a => (
                <Link key={a.href} href={a.href} className="act-btn" style={{ display: 'block', padding: '0.68rem 1rem', textAlign: 'center', borderRadius: 7, fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.5px', textDecoration: 'none', background: a.primary ? '#4bb6e8' : '#f4f6f8', color: a.primary ? '#071520' : '#1e2229', border: a.primary ? 'none' : '1.5px solid #dde2e8', transition: 'background .18s, transform .18s' }}>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories summary */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '1.3rem 1.4rem', boxShadow: '0 2px 10px rgba(30,34,41,0.06)', border: '1px solid #dde2e8', flex: 1 }}>
            <div style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#1e2229', marginBottom: 2 }}>Categories</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', letterSpacing: '1.5px', color: '#8a9baa', textTransform: 'uppercase', marginBottom: '1rem' }}>Product groups</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {categories.map(cat => {
                const count = products.filter(p => p.categoryId === cat.id).length;
                return (
                  <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.52rem 0.75rem', background: '#f4f6f8', borderRadius: 6 }}>
                    <div style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 600, fontSize: '0.9rem', color: '#1e2229' }}>{cat.name}</div>
                    <div style={{ background: '#4bb6e8', color: '#fff', borderRadius: 20, padding: '1px 9px', fontFamily: "'DM Mono',monospace", fontSize: '0.64rem', fontWeight: 500 }}>{count}</div>
                  </div>
                );
              })}
              {categories.length === 0 && <div style={{ color: '#8a9baa', fontSize: '0.85rem', fontFamily: "'Barlow',Arial,sans-serif" }}>No categories yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}