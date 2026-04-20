'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

interface Category { id: string; name: string; }
interface ProductFormData { title: string; shortDescription: string; description: string; categoryId: string; image: string; }
interface Props { initial?: ProductFormData & { id?: string }; mode: 'create' | 'edit'; }

const emptyForm: ProductFormData = { title: '', shortDescription: '', description: '', categoryId: '', image: '' };

export default function ProductForm({ initial, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(initial || emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetch('/api/categories').then(r => r.json()).then(setCategories); }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setForm(f => ({ ...f, image: data.url }));
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSaving(true); setError('');
    try {
      const url = mode === 'edit' && initial?.id ? `/api/products/${initial.id}` : '/api/products';
      const res = await fetch(url, { method: mode === 'edit' ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Failed');
      router.push('/admin/products');
      router.refresh();
    } catch {
      setError('Failed to save. Please try again.');
      setSaving(false);
    }
  }

  const labelStyle = { display: 'block', fontFamily: 'DM Mono', fontSize: '0.58rem', letterSpacing: '2.5px', textTransform: 'uppercase' as const, color: 'var(--slate)', marginBottom: '0.5rem' };
  const inputStyle = { width: '100%', padding: '0.7rem 1rem', border: '1.5px solid var(--mist)', borderRadius: 6, fontSize: '0.9rem', fontFamily: 'Barlow', outline: 'none', transition: 'border-color 0.2s', color: 'var(--ink)' };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.8rem 1rem', borderRadius: 6, marginBottom: '1.5rem', fontSize: '0.88rem', fontFamily: 'Barlow' }}>{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ marginBottom: '1.2rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Product Title *</label>
          <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Glass Tube Rotameter" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--cobalt)')} onBlur={e => (e.target.style.borderColor = 'var(--mist)')} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Short Description</label>
          <input value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} placeholder="Brief summary shown on product cards" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--cobalt)')} onBlur={e => (e.target.style.borderColor = 'var(--mist)')} />
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} style={{ ...inputStyle, background: 'white' }}
            onFocus={e => (e.target.style.borderColor = 'var(--cobalt)')} onBlur={e => (e.target.style.borderColor = 'var(--mist)')}>
            <option value="">— Select Category —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Product Image</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="URL or upload →" style={{ ...inputStyle, flex: 1 }}
              onFocus={e => (e.target.style.borderColor = 'var(--cobalt)')} onBlur={e => (e.target.style.borderColor = 'var(--mist)')} />
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              style={{ padding: '0 1rem', background: 'var(--fog)', border: '1.5px solid var(--mist)', borderRadius: 6, cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'Barlow Condensed', fontWeight: 700, whiteSpace: 'nowrap', color: 'var(--ink)', flexShrink: 0 }}>
              {uploading ? '...' : '↑ Upload'}
            </button>
          </div>
          {form.image && (
            <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <img src={form.image} alt="preview" style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 5, border: '1px solid var(--mist)' }} />
              <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'Barlow Condensed', fontWeight: 700 }}>✕ Remove</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={labelStyle}>Full Description</label>
        <RichTextEditor value={form.description} onChange={html => setForm(f => ({ ...f, description: html }))} />
      </div>

      <div style={{ display: 'flex', gap: '0.8rem', paddingTop: '1rem', borderTop: '1px solid var(--mist)' }}>
        <button type="submit" disabled={saving} className="btn btn-primary" style={{ opacity: saving ? 0.7 : 1, fontSize: '0.88rem' }}>
          {saving ? 'Saving…' : mode === 'edit' ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.back()} style={{ padding: '0.75rem 1.5rem', background: 'none', border: '1.5px solid var(--mist)', color: 'var(--slate)', borderRadius: 4, cursor: 'pointer', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.88rem' }}>Cancel</button>
      </div>
    </form>
  );
}
