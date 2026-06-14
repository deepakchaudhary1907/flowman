// app/(public)/about/page.tsx
// THEME: Electric Blue (#4BB6E8) + Charcoal (#1e2229) — matches Flowman Engineers logo

import Link from 'next/link';
const W = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' };

export default function AboutPage() {
  return (
    <div>
      <style>{`
        :root {
          --brand:      #4bb6e8;
          --brand-dk:   #2a9fd6;
          --brand-lt:   #7ecef0;
          --brand-pale: rgba(75,182,232,0.10);
          --cobalt:     #1e8fc0;
          --ink:        #1e2229;
          --fog:        #f4f6f8;
          --mist:       #dde2e8;
          --slate:      #8a9baa;
        }
        .btn { display: inline-block; text-decoration: none; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 0.875rem; letter-spacing: 1px; text-transform: uppercase; padding: 0.72rem 1.55rem; border-radius: 3px; transition: all 0.22s; cursor: pointer; line-height: 1; }
        .btn-primary { background: var(--brand); color: #0d1a24; border: 2px solid var(--brand); }
        .btn-primary:hover { background: var(--brand-dk); border-color: var(--brand-dk); color: white; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(75,182,232,0.35); }
        @media (max-width: 900px) {
          .about-two { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .vm-two { grid-template-columns: 1fr !important; }
          .mkt-two { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
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
            <span style={{ color: 'var(--brand)' }}>About Us</span>
          </div>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', color: 'white', letterSpacing: '-0.02em', marginBottom: '0.4rem', position: 'relative' }}>About Flowman Engineers</h1>
          <p style={{ color: 'var(--slate)', fontSize: '0.93rem', fontWeight: 300, position: 'relative' }}>7 years of engineering excellence in Process Control Instrumentation.</p>
        </div>
      </div>

      {/* ── STORY ── */}
      <section style={{ padding: '60px 0' }}>
        <div style={W}>
          <div className="about-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: '0.45rem' }}>Our Story</div>
              <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', color: 'var(--ink)', marginBottom: '0.75rem' }}>Who We Are</h2>
              <div style={{ width: 34, height: 3, background: 'linear-gradient(90deg, var(--brand), var(--brand-lt))', borderRadius: 2, marginBottom: '1.2rem' }} />
              <p style={{ lineHeight: 1.8, color: '#555', fontSize: '0.92rem', marginBottom: '0.8rem' }}>
                <strong style={{ color: 'var(--ink)' }}>Flowman Engineers</strong> is one of the Leading Manufacturer, Service Provider and Exporters of Process Control Instrumentation, Pipe Fittings Accessories and FRP Grating with <strong>7 Years of Expertise</strong> in the field of Instrumentation.
              </p>
              <p style={{ lineHeight: 1.8, color: '#555', fontSize: '0.92rem', marginBottom: '0.8rem' }}>
                Based in Gujarat, we manufacture level, flow and process control instruments exported across India — Gujarat, Maharashtra, Madhya Pradesh, Telangana, Tamil Nadu — and internationally to Malaysia, UAE, Singapore, Indonesia, Thailand, France, Poland, Nepal, Bangladesh, Spain and more.
              </p>
              <p style={{ lineHeight: 1.8, color: '#555', fontSize: '0.92rem' }}>
                All products are manufactured under <strong style={{ color: 'var(--ink)' }}>Flowman Engineers</strong> and we are internationally recognized under <strong>ISO 9001:2015</strong>.
              </p>
            </div>

            {/* STAT CARDS */}
            <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              {[
                { num: '7+',  label: 'Years Experience',    dark: true  },
                { num: '15+', label: 'Export Countries',    dark: false },
                { num: '500+',label: 'Happy Clients',       dark: false },
                { num: 'ISO', label: '9001:2015 Certified', dark: true  },
              ].map(item => (
                <div key={item.label} style={{
                  background: item.dark ? 'var(--ink)' : 'var(--fog)',
                  border: item.dark ? '1px solid rgba(75,182,232,0.18)' : '1px solid var(--mist)',
                  borderRadius: 10,
                  padding: '1.4rem',
                  textAlign: 'center',
                }}>
                  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: item.dark ? 'var(--brand)' : 'var(--cobalt)', lineHeight: 1, marginBottom: '0.3rem' }}>{item.num}</div>
                  <div style={{ fontSize: '0.76rem', color: item.dark ? 'var(--slate)' : '#6b7280', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VISION & MISSION ── */}
      <section style={{ padding: '52px 0', background: 'var(--fog)' }}>
        <div style={W}>
          <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: '0.4rem' }}>Guiding Principles</div>
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', color: 'var(--ink)', margin: 0 }}>Vision & Mission</h2>
          </div>

          <div className="vm-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            {/* VISION */}
            <div style={{ background: 'white', border: '1px solid var(--mist)', borderRadius: 10, padding: '1.8rem', borderTop: '4px solid var(--brand)', boxShadow: '0 1px 6px rgba(30,34,41,0.05)' }}>
              <div style={{ display: 'inline-block', background: 'rgba(75,182,232,0.10)', color: 'var(--cobalt)', border: '1px solid rgba(75,182,232,0.25)', padding: '2px 9px', borderRadius: 2, fontSize: '0.58rem', fontWeight: 700, letterSpacing: '2px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', marginBottom: '0.85rem' }}>Vision</div>
              <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.45rem', color: 'var(--ink)', marginBottom: '0.7rem' }}>Customer-Centric Excellence</h3>
              <p style={{ lineHeight: 1.78, color: '#555', fontSize: '0.9rem' }}>Our vision is to be earth's most customer-centric company; to build a place where people can come to find and discover anything they might want to buy.</p>
            </div>

            {/* MISSION */}
            <div style={{ background: 'var(--ink)', border: '1px solid rgba(75,182,232,0.15)', borderRadius: 10, padding: '1.8rem', borderTop: '4px solid var(--brand)' }}>
              <div style={{ display: 'inline-block', background: 'rgba(75,182,232,0.12)', color: 'var(--brand)', border: '1px solid rgba(75,182,232,0.28)', padding: '2px 9px', borderRadius: 2, fontSize: '0.58rem', fontWeight: 700, letterSpacing: '2px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', marginBottom: '0.85rem' }}>Mission</div>
              <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.45rem', color: 'white', marginBottom: '0.7rem' }}>Satisfaction & Retention</h3>
              <p style={{ lineHeight: 1.78, color: 'var(--slate)', fontSize: '0.9rem' }}>Customer Satisfaction and Customer Retention — every product we manufacture and every service we deliver is aimed at building lasting relationships with clients globally.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARKETS ── */}
      <section style={{ padding: '60px 0' }}>
        <div style={W}>
          <div className="mkt-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            {/* Industries */}
            <div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: '0.45rem' }}>Market Segments</div>
              <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', color: 'var(--ink)', marginBottom: '1.2rem' }}>Industries We Serve</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {['Chemical', 'Petrochemical', 'Fertilizers', 'Water Treatment', 'Refineries', 'Oil and Gas', 'Air Treatment', 'Pharmaceuticals', 'Power Plants', 'Food Processing', 'Paper & Pulp', 'Mining'].map(m => (
                  <div key={m} style={{ background: 'var(--fog)', border: '1px solid var(--mist)', color: 'var(--ink)', padding: '0.36rem 0.85rem', borderRadius: 4, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, fontSize: '0.86rem' }}>{m}</div>
                ))}
              </div>
            </div>

            {/* Exports */}
            <div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: '0.45rem' }}>Global Presence</div>
              <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', color: 'var(--ink)', marginBottom: '1.2rem' }}>Export Destinations</h2>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.76rem', letterSpacing: '2px', color: 'var(--cobalt)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>India — Major States</div>
              <p style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1rem' }}>Gujarat, Maharashtra, Madhya Pradesh, Telangana, Tamil Nadu and more.</p>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.76rem', letterSpacing: '2px', color: 'var(--cobalt)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>International</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {['🇲🇾 Malaysia', '🇦🇪 UAE', '🇸🇬 Singapore', '🇮🇩 Indonesia', '🇹🇭 Thailand', '🇫🇷 France', '🇵🇱 Poland', '🇳🇵 Nepal', '🇧🇩 Bangladesh', '🇪🇸 Spain'].map(c => (
                  <div key={c} style={{ background: 'var(--ink)', color: 'white', padding: '0.28rem 0.78rem', borderRadius: 20, fontSize: '0.78rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600 }}>{c}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '60px 0', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(75,182,232,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ ...W, textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', color: 'white', marginBottom: '0.8rem' }}>Partner with Flowman Engineers</h2>
          <p style={{ color: 'var(--slate)', marginBottom: '1.7rem', fontWeight: 300, lineHeight: 1.72, fontSize: '0.93rem' }}>Reach out for export or domestic enquiries. Our team is ready to help.</p>
          <Link href="/contact" className="btn btn-primary">Contact Us Today →</Link>
        </div>
      </section>
    </div>
  );
}