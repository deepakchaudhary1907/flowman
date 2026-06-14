// app/(public)/contact/page.tsx
// THEME: Electric Blue (#4BB6E8) + Charcoal (#1e2229) — matches Flowman Engineers logo

'use client';
import { useState } from 'react';
import Link from 'next/link';
const W = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' };

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const lbl: React.CSSProperties = {
    display: 'block',
    fontFamily: 'DM Mono, monospace',
    fontSize: '0.56rem',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: '#6b7280',
    marginBottom: '0.42rem',
  };
  const inp: React.CSSProperties = {
    width: '100%',
    padding: '0.68rem 0.95rem',
    border: '1.5px solid #dde2e8',
    borderRadius: 6,
    fontSize: '0.87rem',
    fontFamily: 'Barlow, sans-serif',
    outline: 'none',
    color: '#1e2229',
    background: 'white',
    transition: 'border-color 0.2s',
  };

  return (
    <div>
      <style>{`
        :root {
          --brand:    #4bb6e8;
          --brand-dk: #2a9fd6;
          --cobalt:   #1e8fc0;
          --ink:      #1e2229;
          --fog:      #f4f6f8;
          --mist:     #dde2e8;
          --slate:    #8a9baa;
        }
        .btn { display: inline-block; text-decoration: none; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 0.875rem; letter-spacing: 1px; text-transform: uppercase; padding: 0.72rem 1.55rem; border-radius: 3px; transition: all 0.22s; cursor: pointer; line-height: 1; border: none; }
        .btn-primary { background: var(--brand); color: #0d1a24; border: 2px solid var(--brand); }
        .btn-primary:hover { background: var(--brand-dk); border-color: var(--brand-dk); color: white; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(75,182,232,0.35); }
        .btn-steel { background: var(--fog); color: var(--ink); border: 1.5px solid var(--mist); }
        .btn-steel:hover { background: var(--mist); }
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-two { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: 'var(--ink)', padding: '52px 0 36px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(75,182,232,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(75,182,232,0.04) 1px,transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 350, height: 350, background: 'radial-gradient(circle, rgba(75,182,232,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={W}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.66rem', color: 'var(--slate)', marginBottom: '0.55rem', letterSpacing: '0.5px', position: 'relative' }}>
            <Link href="/" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 0.4rem', opacity: 0.35 }}>›</span>
            <span style={{ color: 'var(--brand)' }}>Contact</span>
          </div>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', color: 'white', letterSpacing: '-0.02em', marginBottom: '0.4rem', position: 'relative' }}>Get In Touch</h1>
          <p style={{ color: 'var(--slate)', fontSize: '0.93rem', fontWeight: 300, position: 'relative' }}>Product enquiries, technical questions or export quotes — we respond within 24 hours.</p>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ ...W, paddingTop: '3.5rem', paddingBottom: '4rem' }}>
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3.5rem' }}>

          {/* ── INFO COLUMN ── */}
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: '0.45rem' }}>Our Details</div>
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.55rem', color: 'var(--ink)', marginBottom: '0.55rem' }}>Contact Information</h2>
            <div style={{ width: 34, height: 3, background: 'linear-gradient(90deg, var(--brand), #7ecef0)', borderRadius: 2, marginBottom: '1.4rem' }} />

            {/* Contact items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '1.6rem' }}>
              {[
                { icon: '◈', label: 'Address', val: 'C/71, Swami Residence Soc, B/h Airforce, Makarpura, Vadodara-390010, Gujarat, India.' },
                { icon: '◈', label: 'Email', val: 'flowmanengg@gmail.com', href: 'mailto:flowmanengg@gmail.com' },
                { icon: '◈', label: 'Phone', val: '+91-9725944834', href: 'tel:+919725944834', mono: true },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(75,182,232,0.08)', border: '1px solid rgba(75,182,232,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--brand)', fontSize: '0.78rem' }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.54rem', letterSpacing: '2px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.18rem' }}>{item.label}</div>
                    {item.href
                      ? <a href={item.href} style={{ color: 'var(--ink)', textDecoration: 'none', fontSize: item.mono ? '0.82rem' : '0.87rem', fontFamily: item.mono ? 'DM Mono, monospace' : 'Barlow, sans-serif', lineHeight: 1.62 }}>{item.val}</a>
                      : <div style={{ color: 'var(--ink)', fontSize: '0.87rem', lineHeight: 1.65 }}>{item.val}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Sales card — dark with brand blue accents */}
            <div style={{ background: 'var(--ink)', borderRadius: 10, padding: '1.3rem', border: '1px solid rgba(75,182,232,0.15)', borderLeft: '3px solid var(--brand)' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.54rem', letterSpacing: '3px', color: 'var(--brand)', marginBottom: '0.6rem' }}>SALES CONTACT</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'white', marginBottom: '0.18rem' }}>Deepak Chaudhary</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--slate)', marginBottom: '0.8rem' }}>Sales – Export & Domestic</div>
              <a href="tel:+919725944834" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', color: 'var(--brand)', textDecoration: 'none', display: 'block', marginBottom: '0.28rem' }}>+91-9725944834</a>
              <a href="mailto:flowmanengg@gmail.com" style={{ fontSize: '0.78rem', color: 'var(--slate)', textDecoration: 'none' }}>flowmanengg@gmail.com</a>
            </div>

            {/* Hours */}
            <div style={{ marginTop: '0.9rem', padding: '0.85rem 1rem', background: 'var(--fog)', border: '1px solid var(--mist)', borderRadius: 7 }}>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.83rem', color: 'var(--ink)', marginBottom: '0.18rem' }}>Business Hours</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>Mon – Sat: 9:00 AM – 6:00 PM IST</div>
            </div>
          </div>

          {/* ── ENQUIRY FORM ── */}
          <div style={{ background: 'white', border: '1px solid var(--mist)', borderRadius: 12, padding: '2.2rem', boxShadow: '0 2px 18px rgba(30,34,41,0.06)' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: '0.45rem' }}>Enquiry Form</div>
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.55rem', color: 'var(--ink)', marginBottom: '1.4rem' }}>Send an Enquiry</h2>

            {sent ? (
              /* ── SUCCESS STATE ── */
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(75,182,232,0.10)', border: '2px solid rgba(75,182,232,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem', margin: '0 auto 1.1rem' }}>✓</div>
                <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: 'var(--ink)', marginBottom: '0.45rem' }}>Message Sent!</h3>
                <p style={{ color: '#6b7280', marginBottom: '1.6rem', lineHeight: 1.7, fontSize: '0.9rem' }}>Thank you. Our team will respond within 24 business hours.</p>
                <button onClick={() => setSent(false)} className="btn btn-steel" style={{ fontSize: '0.82rem' }}>Send Another</button>
              </div>
            ) : (
              /* ── FORM ── */
              <form onSubmit={async e => {
                e.preventDefault();
                const res = await fetch('/api/enquiries', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(form),
                });
                if (res.ok) setSent(true);
              }}>
                {/* Name / Email / Phone / Company */}
                <div className="form-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  {[
                    { key: 'name',    label: 'Full Name',              req: true,  ph: 'Your full name'       },
                    { key: 'email',   label: 'Email Address',          req: true,  ph: 'your@email.com'       },
                    { key: 'phone',   label: 'Phone Number',           req: false, ph: '+91 XXXXX XXXXX'      },
                    { key: 'company', label: 'Company / Organisation', req: false, ph: 'Company name'         },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={lbl}>{f.label}{f.req && <span style={{ color: 'var(--brand)', marginLeft: 2 }}>*</span>}</label>
                      <input
                        type="text"
                        placeholder={f.ph}
                        required={f.req}
                        value={form[f.key as keyof typeof form]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        style={inp}
                        onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
                        onBlur={e => (e.target.style.borderColor = '#dde2e8')}
                      />
                    </div>
                  ))}
                </div>

                {/* Subject */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={lbl}>Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    style={{ ...inp, background: 'white' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
                    onBlur={e => (e.target.style.borderColor = '#dde2e8')}
                  >
                    <option value="">Select a subject...</option>
                    <option>Product Enquiry</option>
                    <option>Request a Quote</option>
                    <option>Export / International Order</option>
                    <option>Technical Support</option>
                    <option>General Enquiry</option>
                  </select>
                </div>

                {/* Message */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={lbl}>Message <span style={{ color: 'var(--brand)' }}>*</span></label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your requirement, products needed, quantities, or any questions..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    style={{ ...inp, resize: 'vertical' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
                    onBlur={e => (e.target.style.borderColor = '#dde2e8')}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary">Send Enquiry →</button>
                  <div style={{ fontSize: '0.73rem', color: '#9ca3af', fontFamily: 'DM Mono, monospace' }}>We respond within 24 hours</div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}