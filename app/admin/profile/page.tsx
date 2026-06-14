// app/admin/profile/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';

interface AdminUser { id: string; username: string; email: string; full_name: string; role: string; is_active: boolean; last_login: string | null; created_at: string; avatar_url?: string; }
interface ActivityEntry { id: string; username: string; action: string; entity_type: string; entity_name: string; created_at: string; }

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff/60000), h = Math.floor(m/60), day = Math.floor(h/24);
  return day>0?`${day}d ago`:h>0?`${h}h ago`:m>0?`${m}m ago`:'Just now';
}

export default function ProfilePage() {
  const [tab,        setTab]        = useState<'profile'|'password'|'users'|'activity'>('profile');
  const [users,      setUsers]      = useState<AdminUser[]>([]);
  const [activity,   setActivity]   = useState<ActivityEntry[]>([]);
  const [actLoading, setActLoading] = useState(false);

  const [editing,      setEditing]      = useState(false);
  const [profileDraft, setProfileDraft] = useState({ full_name: '', email: '' });
  const [profileMsg,   setProfileMsg]   = useState<{ type: 'success'|'error'; text: string } | null>(null);
  const [profileSaving,setProfileSaving]= useState(false);

  const [avatarUrl,      setAvatarUrl]      = useState('');
  const [avatarUploading,setAvatarUploading]= useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);

  const [pwForm,  setPwForm]  = useState({ current: '', newPw: '', confirm: '' });
  const [pwMsg,   setPwMsg]   = useState<{ type: 'success'|'error'; text: string } | null>(null);
  const [pwLoading,setPwLoading]= useState(false);

  const [newUser,        setNewUser]        = useState({ username: '', email: '', password: '', fullName: '', role: 'admin' });
  const [newUserMsg,     setNewUserMsg]     = useState<{ type: 'success'|'error'; text: string } | null>(null);
  const [newUserLoading, setNewUserLoading] = useState(false);
  const [showNewUser,    setShowNewUser]    = useState(false);
  const [deleting,       setDeleting]       = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.ok?r.json():[]).then(d => { if (Array.isArray(d)) setUsers(d); });
    fetch('/api/admin/avatar').then(r => r.ok?r.json():{ url:null }).then(d => { if (d.url) setAvatarUrl(d.url); });
  }, []);

  useEffect(() => {
    if (tab === 'activity') {
      setActLoading(true);
      fetch('/api/activity').then(r => r.ok?r.json():{ entries:[] }).then(d => {
        setActivity(d.entries||(Array.isArray(d)?d:[])); setActLoading(false);
      });
    }
  }, [tab]);

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setAvatarUploading(true);
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/admin/avatar', { method: 'POST', body: fd });
    const d = await res.json();
    if (res.ok) setAvatarUrl(d.url);
    setAvatarUploading(false);
  }

  async function saveProfile(userId: string) {
    setProfileSaving(true); setProfileMsg(null);
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fullName: profileDraft.full_name, email: profileDraft.email }) });
    setProfileSaving(false);
    if (res.ok) { const u = await res.json(); setUsers(prev => prev.map(x => x.id===userId?{ ...x,...u }:x)); setEditing(false); setProfileMsg({ type:'success', text:'Profile updated successfully.' }); }
    else { const err = await res.json(); setProfileMsg({ type:'error', text: err.error||'Failed to update.' }); }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault(); setPwMsg(null);
    if (pwForm.newPw.length < 6) { setPwMsg({ type:'error', text:'At least 6 characters.' }); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg({ type:'error', text:'Passwords do not match.' }); return; }
    setPwLoading(true);
    const res = await fetch('/api/admin/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }) });
    setPwLoading(false);
    const d = await res.json();
    if (res.ok) { setPwMsg({ type:'success', text:'Password changed successfully!' }); setPwForm({ current:'', newPw:'', confirm:'' }); }
    else setPwMsg({ type:'error', text: d.error||'Failed.' });
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault(); setNewUserMsg(null); setNewUserLoading(true);
    const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser) });
    setNewUserLoading(false);
    const d = await res.json();
    if (res.ok) { setUsers(prev => [...prev,d]); setNewUser({ username:'',email:'',password:'',fullName:'',role:'admin' }); setShowNewUser(false); setNewUserMsg({ type:'success', text:`User "${d.username}" created.` }); }
    else setNewUserMsg({ type:'error', text: d.error||'Failed.' });
  }

  async function deactivateUser(userId: string, username: string) {
    if (!confirm(`Deactivate "${username}"?`)) return;
    setDeleting(userId);
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
    if (res.ok) setUsers(prev => prev.map(u => u.id===userId?{ ...u, is_active:false }:u));
    setDeleting(null);
  }

  const inp: React.CSSProperties = { width:'100%', padding:'0.7rem 0.95rem', border:'1.5px solid #dde2e8', borderRadius:7, fontSize:'0.88rem', fontFamily:"'Barlow',Arial,sans-serif", outline:'none', color:'#1e2229', background:'#fff', transition:'border-color .2s, box-shadow .2s', boxSizing:'border-box' };
  const inpRO: React.CSSProperties = { ...inp, background:'#f4f6f8', color:'#6b7280', cursor:'default' };
  const lbl: React.CSSProperties = { display:'block', fontFamily:"'DM Mono',monospace", fontSize:'0.54rem', letterSpacing:'2.5px', textTransform:'uppercase', color:'#8a9baa', marginBottom:'0.4rem' };

  const msgBox = (m: { type: string; text: string }): React.CSSProperties => ({
    background: m.type==='success' ? 'rgba(22,163,74,0.07)' : '#fef2f2',
    border: `1px solid ${m.type==='success'?'rgba(22,163,74,0.22)':'#fecaca'}`,
    color: m.type==='success' ? '#16a34a' : '#dc2626',
    padding: '0.72rem 1rem', borderRadius: 7, fontSize: '0.84rem',
    fontFamily:"'Barlow',Arial,sans-serif",
    marginBottom: '1.1rem', display: 'flex', alignItems: 'center', gap: 8,
  });

  const me = users[0];

  const TABS = [
    { key:'profile',  label:'My Profile',      icon:'👤' },
    { key:'password', label:'Change Password',  icon:'🔒' },
    { key:'users',    label:'Manage Users',     icon:'👥' },
    { key:'activity', label:'Activity Log',     icon:'📋' },
  ] as const;

  return (
    <div>
      <style>{`
        .tab-btn { transition: all .18s; border: 1.5px solid #dde2e8; background: #fff; color: #1e2229; }
        .tab-btn:hover { background: #f4f6f8 !important; }
        .tab-btn.active { background: #1e2229 !important; color: #fff !important; border-color: #1e2229 !important; }
        .inp-f:focus { border-color: #4bb6e8 !important; box-shadow: 0 0 0 3px rgba(75,182,232,0.12) !important; }
        .avatar-wrap:hover .av-overlay { opacity: 1 !important; }
        .urow { transition: background .15s; }
        .urow:hover { background: #f4f6f8 !important; }

        .prof-grid { display: grid; grid-template-columns: 240px 1fr; gap: 1.25rem; }
        .form-2    { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .users-tbl th:nth-child(3), .users-tbl td:nth-child(3),
        .users-tbl th:nth-child(4), .users-tbl td:nth-child(4) { display: table-cell; }

        @media (max-width: 900px) {
          .prof-grid { grid-template-columns: 1fr; }
          .users-tbl th:nth-child(3), .users-tbl td:nth-child(3),
          .users-tbl th:nth-child(4), .users-tbl td:nth-child(4) { display: none; }
        }
        @media (max-width: 600px) {
          .form-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.58rem', letterSpacing:'3px', textTransform:'uppercase', color:'#8a9baa', marginBottom:4 }}>Settings</div>
        <h1 style={{ fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:800, fontSize:'clamp(1.6rem,3vw,2.1rem)', color:'#1e2229', margin:0 }}>Profile & Users</h1>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display:'flex', gap:8, marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t.key} className={`tab-btn${tab===t.key?' active':''}`}
            onClick={() => setTab(t.key)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'0.52rem 1rem', borderRadius:7, fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:700, fontSize:'0.84rem', cursor:'pointer' }}>
            <span style={{ fontSize:'0.82rem' }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {tab === 'profile' && (
        <div className="prof-grid">
          {/* Left card */}
          <div style={{ background:'#fff', borderRadius:14, border:'1px solid #dde2e8', overflow:'hidden', boxShadow:'0 2px 12px rgba(30,34,41,0.07)' }}>
            <div style={{ height:68, background:'linear-gradient(135deg,#1e2229,#2d3440)', position:'relative' }}>
              <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(75,182,232,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(75,182,232,0.05) 1px,transparent 1px)', backgroundSize:'18px 18px' }} />
            </div>
            <div style={{ padding:'0 1.3rem 1.3rem', marginTop:-28 }}>
              {/* Avatar */}
              <div className="avatar-wrap" style={{ position:'relative', display:'inline-block', marginBottom:'0.8rem', cursor:'pointer' }} onClick={() => avatarRef.current?.click()}>
                <div style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#4bb6e8,#1e8fc0)', border:'3px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.15)', overflow:'hidden' }}>
                  {avatarUrl
                    ? <img src={avatarUrl} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:'1.2rem', color:'#fff' }}>{me?.full_name?.[0]?.toUpperCase()||'A'}</span>}
                </div>
                <div className="av-overlay" style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity .2s' }}>
                  {avatarUploading ? <span style={{ fontSize:'0.6rem', color:'#fff', fontFamily:"'DM Mono',monospace" }}>…</span> : <span style={{ fontSize:'0.85rem' }}>📷</span>}
                </div>
                <input ref={avatarRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadAvatar} style={{ display:'none' }} />
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.5rem', color:'#8a9baa', marginBottom:'0.65rem', letterSpacing:'1px' }}>Click avatar to change</div>

              <div style={{ fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:800, fontSize:'1.1rem', color:'#1e2229' }}>{me?.full_name||'Administrator'}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.52rem', letterSpacing:'2px', color:'#4bb6e8', textTransform:'uppercase', marginTop:2, marginBottom:'0.8rem' }}>{me?.role||'superadmin'}</div>

              {[
                { icon:'✉', val: me?.email||'' },
                { icon:'🏢', val:'Flowman Engineers' },
                { icon:'📍', val:'Vadodara, Gujarat' },
              ].map(r => (
                <div key={r.icon} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:5 }}>
                  <span style={{ fontSize:'0.7rem', opacity:.5, marginTop:1 }}>{r.icon}</span>
                  <span style={{ fontFamily:"'Barlow',Arial,sans-serif", fontSize:'0.78rem', color:'#6b7280', lineHeight:1.4 }}>{r.val}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop:'1px solid #dde2e8', padding:'1rem 1.3rem' }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.52rem', letterSpacing:'2.5px', textTransform:'uppercase', color:'#8a9baa', marginBottom:'0.75rem' }}>Account Info</div>
              {[
                { label:'Account Type', val:'Administrator' },
                { label:'Username',     val: me?.username||'admin' },
                { label:'Session',      val:'Active' },
                { label:'Last Login',   val: me?.last_login ? new Date(me.last_login).toLocaleDateString() : 'Today' },
              ].map(row => (
                <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.4rem 0', borderBottom:'1px solid #f4f6f8' }}>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.56rem', letterSpacing:'1px', color:'#8a9baa', textTransform:'uppercase' }}>{row.label}</span>
                  <span style={{ fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:700, fontSize:'0.85rem', color:'#1e2229' }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div style={{ background:'#fff', borderRadius:14, border:'1px solid #dde2e8', overflow:'hidden', boxShadow:'0 2px 12px rgba(30,34,41,0.07)' }}>
            <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid #dde2e8', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:700, fontSize:'1.05rem', color:'#1e2229' }}>Profile Information</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.54rem', letterSpacing:'1.5px', color:'#8a9baa', textTransform:'uppercase', marginTop:1 }}>Manage your account details</div>
              </div>
              {!editing && (
                <button onClick={() => { setProfileDraft({ full_name:me?.full_name||'', email:me?.email||'' }); setEditing(true); setProfileMsg(null); }}
                  style={{ padding:'0.42rem 1rem', borderRadius:7, border:'1.5px solid #4bb6e8', background:'#fff', color:'#4bb6e8', fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:700, fontSize:'0.82rem', cursor:'pointer' }}>
                  ✎ Edit
                </button>
              )}
            </div>
            <div style={{ padding:'1.4rem' }}>
              {profileMsg && <div style={msgBox(profileMsg)}>{profileMsg.type==='success'?'✓':'⚠'} {profileMsg.text}</div>}
              <div className="form-2">
                {([
                  { key:'full_name', label:'Full Name',     draft:'full_name' as const },
                  { key:'email',     label:'Email Address', draft:'email' as const },
                ] as const).map(f => (
                  <div key={f.key}>
                    <label style={lbl}>{f.label}</label>
                    <input className="inp-f" readOnly={!editing}
                      value={editing ? profileDraft[f.draft] : ((me?.[f.key as keyof AdminUser] as string)||'')}
                      onChange={e => setProfileDraft(d => ({ ...d, [f.draft]: e.target.value }))}
                      style={editing ? inp : inpRO} />
                  </div>
                ))}
                {[
                  { label:'Username',        val: me?.username||'admin' },
                  { label:'Role',            val: me?.role||'superadmin' },
                  { label:'Account Created', val: me?.created_at ? new Date(me.created_at).toLocaleDateString() : '—' },
                  { label:'Last Login',      val: me?.last_login ? new Date(me.last_login).toLocaleString() : 'First login' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={lbl}>{f.label}</label>
                    <input readOnly value={f.val} style={inpRO} />
                  </div>
                ))}
              </div>
              {editing && (
                <div style={{ marginTop:'1.3rem', paddingTop:'1.1rem', borderTop:'1px solid #dde2e8', display:'flex', gap:8 }}>
                  <button onClick={() => me && saveProfile(me.id)} disabled={profileSaving}
                    style={{ padding:'0.65rem 1.7rem', background: profileSaving ? '#dde2e8' : '#4bb6e8', color: profileSaving ? '#8a9baa' : '#071520', border:'none', borderRadius:7, fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:800, fontSize:'0.88rem', cursor:'pointer', transition:'background .18s' }}>
                    {profileSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button onClick={() => { setEditing(false); setProfileMsg(null); }}
                    style={{ padding:'0.65rem 1.3rem', background:'#f4f6f8', color:'#8a9baa', border:'1.5px solid #dde2e8', borderRadius:7, fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:700, fontSize:'0.88rem', cursor:'pointer' }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PASSWORD TAB ── */}
      {tab === 'password' && (
        <div style={{ maxWidth:500, background:'#fff', borderRadius:14, border:'1px solid #dde2e8', overflow:'hidden', boxShadow:'0 2px 12px rgba(30,34,41,0.07)' }}>
          <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid #dde2e8' }}>
            <div style={{ fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:700, fontSize:'1.05rem', color:'#1e2229' }}>Change Password</div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.54rem', letterSpacing:'1.5px', color:'#8a9baa', textTransform:'uppercase', marginTop:1 }}>Update your admin password</div>
          </div>
          <div style={{ padding:'1.4rem' }}>
            {pwMsg && <div style={msgBox(pwMsg)}>{pwMsg.type==='success'?'✓':'⚠'} {pwMsg.text}</div>}
            <form onSubmit={changePassword} style={{ display:'flex', flexDirection:'column', gap:'0.95rem' }}>
              {[
                { key:'current', label:'Current Password', ph:'Enter current password' },
                { key:'newPw',   label:'New Password',     ph:'Minimum 6 characters'  },
                { key:'confirm', label:'Confirm Password', ph:'Repeat new password'   },
              ].map(f => (
                <div key={f.key}>
                  <label style={lbl}>{f.label}</label>
                  <input className="inp-f" type="password" required placeholder={f.ph}
                    value={pwForm[f.key as keyof typeof pwForm]}
                    onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={inp} />
                </div>
              ))}
              <button type="submit" disabled={pwLoading}
                style={{ padding:'0.7rem 2rem', background: pwLoading?'#dde2e8':'#4bb6e8', color: pwLoading?'#8a9baa':'#071520', border:'none', borderRadius:7, fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:800, fontSize:'0.88rem', cursor: pwLoading?'not-allowed':'pointer', alignSelf:'flex-start', transition:'background .18s' }}>
                {pwLoading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
            <div style={{ marginTop:'1.4rem', padding:'0.9rem 1rem', background:'#f4f6f8', borderRadius:8, border:'1px solid #dde2e8' }}>
              <div style={{ fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:700, fontSize:'0.85rem', color:'#1e2229', marginBottom:'0.45rem' }}>Password Tips</div>
              {['At least 6 characters','Mix letters, numbers & symbols','Avoid personal information'].map(tip => (
                <div key={tip} style={{ display:'flex', gap:6, alignItems:'center', marginBottom:4 }}>
                  <span style={{ color:'#4bb6e8', fontSize:'0.6rem' }}>▸</span>
                  <span style={{ fontFamily:"'Barlow',Arial,sans-serif", fontSize:'0.78rem', color:'#6b7280' }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── USERS TAB ── */}
      {tab === 'users' && (
        <div>
          {newUserMsg && <div style={{ ...msgBox(newUserMsg), marginBottom:'1.2rem' }}>{newUserMsg.type==='success'?'✓':'⚠'} {newUserMsg.text}</div>}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.1rem', flexWrap:'wrap', gap:'0.75rem' }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:700, fontSize:'1.05rem', color:'#1e2229' }}>Admin Users</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.54rem', letterSpacing:'1.5px', color:'#8a9baa', textTransform:'uppercase' }}>{users.length} user{users.length!==1?'s':''}</div>
            </div>
            <button onClick={() => setShowNewUser(!showNewUser)}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'0.55rem 1.1rem', background:'#4bb6e8', color:'#071520', border:'none', borderRadius:7, fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:700, fontSize:'0.84rem', cursor:'pointer', transition:'background .18s' }}
              onMouseEnter={e=>(e.currentTarget.style.background='#2a9fd6')} onMouseLeave={e=>(e.currentTarget.style.background='#4bb6e8')}>
              {showNewUser ? '✕ Cancel' : '+ Add User'}
            </button>
          </div>

          {showNewUser && (
            <div style={{ background:'#fff', borderRadius:12, border:'1px solid #dde2e8', padding:'1.4rem', marginBottom:'1.1rem', boxShadow:'0 2px 10px rgba(30,34,41,0.06)' }}>
              <div style={{ fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:700, fontSize:'1rem', color:'#1e2229', marginBottom:'1.1rem', borderBottom:'2.5px solid #4bb6e8', paddingBottom:'0.35rem', display:'inline-block' }}>New Admin User</div>
              <form onSubmit={createUser}>
                <div className="form-2" style={{ marginBottom:'0.9rem' }}>
                  {[
                    { key:'username', label:'Username *',  ph:'e.g. john_doe',        type:'text'     },
                    { key:'email',    label:'Email *',     ph:'user@example.com',     type:'text'     },
                    { key:'fullName', label:'Full Name',   ph:'Full name',            type:'text'     },
                    { key:'password', label:'Password *',  ph:'Min. 6 characters',    type:'password' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={lbl}>{f.label}</label>
                      <input className="inp-f" type={f.type} placeholder={f.ph} required={f.key!=='fullName'}
                        value={newUser[f.key as keyof typeof newUser]}
                        onChange={e => setNewUser(u => ({ ...u, [f.key]: e.target.value }))}
                        style={inp} />
                    </div>
                  ))}
                  <div>
                    <label style={lbl}>Role</label>
                    <select value={newUser.role} onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))} style={{ ...inp, background:'#fff' }}>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={newUserLoading}
                  style={{ padding:'0.6rem 1.7rem', background: newUserLoading?'#dde2e8':'#4bb6e8', color: newUserLoading?'#8a9baa':'#071520', border:'none', borderRadius:7, fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:800, fontSize:'0.86rem', cursor: newUserLoading?'not-allowed':'pointer' }}>
                  {newUserLoading ? 'Creating…' : 'Create User'}
                </button>
              </form>
            </div>
          )}

          <div style={{ background:'#fff', borderRadius:12, border:'1px solid #dde2e8', overflow:'auto', boxShadow:'0 2px 10px rgba(30,34,41,0.06)' }}>
            <table className="users-tbl" style={{ width:'100%', borderCollapse:'collapse', minWidth:460 }}>
              <thead>
                <tr style={{ background:'#1e2229' }}>
                  {['User','Role','Status','Last Login','Created','Actions'].map((h,i) => (
                    <th key={h} style={{ padding:'0.8rem 1rem', textAlign: i===5?'right':'left', fontFamily:"'DM Mono',monospace", fontWeight:500, fontSize:'0.54rem', letterSpacing:'2px', textTransform:'uppercase', color:'#8a9baa', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} className="urow" style={{ borderBottom: i<users.length-1?'1px solid #f4f6f8':'none', background:'#fff' }}>
                    <td style={{ padding:'0.82rem 1rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#4bb6e8,#1e8fc0)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
                          {u.avatar_url ? <img src={u.avatar_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:'0.82rem', color:'#fff' }}>{u.username[0].toUpperCase()}</span>}
                        </div>
                        <div>
                          <div style={{ fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:700, fontSize:'0.92rem', color:'#1e2229', whiteSpace:'nowrap' }}>{u.full_name||u.username}</div>
                          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.57rem', color:'#8a9baa', marginTop:1 }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:'0.82rem 1rem' }}>
                      <span style={{ background: u.role==='superadmin'?'rgba(75,182,232,0.10)':'rgba(30,143,192,0.08)', color: u.role==='superadmin'?'#4bb6e8':'#1e8fc0', border:`1px solid ${u.role==='superadmin'?'rgba(75,182,232,0.25)':'rgba(30,143,192,0.2)'}`, padding:'2px 8px', borderRadius:3, fontFamily:"'DM Mono',monospace", fontSize:'0.57rem', letterSpacing:'1px', textTransform:'uppercase', whiteSpace:'nowrap' }}>{u.role}</span>
                    </td>
                    <td style={{ padding:'0.82rem 1rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <div style={{ width:7, height:7, borderRadius:'50%', background: u.is_active?'#16a34a':'#dc2626', flexShrink:0 }} />
                        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.6rem', color: u.is_active?'#16a34a':'#dc2626' }}>{u.is_active?'Active':'Inactive'}</span>
                      </div>
                    </td>
                    <td style={{ padding:'0.82rem 1rem', fontFamily:"'DM Mono',monospace", fontSize:'0.62rem', color:'#8a9baa', whiteSpace:'nowrap' }}>{u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}</td>
                    <td style={{ padding:'0.82rem 1rem', fontFamily:"'DM Mono',monospace", fontSize:'0.62rem', color:'#8a9baa', whiteSpace:'nowrap' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td style={{ padding:'0.82rem 1rem', textAlign:'right' }}>
                      {u.is_active
                        ? <button onClick={() => deactivateUser(u.id, u.username)} disabled={deleting===u.id} style={{ padding:'0.28rem 0.72rem', fontSize:'0.7rem', fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:700, color:'#dc2626', border:'1px solid #fecaca', borderRadius:5, cursor:'pointer', background:'#fef2f2', whiteSpace:'nowrap' }}>{deleting===u.id?'…':'Deactivate'}</button>
                        : <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.57rem', color:'#dc2626' }}>Inactive</span>}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={6} style={{ padding:'3rem', textAlign:'center', color:'#8a9baa', fontFamily:"'Barlow Condensed',Arial,sans-serif" }}>No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ACTIVITY TAB ── */}
      {tab === 'activity' && (
        <div style={{ background:'#fff', borderRadius:14, border:'1px solid #dde2e8', overflow:'hidden', boxShadow:'0 2px 12px rgba(30,34,41,0.07)' }}>
          <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid #dde2e8', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:700, fontSize:'1.05rem', color:'#1e2229' }}>Activity Log</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.54rem', letterSpacing:'1.5px', color:'#8a9baa', textTransform:'uppercase', marginTop:1 }}>Admin actions</div>
            </div>
            <button onClick={() => { setActLoading(true); fetch('/api/activity').then(r=>r.json()).then(d=>{ setActivity(d.entries||(Array.isArray(d)?d:[])); setActLoading(false); }); }}
              style={{ padding:'0.42rem 0.9rem', border:'1.5px solid #dde2e8', borderRadius:6, background:'#f4f6f8', fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:700, fontSize:'0.8rem', cursor:'pointer', color:'#1e2229' }}>
              ↻ Refresh
            </button>
          </div>
          {actLoading ? (
            <div style={{ padding:'3rem', textAlign:'center', fontFamily:"'DM Mono',monospace", fontSize:'0.72rem', letterSpacing:'1px', color:'#8a9baa' }}>LOADING…</div>
          ) : activity.length === 0 ? (
            <div style={{ padding:'3.5rem', textAlign:'center', color:'#8a9baa' }}>
              <div style={{ fontSize:'2rem', opacity:.25, marginBottom:8 }}>📋</div>
              <div style={{ fontFamily:"'Barlow Condensed',Arial,sans-serif", fontSize:'1rem' }}>No activity recorded yet.</div>
            </div>
          ) : activity.map((item, i) => (
            <div key={item.id} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'0.9rem 1.4rem', borderBottom: i<activity.length-1?'1px solid #f4f6f8':'none' }}>
              <div style={{ width:36, height:36, borderRadius:9, background:'#f4f6f8', border:'1px solid #dde2e8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>
                {({ auth:'🔐', product:'⚙', category:'📂', enquiry:'📨' } as Record<string,string>)[item.entity_type] ?? '◉'}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Barlow Condensed',Arial,sans-serif", fontWeight:700, fontSize:'0.92rem', color:'#1e2229' }}>{item.action}</div>
                {item.entity_name && <div style={{ fontFamily:"'Barlow',Arial,sans-serif", fontSize:'0.78rem', color:'#8a9baa', marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.entity_name}</div>}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.6rem', color:'#8a9baa' }}>{timeAgo(item.created_at)}</span>
                {i===0 && <div style={{ width:7, height:7, borderRadius:'50%', background:'#16a34a' }} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}