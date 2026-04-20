import { getProducts, getCategories } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const auth = await isAuthenticated();
  if (!auth) redirect('/admin/login');

  const products = await getProducts();
  const categories = await getCategories();
  const recentProducts = products.slice(-5).reverse();

  return (
    <div>
      <style>{`
        .stat-card { transition: all 0.22s; cursor: pointer; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(8,14,26,0.14); }
        .action-btn { transition: all 0.18s; }
        .action-btn:hover { transform: translateY(-1px); }
        .recent-row:hover { background: var(--fog) !important; }
        .recent-row { transition: background 0.15s; }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.3rem' }}>Overview</div>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '2rem', color: 'var(--ink)', margin: 0 }}>Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <Link href="/admin/products/new" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', background: 'var(--gold)', color: 'var(--ink)', borderRadius: 7, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.5px', textDecoration: 'none', transition: 'all 0.18s' }}>+ New Product</Link>
          <Link href="/products" target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', background: 'white', color: 'var(--slate)', border: '1.5px solid var(--mist)', borderRadius: 7, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.18s' }}>View Site ↗</Link>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.1rem', marginBottom: '1.8rem' }}>
        {[
          { label: 'Total Products', value: products.length, sub: 'Live on site', color: 'var(--cobalt)', bg: 'rgba(28,95,168,0.06)', icon: '📦' },
          { label: 'Categories', value: categories.length, sub: 'Product groups', color: 'var(--gold)', bg: 'rgba(201,136,42,0.06)', icon: '🗂' },
          { label: 'With Images', value: products.filter(p => p.image).length, sub: 'Have product photo', color: '#16a34a', bg: 'rgba(22,163,74,0.06)', icon: '🖼' },
        ].map(stat => (
          <div key={stat.label} className="stat-card" style={{ background: 'white', borderRadius: 12, padding: '1.6rem', boxShadow: '0 2px 10px rgba(8,14,26,0.06)', border: '1px solid var(--mist)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: stat.color, opacity: 0.7 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '2.8rem', color: stat.color, lineHeight: 1, marginBottom: '0.2rem' }}>{stat.value}</div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)', marginBottom: '0.15rem' }}>{stat.label}</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '1px', color: 'var(--slate)', textTransform: 'uppercase' }}>{stat.sub}</div>
              </div>
              <div style={{ width: 44, height: 44, background: stat.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.1rem' }}>
        {/* Recent products */}
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 10px rgba(8,14,26,0.06)', border: '1px solid var(--mist)', overflow: 'hidden' }}>
          <div style={{ padding: '1.3rem 1.5rem', borderBottom: '1px solid var(--mist)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink)' }}>Recent Products</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '1.5px', color: 'var(--slate)', textTransform: 'uppercase', marginTop: '1px' }}>Latest additions</div>
            </div>
            <Link href="/admin/products" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '1px', color: 'var(--cobalt)', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div>
            {recentProducts.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--slate)', fontSize: '0.9rem' }}>No products yet. <Link href="/admin/products/new" style={{ color: 'var(--cobalt)' }}>Add one →</Link></div>
            ) : recentProducts.map((p, i) => {
              const cat = categories.find(c => c.id === p.categoryId);
              return (
                <div key={p.id} className="recent-row" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 1.5rem', borderBottom: i < recentProducts.length - 1 ? '1px solid var(--fog)' : 'none' }}>
                  {/* Thumb */}
                  <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: 'linear-gradient(135deg, var(--ink-80), var(--steel))', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '1.1rem', opacity: 0.35, color: 'white' }}>⚙</span>}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, color: 'var(--ink)', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
                      {cat && <span style={{ background: 'rgba(201,136,42,0.1)', color: 'var(--gold)', border: '1px solid rgba(201,136,42,0.25)', padding: '1px 7px', borderRadius: 2, fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '1px' }}>{cat.name}</span>}
                      {p.image && <span style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.25)', padding: '1px 7px', borderRadius: 2, fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '1px' }}>Image</span>}
                    </div>
                  </div>
                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                    <Link href={`/products/${p.id}`} target="_blank" style={{ padding: '0.28rem 0.7rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.72rem', color: 'var(--slate)', border: '1px solid var(--mist)', borderRadius: 4, textDecoration: 'none' }}>View</Link>
                    <Link href={`/admin/products/edit/${p.id}`} style={{ padding: '0.28rem 0.7rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.72rem', color: 'var(--cobalt)', border: '1px solid var(--cobalt)', borderRadius: 4, textDecoration: 'none' }}>Edit</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Quick actions */}
          <div style={{ background: 'white', borderRadius: 12, padding: '1.3rem 1.5rem', boxShadow: '0 2px 10px rgba(8,14,26,0.06)', border: '1px solid var(--mist)' }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink)', marginBottom: '0.2rem' }}>Quick Actions</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '1.5px', color: 'var(--slate)', textTransform: 'uppercase', marginBottom: '1.1rem' }}>Common tasks</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { href: '/admin/products/new', label: '+ Add New Product', gold: true },
                { href: '/admin/products', label: 'Manage Products', gold: false },
                { href: '/admin/categories', label: 'Manage Categories', gold: false },
              ].map(a => (
                <Link key={a.href} href={a.href} className="action-btn" style={{ display: 'block', padding: '0.7rem 1rem', textAlign: 'center', borderRadius: 7, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.87rem', letterSpacing: '0.5px', textDecoration: 'none', background: a.gold ? 'var(--gold)' : 'var(--fog)', color: a.gold ? 'var(--ink)' : 'var(--ink)', border: a.gold ? 'none' : '1.5px solid var(--mist)' }}>{a.label}</Link>
              ))}
            </div>
          </div>

          {/* Categories summary */}
          <div style={{ background: 'white', borderRadius: 12, padding: '1.3rem 1.5rem', boxShadow: '0 2px 10px rgba(8,14,26,0.06)', border: '1px solid var(--mist)', flex: 1 }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink)', marginBottom: '0.2rem' }}>Categories</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '1.5px', color: 'var(--slate)', textTransform: 'uppercase', marginBottom: '1.1rem' }}>Product groups</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {categories.map(cat => {
                const count = products.filter(p => p.categoryId === cat.id).length;
                return (
                  <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0.75rem', background: 'var(--fog)', borderRadius: 6 }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: 'var(--ink)' }}>{cat.name}</div>
                    <div style={{ background: 'var(--cobalt)', color: 'white', borderRadius: 20, padding: '1px 9px', fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', fontWeight: 500 }}>{count}</div>
                  </div>
                );
              })}
              {categories.length === 0 && <div style={{ color: 'var(--slate)', fontSize: '0.85rem' }}>No categories yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}