'use client';
// components/Footer.tsx
// Site footer — charcoal background, electric-blue accents (matches logo)
import Link from 'next/link';

const W: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' };

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: '#1e2229', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .ftr-link {
          font-family: 'Barlow', Arial, sans-serif;
          font-size: 0.86rem;
          color: #8a9baa;
          text-decoration: none;
          transition: color .15s;
          display: inline-block;
        }
        .ftr-link:hover { color: #4bb6e8; }

        .ftr-heading {
          font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif;
          font-weight: 700; font-size: 0.95rem;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: #fff; margin-bottom: 1.1rem;
        }

        .ftr-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
          gap: 2.5rem;
        }

        .ftr-social {
          width: 36px; height: 36px; border-radius: 8px;
          background: rgba(75,182,232,0.08);
          border: 1px solid rgba(75,182,232,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #4bb6e8; text-decoration: none; font-size: 0.95rem;
          transition: background .18s, border-color .18s, color .18s, transform .18s;
        }
        .ftr-social:hover {
          background: #4bb6e8; color: #071520; border-color: #4bb6e8;
          transform: translateY(-2px);
        }

        .ftr-bottom {
          border-top: 1px solid rgba(75,182,232,0.10);
          padding: 1.25rem 0;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 0.75rem;
        }
        .ftr-bottom-text {
          font-family: 'DM Mono', monospace;
          font-size: 0.66rem; letter-spacing: 1px;
          color: #8a9baa;
        }
        .ftr-bottom-links {
          display: flex; gap: 1.25rem; flex-wrap: wrap;
        }

        @media (max-width: 900px) {
          .ftr-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
        @media (max-width: 560px) {
          .ftr-grid { grid-template-columns: 1fr; gap: 1.75rem; }
          .ftr-bottom { flex-direction: column; align-items: flex-start; text-align: left; }
        }
      `}</style>

      {/* subtle grid texture */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(75,182,232,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(75,182,232,0.03) 1px,transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />
      {/* glow */}
      <div aria-hidden style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(75,182,232,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ ...W, position: 'relative', padding: 'clamp(48px,6vw,64px) 24px 0' }}>
        <div className="ftr-grid">

          {/* Brand column */}
          <div>
            {/* Logo + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.1rem' }}>
              <div style={{
                background: '#fff', borderRadius: 8, padding: '6px 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img
                  src="/flowman-logo.svg"
                  alt="Flowman Engineers"
                  style={{ height: 36, width: 'auto', maxWidth: 200, objectFit: 'contain', display: 'block' }}
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (!img.src.includes('.png')) img.src = '/flowman-logo.png';
                    else img.style.display = 'none';
                  }}
                />
              </div>
            </div>

            <p style={{ fontFamily: "'Barlow',Arial,sans-serif", fontSize: '0.86rem', color: '#8a9baa', lineHeight: 1.75, maxWidth: 320, marginBottom: '1.25rem' }}>
              ISO 9001:2015 certified manufacturer and exporter of Rotameters, Level Gauges, Pipe Fittings and FRP Grating — trusted across 15+ countries.
            </p>

            {/* Social */}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <a href="https://wa.me/919725944834" target="_blank" rel="noopener noreferrer" className="ftr-social" aria-label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.091.535 4.06 1.474 5.778L0 24l6.395-1.457A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.518-5.163-1.418l-.368-.216-3.796.865.867-3.718-.237-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              </a>
              <a href="mailto:flowmanengg@gmail.com" className="ftr-social" aria-label="Email">✉</a>
              <a href="tel:+919725944834" className="ftr-social" aria-label="Phone">☏</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="ftr-heading">Quick Links</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <Link href="/" className="ftr-link">Home</Link>
              <Link href="/products" className="ftr-link">Products</Link>
              <Link href="/about" className="ftr-link">About Us</Link>
              <Link href="/contact" className="ftr-link">Contact</Link>
            </div>
          </div>

          {/* Industries */}
          <div>
            <div className="ftr-heading">Industries</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Chemical', 'Oil & Gas', 'Pharmaceuticals', 'Power Plants', 'Water Treatment', 'Fertilizers'].map(i => (
                <span key={i} className="ftr-link" style={{ cursor: 'default' }}>{i}</span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="ftr-heading">Get In Touch</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', letterSpacing: '2px', color: '#4bb6e8', textTransform: 'uppercase', marginBottom: 4 }}>Address</div>
                <div style={{ fontFamily: "'Barlow',Arial,sans-serif", fontSize: '0.85rem', color: '#8a9baa', lineHeight: 1.65 }}>
                  C/71, Swami Residence Soc, B/h Airforce, Makarpura, Vadodara-390010, Gujarat, India.
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', letterSpacing: '2px', color: '#4bb6e8', textTransform: 'uppercase', marginBottom: 4 }}>Email</div>
                <a href="mailto:flowmanengg@gmail.com" className="ftr-link">flowmanengg@gmail.com</a>
              </div>
              <div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', letterSpacing: '2px', color: '#4bb6e8', textTransform: 'uppercase', marginBottom: 4 }}>Phone</div>
                <a href="tel:+919725944834" className="ftr-link" style={{ fontFamily: "'DM Mono',monospace" }}>+91-9725944834</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ftr-bottom">
          <div className="ftr-bottom-text">
            © {year} FLOWMAN ENGINEERS · ALL RIGHTS RESERVED
          </div>
          <div className="ftr-bottom-links">
            <span className="ftr-link" style={{ fontSize: '0.78rem' }}>ISO 9001:2015 Certified</span>
            <Link href="/admin/login" className="ftr-link" style={{ fontSize: '0.78rem' }}>Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}