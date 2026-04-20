// app/admin/categories/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';

interface Category { id: string; name: string; slug: string; description: string; image: string; createdAt: string; }

const CAT_COLORS = [
  'linear-gradient(135deg, #1c5fa8 0%, #0d3a6e 100%)',
  'linear-gradient(135deg, #c9882a 0%, #7a5018 100%)',
  'linear-gradient(135deg, #1a6b5a 0%, #0e3d34 100%)',
  'linear-gradient(135deg, #5a2d8c 0%, #32186e 100%)',
  'linear-gradient(135deg, #7a3a18 0%, #c9882a 100%)',
  'linear-gradient(135deg, #1c5fa8 0%, #1a6b5a 100%)',
];

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) onChange(data.url);
    setUploading(false);
  }

  return (
    <div>
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          width: '100%', height: 140, borderRadius: 8, border: '2px dashed var(--mist)',
          overflow: 'hidden', position: 'relative', cursor: 'pointer', background: 'var(--fog)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--cobalt)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--mist)')}
      >
        {value ? (
          <>
            <img src={value} alt="category" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
            >
              <div style={{ fontSize: '1.4rem' }}>📷</div>
              <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.8rem', color: 'white', marginTop: '0.3rem' }}>Change Image</div>
            </div>
          </>
        ) : uploading ? (
          <div style={{ fontFamily: 'DM Mono', fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--slate)' }}>UPLOADING…</div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', opacity: 0.3, marginBottom: '0.4rem' }}>🖼</div>
            <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.85rem', color: 'var(--slate)' }}>Click to upload image</div>
            <div style={{ fontFamily: 'DM Mono', fontSize: '0.6rem', color: 'var(--mist)', marginTop: '0.2rem' }}>JPG, PNG, WEBP</div>
          </div>
        )}
      </div>
      {value && (
        <button type="button" onClick={() => onChange('')}
          style={{ marginTop: '0.4rem', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.75rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          ✕ Remove image
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: '', description: '', image: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', image: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => fetch('/api/categories').then(r => r.json()).then(setCategories);
  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ name: '', description: '', image: '' }); load(); setSaving(false);
  }

  async function handleUpdate(id: string) {
    setSaving(true);
    await fetch(`/api/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm) });
    setEditId(null); load(); setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return;
    setDeleting(id);
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    load(); setDeleting(null);
  }

  const labelStyle = { display: 'block', fontFamily: 'DM Mono', fontSize: '0.58rem', letterSpacing: '2.5px', textTransform: 'uppercase' as const, color: 'var(--slate)', marginBottom: '0.5rem' };
  const inputStyle = { width: '100%', padding: '0.7rem 1rem', border: '1.5px solid var(--mist)', borderRadius: 6, fontSize: '0.9rem', fontFamily: 'Barlow', outline: 'none', color: 'var(--ink)', transition: 'border-color 0.2s', boxSizing: 'border-box' as const };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontFamily: 'DM Mono', fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--slate)' }}>Organisation</span>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '2.2rem', color: 'var(--ink)', marginTop: '0.3rem' }}>Categories</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add form */}
        <div style={{ background: 'white', borderRadius: 10, padding: '2rem', boxShadow: '0 2px 12px rgba(8,14,26,0.06)', border: '1px solid var(--mist)' }}>
          <div style={{ fontFamily: 'DM Mono', fontSize: '0.6rem', letterSpacing: '3px', color: 'var(--gold)', marginBottom: '1.2rem', textTransform: 'uppercase' }}>Add New Category</div>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Category Name *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Rotameters" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--cobalt)')} onBlur={e => (e.target.style.borderColor = 'var(--mist)')} />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--cobalt)')} onBlur={e => (e.target.style.borderColor = 'var(--mist)')} />
            </div>
            <div>
              <label style={labelStyle}>Category Image</label>
              <ImageUploader value={form.image} onChange={url => setForm(f => ({ ...f, image: url }))} />
            </div>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ alignSelf: 'flex-start', opacity: saving ? 0.7 : 1, fontSize: '0.85rem' }}>
              {saving ? 'Adding…' : '+ Add Category'}
            </button>
          </form>
        </div>

        {/* List */}
        <div style={{ background: 'white', borderRadius: 10, padding: '2rem', boxShadow: '0 2px 12px rgba(8,14,26,0.06)', border: '1px solid var(--mist)' }}>
          <div style={{ fontFamily: 'DM Mono', fontSize: '0.6rem', letterSpacing: '3px', color: 'var(--slate)', marginBottom: '1.2rem', textTransform: 'uppercase' }}>All Categories ({categories.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {categories.map((cat, i) => (
              <div key={cat.id} style={{ border: '1px solid var(--mist)', borderRadius: 7, overflow: 'hidden' }}>
                {editId === cat.id ? (
                  <div style={{ padding: '1rem', background: 'var(--fog)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={{ ...inputStyle, padding: '0.55rem 0.8rem', fontSize: '0.88rem' }} placeholder="Name" />
                    <input value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, padding: '0.55rem 0.8rem', fontSize: '0.88rem' }} placeholder="Description" />
                    <div>
                      <div style={{ ...labelStyle, marginBottom: '0.4rem' }}>Image</div>
                      <ImageUploader value={editForm.image} onChange={url => setEditForm(f => ({ ...f, image: url }))} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleUpdate(cat.id)} disabled={saving} className="btn btn-primary" style={{ fontSize: '0.78rem', padding: '0.45rem 1rem' }}>Save</button>
                      <button onClick={() => setEditId(null)} style={{ padding: '0.45rem 1rem', background: 'white', border: '1.5px solid var(--mist)', borderRadius: 4, cursor: 'pointer', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.78rem', color: 'var(--slate)' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.75rem 1rem' }}>
                    {/* Thumbnail */}
                    <div style={{ width: 48, height: 40, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: cat.image ? 'transparent' : CAT_COLORS[i % CAT_COLORS.length] }}>
                      {cat.image
                        ? <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%' }} />
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, color: 'var(--ink)', fontSize: '1rem' }}>{cat.name}</div>
                      <div style={{ fontFamily: 'DM Mono', fontSize: '0.62rem', color: 'var(--slate)', letterSpacing: '0.5px', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.description || 'No description'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                      <button onClick={() => { setEditId(cat.id); setEditForm({ name: cat.name, description: cat.description, image: cat.image || '' }); }}
                        style={{ padding: '0.3rem 0.7rem', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.75rem', color: 'var(--cobalt)', border: '1px solid var(--cobalt)', borderRadius: 4, cursor: 'pointer', background: 'none' }}>Edit</button>
                      <button onClick={() => handleDelete(cat.id)} disabled={deleting === cat.id}
                        style={{ padding: '0.3rem 0.7rem', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.75rem', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 4, cursor: 'pointer', background: '#fef2f2' }}>
                        {deleting === cat.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {categories.length === 0 && <p style={{ color: 'var(--slate)', fontFamily: 'Barlow', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>No categories yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}