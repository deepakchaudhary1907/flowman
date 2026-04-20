'use client';
import { useState, useEffect } from 'react';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
}

const STATUS_CONFIG = {
  new:      { label: 'New',      bg: 'rgba(22,163,74,0.1)',   color: '#16a34a', border: 'rgba(22,163,74,0.3)' },
  read:     { label: 'Read',     bg: 'rgba(28,95,168,0.08)',  color: 'var(--cobalt)', border: 'rgba(28,95,168,0.2)' },
  replied:  { label: 'Replied',  bg: 'rgba(201,136,42,0.1)',  color: 'var(--gold)',   border: 'rgba(201,136,42,0.25)' },
  archived: { label: 'Archived', bg: 'rgba(107,114,128,0.1)', color: '#6b7280',       border: 'rgba(107,114,128,0.2)' },
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = (status = filter) => {
    setLoading(true);
    fetch(`/api/enquiries${status !== 'all' ? `?status=${status}` : ''}`)
      .then(r => r.json())
      .then(data => { setEnquiries(data); setLoading(false); });
  };

  useEffect(() => { load(); }, [filter]);

  // Auto-mark as read when opened
  async function openEnquiry(enq: Enquiry) {
    setSelected(enq);
    if (enq.status === 'new') {
      await updateStatus(enq.id, 'read');
    }
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: status as Enquiry['status'] } : e));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as Enquiry['status'] } : null);
    }
    setUpdating(null);
  }

  async function deleteEnquiry(id: string) {
    if (!confirm('Delete this enquiry permanently?')) return;
    setDeleting(id);
    const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setEnquiries(prev => prev.filter(e => e.id !== id));
      if (selected?.id === id) setSelected(null);
    }
    setDeleting(null);
  }

  const filtered = enquiries.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.company.toLowerCase().includes(search.toLowerCase()) ||
    e.subject.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    all: enquiries.length,
    new: enquiries.filter(e => e.status === 'new').length,
    read: enquiries.filter(e => e.status === 'read').length,
    replied: enquiries.filter(e => e.status === 'replied').length,
    archived: enquiries.filter(e => e.status === 'archived').length,
  };

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days}d ago`;
    if (hrs > 0) return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'Just now';
  }

  return (
    <div>
      <style>{`
        .enq-row { transition: background 0.15s; cursor: pointer; }
        .enq-row:hover { background: var(--fog) !important; }
        .enq-row.active { background: rgba(201,136,42,0.06) !important; border-left: 3px solid var(--gold) !important; }
        .filter-tab { transition: all 0.15s; }
        .filter-tab:hover { color: var(--ink) !important; }
        .filter-tab.active { color: var(--ink) !important; border-bottom: 2px solid var(--gold) !important; }
        @media (max-width: 900px) {
          .enq-layout { grid-template-columns: 1fr !important; }
          .enq-detail-panel { display: none !important; }
          .enq-detail-panel.visible { display: block !important; position: fixed !important; inset: 0 !important; z-index: 200 !important; overflow-y: auto !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.3rem' }}>CRM</div>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '2rem', color: 'var(--ink)', margin: 0 }}>
            Enquiries
            {counts.new > 0 && <span style={{ marginLeft: '0.6rem', background: '#16a34a', color: 'white', borderRadius: 20, padding: '2px 9px', fontSize: '0.85rem', fontWeight: 700 }}>{counts.new} new</span>}
          </h1>
        </div>
        {/* Search */}
        <div style={{ position: 'relative', width: 260 }}>
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate)', fontSize: '0.8rem', pointerEvents: 'none' }}>⊕</span>
          <input type="text" placeholder="Search enquiries..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.1rem', paddingRight: '0.9rem', paddingTop: '0.55rem', paddingBottom: '0.55rem', border: '1.5px solid var(--mist)', borderRadius: 7, fontSize: '0.85rem', fontFamily: 'Barlow, sans-serif', outline: 'none', background: 'white', transition: 'border-color 0.2s' }}
            onFocus={e => (e.target.style.borderColor = 'var(--cobalt)')}
            onBlur={e => (e.target.style.borderColor = 'var(--mist)')} />
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--mist)', marginBottom: '1.2rem', overflowX: 'auto' }}>
        {(['all', 'new', 'read', 'replied', 'archived'] as const).map(s => (
          <button key={s} className={`filter-tab${filter === s ? ' active' : ''}`} onClick={() => setFilter(s)}
            style={{ padding: '0.6rem 1.1rem', background: 'none', border: 'none', borderBottom: '2px solid transparent', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.5px', cursor: 'pointer', whiteSpace: 'nowrap', color: filter === s ? 'var(--ink)' : 'var(--slate)', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            <span style={{ background: s === 'new' && counts.new > 0 ? '#16a34a' : 'var(--fog)', color: s === 'new' && counts.new > 0 ? 'white' : 'var(--slate)', borderRadius: 20, padding: '1px 7px', fontSize: '0.65rem', fontFamily: 'DM Mono, monospace' }}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Main layout — list + detail */}
      <div className="enq-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '1.2rem', alignItems: 'start' }}>
        {/* List */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--mist)', overflow: 'hidden', boxShadow: '0 2px 10px rgba(8,14,26,0.06)' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate)', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', letterSpacing: '1px' }}>LOADING…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--slate)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.6rem', opacity: 0.3 }}>📭</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1rem' }}>No enquiries found</div>
            </div>
          ) : (
            filtered.map((enq, i) => {
              const sc = STATUS_CONFIG[enq.status];
              const isActive = selected?.id === enq.id;
              return (
                <div key={enq.id} className={`enq-row${isActive ? ' active' : ''}`}
                  onClick={() => openEnquiry(enq)}
                  style={{ padding: '1rem 1.2rem', borderBottom: i < filtered.length - 1 ? '1px solid var(--fog)' : 'none', borderLeft: '3px solid transparent', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        {enq.status === 'new' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />}
                        <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{enq.name}</span>
                        {enq.company && <span style={{ fontSize: '0.75rem', color: 'var(--slate)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>· {enq.company}</span>}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: enq.status === 'new' ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.2rem' }}>
                        {enq.subject || 'General Enquiry'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {enq.message}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--slate)', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{timeAgo(enq.created_at)}</span>
                      <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: '1px 7px', borderRadius: 3, fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{sc.label}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail panel */}
        <div className={`enq-detail-panel${selected ? ' visible' : ''}`}
          style={{ background: 'white', borderRadius: 12, border: '1px solid var(--mist)', boxShadow: '0 2px 10px rgba(8,14,26,0.06)', position: 'sticky', top: 70 }}>
          {!selected ? (
            <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--slate)' }}>
              <div style={{ fontSize: '2rem', opacity: 0.25, marginBottom: '0.6rem' }}>📨</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1rem' }}>Select an enquiry to view</div>
            </div>
          ) : (
            <div>
              {/* Mobile close */}
              <div className="md-hidden" style={{ display: 'none' }}>
                <button onClick={() => setSelected(null)} style={{ padding: '0.5rem 1rem', background: 'var(--fog)', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700 }}>← Back to list</button>
              </div>

              {/* Header */}
              <div style={{ padding: '1.2rem 1.4rem', borderBottom: '1px solid var(--mist)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'var(--ink)' }}>{selected.name}</div>
                    {selected.company && <div style={{ fontSize: '0.82rem', color: 'var(--slate)', marginTop: '1px' }}>{selected.company}</div>}
                  </div>
                  <span style={{ background: STATUS_CONFIG[selected.status].bg, color: STATUS_CONFIG[selected.status].color, border: `1px solid ${STATUS_CONFIG[selected.status].border}`, padding: '3px 10px', borderRadius: 4, fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {STATUS_CONFIG[selected.status].label}
                  </span>
                </div>
              </div>

              {/* Contact info */}
              <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid var(--mist)', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {[
                  { icon: '✉', label: 'Email', val: selected.email, href: `mailto:${selected.email}` },
                  { icon: '📞', label: 'Phone', val: selected.phone || '—', href: selected.phone ? `tel:${selected.phone}` : undefined },
                  { icon: '🗓', label: 'Received', val: new Date(selected.created_at).toLocaleString() },
                  { icon: '📋', label: 'Subject', val: selected.subject || 'General Enquiry' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', width: 18, flexShrink: 0 }}>{row.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', letterSpacing: '1.5px', color: 'var(--slate)', textTransform: 'uppercase', marginRight: '0.5rem' }}>{row.label}</span>
                      {row.href ? (
                        <a href={row.href} style={{ fontSize: '0.85rem', color: 'var(--cobalt)', textDecoration: 'none', fontWeight: 500 }}>{row.val}</a>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--ink)' }}>{row.val}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message */}
              <div style={{ padding: '1.2rem 1.4rem', borderBottom: '1px solid var(--mist)' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '2px', color: 'var(--slate)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Message</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--ink)', lineHeight: 1.75, background: 'var(--fog)', borderRadius: 8, padding: '1rem', whiteSpace: 'pre-wrap' }}>{selected.message}</div>
              </div>

              {/* Quick reply */}
              <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid var(--mist)' }}>
                <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Your Enquiry')}&body=Dear ${encodeURIComponent(selected.name)},%0A%0AThank you for contacting Flowman Engineers.%0A%0A`}
                  onClick={() => updateStatus(selected.id, 'replied')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.7rem', background: 'var(--gold)', color: 'var(--ink)', borderRadius: 7, textDecoration: 'none', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.5px', transition: 'background 0.18s' }}>
                  ✉ Reply via Email
                </a>
              </div>

              {/* Status actions */}
              <div style={{ padding: '1rem 1.4rem' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', letterSpacing: '2px', color: 'var(--slate)', textTransform: 'uppercase', marginBottom: '0.7rem' }}>Update Status</div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                  {(['new', 'read', 'replied', 'archived'] as const).filter(s => s !== selected.status).map(s => {
                    const sc = STATUS_CONFIG[s];
                    return (
                      <button key={s} onClick={() => updateStatus(selected.id, s)} disabled={updating === selected.id}
                        style={{ padding: '0.3rem 0.85rem', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, borderRadius: 5, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', textTransform: 'capitalize' }}>
                        Mark {sc.label}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => deleteEnquiry(selected.id)} disabled={deleting === selected.id}
                  style={{ padding: '0.35rem 1rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 5, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', width: '100%' }}>
                  {deleting === selected.id ? 'Deleting…' : '🗑 Delete Enquiry'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}