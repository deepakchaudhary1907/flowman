// app/admin/categories/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';

interface Category { id: string; name: string; slug: string; description: string; image: string; createdAt: string; }

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) onChange(data.url);
    setUploading(false);
  }

  return (
    <div>
      <div onClick={() => fileRef.current?.click()} style={{ width: '100%', height: 130, borderRadius: 8, border: '2px dashed #dde2e8', overflow: 'hidden', position: 'relative', cursor: 'pointer', background: '#f4f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor='#4bb6e8')}
        onMouseLeave={e => (e.currentTarget.style.borderColor='#dde2e8')}>
        {value ? (
          <>
            <img src={value} alt="category" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity='1')} onMouseLeave={e => (e.currentTarget.style.opacity='0')}>
              <div style={{ fontSize: '1.4rem' }}>📷</div>
              <div style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.8rem', color: '#fff', marginTop: 4 }}>Change Image</div>
            </div>
          </>
        ) : uploading ? (
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.65rem', letterSpacing: '2px', color: '#8a9baa' }}>UPLOADING…</div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', opacity: 0.3, marginBottom: 6 }}>🖼</div>
            <div style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#8a9baa' }}>Click to upload image</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.6rem', color: '#dde2e8', marginTop: 3 }}>JPG, PNG, WEBP</div>
          </div>
        )}
      </div>
      {value && (
        <button type="button" onClick={() => onChange('')} style={{ marginTop: 6, fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.75rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>✕ Remove image</button>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form,     setForm]     = useState({ name: '', description: '', image: '' });
  const [editId,   setEditId]   = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', image: '' });
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => fetch('/api/categories').then(r => r.json()).then(setCategories);
  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); if (!form.name.trim()) return; setSaving(true);
    await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ name: '', description: '', image: '' }); load(); setSaving(false);
  }
  async function handleUpdate(id: string) {
    setSaving(true);
    await fetch(`/api/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm) });
    setEditId(null); load(); setSaving(false);
  }
  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return; setDeleting(id);
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    load(); setDeleting(null);
  }

  const lbl: React.CSSProperties = { display: 'block', fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#8a9baa', marginBottom: '0.45rem' };
  const inp: React.CSSProperties = { width: '100%', padding: '0.7rem 0.95rem', border: '1.5px solid #dde2e8', borderRadius: 7, fontSize: '0.9rem', fontFamily: "'Barlow',Arial,sans-serif", outline: 'none', color: '#1e2229', background: '#fff', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box' };

  return (
    <div>
      <style>{`
        .cat-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        @media (max-width: 768px) { .cat-form-grid { grid-template-columns: 1fr; } }
        .inp-f:focus { border-color: #4bb6e8 !important; box-shadow: 0 0 0 3px rgba(75,182,232,0.12) !important; }
      `}</style>

      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#8a9baa', marginBottom: 4 }}>Organisation</div>
        <h1 style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.1rem)', color: '#1e2229', margin: 0 }}>Categories</h1>
      </div>

      <div className="cat-form-grid">
        {/* ── Add Form ── */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 'clamp(1.25rem,3vw,2rem)', boxShadow: '0 2px 12px rgba(30,34,41,0.06)', border: '1px solid #dde2e8' }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.58rem', letterSpacing: '3px', color: '#4bb6e8', marginBottom: '1.2rem', textTransform: 'uppercase' }}>Add New Category</div>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={lbl}>Category Name <span style={{ color: '#4bb6e8' }}>*</span></label>
              <input className="inp-f" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Rotameters" style={inp} />
            </div>
            <div>
              <label style={lbl}>Description</label>
              <input className="inp-f" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description" style={inp} />
            </div>
            <div>
              <label style={lbl}>Category Image</label>
              <ImageUploader value={form.image} onChange={url => setForm(f => ({ ...f, image: url }))} />
            </div>
            <button type="submit" disabled={saving} style={{ alignSelf: 'flex-start', padding: '0.62rem 1.5rem', background: saving ? '#dde2e8' : '#4bb6e8', color: saving ? '#8a9baa' : '#071520', border: 'none', borderRadius: 6, fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.5px', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background .18s' }}>
              {saving ? 'Adding…' : '+ Add Category'}
            </button>
          </form>
        </div>

        {/* ── List ── */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 'clamp(1.25rem,3vw,2rem)', boxShadow: '0 2px 12px rgba(30,34,41,0.06)', border: '1px solid #dde2e8' }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.58rem', letterSpacing: '3px', color: '#8a9baa', marginBottom: '1.2rem', textTransform: 'uppercase' }}>All Categories ({categories.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {categories.map((cat, i) => (
              <div key={cat.id} style={{ border: '1px solid #dde2e8', borderRadius: 8, overflow: 'hidden' }}>
                {editId === cat.id ? (
                  <div style={{ padding: '1rem', background: '#f4f6f8', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input className="inp-f" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={{ ...inp, padding: '0.55rem 0.8rem', fontSize: '0.88rem' }} placeholder="Name" />
                    <input className="inp-f" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} style={{ ...inp, padding: '0.55rem 0.8rem', fontSize: '0.88rem' }} placeholder="Description" />
                    <div>
                      <div style={{ ...lbl, marginBottom: 6 }}>Image</div>
                      <ImageUploader value={editForm.image} onChange={url => setEditForm(f => ({ ...f, image: url }))} />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleUpdate(cat.id)} disabled={saving} style={{ padding: '0.45rem 1.1rem', background: '#4bb6e8', color: '#071520', border: 'none', borderRadius: 5, fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Save</button>
                      <button onClick={() => setEditId(null)} style={{ padding: '0.45rem 1.1rem', background: '#fff', border: '1.5px solid #dde2e8', borderRadius: 5, cursor: 'pointer', fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.8rem', color: '#8a9baa' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.72rem 1rem' }}>
                    <div style={{ width: 46, height: 40, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg,#1e2229,#2d3440)' }}>
                      {cat.image ? <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, color: '#1e2229', fontSize: '1rem' }}>{cat.name}</div>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.6rem', color: '#8a9baa', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.description || 'No description'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => { setEditId(cat.id); setEditForm({ name: cat.name, description: cat.description, image: cat.image || '' }); }} style={{ padding: '0.28rem 0.65rem', fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.75rem', color: '#4bb6e8', border: '1px solid #4bb6e8', borderRadius: 4, cursor: 'pointer', background: 'none' }}>Edit</button>
                      <button onClick={() => handleDelete(cat.id)} disabled={deleting === cat.id} style={{ padding: '0.28rem 0.65rem', fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.75rem', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 4, cursor: 'pointer', background: '#fef2f2' }}>
                        {deleting === cat.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {categories.length === 0 && <p style={{ color: '#8a9baa', fontFamily: "'Barlow',Arial,sans-serif", fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>No categories yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}