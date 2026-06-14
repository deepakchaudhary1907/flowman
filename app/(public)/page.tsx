// app/(public)/page.tsx
// Fonts & CSS vars come from globals.css (Barlow Condensed / Barlow / DM Mono)
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/db';

export const dynamic = 'force-dynamic';

/* typed wrapper so TS doesn't complain */
const W: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' };

export default async function HomePage() {
  const allProds   = await getProducts();
  const products   = allProds.slice(0, 6);
  const categories = await getCategories();

  return (
    <div>
      <style>{`
        /* ── Hero ── */
        .hero-section { padding: clamp(56px,7vw,96px) 0 clamp(48px,6vw,80px); }
        .hero-grid    { display: grid; grid-template-columns: 1fr 1fr; gap: 3.5rem; align-items: center; }
        .hero-right   { display: flex; flex-direction: column; gap: 10px; }

        /* ── Category cards — 4 cols, NO overlap ── */
        /*
          Using auto-fit + minmax so cards can never collapse into
          each other. The minimum 220px means 4 cols on wide screens,
          2 on medium, 1 on small. This eliminates the overlap bug.
        */
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
        }
        .cat-card {
          background: #fff;
          border: 1px solid #dde2e8;
          border-radius: 12px;
          padding: 1.5rem 1.3rem 1.4rem;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 0;
          /* fixed height so all cards in a row are same height */
          min-height: 180px;
          transition: transform .22s, box-shadow .22s, border-color .22s;
          box-shadow: 0 1px 4px rgba(30,34,41,0.05);
          /* CRITICAL: no position:absolute children, no negative margins */
        }
        .cat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 32px rgba(30,34,41,0.13);
          border-color: rgba(75,182,232,0.45);
        }
        /* blue top accent bar — uses pseudo element, zero height impact */
        .cat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #4bb6e8, #7ecef0);
          border-radius: 12px 12px 0 0;
        }
        .cat-icon {
          width: 38px; height: 38px;
          background: rgba(75,182,232,0.08);
          border: 1px solid rgba(75,182,232,0.16);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.05rem; color: #1e8fc0;
          margin-bottom: 0.9rem; flex-shrink: 0;
        }
        .cat-name {
          font-family: 'Barlow Condensed','Arial Narrow',Arial,sans-serif;
          font-weight: 700; font-size: 1.05rem; color: #1e2229;
          line-height: 1.2; margin-bottom: 0.3rem;
        }
        .cat-desc {
          font-family: 'Barlow',Arial,sans-serif;
          font-size: 0.8rem; color: #6b7280; line-height: 1.55;
          flex: 1; margin-bottom: 0.9rem;
        }
        .cat-cta {
          font-family: 'Barlow Condensed','Arial Narrow',Arial,sans-serif;
          font-weight: 700; font-size: 0.72rem;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: #4bb6e8; margin-top: auto;
        }

        /* ── Product grid ── */
        .prod-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        /* ── Why grid ── */
        .why-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.1rem;
        }

        /* ── Hero stats ── */
        .hero-stats {
          display: flex; gap: 2.5rem;
          margin-top: 2.25rem; padding-top: 1.5rem;
          border-top: 1px solid rgba(75,182,232,0.15);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .hero-grid  { grid-template-columns: 1fr; gap: 2.5rem; }
          .hero-right { display: none; }
        }
        @media (max-width: 600px) {
          .hero-stats { gap: 1.5rem; }
          .cat-grid { grid-template-columns: 1fr 1fr; gap: 1rem; }
        }
        @media (max-width: 420px) {
          .cat-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="hero-section" style={{ background: '#1e2229', position: 'relative', overflow: 'hidden' }}>
        {/* grid texture */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(75,182,232,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(75,182,232,0.04) 1px,transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />
        {/* blue glow top-right */}
        <div aria-hidden style={{ position: 'absolute', top: '-10%', right: '-5%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(75,182,232,0.16) 0%,transparent 70%)', pointerEvents: 'none' }} />
        {/* faint glow bottom-left */}
        <div aria-hidden style={{ position: 'absolute', bottom: '-15%', left: '-5%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle,rgba(75,182,232,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={W}>
          <div className="hero-grid" style={{ position: 'relative' }}>

            {/* LEFT */}
            <div>
              {/* eyebrow badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(75,182,232,0.10)', border: '1px solid rgba(75,182,232,0.26)', borderRadius: 3, padding: '5px 14px', marginBottom: '1.3rem' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4bb6e8', flexShrink: 0, display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#4bb6e8' }}>
                  ISO 9001:2015 — Gujarat, India
                </span>
              </div>

              <h1 style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 'clamp(2.8rem,5vw,4.8rem)', lineHeight: 0.93, letterSpacing: '-0.02em', color: '#fff', marginBottom: '1.3rem' }}>
                PRECISION<br />
                <span style={{ color: '#4bb6e8' }}>PROCESS</span><br />
                INSTRUMENTS
              </h1>

              <p style={{ fontFamily: 'var(--f-body)', fontWeight: 300, fontSize: '0.97rem', color: '#8a9baa', lineHeight: 1.78, marginBottom: '1.9rem', maxWidth: 430 }}>
                Manufacturer and exporter of Rotameters, Level Gauges, Pipe Fittings and FRP Grating. Trusted across 15+ countries in Chemical, Oil &amp; Gas and Pharma industries.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/products" className="btn btn-primary">Explore Products →</Link>
                <Link href="/contact"  className="btn btn-outline" >Request Quote</Link>
              </div>

              {/* stats row */}
              <div className="hero-stats">
                {[['7+','Years of Experience'],['15+','Export Countries'],['500+','Happy Clients']].map(([n,l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: '2rem', color: '#4bb6e8', lineHeight: 1 }}>{n}</div>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: '0.56rem', color: '#8a9baa', letterSpacing: '2px', marginTop: 5, textTransform: 'uppercase', lineHeight: 1.4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — spec panel */}
            <div className="hero-right">
              {/* ISO cert card */}
              <div style={{ background: 'rgba(75,182,232,0.07)', border: '1px solid rgba(75,182,232,0.18)', borderLeft: '3px solid #4bb6e8', borderRadius: 10, padding: '1.3rem 1.5rem' }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '0.58rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#4bb6e8', marginBottom: '0.4rem' }}>Certification</div>
                <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: '1.7rem', color: '#fff', lineHeight: 1 }}>ISO 9001:2015</div>
                <div style={{ fontFamily: 'var(--f-body)', fontSize: '0.82rem', color: '#8a9baa', marginTop: 6 }}>Internationally recognized quality management</div>
              </div>

              {/* spec grid — 2x2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { l:'Accuracy',    v:'±2% FSD',       s:'Flow measurement' },
                  { l:'Pressure',    v:'100 Bar',        s:'Max rating'       },
                  { l:'Temperature', v:'400°C',          s:'Max operating'    },
                  { l:'Materials',   v:'SS / PP / PTFE', s:'Construction'     },
                ].map(sp => (
                  <div key={sp.l} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(75,182,232,0.10)', borderRadius: 8, padding: '0.95rem 1rem' }}>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: '0.54rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#8a9baa', marginBottom: 5 }}>{sp.l}</div>
                    <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>{sp.v}</div>
                    <div style={{ fontFamily: 'var(--f-body)', fontSize: '0.72rem', color: 'rgba(75,182,232,0.5)', marginTop: 2 }}>{sp.s}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CATEGORIES
          Cards use auto-fit minmax — never overlap
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(48px,6vw,72px) 0', background: '#f4f6f8' }}>
        <div style={W}>
          {/* section head */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#4bb6e8', display: 'block', marginBottom: '0.4rem' }}>What We Make</span>
              <h2 style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 'clamp(1.5rem,3.5vw,2.1rem)', color: '#1e2229', margin: 0 }}>Product Categories</h2>
            </div>
            <Link href="/products" style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#1e8fc0', textDecoration: 'none' }}>
              View All →
            </Link>
          </div>

          {/* THE FIX: auto-fit minmax grid — cards NEVER overlap */}
          <div className="cat-grid">
            {categories.map((cat, i) => {
              const icons = ['⚙','◫','◉','▦','◈','⊕','⬡','⟁'];
              return (
                <Link key={cat.id} href={`/products?category=${cat.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="cat-card">
                    <div className="cat-icon">{icons[i % icons.length]}</div>
                    <div className="cat-name">{cat.name}</div>
                    {(cat as any).description && (
                      <div className="cat-desc">{(cat as any).description}</div>
                    )}
                    <div className="cat-cta">Explore →</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(48px,6vw,72px) 0', background: '#fff' }}>
        <div style={W}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#4bb6e8', display: 'block', marginBottom: '0.4rem' }}>Catalogue</span>
              <h2 style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 'clamp(1.5rem,3.5vw,2.1rem)', color: '#1e2229', margin: 0 }}>Featured Products</h2>
            </div>
            <Link href="/products" className="btn btn-steel" style={{ padding: '0.48rem 1.1rem', fontSize: '0.8rem' }}>View All</Link>
          </div>

          <div className="prod-grid">
            {products.map(product => {
              const cat = categories.find(c => c.id === product.categoryId);
              return (
                <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                  <div className="prod-card">
                    <div className="prod-img-wrap">
                      <div className="prod-img-texture" />
                      {product.image
                        ? <img src={product.image} alt={product.title} />
                        : <div className="prod-img-placeholder">⚙</div>}
                      {cat && <div className="prod-img-badge">{cat.name}</div>}
                    </div>
                    <div className="prod-body">
                      <div className="prod-title">{product.title}</div>
                      <div className="prod-desc">{product.shortDescription}</div>
                      <div className="prod-cta">View Details →</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(48px,6vw,72px) 0', background: '#1e2229', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(rgba(75,182,232,1) 1px,transparent 1px),linear-gradient(90deg,rgba(75,182,232,1) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={W}>
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#4bb6e8', display: 'block', marginBottom: '0.4rem' }}>Our Edge</span>
            <h2 style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 'clamp(1.5rem,3.5vw,2.1rem)', color: '#fff', margin: 0 }}>Why Flowman Engineers?</h2>
            <div style={{ width: 38, height: 3, background: 'linear-gradient(90deg,#4bb6e8,#7ecef0)', borderRadius: 2, margin: '0.8rem auto 0' }} />
          </div>

          <div className="why-grid">
            {[
              { n:'01', t:'ISO Certified Quality',  d:'ISO 9001:2015 certified ensuring consistent quality across every product line.' },
              { n:'02', t:'Global Export Reach',    d:'Active in 15+ countries — UAE, Singapore, Malaysia, France, Poland, Bangladesh.' },
              { n:'03', t:'7 Years Expertise',      d:'Deep domain knowledge in Chemical, Oil & Gas, Fertilizer and Pharma sectors.' },
              { n:'04', t:'Precision Engineering',  d:'±2% FSD accuracy. Built for 100 bar pressure and 400°C operating temperature.' },
              { n:'05', t:'Custom Built Solutions', d:'Flanged, screwed, TC joint. SS, PP, PTFE — tailored to your exact specification.' },
              { n:'06', t:'Dedicated Sales Team',   d:'Direct access to Deepak Chaudhary for export & domestic enquiries.' },
            ].map(item => (
              <div key={item.n} className="why-card">
                <div className="why-num">{item.n}</div>
                <h3>{item.t}</h3>
                <p>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          INDUSTRIES
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(40px,5vw,60px) 0', background: '#f4f6f8' }}>
        <div style={W}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#4bb6e8', display: 'block', marginBottom: '0.4rem' }}>Market Segments</span>
            <h2 style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#1e2229', margin: 0 }}>Industries We Serve</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', justifyContent: 'center' }}>
            {['Chemical','Petrochemical','Fertilizers','Water Treatment','Refineries','Oil and Gas','Air Treatment','Pharmaceuticals','Power Plants','Food Processing','Paper & Pulp','Mining'].map(m => (
              <div key={m} className="ind-pill">{m}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(56px,7vw,88px) 0', background: '#1e2229', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 65% 50%,rgba(75,182,232,0.10) 0%,transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ ...W, textAlign: 'center', position: 'relative' }}>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#4bb6e8', display: 'block', marginBottom: '0.65rem' }}>Partner With Us</span>
          <h2 style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 'clamp(1.7rem,4vw,2.9rem)', color: '#fff', marginBottom: '0.9rem', letterSpacing: '-0.01em' }}>
            Ready to Start a Project?
          </h2>
          <p style={{ fontFamily: 'var(--f-body)', fontWeight: 300, color: '#8a9baa', fontSize: '0.97rem', marginBottom: '1.9rem', lineHeight: 1.75, maxWidth: 520, margin: '0 auto 1.9rem' }}>
            Reach out for export or domestic enquiries. Our team responds within 24 hours.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact"  className="btn btn-primary">Contact Us Now →</Link>
            <Link href="/products" className="btn btn-outline" >Browse Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
}