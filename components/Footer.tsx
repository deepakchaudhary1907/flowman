'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--slate)' }}>
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--cobalt), var(--gold), var(--cobalt))' }} />
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',
          backgroundSize: '40px 40px' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 24px 2rem', position: 'relative' }}>
          {/* Footer grid — 4 columns on desktop, stacked on mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
            {/* Brand */}
            <div style={{ gridColumn: 'span 1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1rem' }}>
                {/* <div style={{ width: 30, height: 30, borderRadius: 5, background: 'linear-gradient(135deg, var(--cobalt), var(--gold-dim))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 7v10l8 5 8-5V7L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                </div> */}
                <div>
                  <img src="/flowman-logo.svg" alt="Flowman Engineers" style={{ height: 160, width: 'auto', filter: 'brightness(0) invert(1)', display: 'block', marginBottom: '2px' }} />
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.5rem', color: 'var(--gold)', letterSpacing: '2px' }}>ISO 9001:2015 CERTIFIED</div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.72, color: 'var(--slate)', marginBottom: '1.2rem' }}>
                Leading manufacturer and exporter of Process Control Instrumentation, Pipe Fittings and FRP Grating. 7 years of engineering excellence.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '1px' }}>◈</span>
                  <span>C/71, Swami Residence Soc, B/h Airforce, Makarpura, Vadodara-390010, Gujarat.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--gold)', flexShrink: 0 }}>◈</span>
                  <a href="mailto:flowmanengg@gmail.com" style={{ color: 'var(--slate)', textDecoration: 'none' }}>flowmanengg@gmail.com</a>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--gold)', flexShrink: 0 }}>◈</span>
                  <a href="tel:+919725944834" style={{ color: 'var(--gold)', textDecoration: 'none', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem' }}>+91-9725944834</a>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', letterSpacing: '3px', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem' }}>Navigation</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {[['/', 'Home'], ['/products', 'Products'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([href, label]) => (
                  <Link key={href} href={href} style={{ color: 'var(--slate)', textDecoration: 'none', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.18s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--slate)')}>
                    <span style={{ color: 'var(--gold-dim)', fontSize: '0.6rem' }}>▸</span>{label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', letterSpacing: '3px', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem' }}>Products</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {['Rotameters', 'Level Gauges', 'Float Level Switches', 'Pipe Fittings', 'FRP Grating', 'Process Control Instruments'].map(p => (
                  <Link key={p} href="/products" style={{ color: 'var(--slate)', textDecoration: 'none', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.18s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--slate)')}>
                    <span style={{ color: 'var(--gold-dim)', fontSize: '0.6rem' }}>▸</span>{p}
                  </Link>
                ))}
              </div>
            </div>

            {/* Industries */}
            <div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', letterSpacing: '3px', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem' }}>Industries</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.2rem' }}>
                {['Chemical', 'Petrochemical', 'Fertilizers', 'Water Treatment', 'Oil & Gas', 'Refineries', 'Pharma', 'Power Plants'].map(i => (
                  <span key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--slate)', padding: '2px 8px', borderRadius: 3, fontSize: '0.75rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600 }}>{i}</span>
                ))}
              </div>
              <div style={{ padding: '0.9rem', background: 'rgba(201,136,42,0.07)', border: '1px solid rgba(201,136,42,0.18)', borderRadius: 6 }}>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '1px', color: 'var(--gold)', marginBottom: '0.2rem' }}>DEEPAK CHAUDHARY</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--slate)' }}>Sales – Export & Domestic</div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#3a4a5c', fontFamily: 'DM Mono, monospace' }}>© {new Date().getFullYear()} Flowman Engineers. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {['Chemical', 'Oil & Gas', 'Pharma', 'Water'].map(m => (
                <span key={m} style={{ fontSize: '0.7rem', color: '#3a4a5c', fontFamily: 'DM Mono, monospace' }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}