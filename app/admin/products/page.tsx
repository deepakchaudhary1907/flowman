// app/admin/products/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category { id: string; name: string; }
interface Product  { id: string; title: string; shortDescription: string; image: string; categoryId: string; createdAt: string; }

export default function AdminProductsPage() {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleting,   setDeleting]   = useState<string | null>(null);
  const [search,     setSearch]     = useState('');

  const load = () => {
    fetch('/api/products').then(r => r.json()).then(setProducts);
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  };
  useEffect(load, []);

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (categories.find(c => c.id === p.categoryId)?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    load(); setDeleting(null);
  }

  return (
    <div>
      <style>{`
        .trow { transition: background .15s; }
        .trow:hover { background: #f4f6f8 !important; }

        /* On small screens hide some columns */
        @media (max-width: 768px) {
          .col-added  { display: none; }
          .col-desc   { display: none; }
        }
        @media (max-width: 520px) {
          .col-cat    { display: none; }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#8a9baa', marginBottom: 4 }}>Catalogue</div>
          <h1 style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.1rem)', color: '#1e2229', margin: 0 }}>
            Products <span style={{ fontWeight: 400, fontSize: '1.3rem', color: '#8a9baa' }}>({products.length})</span>
          </h1>
        </div>
        <Link href="/admin/products/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.6rem 1.3rem', background: '#4bb6e8', color: '#071520', borderRadius: 6, fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.5px', textDecoration: 'none', transition: 'background .18s' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#2a9fd6')}
          onMouseLeave={e => (e.currentTarget.style.background = '#4bb6e8')}>
          + Add Product
        </Link>
      </div>

      {/* ── Search ── */}
      <div style={{ marginBottom: '1.2rem', position: 'relative', maxWidth: 360 }}>
        <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#8a9baa', fontSize: '0.82rem', pointerEvents: 'none' }}>⊕</span>
        <input type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', paddingLeft: '2.2rem', paddingRight: '1rem', paddingTop: '0.6rem', paddingBottom: '0.6rem', border: '1.5px solid #dde2e8', borderRadius: 8, fontSize: '0.87rem', fontFamily: "'Barlow',Arial,sans-serif", outline: 'none', background: '#fff', transition: 'border-color .2s' }}
          onFocus={e => (e.target.style.borderColor = '#4bb6e8')}
          onBlur={e  => (e.target.style.borderColor = '#dde2e8')} />
      </div>

      {/* ── Table ── */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #dde2e8', overflow: 'hidden', boxShadow: '0 2px 10px rgba(30,34,41,0.06)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
          <thead>
            <tr style={{ background: '#1e2229' }}>
              <th style={th()}>Image</th>
              <th style={th('left')}>Product</th>
              <th style={{ ...th('left'), }} className="col-cat">Category</th>
              <th style={th('left')} className="col-added">Added</th>
              <th style={th('right')}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const cat = categories.find(c => c.id === p.categoryId);
              return (
                <tr key={p.id} className="trow" style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f4f6f8' : 'none', background: '#fff' }}>
                  {/* Thumb */}
                  <td style={{ padding: '0.82rem 0.75rem 0.82rem 1rem', width: 60 }}>
                    <div style={{ width: 46, height: 38, borderRadius: 7, overflow: 'hidden', background: 'linear-gradient(135deg,#1e2229,#2d3440)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'rgba(255,255,255,.25)', fontSize: '1rem' }}>⚙</span>}
                    </div>
                  </td>
                  {/* Name */}
                  <td style={{ padding: '0.82rem 1rem' }}>
                    <div style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, color: '#1e2229', fontSize: '0.95rem' }}>{p.title}</div>
                    <div className="col-desc" style={{ fontSize: '0.76rem', color: '#8a9baa', marginTop: 2, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.shortDescription}</div>
                  </td>
                  {/* Category */}
                  <td style={{ padding: '0.82rem 1rem' }} className="col-cat">
                    {cat
                      ? <span style={{ background: 'rgba(75,182,232,0.10)', color: '#1e8fc0', border: '1px solid rgba(75,182,232,0.25)', padding: '2px 8px', borderRadius: 3, fontFamily: "'DM Mono',monospace", fontSize: '0.58rem', letterSpacing: '1px', whiteSpace: 'nowrap' }}>{cat.name}</span>
                      : <span style={{ color: '#dde2e8', fontSize: '0.8rem' }}>—</span>}
                  </td>
                  {/* Added */}
                  <td style={{ padding: '0.82rem 1rem', fontFamily: "'DM Mono',monospace", fontSize: '0.66rem', color: '#8a9baa', whiteSpace: 'nowrap' }} className="col-added">
                    {new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '0.82rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <a href={`/products/${p.id}`} target="_blank" style={{ padding: '0.28rem 0.72rem', fontSize: '0.72rem', fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, color: '#8a9baa', border: '1px solid #dde2e8', borderRadius: 5, textDecoration: 'none', whiteSpace: 'nowrap' }}>View</a>
                      <Link href={`/admin/products/edit/${p.id}`} style={{ padding: '0.28rem 0.72rem', fontSize: '0.72rem', fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, color: '#4bb6e8', border: '1px solid #4bb6e8', borderRadius: 5, textDecoration: 'none', whiteSpace: 'nowrap' }}>Edit</Link>
                      <button onClick={() => deleteProduct(p.id)} disabled={deleting === p.id}
                        style={{ padding: '0.28rem 0.72rem', fontSize: '0.72rem', fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, color: '#dc2626', border: '1px solid #fecaca', borderRadius: 5, cursor: 'pointer', background: '#fef2f2', whiteSpace: 'nowrap' }}>
                        {deleting === p.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '3.5rem', textAlign: 'center', color: '#8a9baa', fontFamily: "'Barlow Condensed',Arial,sans-serif", fontSize: '1rem' }}>
                  {search
                    ? 'No products match your search.'
                    : <><span>No products yet. </span><Link href="/admin/products/new" style={{ color: '#4bb6e8' }}>Add your first →</Link></>}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* tiny helper so th() doesn't repeat inline objects */
function th(align: 'left'|'right'|'center' = 'left'): React.CSSProperties {
  return {
    padding: '0.82rem 1rem',
    textAlign: align,
    fontFamily: "'DM Mono',monospace",
    fontWeight: 500,
    fontSize: '0.56rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#8a9baa',
    whiteSpace: 'nowrap',
  };
}