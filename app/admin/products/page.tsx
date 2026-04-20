// app\admin\products\page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category { id: string; name: string; }
interface Product { id: string; title: string; shortDescription: string; image: string; categoryId: string; createdAt: string; }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = () => {
    fetch('/api/products').then(r => r.json()).then(setProducts);
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  };
  useEffect(load, []);

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    categories.find(c => c.id === p.categoryId)?.name.toLowerCase().includes(search.toLowerCase())
  );

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product? This action cannot be undone.')) return;
    setDeleting(id);
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    load(); setDeleting(null);
  }

  return (
    <div>
      <style>{`
        .table-row:hover { background: var(--fog) !important; }
        .table-row { transition: background 0.15s; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.3rem' }}>Catalogue</div>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '2rem', color: 'var(--ink)', margin: 0 }}>
            Products <span style={{ fontWeight: 400, fontSize: '1.4rem', color: 'var(--slate)' }}>({products.length})</span>
          </h1>
        </div>
        <Link href="/admin/products/new" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.3rem', background: 'var(--gold)', color: 'var(--ink)', borderRadius: 7, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.5px', textDecoration: 'none' }}>+ Add Product</Link>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.2rem', position: 'relative', maxWidth: 360 }}>
        <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate)', fontSize: '0.82rem', pointerEvents: 'none' }}>⊕</span>
        <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', paddingLeft: '2.2rem', paddingRight: '1rem', paddingTop: '0.6rem', paddingBottom: '0.6rem', border: '1.5px solid var(--mist)', borderRadius: 8, fontSize: '0.87rem', fontFamily: 'Barlow, sans-serif', outline: 'none', background: 'white', transition: 'border-color 0.2s' }}
          onFocus={e => (e.target.style.borderColor = 'var(--cobalt)')}
          onBlur={e => (e.target.style.borderColor = 'var(--mist)')} />
      </div>

      <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--mist)', overflow: 'hidden', boxShadow: '0 2px 10px rgba(8,14,26,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--ink)' }}>
              {['', 'Product', 'Category', 'Added', 'Actions'].map((h, i) => (
                <th key={i} style={{ padding: '0.85rem 1rem', textAlign: i >= 4 ? 'right' : 'left', fontFamily: 'DM Mono, monospace', fontWeight: 500, fontSize: '0.58rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--slate)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const cat = categories.find(c => c.id === p.categoryId);
              return (
                <tr key={p.id} className="table-row" style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--fog)' : 'none', background: 'white' }}>
                  <td style={{ padding: '0.85rem 0.75rem 0.85rem 1rem' }}>
                    <div style={{ width: 46, height: 38, borderRadius: 7, overflow: 'hidden', background: 'linear-gradient(135deg, var(--ink-80), var(--steel))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '1rem' }}>⚙</span>}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, color: 'var(--ink)', fontSize: '0.95rem' }}>{p.title}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--slate)', marginTop: '2px', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.shortDescription}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {cat
                      ? <span style={{ background: 'rgba(201,136,42,0.1)', color: 'var(--gold)', border: '1px solid rgba(201,136,42,0.25)', padding: '2px 8px', borderRadius: 3, fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '1px', whiteSpace: 'nowrap' }}>{cat.name}</span>
                      : <span style={{ color: 'var(--mist)', fontSize: '0.8rem' }}>—</span>}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: 'var(--slate)', whiteSpace: 'nowrap' }}>
                    {new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <a href={`/products/${p.id}`} target="_blank" style={{ padding: '0.3rem 0.75rem', fontSize: '0.72rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, color: 'var(--slate)', border: '1px solid var(--mist)', borderRadius: 5, textDecoration: 'none', whiteSpace: 'nowrap' }}>View</a>
                      <Link href={`/admin/products/edit/${p.id}`} style={{ padding: '0.3rem 0.75rem', fontSize: '0.72rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, color: 'var(--cobalt)', border: '1px solid var(--cobalt)', borderRadius: 5, textDecoration: 'none', whiteSpace: 'nowrap' }}>Edit</Link>
                      <button onClick={() => deleteProduct(p.id)} disabled={deleting === p.id} style={{ padding: '0.3rem 0.75rem', fontSize: '0.72rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, color: '#dc2626', border: '1px solid #fecaca', borderRadius: 5, cursor: 'pointer', background: '#fef2f2', whiteSpace: 'nowrap' }}>
                        {deleting === p.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--slate)', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1rem' }}>
                {search ? 'No products match your search.' : <>No products yet. <Link href="/admin/products/new" style={{ color: 'var(--cobalt)' }}>Add your first →</Link></>}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}