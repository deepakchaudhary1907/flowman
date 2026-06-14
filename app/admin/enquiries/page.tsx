// ════════════════════════════════════════════════════════════
// app/admin/enquiries/page.tsx
// ════════════════════════════════════════════════════════════
'use client';
import { useState, useEffect } from 'react';

interface Enquiry { id: string; name: string; email: string; phone: string; company: string; subject: string; message: string; status: 'new'|'read'|'replied'|'archived'; created_at: string; }

const SC = {
  new:      { label: 'New',      bg: 'rgba(22,163,74,0.10)',  color: '#16a34a', border: 'rgba(22,163,74,0.28)' },
  read:     { label: 'Read',     bg: 'rgba(75,182,232,0.10)', color: '#1e8fc0', border: 'rgba(75,182,232,0.28)' },
  replied:  { label: 'Replied',  bg: 'rgba(30,143,192,0.10)', color: '#4bb6e8', border: 'rgba(30,143,192,0.28)' },
  archived: { label: 'Archived', bg: 'rgba(107,114,128,0.10)',color: '#6b7280', border: 'rgba(107,114,128,0.2)' },
};

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff/60000), h = Math.floor(m/60), day = Math.floor(h/24);
  return day>0?`${day}d ago`:h>0?`${h}h ago`:m>0?`${m}m ago`:'Just now';
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('all');
  const [selected,  setSelected]  = useState<Enquiry | null>(null);
  const [search,    setSearch]    = useState('');
  const [updating,  setUpdating]  = useState<string|null>(null);
  const [deleting,  setDeleting]  = useState<string|null>(null);
  const [showDetail,setShowDetail]= useState(false);

  const load = (status = filter) => {
    setLoading(true);
    fetch(`/api/enquiries${status!=='all'?`?status=${status}`:''}`)
      .then(r => r.json()).then(d => { setEnquiries(d); setLoading(false); });
  };
  useEffect(() => { load(); }, [filter]);

  async function openEnquiry(enq: Enquiry) {
    setSelected(enq); setShowDetail(true);
    if (enq.status === 'new') await updateStatus(enq.id, 'read');
  }
  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    const res = await fetch(`/api/enquiries/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    if (res.ok) {
      setEnquiries(prev => prev.map(e => e.id===id ? { ...e, status: status as Enquiry['status'] } : e));
      if (selected?.id===id) setSelected(prev => prev ? { ...prev, status: status as Enquiry['status'] } : null);
    }
    setUpdating(null);
  }
  async function deleteEnquiry(id: string) {
    if (!confirm('Delete this enquiry permanently?')) return;
    setDeleting(id);
    const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
    if (res.ok) { setEnquiries(prev => prev.filter(e => e.id!==id)); if (selected?.id===id) { setSelected(null); setShowDetail(false); } }
    setDeleting(null);
  }

  const filtered = enquiries.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    (e.company||'').toLowerCase().includes(search.toLowerCase()) ||
    (e.subject||'').toLowerCase().includes(search.toLowerCase())
  );
  const counts = { all: enquiries.length, new: enquiries.filter(e=>e.status==='new').length, read: enquiries.filter(e=>e.status==='read').length, replied: enquiries.filter(e=>e.status==='replied').length, archived: enquiries.filter(e=>e.status==='archived').length };

  return (
    <div>
      <style>{`
        .enq-row { transition: background .15s; cursor: pointer; }
        .enq-row:hover { background: #f4f6f8 !important; }
        .enq-row.sel { background: rgba(75,182,232,0.06) !important; border-left: 3px solid #4bb6e8 !important; }
        .ftab { transition: color .15s; }
        .ftab:hover { color: #1e2229 !important; }
        .ftab.active { color: #1e2229 !important; border-bottom: 2px solid #4bb6e8 !important; }

        .enq-layout { display: grid; grid-template-columns: 1fr 400px; gap: 1rem; align-items: start; }
        .enq-detail { position: sticky; top: 70px; }

        @media (max-width: 1024px) {
          .enq-layout { grid-template-columns: 1fr; }
          .enq-detail { position: fixed; inset: 0; z-index: 400; overflow-y: auto; border-radius: 0 !important; display: none; }
          .enq-detail.open { display: block; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#8a9baa', marginBottom: 4 }}>CRM</div>
          <h1 style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.1rem)', color: '#1e2229', margin: 0 }}>
            Enquiries
            {counts.new > 0 && <span style={{ marginLeft: 8, background: '#16a34a', color: '#fff', borderRadius: 20, padding: '2px 9px', fontSize: '0.85rem', fontWeight: 700 }}>{counts.new} new</span>}
          </h1>
        </div>
        <div style={{ position: 'relative', width: 240 }}>
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#8a9baa', fontSize: '0.8rem', pointerEvents: 'none' }}>⊕</span>
          <input type="text" placeholder="Search enquiries…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.1rem', paddingRight: '0.9rem', paddingTop: '0.55rem', paddingBottom: '0.55rem', border: '1.5px solid #dde2e8', borderRadius: 7, fontSize: '0.85rem', fontFamily: "'Barlow',Arial,sans-serif", outline: 'none', background: '#fff', transition: 'border-color .2s' }}
            onFocus={e => (e.target.style.borderColor='#4bb6e8')} onBlur={e => (e.target.style.borderColor='#dde2e8')} />
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #dde2e8', marginBottom: '1.2rem', overflowX: 'auto' }}>
        {(['all','new','read','replied','archived'] as const).map(s => (
          <button key={s} className={`ftab${filter===s?' active':''}`} onClick={() => setFilter(s)}
            style={{ padding: '0.6rem 1.1rem', background: 'none', border: 'none', borderBottom: '2px solid transparent', fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', whiteSpace: 'nowrap', color: filter===s?'#1e2229':'#8a9baa', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 6 }}>
            {s.charAt(0).toUpperCase()+s.slice(1)}
            <span style={{ background: s==='new'&&counts.new>0?'#16a34a':'#f4f6f8', color: s==='new'&&counts.new>0?'#fff':'#8a9baa', borderRadius: 20, padding: '1px 7px', fontSize: '0.62rem', fontFamily: "'DM Mono',monospace" }}>{counts[s]}</span>
          </button>
        ))}
      </div>

      <div className="enq-layout">
        {/* List */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #dde2e8', overflow: 'hidden', boxShadow: '0 2px 10px rgba(30,34,41,0.06)' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#8a9baa', fontFamily: "'DM Mono',monospace", fontSize: '0.75rem', letterSpacing: '1px' }}>LOADING…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: '#8a9baa' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8, opacity: 0.3 }}>📭</div>
              <div style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontSize: '1rem' }}>No enquiries found</div>
            </div>
          ) : filtered.map((enq, i) => {
            const sc = SC[enq.status];
            return (
              <div key={enq.id} className={`enq-row${selected?.id===enq.id?' sel':''}`}
                onClick={() => openEnquiry(enq)}
                style={{ padding: '1rem 1.2rem', borderBottom: i<filtered.length-1?'1px solid #f4f6f8':'none', borderLeft: '3px solid transparent', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      {enq.status==='new' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />}
                      <span style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#1e2229', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{enq.name}</span>
                      {enq.company && <span style={{ fontSize: '0.75rem', color: '#8a9baa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>· {enq.company}</span>}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#4b5563', fontWeight: enq.status==='new'?600:400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{enq.subject||'General Enquiry'}</div>
                    <div style={{ fontSize: '0.78rem', color: '#8a9baa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{enq.message}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.6rem', color: '#8a9baa', whiteSpace: 'nowrap' }}>{timeAgo(enq.created_at)}</span>
                    <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: '1px 7px', borderRadius: 3, fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{sc.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className={`enq-detail${showDetail?' open':''}`} style={{ background: '#fff', borderRadius: 12, border: '1px solid #dde2e8', boxShadow: '0 2px 10px rgba(30,34,41,0.06)' }}>
          {!selected ? (
            <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#8a9baa' }}>
              <div style={{ fontSize: '2rem', opacity: .25, marginBottom: 8 }}>📨</div>
              <div style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontSize: '1rem' }}>Select an enquiry to view</div>
            </div>
          ) : (
            <div>
              {/* Mobile back */}
              <button onClick={() => { setShowDetail(false); setSelected(null); }}
                style={{ display: 'none', width: '100%', padding: '0.65rem 1rem', background: '#f4f6f8', border: 'none', borderBottom: '1px solid #dde2e8', cursor: 'pointer', fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#1e2229', textAlign: 'left' }}
                className="mob-back">
                ← Back to list
              </button>
              <style>{`.mob-back { display: block !important; } @media(min-width:1025px){.mob-back{display:none!important;}}`}</style>

              <div style={{ padding: '1.2rem 1.4rem', borderBottom: '1px solid #dde2e8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#1e2229' }}>{selected.name}</div>
                    {selected.company && <div style={{ fontSize: '0.82rem', color: '#8a9baa', marginTop: 1 }}>{selected.company}</div>}
                  </div>
                  <span style={{ background: SC[selected.status].bg, color: SC[selected.status].color, border: `1px solid ${SC[selected.status].border}`, padding: '3px 10px', borderRadius: 4, fontFamily: "'DM Mono',monospace", fontSize: '0.58rem', letterSpacing: '1px', textTransform: 'uppercase', flexShrink: 0 }}>{SC[selected.status].label}</span>
                </div>
              </div>

              <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #dde2e8', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon:'✉', label:'Email',    val: selected.email,    href:`mailto:${selected.email}` },
                  { icon:'📞', label:'Phone',    val: selected.phone||'—', href: selected.phone?`tel:${selected.phone}`:undefined },
                  { icon:'🗓', label:'Received', val: new Date(selected.created_at).toLocaleString() },
                  { icon:'📋', label:'Subject',  val: selected.subject||'General Enquiry' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.82rem', width: 18, flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', letterSpacing: '1.5px', color: '#8a9baa', textTransform: 'uppercase', marginRight: 6 }}>{row.label}</span>
                      {row.href ? <a href={row.href} style={{ fontSize: '0.85rem', color: '#4bb6e8', textDecoration: 'none', fontWeight: 500 }}>{row.val}</a>
                        : <span style={{ fontSize: '0.85rem', color: '#1e2229' }}>{row.val}</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '1.2rem 1.4rem', borderBottom: '1px solid #dde2e8' }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', letterSpacing: '2px', color: '#8a9baa', textTransform: 'uppercase', marginBottom: 8 }}>Message</div>
                <div style={{ fontSize: '0.88rem', color: '#1e2229', lineHeight: 1.75, background: '#f4f6f8', borderRadius: 8, padding: '1rem', whiteSpace: 'pre-wrap', fontFamily: "'Barlow',Arial,sans-serif" }}>{selected.message}</div>
              </div>

              <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #dde2e8' }}>
                <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject||'Your Enquiry')}&body=Dear ${encodeURIComponent(selected.name)},%0A%0AThank you for contacting Flowman Engineers.%0A%0A`}
                  onClick={() => updateStatus(selected.id,'replied')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0.68rem', background: '#4bb6e8', color: '#071520', borderRadius: 7, textDecoration: 'none', fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 800, fontSize: '0.9rem', transition: 'background .18s' }}
                  onMouseEnter={e=>(e.currentTarget.style.background='#2a9fd6')} onMouseLeave={e=>(e.currentTarget.style.background='#4bb6e8')}>
                  ✉ Reply via Email
                </a>
              </div>

              <div style={{ padding: '1rem 1.4rem' }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', letterSpacing: '2px', color: '#8a9baa', textTransform: 'uppercase', marginBottom: 8 }}>Update Status</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {(['new','read','replied','archived'] as const).filter(s => s!==selected.status).map(s => {
                    const sc = SC[s];
                    return (
                      <button key={s} onClick={() => updateStatus(selected.id,s)} disabled={updating===selected.id}
                        style={{ padding: '0.3rem 0.85rem', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, borderRadius: 5, fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', textTransform: 'capitalize' }}>
                        Mark {sc.label}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => deleteEnquiry(selected.id)} disabled={deleting===selected.id}
                  style={{ padding: '0.35rem 1rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 5, fontFamily: "'Barlow Condensed',Arial,sans-serif", fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', width: '100%' }}>
                  {deleting===selected.id?'Deleting…':'🗑 Delete Enquiry'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// export { EnquiriesPage as default };