'use client';
import { useState, useEffect, useRef } from 'react';

interface AdminUser { id: string; username: string; email: string; full_name: string; role: string; is_active: boolean; last_login: string | null; created_at: string; avatar_url?: string; }
interface ActivityEntry { id: string; username: string; action: string; entity_type: string; entity_name: string; created_at: string; }

const ACTION_ICONS: Record<string, string> = {
  auth: '🔐', product: '⚙', category: '📂', enquiry: '📨', default: '◉',
};

export default function ProfilePage() {
  const [tab, setTab] = useState<'profile' | 'password' | 'users' | 'activity'>('profile');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [actLoading, setActLoading] = useState(false);

  const [editing, setEditing] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ full_name: '', email: '' });
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', fullName: '', role: 'admin' });
  const [newUserMsg, setNewUserMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newUserLoading, setNewUserLoading] = useState(false);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    // Load users
    fetch('/api/admin/users')
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setUsers(data); });
    // Load avatar separately from dedicated endpoint (persists correctly)
    fetch('/api/admin/avatar')
      .then(r => r.ok ? r.json() : { url: null })
      .then(data => { if (data.url) setAvatarUrl(data.url); });
  }, []);

  useEffect(() => {
    if (tab === 'activity') {
      setActLoading(true);
      fetch('/api/activity').then(r => r.ok ? r.json() : { entries: [] }).then(data => {
        const entries = data.entries || (Array.isArray(data) ? data : []);
        setActivity(entries);
        setActLoading(false);
      });
    }
  }, [tab]);

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/avatar', { method: 'POST', body: fd });
    const data = await res.json();
    if (res.ok) setAvatarUrl(data.url);
    setAvatarUploading(false);
  }

  async function saveProfile(userId: string) {
    setProfileSaving(true); setProfileMsg(null);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: profileDraft.full_name, email: profileDraft.email }),
    });
    setProfileSaving(false);
    if (res.ok) {
      const updated = await res.json();
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updated } : u));
      setEditing(false);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } else {
      const err = await res.json();
      setProfileMsg({ type: 'error', text: err.error || 'Failed to update.' });
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault(); setPwMsg(null);
    if (pwForm.newPw.length < 6) { setPwMsg({ type: 'error', text: 'At least 6 characters.' }); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg({ type: 'error', text: 'Passwords do not match.' }); return; }
    setPwLoading(true);
    const res = await fetch('/api/admin/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }) });
    setPwLoading(false);
    const data = await res.json();
    if (res.ok) { setPwMsg({ type: 'success', text: 'Password changed successfully!' }); setPwForm({ current: '', newPw: '', confirm: '' }); }
    else setPwMsg({ type: 'error', text: data.error || 'Failed.' });
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault(); setNewUserMsg(null); setNewUserLoading(true);
    const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser) });
    setNewUserLoading(false);
    const data = await res.json();
    if (res.ok) { setUsers(prev => [...prev, data]); setNewUser({ username: '', email: '', password: '', fullName: '', role: 'admin' }); setShowNewUserForm(false); setNewUserMsg({ type: 'success', text: `User "${data.username}" created.` }); }
    else setNewUserMsg({ type: 'error', text: data.error || 'Failed.' });
  }

  async function deactivateUser(userId: string, username: string) {
    if (!confirm(`Deactivate "${username}"?`)) return;
    setDeleting(userId);
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
    if (res.ok) setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: false } : u));
    setDeleting(null);
  }

  const inp: React.CSSProperties = { width: '100%', padding: '0.68rem 0.95rem', border: '1.5px solid var(--mist)', borderRadius: 7, fontSize: '0.87rem', fontFamily: 'Barlow, sans-serif', outline: 'none', color: 'var(--ink)', background: 'white', transition: 'border-color 0.2s' };
  const inpRO: React.CSSProperties = { ...inp, background: 'var(--fog)', color: '#6b7280', cursor: 'default' };
  const lbl: React.CSSProperties = { display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.4rem' };
  const msgBox = (m: { type: string; text: string }): React.CSSProperties => ({
    background: m.type === 'success' ? 'rgba(22,163,74,0.08)' : '#fef2f2',
    border: `1px solid ${m.type === 'success' ? 'rgba(22,163,74,0.25)' : '#fecaca'}`,
    color: m.type === 'success' ? '#16a34a' : '#dc2626',
    padding: '0.72rem 1rem', borderRadius: 7, fontSize: '0.84rem', marginBottom: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
  });

  const me = users[0];

  return (
    <div>
      <style>{`
        .tab-btn{transition:all 0.18s;border:1.5px solid var(--mist);background:white;color:var(--ink);}
        .tab-btn:hover{background:var(--fog)!important;}
        .tab-btn.active{background:var(--ink)!important;color:white!important;border-color:var(--ink)!important;}
        .inp-f:focus{border-color:var(--cobalt)!important;box-shadow:0 0 0 3px rgba(28,95,168,0.08);}
        .save-btn:hover{background:var(--gold-lt)!important;}
        .user-row:hover{background:var(--fog)!important;}
        .user-row{transition:background 0.15s;}
        .avatar-wrap:hover .avatar-overlay{opacity:1!important;}
        @media(max-width:900px){
          .profile-grid{grid-template-columns:1fr!important;}
          .form-two{grid-template-columns:1fr!important;}
          .users-table th:nth-child(3),.users-table td:nth-child(3),.users-table th:nth-child(4),.users-table td:nth-child(4){display:none;}
        }
      `}</style>

      <div style={{ marginBottom: '1.8rem' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.3rem' }}>Settings</div>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '2rem', color: 'var(--ink)', margin: 0 }}>Profile & Users</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'profile', label: 'My Profile', icon: '👤' },
          { key: 'password', label: 'Change Password', icon: '🔒' },
          { key: 'users', label: 'Manage Users', icon: '👥' },
          { key: 'activity', label: 'Activity Log', icon: '📋' },
        ].map(t => (
          <button key={t.key} className={`tab-btn${tab === t.key ? ' active' : ''}`}
            onClick={() => setTab(t.key as typeof tab)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.05rem', borderRadius: 7, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.83rem', letterSpacing: '0.5px', cursor: 'pointer' }}>
            <span style={{ fontSize: '0.8rem' }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {tab === 'profile' && (
        <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.4rem', alignItems: 'start' }}>
          {/* Left card */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--mist)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(8,14,26,0.07)' }}>
            <div style={{ height: 72, background: 'linear-gradient(135deg, var(--ink), var(--steel))', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '18px 18px' }} />
            </div>
            <div style={{ padding: '0 1.4rem 1.4rem', marginTop: -30 }}>
              {/* Avatar with upload */}
              <div className="avatar-wrap" style={{ position: 'relative', display: 'inline-block', marginBottom: '0.85rem', cursor: 'pointer' }} onClick={() => avatarRef.current?.click()}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cobalt), var(--gold-dim))', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
                  {avatarUrl
                    ? <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: 'white' }}>{me?.full_name?.[0]?.toUpperCase() || 'A'}</span>}
                </div>
                <div className="avatar-overlay" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
                  {avatarUploading ? <span style={{ fontSize: '0.65rem', color: 'white', fontFamily: 'DM Mono, monospace' }}>...</span> : <span style={{ fontSize: '0.85rem' }}>📷</span>}
                </div>
                <input ref={avatarRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadAvatar} style={{ display: 'none' }} />
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.52rem', color: 'var(--slate)', marginBottom: '0.7rem', letterSpacing: '1px' }}>Click avatar to change</div>

              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--ink)' }}>{me?.full_name || 'Administrator'}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.54rem', letterSpacing: '2px', color: 'var(--gold)', textTransform: 'uppercase', marginTop: '2px', marginBottom: '0.85rem' }}>{me?.role || 'superadmin'}</div>

              {[
                { icon: '✉', val: me?.email || '' },
                { icon: '🏢', val: 'Flowman Engineers' },
                { icon: '📍', val: 'Vadodara, Gujarat' },
              ].map(r => (
                <div key={r.icon} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.38rem' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '1px' }}>{r.icon}</span>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.4 }}>{r.val}</span>
                </div>
              ))}
            </div>

            {/* Account info */}
            <div style={{ borderTop: '1px solid var(--mist)', padding: '1rem 1.4rem' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.54rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: '0.8rem' }}>Account Info</div>
              {[
                { label: 'Account Type', val: 'Administrator' },
                { label: 'Username', val: me?.username || 'admin' },
                { label: 'Session', val: 'Active' },
                { label: 'Last Login', val: me?.last_login ? new Date(me.last_login).toLocaleDateString() : 'Today' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.42rem 0', borderBottom: '1px solid var(--fog)' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '1px', color: 'var(--slate)', textTransform: 'uppercase' }}>{row.label}</span>
                  <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink)' }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--mist)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(8,14,26,0.07)' }}>
            <div style={{ padding: '1.3rem 1.5rem', borderBottom: '1px solid var(--mist)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink)' }}>Profile Information</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', letterSpacing: '1.5px', color: 'var(--slate)', textTransform: 'uppercase', marginTop: '1px' }}>Manage your account details</div>
              </div>
              {!editing && (
                <button onClick={() => { setProfileDraft({ full_name: me?.full_name || '', email: me?.email || '' }); setEditing(true); setProfileMsg(null); }}
                  style={{ padding: '0.42rem 1rem', borderRadius: 7, border: '1.5px solid var(--cobalt)', background: 'white', color: 'var(--cobalt)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                  ✎ Edit
                </button>
              )}
            </div>
            <div style={{ padding: '1.5rem' }}>
              {profileMsg && <div style={msgBox(profileMsg)}>{profileMsg.type === 'success' ? '✓' : '⚠'} {profileMsg.text}</div>}
              <div className="form-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { key: 'full_name', label: 'Full Name', draft: 'full_name' as const },
                  { key: 'email', label: 'Email Address', draft: 'email' as const },
                ].map(f => (
                  <div key={f.key}>
                    <label style={lbl}>{f.label}</label>
                    <input className="inp-f" readOnly={!editing}
                      value={editing ? profileDraft[f.draft] : (me?.[f.key as keyof AdminUser] as string || '')}
                      onChange={e => setProfileDraft(d => ({ ...d, [f.draft]: e.target.value }))}
                      style={editing ? inp : inpRO}
                      onFocus={e => { if (editing) e.target.style.borderColor = 'var(--cobalt)'; }}
                      onBlur={e => e.target.style.borderColor = 'var(--mist)'} />
                  </div>
                ))}
                {[
                  { label: 'Username', val: me?.username || 'admin' },
                  { label: 'Role', val: me?.role || 'superadmin' },
                  { label: 'Account Created', val: me?.created_at ? new Date(me.created_at).toLocaleDateString() : '—' },
                  { label: 'Last Login', val: me?.last_login ? new Date(me.last_login).toLocaleString() : 'First login' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={lbl}>{f.label}</label>
                    <input readOnly value={f.val} style={inpRO} />
                  </div>
                ))}
              </div>
              {editing && (
                <div style={{ marginTop: '1.3rem', paddingTop: '1.1rem', borderTop: '1px solid var(--mist)', display: 'flex', gap: '0.65rem' }}>
                  <button className="save-btn" onClick={() => me && saveProfile(me.id)} disabled={profileSaving}
                    style={{ padding: '0.68rem 1.7rem', background: 'var(--gold)', color: 'var(--ink)', border: 'none', borderRadius: 7, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', transition: 'background 0.18s' }}>
                    {profileSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button onClick={() => { setEditing(false); setProfileMsg(null); }}
                    style={{ padding: '0.68rem 1.3rem', background: 'var(--fog)', color: 'var(--slate)', border: '1.5px solid var(--mist)', borderRadius: 7, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
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
        <div style={{ maxWidth: 500, background: 'white', borderRadius: 14, border: '1px solid var(--mist)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(8,14,26,0.07)' }}>
          <div style={{ padding: '1.3rem 1.5rem', borderBottom: '1px solid var(--mist)' }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink)' }}>Change Password</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', letterSpacing: '1.5px', color: 'var(--slate)', textTransform: 'uppercase', marginTop: '1px' }}>Update your admin password</div>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {pwMsg && <div style={msgBox(pwMsg)}>{pwMsg.type === 'success' ? '✓' : '⚠'} {pwMsg.text}</div>}
            <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              {[
                { key: 'current', label: 'Current Password', ph: 'Enter current password' },
                { key: 'newPw', label: 'New Password', ph: 'Minimum 6 characters' },
                { key: 'confirm', label: 'Confirm New Password', ph: 'Repeat new password' },
              ].map(f => (
                <div key={f.key}>
                  <label style={lbl}>{f.label}</label>
                  <input className="inp-f" type="password" required placeholder={f.ph}
                    value={pwForm[f.key as keyof typeof pwForm]}
                    onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={inp}
                    onFocus={e => (e.target.style.borderColor = 'var(--cobalt)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--mist)')} />
                </div>
              ))}
              <button type="submit" disabled={pwLoading}
                style={{ padding: '0.72rem 2rem', background: pwLoading ? '#d1d5db' : 'var(--gold)', color: 'var(--ink)', border: 'none', borderRadius: 7, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '0.88rem', cursor: pwLoading ? 'not-allowed' : 'pointer', marginTop: '0.3rem', alignSelf: 'flex-start' }}>
                {pwLoading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
            <div style={{ marginTop: '1.4rem', padding: '0.9rem 1rem', background: 'var(--fog)', borderRadius: 8, border: '1px solid var(--mist)' }}>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink)', marginBottom: '0.45rem' }}>Password Tips</div>
              {['At least 6 characters', 'Mix letters, numbers & symbols', 'Avoid personal information'].map(tip => (
                <div key={tip} style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', marginBottom: '0.22rem' }}>
                  <span style={{ color: 'var(--gold)', fontSize: '0.58rem' }}>▸</span>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── USERS TAB ── */}
      {tab === 'users' && (
        <div>
          {newUserMsg && <div style={{ ...msgBox(newUserMsg), marginBottom: '1.2rem' }}>{newUserMsg.type === 'success' ? '✓' : '⚠'} {newUserMsg.text}</div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink)' }}>Admin Users</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', letterSpacing: '1.5px', color: 'var(--slate)', textTransform: 'uppercase' }}>{users.length} user{users.length !== 1 ? 's' : ''}</div>
            </div>
            <button onClick={() => setShowNewUserForm(!showNewUserForm)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.58rem 1.15rem', background: 'var(--gold)', color: 'var(--ink)', border: 'none', borderRadius: 7, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.83rem', cursor: 'pointer' }}>
              {showNewUserForm ? '✕ Cancel' : '+ Add User'}
            </button>
          </div>

          {showNewUserForm && (
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--mist)', padding: '1.4rem', marginBottom: '1.1rem', boxShadow: '0 2px 10px rgba(8,14,26,0.06)' }}>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', marginBottom: '1.1rem', borderBottom: '2px solid var(--gold)', paddingBottom: '0.4rem', display: 'inline-block' }}>New Admin User</div>
              <form onSubmit={createUser}>
                <div className="form-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem', marginBottom: '0.9rem' }}>
                  {[
                    { key: 'username', label: 'Username *', ph: 'e.g. john_doe', type: 'text' },
                    { key: 'email', label: 'Email *', ph: 'user@example.com', type: 'text' },
                    { key: 'fullName', label: 'Full Name', ph: 'Full name', type: 'text' },
                    { key: 'password', label: 'Password *', ph: 'Min. 6 characters', type: 'password' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={lbl}>{f.label}</label>
                      <input className="inp-f" type={f.type} placeholder={f.ph} required={f.key !== 'fullName'}
                        value={newUser[f.key as keyof typeof newUser]}
                        onChange={e => setNewUser(u => ({ ...u, [f.key]: e.target.value }))}
                        style={inp}
                        onFocus={e => (e.target.style.borderColor = 'var(--cobalt)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--mist)')} />
                    </div>
                  ))}
                  <div>
                    <label style={lbl}>Role</label>
                    <select value={newUser.role} onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))} style={{ ...inp, background: 'white' }}>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={newUserLoading}
                  style={{ padding: '0.62rem 1.7rem', background: newUserLoading ? '#d1d5db' : 'var(--gold)', color: 'var(--ink)', border: 'none', borderRadius: 7, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '0.85rem', cursor: newUserLoading ? 'not-allowed' : 'pointer' }}>
                  {newUserLoading ? 'Creating…' : 'Create User'}
                </button>
              </form>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--mist)', overflow: 'auto', boxShadow: '0 2px 10px rgba(8,14,26,0.06)' }}>
            <table className="users-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr style={{ background: 'var(--ink)' }}>
                  {['User', 'Role', 'Status', 'Last Login', 'Created', 'Actions'].map((h, i) => (
                    <th key={h} style={{ padding: '0.82rem 1rem', textAlign: i === 5 ? 'right' : 'left', fontFamily: 'DM Mono, monospace', fontWeight: 500, fontSize: '0.54rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--slate)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} className="user-row" style={{ borderBottom: i < users.length - 1 ? '1px solid var(--fog)' : 'none' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cobalt), var(--gold-dim))', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                          {u.avatar_url ? <img src={u.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '0.82rem', color: 'white' }}>{u.username[0].toUpperCase()}</span>}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)', whiteSpace: 'nowrap' }}>{u.full_name || u.username}</div>
                          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: 'var(--slate)', marginTop: '1px' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ background: u.role === 'superadmin' ? 'rgba(201,136,42,0.1)' : 'rgba(28,95,168,0.08)', color: u.role === 'superadmin' ? 'var(--gold)' : 'var(--cobalt)', border: `1px solid ${u.role === 'superadmin' ? 'rgba(201,136,42,0.25)' : 'rgba(28,95,168,0.2)'}`, padding: '2px 8px', borderRadius: 3, fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: u.is_active ? '#16a34a' : '#dc2626', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: u.is_active ? '#16a34a' : '#dc2626' }}>{u.is_active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'DM Mono, monospace', fontSize: '0.63rem', color: 'var(--slate)', whiteSpace: 'nowrap' }}>{u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}</td>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'DM Mono, monospace', fontSize: '0.63rem', color: 'var(--slate)', whiteSpace: 'nowrap' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      {u.is_active
                        ? <button onClick={() => deactivateUser(u.id, u.username)} disabled={deleting === u.id} style={{ padding: '0.28rem 0.75rem', fontSize: '0.7rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, color: '#dc2626', border: '1px solid #fecaca', borderRadius: 5, cursor: 'pointer', background: '#fef2f2', whiteSpace: 'nowrap' }}>{deleting === u.id ? '…' : 'Deactivate'}</button>
                        : <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: '#dc2626' }}>Inactive</span>}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate)', fontFamily: 'Barlow Condensed, sans-serif' }}>No users found. Run supabase-users.sql first.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ACTIVITY LOG TAB ── */}
      {tab === 'activity' && (
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--mist)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(8,14,26,0.07)' }}>
          <div style={{ padding: '1.3rem 1.5rem', borderBottom: '1px solid var(--mist)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink)' }}>Activity Log</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', letterSpacing: '1.5px', color: 'var(--slate)', textTransform: 'uppercase', marginTop: '1px' }}>Real-time admin actions from Supabase</div>
            </div>
            <button onClick={() => { setActLoading(true); fetch('/api/activity').then(r => r.json()).then(d => { setActivity(d); setActLoading(false); }); }}
              style={{ padding: '0.42rem 0.9rem', border: '1.5px solid var(--mist)', borderRadius: 6, background: 'var(--fog)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', color: 'var(--ink)' }}>
              ↻ Refresh
            </button>
          </div>
          {actLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', letterSpacing: '1px', color: 'var(--slate)' }}>LOADING…</div>
          ) : activity.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--slate)' }}>
              <div style={{ fontSize: '2rem', opacity: 0.25, marginBottom: '0.6rem' }}>📋</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1rem' }}>No activity recorded yet.</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'var(--mist)', marginTop: '0.4rem' }}>Actions will appear here after the admin_activity_log table is created.</div>
            </div>
          ) : (
            activity.map((item, i) => {
              const icon = ACTION_ICONS[item.entity_type] || ACTION_ICONS.default;
              const timeAgo = (() => {
                const diff = Date.now() - new Date(item.created_at).getTime();
                const m = Math.floor(diff / 60000);
                const h = Math.floor(m / 60);
                const d = Math.floor(h / 24);
                return d > 0 ? `${d}d ago` : h > 0 ? `${h}h ago` : m > 0 ? `${m}m ago` : 'Just now';
              })();
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.95rem 1.5rem', borderBottom: i < activity.length - 1 ? '1px solid var(--fog)' : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--fog)', border: '1px solid var(--mist)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.92rem', color: 'var(--ink)' }}>{item.action}</div>
                    {item.entity_name && <div style={{ fontSize: '0.78rem', color: 'var(--slate)', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.entity_name}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--slate)', letterSpacing: '0.5px' }}>{timeAgo}</span>
                    {i === 0 && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a' }} />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}